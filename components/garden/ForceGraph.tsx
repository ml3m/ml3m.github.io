"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import {
  GardenNode,
  GardenEdge,
  GROUP_COLORS,
  type NodeGroup,
} from "@/lib/garden";

interface SimNode extends SimulationNodeDatum, GardenNode {}
interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
}

interface ForceGraphProps {
  nodes: GardenNode[];
  edges: GardenEdge[];
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

const STATUS_RADIUS: Record<string, number> = {
  seedling: 4,
  sprout: 6,
  evergreen: 9,
};

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const DEFAULT_ZOOM = 1.35;
const HUB_EDGE_THRESHOLD = 4;

export default function ForceGraph({ nodes, edges }: ForceGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 550 });
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(
    null
  );
  const hoveredRef = useRef<string | null>(null);
  const dragRef = useRef<{
    nodeId: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; tX: number; tY: number } | null>(null);
  const [tooltip, setTooltip] = useState<{
    node: SimNode;
    screenX: number;
    screenY: number;
  } | null>(null);
  const rafRef = useRef<number>(0);
  const defaultTransform = useCallback(
    (w: number, h: number): Transform => {
      const cx = w / 2;
      const cy = h / 2;
      return { x: cx - cx * DEFAULT_ZOOM, y: cy - cy * DEFAULT_ZOOM, k: DEFAULT_ZOOM };
    },
    []
  );
  const transformRef = useRef<Transform>({ x: 0, y: 0, k: DEFAULT_ZOOM });
  const edgeCountRef = useRef<Map<string, number>>(new Map());
  const pinchRef = useRef<{ dist: number; k: number } | null>(null);
  const [viewModified, setViewModified] = useState(false);

  // Precompute edge counts per node
  useEffect(() => {
    const counts = new Map<string, number>();
    for (const e of edges) {
      counts.set(e.source, (counts.get(e.source) || 0) + 1);
      counts.set(e.target, (counts.get(e.target) || 0) + 1);
    }
    edgeCountRef.current = counts;
  }, [edges]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.max(500, Math.min(width * 0.85, 700));
      if (!viewModified) {
        transformRef.current = defaultTransform(width, h);
      }
      setDimensions({ width, height: h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const screenToWorld = useCallback(
    (sx: number, sy: number): { x: number; y: number } => {
      const t = transformRef.current;
      return { x: (sx - t.x) / t.k, y: (sy - t.y) / t.k };
    },
    []
  );

  const worldToScreen = useCallback(
    (wx: number, wy: number): { x: number; y: number } => {
      const t = transformRef.current;
      return { x: wx * t.k + t.x, y: wy * t.k + t.y };
    },
    []
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(16, 12, 26, 0.5)";
    ctx.fillRect(0, 0, w, h);

    const t = transformRef.current;
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const hovered = hoveredRef.current;
    const connectedIds = new Set<string>();
    if (hovered) {
      for (const e of edges) {
        if (e.source === hovered) connectedIds.add(e.target);
        if (e.target === hovered) connectedIds.add(e.source);
      }
    }

    // Draw edges
    for (const link of simLinksRef.current) {
      const src = link.source as SimNode;
      const tgt = link.target as SimNode;
      if (src.x == null || src.y == null || tgt.x == null || tgt.y == null)
        continue;

      const highlighted =
        hovered && (src.id === hovered || tgt.id === hovered);
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = highlighted
        ? "rgba(204, 68, 255, 0.7)"
        : "rgba(90, 50, 130, 0.3)";
      ctx.lineWidth = (highlighted ? 1.5 : 0.5) / t.k;
      ctx.stroke();
    }

    // Draw nodes and labels
    const baseFontSize = 9 / t.k;
    const hubFontSize = 8 / t.k;

    for (const node of simNodesRef.current) {
      if (node.x == null || node.y == null) continue;
      const r = STATUS_RADIUS[node.status] || 5;
      const color = GROUP_COLORS[node.group as NodeGroup] || "#888";
      const isHovered = node.id === hovered;
      const isConnected = connectedIds.has(node.id);
      const edgeCount = edgeCountRef.current.get(node.id) || 0;
      const isHub = edgeCount >= HUB_EDGE_THRESHOLD;

      // Glow for hovered node
      if (isHovered) {
        const glowR = r + 6;
        const glowGrad = ctx.createRadialGradient(
          node.x,
          node.y,
          r,
          node.x,
          node.y,
          glowR
        );
        glowGrad.addColorStop(0, color + "55");
        glowGrad.addColorStop(1, color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color + "cc";
      ctx.fill();

      // Labels: always show for hubs, show for hovered + connected
      if (isHovered || isConnected) {
        ctx.font = `bold ${baseFontSize}px 'Space Mono', monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = isHovered ? "#e8d5ff" : "#c8a8ee";
        ctx.fillText(node.label, node.x, node.y + r + 12 / t.k);
      } else if (isHub) {
        ctx.font = `${hubFontSize}px 'Space Mono', monospace`;
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = color;
        ctx.fillText(node.label, node.x, node.y + r + 10 / t.k);
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
  }, [dimensions, edges]);

  useEffect(() => {
    const simNodeData: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinkData: SimLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));
    simNodesRef.current = simNodeData;
    simLinksRef.current = simLinkData;

    const pad = 15;
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const sim = forceSimulation<SimNode>(simNodeData)
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinkData)
          .id((d) => d.id)
          .distance(25)
          .strength(0.4)
      )
      .force("charge", forceManyBody().strength(-25).distanceMax(180))
      .force("x", forceX<SimNode>(cx).strength(0.05))
      .force("y", forceY<SimNode>(cy).strength(0.05))
      .force(
        "collide",
        forceCollide<SimNode>()
          .radius((d) => STATUS_RADIUS[d.status] + 2)
          .strength(0.7)
      )
      .force("bounds", () => {
        for (const d of simNodeData) {
          if (d.x != null)
            d.x = Math.max(pad, Math.min(dimensions.width - pad, d.x));
          if (d.y != null)
            d.y = Math.max(pad, Math.min(dimensions.height - pad, d.y));
        }
      })
      .alphaDecay(0.02);

    sim.on("tick", () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });

    simRef.current = sim;
    return () => {
      sim.stop();
      cancelAnimationFrame(rafRef.current);
    };
  }, [nodes, edges, dimensions.width, dimensions.height, draw]);

  const getNodeAt = useCallback(
    (sx: number, sy: number): SimNode | null => {
      const { x, y } = screenToWorld(sx, sy);
      for (let i = simNodesRef.current.length - 1; i >= 0; i--) {
        const node = simNodesRef.current[i];
        if (node.x == null || node.y == null) continue;
        const r = STATUS_RADIUS[node.status] + 4;
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy < r * r) return node;
      }
      return null;
    },
    [screenToWorld]
  );

  const getCanvasCoords = useCallback(
    (e: React.PointerEvent | PointerEvent): { x: number; y: number } => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    []
  );

  const scheduleRedraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const { x, y } = getCanvasCoords(e);
      const node = getNodeAt(x, y);

      if (node && node.x != null && node.y != null) {
        e.preventDefault();
        const world = screenToWorld(x, y);
        dragRef.current = {
          nodeId: node.id,
          offsetX: world.x - node.x,
          offsetY: world.y - node.y,
        };
        node.fx = node.x;
        node.fy = node.y;
        simRef.current?.alphaTarget(0.3).restart();
      } else {
        panRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          tX: transformRef.current.x,
          tY: transformRef.current.y,
        };
      }
    },
    [getCanvasCoords, getNodeAt, screenToWorld]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { x, y } = getCanvasCoords(e);

      if (dragRef.current) {
        const world = screenToWorld(x, y);
        const node = simNodesRef.current.find(
          (n) => n.id === dragRef.current!.nodeId
        );
        if (node) {
          node.fx = world.x - dragRef.current.offsetX;
          node.fy = world.y - dragRef.current.offsetY;
        }
        return;
      }

      if (panRef.current) {
        const dx = e.clientX - panRef.current.startX;
        const dy = e.clientY - panRef.current.startY;
        transformRef.current.x = panRef.current.tX + dx;
        transformRef.current.y = panRef.current.tY + dy;
        scheduleRedraw();
        return;
      }

      const node = getNodeAt(x, y);
      const prevHovered = hoveredRef.current;
      hoveredRef.current = node?.id ?? null;

      if (prevHovered !== hoveredRef.current) {
        if (node && node.x != null && node.y != null) {
          const screen = worldToScreen(node.x, node.y);
          setTooltip({ node, screenX: screen.x, screenY: screen.y });
        } else {
          setTooltip(null);
        }
        scheduleRedraw();
      }
    },
    [getCanvasCoords, getNodeAt, screenToWorld, worldToScreen, scheduleRedraw]
  );

  const handlePointerUp = useCallback(() => {
    if (dragRef.current) {
      const node = simNodesRef.current.find(
        (n) => n.id === dragRef.current!.nodeId
      );
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      dragRef.current = null;
      simRef.current?.alphaTarget(0);
    }
    if (panRef.current) {
      const t = transformRef.current;
      if (t.x !== 0 || t.y !== 0) setViewModified(true);
    }
    panRef.current = null;
  }, []);

  const handlePointerLeave = useCallback(() => {
    handlePointerUp();
    hoveredRef.current = null;
    setTooltip(null);
    scheduleRedraw();
  }, [handlePointerUp, scheduleRedraw]);

  // Wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const t = transformRef.current;
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newK = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.k * factor));
      const ratio = newK / t.k;

      transformRef.current = {
        x: mx - (mx - t.x) * ratio,
        y: my - (my - t.y) * ratio,
        k: newK,
      };
      setViewModified(true);
      scheduleRedraw();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [scheduleRedraw]);

  // Pinch-to-zoom for touch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getTouchDist = (e: TouchEvent): number => {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (
      e: TouchEvent
    ): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      const [a, b] = [e.touches[0], e.touches[1]];
      return {
        x: (a.clientX + b.clientX) / 2 - rect.left,
        y: (a.clientY + b.clientY) / 2 - rect.top,
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchRef.current = {
          dist: getTouchDist(e),
          k: transformRef.current.k,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const newDist = getTouchDist(e);
        const scale = newDist / pinchRef.current.dist;
        const newK = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, pinchRef.current.k * scale)
        );
        const center = getTouchCenter(e);
        const t = transformRef.current;
        const ratio = newK / t.k;
        transformRef.current = {
          x: center.x - (center.x - t.x) * ratio,
          y: center.y - (center.y - t.y) * ratio,
          k: newK,
        };
        setViewModified(true);
        scheduleRedraw();
      }
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [scheduleRedraw]);

  const resetView = useCallback(() => {
    transformRef.current = defaultTransform(dimensions.width, dimensions.height);
    setViewModified(false);
    scheduleRedraw();
  }, [scheduleRedraw]);

  return (
    <div ref={containerRef} className="w-full relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded-sm border border-border-default"
        style={{
          touchAction: "none",
          cursor: tooltip ? "grab" : "default",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {tooltip && (
        <div
          className="absolute pointer-events-none px-3 py-2 rounded-sm border border-border-glow bg-bg-card/95 max-w-[220px] z-50"
          style={{
            left: Math.min(
              Math.max(tooltip.screenX, 10),
              dimensions.width - 230
            ),
            top: Math.max(
              tooltip.screenY -
                STATUS_RADIUS[tooltip.node.status] * transformRef.current.k -
                60,
              10
            ),
          }}
        >
          <p className="text-text-primary text-[0.75rem] font-bold">
            {tooltip.node.label}
          </p>
          <p className="text-text-secondary text-[0.65rem] mt-0.5">
            {tooltip.node.description}
          </p>
          <span
            className="text-[0.6rem] mt-1 inline-block"
            style={{ color: GROUP_COLORS[tooltip.node.group as NodeGroup] }}
          >
            {tooltip.node.group} · {tooltip.node.status}
          </span>
        </div>
      )}

      {viewModified && (
        <button
          onClick={resetView}
          className="absolute top-2 right-2 px-2 py-1 text-[0.65rem] rounded-sm border border-border-default bg-bg-card/80 text-text-secondary hover:text-text-primary hover:border-border-glow transition-colors"
        >
          reset view
        </button>
      )}
    </div>
  );
}
