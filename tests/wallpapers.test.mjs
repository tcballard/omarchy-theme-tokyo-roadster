import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {root} from '../scripts/template.mjs';

const json=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const generation=json('docs/WALLPAPER-GENERATION.json');
const approved='f9c2b4c8728d761c805f0e6d796f1f7554db5a3266552fd8b613222d6d113413';
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const crcTable=Array.from({length:256},(_,i)=>{for(let k=0;k<8;k++)i=(i&1)?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
const crc=buf=>{let c=0xffffffff;for(const byte of buf)c=crcTable[(c^byte)&255]^(c>>>8);return (c^0xffffffff)>>>0;};

test('approved wall-ride bytes and generation status remain unchanged',()=>{
  const first=generation.images[0];
  assert.equal(first.file,'backgrounds/01-tokyo-wall-ride-8k.png');
  assert.equal(first.unchanged_approved_default,true);
  assert.equal(first.sha256,approved);
  assert.equal(sha(fs.readFileSync(path.join(root,first.file))),approved);
  assert(!generation.upscale.applies_to.includes(first.file));
});

test('wallpaper PNG structure, CRCs, compressed rows and records agree',()=>{
  const sums=new Map(fs.readFileSync(path.join(root,'SHA256SUMS'),'utf8').trim().split('\n').map(line=>{const [hash,file]=line.split(/\s+/);return [file,hash];}));
  assert.deepEqual([...sums.keys()].sort(),generation.images.map(x=>x.file).sort());
  for(const entry of generation.images){
    const buf=fs.readFileSync(path.join(root,entry.file));
    assert.equal(sha(buf),entry.sha256,entry.file);
    assert.equal(sums.get(entry.file),entry.sha256);
    assert.equal(buf.length,entry.bytes);
    assert(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
    let offset=8,header=null,ended=false;const idat=[];
    while(offset<buf.length){
      assert(offset+12<=buf.length);
      const n=buf.readUInt32BE(offset),end=offset+12+n;
      assert(end<=buf.length);
      const kind=buf.toString('ascii',offset+4,offset+8),data=buf.subarray(offset+8,offset+8+n);
      assert.equal(crc(buf.subarray(offset+4,offset+8+n)),buf.readUInt32BE(offset+8+n),entry.file+' '+kind);
      if(!header){assert.equal(kind,'IHDR');assert.equal(n,13);header=data;}
      if(kind==='IDAT')idat.push(data);
      offset=end;
      if(kind==='IEND'){assert.equal(n,0);ended=true;break;}
    }
    assert(ended);assert.equal(offset,buf.length);
    const width=header.readUInt32BE(0),height=header.readUInt32BE(4);
    assert.deepEqual([width,height],entry.export);
    assert.deepEqual([...header.subarray(8)],[8,2,0,0,0]); // RGB8, non-interlaced
    const stride=width*3+1,expected=stride*height;
    const rows=inflateSync(Buffer.concat(idat),{maxOutputLength:expected});
    assert.equal(rows.length,expected);
    for(let row=0;row<height;row++)assert(rows[row*stride]<=4,'Invalid PNG row filter');
  }
});

test('Starlight and per-image upscale provenance agree with export records',()=>{
  const star=json('docs/STARLIGHT-PROCESSING.json'),image=generation.images.find(x=>x.file===star.asset);
  assert.equal(star.export.sha256,image.sha256);
  assert.equal(star.export.bytes,image.bytes);
  assert.deepEqual(star.export.dimensions,image.export);
  assert.equal(star.upscale.input_sha256,image.upscale_input_sha256);
  assert.deepEqual(generation.upscale.applies_to,generation.images.slice(1).map(x=>x.file));
  for(const entry of generation.images.slice(1))assert.match(entry.upscale_input_sha256,/^[a-f0-9]{64}$/);
});
