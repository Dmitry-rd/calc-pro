/**
 * Cart - Компонент корзины расчетов (десктопная версия)
 */
export class Cart {
  constructor(cartService) {
    this.cartService = cartService;
    this.element = null;
    this.eventBus = null;
  }

  init(eventBus) {
    this.eventBus = eventBus;

    // Подписываемся на обновления корзины
    this.eventBus.on('cart:updated', () => {
      this.update();
    });
  }

  render() {
    const cart = document.createElement('div');
    cart.className = 'cart desktop-only';
    cart.innerHTML = `
      <div class="cart-header">
        <div class="cart-title">
          Корзина расчётов
          <span class="cart-badge" id="cartCount">0</span>
        </div>
        <button class="cart-clear" id="clearCartBtn" title="Очистить корзину">✕</button>
      </div>

      <div class="cart-body" id="cartBody">
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-text">Корзина пуста</div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span class="cart-total-label">ИТОГО:</span>
          <span class="cart-total-sum" id="totalSum">0 ₽</span>
        </div>
        <button class="copy-btn" id="copyCartBtn">
          📋 Копировать расчёт
        </button>
        <div class="tools-divider"></div>
        <div class="tools-group">
          <button class="tool-btn" id="managerBtn">
            📝 Конструктор скриптов
          </button>
          <button class="tool-btn" id="layoutBtn">
            🖨️ Раскладка для печати
          </button>
        </div>
      </div>
    `;

    this.element = cart;
    this.attachEvents();
    this.update();

    return cart;
  }

  attachEvents() {
    // Кнопка очистки корзины
    const clearBtn = this.element.querySelector('#clearCartBtn');
    clearBtn.addEventListener('click', () => {
      if (this.cartService.getCount() === 0) return;

      if (confirm('Очистить корзину?')) {
        this.cartService.clear();
      }
    });

    // Кнопка копирования
    const copyBtn = this.element.querySelector('#copyCartBtn');
    copyBtn.addEventListener('click', () => {
      this.copyToClipboard();
    });

    // Модальные окна инструментов
    const managerBtn = this.element.querySelector('#managerBtn');
    managerBtn.addEventListener('click', () => {
      this.eventBus.emit('modal:open', { type: 'manager' });
    });

    const layoutBtn = this.element.querySelector('#layoutBtn');
    layoutBtn.addEventListener('click', () => {
      this.eventBus.emit('modal:open', { type: 'layout' });
    });
  }

  update() {
    if (!this.element) return;

    const items = this.cartService.getItems();
    const count = this.cartService.getCount();
    const total = this.cartService.getTotal();

    // Обновляем счетчик
    const countBadge = this.element.querySelector('#cartCount');
    countBadge.textContent = count;

    // Обновляем сумму
    const totalSum = this.element.querySelector('#totalSum');
    totalSum.textContent = `${this.cartService.formatPrice(total)} ₽`;

    // Обновляем список товаров
    const cartBody = this.element.querySelector('#cartBody');

    if (count === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-text">Корзина пуста</div>
        </div>
      `;
    } else {
      cartBody.innerHTML = items.map((item, index) => `
        <div class="cart-item">
          <button class="cart-item-remove" data-index="${index}">✕</button>
          <div class="cart-item-type">${item.calculator || item.calc || 'Расчет'}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-desc">${item.description || item.desc || ''}</div>
          <div class="cart-item-calc">
            <span>${item.quantity || item.qty || '1шт'} × ${item.unitPrice || item.unit || '0₽'} = ${this.cartService.formatPrice(item.price)} ₽</span>
          </div>
        </div>
      `).join('');

      // Добавляем обработчики удаления
      const removeButtons = cartBody.querySelectorAll('.cart-item-remove');
      removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          this.cartService.remove(index);
        });
      });
    }
  }

  async copyToClipboard() {
    if (this.cartService.getCount() === 0) {
      this.eventBus.emit('toast:show', { message: 'Корзина пуста' });
      return;
    }

    const text = this.cartService.exportToText();

    try {
      await navigator.clipboard.writeText(text);

      this.eventBus.emit('toast:show', {
        message: 'Скопировано в буфер обмена',
        type: 'success'
      });

      // Визуальная обратная связь
      const copyBtn = this.element.querySelector('#copyCartBtn');
      copyBtn.classList.add('success');
      setTimeout(() => {
        copyBtn.classList.remove('success');
      }, 1000);
    } catch (error) {
      // Fallback для старых браузеров
      this.fallbackCopy(text);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.eventBus.emit('toast:show', {
        message: 'Скопировано в буфер обмена',
        type: 'success'
      });
    } catch (err) {
      this.eventBus.emit('toast:show', {
        message: 'Не удалось скопировать',
        type: 'error'
      });
    }

    document.body.removeChild(textArea);
  }

  mount(parent) {
    if (!this.element) {
      this.render();
    }
    parent.appendChild(this.element);
  }
}
