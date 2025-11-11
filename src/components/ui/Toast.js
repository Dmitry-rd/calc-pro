/**
 * Toast - Всплывающие уведомления
 */
export class Toast {
  static show(message, type = 'default', duration = 2500) {
    // Удаляем предыдущий toast если есть
    const existing = document.querySelector('.toast');
    if (existing) {
      existing.remove();
    }

    // Создаем новый toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Автоматически удаляем через заданное время
    setTimeout(() => {
      toast.remove();
    }, duration);

    return toast;
  }

  static success(message, duration) {
    return Toast.show(message, 'success', duration);
  }

  static error(message, duration) {
    return Toast.show(message, 'error', duration);
  }
}
