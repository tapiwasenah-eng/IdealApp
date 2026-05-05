export interface DocumentSection {
  id: string;
  type: string;
  heading: string;
  subheading?: string;
  body: string;
  bullets?: string[];
  metrics?: { label: string; value: string }[];
  backgroundColor?: string;
  textColor?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  proposal?: {
    before: Partial<DocumentSection>;
    after: Partial<DocumentSection>;
  };
}
