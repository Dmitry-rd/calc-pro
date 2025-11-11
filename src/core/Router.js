/**
 * Router - Управление навигацией между калькуляторами
 */
export class Router {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.currentRoute = null;
    this.routes = new Map();
  }

  /**
   * Зарегистрировать маршрут
   * @param {string} name - Название маршрута
   * @param {Object} config - Конфигурация маршрута
   */
  register(name, config) {
    this.routes.set(name, config);
  }

  /**
   * Перейти на маршрут
   * @param {string} name - Название маршрута
   * @param {Object} params - Параметры маршрута
   */
  navigate(name, params = {}) {
    const route = this.routes.get(name);

    if (!route) {
      console.error(`Route "${name}" not found`);
      return;
    }

    // Сохраняем текущий маршрут
    this.currentRoute = { name, params, config: route };

    // Уведомляем об изменении маршрута
    this.eventBus.emit('route:change', {
      name,
      params,
      config: route
    });
  }

  /**
   * Получить текущий маршрут
   * @returns {Object|null}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Получить все маршруты
   * @returns {Map}
   */
  getRoutes() {
    return this.routes;
  }
}
