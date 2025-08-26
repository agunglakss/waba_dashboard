export interface Conversation {
  id: string;
  wabaId: string;
  phoneNumber: string;
}

export interface WhatsAppConversation {
  id: string;
  conversation_analytics: WhatsAppConversationAnalytics[];
}

export interface WhatsAppConversationAnalytics {
  start: number;
  end: number;
  conversation: number;
  phone_number: string;
  country: string;
  conversation_type: string;
  conversation_category: string;
  cost: number;
}

