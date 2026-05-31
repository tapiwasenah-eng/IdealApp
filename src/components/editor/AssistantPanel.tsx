import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useStore } from '../../store';
import { ExpandingChatInput } from '../chat/ExpandingChatInput';
import { ChatMessageList } from '../chat/ChatMessageList';
import { useEditorStore } from '../../store/editorStore';
import { sendChatMessage } from '../../services/aiService';

export function AssistantPanel() {
  const { messages, addMessage, updateLastMessage, setLoading, isLoading, conversationId, createConversation } = useChatStore();
  const { user } = useStore();
  const { setRightPanelTab, selectedSectionId, sections } = useEditorStore();
  const [input, setInput] = useState('');

  // Initialize conversation
  useEffect(() => {
    if (user && !conversationId) {
      createConversation(user.uid);
    }
  }, [user, conversationId]);

  // Add initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: 'welcome',
        role: 'assistant',
        content: 'Hi! I can help you edit your document. Select a section and tell me what you want to change.',
        timestamp: new Date(),
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      // Create assistant message placeholder
      const assistantMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

      await sendChatMessage(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        (chunk) => {
          updateLastMessage(chunk); // append chunk
        },
        (fullText) => {
          setLoading(false);
        },
        (error) => {
          addMessage({
            id: `msg_${Date.now()}_error`,
            role: 'assistant',
            content: `Sorry, I encountered an error: ${error}. Please try again.`,
            timestamp: new Date(),
          });
          setLoading(false);
        }
      );
    } catch (error: any) {
      console.error('Chat error:', error);
      addMessage({
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Sparkles className="w-5 h-5" />
          AI Assistant
        </div>
        <button
          onClick={() => setRightPanelTab('inspector')}
          className="text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <ChatMessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <ExpandingChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        placeholder="Ask me to edit sections, rewrite content, or generate new ideas..."
        disabled={isLoading}
      />
    </div>
  );
}