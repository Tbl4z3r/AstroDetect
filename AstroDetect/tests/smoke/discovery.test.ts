import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

it('descubre fallos de los tres agentes y deja e2e a Playwright', () => {
  const temporaryParent = resolve(tmpdir());
  const fixtureRoot = resolve(mkdtempSync(join(temporaryParent, 'astrodetect-discovery-')));
  if (dirname(fixtureRoot) !== temporaryParent || !basename(fixtureRoot).startsWith('astrodetect-discovery-'))
    throw new Error('Directorio temporal inesperado');
  try {
    const vitestUrl = pathToFileURL(resolve('node_modules/vitest/dist/index.js')).href;
    const probes = {
      'smoke/probe.test.ts': 'import { it, expect } from "' + vitestUrl + '"; it("smoke probe", () => expect(1).toBe(1));',
      'simulation/probe.test.ts': 'throw new Error("simulation-probe-must-fail");',
      'analysis/probe.test.ts': 'throw new Error("analysis-probe-must-fail");',
      'ui/probe.test.tsx': 'throw new Error("ui-probe-must-fail");',
      'e2e/probe.test.ts': 'throw new Error("e2e-probe-must-stay-excluded");',
    };
    for (const [file, source] of Object.entries(probes)) {
      const destination = join(fixtureRoot, 'tests', file);
      mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, source);
    }
    const result = spawnSync(process.execPath, [
      resolve('node_modules/vitest/vitest.mjs'), 'run', '--root', fixtureRoot,
      '--config', resolve('vitest.config.ts'), '--reporter', 'verbose',
    ], { encoding: 'utf8', timeout: 15000 });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(1);
    const output = result.stdout + result.stderr;
    for (const agent of ['simulation', 'analysis', 'ui']) expect(output).toContain(agent + '-probe-must-fail');
    expect(output).not.toContain('e2e-probe-must-stay-excluded');
    expect(output).toContain('smoke probe');
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}, 20000);
