// A scattered node-and-line decoration — the same idea as a starfield/constellation,
// used here to give an otherwise flat light section some texture without resorting
// to a big solid color block. Pure SVG, no JS/animation cost.

type Node = [number, number]; // x, y in a 0-300 local viewBox
type Cluster = { nodes: Node[]; edges: [number, number][] };

const CLUSTERS: Cluster[] = [
  {
    nodes: [[20, 40], [70, 15], [95, 70], [55, 90], [30, 130], [110, 110], [10, 180]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [2, 5], [4, 6]],
  },
  {
    nodes: [[40, 20], [10, 55], [65, 60], [35, 100], [80, 20], [95, 90]],
    edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [4, 5], [3, 5]],
  },
];

export const Constellation = ({
  corner = 'top-left',
  className = '',
}: {
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) => {
  const cluster = CLUSTERS[corner === 'top-right' || corner === 'bottom-left' ? 1 : 0];
  const flipX = corner === 'top-right' || corner === 'bottom-right';
  const flipY = corner === 'bottom-left' || corner === 'bottom-right';

  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }[corner];

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute ${positions} w-56 h-56 md:w-72 md:h-72 ${className}`}
      style={{
        transform: `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`,
      }}
    >
      {cluster.edges.map(([a, b], i) => (
        <line
          key={i}
          x1={cluster.nodes[a][0]} y1={cluster.nodes[a][1]}
          x2={cluster.nodes[b][0]} y2={cluster.nodes[b][1]}
          stroke="currentColor" strokeWidth="0.6" opacity="0.35"
        />
      ))}
      {cluster.nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.4} fill="currentColor" opacity={i % 3 === 0 ? 0.55 : 0.35} />
      ))}
    </svg>
  );
};
