import {ArrowRight, Info} from 'lucide-react';
import {
  CalculatedQuote,
  CarModelConfig,
  QuoteState,
  ScreenId,
} from '../types';
import {formatTHB, LOAN_TERMS} from '../utils/calculations';

interface CalculatorScreenProps {
  model: CarModelConfig;
  quote: QuoteState;
  calc: CalculatedQuote;
  onUpdateQuote: (patch: Partial<QuoteState>) => void;
  onNavigate: (screen: ScreenId) => void;
}

const DOWN_PERCENT_PRESETS = [0, 10, 15, 20, 25, 30];

export function CalculatorScreen({
  model,
  quote,
  calc,
  onUpdateQuote,
  onNavigate,
}: CalculatorScreenProps) {
  const handleDownPercentClick = (percent: number) => {
    const newDown = Math.round((calc.specialCarPrice * percent) / 100);
    onUpdateQuote({downPaymentBaht: newDown});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-sky-700">
            ขั้นตอนที่ 4 · {model.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            คำนวณเงินดาวน์และค่างวด (Flat Rate)
          </h1>
        </div>
        <div className="text-left sm:text-right tabular-nums">
          <span className="text-xs text-slate-500">ราคาปกติ </span>
          <span className="text-sm font-bold text-slate-900">
            {formatTHB(calc.normalPrice)} บาท
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Controls */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 space-y-6">
          {/* Discount Type & Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                เลือกรูปแบบส่วนลด
              </span>
              <span className="text-xs font-medium text-slate-500 tabular-nums">
                ราคาพิเศษสุทธิ {formatTHB(calc.specialCarPrice)} บาท
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => onUpdateQuote({discountMode: 'car_price'})}
                className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  quote.discountMode === 'car_price'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. ส่วนลดราคาตัวรถ
              </button>
              <button
                type="button"
                onClick={() => onUpdateQuote({discountMode: 'down_payment'})}
                className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                  quote.discountMode === 'down_payment'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. ส่วนลดเงินดาวน์
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  จำนวนส่วนลด (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={quote.discountAmount}
                  onChange={(e) =>
                    onUpdateQuote({
                      discountAmount: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                  VAT 7% จากส่วนลด
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl h-[44px]">
                  <button
                    type="button"
                    onClick={() => onUpdateQuote({includeVat7OnDiscount: false})}
                    className={`text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      !quote.includeVat7OnDiscount
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    ไม่เก็บ VAT 7%
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateQuote({includeVat7OnDiscount: true})}
                    className={`text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      quote.includeVat7OnDiscount
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    เก็บ ({formatTHB(Math.round(quote.discountAmount * 0.07))} บ.)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Down Payment */}
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-semibold text-slate-700">
                เงินดาวน์ (บาท)
              </label>
              <span className="text-xs font-semibold text-sky-700 tabular-nums">
                คิดเป็น {calc.downPaymentPercent}% ของราคารถ
              </span>
            </div>

            <input
              type="number"
              min={0}
              max={calc.specialCarPrice}
              step={5000}
              value={quote.downPaymentBaht}
              onChange={(e) =>
                onUpdateQuote({
                  downPaymentBaht: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-full min-h-[48px] px-4 py-2 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
            />

            <div className="grid grid-cols-6 gap-1.5">
              {DOWN_PERCENT_PRESETS.map((pct) => {
                const isClose = Math.abs(calc.downPaymentPercent - pct) < 0.2;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleDownPercentClick(pct)}
                    className={`min-h-[40px] py-1.5 text-xs font-semibold rounded-lg transition-colors tabular-nums cursor-pointer ${
                      isClose
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>

            {quote.discountMode === 'down_payment' && (
              <p className="text-xs text-sky-700 font-medium tabular-nums">
                ใช้ส่วนลดเงินดาวน์ {formatTHB(calc.discountAmount)} บาท — ลูกค้าจ่ายดาวน์จริง{' '}
                {formatTHB(calc.netDownPaymentPaid)} บาท
              </p>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Term & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-8">
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                จำนวนงวด (เดือน)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {LOAN_TERMS.map((term) => {
                  const isActive = quote.termMonths === term;
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => onUpdateQuote({termMonths: term})}
                      className={`min-h-[44px] py-2 text-sm font-bold rounded-xl transition-colors tabular-nums cursor-pointer ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {term}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ดอกเบี้ยต่อปี (%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.05}
                value={quote.annualInterestRate}
                onChange={(e) =>
                  onUpdateQuote({
                    annualInterestRate: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Right: Primary Live Calculation Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-xs font-medium text-sky-400">
                ค่างวดต่อเดือนโดยประมาณ ({calc.termMonths} เดือน)
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
                {formatTHB(calc.monthlyInstallment)}{' '}
                <span className="text-base font-medium text-slate-300">บาท/เดือน</span>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-sm tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">ราคาพิเศษตัวรถ</span>
                <span className="font-semibold text-white">
                  {formatTHB(calc.specialCarPrice)} บาท
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  เงินดาวน์ ({calc.downPaymentPercent}%)
                </span>
                <span className="font-semibold text-white">
                  {formatTHB(calc.downPaymentNominal)} บาท
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ยอดจัดไฟแนนซ์</span>
                <span className="font-bold text-sky-400">
                  {formatTHB(calc.financedAmount)} บาท
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  ดอกเบี้ยทั้งหมด ({calc.annualInterestRate}% x {calc.termMonths / 12} ปี)
                </span>
                <span className="font-semibold text-white">
                  {formatTHB(calc.totalInterest)} บาท
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-medium">ยอดชำระรวมทั้งหมด</span>
                <span className="font-bold text-white">
                  {formatTHB(calc.totalPayable)} บาท
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                ตัวอย่างคำนวณดอกเบี้ยแบบ Flat Rate เพื่อแสดงแนวทางเท่านั้น ยังไม่รวมค่าใช้จ่ายอื่นและเงื่อนไขไฟแนนซ์
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('Summary')}
              className="w-full min-h-[48px] px-4 py-3 text-sm font-semibold rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>สร้างใบเสนอราคา</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 48 / 60 / 72 / 84 Months Comparison Table */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">
            ตารางผ่อนชำระทุกงวด (ยอดจัด {formatTHB(calc.financedAmount)} บาท)
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            ดอกเบี้ย {calc.annualInterestRate}% ต่อปี
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-5 font-semibold">จำนวนงวด</th>
                <th className="py-3 px-4 font-semibold">ค่างวดต่อเดือน</th>
                <th className="py-3 px-4 font-semibold">ดอกเบี้ยทั้งหมด</th>
                <th className="py-3 px-4 font-semibold">ยอดชำระรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {calc.allTerms.map((term) => {
                const isSelected = term.months === quote.termMonths;
                return (
                  <tr
                    key={term.months}
                    onClick={() => onUpdateQuote({termMonths: term.months})}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {term.months} เดือน ({term.years} ปี)
                      {isSelected && (
                        <span className="ml-2 text-xs font-semibold text-sky-700">
                          (ที่เลือก)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatTHB(term.monthlyInstallment)} บาท
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {formatTHB(term.totalInterest)} บาท
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {formatTHB(term.totalPayable)} บาท
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
