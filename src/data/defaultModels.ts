import {CarModelConfig, QuoteState, SalespersonSettings} from '../types';

export const DEFAULT_MODELS: CarModelConfig[] = [
  {
    id: 's05_max',
    name: 'DEEPAL S05 BEV MAX',
    brand: 'DEEPAL',
    powertrain: 'BEV 100% · SUV',
    tagline: 'ไฟฟ้าล้วน พร้อมโฮมชาร์จเจอร์และสิทธิประโยชน์ครบชุด',
    imageUrl: '/src/assets/images/deepal_s05_bev_max_1795054929419.jpg',
    normalPrice: 899000,
    defaultDiscount: 50000,
    defaultInterestRate: 1.99,
    defaultBookingDeposit: 5000,
    defaultRedPlateDeposit: 3000,
    homeChargerLabel: 'ฟรี (เฉพาะ MAX)',
    lifetimeBatteryLabel: 'เพิ่ม 6,500 บาท',
    lifetimeBatteryPrice: 6500,
    vehicleWarranty: '5 ปี / 120,000 กม.',
    batteryWarranty: '8 ปี / 160,000 กม.',
    roadsideAssistance: '8 ปี',
    registrationLabel: 'รวมสิทธิประโยชน์',
    benefits: [
      {
        id: 's05-ins',
        title: 'ประกันภัยชั้น 1 และ พ.ร.บ.',
        detail: 'คุ้มครอง 1 ปีแรก พร้อม พ.ร.บ. ครบชุด',
        included: true,
        category: 'insurance',
      },
      {
        id: 's05-hc',
        title: 'โฮมชาร์จเจอร์ (Home Charger)',
        detail: 'ฟรี เฉพาะรุ่น MAX พร้อมบริการติดตั้งมาตรฐาน',
        included: true,
        category: 'charging',
      },
      {
        id: 's05-pc',
        title: 'สายชาร์จเคลื่อนที่ (Portable Charger)',
        detail: 'สายชาร์จฉุกเฉินติดรถแท้จากโรงงาน',
        included: true,
        category: 'charging',
      },
      {
        id: 's05-vw',
        title: 'รับประกันคุณภาพตัวรถ',
        detail: '5 ปี หรือ 120,000 กม. (อย่างใดอย่างหนึ่งถึงก่อน)',
        included: true,
        category: 'warranty',
      },
      {
        id: 's05-bw',
        title: 'รับประกันแบตเตอรี่แรงดันสูง',
        detail: '8 ปี หรือ 160,000 กม.',
        included: true,
        category: 'warranty',
      },
      {
        id: 's05-lbw',
        title: 'Lifetime Battery Warranty',
        detail: 'สิทธิ์อัปเกรดรับประกันแบตเตอรี่ตลอดอายุการใช้งาน (เพิ่ม 6,500 บาท)',
        included: false,
        category: 'warranty',
      },
      {
        id: 's05-rsa',
        title: 'บริการช่วยเหลือฉุกเฉิน 24 ชม.',
        detail: 'คุ้มครองต่อเนื่อง 8 ปีทั่วประเทศ',
        included: true,
        category: 'warranty',
      },
      {
        id: 's05-acc',
        title: 'ฟิล์มกรองแสง พรม กรอบป้ายทะเบียน',
        detail: 'ฟิล์มเซรามิกรอบคัน พรมปูพื้นเข้ารูป และกรอบป้าย',
        included: true,
        category: 'accessories',
      },
      {
        id: 's05-reg',
        title: 'ค่าบำรุงรักษาและค่าจดทะเบียน',
        detail: 'รวมสิทธิประโยชน์ค่าจดทะเบียนและค่าบำรุงรักษาตามเงื่อนไขแคมเปญ',
        included: true,
        category: 'registration',
      },
    ],
  },
  {
    id: 'nevo_q05',
    name: 'CHANGAN NEVO Q05',
    brand: 'CHANGAN NEVO',
    powertrain: 'NEV / PHEV · SUV',
    tagline: 'คุ้มค่า คล่องตัว พร้อมสิทธิ์ตามโปรโมชั่นประจำเดือน',
    imageUrl: '/src/assets/images/changan_nevo_q05_1795054930474.jpg',
    normalPrice: 799000,
    defaultDiscount: 40000,
    defaultInterestRate: 1.99,
    defaultBookingDeposit: 5000,
    defaultRedPlateDeposit: 3000,
    homeChargerLabel: 'เฉพาะ MAX (ไม่รวมในรุ่นนี้)',
    lifetimeBatteryLabel: 'ฟรีตามช่วงโปรโมชั่น',
    lifetimeBatteryPrice: 0,
    vehicleWarranty: '5 ปี / 150,000 กม.',
    batteryWarranty: '8 ปี / 160,000 กม.',
    roadsideAssistance: '8 ปี',
    registrationLabel: 'ต้องตรวจสอบเพิ่มเติม',
    benefits: [
      {
        id: 'q05-ins',
        title: 'ประกันภัยชั้น 1 และ พ.ร.บ.',
        detail: 'คุ้มครอง 1 ปีแรก พร้อม พ.ร.บ. ครบชุด',
        included: true,
        category: 'insurance',
      },
      {
        id: 'q05-hc',
        title: 'โฮมชาร์จเจอร์ (Home Charger)',
        detail: 'เงื่อนไขเฉพาะรุ่น MAX (รุ่นนี้กรุณาตรวจสอบโปรโมชั่นเพิ่มเติม)',
        included: false,
        category: 'charging',
      },
      {
        id: 'q05-pc',
        title: 'สายชาร์จเคลื่อนที่ (Portable Charger)',
        detail: 'สายชาร์จเคลื่อนที่พร้อมกระเป๋าจัดเก็บ',
        included: true,
        category: 'charging',
      },
      {
        id: 'q05-vw',
        title: 'รับประกันคุณภาพตัวรถ',
        detail: '5 ปี หรือ 150,000 กม. (อย่างใดอย่างหนึ่งถึงก่อน)',
        included: true,
        category: 'warranty',
      },
      {
        id: 'q05-bw',
        title: 'รับประกันแบตเตอรี่แรงดันสูง',
        detail: '8 ปี หรือ 160,000 กม.',
        included: true,
        category: 'warranty',
      },
      {
        id: 'q05-lbw',
        title: 'Lifetime Battery Warranty',
        detail: 'ฟรีตามช่วงโปรโมชั่น (เงื่อนไขเป็นไปตามที่บริษัทกำหนด)',
        included: true,
        category: 'warranty',
      },
      {
        id: 'q05-rsa',
        title: 'บริการช่วยเหลือฉุกเฉิน 24 ชม.',
        detail: 'คุ้มครองต่อเนื่อง 8 ปีทั่วประเทศ',
        included: true,
        category: 'warranty',
      },
      {
        id: 'q05-acc',
        title: 'ฟิล์มกรองแสง พรม กรอบป้ายทะเบียน',
        detail: 'ฟิล์มกรองแสงรอบคัน พรมเข้ารูป และกรอบป้ายทะเบียน',
        included: true,
        category: 'accessories',
      },
      {
        id: 'q05-reg',
        title: 'ค่าบำรุงรักษาและค่าจดทะเบียน',
        detail: 'ค่าจดทะเบียนต้องตรวจสอบเพิ่มเติมตามแคมเปญปัจจุบัน',
        included: false,
        category: 'registration',
      },
    ],
  },
];

