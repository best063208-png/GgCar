/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Settings} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {BenefitsScreen} from './components/BenefitsScreen';
import {CalculatorScreen} from './components/CalculatorScreen';
import {ExportScreen} from './components/ExportScreen';
import {ModelSelectionScreen} from './components/ModelSelectionScreen';
import {PriceOfferScreen} from './components/PriceOfferScreen';
import {ScreenNav} from './components/ScreenNav';
import {SettingsModal} from './components/SettingsModal';
import {SummaryScreen} from './components/SummaryScreen';
import {
  createInitialQuoteForModel,
  DEFAULT_MODELS,
  DEFAULT_SALESPERSON,
  loadSavedModels,
  loadSavedSalesperson,
  STORAGE_KEYS,
} from './data/defaultModels';
import {
  CarModelConfig,
  QuoteState,
  SalespersonSettings,
  ScreenId,
} from './types';
import {calculateQuote, formatTHB} from './utils/calculations';

const SCREEN_ORDER: {id: ScreenId; label: string}[] = [
  {id: 'Model Selection', label: '1. เลือกรุ่นรถ'},
  {id: 'Price/Offer Config', label: '2. ราคารถและค่าใช้จ่าย'},
  {id: 'Benefits View', label: '3. สิทธิประโยชน์'},
  {id: 'Calculator', label: '4. คำนวณค่างวด'},
  {id: 'Summary', label: '5. สรุปใบเสนอราคา'},
  {id: 'Export Options', label: '6. ส่งให้ลูกค้า'},
];

