import {
  Calculator,
  Car,
  FileText,
  Gift,
  Send,
  Settings,
  Tag,
} from 'lucide-react';
import {ScreenId} from '../types';

interface ScreenNavProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenSettings: () => void;
}

const DESKTOP_LINKS: {id: ScreenId; label: string}[] = [
  {id: 'Model Selection', label: 'เลือกรุ่นรถ'},
  {id: 'Price/Offer Config', label: 'ราคารถ'},
  {id: 'Benefits View', label: 'สิทธิประโยชน์'},
  {id: 'Calculator', label: 'คำนวณค่างวด'},
  {id: 'Summary', label: 'ใบเสนอราคา'},
];

const MOBILE_TABS: {
  id: ScreenId;
  label: string;
  Icon: typeof Car;
}[] = [
  {id: 'Model Selection', label: 'รุ่นรถ', Icon: Car},
  {id: 'Price/Offer Config', label: 'ราคา', Icon: Tag},
  {id: 'Benefits View', label: 'สิทธิฯ', Icon: Gift},
  {id: 'Calculator', label: 'คำนวณ', Icon: Calculator},
  {id: 'Summary', label: 'ใบเสนอ', Icon: FileText},
];

export function ScreenNav({
  activeScreen,
  onSelectScreen,
  onOpenSettings,
}: ScreenNavProps) {
  return (
    <>
      {/* Top Bar Contract: 3 zones on desktop, compact 52px header on mobile */}
      <header className="no-print sticky top-0 z-30 h-13 lg:h-16 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto h-full px-4 lg:px-6 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onSelectScreen('Model Selection')}
            className="text-base lg:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
          >
            CAR SALES APP
          </button>

          {/* Zone 2: Clean single-line navigation links (Desktop) */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {DESKTOP_LINKS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectScreen(item.id)}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                    isActive
                      ? 'border-sky-600 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="ตั้งค่าแอป"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onSelectScreen('Export Options')}
              className={`min-h-[40px] lg:min-h-[40px] px-3.5 lg:px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
                activeScreen === 'Export Options'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>ส่งใบเสนอราคา</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Zone Navigation */}
      <nav
        aria-label="เมนูลัดมือถือ"
        className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16">
          {MOBILE_TABS.map(({id, label, Icon}) => {
            const isActive = activeScreen === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectScreen(id)}
                className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  isActive
                    ? 'text-sky-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon
                  className={`h-[21px] w-[21px] ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`}
                />
                <span className="text-[11px] leading-none mt-1 whitespace-nowrap">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
