import {ArrowLeft, ArrowRight} from 'lucide-react';
import {
  CalculatedQuote,
  CarModelConfig,
  QuoteState,
  ScreenId,
} from '../types';
import {formatTHB} from '../utils/calculations';
import {VehicleImage} from './VehicleImage';

interface PriceOfferScreenProps {
  model: CarModelConfig;
  quote: QuoteState;
  calc: CalculatedQuote;
  onUpdateQuote: (patch: Partial<QuoteState>) => void;
  onUpdateModelPrice: (modelId: 's05_max' | 'nevo_q05', normalPrice: number) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function PriceOfferScreen({
  model,
  quote,
  calc,
  onUpdateQuote,
  onUpdateModelPrice,
  onNavigate,
}: PriceOfferScreenProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-sky-700">
            ขั้นตอนที่ 2 · {model.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            รายละเอียดราคาและค่าใช้จ่ายวันรับรถ
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Model Selection')}
          className="self-start min-h-[44px] px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>เปลี่ยนรุ่นรถ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 space-y-6">
          {/* Customer Info (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อลูกค้า (ถ้ามี)
              </label>
              <input
                type="text"
                value={quote.customerName}
                onChange={(e) => onUpdateQuote({customerName: e.target.value})}
                placeholder="เช่น คุณสมชาย"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เบอร์โทรลูกค้า (ถ้ามี)
              </label>
              <input
                type="tel"
                value={quote.customerPhone}
                onChange={(e) => onUpdateQuote({customerPhone: e.target.value})}
                placeholder="08x-xxx-xxxx"
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Car Price & Discount */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ราคารถปกติ (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={model.normalPrice}
                  onChange={(e) =>
                    onUpdateModelPrice(
                      model.id,
                      Math.max(0, Number(e.target.value) || 0)
                    )
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ส่วนลดที่มอบให้ (บาท)
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
            </div>

            {/* Discount Mode Selector */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                รูปแบบการใช้ส่วนลด
              </span>
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
            </div>

            {/* VAT 7% on discount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  ภาษีมูลค่าเพิ่ม VAT 7% จากส่วนลด
                </p>
                <p className="text-xs text-slate-500 tabular-nums">
                  {quote.includeVat7OnDiscount
                    ? `เรียกเก็บจากลูกค้า ${formatTHB(calc.vat7Amount)} บาท ในวันรับรถ`
                    : 'ไม่เรียกเก็บ VAT 7% จากส่วนลดเพิ่มเติม'}
                </p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => onUpdateQuote({includeVat7OnDiscount: false})}
                  className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    !quote.includeVat7OnDiscount
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  ไม่เก็บ
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateQuote({includeVat7OnDiscount: true})}
                  className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    quote.includeVat7OnDiscount
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  เก็บ 7%
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Delivery Deposits & Fees */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              เงินจองและค่าใช้จ่ายวันรับรถ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  เงินจองที่ชำระแล้ว (หักออก)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={quote.bookingDeposit}
                  onChange={(e) =>
                    onUpdateQuote({
                      bookingDeposit: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ค่ามัดจำป้ายแดง (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={quote.redPlateDeposit}
                  onChange={(e) =>
                    onUpdateQuote({
                      redPlateDeposit: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ค่าใช้จ่ายอื่น ๆ (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={quote.extraDeliveryFee}
                  onChange={(e) =>
                    onUpdateQuote({
                      extraDeliveryFee: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white tabular-nums"
                />
              </div>
            </div>

            {model.lifetimeBatteryPrice > 0 && (
              <label className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    อัปเกรด Lifetime Battery Warranty
                  </span>
                  <span className="block text-xs text-slate-500">
                    เฉพาะรุ่น {model.name} (+{formatTHB(model.lifetimeBatteryPrice)} บาท)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={quote.includeLifetimeBatteryUpgrade}
                  onChange={(e) =>
                    onUpdateQuote({
                      includeLifetimeBatteryUpgrade: e.target.checked,
                    })
                  }
                  className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                />
              </label>
            )}
          </div>
        </div>

        {/* Right: Live Price & Delivery Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="aspect-[16/9] w-full bg-slate-100">
              <VehicleImage
                src={model.imageUrl}
                alt={model.name}
                className="w-full h-full"
              />
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-slate-900">{model.name}</h3>
                <span className="text-xs font-medium text-slate-500">
                  {model.powertrain}
                </span>
              </div>

              <div className="space-y-2.5 text-sm tabular-nums pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-600">ราคารถปกติ</span>
                  <span className="font-medium text-slate-900">
                    {formatTHB(calc.normalPrice)} บาท
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    {quote.discountMode === 'car_price'
                      ? 'หักส่วนลดตัวรถ'
                      : 'ส่วนลดเงินดาวน์'}
                  </span>
                  <span className="font-semibold text-sky-700">
                    -{formatTHB(calc.discountAmount)} บาท
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-bold text-slate-900">
                  <span>ราคาสุทธิตัวรถ</span>
                  <span>{formatTHB(calc.specialCarPrice)} บาท</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 tabular-nums">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>เงินดาวน์สุทธิ ({calc.downPaymentPercent}%)</span>
                  <span>{formatTHB(calc.netDownPaymentPaid)} บาท</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>หักเงินจอง</span>
                  <span>-{formatTHB(calc.bookingDeposit)} บาท</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>บวกมัดจำป้ายแดง</span>
                  <span>+{formatTHB(calc.redPlateDeposit)} บาท</span>
                </div>
                {calc.vat7Amount > 0 && (
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>บวก VAT 7% จากส่วนลด</span>
                    <span>+{formatTHB(calc.vat7Amount)} บาท</span>
                  </div>
                )}
                {calc.lifetimeBatteryFee > 0 && (
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>บวก Lifetime Battery</span>
                    <span>+{formatTHB(calc.lifetimeBatteryFee)} บาท</span>
                  </div>
                )}
                {calc.extraDeliveryFee > 0 && (
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>บวกค่าใช้จ่ายอื่น ๆ</span>
                    <span>+{formatTHB(calc.extraDeliveryFee)} บาท</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-700 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    รวมจ่ายวันรับรถสุทธิ
                  </span>
                  <span className="text-xl font-bold text-sky-400">
                    {formatTHB(calc.totalDeliveryDayCost)} บาท
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('Benefits View')}
                  className="min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ดูสิทธิประโยชน์
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('Calculator')}
                  className="min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>คำนวณค่างวด</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
