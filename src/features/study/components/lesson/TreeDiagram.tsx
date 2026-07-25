// ── TreeDiagram — shared probability-tree renderer ────────────────────────────
// New for Term 3 (Probability: combined/sequential events). Plain SVG,
// recursive layout — supports any number of stages, though Grade 10 content
// stays to 2 stages. Each leaf can optionally show its cumulative
// (multiplied) path probability.

export interface TreeNode {
  label: string;
  probability: number;
  children?: TreeNode[];
}

function collectLeaves(node: TreeNode, path: TreeNode[] = []): { path: TreeNode[]; cumulative: number }[] {
  const nextPath = [...path, node];
  if (!node.children || node.children.length === 0) {
    const cumulative = nextPath.reduce((acc, n) => acc * n.probability, 1);
    return [{ path: nextPath, cumulative }];
  }
  return node.children.flatMap(c => collectLeaves(c, nextPath));
}

export function TreeDiagram({ root, showCumulative = true }: { root: TreeNode; showCumulative?: boolean }) {
  const depth = (n: TreeNode): number => (n.children && n.children.length > 0 ? 1 + Math.max(...n.children.map(depth)) : 1);
  const maxDepth = depth(root);
  const width = 140 * (maxDepth + 1) + (showCumulative ? 90 : 0);
  const stageGap = 140;

  const leaves = collectLeaves(root);
  const rowH = 42;
  const height = Math.max(leaves.length * rowH + 40, 120);

  // Assign each leaf a vertical slot, then position every ancestor node at
  // the average of its descendants' slots — standard tree-layout technique.
  const leafSlots = new Map<TreeNode, number>();
  leaves.forEach((l, i) => leafSlots.set(l.path[l.path.length - 1], i));

  function yFor(node: TreeNode): number {
    if (!node.children || node.children.length === 0) {
      return 20 + (leafSlots.get(node) ?? 0) * rowH + rowH / 2;
    }
    const ys = node.children.map(yFor);
    return ys.reduce((a, b) => a + b, 0) / ys.length;
  }

  const lines: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];
  const labels: { x: number; y: number; text: string; bold?: boolean }[] = [];

  function layout(node: TreeNode, x: number, stage: number) {
    const y = yFor(node);
    if (stage > 0) labels.push({ x, y: y - 6, text: node.label, bold: false });
    if (node.children) {
      const childX = x + stageGap;
      for (const c of node.children) {
        const cy = yFor(c);
        lines.push({ x1: x, y1: y, x2: childX, y2: cy, label: String(c.probability) });
        layout(c, childX, stage + 1);
      }
    }
  }
  layout(root, 40, 0);

  return (
    <div className="paper-card rounded overflow-hidden my-4 p-3 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto" style={{ minWidth: width, width }}>
        {lines.map((l, i) => (
          <g key={i}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#94a3b8" strokeWidth={1.5} />
            <text x={(l.x1 + l.x2) / 2} y={(l.y1 + l.y2) / 2 - 6} fontSize={10} fill="#0369a1" textAnchor="middle" fontWeight={700}>{l.label}</text>
          </g>
        ))}
        {labels.map((lb, i) => (
          <text key={i} x={lb.x + 6} y={lb.y + 14} fontSize={11} fill="#1e293b" fontWeight={600}>{lb.text}</text>
        ))}
        {showCumulative && leaves.map((leaf, i) => {
          const lastNode = leaf.path[leaf.path.length - 1];
          const y = yFor(lastNode);
          const x = 40 + stageGap * (leaf.path.length - 1) + 70;
          return (
            <text key={i} x={x} y={y + 4} fontSize={11} fontWeight={700} fill="#047857">
              = {leaf.cumulative.toFixed(3)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
