// Customer type definitions
export interface Customer {
  id: string;
  wabaId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WhatsAppCustomer {
  id: string;
  name: string;
  timezone_id?: string;
  currency?: string;
  message_template_namespace?: string;
}