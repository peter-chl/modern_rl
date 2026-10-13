import type { MDXComponents } from "mdx/types";
import { Definition, Example, Remark, Result } from "@/components/Env";
import Figure from "@/components/Figure";

const components: MDXComponents = {
  Definition,
  Example,
  Remark,
  Result,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
