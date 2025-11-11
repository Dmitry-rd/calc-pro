/**
 * Конфигурация ценообразования для калькулятора наклеек
 */

// Цены листа для разных типов расчета
export const SHEET_PRICES = {
  retail: 1200,
  opt1: 850,
  opt2: 650,
  opt3: 550
};

// Коэффициенты материалов
export const MATERIAL_COEFFICIENTS = {
  mat_gl: 1.0,       // Пленка мат/гл
  transp: 1.15,      // Пленка прозр.
  mat_gl_lam: 1.4,   // Пленка мат/гл с лам.
  transp_lam: 1.5,   // Пленка прозр. с лам.
  paper_self: 0.5    // Бумажная самоклейка
};

// Динамические цены в зависимости от тиража
export const DYNAMIC_PRICES = {
  50: 1200,
  100: 1000,
  200: 850,
  500: 700,
  1000: 600,
  2000: 550,
  5000: 500
};

// Цены на 3D полимер (₽ за см²)
export const POLYMER_PRICES = {
  premium: 5.0,   // Премиум (гибкий)
  standard: 3.5   // Стандарт (твёрдый)
};

// Цена полимера для стикерпаков (₽ за см²)
export const STICKERPACK_POLYMER_PRICE = 3.5;

// Цены на Оракал (₽ за см²)
export const ORACAL_PRICES = {
  'with-print': 0.25,    // С печатью
  'without-print': 0.15  // Без печати
};

// Площадь листа в см²
export const SHEET_AREA = 6000;

// Скидки для оптовых расчетов
export const OPT_DISCOUNTS = {
  opt1: 5,
  opt2: 10,
  opt3: 15,
  opt4: 20,
  opt5: 25,
  opt6: 30
};

// Предустановленные размеры
export const SIZE_PRESETS = {
  standard: [
    { value: '10x10', label: '10×10 мм' },
    { value: '20x20', label: '20×20 мм' },
    { value: '30x30', label: '30×30 мм' },
    { value: '40x40', label: '40×40 мм' },
    { value: '50x50', label: '50×50 мм', default: true },
    { value: '60x60', label: '60×60 мм' },
    { value: '70x70', label: '70×70 мм' },
    { value: '80x80', label: '80×80 мм' },
    { value: '90x90', label: '90×90 мм' },
    { value: '100x100', label: '100×100 мм' }
  ],
  rectangular: [
    { value: '20x30', label: '20×30 мм' },
    { value: '30x40', label: '30×40 мм' },
    { value: '40x50', label: '40×50 мм' },
    { value: '50x70', label: '50×70 мм' },
    { value: '60x40', label: '60×40 мм' },
    { value: '60x90', label: '60×90 мм' },
    { value: '70x100', label: '70×100 мм' },
    { value: '80x50', label: '80×50 мм' },
    { value: '90x50', label: '90×50 мм' },
    { value: '100x70', label: '100×70 мм' }
  ],
  threeDSizes: [
    { value: '20x20', label: '20×20 мм' },
    { value: '25x25', label: '25×25 мм' },
    { value: '30x30', label: '30×30 мм', default: true },
    { value: '35x35', label: '35×35 мм' },
    { value: '40x40', label: '40×40 мм' },
    { value: '45x45', label: '45×45 мм' },
    { value: '50x50', label: '50×50 мм' },
    { value: '60x60', label: '60×60 мм' },
    { value: '70x70', label: '70×70 мм' },
    { value: '80x80', label: '80×80 мм' }
  ]
};

// Быстрый выбор тиража
export const QUICK_QUANTITIES = [50, 100, 200, 500, 1000, 2000, 3000, 5000];
