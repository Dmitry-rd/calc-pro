/**
 * BaseCalculator - Базовый класс для всех калькуляторов
 */
export class BaseCalculator {
  constructor(app) {
    this.app = app;
    this.eventBus = app.eventBus;
    this.cartService = app.getService('cart');
    this.element = null;
    this.state = {};
  }

  /**
   * Рендер калькулятора
   */
  render() {
    throw new Error('render() must be implemented');
  }

  /**
   * Обновить состояние
   * @param {Object} newState
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.onStateChange();
  }

  /**
   * Callback при изменении состояния
   */
  onStateChange() {
    // Переопределить в дочернем классе
  }

  /**
   * Рассчитать цену
   * @returns {Object} { unitPrice, totalPrice }
   */
  calculate() {
    throw new Error('calculate() must be implemented');
  }

  /**
   * Добавить в корзину
   */
  addToCart() {
    const result = this.calculate();
    const item = this.prepareCartItem(result);

    this.cartService.add(item);

    this.eventBus.emit('toast:show', {
      message: 'Добавлено в корзину',
      type: 'success'
    });
  }

  /**
   * Подготовить данные для корзины
   * @param {Object} result
   * @returns {Object}
   */
  prepareCartItem(result) {
    throw new Error('prepareCartItem() must be implemented');
  }

  /**
   * Уничтожить калькулятор
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }

  /**
   * Получить контейнер для рендера
   * @returns {HTMLElement}
   */
  getContainer() {
    return document.querySelector('#calcBody');
  }
}
