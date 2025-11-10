// Функции для расчетов наклеек

// Цены за лист
export const sheetPrices = {
  retail: 1200,
  opt1: 850,
  opt2: 650,
  opt3: 550
}

// Коэффициенты материалов
export const materialCoeff = {
  mat_gl: 1.0,
  transp: 1.15,
  mat_gl_lam: 1.4,
  transp_lam: 1.5,
  paper_self: 0.5
}

// Динамические цены
export const dynamicPrices = {
  50: 1200,
  100: 1000,
  200: 850,
  500: 700,
  1000: 600,
  2000: 550,
  5000: 500
}

// Округление до 0.5
export const roundUpToHalf = (value) => {
  return Math.ceil(value * 2) / 2
}

// Округление до 0.1
export const roundUpToTenth = (value) => {
  return Math.ceil(value * 10) / 10
}

// Форматирование цены
export const formatPrice = (value) => {
  return new Intl.NumberFormat('ru-RU').format(value)
}

// Получение динамической цены листа
export const getDynamicSheetPrice = (quantity) => {
  if (quantity < 50) return dynamicPrices[50]
  if (quantity < 100) return dynamicPrices[50]
  if (quantity < 200) return dynamicPrices[100]
  if (quantity < 500) return dynamicPrices[200]
  if (quantity < 1000) return dynamicPrices[500]
  if (quantity < 2000) return dynamicPrices[1000]
  if (quantity < 5000) return dynamicPrices[2000]
  return dynamicPrices[5000]
}

// Расчет стандартных наклеек
export const calculateStandard = (params) => {
  const { width, height, quantity, material, pricingType } = params

  const area = (width * height) / 100 // площадь в см²
  const sheetArea = 6000 // площадь листа в см²

  let pricePerCm2

  if (pricingType === 'dynamic') {
    const sheetPrice = getDynamicSheetPrice(quantity)
    pricePerCm2 = sheetPrice / sheetArea
  } else {
    pricePerCm2 = sheetPrices[pricingType] / sheetArea
  }

  pricePerCm2 = pricePerCm2 * materialCoeff[material]

  const pricePerUnit = roundUpToTenth(area * pricePerCm2)
  const totalPrice = pricePerUnit * quantity

  return {
    unitPrice: pricePerUnit,
    totalPrice: totalPrice
  }
}

// Расчет 3D наклеек
export const calculate3D = (params) => {
  const { width, height, quantity, polymerType, pricingType } = params

  const pricing3D = {
    premium: 5.0,
    standard: 3.5
  }

  const discounts = {
    retail: 0,
    opt1: 5,
    opt2: 10,
    opt3: 15,
    opt4: 20,
    opt5: 25,
    opt6: 30
  }

  const area = (width * height) / 100
  const pricePerCm2 = pricing3D[polymerType]
  let pricePerUnit = area * pricePerCm2

  const discount = discounts[pricingType] || 0
  pricePerUnit = pricePerUnit * (1 - discount / 100)
  pricePerUnit = roundUpToHalf(pricePerUnit)

  const totalPrice = pricePerUnit * quantity

  return {
    unitPrice: pricePerUnit,
    totalPrice: totalPrice
  }
}

// Расчет оракала
export const calculateOracal = (params) => {
  const { width, height, quantity, type } = params

  const pricingOracal = {
    'with-print': 0.25,
    'without-print': 0.15
  }

  const area = (width * height) / 100
  const pricePerUnit = roundUpToTenth(area * pricingOracal[type])
  const totalPrice = pricePerUnit * quantity

  return {
    unitPrice: pricePerUnit,
    totalPrice: totalPrice
  }
}
