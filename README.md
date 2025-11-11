# CalcPRO 2.0

Модульная экосистема полиграфических калькуляторов на Vanilla JavaScript

## 🎨 Дизайн

Минималистичный дизайн в стиле Apple:
- Чистый, простой интерфейс
- Легкие тени и плавные переходы
- Адаптивный под все устройства
- Шрифт Inter для лучшей читаемости

## 🚀 Запуск проекта

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### Сборка для продакшена
```bash
npm run build
```

### Предпросмотр продакшен-сборки
```bash
npm run preview
```

## 📁 Структура проекта

```
calc-pro/
├── public/
│   ├── index.html                 # Главная HTML страница
│   └── assets/                    # Статические ресурсы
│
├── src/
│   ├── core/                      # 🎯 Ядро приложения
│   │   ├── App.js                # Главный класс приложения
│   │   ├── Router.js             # Маршрутизация
│   │   └── EventBus.js           # Глобальная шина событий
│   │
│   ├── components/                # 🧩 Переиспользуемые компоненты
│   │   ├── ui/                   # Базовые UI элементы
│   │   │   └── Toast.js
│   │   ├── layout/               # Компоненты макета
│   │   │   ├── Header.js
│   │   │   └── Tabs.js
│   │   └── cart/                 # Компоненты корзины
│   │       └── Cart.js
│   │
│   ├── calculators/               # 🧮 Калькуляторы
│   │   ├── BaseCalculator.js     # Базовый класс
│   │   └── stickers/             # Калькулятор наклеек
│   │       ├── StickersCalculator.js
│   │       └── pricing.js
│   │
│   ├── services/                  # 🔧 Бизнес-логика
│   │   ├── CartService.js        # Управление корзиной
│   │   └── StorageService.js     # Работа с LocalStorage
│   │
│   ├── utils/                     # 🛠️ Утилиты
│   │   ├── calculations.js       # Математические функции
│   │   └── formatters.js         # Форматирование данных
│   │
│   ├── styles/                    # 🎨 Стили
│   │   ├── variables.css         # CSS переменные
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   ├── calculators.css
│   │   └── responsive.css
│   │
│   └── main.js                    # Точка входа
│
├── package.json
├── vite.config.js
└── README.md
```

## 🛠 Технологии

- **Vanilla JavaScript** (ES6+ modules)
- **Vite** - сборщик и dev-сервер
- **CSS Custom Properties** - дизайн-система
- **LocalStorage** - хранение данных

## 🏗️ Архитектура

### Ключевые принципы:

1. **Модульность** - каждый калькулятор - независимый модуль
2. **Event-Driven** - компоненты общаются через EventBus
3. **Single Responsibility** - каждый класс отвечает за одну задачу
4. **Dependency Injection** - зависимости через конструктор
5. **Наследование** - BaseCalculator для переиспользования логики

## ✨ Основные возможности

### Реализовано в v1.0:
- ✅ Калькулятор стандартных наклеек
- ✅ Корзина расчетов с автосохранением в localStorage
- ✅ Копирование расчета в буфер обмена
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Минималистичный Apple-стиль

### Планируется добавить:
- Калькулятор 3D наклеек
- Калькулятор Оракала
- Калькуляторы печати
- Калькуляторы полиграфии
- Другие виды продукции

## 📱 Адаптивность

- **Desktop**: Калькулятор + боковая корзина
- **Mobile**: Калькулятор + всплывающая корзина снизу

## 🎯 Как использовать

1. Выберите размер наклейки или введите свой
2. Укажите материал и количество
3. Выберите тип расчета (розница/опт/динамический)
4. Увидите результат в реальном времени
5. Добавьте в корзину кнопкой
6. Скопируйте готовый расчет для отправки клиенту

## 🔧 Разработка

### Добавление нового калькулятора

```javascript
// 1. Создать класс калькулятора
import { BaseCalculator } from '../BaseCalculator.js';

export class YourCalculator extends BaseCalculator {
  constructor(app) {
    super(app);
  }

  render() {
    // Рендер UI
  }

  calculate() {
    // Логика расчета
    return { unitPrice: 0, totalPrice: 0 };
  }

  prepareCartItem(result) {
    // Подготовка данных для корзины
    return {
      calculator: 'Название',
      name: 'Товар',
      description: 'Описание',
      quantity: '100шт',
      unitPrice: '10₽',
      price: 1000
    };
  }
}

// 2. Зарегистрировать в main.js
app.registerCalculator('your-calc', YourCalculator, {
  name: 'Ваш калькулятор',
  icon: '📐'
});
```

### API Сервисов

**CartService:**
```javascript
cartService.add(item);      // Добавить в корзину
cartService.getItems();     // Получить товары
cartService.remove(index);  // Удалить
cartService.clear();        // Очистить
```

**EventBus:**
```javascript
eventBus.on('event', callback);   // Подписка
eventBus.emit('event', data);     // Вызов
eventBus.off('event', callback);  // Отписка
```

## 📄 Лицензия

© 2025 Типография Цифра
