export type ScreenId =
  | 'Model Selection'
  | 'Price/Offer Config'
  | 'Benefits View'
  | 'Calculator'
  | 'Summary'
  | 'Export Options';

export type DiscountMode = 'car_price' | 'down_payment';

export type LoanTermMonths = 48 | 60 | 72 | 84;

export interface BenefitItem {
  id: string;
  title: string;
  detail: string;
  included: boolean;
  category: 'insurance' | 'charging' | 'warranty' | 'accessories' | 'registration';
}

export interface CarModelConfig {
  id: 's05_max' | 'nevo_q05';
  name: string;
  brand: string;
  powertrain: string;
  tagline: string;
  imageUrl: string;
  normalPrice: number;
  defaultDiscount: number;
  defaultInterestRate: number;
  defaultBookingDeposit: number;
  defaultRedPlateDeposit: number;
  homeChargerLabel: string;
  lifetimeBatteryLabel: string;
  lifetimeBatteryPrice: number;
  vehicleWarranty: string;
  batteryWarranty: string;
  roadsideAssistance: string;
  registrationLabel: string;
  benefits: BenefitItem[];
}

export interface SalespersonSettings {
  showroomName: string;
  salespersonName: string;
  phone: string;
  lineId: string;
  quoteValidityDays: number;
}

export interface QuoteState {
  selectedModelId: 's05_max' | 'nevo_q05';
  customerName: string;
  customerPhone: string;
  discountMode: DiscountMode;
  discountAmount: number;
  includeVat7OnDiscount: boolean;
  downPaymentBaht: number;
  termMonths: LoanTermMonths;
  annualInterestRate: number;
  bookingDeposit: number;
  redPlateDeposit: number;
  includeLifetimeBatteryUpgrade: boolean;
  extraDeliveryFee: number;
  extraNote: string;
}

export interface TermCalculation {
  months: LoanTermMonths;
  years: number;
  financedAmount: number;
  totalInterest: number;
  totalPayable: number;
  monthlyInstallment: number;
}

export interface CalculatedQuote {
  normalPrice: number;
  discountAmount: number;
  discountMode: DiscountMode;
  specialCarPrice: number;
  vat7Amount: number;
  downPaymentNominal: number;
  downPaymentPercent: number;
  netDownPaymentPaid: number;
  financedAmount: number;
  annualInterestRate: number;
  termMonths: LoanTermMonths;
  totalInterest: number;
  totalPayable: number;
  monthlyInstallment: number;
  bookingDeposit: number;
  redPlateDeposit: number;
  lifetimeBatteryFee: number;
  extraDeliveryFee: number;
  totalDeliveryDayCost: number;
  allTerms: TermCalculation[];
}
