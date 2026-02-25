import assert from 'node:assert/strict';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkDirective from 'remark-directive';
import remarkBlackout from './index.js';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkBlackout)
  .use(remarkStringify);

async function run(markdown) {
  const file = await processor.process(markdown);
  return String(file).trim();
}

let passed = 0;
let failed = 0;

async function test(description, fn) {
  try {
    await fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\nremark-blackout tests\n');

// 1. Block directive
await test('block directive wraps content in <spoiler>', async () => {
  const out = await run(':::spoiler\nhidden text\n:::');
  assert.ok(out.includes('<spoiler>hidden text</spoiler>'), `got: ${out}`);
});

// 2. Inline directive
await test('inline directive :spoiler[text]', async () => {
  const out = await run('Read :spoiler[this secret] carefully.');
  assert.ok(out.includes('<spoiler>this secret</spoiler>'), `got: ${out}`);
});

// 3. Leaf directive
await test('leaf directive ::spoiler[text]', async () => {
  const out = await run('::spoiler[leaf secret]');
  assert.ok(out.includes('<spoiler>leaf secret</spoiler>'), `got: ${out}`);
});

// 4. Nested formatting inside block is flattened to plain text
await test('nested bold/italic inside block is extracted as plain text', async () => {
  const out = await run(':::spoiler\n**bold** and _italic_\n:::');
  assert.ok(out.includes('<spoiler>bold and italic</spoiler>'), `got: ${out}`);
});

// 5. Unknown directives are left untouched (not converted to <spoiler>)
await test('unknown directive is not processed', async () => {
  const out = await run(':::note\nsome note\n:::');
  assert.ok(!out.includes('<spoiler>'), `got: ${out}`);
});

// 6. Multiple spoilers in the same document
await test('multiple spoilers in one document', async () => {
  const out = await run(':spoiler[first] and :spoiler[second]');
  const count = (out.match(/<spoiler>/g) || []).length;
  assert.equal(count, 2, `expected 2 <spoiler> tags, got ${count}. Output: ${out}`);
});

// 7. Empty spoiler block
await test('empty spoiler block produces empty <spoiler>', async () => {
  const out = await run(':::spoiler\n:::');
  assert.ok(out.includes('<spoiler></spoiler>'), `got: ${out}`);
});

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);

if (failed > 0) process.exit(1);
