<template>
  <div id="app">
    <AppHeader @toggleCart="toggleCart" />

    <main class="main-content">
      <div class="container">
        <div class="layout">
          <!-- Калькулятор -->
          <div class="calculator-section">
            <StickersCalculator />
          </div>

          <!-- Корзина (desktop) -->
          <aside class="cart-section" v-if="!isMobile">
            <AppCart />
          </aside>
        </div>
      </div>
    </main>

    <!-- Корзина (mobile) -->
    <transition name="slide-up">
      <div v-if="isMobile && showMobileCart" class="mobile-cart-overlay" @click="toggleCart">
        <div class="mobile-cart-container" @click.stop>
          <div class="mobile-cart-handle"></div>
          <AppCart />
        </div>
      </div>
    </transition>

    <!-- Уведомления -->
    <Transition name="fade">
      <div v-if="notification.show" class="notification">
        {{ notification.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppCart from './components/AppCart.vue'
import StickersCalculator from './calculators/StickersCalculator.vue'
import { useCartStore } from './stores/cart'

const cartStore = useCartStore()

const isMobile = ref(window.innerWidth <= 768)
const showMobileCart = ref(false)
const notification = ref({
  show: false,
  message: ''
})

// Отслеживаем изменение размера окна
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    showMobileCart.value = false
  }
}

// Переключение корзины на мобильном
const toggleCart = () => {
  showMobileCart.value = !showMobileCart.value
}

// Показ уведомлений при добавлении в корзину
watch(() => cartStore.itemsCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    notification.value = {
      show: true,
      message: 'Добавлено в корзину'
    }
    setTimeout(() => {
      notification.value.show = false
    }, 2000)
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
@import './styles/main.css';

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
  background: var(--color-background);
}

.layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--spacing-xl);
  align-items: start;
}

.cart-section {
  position: sticky;
  top: 100px;
  height: calc(100vh - 120px);
}

/* Mobile cart */
.mobile-cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.mobile-cart-container {
  width: 100%;
  max-height: 85vh;
  background: var(--color-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.mobile-cart-handle {
  width: 40px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  margin: 0 auto var(--spacing-md);
}

/* Notifications */
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: white;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  z-index: 2000;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .cart-section {
    display: none;
  }

  .main-content {
    padding: var(--spacing-lg) 0;
  }
}
</style>
