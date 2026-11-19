import {
  CalculatedQuote,
  CarModelConfig,
  QuoteState,
  SalespersonSettings,
} from '../types';
import {formatTHB} from './calculations';

export const buildLineQuoteText = (
  model: CarModelConfig,
  quote: QuoteState,
  calc: CalculatedQuote,
  salesperson: SalespersonSettings
): string => {
  const includedBenefits = model.benefits
    .filter((b) => b.included)
    .map((b) => `• ${b.title} (${b.detail})`)
    .join('\n');

  const discountLabel =
    quote.discountMode === 'car_price'
      ? `ส่วนลดตัวรถ: -${formatTHB(calc.discountAmount)} บาท`
      : `ส่วนลดเงินดาวน์: -${formatTHB(calc.discountAmount)} บาท`;

  const customerLine = quote.customerName.trim()
    ? `เรียนคุณ ${quote.customerName.trim()}\n`
    : '';

  const vatLine =
    calc.vat7Amount > 0
      ? `• VAT 7% จากส่วนลด: ${formatTHB(calc.vat7Amount)} บาท\n`
      : '';

  const lifetimeLine =
    calc.lifetimeBatteryFee > 0
      ? `• เพิ่ม Lifetime Battery: ${formatTHB(calc.lifetimeBatteryFee)} บาท\n`
      : '';

  const extraFeeLine =
    calc.extraDeliveryFee > 0
      ? `• ค่าใช้จ่ายเพิ่มเติม: ${formatTHB(calc.extraDeliveryFee)} บาท\n`
      : '';

  return [
    `ใบเสนอราคารถยนต์ ${model.name}`,
    customerLine ? customerLine.trimEnd() : null,
    `--------------------------------`,
    `ราคาปกติ: ${formatTHB(calc.normalPrice)} บาท`,
    discountLabel,
    `ราคาพิเศษสุทธิ: ${formatTHB(calc.specialCarPrice)} บาท`,
    ``,
    `แผนผ่อนชำระ (Flat Rate)`,
    `• เงินดาวน์ (${calc.downPaymentPercent}%): ${formatTHB(calc.downPaymentNominal)} บาท`,
    quote.discountMode === 'down_payment'
      ? `• ดาวน์สุทธิหลังหักส่วนลด: ${formatTHB(calc.netDownPaymentPaid)} บาท`
      : null,
    `• ยอดจัดไฟแนนซ์: ${formatTHB(calc.financedAmount)} บาท`,
    `• ผ่อน ${calc.termMonths} เดือน (ดอกเบี้ย ${calc.annualInterestRate}%/ปี)`,
    `• ค่างวดประมาณ: ${formatTHB(calc.monthlyInstallment)} บาท/เดือน`,
    ``,
    `ค่าใช้จ่ายวันรับรถ (โดยประมาณ)`,
    `• เงินดาวน์สุทธิ: ${formatTHB(calc.netDownPaymentPaid)} บาท`,
    `• หักเงินจอง: -${formatTHB(calc.bookingDeposit)} บาท`,
    `• มัดจำป้ายแดง (ได้คืน): +${formatTHB(calc.redPlateDeposit)} บาท`,
    vatLine ? vatLine.trimEnd() : null,
    lifetimeLine ? lifetimeLine.trimEnd() : null,
    extraFeeLine ? extraFeeLine.trimEnd() : null,
    `รวมจ่ายวันรับรถสุทธิ: ${formatTHB(calc.totalDeliveryDayCost)} บาท`,
    ``,
    `สิทธิประโยชน์และของแถม`,
    includedBenefits,
    quote.extraNote.trim() ? `\nหมายเหตุ: ${quote.extraNote.trim()}` : null,
    ``,
    `*ค่างวดคำนวณแบบ Flat Rate เพื่อใช้เป็นแนวทางเบื้องต้น`,
    `--------------------------------`,
    `${salesperson.showroomName}`,
    `${salesperson.salespersonName} | โทร ${salesperson.phone}`,
    `LINE ID: ${salesperson.lineId}`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const generateQuotePngDataUrl = async (
  model: CarModelConfig,
  quote: QuoteState,
  calc: CalculatedQuote,
  salesperson: SalespersonSettings
): Promise<string> => {
  const width = 1080;
  const height = 1480;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // Header bar
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, width, 152);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 22px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(salesperson.showroomName, 56, 56);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 40px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(`ใบเสนอราคา ${model.name}`, 56, 108);

  if (quote.customerName.trim()) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 24px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
    ctx.fillText(`สำหรับคุณ ${quote.customerName.trim()}`, width - 56, 104);
    ctx.textAlign = 'left';
  }

  // Vehicle Image Card
  const cardX = 56;
  const cardY = 184;
  const cardW = width - 112;
  const imgH = 380;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, imgH, 24);
  ctx.clip();
  try {
    const img = await loadImage(model.imageUrl);
    const scale = Math.max(cardW / img.width, imgH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(
      img,
      cardX + (cardW - drawW) / 2,
      cardY + (imgH - drawH) / 2,
      drawW,
      drawH
    );
  } catch {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(cardX, cardY, cardW, imgH);
  }
  ctx.restore();

  // Highlight Pricing Row (2 columns)
  const rowY = 592;
  const colW = (cardW - 24) / 2;

  // Left box: Special Price & Down Payment
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, cardX, rowY, colW, 210, 20);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '500 22px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText('ราคาพิเศษสุทธิ', cardX + 28, rowY + 46);

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 44px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(`${formatTHB(calc.specialCarPrice)} บ.`, cardX + 28, rowY + 102);

  ctx.fillStyle = '#475569';
  ctx.font = '500 21px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `ราคาปกติ ${formatTHB(calc.normalPrice)} บ. | ส่วนลด ${formatTHB(calc.discountAmount)} บ.`,
    cardX + 28,
    rowY + 146
  );
  ctx.fillText(
    `ยอดจัดไฟแนนซ์ ${formatTHB(calc.financedAmount)} บาท`,
    cardX + 28,
    rowY + 180
  );

  // Right box: Monthly Installment
  const rightX = cardX + colW + 24;
  ctx.fillStyle = '#0F172A';
  drawRoundedRect(ctx, rightX, rowY, colW, 210, 20);
  ctx.fill();

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 22px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `ค่างวดประมาณ (${calc.termMonths} เดือน)`,
    rightX + 28,
    rowY + 46
  );

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 46px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(`${formatTHB(calc.monthlyInstallment)} บ./ด.`, rightX + 28, rowY + 104);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 21px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `เงินดาวน์ ${formatTHB(calc.downPaymentNominal)} บ. (${calc.downPaymentPercent}%)`,
    rightX + 28,
    rowY + 146
  );
  ctx.fillText(
    `อัตราดอกเบี้ย ${calc.annualInterestRate}% ต่อปี (Flat Rate)`,
    rightX + 28,
    rowY + 180
  );

  // Delivery day summary strip
  const delY = 828;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, cardX, delY, cardW, 148, 20);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText('สรุปค่าใช้จ่ายวันรับรถ', cardX + 28, delY + 46);

  ctx.fillStyle = '#475569';
  ctx.font = '500 21px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `ดาวน์สุทธิ ${formatTHB(calc.netDownPaymentPaid)} · หักจอง ${formatTHB(calc.bookingDeposit)} · มัดจำป้ายแดง +${formatTHB(calc.redPlateDeposit)}`,
    cardX + 28,
    delY + 88
  );
  if (calc.vat7Amount > 0 || calc.lifetimeBatteryFee > 0) {
    const extraParts: string[] = [];
    if (calc.vat7Amount > 0) extraParts.push(`VAT 7% +${formatTHB(calc.vat7Amount)}`);
    if (calc.lifetimeBatteryFee > 0)
      extraParts.push(`Lifetime Battery +${formatTHB(calc.lifetimeBatteryFee)}`);
    ctx.fillText(extraParts.join(' · '), cardX + 28, delY + 120);
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0284C7';
  ctx.font = '700 34px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(`${formatTHB(calc.totalDeliveryDayCost)} บ.`, cardX + cardW - 28, delY + 86);
  ctx.textAlign = 'left';

  // Benefits section
  const benY = 1002;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, cardX, benY, cardW, 320, 20);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText('สิทธิประโยชน์และการรับประกัน', cardX + 28, benY + 46);

  const included = model.benefits.filter((b) => b.included).slice(0, 7);
  ctx.font = '500 20px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  included.forEach((item, idx) => {
    const yPos = benY + 88 + idx * 32;
    ctx.fillStyle = '#0284C7';
    ctx.fillText('✓', cardX + 28, yPos);
    ctx.fillStyle = '#1E293B';
    ctx.fillText(`${item.title} — ${item.detail}`, cardX + 60, yPos);
  });

  // Footer Salesperson info
  const footY = 1352;
  ctx.fillStyle = '#F1F5F9';
  drawRoundedRect(ctx, cardX, footY, cardW, 92, 18);
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(salesperson.salespersonName, cardX + 28, footY + 42);

  ctx.fillStyle = '#475569';
  ctx.font = '500 20px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `โทร: ${salesperson.phone}  ·  LINE: ${salesperson.lineId}`,
    cardX + 28,
    footY + 74
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748B';
  ctx.font = '500 18px "Plus Jakarta Sans", "Noto Sans Thai", sans-serif';
  ctx.fillText(
    `เงื่อนไขอาจเปลี่ยนแปลงได้ · อัตราดอกเบี้ย Flat Rate`,
    cardX + cardW - 28,
    footY + 56
  );
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
};
