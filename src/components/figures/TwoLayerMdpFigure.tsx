// The two-layer MDP for RL on diffusion / flow action heads: each robot step
// (outer MDP) contains a whole denoising chain (inner MDP) that produces the
// action chunk.

function Sym({
  x,
  y,
  base,
  sub,
  anchor = "middle",
  size = 12,
}: {
  x: number;
  y: number;
  base: string;
  sub?: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} fill="currentColor" fontStyle="italic">
      {base}
      {sub && (
        <tspan dy={3} fontSize={size * 0.72} fontStyle="normal">
          {sub}
        </tspan>
      )}
    </text>
  );
}

function Arrow({ x1, y1, x2, y2, accent = false }: { x1: number; y1: number; x2: number; y2: number; accent?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={accent ? "var(--accent)" : "currentColor"}
      strokeWidth={1.2}
      markerEnd={accent ? "url(#tl-arrow-accent)" : "url(#tl-arrow)"}
    />
  );
}

const OUTER_Y = 62;
const INNER_Y = 214;

function ChainBox({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={OUTER_Y - 17} width={86} height={34} rx={6} fill="var(--accent-soft)" stroke="var(--accent)" />
      <text x={x + 43} y={OUTER_Y - 2} fontSize={10.5} textAnchor="middle" fill="var(--accent)" fontWeight={600}>
        denoising chain
      </text>
      <text x={x + 43} y={OUTER_Y + 11} fontSize={9} textAnchor="middle" fill="var(--muted)">
        T inner steps
      </text>
    </g>
  );
}

function EnvBox({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={OUTER_Y - 15} width={62} height={30} rx={4} fill="none" stroke="currentColor" />
      <text x={x + 31} y={OUTER_Y + 4} fontSize={10.5} textAnchor="middle" fill="currentColor">
        robot
      </text>
    </g>
  );
}

function StateNode({ x, sub }: { x: number; sub: string }) {
  return (
    <g>
      <circle cx={x} cy={OUTER_Y} r={15} fill="var(--background)" stroke="currentColor" />
      <Sym x={x - 1} y={OUTER_Y + 3} base="o" sub={sub} size={12} />
    </g>
  );
}

function InnerNode({ x, sub, highlight = false }: { x: number; sub: string; highlight?: boolean }) {
  return (
    <g>
      <circle
        cx={x}
        cy={INNER_Y}
        r={17}
        fill={highlight ? "var(--accent-soft)" : "var(--background)"}
        stroke={highlight ? "var(--accent)" : "currentColor"}
      />
      <Sym x={x - 2} y={INNER_Y + 3} base="x" sub={sub} size={12} />
    </g>
  );
}

