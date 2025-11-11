/**
 * CartService - Управление корзиной расчетов
 */
export class CartService {
  constructor(storage) {
    this.storage = storage;
    this.items = [];
    this.eventBus = null;
  }

  /**
   * Инициализация сервиса
   * @param {EventBus} eventBus
   */
  init(eventBus) {
    this.eventBus = eventBus;
    this.load();
  }

  /**
   * Загрузить корзину из хранилища
   */
  load() {
    this.items = this.storage.get('cart', []);
    this.emit();
  }

  /**
   * Сохранить корзину в хранилище
   */
  save() {
    this.storage.set('cart', this.items);
    this.emit();
  }

  /**
   * Добавить товар в корзину
   * @param {Object} item - Товар
   */
  add(item) {
    const cartItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...item
    };

    this.items.push(cartItem);
    this.save();

    return cartItem;
  }

  /**
   * Удалить товар из корзины
   * @param {number} index - Индекс товара
   */
  remove(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Очистить корзину
   */
  clear() {
    this.items = [];
    this.save();
  }

  /**
   * Получить все товары
   * @returns {Array}
   */
  getItems() {
    return this.items;
  }

  /**
   * Получить количество товаров
   * @returns {number}
   */
  getCount() {
    return this.items.length;
  }

  /**
   * Получить общую сумму
   * @returns {number}
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  /**
   * Экспортировать корзину в текст
   * @returns {string}
   */
  exportToText() {
    if (this.items.length === 0) {
      return '';
    }

    let text = 'Подготовили расчет по вашему запросу: 👇\n\n';
    text += '📋 Расчет:\n';
    text += '────────────\n';

    this.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name}, ${item.description || item.desc || ''}\n`;
      text += `   ${item.quantity || item.qty || '1шт'} × ${item.unitPrice || item.unit || '0₽'} = ${this.formatPrice(item.price)}₽\n`;
      if (index < this.items.length - 1) {
        text += '\n';
      }
    });

    text += '────────────\n';
    text += `💰 ИТОГО: ${this.formatPrice(this.getTotal())}₽`;

    return text;
  }

  /**
   * Форматировать цену
   * @param {number} price
   * @returns {string}
   */
  formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
  }

  /**
   * Отправить событие обновления корзины
   */
  emit() {
    if (this.eventBus) {
      this.eventBus.emit('cart:updated', {
        items: this.items,
        count: this.getCount(),
        total: this.getTotal()
      });
    }
  }
}
