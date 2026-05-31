import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ExpandingChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Ask anything...", 
  disabled = false,
  isLoading = false 
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200); // max 200px
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
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
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                   disabled:bg-gray-50 disabled:cursor-not-allowed"
        style={{ minHeight: '48px', maxHeight: '200px' }}
      />
      <button
        onClick={onSubmit}
        disabled={disabled || isLoading || !value.trim()}
        className="absolute bottom-6 right-6 rounded-lg bg-blue-600 p-2.5 text-white 
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-colors"
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
