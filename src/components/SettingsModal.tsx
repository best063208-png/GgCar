import {RotateCcw, X} from 'lucide-react';
import {useState} from 'react';
import {CarModelConfig, SalespersonSettings} from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  models: CarModelConfig[];
  salesperson: SalespersonSettings;
  onSaveModels: (models: CarModelConfig[]) => void;
  onSaveSalesperson: (settings: SalespersonSettings) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  models,
  salesperson,
  onSaveModels,
  onSaveSalesperson,
  onResetDefaults,
  onClose,
}: SettingsModalProps) {
  const [draftModels, setDraftModels] = useState<CarModelConfig[]>(models);
  const [draftSales, setDraftSales] = useState<SalespersonSettings>(salesperson);

  if (!isOpen) return null;

  const updateModelField = (
    modelId: 's05_max' | 'nevo_q05',
    patch: Partial<CarModelConfig>
  ) => {
    setDraftModels((prev) =>
      prev.map((m) => (m.id === modelId ? {...m, ...patch} : m))
    );
  };

  const updateBenefitDetail = (
    modelId: 's05_max' | 'nevo_q05',
    benefitId: string,
    detail: string
  ) => {
    setDraftModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? {
              ...m,
              benefits: m.benefits.map((b) =>
                b.id === benefitId ? {...b, detail} : b
              ),
            }
          : m
      )
    );
  };

  const handleSaveAll = () => {
    onSaveModels(draftModels);
    onSaveSalesperson(draftSales);
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="ตั้งค่าแอปและข้อมูลราคา"
    >
      <div className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ตั้งค่าแอป ราคา และข้อมูลโชว์รูม
            </h2>
            <p className="text-xs text-slate-500">
              แก้ไขราคา ส่วนลด ดอกเบี้ย และโปรโมชั่นได้ทันที (บันทึกอัตโนมัติในเครื่อง)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่างตั้งค่า"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Showroom & Salesperson */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              ข้อมูลโชว์รูมและที่ปรึกษาการขาย
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ชื่อโชว์รูม
                </label>
                <input
                  type="text"
                  value={draftSales.showroomName}
                  onChange={(e) =>
                    setDraftSales({...draftSales, showroomName: e.target.value})
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ชื่อเซลส์
                </label>
                <input
                  type="text"
                  value={draftSales.salespersonName}
                  onChange={(e) =>
                    setDraftSales({...draftSales, salespersonName: e.target.value})
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  เบอร์โทรติดต่อ
                </label>
                <input
                  type="text"
                  value={draftSales.phone}
                  onChange={(e) =>
                    setDraftSales({...draftSales, phone: e.target.value})
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  LINE ID
                </label>
                <input
                  type="text"
                  value={draftSales.lineId}
                  onChange={(e) =>
                    setDraftSales({...draftSales, lineId: e.target.value})
                  }
                  className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Model Defaults */}
          {draftModels.map((m) => (
            <section key={m.id} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                ตั้งค่าเริ่มต้น: {m.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 tabular-nums">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ราคาปกติ (บาท)
                  </label>
                  <input
                    type="number"
                    value={m.normalPrice}
                    onChange={(e) =>
                      updateModelField(m.id, {
                        normalPrice: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ส่วนลดเริ่มต้น (บาท)
                  </label>
                  <input
                    type="number"
                    value={m.defaultDiscount}
                    onChange={(e) =>
                      updateModelField(m.id, {
                        defaultDiscount: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ดอกเบี้ยต่อปี (%)
                  </label>
                  <input
                    type="number"
                    step={0.05}
                    value={m.defaultInterestRate}
                    onChange={(e) =>
                      updateModelField(m.id, {
                        defaultInterestRate: Math.max(
                          0,
                          Number(e.target.value) || 0
                        ),
                      })
                    }
                    className="w-full min-h-[42px] px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-slate-600">
                  รายละเอียดสิทธิประโยชน์และโปรโมชั่น ({m.name})
                </p>
                {m.benefits.slice(0, 4).map((b) => (
                  <div key={b.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <span className="sm:col-span-4 text-xs font-medium text-slate-700 truncate">
                      {b.title}
                    </span>
                    <input
                      type="text"
                      value={b.detail}
                      onChange={(e) =>
                        updateBenefitDetail(m.id, b.id, e.target.value)
                      }
                      className="sm:col-span-8 min-h-[38px] px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onResetDefaults();
              onClose();
            }}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
