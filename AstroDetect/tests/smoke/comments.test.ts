import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
it('detecta comentarios por lenguaje y permite literales', async () => {
  const moduleUrl = pathToFileURL(process.cwd() + '/scripts/check-source-comments.mjs').href;
  const { commentsIn } = await import(moduleUrl);
  const slash = String.fromCharCode(47);
  const line = slash + slash + ' comentario';
  const block = slash + '* comentario *' + slash;
  for (const extension of ['.ts', '.tsx', '.js', '.mjs']) {
    expect(commentsIn(line, extension).length).toBeGreaterThan(0);
    expect(commentsIn('const x = 1; ' + block, extension).length).toBeGreaterThan(0);
    expect(commentsIn('const url = "https://example.com"; const re = /abc/;', extension)).toEqual([]);
  }
  expect(commentsIn('<main>{' + block + '}</main>', '.tsx').length).toBeGreaterThan(0);
  expect(commentsIn('<!—x—>'.replaceAll('—', '--'), '.html').length).toBeGreaterThan(0);
  expect(commentsIn(block, '.css').length).toBeGreaterThan(0);
  expect(commentsIn('a { background: url("https://example.com"); }', '.css')).toEqual([]);
  expect(readFileSync('index.html', 'utf8')).toContain('lang="es"');
});
