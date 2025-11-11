import { EventBus } from './EventBus.js';
import { Router } from './Router.js';

/**
 * App - Главный класс приложения
 * Координирует работу всех компонентов
 */
export class App {
  constructor() {
    this.eventBus = new EventBus();
    this.router = new Router(this.eventBus);
    this.components = new Map();
    this.services = new Map();
    this.currentCalculator = null;
  }

  /**
   * Зарегистрировать компонент
   * @param {string} name - Название компонента
   * @param {Object} component - Экземпляр компонента
   */
  registerComponent(name, component) {
    this.components.set(name, component);

    // Передаем зависимости в компонент
    if (component.init) {
      component.init(this.eventBus, this.router);
    }
  }

  /**
   * Зарегистрировать сервис
   * @param {string} name - Название сервиса
   * @param {Object} service - Экземпляр сервиса
   */
  registerService(name, service) {
    this.services.set(name, service);

    // Передаем зависимости в сервис
    if (service.init) {
      service.init(this.eventBus);
    }
  }

  /**
   * Получить компонент
   * @param {string} name - Название компонента
   * @returns {Object|null}
   */
  getComponent(name) {
    return this.components.get(name) || null;
  }

  /**
   * Получить сервис
   * @param {string} name - Название сервиса
   * @returns {Object|null}
   */
  getService(name) {
    return this.services.get(name) || null;
  }

  /**
   * Зарегистрировать калькулятор
   * @param {string} name - Название калькулятора
   * @param {Class} CalculatorClass - Класс калькулятора
   * @param {Object} config - Конфигурация
   */
  registerCalculator(name, CalculatorClass, config = {}) {
    this.router.register(name, {
      CalculatorClass,
      ...config
    });
  }

  /**
   * Загрузить калькулятор
   * @param {string} name - Название калькулятора
   */
  loadCalculator(name) {
    const route = this.router.getCurrentRoute();

    // Уничтожить предыдущий калькулятор
    if (this.currentCalculator && this.currentCalculator.destroy) {
      this.currentCalculator.destroy();
    }

    // Получить конфигурацию маршрута
    const routeConfig = this.router.getRoutes().get(name);
    if (!routeConfig) {
      console.error(`Calculator "${name}" not found`);
      return;
    }

    // Создать новый экземпляр калькулятора
    const { CalculatorClass } = routeConfig;
    this.currentCalculator = new CalculatorClass(this);

    // Отрендерить калькулятор
    if (this.currentCalculator.render) {
      this.currentCalculator.render();
    }
  }

  /**
   * Инициализация приложения
   */
  async init() {
    // Подписываемся на изменение маршрута
    this.eventBus.on('route:change', ({ name }) => {
      this.loadCalculator(name);
    });

    console.log('CalcPRO 2.0 initialized');
  }

  /**
   * Монтирование приложения
   * @param {string} selector - CSS селектор
   */
  mount(selector) {
    this.rootElement = document.querySelector(selector);
    if (!this.rootElement) {
      throw new Error(`Element "${selector}" not found`);
    }

    console.log(`App mounted to ${selector}`);
  }
}
