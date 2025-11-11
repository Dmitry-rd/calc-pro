/**
 * StorageService - Работа с LocalStorage
 */
export class StorageService {
  constructor(prefix = 'calcpro_') {
    this.prefix = prefix;
  }

  /**
   * Сохранить данные
   * @param {string} key - Ключ
   * @param {*} value - Значение
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('StorageService.set error:', error);
      return false;
    }
  }

  /**
   * Получить данные
   * @param {string} key - Ключ
   * @param {*} defaultValue - Значение по умолчанию
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('StorageService.get error:', error);
      return defaultValue;
    }
  }

  /**
   * Удалить данные
   * @param {string} key - Ключ
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('StorageService.remove error:', error);
      return false;
    }
  }

  /**
   * Очистить все данные
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('StorageService.clear error:', error);
      return false;
    }
  }
}
