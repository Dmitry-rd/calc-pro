<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo-section">
          <img
            src="https://s.iimg.su/s/21/gPKm9zaxgnyUlRPESIzdTXWqzemf24sh8GAacCT4.png"
            alt="CalcPRO"
            class="logo"
          >
          <div class="brand">
            <h1>CalcPRO</h1>
            <p>Полиграфические решения</p>
          </div>
        </div>

        <div class="cart-badge" @click="$emit('toggleCart')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 2L3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V6L14 2H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 10C13 10.7956 12.6839 11.5587 12.1213 12.1213C11.5587 12.6839 10.7956 13 10 13C9.20435 13 8.44129 12.6839 7.87868 12.1213C7.31607 11.5587 7 10.7956 7 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="itemsCount > 0" class="badge">{{ itemsCount }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { computed } from 'vue'

defineEmits(['toggleCart'])

const cartStore = useCartStore()
const itemsCount = computed(() => cartStore.itemsCount)
</script>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.8);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.brand h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
}

.brand p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 2px 0 0 0;
  line-height: 1.2;
}

.cart-badge {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  color: var(--color-text);
}

.cart-badge:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .brand h1 {
    font-size: 18px;
  }

  .brand p {
    font-size: 12px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }
}
</style>
