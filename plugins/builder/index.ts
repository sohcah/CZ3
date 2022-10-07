import glob from "glob";
import { fileURLToPath } from "node:url";
import { PluginMeta } from "../base.js";
import esbuild from "esbuild";
import * as fs from "node:fs";
import { join, relative } from "node:path";
import fetch from "node-fetch";

// @ts-expect-error Fetch is not available in Node
global.fetch = fetch;

const rootPath = fileURLToPath(new URL("..", import.meta.url));
const path = fileURLToPath(new URL("../plugins/**/*.js", import.meta.url));
const actionFiles = glob.sync(path);

const tmpDir = join(rootPath, `tmp-${Date.now()}-${Math.floor(Math.random() * 100000)}`);
fs.mkdirSync(tmpDir);

const plugins: {
  path: string;
  relativePath: string;
  meta: PluginMeta;
  hasAfterLoad: boolean;
  hasBeforeLoad: boolean;
}[] = [];
for (const file of actionFiles) {
  const result = await import(file);
  if ("meta" in result && "name" in result.meta) {
    plugins.push({
      path: file,
      relativePath: relative(tmpDir, file),
      meta: result.meta as PluginMeta,
      hasAfterLoad: "afterLoad" in result,
      hasBeforeLoad: "beforeLoad" in result,
    });
  }
}

const beforeLoad = join(tmpDir, `beforeLoad.js`);
fs.writeFileSync(
  beforeLoad,
  `
const plugins = [];
${plugins
  .filter(i => i.hasBeforeLoad)
  .map(plugin => `import { beforeLoad as ${plugin.meta.id} } from "./${plugin.relativePath}";`)
  .join("\n")}
${plugins
  .filter(i => i.hasBeforeLoad)
  .map(plugin => `plugins.push(${plugin.meta.id});`)
  .join("\n")}
let run = false;
function executeBeforeLoad() {
  if (run) return;
  run = true;
  for (const plugin of plugins) {
    plugin();
  }
}

if(document.head) {
  executeBeforeLoad()
} else {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if(node.tagName === 'HEAD') {
                    executeBeforeLoad();
                    observer.disconnect();
                }
            })
        })
    })
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })
}
`
);

const afterLoad = join(tmpDir, `afterLoad.js`);
fs.writeFileSync(
  afterLoad,
  `
const plugins = [];
${plugins
  .filter(i => i.hasAfterLoad)
  .map(plugin => `import { afterLoad as ${plugin.meta.id} } from "./${plugin.relativePath}";`)
  .join("\n")}
${plugins
  .filter(i => i.hasAfterLoad)
  .map(plugin => `plugins.push(${plugin.meta.id});`)
  .join("\n")}

let run = false;
function executeAfterLoad() {
  if (run) return;
  run = true;
  for (const plugin of plugins) {
    plugin();
  }
}

if(document.readyState === "complete") {
  executeAfterLoad()
} else {
  document.addEventListener("readystatechange", () => {
    if(document.readyState === "complete") executeAfterLoad()
  });
}
`
);

const beforeLoadOutput = `extension/before-load.js`;

esbuild.buildSync({
  format: "iife",
  entryPoints: [beforeLoad],
  bundle: true,
  minify: true,
  outfile: beforeLoadOutput,
});

const afterLoadOutput = `extension/after-load.js`;

esbuild.buildSync({
  format: "iife",
  entryPoints: [afterLoad],
  bundle: true,
  minify: true,
  outfile: afterLoadOutput,
});

fs.rmSync(tmpDir, { recursive: true, force: true });
