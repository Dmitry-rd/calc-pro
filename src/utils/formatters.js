/**
 * Форматирование данных
 */

/**
 * Форматировать размер
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function formatSize(width, height) {
  return `${width}×${height} мм`;
}

/**
 * Форматировать дату
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Форматировать количество
 * @param {number} qty
 * @param {string} unit - Единица измерения
 * @returns {string}
 */
export function formatQuantity(qty, unit = 'шт') {
  return `${qty} ${unit}`;
}

/**
 * Обрезать текст
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
