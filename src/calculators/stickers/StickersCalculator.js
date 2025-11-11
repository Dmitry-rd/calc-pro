import { BaseCalculator } from '../BaseCalculator.js';
import {
  SHEET_PRICES,
  MATERIAL_COEFFICIENTS,
  DYNAMIC_PRICES,
  POLYMER_PRICES,
  ORACAL_PRICES,
  SHEET_AREA,
  OPT_DISCOUNTS,
  SIZE_PRESETS,
  QUICK_QUANTITIES
} from './pricing.js';
import { calculateArea, roundUpToHalf, roundUpToTenth, getDynamicPrice } from '../../utils/calculations.js';
import { formatSize, formatQuantity } from '../../utils/formatters.js';

/**
 * StickersCalculator - Калькулятор наклеек
 */
export class StickersCalculator extends BaseCalculator {
  constructor(app) {
    super(app);

    this.state = {
      productType: 'standard',  // standard, 3d, oracal
      subType: 'standard',      // Для 3D: standard, stickerpacks

      // Standard
      width: 50,
      height: 50,
      quantity: 100,
      material: 'mat_gl',
      pricingType: 'retail',
      customPrice: null,

      // 3D
      polymer: 'premium',
      customPrice3D: null,

      // Oracal
      oracalType: 'with-print',
      customPriceOracal: null
    };
  }

