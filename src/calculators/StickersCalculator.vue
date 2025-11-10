<template>
  <div class="calculator">
    <div class="calc-header">
      <h2>Калькулятор наклеек</h2>
      <p>Быстрый расчет стоимости печати наклеек</p>
    </div>

    <div class="calc-body">
      <!-- Размер -->
      <div class="input-group">
        <label class="input-label">Размер</label>
        <select v-model="sizePreset" class="select-input">
          <option value="custom">Свой размер</option>
          <optgroup label="Квадратные">
            <option value="30x30">30×30 мм</option>
            <option value="40x40">40×40 мм</option>
            <option value="50x50">50×50 мм</option>
            <option value="60x60">60×60 мм</option>
            <option value="70x70">70×70 мм</option>
            <option value="80x80">80×80 мм</option>
            <option value="90x90">90×90 мм</option>
            <option value="100x100">100×100 мм</option>
          </optgroup>
          <optgroup label="Прямоугольные">
            <option value="30x40">30×40 мм</option>
            <option value="40x50">40×50 мм</option>
            <option value="50x70">50×70 мм</option>
            <option value="60x90">60×90 мм</option>
            <option value="70x100">70×100 мм</option>
          </optgroup>
        </select>
      </div>

      <!-- Свой размер -->
      <div v-if="sizePreset === 'custom'" class="input-row">
        <div class="input-group">
          <label class="input-label">Ширина, мм</label>
          <input
            v-model.number="width"
            type="number"
            class="text-input"
            min="5"
            max="2000"
            placeholder="50"
          >
        </div>
        <div class="input-group">
          <label class="input-label">Высота, мм</label>
          <input
            v-model.number="height"
            type="number"
            class="text-input"
            min="5"
            max="2000"
            placeholder="50"
          >
        </div>
      </div>

      <!-- Материал и количество -->
      <div class="input-row">
        <div class="input-group">
          <label class="input-label">Материал</label>
          <select v-model="material" class="select-input">
            <option value="mat_gl">Пленка мат/гл</option>
            <option value="transp">Пленка прозр.</option>
            <option value="mat_gl_lam">Пленка мат/гл с лам.</option>
            <option value="transp_lam">Пленка прозр. с лам.</option>
            <option value="paper_self">Бумажная самоклейка</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Количество</label>
          <input
            v-model.number="quantity"
            type="number"
            class="text-input"
            min="1"
            max="100000"
            placeholder="100"
          >
        </div>
      </div>

      <!-- Тип расчета -->
      <div class="input-group">
        <label class="input-label">Тип расчета</label>
        <select v-model="pricingType" class="select-input">
          <option value="retail">Розница (1200₽/лист)</option>
          <option value="opt1">Опт1 (850₽/лист)</option>
          <option value="opt2">Опт2 (650₽/лист)</option>
          <option value="opt3">Опт3 (550₽/лист)</option>
          <option value="dynamic">Динамический</option>
        </select>
      </div>

      <!-- Результат -->
      <div class="result-card">
        <div class="result-item">
          <span class="result-label">За единицу</span>
          <span class="result-value">{{ unitPrice.toFixed(2) }} ₽</span>
        </div>
        <div class="result-item">
          <span class="result-label">За тираж</span>
          <span class="result-value primary">{{ totalPrice.toFixed(0) }} ₽</span>
        </div>
      </div>

      <!-- Кнопка добавления в корзину -->
      <button class="add-to-cart-btn" @click="addToCart">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 2L3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V6L14 2H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 6H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Добавить в корзину</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { calculateStandard } from '../utils/calculations'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

// State
const sizePreset = ref('50x50')
const width = ref(50)
const height = ref(50)
const quantity = ref(100)
const material = ref('mat_gl')
const pricingType = ref('retail')

// Материалы для отображения
const materialNames = {
  mat_gl: 'Пленка мат/гл',
  transp: 'Пленка прозр.',
  mat_gl_lam: 'Пленка мат/гл с лам.',
  transp_lam: 'Пленка прозр. с лам.',
  paper_self: 'Бумажная самоклейка'
}

// Следим за изменением пресета размера
watch(sizePreset, (newValue) => {
  if (newValue !== 'custom') {
    const [w, h] = newValue.split('x').map(Number)
    width.value = w
    height.value = h
  }
})

// Вычисление цены
const calculation = computed(() => {
  return calculateStandard({
    width: width.value,
    height: height.value,
    quantity: quantity.value,
    material: material.value,
    pricingType: pricingType.value
  })
})

const unitPrice = computed(() => calculation.value.unitPrice)
const totalPrice = computed(() => calculation.value.totalPrice)

// Добавление в корзину
const addToCart = () => {
  cartStore.addItem({
    calculator: 'Наклейки',
    name: 'Наклейки',
    description: `${width.value}×${height.value}мм, ${materialNames[material.value]}`,
    quantity: `${quantity.value}шт`,
    unitPrice: `${unitPrice.value.toFixed(2)}₽`,
    price: totalPrice.value
  })
}
</script>

<style scoped>
.calculator {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  animation: fadeIn 0.3s;
}

.calc-header {
  margin-bottom: var(--spacing-xl);
}

.calc-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.calc-header p {
  color: var(--color-text-secondary);
  font-size: 15px;
}

.calc-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.3px;
}

.text-input,
.select-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 15px;
  background: var(--color-surface);
  color: var(--color-text);
  transition: var(--transition);
}

.text-input:hover,
.select-input:hover {
  border-color: var(--color-primary);
}

.text-input:focus,
.select-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.result-card {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: white;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-lg);
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-label {
  font-size: 13px;
  opacity: 0.85;
  font-weight: 500;
}

.result-value {
  font-size: 20px;
  font-weight: 700;
}

.result-value.primary {
  font-size: 28px;
}

.add-to-cart-btn {
  background: var(--color-success);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
  box-shadow: var(--shadow-md);
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .calculator {
    padding: var(--spacing-lg);
  }

  .input-row {
    grid-template-columns: 1fr;
  }

  .calc-header h2 {
    font-size: 20px;
  }
}
</style>