export default function TwoLayerMdpFigure() {
  const inner = [
    { x: 70, sub: "T" },
    { x: 175, sub: "T−1" },
    { x: 280, sub: "T−2" },
    { x: 450, sub: "1" },
    { x: 555, sub: "0", highlight: true },
  ];
  return (
    <svg
      viewBox="0 0 640 304"
      className="w-full max-w-2xl text-foreground"
      role="img"
      aria-label="Two-layer MDP: each robot step contains a denoising chain whose last state is the executed action chunk"
    >
      <defs>
        <marker id="tl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
        <marker id="tl-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* Outer MDP */}
      <text x={20} y={18} fontSize={11} fontWeight={600} fill="currentColor">
        Outer MDP: robot steps, one decision per action chunk
      </text>
      <StateNode x={36} sub="t" />
      <Arrow x1={52} y1={OUTER_Y} x2={78} y2={OUTER_Y} />
      <ChainBox x={80} />
      <Arrow x1={167} y1={OUTER_Y} x2={213} y2={OUTER_Y} accent />
      <text x={190} y={OUTER_Y - 8} fontSize={9.5} textAnchor="middle" fill="var(--accent)">
        chunk
      </text>
      <EnvBox x={215} />
      <Arrow x1={278} y1={OUTER_Y} x2={318} y2={OUTER_Y} />
      <Sym x={298} y={OUTER_Y - 8} base="r" sub="t" size={10.5} />
      <StateNode x={336} sub="t+H" />
      <Arrow x1={352} y1={OUTER_Y} x2={378} y2={OUTER_Y} />
      <ChainBox x={380} />
      <Arrow x1={467} y1={OUTER_Y} x2={513} y2={OUTER_Y} accent />
      <EnvBox x={515} />
      <Arrow x1={578} y1={OUTER_Y} x2={604} y2={OUTER_Y} />
      <text x={616} y={OUTER_Y + 4} fontSize={13} fill="currentColor">
        ⋯
      </text>
      <text x={626} y={OUTER_Y + 30} fontSize={9.5} fill="var(--muted)" textAnchor="end">
        value function and GAE on robot steps give an advantage Â
        <tspan dy={2} fontSize={7}>t</tspan>
        <tspan dy={-2}> for each chunk</tspan>
      </text>

      {/* Zoom lines */}
      <line x1={80} y1={OUTER_Y + 17} x2={14} y2={144} stroke="var(--accent)" strokeDasharray="3 3" strokeOpacity={0.7} />
      <line x1={166} y1={OUTER_Y + 17} x2={626} y2={144} stroke="var(--accent)" strokeDasharray="3 3" strokeOpacity={0.7} />

      {/* Inner MDP */}
      <rect x={14} y={144} width={612} height={150} rx={8} fill="none" stroke="var(--accent)" strokeDasharray="3 3" strokeOpacity={0.7} />
      <text x={26} y={164} fontSize={11} fontWeight={600} fill="currentColor">
        Inner MDP: denoising steps at robot step t
      </text>
      <text x={26} y={178} fontSize={9.5} fill="var(--muted)">
        state (o
        <tspan dy={2} fontSize={7}>t</tspan>
        <tspan dy={-2}>, x</tspan>
        <tspan dy={2} fontSize={7}>k</tspan>
        <tspan dy={-2}>, k), action x</tspan>
        <tspan dy={2} fontSize={7}>k−1</tspan>
        <tspan dy={-2}>, Gaussian policy with tractable log-probability</tspan>
      </text>
      {inner.map((n) => (
        <InnerNode key={n.sub} x={n.x} sub={n.sub} highlight={n.highlight} />
      ))}
      {[0, 1].map((i) => (
        <Arrow key={i} x1={inner[i].x + 18} y1={INNER_Y} x2={inner[i + 1].x - 19} y2={INNER_Y} />
      ))}
      <Arrow x1={inner[2].x + 18} y1={INNER_Y} x2={343} y2={INNER_Y} />
      <text x={365} y={INNER_Y + 4} fontSize={13} textAnchor="middle" fill="currentColor">
        ⋯
      </text>
      <Arrow x1={387} y1={INNER_Y} x2={inner[3].x - 19} y2={INNER_Y} />
      <Arrow x1={inner[3].x + 18} y1={INNER_Y} x2={inner[4].x - 19} y2={INNER_Y} accent />
      {[0, 1, 3].map((i) => (
        <text key={i} x={(inner[i].x + (i === 3 ? inner[4].x : inner[i + 1].x)) / 2} y={INNER_Y - 8} fontSize={9} textAnchor="middle" fill="var(--muted)" fontStyle="italic">
          π
          <tspan dy={2} fontSize={7} fontStyle="normal">θ</tspan>
        </text>
      ))}
      <text x={inner[0].x} y={INNER_Y + 32} fontSize={9.5} textAnchor="middle" fill="var(--muted)">
        noise
      </text>
      <text x={inner[4].x} y={INNER_Y + 32} fontSize={9.5} textAnchor="middle" fill="var(--accent)">
        = executed chunk
      </text>
      <text x={26} y={INNER_Y + 62} fontSize={9.5} fill="var(--muted)">
        inner reward 0 until x
        <tspan dy={2} fontSize={7}>0</tspan>
        <tspan dy={-2}>; every inner step shares the chunk&apos;s advantage Â</tspan>
        <tspan dy={2} fontSize={7}>t</tspan>
      </text>
    </svg>
  );
}
