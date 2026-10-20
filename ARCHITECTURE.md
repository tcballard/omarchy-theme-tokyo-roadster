# Architecture

colors.toml uses Omarchy’s Tokyo Night semantic palette. Four complete shell overrides style bar, controls, menu and launcher with blue accents; other shell and application configurations are generated upstream. Section defaults target Quattro 51bfd1dbaa1b5f790e19623faf2745945d40c796 and must be compared when upgrading. No full shell.toml override, install hook or Lua payload is supplied.

Ten numerically ordered PNG wallpapers live in backgrounds/. The unchanged backgrounds/01-tokyo-wall-ride-8k.png remains the initial default; nine matching colourways complete the cycle. All have an 8192-pixel longest edge. The default retains its original export; the other nine use super-resolution on downsampled copies of the previous exports, without further contextual enhancement passes. SHA256SUMS verifies every wallpaper.

Offline validation and live-testing limits are recorded in docs/VALIDATION.md.
