import {Check, Printer, Send} from 'lucide-react';
import {
  CalculatedQuote,
  CarModelConfig,
  QuoteState,
  SalespersonSettings,
  ScreenId,
} from '../types';
import {formatTHB} from '../utils/calculations';
import {VehicleImage} from './VehicleImage';

interface SummaryScreenProps {
  model: CarModelConfig;
  quote: QuoteState;
  calc: CalculatedQuote;
  salesperson: SalespersonSettings;
  onUpdateQuote: (patch: Partial<QuoteState>) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function SummaryScreen({
  model,
  quote,
  calc,
  salesperson,
  onUpdateQuote,
  onNavigate,
}: SummaryScreenProps) {
  const includedBenefits = model.benefits.filter((b) =>
    b.id === 's05-lbw' ? quote.includeLifetimeBatteryUpgrade : b.included
  );

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-sky-700">
            ขั้นตอนที่ 5 · ใบเสนอราคา
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            สรุปใบเสนอราคาฉบับสมบูรณ์
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>พิมพ์ / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('Export Options')}
            className="min-h-[44px] px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>ส่งให้ลูกค้า</span>
          </button>
        </div>
      </div>

      {/* Printable Quotation Sheet */}
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden print:border-0 print:rounded-none">
        {/* Top Showroom Banner */}
        <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-sky-400 font-medium">
              {salesperson.showroomName}
            </p>
            <h2 className="mt-0.5 text-xl font-bold">
              ใบเสนอราคารถยนต์ {model.name}
            </h2>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-300 space-y-0.5">
            {quote.customerName.trim() && (
              <p className="text-sm font-semibold text-white">
                เรียนคุณ {quote.customerName.trim()}
              </p>
            )}
            <p>
              ยืนราคาภายใน {salesperson.quoteValidityDays} วัน
            </p>
          </div>
        </div>

        {/* Vehicle & Key Numbers */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-200">
          <div className="md:col-span-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
              <VehicleImage
                src={model.imageUrl}
                alt={model.name}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-4 tabular-nums">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500">ราคาพิเศษสุทธิ</p>
              <p className="mt-1 text-xl lg:text-2xl font-bold text-slate-900">
                {formatTHB(calc.specialCarPrice)} บ.
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                จากปกติ {formatTHB(calc.normalPrice)} บ.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
              <p className="text-xs text-sky-700 font-medium">
                ค่างวด ({calc.termMonths} เดือน)
              </p>
              <p className="mt-1 text-xl lg:text-2xl font-bold text-slate-900">
                {formatTHB(calc.monthlyInstallment)} บ./ด.
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                ดอกเบี้ย {calc.annualInterestRate}% ต่อปี
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500">
                เงินดาวน์ ({calc.downPaymentPercent}%)
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatTHB(calc.downPaymentNominal)} บ.
              </p>
              {quote.discountMode === 'down_payment' && (
                <p className="mt-0.5 text-xs text-sky-700 font-medium">
                  จ่ายจริง {formatTHB(calc.netDownPaymentPaid)} บ.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500">ยอดจัดไฟแนนซ์</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatTHB(calc.financedAmount)} บ.
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Flat Rate</p>
            </div>
          </div>
        </div>

        {/* Itemized Delivery & Benefits */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Expenses */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              รายละเอียดค่าใช้จ่ายวันรับรถ
            </h3>
            <div className="space-y-2 text-sm tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">เงินดาวน์สุทธิที่ชำระ</span>
                <span className="font-medium text-slate-900">
                  {formatTHB(calc.netDownPaymentPaid)} บาท
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">หักเงินจอง</span>
                <span className="font-medium text-slate-900">
                  -{formatTHB(calc.bookingDeposit)} บาท
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">ค่ามัดจำป้ายแดง (ได้คืน)</span>
                <span className="font-medium text-slate-900">
                  +{formatTHB(calc.redPlateDeposit)} บาท
                </span>
              </div>
              {calc.vat7Amount > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">VAT 7% จากส่วนลด</span>
                  <span className="font-medium text-slate-900">
                    +{formatTHB(calc.vat7Amount)} บาท
                  </span>
                </div>
              )}
              {calc.lifetimeBatteryFee > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Lifetime Battery Warranty</span>
                  <span className="font-medium text-slate-900">
                    +{formatTHB(calc.lifetimeBatteryFee)} บาท
                  </span>
                </div>
              )}
              {calc.extraDeliveryFee > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">ค่าใช้จ่ายเพิ่มเติม</span>
                  <span className="font-medium text-slate-900">
                    +{formatTHB(calc.extraDeliveryFee)} บาท
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold text-slate-900">
                <span>รวมจ่ายวันรับรถสุทธิ</span>
                <span className="text-sky-700">
                  {formatTHB(calc.totalDeliveryDayCost)} บาท
                </span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              สิทธิประโยชน์และของแถม ({includedBenefits.length} รายการ)
            </h3>
            <ul className="space-y-2 text-sm">
              {includedBenefits.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="text-slate-500"> — {item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extra Salesperson Note */}
        <div className="px-6 pb-6">
          <div className="no-print">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              หมายเหตุเพิ่มเติมถึงลูกค้า (แสดงในใบเสนอราคา)
            </label>
            <input
              type="text"
              value={quote.extraNote}
              onChange={(e) => onUpdateQuote({extraNote: e.target.value})}
              placeholder="เช่น พร้อมส่งมอบภายในเดือนนี้ หรือ แถมฟิล์มเซรามิกเกรดพรีเมียม"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white"
            />
          </div>
          {quote.extraNote.trim() && (
            <p className="hidden print:block text-sm text-slate-700 pt-2">
              หมายเหตุ: {quote.extraNote}
            </p>
          )}
        </div>

        {/* Salesperson Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900">
              {salesperson.salespersonName}
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>โทร {salesperson.phone}</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>LINE {salesperson.lineId}</span>
          </div>
          <span className="text-slate-500">
            *ค่างวดเป็นค่าประมาณแบบ Flat Rate เงื่อนไขขึ้นอยู่กับสถาบันการเงิน
          </span>
        </div>
      </article>
    </div>
  );
}
