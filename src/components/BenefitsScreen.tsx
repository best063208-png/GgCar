import {ArrowRight, Check, Info, ShieldCheck} from 'lucide-react';
import {CarModelConfig, QuoteState, ScreenId} from '../types';
import {formatTHB} from '../utils/calculations';

interface BenefitsScreenProps {
  model: CarModelConfig;
  quote: QuoteState;
  onToggleBenefit: (modelId: 's05_max' | 'nevo_q05', benefitId: string) => void;
  onToggleLifetimeUpgrade: (checked: boolean) => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
}

export function BenefitsScreen({
  model,
  quote,
  onToggleBenefit,
  onToggleLifetimeUpgrade,
  onNavigate,
  onOpenSettings,
}: BenefitsScreenProps) {
  const includedCount = model.benefits.filter((b) => b.included).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-sky-700">
            ขั้นตอนที่ 3 · {model.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            สิทธิประโยชน์ ของแถม และการรับประกัน
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="self-start sm:self-auto min-h-[44px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          แก้ไขรายการโปรโมชั่น
        </button>
      </div>

      {/* Model-specific condition highlight grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">โฮมชาร์จเจอร์</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.homeChargerLabel}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Lifetime Battery Warranty</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.lifetimeBatteryLabel}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">ค่าจดทะเบียน</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.registrationLabel}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">รับประกันคุณภาพตัวรถ</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.vehicleWarranty}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">รับประกันแบตเตอรี่</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.batteryWarranty}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">บริการช่วยเหลือฉุกเฉิน</p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {model.roadsideAssistance}
          </p>
        </div>
      </div>

      {/* Interactive Benefits Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              รายการสิทธิประโยชน์ที่จะแสดงในใบเสนอราคา
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 tabular-nums">
            เลือกอยู่ {includedCount} / {model.benefits.length} รายการ
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {model.benefits.map((item) => {
            const isLifetimeRow = item.id === 's05-lbw';
            const checked = isLifetimeRow
              ? quote.includeLifetimeBatteryUpgrade
              : item.included;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isLifetimeRow) {
                    onToggleLifetimeUpgrade(!quote.includeLifetimeBatteryUpgrade);
                  }
                  onToggleBenefit(model.id, item.id);
                }}
                className="w-full min-h-[64px] px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-transparent border border-slate-300'
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        checked ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold shrink-0 ${
                    checked ? 'text-sky-700' : 'text-slate-400'
                  }`}
                >
                  {isLifetimeRow && checked && model.lifetimeBatteryPrice > 0
                    ? `+${formatTHB(model.lifetimeBatteryPrice)} บ.`
                    : checked
                      ? 'รวมในข้อเสนอ'
                      : 'ไม่รวม'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            เงื่อนไขของรุ่น {model.name} แยกตามสิทธิ์ประจำรุ่นโดยเฉพาะ เซลส์สามารถแตะเปิด/ปิดรายการให้ตรงกับข้อเสนอจริงที่ตกลงกับลูกค้าได้ทันที
          </span>
        </div>
      </div>

      {/* Step Footer Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('Price/Offer Config')}
          className="min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          ย้อนกลับ: ราคารถ
        </button>
        <button
          type="button"
          onClick={() => onNavigate('Summary')}
          className="min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>ดูสรุปใบเสนอราคา</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
