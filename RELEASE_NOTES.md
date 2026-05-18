# ProxyPal v0.4.35

**Released:** 2026-05-18

## Sidecar Upgrade: CLIProxyAPI v7.0.2 → v7.1.11

This release upgrades the bundled CLIProxyAPI sidecar from **v7.0.2** (built May 10) to **v7.1.11** (released May 18), jumping **22 releases** including a full minor version with 11 patches shipped in the last 48 hours.

### Why this matters

The bundled binary was 8 days stale while upstream shipped an entire minor version (7.1.0 → 7.1.11) containing critical provider integrations, bugfixes, and payload routing improvements. This catches ProxyPal up to the latest stable release.

### What changed in CLIProxyAPI (v7.0.3 → v7.1.11)

**New provider integrations:**

- **xAI (Grok) support** — OAuth2 with PKCE + token persistence (v7.1.0), Grok video model support (v7.1.2), namespace tools + tool normalization (v7.1.5), default missing function tool parameters fix (v7.1.6)
- **Codex client models** exposed via OpenAI API (v7.1.3–4) — ProxyPal's OpenAI-compatible routing gets Codex models for free

**Stability fixes:**

- TCP accept loop deadlock prevention — idle connections no longer block (v7.0.3)
- Sniff deadline clearing before Redis handler entry (v7.0.3)
- Registry model parse panic downgraded to warning (v7.1.7)
- xAI tool param defaults for missing function parameters (v7.1.6)
- Payload rule resolution with dynamic path support (v7.1.7–8)

**Other:**

- Detailed token breakdown in usage tracking (v7.0.3)
- Local management password validation + spoofed IP rejection (v7.1.10)
- New CLI flags: `-xai-login`, `-home-disable-cluster-discovery`
- `-home` flag now supports `redis://` and `rediss://` URL formats

### ProxyPal code changes

- `src-tauri/binaries/cli-proxy-api-aarch64-apple-darwin` — v7.0.2 → v7.1.11 binary
- `src-tauri/Cargo.toml:3` — version 0.4.34 → 0.4.35
- `src-tauri/tauri.conf.json:4` — version 0.4.34 → 0.4.35
- `package.json` — version 0.4.34 → 0.4.35

### Breaking changes check

Zero breakage verified. The v7.1.9 `FormProtocol` → `FromProtocol` rename is a Go internal struct change — ProxyPal never references either symbol. All CLI flags used by ProxyPal (`--config`, `WRITABLE_PATH`) are stable across all 7.1.x.

### Verification

- Binary verified: `CLIProxyAPI Version: 7.1.11, Commit: 66c5d60b, BuiltAt: 2026-05-18T03:02:08Z`
- No code changes required beyond binary replacement and version bump

---

_Full CLIProxyAPI changelog: https://github.com/router-for-me/CLIProxyAPI/releases_
