/**
 * Header - Шапка приложения с логотипом и брендом
 */
export class Header {
  constructor() {
    this.element = null;
  }

  render() {
    const header = document.createElement('div');
    header.className = 'header-wrapper';
    header.innerHTML = `
      <div class="header">
        <div class="logo-section">
          <img src="https://s.iimg.su/s/21/gPKm9zaxgnyUlRPESIzdTXWqzemf24sh8GAacCT4.png"
               alt="CalcPRO Logo"
               class="logo-img">
          <div class="brand">
            <h1>CalcPRO 2.0</h1>
            <p>Экосистема полиграфических решений</p>
            <p>Разработано и поддерживается Типографией Цифра</p>
          </div>
        </div>
      </div>
    `;

    this.element = header;
    return header;
  }

  mount(parent) {
    if (!this.element) {
      this.render();
    }
    parent.appendChild(this.element);
  }
}
