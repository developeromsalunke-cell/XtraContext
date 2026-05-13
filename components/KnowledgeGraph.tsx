"use client";

import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// ... (ForceGraph2D import remains same)
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#FF5733]/30 border-t-[#FF5733] rounded-full animate-spin" />
        <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Initializing Neural Matrix...</p>
      </div>
    </div>
  ),
});

interface KnowledgeGraphProps {
  data: {
    nodes: any[];
    links: any[];
  };
  onNodeSelect?: (node: any) => void;
}

const KnowledgeGraph = forwardRef((props: KnowledgeGraphProps, ref) => {
  const { data, onNodeSelect } = props;
  const fgRef = useRef<any>();
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (fgRef.current) {
        const currentZoom = fgRef.current.zoom();
        fgRef.current.zoom(currentZoom * 1.5, 400);
      }
    },
    zoomOut: () => {
      if (fgRef.current) {
        const currentZoom = fgRef.current.zoom();
        fgRef.current.zoom(currentZoom / 1.5, 400);
      }
    },
    centerGraph: () => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(800, 100);
      }
    }
  }));

  useEffect(() => {
    // Make sure graph is sized to container
    const handleResize = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setWindowSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial call after small delay to let container size
    setTimeout(handleResize, 50);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    
    // Zoom/Center on click
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(4, 2000);
    }
  }, [onNodeSelect]);

  // Noir Aesthetic Node Painting
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Prevent crashes if simulation hasn't calculated coordinates yet
    if (!node || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const isHovered = node === hoverNode;
    
    let baseColor = '#555555';
    let accentColor = '#777777';
    let size = node.val;

    if (node.type === 'team') {
      baseColor = '#ffffff';
      accentColor = '#cccccc';
      size = node.val * (isHovered ? 1.2 : 1);
    } else if (node.type === 'thread') {
      baseColor = '#FF5733';
      accentColor = '#ff8c66';
      size = node.val * (isHovered ? 1.3 : 1);
    } else if (node.type === 'model') {
      baseColor = '#8888ff';
      accentColor = '#aaaaff';
      size = node.val * (isHovered ? 1.1 : 1);
    }

    // Node Glow Effect
    if (isHovered || node.type === 'team') {
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = (isHovered ? 25 : 15) / globalScale;
    } else {
      ctx.shadowBlur = 0;
    }

    // Radial Gradient Node
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(1, baseColor);

    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Reset shadow for performance
    ctx.shadowBlur = 0;

    // Node Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();

    // Node label - only if zoomed in or specialized type
    if (globalScale > 2 || node.type === 'team' || isHovered) {
      const fontSize = (isHovered ? 14 : 12) / globalScale;
      ctx.font = `${isHovered ? 'bold' : 'normal'} ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      const label = node.label;
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(label, node.x, node.y + size + (4 / globalScale));
    }
  }, [hoverNode]);

  // Configure forces when component mounts or data changes
  useEffect(() => {
    if (fgRef.current) {
      // Increase repulsion between nodes
      fgRef.current.d3Force('charge').strength(-500);
      // Increase distance between linked nodes
      fgRef.current.d3Force('link').distance(100);
      // Add a bit of centering force
      fgRef.current.d3Force('center').strength(0.05);
    }
  }, [data]);

  return (
    <div id="graph-container" className="w-full h-full relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Visual Enhancements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,87,51,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
      
      <ForceGraph2D
        ref={fgRef}
        width={windowSize.width}
        height={windowSize.height}
        graphData={data}
        nodeLabel="label"
        nodeCanvasObject={paintNode}
        onNodeHover={setHoverNode}
        onNodeClick={handleNodeClick}
        
        // Links Styling
        linkColor={(link: any) => {
          const isRelated = link.source === hoverNode || link.target === hoverNode;
          return isRelated ? 'rgba(255, 87, 51, 0.8)' : 'rgba(255, 255, 255, 0.15)';
        }}
        linkWidth={(link: any) => {
          const isRelated = link.source === hoverNode || link.target === hoverNode;
          return isRelated ? 3 : 1.5;
        }}
        
        // Animation
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link: any) => {
          const isRelated = link.source === hoverNode || link.target === hoverNode;
          return isRelated ? 4 : 0;
        }}
        linkDirectionalParticleSpeed={0.01}
        
        // Physics Tuning
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        warmupTicks={150}
        cooldownTicks={100}
      />
    </div>
  );
});

KnowledgeGraph.displayName = 'KnowledgeGraph';
export default KnowledgeGraph;
