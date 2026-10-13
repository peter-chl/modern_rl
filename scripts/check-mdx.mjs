// Compiles lecture MDX with the same remark/rehype plugins as the site and
// fails on MDX syntax errors or KaTeX parse errors. Faster than a full build.
// Usage: node scripts/check-mdx.mjs src/content/*.mdx
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { readFileSync } from "node:fs";
let bad = 0;
for (const f of process.argv.slice(2)) {
  const warnings = [];
  try {
    await compile(readFileSync(f, "utf8"), {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: (code, msg) => { warnings.push(msg); return "ignore"; }, throwOnError: true }]],
    });
    console.log(warnings.length ? `WARN ${f}: ${warnings.join("; ")}` : `OK   ${f}`);
  } catch (e) { bad++; console.log(`FAIL ${f}: ${e.message}`); }
}
process.exit(bad ? 1 : 0);
