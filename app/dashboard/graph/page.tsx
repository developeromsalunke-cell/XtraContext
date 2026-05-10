"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";

interface Node {
  id: string;
  label: string;
  type: "thread" | "project" | "model";
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Link {
  source: string;
  target: string;
}

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Generate simulated architectural data
    const mockNodes: Node[] = [
      { id: "p1", label: "E-commerce API", type: "project", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "p2", label: "Mobile App", type: "project", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "m1", label: "Claude 3.5", type: "model", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "m2", label: "GPT-4o", type: "model", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "t1", label: "Auth Flow", type: "thread", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "t2", label: "Stripe Logic", type: "thread", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "t3", label: "UI Polish", type: "thread", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "t4", label: "Native Bridge", type: "thread", x: 0, y: 0, vx: 0, vy: 0 },
      { id: "t5", label: "Push Notification", type: "thread", x: 0, y: 0, vx: 0, vy: 0 },
    ];

    const mockLinks: Link[] = [
      { source: "p1", target: "t1" },
      { source: "p1", target: "t2" },
      { source: "p1", target: "t3" },
      { source: "p2", target: "t4" },
      { source: "p2", target: "t5" },
      { source: "m1", target: "t1" },
      { source: "m1", target: "t4" },
      { source: "m2", target: "t2" },
      { source: "m2", target: "t5" },
      { source: "m1", target: "t3" },
    ];

    // Initialize positions randomly in a circle
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    
    mockNodes.forEach(n => {
      n.x = width / 2 + (Math.random() - 0.5) * 400;
      n.y = height / 2 + (Math.random() - 0.5) * 400;
    });

    setNodes(mockNodes);
    setLinks(mockLinks);

    // Simple Force-Directed Simulation Loop
    const animate = () => {
      setNodes(prevNodes => {
        const nextNodes = [...prevNodes];
        const k = 0.05; // attraction strength
        const r = 1500; // repulsion strength
        
        // Repulsion between all nodes
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const dx = nextNodes[j].x - nextNodes[i].x;
            const dy = nextNodes[j].y - nextNodes[i].y;
            const distSq = dx * dx + dy * dy + 0.1;
            const force = r / distSq;
            const fx = (dx / Math.sqrt(distSq)) * force;
            const fy = (dy / Math.sqrt(distSq)) * force;
            nextNodes[i].vx -= fx;
            nextNodes[i].vy -= fy;
            nextNodes[j].vx += fx;
            nextNodes[j].vy += fy;
          }
        }

        // Attraction for linked nodes
        mockLinks.forEach(link => {
          const source = nextNodes.find(n => n.id === link.source);
          const target = nextNodes.find(n => n.id === link.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = (dist - 100) * k;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
          }
        });

        // Update positions and apply friction
        const friction = 0.9;
        const centerX = width / 2;
        const centerY = height / 2;
        const centerGravity = 0.01;

        nextNodes.forEach(n => {
          // Gravity to center
          n.vx += (centerX - n.x) * centerGravity;
          n.vy += (centerY - n.y) * centerGravity;

          n.x += n.vx;
          n.y += n.vy;
          n.vx *= friction;
          n.vy *= friction;

          // Constraints
          n.x = Math.max(50, Math.min(width - 50, n.x));
          n.y = Math.max(50, Math.min(height - 50, n.y));
        });

        return nextNodes;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden relative">
          {/* Header Overlay */}
          <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-12 z-10 bg-gradient-to-b from-black to-transparent">
             <div>
                <h1 className="text-xl font-bold tracking-tight uppercase">Knowledge Graph</h1>
                <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Architectural Mapping of AI Context</p>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white" /> Thread</div>
                   <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500" /> Project</div>
                   <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-gray-600" /> Model</div>
                </div>
                <Link href="/dashboard" className="h-9 px-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors flex items-center">
                  Back to Hub
                </Link>
             </div>
          </header>

          {/* Graph Canvas */}
          <div ref={containerRef} className="flex-1 bg-black blueprint-grid cursor-grab active:cursor-grabbing overflow-hidden">
            <svg className="w-full h-full">
              {/* Lines */}
              {links.map((link, i) => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return null;
                return (
                  <line
                    key={i}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#262626"
                    strokeWidth="1"
                    className="transition-opacity duration-300"
                    opacity={hoveredNode ? (hoveredNode.id === source.id || hoveredNode.id === target.id ? 1 : 0.1) : 0.3}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g 
                  key={node.id} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === 'project' ? 8 : node.type === 'model' ? 6 : 5}
                    fill={node.type === 'thread' ? '#ffffff' : node.type === 'project' ? '#737373' : 'transparent'}
                    stroke={node.type === 'model' ? '#525252' : 'none'}
                    strokeWidth={node.type === 'model' ? 2 : 0}
                    className="transition-all duration-300"
                    opacity={hoveredNode ? (hoveredNode.id === node.id ? 1 : 0.3) : 1}
                  />
                  <text
                    x={node.x}
                    y={node.y + 20}
                    textAnchor="middle"
                    className={`text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-300 pointer-events-none ${hoveredNode?.id === node.id ? 'fill-white' : 'fill-gray-600'}`}
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Info Card Overlay */}
          {hoveredNode && (
            <div className="absolute bottom-12 left-12 w-64 card-noir border-gray-700 bg-black/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
               <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">{hoveredNode.type}</div>
               <h3 className="text-lg font-bold uppercase tracking-tight mb-4">{hoveredNode.label}</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest font-bold">
                     <span className="text-gray-600">Connected Nodes</span>
                     <span className="text-white">{links.filter(l => l.source === hoveredNode.id || l.target === hoveredNode.id).length}</span>
                  </div>
                  <button className="w-full mt-4 h-9 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-gray-200 transition-colors">
                     Explore Node
                  </button>
               </div>
            </div>
          )}

          <div className="absolute bottom-8 right-12 text-[10px] font-mono font-bold text-gray-700 uppercase tracking-[0.2em]">
             Interactive Force-Simulation Protocol v1.0
          </div>
        </main>
      </div>
    </div>
  );
}
