const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

// Execute the actual TypeScript helper and its sanitizer options in an offline DOM.
const source = readFileSync(join(__dirname, '../src/lib/blog-html.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const browser = new JSDOM('');
const purifier = createDOMPurify(browser.window);
function loadSanitizer(window) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window,
    require: (name) => name === 'dompurify' ? purifier : require(name),
  });
  return exports.sanitizeBlogHtml;
}
const sanitize = loadSanitizer(browser.window);

test('does not emit original untrusted HTML during server rendering', () => {
  assert.equal(loadSanitizer(undefined)('<img src=x onerror=alert(1)>'), '');
});

test('removes executable scripts, event handlers, frames and javascript links', () => {
  const clean = sanitize('<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">link</a><iframe srcdoc="<script>alert(1)</script>"></iframe>');
  const body = new JSDOM(clean).window.document.body;
  assert.equal(body.querySelector('script,iframe'), null);
  assert.equal(body.querySelector('img').hasAttribute('onerror'), false);
  assert.equal(body.querySelector('a').hasAttribute('href'), false);
});

test('rejects SVG/MathML payloads and injected forms or styles', () => {
  const clean = sanitize('<svg onload="alert(1)"></svg><math><mtext><img src=x onerror=alert(1)></mtext></math><style>body{display:none}</style><form action="https://example.test"><input name=password><button>Submit</button></form>');
  const body = new JSDOM(clean).window.document.body;
  assert.equal(body.querySelector('svg,math,style,form,input,button'), null);
  for (const element of body.querySelectorAll('*')) {
    assert.equal([...element.attributes].some(attribute => /^on/i.test(attribute.name)), false);
  }
});

test('preserves article formatting, safe links and editor image metadata', () => {
  const clean = sanitize('<h2>Wohnen</h2><p><strong>Details</strong></p><ul><li>Central</li></ul><a href="https://example.test">Info</a><img src="data:image/png;base64,AAAA" style="width:320px" data-blog-editor-image="true">');
  const body = new JSDOM(clean).window.document.body;
  assert.equal(body.querySelector('h2').textContent, 'Wohnen');
  assert.equal(body.querySelector('strong').textContent, 'Details');
  assert.equal(body.querySelector('li').textContent, 'Central');
  assert.equal(body.querySelector('a').getAttribute('href'), 'https://example.test');
  assert.equal(body.querySelector('img').dataset.blogEditorImage, 'true');
  assert.match(body.querySelector('img').getAttribute('style'), /width:\s*320px/);
});
