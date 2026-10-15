import type { MDXComponents } from "mdx/types";
import { Definition, Example, Remark, Result } from "@/components/Env";
import Figure from "@/components/Figure";
import OdeSdeFigure from "@/components/figures/OdeSdeFigure";
import TwoLayerMdpFigure from "@/components/figures/TwoLayerMdpFigure";

const components: MDXComponents = {
  Definition,
  Example,
  Remark,
  Result,
  Figure,
  OdeSdeFigure,
  TwoLayerMdpFigure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
