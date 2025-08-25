export interface InvoiceItem {
  itemId: number;
  description: string;
  hsnCode: string;
  rate: number;
  quantity: number;
  netAmount: number;
}

export interface InvoiceType {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string; // or Date if you parse it
  shippingCharges: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalBeforeTax: string;
  totalAfterTax: string;
  amountInWords: string;
  items: InvoiceItem[];
}

export type ExportInvoiceRow = Record<
  "Invoice Date" | "Invoice No" | "Amount",
  string
>;

export type ExportPaymentRow = Record<
  "Payment Date" | "Payee Name" | "Amount",
  string
>;

export interface BankDetails {
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

export interface UserProfileType {
  _id: number;
  name: string;
  username: string;
  role: string;
  address: string;
  contact: string;
  email?: string;
  state: string;
  stateCode: string;
  gstNo: string;
  bankDetails: BankDetails;
  totalBillAmount?: number;
  totalPaymentAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface userType {
  id: number;
  role: string;
  username: string;
}
export interface AppContextType {
  loading: boolean;
  message: string;
  handleLoading: (isLoading: boolean, message?: string) => void;
  userDetails: userType;
  setUserDetails: React.Dispatch<React.SetStateAction<userType>>;
  printContext: printType | null;
  setPrintContext: React.Dispatch<React.SetStateAction<printType | null>>;
}

export interface bankDetailsType {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch?: string;
}

export interface companyDetailsType {
  id?: number;
  companyName: string;
  dealsIn?: string;
  address: string;
  contact: string;
  email?: string;
  gstIn: string;
  state: string;
  stateCode: string;
  bankDetails: bankDetailsType;
}

export interface invoiceItemsType {
  description: string;
  hsnCode: string;
  rate: number;
  quantity: number;
  netAmount: number;
  itemId: number;
}

export interface printType {
  companyDetails: companyDetailsType;
  buyerDetails: companyDetailsType;
  invoice: InvoiceType;
}

export interface PaymentType {
  id?: number;
  amount: number;
  paymentDate: string;
  payeeName: string;
}
