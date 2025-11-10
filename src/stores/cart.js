import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])

  // Загрузка из localStorage при инициализации
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('calcProCart')
      if (saved) {
        items.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
      items.value = []
    }
  }

  // Сохранение в localStorage при изменении
  const saveToStorage = () => {
    try {
      localStorage.setItem('calcProCart', JSON.stringify(items.value))
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error)
    }
  }

  // Автосохранение при изменении корзины
  watch(items, saveToStorage, { deep: true })

  // Computed
  const itemsCount = computed(() => items.value.length)

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price || 0), 0)
  })

  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('ru-RU').format(totalPrice.value) + ' ₽'
  })

  // Actions
  const addItem = (item) => {
    const cartItem = {
      id: Date.now(),
      calculator: item.calculator || '',
      name: item.name || '',
      description: item.description || '',
      quantity: item.quantity || '1шт',
      unitPrice: item.unitPrice || '0₽',
      price: item.price || 0,
      timestamp: new Date().toISOString()
    }

    items.value.push(cartItem)
  }

  const removeItem = (id) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const copyToClipboard = () => {
    if (items.value.length === 0) {
      return { success: false, message: 'Корзина пуста' }
    }

    let text = 'Подготовили расчет по вашему запросу: 👇\n\n'
    text += '📋 Расчет:\n'
    text += '────────────\n'

    items.value.forEach((item, index) => {
      text += `${index + 1}. ${item.name}, ${item.description}\n`
      text += `   ${item.quantity} × ${item.unitPrice} = ${new Intl.NumberFormat('ru-RU').format(item.price)} ₽\n`
      if (index < items.value.length - 1) {
        text += '\n'
      }
    })

    text += '────────────\n'
    text += `💰 ИТОГО: ${formattedTotal.value}`

    return navigator.clipboard.writeText(text)
      .then(() => ({ success: true, message: 'Скопировано в буфер обмена' }))
      .catch(() => ({ success: false, message: 'Не удалось скопировать' }))
  }

  // Инициализация - загружаем из localStorage
  loadFromStorage()

  return {
    // State
    items,
    // Computed
    itemsCount,
    totalPrice,
    formattedTotal,
    // Actions
    addItem,
    removeItem,
    clearCart,
    copyToClipboard
  }
})
