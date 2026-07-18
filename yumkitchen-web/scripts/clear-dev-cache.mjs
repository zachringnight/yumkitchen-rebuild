#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, rmSync} from 'node:fs';
import {join} from 'node:path';

const devCache = join(process.cwd(), '.next', 'dev');
const devLock = join(devCache, 'lock');
const force = process.argv.includes('--force');
const lockCheck = existsSync(devLock)
  ? spawnSync('lsof', ['-t', '--', devLock], {encoding: 'utf8'})
  : null;
const lockHasOwner = Boolean(lockCheck?.status === 0 && lockCheck.stdout.trim());
const lockOwnershipUnknown = lockCheck?.error?.code === 'ENOENT';

if (!force && existsSync(devLock) && (lockHasOwner || lockOwnershipUnknown)) {
  console.log('Kept the Next.js development cache because a dev-server lock is present.');
  process.exit(0);
}

rmSync(devCache, {recursive: true, force: true});
console.log('Cleared the generated Next.js development cache.');
