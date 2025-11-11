/**
 * Утилиты для расчетов
 */

/**
 * Округлить до половины вверх (0.5)
 * @param {number} value
 * @returns {number}
 */
export function roundUpToHalf(value) {
  return Math.ceil(value * 2) / 2;
}

/**
 * Округлить до десятой вверх (0.1)
 * @param {number} value
 * @returns {number}
 */
export function roundUpToTenth(value) {
  return Math.ceil(value * 10) / 10;
}

/**
 * Форматировать цену
 * @param {number} value
 * @param {number} decimals - Количество знаков после запятой
 * @returns {string}
 */
export function formatPrice(value, decimals = 2) {
  return value.toFixed(decimals);
}

/**
 * Форматировать число с разделителями
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/**
 * Рассчитать площадь в см²
 * @param {number} width - Ширина в мм
 * @param {number} height - Высота в мм
 * @returns {number}
 */
export function calculateArea(width, height) {
  return (width * height) / 100;
}

/**
 * Применить скидку
 * @param {number} price - Цена
 * @param {number} discount - Скидка в процентах
 * @returns {number}
 */
export function applyDiscount(price, discount) {
  return price * (1 - discount / 100);
}

/**
 * Получить динамическую цену на основе тиража
 * @param {number} quantity - Тираж
 * @param {Object} priceRanges - Диапазоны цен
 * @returns {number}
 */
export function getDynamicPrice(quantity, priceRanges) {
  const ranges = Object.keys(priceRanges).map(Number).sort((a, b) => a - b);

  for (let i = ranges.length - 1; i >= 0; i--) {
    if (quantity >= ranges[i]) {
      return priceRanges[ranges[i]];
    }
  }

  return priceRanges[ranges[0]];
}
