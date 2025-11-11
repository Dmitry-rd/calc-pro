/**
 * Tabs - Вкладки навигации между калькуляторами
 */
export class Tabs {
  constructor(router) {
    this.router = router;
    this.element = null;
    this.activeTab = null;
  }

  /**
   * Конфигурация вкладок
   */
  getTabsConfig() {
    return [
      {
        id: 'stickers',
        icon: '🏷️',
        label: 'Наклейки',
        route: 'stickers'
      },
      {
        id: 'print',
        icon: '🖨️',
        label: 'Печать',
        dropdown: [
          { id: 'print-digital', icon: '🖨️', label: 'Цифровая печать', route: 'print-digital' },
          { id: 'print-salon', icon: '🎨', label: 'Салон', route: 'print-salon' }
        ]
      },
      {
        id: 'poly',
        icon: '📚',
        label: 'Полиграфия',
        dropdown: [
          { id: 'poly-cards', icon: '💳', label: 'Визитки', route: 'poly-cards' },
          { id: 'poly-leaflets', icon: '📄', label: 'Листовки/Буклеты', route: 'poly-leaflets' },
          { id: 'poly-calendars', icon: '📅', label: 'Календари', route: 'poly-calendars' },
          { id: 'poly-notebooks', icon: '📔', label: 'Блокноты', route: 'poly-notebooks' }
        ]
      },
      { id: 'wide', icon: '🖼️', label: 'Широкоформат', route: 'wide' },
      { id: 'stands', icon: '🪧', label: 'Стенды', route: 'stands' },
      { id: 'ads', icon: '📢', label: 'Реклама', route: 'ads' },
      { id: 'stamps', icon: '📋', label: 'Печати', route: 'stamps' },
      { id: 'souv', icon: '🎁', label: 'Сувениры', route: 'souv' },
      { id: 'serv', icon: '⚙️', label: 'Услуги', route: 'serv' },
      { id: 'projects', icon: '📐', label: 'Проекты', route: 'projects' }
    ];
  }

  render() {
    const tabs = document.createElement('div');
    tabs.className = 'tabs desktop-only';

    const config = this.getTabsConfig();

    config.forEach(tab => {
      const button = document.createElement('button');
      button.className = 'tab';
      button.dataset.tabId = tab.id;

      if (tab.dropdown) {
        button.innerHTML = `
          <span class="tab-icon">${tab.icon}</span>
          <span class="tab-text">${tab.label}</span>
          <span class="tab-arrow">▼</span>
        `;

        // Создаем dropdown
        const dropdown = this.createDropdown(tab.dropdown);
        button.appendChild(dropdown);

        button.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDropdown(button);
        });
      } else {
        button.innerHTML = `
          <span class="tab-icon">${tab.icon}</span>
          <span class="tab-text">${tab.label}</span>
        `;

        button.addEventListener('click', () => {
          this.selectTab(tab.route);
        });
      }

      tabs.appendChild(button);
    });

    // Закрывать dropdown при клике вне его
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tab')) {
        this.closeAllDropdowns();
      }
    });

    this.element = tabs;
    return tabs;
  }

  createDropdown(items) {
    const dropdown = document.createElement('div');
    dropdown.className = 'tab-dropdown';

    items.forEach(item => {
      const dropdownItem = document.createElement('div');
      dropdownItem.className = 'dropdown-item';
      dropdownItem.innerHTML = `
        <span class="dropdown-icon">${item.icon}</span>
        <span>${item.label}</span>
      `;

      dropdownItem.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectTab(item.route);
        this.closeAllDropdowns();
      });

      dropdown.appendChild(dropdownItem);
    });

    return dropdown;
  }

  toggleDropdown(button) {
    const dropdown = button.querySelector('.tab-dropdown');
    const isOpen = dropdown.classList.contains('show');

    this.closeAllDropdowns();

    if (!isOpen) {
      dropdown.classList.add('show');
    }
  }

  closeAllDropdowns() {
    const dropdowns = this.element.querySelectorAll('.tab-dropdown');
    dropdowns.forEach(d => d.classList.remove('show'));
  }

  selectTab(route) {
    // Убираем active со всех табов
    const tabs = this.element.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Находим и активируем нужный таб
    const activeTab = Array.from(tabs).find(t => {
      const dropdown = t.querySelector('.tab-dropdown');
      if (dropdown) {
        const hasActiveItem = dropdown.querySelector(`[data-route="${route}"]`);
        return hasActiveItem;
      }
      return t.dataset.tabId === route;
    });

    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Навигация
    this.router.navigate(route);
  }

  mount(parent) {
    if (!this.element) {
      this.render();
    }
    parent.appendChild(this.element);
  }
}
