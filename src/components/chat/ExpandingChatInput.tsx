import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ExpandingChatInput({ value, onChange, onSubmit, placeholder, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-2 border-t bg-white p-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type your message...'}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-3 
                   focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
                   disabled:bg-slate-50 disabled:cursor-not-allowed text-base"
        style={{ minHeight: '48px', maxHeight: '200px' }}
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="rounded-lg bg-indigo-600 p-3 text-white hover:bg-indigo-700 
                   disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
