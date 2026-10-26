import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { parse } from 'parse5';
import postcss from 'postcss';
export function commentsIn(source, extension) {
  const found = [];
  if (['.ts', '.tsx', '.js', '.jsx', '.mjs'].includes(extension)) {
    const kind = ['.tsx', '.jsx'].includes(extension) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const tree = ts.createSourceFile('source' + extension, source, ts.ScriptTarget.Latest, true, kind);
    const ranges = new Set();
    function visit(node) {
      for (const range of [...(ts.getLeadingCommentRanges(source, node.pos) ?? []), ...(ts.getTrailingCommentRanges(source, node.end) ?? [])]) ranges.add(range.pos);
      for (const child of node.getChildren(tree)) visit(child);
    }
    visit(tree);
    for (const token of ranges) found.push(token);
  } else if (extension === '.html') {
    function visit(node) {
      if (node.nodeName === '#comment') found.push(node.nodeName);
      for (const child of node.childNodes ?? []) visit(child);
      if (node.content) visit(node.content);
    }
    visit(parse(source));
  } else if (extension === '.css') {
    postcss.parse(source).walkComments(node => found.push(node.source.start.offset));
  }
  return found;
}
function scan(directory) {
  let failures = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'coverage', 'playwright-report', 'test-results'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) failures += scan(file);
    else if (commentsIn(fs.readFileSync(file, 'utf8'), path.extname(file)).length) {
      console.error('Comentarios de código: ' + file);
      failures++;
    }
  }
  return failures;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/check-source-comments.mjs')) {
  const failures = scan('.');
  if (failures) process.exitCode = 1;
  else console.log('Sin comentarios de código en JS, TS, JSX, TSX, HTML y CSS.');
}
