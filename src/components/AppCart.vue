<template>
  <div class="cart-container">
    <div class="cart-header">
      <h2>Корзина</h2>
      <button
        v-if="itemsCount > 0"
        class="clear-btn"
        @click="handleClear"
        title="Очистить корзину"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M14 4L4 14M4 4L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="cart-body" v-if="itemsCount > 0">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <div class="item-header">
          <span class="item-calculator">{{ item.calculator }}</span>
          <button class="remove-btn" @click="cartStore.removeItem(item.id)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <h3 class="item-name">{{ item.name }}</h3>
        <p class="item-description">{{ item.description }}</p>
        <div class="item-footer">
          <span class="item-quantity">{{ item.quantity }}</span>
          <span class="item-price">{{ formatPrice(item.price) }} ₽</span>
        </div>
      </div>
    </div>

    <div class="cart-empty" v-else>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" opacity="0.2"/>
        <path d="M20 16L14 24V52C14 53.0609 14.4214 54.0783 15.1716 54.8284C15.9217 55.5786 16.9391 56 18 56H46C47.0609 56 48.0783 55.5786 48.8284 54.8284C49.5786 54.0783 50 53.0609 50 52V24L44 16H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
        <path d="M14 24H50" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
      </svg>
      <p>Корзина пуста</p>
    </div>

    <div class="cart-footer" v-if="itemsCount > 0">
      <div class="total">
        <span>Итого</span>
        <strong>{{ formattedTotal }}</strong>
      </div>
      <button class="copy-btn" @click="handleCopy">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="6" y="6" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 6V4C12 3.44772 11.5523 3 11 3H3C2.44772 3 2 3.44772 2 4V12C2 12.5523 2.44772 13 3 13H6" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span>{{ copyButtonText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const copyButtonText = ref('Копировать')

const items = computed(() => cartStore.items)
const itemsCount = computed(() => cartStore.itemsCount)
const formattedTotal = computed(() => cartStore.formattedTotal)

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const handleClear = () => {
  if (confirm('Очистить корзину?')) {
    cartStore.clearCart()
  }
}

const handleCopy = async () => {
  const result = await cartStore.copyToClipboard()
  if (result.success) {
    copyButtonText.value = 'Скопировано!'
    setTimeout(() => {
      copyButtonText.value = 'Копировать'
    }, 2000)
  }
}
</script>

<style scoped>
.cart-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 120px);
  box-shadow: var(--shadow-md);
}

.cart-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.clear-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: var(--transition);
}

.clear-btn:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
  transform: rotate(90deg);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: var(--transition);
  animation: fadeIn 0.3s;
}

.cart-item:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.item-calculator {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-primary);
}

.remove-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: var(--transition);
}

.remove-btn:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: white;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  margin: var(--spacing-xs) 0;
}

.item-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.item-quantity {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.cart-empty svg {
  margin-bottom: var(--spacing-md);
}

.cart-empty p {
  font-size: 15px;
}

.cart-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.02);
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-size: 16px;
}

.total strong {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
}

.copy-btn {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
}

.copy-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.copy-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .cart-container {
    max-height: none;
    height: auto;
  }
}
</style>
