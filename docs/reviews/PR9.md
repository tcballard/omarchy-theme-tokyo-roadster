# PR #9 review — 20 October 2026

Compared base `3124da34f9d82b3806d488f8e0efe8b1ae2b5878` with Jeff's candidate `efd384745e896652a9e394c054cec74cdb35f0ef`. His original commit is retained in the review branch; attribution is in CREDITS.md. No original red Roadster repository, local theme installation or desktop setting was modified.

## Findings and corrections

- Restored the approved wall-ride PNG byte-for-byte, SHA-256 `f9c2b4c8728d761c805f0e6d796f1f7554db5a3266552fd8b613222d6d113413`, and restored `unchanged_approved_default: true`. Nine upscale candidates remain.
- Corrected references to native source artwork: the contributor used existing exports downsampled to recorded native dimensions. Per-image `upscale_input_sha256` now identifies those actual source exports and their commit; existing original-source hashes retain their historical meaning.
- Kept the historical square Starlight method record intact and recorded this processing separately against its widescreen export.
- Distinguished the NCNN Vulkan executable's MIT licence from the main Real-ESRGAN project's BSD-3-Clause licence. No model weights or executable are bundled. Those software licences establish no artwork redistribution rights.
- The recorded executable version `v0.2.5.0` is contributor-reported and unverified. Upstream NCNN releases inspected on 20 October list `v0.2.0` and `v0.1.3.2`; do not guess a substitute. Asked Jeff for the exact source/package, version evidence, invocation/options and model hashes on PR #9. Reproduction remains pending.
- Final Lanczos fit is up to 1.539x for hover, exceeding the PR description's approximately 1.4x maximum.

## Independent portable evidence

All twenty PNGs (ten base and ten contributor candidate exports) fully decoded with Sharp/libvips. Dimensions, RGB8 layout, unchanged filenames and all candidate checksums/byte counts match their records. All PNG chunks passed CRC verification. Candidate text metadata contained only creation/modification timestamps; no EXIF, GPS or creator-machine paths were found. No symlinks, executable payloads, workflow, palette or shell changes were introduced by Jeff's candidate.

The original five Node tests and `sha256sum -c SHA256SUMS` passed independently on Jeff's commit. The corrected branch adds regression checks for approved-default bytes, PNG CRCs/inflated scanline integrity, dimensions, checksums and generation-record consistency. These do not establish live acceptance.

Per-file measurements of the original candidate are in [PR9-INTEGRITY.json](PR9-INTEGRITY.json). Mean values there are encoded RGB channel means from 512-pixel fit thumbnails, not linear-light luminance or a perceptual colour metric. Decode timing is a single container sample and is not an XPS benchmark.

## Visual review

Compared all ten full frames at matching thumbnail scale. No broad framing, silhouette or composition changes were apparent. At reduced desktop scale the differences are relatively subtle. Identical-coordinate 600 × 400 crops at actual 100% export scale showed:

| Export | Crop origin x,y | Observation |
| --- | --- | --- |
| Hover | 2000,2600 | Cleaner panel boundary and less mottling; smoother, less textured surface. |
| Diffuser | 3150,2300 | Crisper plate edge and letter strokes; local stroke contours are reconstructed. |
| Poster | 2900,780 | Cleaner ROADSTER strokes and edge transitions. |
| Starlight body | 4800,2800 | Sharper panel lines; some fine texture smoothed. |
| Starlight sky | 3800,500 | Blocky stars become smoother isolated points; faint star/cloud texture is suppressed or reinterpreted. |
| Ramp structure | 6100,1100 | Cleaner rails and support edges with altered fine edge contours. |

This is a visible aesthetic improvement in edge clarity and compression-like mottling at 100%, with smoothing/reconstruction trade-offs. It is not recovery of verified original detail, exact scene preservation or proof that every wallpaper improves on a physical desktop. The approved default was not replaced on aesthetic grounds.

## Size and installation cost

| PNG collection | Bytes | Decimal MB | MiB |
| --- | ---: | ---: | ---: |
| Base | 166041729 | 166.04 | 158.35 |
| Original PR candidate | 314094894 | 314.09 | 299.54 |
| Corrected, original default retained | 297624110 | 297.62 | 283.84 |

The corrected collection adds 131582381 bytes, about 79.2%. Approximate payload-only transfer time at 20 Mbit/s rises from 66 to 119 seconds; real Git transfer/compression and network conditions vary. Full-history clones retain superseded PNG blobs and can transfer/store substantially more than the checked-out tree. Each current PNG is below the registry's 50 MiB image-byte cap; the collection exceeds its 25 MiB soft warning threshold. Dimensions are unchanged, so decoded pixel storage is unchanged (up to 178642944 bytes for the hover image's RGB pixels), despite compressed PNG growth. No claim about actual shell memory or latency is made.

There is also a concrete registry size blocker: GitHub reports the contributor fork at **495854 KiB (484.2 MiB)**. The current validator's `repoFindings` checks GitHub repository size, including history, against a **400 MiB hard limit**, separately from its checked-out-tree limit. Restoring the default does not remove the superseded blobs from history. Do not describe the candidate as registry-size compliant because the current PNG tree fits below 400 MiB. Recheck the canonical repository's metadata before any submission; reducing the downloadable tree alone may not resolve historical size. No history rewrite or destructive cleanup was attempted.

## Outstanding acceptance

- Executable/model provenance and exact reproduction details from Jeff remain pending.
- Repository history size exceeds the current registry limit in Jeff's fork. Resolve a distribution/history strategy and recheck canonical repository metadata before claiming registry readiness.
- Existing artwork provenance remains unresolved: CREDITS.md still lacks the original creator, source and redistribution permission/licence. Do not infer rights from Tom supplying an image or from either software licence. Media provenance confirmation and a real desktop preview remain prerequisites for registry submission under docs/DEVELOPMENT.md.
- GitHub's original CI run `39248350654` was `action_required`, with no jobs executed; this is not a test failure or pass. Workflow safety inspection found SHA-pinned actions, `contents: read`, no secrets and no `pull_request_target`; its actual commands run the repository tests and checksums. The review branch is in the maintainer repository so its ordinary PR CI can run without granting a fork additional trust. Record the resulting run before merge.
- Physical XPS tests NOT RUN: record candidate commit, installed Omarchy version and display scale; preserve previous theme/background; check default selection, all ten wallpapers and wraparound, Starlight crop, switch away/back and selection retention, shell restart/login, scaling, shell surfaces and representative app reloads. Restore previous state after temporary testing. `docs/ACCEPTANCE.json` remains honestly `not-run`.
- Rust scaffold helper NOT RUN: Cargo is unavailable in this environment. Upstream registry constants were inspected; a full registry validator run was NOT RUN. This PR is neither a release nor a registry submission.

Sources inspected: [NCNN licence](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan/blob/master/LICENSE), [NCNN releases](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan/releases), [main project licence](https://github.com/xinntao/Real-ESRGAN/blob/master/LICENSE), [registry constants](https://github.com/omacom/omarchy-theme-registry/blob/master/packages/schema/src/constants.ts).