export default function App() {
  const [activeScreen, setActiveScreen] =
    useState<ScreenId>('Model Selection');
  const [models, setModels] = useState<CarModelConfig[]>(() =>
    loadSavedModels()
  );
  const [salesperson, setSalesperson] = useState<SalespersonSettings>(() =>
    loadSavedSalesperson()
  );
  const [quote, setQuote] = useState<QuoteState>(() => {
    const initialModels = loadSavedModels();
    return createInitialQuoteForModel(initialModels[0]);
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedModel = useMemo(
    () => models.find((m) => m.id === quote.selectedModelId) ?? models[0],
    [models, quote.selectedModelId]
  );

  const calculated = useMemo(
    () => calculateQuote(selectedModel, quote),
    [selectedModel, quote]
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
    } catch {
      // Ignore storage quota errors
    }
  }, [models]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SALESPERSON,
        JSON.stringify(salesperson)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [salesperson]);

  const handleSelectScreen = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSelectModel = (modelId: 's05_max' | 'nevo_q05') => {
    if (modelId === quote.selectedModelId) return;
    const targetModel = models.find((m) => m.id === modelId);
    if (!targetModel) return;

    const special = Math.max(
      0,
      targetModel.normalPrice - targetModel.defaultDiscount
    );
    setQuote((prev) => ({
      ...prev,
      selectedModelId: modelId,
      discountAmount: targetModel.defaultDiscount,
      annualInterestRate: targetModel.defaultInterestRate,
      bookingDeposit: targetModel.defaultBookingDeposit,
      redPlateDeposit: targetModel.defaultRedPlateDeposit,
      downPaymentBaht: Math.round(special * 0.15),
      includeLifetimeBatteryUpgrade: modelId === 's05_max' ? false : true,
    }));
  };

  const handleUpdateQuote = (patch: Partial<QuoteState>) => {
    setQuote((prev) => ({...prev, ...patch}));
  };

  const handleUpdateModelPrice = (
    modelId: 's05_max' | 'nevo_q05',
    normalPrice: number
  ) => {
    setModels((prev) =>
      prev.map((m) => (m.id === modelId ? {...m, normalPrice} : m))
    );
  };

  const handleToggleBenefit = (
    modelId: 's05_max' | 'nevo_q05',
    benefitId: string
  ) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? {
              ...m,
              benefits: m.benefits.map((b) =>
                b.id === benefitId ? {...b, included: !b.included} : b
              ),
            }
          : m
      )
    );
  };

  const handleResetDefaults = () => {
    setModels(DEFAULT_MODELS);
    setSalesperson(DEFAULT_SALESPERSON);
    const defaultTarget =
      DEFAULT_MODELS.find((m) => m.id === quote.selectedModelId) ??
      DEFAULT_MODELS[0];
    setQuote(createInitialQuoteForModel(defaultTarget));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <ScreenNav
        activeScreen={activeScreen}
        onSelectScreen={handleSelectScreen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Workspace Quick Context & 6-Step Progress Rail */}
      <div className="no-print bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 tabular-nums">
            <span className="font-bold text-slate-900">{selectedModel.name}</span>
            <span aria-hidden="true">·</span>
            <span>ราคาสุทธิ {formatTHB(calculated.specialCarPrice)} บ.</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline font-semibold text-sky-700">
              ผ่อน {formatTHB(calculated.monthlyInstallment)} บ./ด. ({calculated.termMonths}{' '}
              งวด)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>ตั้งค่าราคาและโชว์รูม</span>
            </button>
          </div>
        </div>

        {/* Scrollable 6-screen flow indicator */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6 pb-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {SCREEN_ORDER.map((step) => {
              const isActive = activeScreen === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleSelectScreen(step.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-6 pt-6 pb-24 lg:pb-12">
        <div className={activeScreen === 'Export Options' ? 'no-print' : ''}>
          {activeScreen === 'Model Selection' && (
            <ModelSelectionScreen
              models={models}
              selectedModelId={quote.selectedModelId}
              onSelectModel={handleSelectModel}
              onNavigate={handleSelectScreen}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeScreen === 'Price/Offer Config' && (
            <PriceOfferScreen
              model={selectedModel}
              quote={quote}
              calc={calculated}
              onUpdateQuote={handleUpdateQuote}
              onUpdateModelPrice={handleUpdateModelPrice}
              onNavigate={handleSelectScreen}
            />
          )}

          {activeScreen === 'Benefits View' && (
            <BenefitsScreen
              model={selectedModel}
              quote={quote}
              onToggleBenefit={handleToggleBenefit}
              onToggleLifetimeUpgrade={(checked) =>
                handleUpdateQuote({includeLifetimeBatteryUpgrade: checked})
              }
              onNavigate={handleSelectScreen}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {activeScreen === 'Calculator' && (
            <CalculatorScreen
              model={selectedModel}
              quote={quote}
              calc={calculated}
              onUpdateQuote={handleUpdateQuote}
              onNavigate={handleSelectScreen}
            />
          )}

          {activeScreen === 'Summary' && (
            <SummaryScreen
              model={selectedModel}
              quote={quote}
              calc={calculated}
              salesperson={salesperson}
              onUpdateQuote={handleUpdateQuote}
              onNavigate={handleSelectScreen}
            />
          )}

          {activeScreen === 'Export Options' && (
            <ExportScreen
              model={selectedModel}
              quote={quote}
              calc={calculated}
              salesperson={salesperson}
            />
          )}
        </div>

        {/* Dedicated Print-Only A4 Quotation when printing from Export Options */}
        {activeScreen === 'Export Options' && (
          <div className="hidden print:block">
            <SummaryScreen
              model={selectedModel}
              quote={quote}
              calc={calculated}
              salesperson={salesperson}
              onUpdateQuote={handleUpdateQuote}
              onNavigate={handleSelectScreen}
            />
          </div>
        )}
      </main>

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          models={models}
          salesperson={salesperson}
          onSaveModels={(updated) => {
            setModels(updated);
            const active = updated.find((m) => m.id === quote.selectedModelId);
            if (active) {
              setQuote((prev) => ({
                ...prev,
                discountAmount: active.defaultDiscount,
                annualInterestRate: active.defaultInterestRate,
              }));
            }
          }}
          onSaveSalesperson={setSalesperson}
          onResetDefaults={handleResetDefaults}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
