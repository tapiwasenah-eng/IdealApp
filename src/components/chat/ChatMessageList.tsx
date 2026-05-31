import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Props {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" style={{ maxHeight: '600px' }}>
      {messages.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Bot className="h-12 w-12 mx-auto mb-3 text-indigo-400" />
          <p className="text-lg font-medium">AI Assistant Ready</p>
          <p className="text-sm">Ask me anything or request edits to your document</p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
          }`}>
            {msg.role === 'assistant' ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>

          {msg.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-700" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
