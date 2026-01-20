
export interface QuotationSubItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  qty: number;
  unit: string;
}

export interface QuotationBlock {
  id: string;
  title: string;
  type: 'items' | 'text';
  content?: string;
  items?: QuotationSubItem[];
}

export interface CompanyInfo {
  name: string;
  taxId: string;
  phone: string;
  remittance: string;
  stampUrl?: string;
}

export interface ClientInfo {
  name: string;
  taxId: string;
  contact: string;
  email: string;
  logoUrl?: string;
}

export interface QuotationState {
  blocks: QuotationBlock[];
  company: CompanyInfo;
  client: ClientInfo;
  taxRate: number;
  discount: number;
  themeColor: string;
  quoteNo: string;
  date: string;
}
