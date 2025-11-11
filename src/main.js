/**
 * CalcPRO 2.0 - Main Entry Point
 * Модульная архитектура полиграфических калькуляторов
 */

// Core
import { App } from './core/App.js';

// Services
import { StorageService } from './services/StorageService.js';
import { CartService } from './services/CartService.js';

// Components
import { Toast } from './components/ui/Toast.js';
import { Header } from './components/layout/Header.js';
import { Tabs } from './components/layout/Tabs.js';
import { Cart } from './components/cart/Cart.js';

// Calculators
import { StickersCalculator } from './calculators/stickers/StickersCalculator.js';

// Styles
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/calculators.css';
import './styles/responsive.css';

/**
 * Инициализация приложения
 */
async function initApp() {
  // Создаем экземпляр приложения
  const app = new App();

  // Регистрируем сервисы
  const storageService = new StorageService('calcpro_');
  const cartService = new CartService(storageService);

  app.registerService('storage', storageService);
  app.registerService('cart', cartService);

  // Регистрируем компоненты
  const header = new Header();
  const tabs = new Tabs(app.router);
  const cart = new Cart(cartService);

  app.registerComponent('header', header);
  app.registerComponent('tabs', tabs);
  app.registerComponent('cart', cart);

  // Регистрируем калькуляторы
  app.registerCalculator('stickers', StickersCalculator, {
    name: 'Калькулятор наклеек',
    icon: '🏷️'
  });

  // TODO: Зарегистрировать другие калькуляторы
  // app.registerCalculator('print-digital', PrintDigitalCalculator);
  // app.registerCalculator('poly-cards', PolyCardsCalculator);
  // и т.д.

  // Инициализируем приложение
  await app.init();

  // Монтируем приложение
  app.mount('#app');

  // Рендерим layout
  renderLayout(app);

  // Подписываемся на события
  subscribeToEvents(app);

  // Загружаем первый калькулятор
  app.router.navigate('stickers');

  console.log('✅ CalcPRO 2.0 успешно загружен!');
}

/**
 * Рендерим layout приложения
 */
function renderLayout(app) {
  const root = app.rootElement;

  // Создаем структуру
  root.innerHTML = `
    <div id="headerContainer"></div>
    <div class="container">
      <div class="calc-panel">
        <div class="calc-body" id="calcBody">
          <div class="empty">
            <div class="empty-icon">📊</div>
            <div>Загрузка калькулятора...</div>
          </div>
        </div>
      </div>
      <div id="cartContainer"></div>
    </div>
    <div class="footer">
      © 2025 Типография Цифра
    </div>
  `;

  // Монтируем компоненты
  const headerContainer = document.getElementById('headerContainer');
  const header = app.getComponent('header');
  header.mount(headerContainer);

  const headerWrapper = header.element;
  const tabs = app.getComponent('tabs');
  tabs.mount(headerWrapper);

  const cartContainer = document.getElementById('cartContainer');
  const cart = app.getComponent('cart');
  cart.mount(cartContainer);
}

/**
 * Подписываемся на глобальные события
 */
function subscribeToEvents(app) {
  const { eventBus } = app;

  // Toast notifications
  eventBus.on('toast:show', ({ message, type, duration }) => {
    Toast.show(message, type, duration);
  });

  // Modal windows (будет реализовано позже)
  eventBus.on('modal:open', ({ type }) => {
    console.log('Open modal:', type);
    // TODO: Implement modal logic
  });

  // Error handling
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    Toast.error('Произошла ошибка. Перезагрузите страницу.');
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    Toast.error('Произошла ошибка. Перезагрузите страницу.');
  });
}

// Запускаем приложение при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);
