#!/usr/bin/env node
// Bump ProxyPal app version across package.json, tauri.conf.json, Cargo.toml, Cargo.lock.
//
// Usage:
//   node scripts/bump-version.mjs              # patch +1 (0.4.46 → 0.4.47)
//   node scripts/bump-version.mjs 0.5.0        # set exact version
//   node scripts/bump-version.mjs --print      # print current version only
//
// Prints the new version to stdout (last line is the version for shell capture).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const packagePath = join(root, "package.json");
const tauriConfPath = join(root, "src-tauri", "tauri.conf.json");
const cargoTomlPath = join(root, "src-tauri", "Cargo.toml");
const cargoLockPath = join(root, "src-tauri", "Cargo.lock");

function readCurrentVersion() {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  return pkg.version;
}

function parseSemver(v) {
  const m = String(v).trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)(.*)?$/);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    rest: m[4] || "",
    toString() {
      return `${this.major}.${this.minor}.${this.patch}${this.rest}`;
    },
  };
}

function bumpPatch(version) {
  const s = parseSemver(version);
  s.patch += 1;
  s.rest = "";
  return s.toString();
}

function setPackageJson(version) {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  pkg.version = version;
  writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
}

function setTauriConf(version) {
  const conf = JSON.parse(readFileSync(tauriConfPath, "utf8"));
  conf.version = version;
  writeFileSync(tauriConfPath, JSON.stringify(conf, null, 2) + "\n");
}

function setCargoToml(version) {
  let toml = readFileSync(cargoTomlPath, "utf8");
  // Only the package version near the top of Cargo.toml
  const replaced = toml.replace(
    /^(\[package\][\s\S]*?^version\s*=\s*")[^"]+(")/m,
    `$1${version}$2`,
  );
  if (replaced === toml) {
    throw new Error("Failed to update version in src-tauri/Cargo.toml");
  }
  writeFileSync(cargoTomlPath, replaced);
}

function setCargoLock(version) {
  if (!existsSync(cargoLockPath)) return;
  let lock = readFileSync(cargoLockPath, "utf8");
  // Update only the workspace package entry named "proxypal"
  const pattern =
    /(\[\[package\]\]\nname = "proxypal"\nversion = ")[^"]+(")/;
  if (!pattern.test(lock)) {
    console.warn("Warning: proxypal package entry not found in Cargo.lock");
    return;
  }
  lock = lock.replace(pattern, `$1${version}$2`);
  writeFileSync(cargoLockPath, lock);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--print") || args.includes("-p")) {
    process.stdout.write(readCurrentVersion() + "\n");
    return;
  }

  const current = readCurrentVersion();
  const explicit = args.find((a) => !a.startsWith("-"));
  const next = explicit ? parseSemver(explicit).toString() : bumpPatch(current);

  if (next === current) {
    console.error(`Version already ${current}`);
    process.exit(1);
  }

  setPackageJson(next);
  setTauriConf(next);
  setCargoToml(next);
  setCargoLock(next);

  console.error(`Bumped app version: ${current} → ${next}`);
  // Last line for $(node scripts/bump-version.mjs)
  process.stdout.write(next + "\n");
}

main();
