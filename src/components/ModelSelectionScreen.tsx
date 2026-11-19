import {ArrowRight, Check, Scale, SlidersHorizontal} from 'lucide-react';
import {CarModelConfig, ScreenId} from '../types';
import {formatTHB} from '../utils/calculations';
import {VehicleImage} from './VehicleImage';

interface ModelSelectionScreenProps {
  models: CarModelConfig[];
  selectedModelId: 's05_max' | 'nevo_q05';
  onSelectModel: (modelId: 's05_max' | 'nevo_q05') => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenSettings: () => void;
}

export function ModelSelectionScreen({
  models,
  selectedModelId,
  onSelectModel,
  onNavigate,
  onOpenSettings,
}: ModelSelectionScreenProps) {
  const s05 = models.find((m) => m.id === 's05_max') ?? models[0];
  const q05 = models.find((m) => m.id === 'nevo_q05') ?? models[1];

  const getQuickMonthly60 = (model: CarModelConfig) => {
    const special = Math.max(0, model.normalPrice - model.defaultDiscount);
    const down = Math.round(special * 0.15);
    const financed = Math.max(0, special - down);
    const total = financed + Math.round(financed * (model.defaultInterestRate / 100) * 5);
    return Math.round(total / 60);
  };

  const getQuickMonthly72 = (model: CarModelConfig) => {
    const special = Math.max(0, model.normalPrice - model.defaultDiscount);
    const down = Math.round(special * 0.15);
    const financed = Math.max(0, special - down);
    const total = financed + Math.round(financed * (model.defaultInterestRate / 100) * 6);
    return Math.round(total / 72);
  };

  return (
    <div className="space-y-8">
      {/* Header row with workspace settings trigger */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-sky-700">
            เสนอราคารถยนต์ · ขั้นตอนที่ 1
          </p>
          <h1 className="mt-1 text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            เลือกโมเดลรถที่ต้องการเสนอราคา
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="self-start sm:self-auto min-h-[44px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span>ตั้งค่าราคาและโปรโมชั่น</span>
        </button>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => {
          const isSelected = model.id === selectedModelId;
          const specialPrice = Math.max(0, model.normalPrice - model.defaultDiscount);

          return (
            <div
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectModel(model.id);
                }
              }}
              className={`group text-left bg-white rounded-2xl overflow-hidden transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                isSelected
                  ? 'ring-2 ring-sky-600 shadow-md'
                  : 'border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <VehicleImage
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="p-5 lg:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      {model.brand} <span aria-hidden="true">·</span> {model.powertrain}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {model.name}
                    </h2>
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 shrink-0 pt-1">
                      <Check className="h-4 w-4" />
                      <span>รุ่นที่เลือก</span>
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {model.tagline}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between gap-4">
                  <div>
                    <span className="block text-xs text-slate-500">ราคาพิเศษ</span>
                    <span className="text-2xl font-bold text-slate-900 tabular-nums">
                      {formatTHB(specialPrice)}{' '}
                      <span className="text-sm font-medium text-slate-600">บาท</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-slate-500">ราคาปกติ</span>
                    <span className="text-sm font-medium text-slate-400 line-through tabular-nums">
                      {formatTHB(model.normalPrice)} บ.
                    </span>
                    <span className="block text-xs font-semibold text-sky-700 tabular-nums">
                      ส่วนลด {formatTHB(model.defaultDiscount)} บ.
                    </span>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModel(model.id);
                      onNavigate('Price/Offer Config');
                    }}
                    className="min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    กำหนดราคา
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModel(model.id);
                      onNavigate('Calculator');
                    }}
                    className="min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>คำนวณค่างวด</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-side Model Comparison Table (S05 MAX vs NEVO Q05) */}
      {s05 && q05 && (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 lg:px-6 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Scale className="h-5 w-5 text-sky-600 shrink-0" />
              <div>
                <h2 className="text-base lg:text-lg font-bold text-slate-900">
                  ตารางเปรียบเทียบ {s05.name} และ {q05.name}
                </h2>
                <p className="text-xs text-slate-500">
                  ตัวอย่างคำนวณดาวน์เริ่มต้น 15% และอัตราดอกเบี้ยตามค่าเริ่มต้นของแต่ละรุ่น
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                  <th className="py-3 px-5 font-semibold">รายการเปรียบเทียบ</th>
                  <th className="py-3 px-4 font-semibold text-slate-900">
                    {s05.name}
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-900">
                    {q05.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                <tr>
                  <td className="py-3 px-5 text-slate-600">ราคาปกติ</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {formatTHB(s05.normalPrice)} บาท
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {formatTHB(q05.normalPrice)} บาท
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">ราคาพิเศษหลังหักส่วนลด</td>
                  <td className="py-3 px-4 font-bold text-sky-700">
                    {formatTHB(Math.max(0, s05.normalPrice - s05.defaultDiscount))} บาท
                  </td>
                  <td className="py-3 px-4 font-bold text-sky-700">
                    {formatTHB(Math.max(0, q05.normalPrice - q05.defaultDiscount))} บาท
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">ดาวน์ตัวอย่าง (15%)</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {formatTHB(
                      Math.round(Math.max(0, s05.normalPrice - s05.defaultDiscount) * 0.15)
                    )}{' '}
                    บาท
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {formatTHB(
                      Math.round(Math.max(0, q05.normalPrice - q05.defaultDiscount) * 0.15)
                    )}{' '}
                    บาท
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">ผ่อน 60 เดือน (ประมาณ)</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatTHB(getQuickMonthly60(s05))} บาท/ด.
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatTHB(getQuickMonthly60(q05))} บาท/ด.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">ผ่อน 72 เดือน (ประมาณ)</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatTHB(getQuickMonthly72(s05))} บาท/ด.
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatTHB(getQuickMonthly72(q05))} บาท/ด.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">โฮมชาร์จเจอร์</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.homeChargerLabel}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {q05.homeChargerLabel}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">Lifetime Battery</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.lifetimeBatteryLabel}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {q05.lifetimeBatteryLabel}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">รับประกันตัวรถ</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.vehicleWarranty}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {q05.vehicleWarranty}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">รับประกันแบตเตอรี่</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.batteryWarranty}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {q05.batteryWarranty}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">บริการช่วยเหลือฉุกเฉิน</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.roadsideAssistance}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {q05.roadsideAssistance}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-5 text-slate-600">ค่าจดทะเบียน</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {s05.registrationLabel}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {q05.registrationLabel}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
            ตัวเลขเป็นข้อมูลตามใบเสนอราคาและโปรโมชั่นปัจจุบัน หน่วยราคาเป็นบาท ค่างวดเป็นการคำนวณแบบ Flat Rate โดยประมาณ
          </div>
        </section>
      )}
    </div>
  );
}