export const DEFAULT_SALESPERSON: SalespersonSettings = {
  showroomName: 'CHANGAN & DEEPAL Flagship Showroom',
  salespersonName: 'ที่ปรึกษาการขาย (ฝ่ายขาย EV)',
  phone: '081-234-5678',
  lineId: '@evshowroom',
  quoteValidityDays: 7,
};

export const createInitialQuoteForModel = (model: CarModelConfig): QuoteState => {
  const defaultSpecial = Math.max(0, model.normalPrice - model.defaultDiscount);
  return {
    selectedModelId: model.id,
    customerName: '',
    customerPhone: '',
    discountMode: 'car_price',
    discountAmount: model.defaultDiscount,
    includeVat7OnDiscount: false,
    downPaymentBaht: Math.round(defaultSpecial * 0.15),
    termMonths: 60,
    annualInterestRate: model.defaultInterestRate,
    bookingDeposit: model.defaultBookingDeposit,
    redPlateDeposit: model.defaultRedPlateDeposit,
    includeLifetimeBatteryUpgrade: model.id === 's05_max' ? false : true,
    extraDeliveryFee: 0,
    extraNote: '',
  };
};

export const STORAGE_KEYS = {
  MODELS: 'car_sales_studio_models_v1',
  SALESPERSON: 'car_sales_studio_salesperson_v1',
};

export const loadSavedModels = (): CarModelConfig[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODELS);
    if (!raw) return DEFAULT_MODELS;
    const parsed = JSON.parse(raw) as CarModelConfig[];
    if (Array.isArray(parsed) && parsed.length >= 2) {
      return parsed;
    }
  } catch {
    // Fallback to defaults if storage unavailable
  }
  return DEFAULT_MODELS;
};

export const loadSavedSalesperson = (): SalespersonSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALESPERSON);
    if (!raw) return DEFAULT_SALESPERSON;
    return {...DEFAULT_SALESPERSON, ...JSON.parse(raw)};
  } catch {
    return DEFAULT_SALESPERSON;
  }
};
