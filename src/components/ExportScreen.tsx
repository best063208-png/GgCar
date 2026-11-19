import {useEffect, useState} from 'react';
import {
  Check,
  Copy,
  Download,
  FileDown,
  MessageCircle,
  Printer,
} from 'lucide-react';
import {
  CalculatedQuote,
  CarModelConfig,
  QuoteState,
  SalespersonSettings,
} from '../types';
import {
  buildLineQuoteText,
  generateQuotePngDataUrl,
} from '../utils/exportHelpers';

interface ExportScreenProps {
  model: CarModelConfig;
  quote: QuoteState;
  calc: CalculatedQuote;
  salesperson: SalespersonSettings;
}

export function ExportScreen({
  model,
  quote,
  calc,
  salesperson,
}: ExportScreenProps) {
  const [copied, setCopied] = useState(false);
  const [previewPng, setPreviewPng] = useState<string | null>(null);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [pngError, setPngError] = useState<string | null>(null);

  const lineText = buildLineQuoteText(model, quote, calc, salesperson);
  const lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(lineText)}`;

  useEffect(() => {
    let active = true;
    setIsGeneratingPng(true);
    setPngError(null);
    generateQuotePngDataUrl(model, quote, calc, salesperson)
      .then((dataUrl) => {
        if (active) {
          setPreviewPng(dataUrl);
          setIsGeneratingPng(false);
        }
      })
      .catch(() => {
        if (active) {
          setPngError('ไม่สามารถสร้างภาพตัวอย่างได้ กรุณาลองใหม่อีกครั้ง');
          setIsGeneratingPng(false);
        }
      });

    return () => {
      active = false;
    };
  }, [model, quote, calc, salesperson]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(lineText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = lineText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPng = () => {
    if (!previewPng) return;
    const link = document.createElement('a');
    link.href = previewPng;
    link.download = `quotation-${model.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-sky-700">
          ขั้นตอนที่ 6 · ส่งข้อมูลให้ลูกค้า
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          ส่งใบเสนอราคาทาง LINE, รูปภาพ หรือ PDF
        </h1>
      </div>

      {/* 4 Export Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[52px] px-4 py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <MessageCircle className="h-5 w-5" />
          <span>ส่งผ่าน LINE</span>
        </a>

        <button
          type="button"
          onClick={handleCopyText}
          className="min-h-[52px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5 text-sky-400" />
              <span>คัดลอกข้อความแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              <span>คัดลอกข้อความ</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={!previewPng || isGeneratingPng}
          className="min-h-[52px] px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="h-5 w-5" />
          <span>บันทึกเป็นรูปภาพ</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[52px] px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileDown className="h-5 w-5 text-slate-700" />
          <span>สร้าง PDF ใบเสนอราคา</span>
        </button>
      </div>

      {/* Preview Split: LINE Message + PNG Card Preview */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              ตัวอย่างข้อความสำหรับส่ง LINE
            </h2>
            <button
              type="button"
              onClick={handleCopyText}
              className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
            >
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </div>
          <pre className="p-5 text-xs sm:text-sm text-slate-700 font-sans whitespace-pre-wrap leading-relaxed bg-slate-50/50">
            {lineText}
          </pre>
        </div>

        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              ตัวอย่างรูปภาพใบเสนอราคา (PNG)
            </h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>พิมพ์ PDF</span>
            </button>
          </div>
          <div className="p-5 bg-slate-100 flex items-center justify-center min-h-[360px]">
            {isGeneratingPng && (
              <p className="text-sm text-slate-500">กำลังสร้างรูปภาพใบเสนอราคา...</p>
            )}
            {pngError && <p className="text-sm text-red-600">{pngError}</p>}
            {previewPng && !isGeneratingPng && (
              <img
                src={previewPng}
                alt={`ใบเสนอราคา ${model.name}`}
                className="w-full max-w-sm rounded-xl shadow-md border border-slate-200"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
