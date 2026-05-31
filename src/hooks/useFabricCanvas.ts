import { useEffect, useRef, useCallback } from 'react';
import { Canvas, Rect, Circle, FabricText, FabricImage, IText, Line, Polygon, util, classRegistry } from 'fabric';
import type { FabricObject, TPointerEventInfo } from 'fabric';
import { useStore } from '../store';
import toast from 'react-hot-toast';

export function useFabricCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const canvasInstanceRef = useRef<Canvas | null>(null);
  const { setFabricCanvas, setSelectedObject, pushHistory } = useStore();

  const saveHistory = useCallback(() => {
    if (!canvasInstanceRef.current) return;
    const json = JSON.stringify(canvasInstanceRef.current.toJSON());
    pushHistory(json);
  }, [pushHistory]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selectionColor: 'rgba(37, 99, 235, 0.1)',
      selectionBorderColor: '#2563EB',
      selectionLineWidth: 1,
    });

    canvasInstanceRef.current = canvas;
    setFabricCanvas(canvas);

    // v6 event API — uses e.selected, NOT getPointer
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] ?? null);
    });
    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] ?? null);
    });
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    canvas.on('object:modified', saveHistory);
    canvas.on('object:added', saveHistory);

    // Save initial state
    pushHistory(JSON.stringify(canvas.toJSON()));

    return () => {
      // v6: dispose() returns Promise — must await
      canvas.dispose().then(() => {
        setFabricCanvas(null);
        setSelectedObject(null);
      });
    };
  }, []);  // eslint-disable-line

  // Helpers
  const addText = useCallback((text = 'Click to edit', options = {}) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const t = new IText(text, {
      left: 100, top: 100, fontSize: 24,
      fontFamily: 'Inter', fill: '#0F172A',
      width: 400,
      ...options
    });
    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
  }, []);

  const addRect = useCallback((options = {}) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const r = new Rect({
      left: 100, top: 100, width: 200, height: 120,
      fill: '#EFF6FF', stroke: '#2563EB', strokeWidth: 1,
      rx: 8, ry: 8, ...options
    });
    c.add(r);
    c.setActiveObject(r);
    c.requestRenderAll();
  }, []);

  const addCircle = useCallback((options = {}) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const circle = new Circle({
      left: 100, top: 100, radius: 60,
      fill: '#F0FDF4', stroke: '#16A34A', strokeWidth: 1, ...options
    });
    c.add(circle);
    c.setActiveObject(circle);
    c.requestRenderAll();
  }, []);

  const addImageFromUrl = useCallback(async (url: string, options = {}) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    // v6: FabricImage.fromURL returns Promise
    const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5, ...options });
    c.add(img);
    c.setActiveObject(img);
    c.requestRenderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const obj = c.getActiveObject();
    if (obj) {
      c.remove(obj);
      c.requestRenderAll();
    }
  }, []);

  const updateSelectedStyle = useCallback((props: Partial<FabricObject>) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const obj = c.getActiveObject();
    if (obj) {
      obj.set(props as any);
      c.requestRenderAll();
    }
  }, []);

  const exportToDataURL = useCallback((format: 'png' | 'jpeg' = 'png') => {
    const c = canvasInstanceRef.current;
    if (!c) return '';
    return c.toDataURL({ format, quality: 0.95, multiplier: 2 });
  }, []);

  const loadFromJSON = useCallback(async (json: string) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    await c.loadFromJSON(JSON.parse(json));
    c.requestRenderAll();
  }, []);

  return { 
    canvas: canvasInstanceRef.current, 
    addText, addRect, addCircle, addImageFromUrl, 
    deleteSelected, updateSelectedStyle, exportToDataURL, loadFromJSON 
  };
}