  render() {
    const container = this.getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="stickers-calculator">
        ${this.renderProductSelector()}
        ${this.renderStandardParams()}
        ${this.render3DParams()}
        ${this.renderOracalParams()}
        ${this.renderResult()}
        ${this.renderQuickQuantities()}
      </div>
    `;

    this.attachEvents();
    this.calculate();
  }

  renderProductSelector() {
    const products = [
      { id: 'standard', icon: '🏷️', label: 'Наклейки' },
      { id: '3d', icon: '💎', label: '3D наклейки' },
      { id: 'oracal', icon: '✂️', label: 'Оракал' }
    ];

    return `
      <div class="panel product-selector">
        <div class="product-selector-title">ВЫБЕРИТЕ ТИП НАКЛЕЙКИ</div>
        <div class="product-cards">
          ${products.map(p => `
            <div class="product-card ${p.id === this.state.productType ? 'active' : ''}"
                 data-product="${p.id}">
              <div class="product-icon">${p.icon}</div>
              <div class="product-name">${p.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderStandardParams() {
    const isActive = this.state.productType === 'standard';

    return `
      <div class="params-block ${isActive ? 'active' : ''}" id="standard-params">
        <div class="block-title">ПАРАМЕТРЫ НАКЛЕЕК</div>

        <div class="params-section">
          <div class="section-label">Основные параметры</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="width" value="${this.state.width}" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="height" value="${this.state.height}" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantity" value="${this.state.quantity}" min="1" max="100000">
            </div>
            <div class="param-group">
              <label class="label">Материал</label>
              <select class="select" id="material">
                <option value="mat_gl">Пленка мат/гл</option>
                <option value="transp">Пленка прозр.</option>
                <option value="mat_gl_lam">Пленка мат/гл с лам.</option>
                <option value="transp_lam">Пленка прозр. с лам.</option>
                <option value="paper_self">Бумажная самоклейка</option>
              </select>
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип расчёта</label>
              <select class="select" id="pricingType">
                <option value="retail">Розница (1200₽/лист)</option>
                <option value="opt1">Опт1 (850₽/лист)</option>
                <option value="opt2">Опт2 (650₽/лист)</option>
                <option value="opt3">Опт3 (550₽/лист)</option>
                <option value="dynamic">Динамический</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPrice" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render3DParams() {
    const isActive = this.state.productType === '3d';

    return `
      <div class="params-block ${isActive ? 'active' : ''}" id="3d-params">
        <div class="block-title">ПАРАМЕТРЫ 3D НАКЛЕЕК</div>

        <div class="params-section">
          <div class="section-label">Основные параметры</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="width3d" value="30" min="5" max="500">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="height3d" value="30" min="5" max="500">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantity3d" value="100" min="1" max="10000">
            </div>
            <div class="param-group">
              <label class="label">Полимер</label>
              <select class="select" id="polymer">
                <option value="premium">Премиум полимер (гибкий)</option>
                <option value="standard">Стандарт полимер (твёрдый)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип расчёта</label>
              <select class="select" id="pricingType3d">
                <option value="retail">Розница</option>
                <option value="opt1">Опт1 -5%</option>
                <option value="opt2">Опт2 -10%</option>
                <option value="opt3">Опт3 -15%</option>
                <option value="opt4">Опт4 -20%</option>
                <option value="opt5">Опт5 -25%</option>
                <option value="opt6">Опт6 -30%</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPrice3D" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderOracalParams() {
    const isActive = this.state.productType === 'oracal';

    return `
      <div class="params-block ${isActive ? 'active' : ''}" id="oracal-params">
        <div class="block-title">ПАРАМЕТРЫ ОРАКАЛ</div>

        <div class="params-section">
          <div class="section-label">Параметры резки</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип</label>
              <select class="select" id="oracalType">
                <option value="with-print">С печатью</option>
                <option value="without-print">Без печати</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="widthOracal" value="100" min="5" max="600">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="heightOracal" value="100" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantityOracal" value="1" min="1" max="10000">
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPriceOracal" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderResult() {
    return `
      <div class="combined-block">
        <div class="result-block">
          <div class="result-item">
            <span class="result-label">За единицу</span>
            <span class="result-value" id="unitPrice">0₽</span>
          </div>
          <div class="result-item">
            <span class="result-label">За тираж</span>
            <span class="result-value" id="totalPrice">0₽</span>
          </div>
        </div>
        <button class="cart-button" id="addToCartBtn">
          <span>📥</span>
          <span>В корзину</span>
        </button>
      </div>
    `;
  }

  renderQuickQuantities() {
    if (this.state.productType !== 'standard') {
      return '<div id="quickQuantities" style="display: none;"></div>';
    }

    return `
      <div class="quick-quantities" id="quickQuantities">
        <div class="quantities-header">
          <div class="quantities-title">БЫСТРЫЙ ВЫБОР ТИРАЖА</div>
          <button class="copy-all-btn" id="copyAllBtn">
            📋 Копировать все
          </button>
        </div>
        <div class="quantities-grid" id="quantitiesGrid"></div>
      </div>
    `;
  }

  attachEvents() {
    // Product selector
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productType = card.dataset.product;
        this.selectProduct(productType);
      });
    });

    // Standard inputs
    this.attachInputEvent('width', (value) => this.setState({ width: parseFloat(value) || 50 }));
    this.attachInputEvent('height', (value) => this.setState({ height: parseFloat(value) || 50 }));
    this.attachInputEvent('quantity', (value) => this.setState({ quantity: parseInt(value) || 100 }));
    this.attachInputEvent('material', (value) => this.setState({ material: value }));
    this.attachInputEvent('pricingType', (value) => this.setState({ pricingType: value }));
    this.attachInputEvent('customPrice', (value) => this.setState({ customPrice: parseFloat(value) || null }));

    // 3D inputs
    this.attachInputEvent('width3d', (value) => this.setState({ width: parseFloat(value) || 30 }));
    this.attachInputEvent('height3d', (value) => this.setState({ height: parseFloat(value) || 30 }));
    this.attachInputEvent('quantity3d', (value) => this.setState({ quantity: parseInt(value) || 100 }));
    this.attachInputEvent('polymer', (value) => this.setState({ polymer: value }));
    this.attachInputEvent('pricingType3d', (value) => this.setState({ pricingType: value }));
    this.attachInputEvent('customPrice3D', (value) => this.setState({ customPrice3D: parseFloat(value) || null }));

    // Oracal inputs
    this.attachInputEvent('widthOracal', (value) => this.setState({ width: parseFloat(value) || 100 }));
    this.attachInputEvent('heightOracal', (value) => this.setState({ height: parseFloat(value) || 100 }));
    this.attachInputEvent('quantityOracal', (value) => this.setState({ quantity: parseInt(value) || 1 }));
    this.attachInputEvent('oracalType', (value) => this.setState({ oracalType: value }));
    this.attachInputEvent('customPriceOracal', (value) => this.setState({ customPriceOracal: parseFloat(value) || null }));

    // Add to cart button
    const addToCartBtn = document.querySelector('#addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    // Copy all button
    const copyAllBtn = document.querySelector('#copyAllBtn');
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', () => this.copyAllQuantities());
    }
  }

  attachInputEvent(id, handler) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => handler(e.target.value));
      el.addEventListener('change', (e) => handler(e.target.value));
    }
  }

  selectProduct(productType) {
    this.setState({ productType });

    // Update active class
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('active', card.dataset.product === productType);
    });

    // Show/hide params blocks
    document.querySelectorAll('.params-block').forEach(block => {
      block.classList.remove('active');
    });

    const activeBlock = document.getElementById(`${productType}-params`);
    if (activeBlock) {
      activeBlock.classList.add('active');
    }

    // Show/hide quick quantities
    const quickQty = document.getElementById('quickQuantities');
    if (quickQty) {
      quickQty.style.display = productType === 'standard' ? 'block' : 'none';
    }

    this.calculate();
  }

  onStateChange() {
    this.calculate();
  }

  calculate() {
    let result;

    switch (this.state.productType) {
      case 'standard':
        result = this.calculateStandard();
        this.updateQuickQuantities();
        break;
      case '3d':
        result = this.calculate3D();
        break;
      case 'oracal':
        result = this.calculateOracal();
        break;
      default:
        result = { unitPrice: 0, totalPrice: 0 };
    }

    this.updateResult(result);
    return result;
  }

  calculateStandard() {
    const { width, height, quantity, material, pricingType, customPrice } = this.state;

    const area = calculateArea(width, height);

    let pricePerCm2;

    if (pricingType === 'dynamic') {
      const sheetPrice = getDynamicPrice(quantity, DYNAMIC_PRICES);
      pricePerCm2 = sheetPrice / SHEET_AREA;
    } else {
      pricePerCm2 = SHEET_PRICES[pricingType] / SHEET_AREA;
    }

    pricePerCm2 *= MATERIAL_COEFFICIENTS[material];

    let unitPrice = roundUpToTenth(area * pricePerCm2);

    // Custom price override
    if (customPrice) {
      unitPrice = roundUpToTenth(customPrice);
    }

    const totalPrice = unitPrice * quantity;

    return { unitPrice, totalPrice };
  }

  calculate3D() {
    const { width, height, quantity, polymer, pricingType, customPrice3D } = this.state;

    const area = calculateArea(width, height);
    const pricePerCm2 = POLYMER_PRICES[polymer];

    const discount = OPT_DISCOUNTS[pricingType] || 0;

    let unitPrice = area * pricePerCm2;
    unitPrice *= (1 - discount / 100);
    unitPrice = roundUpToHalf(unitPrice);

    // Custom price override
    if (customPrice3D) {
      unitPrice = roundUpToHalf(customPrice3D);
    }

    const totalPrice = unitPrice * quantity;

    return { unitPrice, totalPrice };
  }

  calculateOracal() {
    const { width, height, quantity, oracalType, customPriceOracal } = this.state;

    const area = calculateArea(width, height);
    let unitPrice = roundUpToTenth(area * ORACAL_PRICES[oracalType]);

    // Custom price override
    if (customPriceOracal) {
      unitPrice = roundUpToTenth(customPriceOracal);
    }

    const totalPrice = unitPrice * quantity;

    return { unitPrice, totalPrice };
  }

  updateResult(result) {
    const unitPriceEl = document.getElementById('unitPrice');
    const totalPriceEl = document.getElementById('totalPrice');

    if (unitPriceEl) {
      unitPriceEl.textContent = `${result.unitPrice.toFixed(2)}₽`;
    }

    if (totalPriceEl) {
      totalPriceEl.textContent = `${Math.round(result.totalPrice)}₽`;
    }
  }

  updateQuickQuantities() {
    const grid = document.getElementById('quantitiesGrid');
    if (!grid || this.state.productType !== 'standard') return;

    const html = QUICK_QUANTITIES.map(qty => {
      // Temporarily change quantity for calculation
      const oldQty = this.state.quantity;
      this.state.quantity = qty;
      const result = this.calculateStandard();
      this.state.quantity = oldQty;

      const isSelected = qty === this.state.quantity;

      return `
        <div class="qty-card ${isSelected ? 'selected' : ''}" data-qty="${qty}">
          <div class="qty-value">${qty}шт</div>
          <div class="qty-price">${result.unitPrice.toFixed(2)}₽/шт</div>
          <div class="qty-total">${Math.round(result.totalPrice)}₽</div>
        </div>
      `;
    }).join('');

    grid.innerHTML = html;

    // Attach click events
    grid.querySelectorAll('.qty-card').forEach(card => {
      card.addEventListener('click', () => {
        const qty = parseInt(card.dataset.qty);
        this.setState({ quantity: qty });

        const qtyInput = document.getElementById('quantity');
        if (qtyInput) {
          qtyInput.value = qty;
        }
      });
    });
  }

  copyAllQuantities() {
    if (this.state.productType !== 'standard') return;

    const { width, height, material } = this.state;

    let text = `📋 Наклейки ${width}×${height}мм\n`;
    text += `Материал: ${this.getMaterialName(material)}\n`;
    text += '─────────\n';

    QUICK_QUANTITIES.forEach(qty => {
      const oldQty = this.state.quantity;
      this.state.quantity = qty;
      const result = this.calculateStandard();
      this.state.quantity = oldQty;

      text += `${qty}шт - ${result.unitPrice.toFixed(2)}₽ = ${Math.round(result.totalPrice)}₽\n`;
    });

    text += '──────────';

    navigator.clipboard.writeText(text).then(() => {
      this.eventBus.emit('toast:show', {
        message: 'Скопировано в буфер обмена',
        type: 'success'
      });
    });
  }

  getMaterialName(material) {
    const materials = {
      mat_gl: 'Пленка мат/гл',
      transp: 'Пленка прозр.',
      mat_gl_lam: 'Пленка мат/гл с лам.',
      transp_lam: 'Пленка прозр. с лам.',
      paper_self: 'Бумажная самоклейка'
    };
    return materials[material] || material;
  }

  prepareCartItem(result) {
    const { productType, width, height, quantity, material, polymer, oracalType } = this.state;

    let name = '';
    let description = '';

    if (productType === 'standard') {
      name = 'Наклейки';
      description = `${formatSize(width, height)}, ${this.getMaterialName(material)}`;
    } else if (productType === '3d') {
      name = '3D наклейки';
      const polymerName = polymer === 'premium' ? 'Премиум полимер' : 'Стандарт полимер';
      description = `${formatSize(width, height)}, ${polymerName}`;
    } else if (productType === 'oracal') {
      name = 'Оракал';
      const typeName = oracalType === 'with-print' ? 'С печатью' : 'Без печати';
      description = `${formatSize(width, height)}, ${typeName}`;
    }

    return {
      calculator: 'Наклейки',
      name,
      description,
      quantity: formatQuantity(quantity),
      unitPrice: `${result.unitPrice.toFixed(2)}₽`,
      price: result.totalPrice
    };
  }
}
