import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/modern_rl",
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// Plugins are given by name (not imported) so the config stays serializable
// for Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: ["rehype-slug", ["rehype-katex", { strict: false }]],
  },
});

export default withMDX(nextConfig);
