import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { designSystem } from '../../lib/design-system';

interface SectionEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ content, onChange, onBlur, readOnly = false }) => {
  const { typography, colors } = designSystem;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-indigo-600 hover:text-indigo-800 underline',
          },
        },
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      if (onBlur) onBlur();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
        style: `font-family: ${typography.fonts.interface}; font-size: ${typography.scale.bodyL.fontSize}; line-height: ${typography.scale.bodyL.lineHeight}; color: ${colors.neutral.slate[700]};`,
      },
    },
  });

  // Update content if changed from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-wrapper min-h-[40px] relative group-editor">
      {!readOnly && (
        <div className="editor-toolbar opacity-0 absolute -top-10 left-0 transition-opacity duration-200 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded p-1 shadow-sm z-10 group-editor-hover:opacity-100">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`px-2 py-0.5 text-sm font-bold rounded ${editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-white text-slate-700'}`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`px-2 py-0.5 text-sm italic rounded ${editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-white text-slate-700'}`}
          >
            I
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1 border-r" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-0.5 text-sm rounded ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-white text-slate-700'}`}
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-0.5 text-sm rounded ${editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-white text-slate-700'}`}
          >
            1.
          </button>
        </div>
      )}
      <style>{`
        .group-editor:hover .editor-toolbar, .editor-toolbar:hover {
          opacity: 1;
        }
        .ProseMirror p {
           margin-top: 0.5em;
           margin-bottom: 0.5em;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
           margin-top: 0.75em;
           margin-bottom: 0.5em;
           color: ${colors.primary.obsidian};
           font-weight: 600;
        }
        .ProseMirror ul {
           list-style-type: disc;
           padding-left: 1.5em;
           margin-top: 0.5em;
           margin-bottom: 0.5em;
        }
        .ProseMirror ol {
           list-style-type: decimal;
           padding-left: 1.5em;
           margin-top: 0.5em;
           margin-bottom: 0.5em;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
};
