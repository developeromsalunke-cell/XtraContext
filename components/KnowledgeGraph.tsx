"use client";

import { useEffect, useState } from "react";

export default function KnowledgeGraph() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    // Simulate a simple graph
    const initialNodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 400,
      size: Math.random() * 10 + 5,
      label: i % 3 === 0 ? "Project Concept" : "AI Memory"
    }));

    const initialLinks = Array.from({ length: 15 }, () => ({
      source: Math.floor(Math.random() * 12),
      target: Math.floor(Math.random() * 12)
    }));

    setNodes(initialNodes);
    setLinks(initialLinks);
  }, []);

  return (
    <div className="w-full h-[500px] glass rounded-3xl border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      <div className="absolute top-8 left-8 z-10">
        <h3 className="text-xl font-bold mb-1">Knowledge Network</h3>
        <p className="text-sm text-foreground/40">Visualizing semantic connections across 1.2k memories.</p>
      </div>

      <svg className="w-full h-full relative z-0">
        <defs>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Links */}
        {links.map((link, i) => {
          const source = nodes[link.source];
          const target = nodes[link.target];
          if (!source || !target) return null;
          return (
            <line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="1"
              className="animate-pulse-slow"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id} className="cursor-pointer group/node">
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              className="transition-all duration-500 group-hover/node:r-12"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size + 4}
              fill="none"
              stroke="var(--brand-primary)"
              strokeOpacity="0.2"
              className="animate-ping-slow"
            />
            {node.id % 4 === 0 && (
              <text
                x={node.x + 15}
                y={node.y + 5}
                fill="white"
                fillOpacity="0.4"
                className="text-[10px] font-bold tracking-widest uppercase pointer-events-none"
              >
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="absolute bottom-8 right-8 flex gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          ACTIVE CLUSTERS: 4
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-brand-secondary" />
          SYNCED ENTITIES: 142
        </div>
      </div>
    </div>
  );
}
