import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useEditorStore } from '../../store/editorStore';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { rebuildCanvasFromSections } from '../../lib/editor/fabricRender';

interface EditorCanvasProps {
  onCanvasReady?: (canvas: FabricCanvas) => void;
  width?: number;
  height?: number;
}

export default function EditorCanvas({
  onCanvasReady,
  width = 816,
  height = 1056,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  
  const setCanvas = useEditorStore(s => s.setCanvas);
  const clearCanvas = useEditorStore(s => s.clearCanvas);
  const setSelectedObjects = useEditorStore(s => s.setSelectedObjects);
  const setZoom = useEditorStore(s => s.setZoom);
  const pushUndo = useEditorStore(s => s.pushUndo);
  const sections = useEditorStore(s => s.sections);

  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    setInitError(null);
    setIsInitializing(true);

    try {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }

      const fabric = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#F9FAFB',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        stopContextMenu: true,
        fireRightClick: true,
      });

      // Event listeners
      const updateSelection = () => {
        setSelectedObjects(fabric.getActiveObjects());
      };

      fabric.on('selection:created', updateSelection);
      fabric.on('selection:updated', updateSelection);
      fabric.on('selection:cleared', () => setSelectedObjects([]));

      fabricRef.current = fabric;
      setCanvas(fabric);
      onCanvasReady?.(fabric);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Canvas initialization failed';
      setInitError(message);
      console.error('EditorCanvas init error:', err);
    } finally {
      setIsInitializing(false);
    }
  }, [width, height, setCanvas, setSelectedObjects, onCanvasReady]);

  // Handle rebuilding canvas when sections change
  useEffect(() => {
    if (fabricRef.current && sections.length > 0) {
       rebuildCanvasFromSections(fabricRef.current, sections);
    }
  }, [sections]);

  useEffect(() => {
    initCanvas();
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
        clearCanvas();
      }
    };
  }, [initCanvas, clearCanvas]);

  // Handle zoom via wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const canvas = fabricRef.current;
      if (!canvas) return;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const current = canvas.getZoom();
      const next = Math.max(0.1, Math.min(5, current * delta));
      canvas.setZoom(next);
      setZoom(next);
      canvas.renderAll();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [setZoom]);

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-gray-200">
        <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
        <p className="text-slate-700 font-medium mb-1">Canvas failed to load</p>
        <p className="text-sm text-slate-500 mb-4 max-w-xs text-center">{initError}</p>
        <button
          onClick={initCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-slate-100 p-12 flex items-start justify-center no-scrollbar"
      style={{ minHeight: 0 }}
    >
      <div
        className="relative"
        style={{
          width,
          height,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: 4,
        }}
      >
        {isInitializing && (
          <div className="absolute inset-0 bg-white rounded flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
