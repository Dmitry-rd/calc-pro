/**
 * EventBus - Глобальная шина событий для связи между компонентами
 * Реализует паттерн Publisher-Subscriber
 */
export class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Подписаться на событие
   * @param {string} event - Название события
   * @param {Function} callback - Callback функция
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  /**
   * Отписаться от события
   * @param {string} event - Название события
   * @param {Function} callback - Callback функция
   */
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  /**
   * Вызвать событие
   * @param {string} event - Название события
   * @param {*} data - Данные события
   */
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  /**
   * Подписаться на событие один раз
   * @param {string} event - Название события
   * @param {Function} callback - Callback функция
   */
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Создаем singleton экземпляр
export const eventBus = new EventBus();
