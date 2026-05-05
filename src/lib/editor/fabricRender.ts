import * as fabric from 'fabric';
import { DocumentSection } from './editorTypes';

export function renderSectionToFabricGroup(section: DocumentSection, top: number = 0): fabric.Group {
  const width = 800; // Slide width
  let currentY = top + 40;

  const objectList: fabric.Object[] = [];

  // Background
  const bg = new fabric.Rect({
    left: 0,
    top: top,
    width,
    height: 450,
    fill: section.backgroundColor || '#ffffff',
    selectable: false,
    evented: false
  });
  objectList.push(bg);

  // Title
  if (section.heading) {
    const titleText = new fabric.IText(section.heading, {
      left: 40,
      top: currentY,
      fontSize: 32,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: section.textColor || '#111827',
      width: width - 80,
    });
    objectList.push(titleText);
    currentY += titleText.height + 20;
  }

  // Content
  if (section.body) {
    const contentText = new fabric.Textbox(section.body, {
      left: 40,
      top: currentY,
      fontSize: 18,
      fontFamily: 'Inter',
      fill: section.textColor || '#4B5563',
      width: width - 80,
    });
    objectList.push(contentText);
    currentY += contentText.height + 20;
  }

  const group = new fabric.Group(objectList, {
    left: 40,
    top: top,
    width,
    selectable: true,
    hasControls: true,
  });

  // Attach metadata
  group.set('sectionId', section.id);
  // @ts-ignore
  group.data = { sectionId: section.id, elementRole: 'section-group' };

  return group;
}

export function rebuildCanvasFromSections(canvas: fabric.Canvas, sections: DocumentSection[]) {
  if (!canvas) return;
  canvas.clear();
  canvas.backgroundColor = '#F9FAFB';

  let currentTop = 40;
  sections.forEach(sec => {
    const group = renderSectionToFabricGroup(sec, currentTop);
    canvas.add(group);
    currentTop += Math.max(group.height || 0, 450) + 40; // Spacing between slides
  });

  canvas.renderAll();
}

export function updateCanvasForSection(canvas: fabric.Canvas, section: DocumentSection) {
  if (!canvas) return;
  
  // Find existing group for section
  const objects = canvas.getObjects();
  const existingObj = objects.find(o => (o as any).data?.sectionId === section.id);
  
  let top = 40;
  if (existingObj) {
    top = existingObj.top || top;
    canvas.remove(existingObj);
  }

  const newGroup = renderSectionToFabricGroup(section, top);
  canvas.add(newGroup);
  canvas.renderAll();
}
