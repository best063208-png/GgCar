import {
  CalculatedQuote,
  CarModelConfig,
  LoanTermMonths,
  QuoteState,
  TermCalculation,
} from '../types';

export const LOAN_TERMS: LoanTermMonths[] = [48, 60, 72, 84];

export const formatTHB = (amount: number): string => {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat('th-TH').format(safe);
};

export const calculateTerm = (
  financedAmount: number,
  annualInterestRate: number,
  months: LoanTermMonths
): TermCalculation => {
  const safeFinanced = Math.max(0, financedAmount);
  const safeRate = Math.max(0, annualInterestRate);
  const years = months / 12;
  const totalInterest = Math.round(safeFinanced * (safeRate / 100) * years);
  const totalPayable = safeFinanced + totalInterest;
  const monthlyInstallment = months > 0 ? Math.round(totalPayable / months) : 0;

  return {
    months,
    years,
    financedAmount: safeFinanced,
    totalInterest,
    totalPayable,
    monthlyInstallment,
  };
};

export const calculateQuote = (
  model: CarModelConfig,
  quote: QuoteState
): CalculatedQuote => {
  const normalPrice = Math.max(0, model.normalPrice);
  const discountAmount = Math.max(0, quote.discountAmount);

  const vat7Amount = quote.includeVat7OnDiscount
    ? Math.round(discountAmount * 0.07)
    : 0;

  // Mode 1: Discount reduces car price directly -> lower financed principal
  // Mode 2: Discount subsidizes down payment -> car price stays normal, customer pays less cash down
  const specialCarPrice =
    quote.discountMode === 'car_price'
      ? Math.max(0, normalPrice - discountAmount)
      : normalPrice;

  const downPaymentNominal = Math.max(
    0,
    Math.min(quote.downPaymentBaht, specialCarPrice)
  );

  const downPaymentPercent =
    specialCarPrice > 0
      ? Math.round((downPaymentNominal / specialCarPrice) * 1000) / 10
      : 0;

  const netDownPaymentPaid =
    quote.discountMode === 'down_payment'
      ? Math.max(0, downPaymentNominal - discountAmount)
      : downPaymentNominal;

  const financedAmount = Math.max(0, specialCarPrice - downPaymentNominal);

  const allTerms = LOAN_TERMS.map((months) =>
    calculateTerm(financedAmount, quote.annualInterestRate, months)
  );

  const activeTerm =
    allTerms.find((t) => t.months === quote.termMonths) ?? allTerms[1];

  const lifetimeBatteryFee =
    quote.includeLifetimeBatteryUpgrade && model.lifetimeBatteryPrice > 0
      ? model.lifetimeBatteryPrice
      : 0;

  const totalDeliveryDayCost = Math.max(
    0,
    netDownPaymentPaid -
      quote.bookingDeposit +
      quote.redPlateDeposit +
      vat7Amount +
      lifetimeBatteryFee +
      quote.extraDeliveryFee
  );

  return {
    normalPrice,
    discountAmount,
    discountMode: quote.discountMode,
    specialCarPrice,
    vat7Amount,
    downPaymentNominal,
    downPaymentPercent,
    netDownPaymentPaid,
    financedAmount,
    annualInterestRate: quote.annualInterestRate,
    termMonths: quote.termMonths,
    totalInterest: activeTerm.totalInterest,
    totalPayable: activeTerm.totalPayable,
    monthlyInstallment: activeTerm.monthlyInstallment,
    bookingDeposit: quote.bookingDeposit,
    redPlateDeposit: quote.redPlateDeposit,
    lifetimeBatteryFee,
    extraDeliveryFee: quote.extraDeliveryFee,
    totalDeliveryDayCost,
    allTerms,
  };
};
