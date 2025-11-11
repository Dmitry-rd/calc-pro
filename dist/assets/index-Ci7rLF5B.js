(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();class f{constructor(){this.events={}}on(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)}off(t,e){this.events[t]&&(this.events[t]=this.events[t].filter(a=>a!==e))}emit(t,e){this.events[t]&&this.events[t].forEach(a=>a(e))}once(t,e){const a=s=>{e(s),this.off(t,a)};this.on(t,a)}}class S{constructor(t){this.eventBus=t,this.currentRoute=null,this.routes=new Map}register(t,e){this.routes.set(t,e)}navigate(t,e={}){const a=this.routes.get(t);if(!a){console.error(`Route "${t}" not found`);return}this.currentRoute={name:t,params:e,config:a},this.eventBus.emit("route:change",{name:t,params:e,config:a})}getCurrentRoute(){return this.currentRoute}getRoutes(){return this.routes}}class C{constructor(){this.eventBus=new f,this.router=new S(this.eventBus),this.components=new Map,this.services=new Map,this.currentCalculator=null}registerComponent(t,e){this.components.set(t,e),e.init&&e.init(this.eventBus,this.router)}registerService(t,e){this.services.set(t,e),e.init&&e.init(this.eventBus)}getComponent(t){return this.components.get(t)||null}getService(t){return this.services.get(t)||null}registerCalculator(t,e,a={}){this.router.register(t,{CalculatorClass:e,...a})}loadCalculator(t){this.router.getCurrentRoute(),this.currentCalculator&&this.currentCalculator.destroy&&this.currentCalculator.destroy();const e=this.router.getRoutes().get(t);if(!e){console.error(`Calculator "${t}" not found`);return}const{CalculatorClass:a}=e;this.currentCalculator=new a(this),this.currentCalculator.render&&this.currentCalculator.render()}async init(){this.eventBus.on("route:change",({name:t})=>{this.loadCalculator(t)}),console.log("CalcPRO 2.0 initialized")}mount(t){if(this.rootElement=document.querySelector(t),!this.rootElement)throw new Error(`Element "${t}" not found`);console.log(`App mounted to ${t}`)}}class w{constructor(t="calcpro_"){this.prefix=t}set(t,e){try{const a=JSON.stringify(e);return localStorage.setItem(this.prefix+t,a),!0}catch(a){return console.error("StorageService.set error:",a),!1}}get(t,e=null){try{const a=localStorage.getItem(this.prefix+t);return a?JSON.parse(a):e}catch(a){return console.error("StorageService.get error:",a),e}}remove(t){try{return localStorage.removeItem(this.prefix+t),!0}catch(e){return console.error("StorageService.remove error:",e),!1}}clear(){try{return Object.keys(localStorage).forEach(e=>{e.startsWith(this.prefix)&&localStorage.removeItem(e)}),!0}catch(t){return console.error("StorageService.clear error:",t),!1}}}class E{constructor(t){this.storage=t,this.items=[],this.eventBus=null}init(t){this.eventBus=t,this.load()}load(){this.items=this.storage.get("cart",[]),this.emit()}save(){this.storage.set("cart",this.items),this.emit()}add(t){const e={id:Date.now(),timestamp:new Date().toISOString(),...t};return this.items.push(e),this.save(),e}remove(t){return t>=0&&t<this.items.length?(this.items.splice(t,1),this.save(),!0):!1}clear(){this.items=[],this.save()}getItems(){return this.items}getCount(){return this.items.length}getTotal(){return this.items.reduce((t,e)=>t+(e.price||0),0)}exportToText(){if(this.items.length===0)return"";let t=`Подготовили расчет по вашему запросу: 👇

`;return t+=`📋 Расчет:
`,t+=`────────────
`,this.items.forEach((e,a)=>{t+=`${a+1}. ${e.name}, ${e.description||e.desc||""}
`,t+=`   ${e.quantity||e.qty||"1шт"} × ${e.unitPrice||e.unit||"0₽"} = ${this.formatPrice(e.price)}₽
`,a<this.items.length-1&&(t+=`
`)}),t+=`────────────
`,t+=`💰 ИТОГО: ${this.formatPrice(this.getTotal())}₽`,t}formatPrice(t){return new Intl.NumberFormat("ru-RU").format(t)}emit(){this.eventBus&&this.eventBus.emit("cart:updated",{items:this.items,count:this.getCount(),total:this.getTotal()})}}class p{static show(t,e="default",a=2500){const s=document.querySelector(".toast");s&&s.remove();const i=document.createElement("div");return i.className=`toast ${e}`,i.textContent=t,document.body.appendChild(i),setTimeout(()=>{i.remove()},a),i}static success(t,e){return p.show(t,"success",e)}static error(t,e){return p.show(t,"error",e)}}class P{constructor(){this.element=null}render(){const t=document.createElement("div");return t.className="header-wrapper",t.innerHTML=`
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
    `,this.element=t,t}mount(t){this.element||this.render(),t.appendChild(this.element)}}class T{constructor(t){this.router=t,this.element=null,this.activeTab=null}getTabsConfig(){return[{id:"stickers",icon:"🏷️",label:"Наклейки",route:"stickers"},{id:"print",icon:"🖨️",label:"Печать",dropdown:[{id:"print-digital",icon:"🖨️",label:"Цифровая печать",route:"print-digital"},{id:"print-salon",icon:"🎨",label:"Салон",route:"print-salon"}]},{id:"poly",icon:"📚",label:"Полиграфия",dropdown:[{id:"poly-cards",icon:"💳",label:"Визитки",route:"poly-cards"},{id:"poly-leaflets",icon:"📄",label:"Листовки/Буклеты",route:"poly-leaflets"},{id:"poly-calendars",icon:"📅",label:"Календари",route:"poly-calendars"},{id:"poly-notebooks",icon:"📔",label:"Блокноты",route:"poly-notebooks"}]},{id:"wide",icon:"🖼️",label:"Широкоформат",route:"wide"},{id:"stands",icon:"🪧",label:"Стенды",route:"stands"},{id:"ads",icon:"📢",label:"Реклама",route:"ads"},{id:"stamps",icon:"📋",label:"Печати",route:"stamps"},{id:"souv",icon:"🎁",label:"Сувениры",route:"souv"},{id:"serv",icon:"⚙️",label:"Услуги",route:"serv"},{id:"projects",icon:"📐",label:"Проекты",route:"projects"}]}render(){const t=document.createElement("div");return t.className="tabs desktop-only",this.getTabsConfig().forEach(a=>{const s=document.createElement("button");if(s.className="tab",s.dataset.tabId=a.id,a.dropdown){s.innerHTML=`
          <span class="tab-icon">${a.icon}</span>
          <span class="tab-text">${a.label}</span>
          <span class="tab-arrow">▼</span>
        `;const i=this.createDropdown(a.dropdown);s.appendChild(i),s.addEventListener("click",n=>{n.stopPropagation(),this.toggleDropdown(s)})}else s.innerHTML=`
          <span class="tab-icon">${a.icon}</span>
          <span class="tab-text">${a.label}</span>
        `,s.addEventListener("click",()=>{this.selectTab(a.route)});t.appendChild(s)}),document.addEventListener("click",a=>{a.target.closest(".tab")||this.closeAllDropdowns()}),this.element=t,t}createDropdown(t){const e=document.createElement("div");return e.className="tab-dropdown",t.forEach(a=>{const s=document.createElement("div");s.className="dropdown-item",s.innerHTML=`
        <span class="dropdown-icon">${a.icon}</span>
        <span>${a.label}</span>
      `,s.addEventListener("click",i=>{i.stopPropagation(),this.selectTab(a.route),this.closeAllDropdowns()}),e.appendChild(s)}),e}toggleDropdown(t){const e=t.querySelector(".tab-dropdown"),a=e.classList.contains("show");this.closeAllDropdowns(),a||e.classList.add("show")}closeAllDropdowns(){this.element.querySelectorAll(".tab-dropdown").forEach(e=>e.classList.remove("show"))}selectTab(t){const e=this.element.querySelectorAll(".tab");e.forEach(s=>s.classList.remove("active"));const a=Array.from(e).find(s=>{const i=s.querySelector(".tab-dropdown");return i?i.querySelector(`[data-route="${t}"]`):s.dataset.tabId===t});a&&a.classList.add("active"),this.router.navigate(t)}mount(t){this.element||this.render(),t.appendChild(this.element)}}class q{constructor(t){this.cartService=t,this.element=null,this.eventBus=null}init(t){this.eventBus=t,this.eventBus.on("cart:updated",()=>{this.update()})}render(){const t=document.createElement("div");return t.className="cart desktop-only",t.innerHTML=`
      <div class="cart-header">
        <div class="cart-title">
          Корзина расчётов
          <span class="cart-badge" id="cartCount">0</span>
        </div>
        <button class="cart-clear" id="clearCartBtn" title="Очистить корзину">✕</button>
      </div>

      <div class="cart-body" id="cartBody">
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-text">Корзина пуста</div>
        </div>
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span class="cart-total-label">ИТОГО:</span>
          <span class="cart-total-sum" id="totalSum">0 ₽</span>
        </div>
        <button class="copy-btn" id="copyCartBtn">
          📋 Копировать расчёт
        </button>
        <div class="tools-divider"></div>
        <div class="tools-group">
          <button class="tool-btn" id="managerBtn">
            📝 Конструктор скриптов
          </button>
          <button class="tool-btn" id="layoutBtn">
            🖨️ Раскладка для печати
          </button>
        </div>
      </div>
    `,this.element=t,this.attachEvents(),this.update(),t}attachEvents(){this.element.querySelector("#clearCartBtn").addEventListener("click",()=>{this.cartService.getCount()!==0&&confirm("Очистить корзину?")&&this.cartService.clear()}),this.element.querySelector("#copyCartBtn").addEventListener("click",()=>{this.copyToClipboard()}),this.element.querySelector("#managerBtn").addEventListener("click",()=>{this.eventBus.emit("modal:open",{type:"manager"})}),this.element.querySelector("#layoutBtn").addEventListener("click",()=>{this.eventBus.emit("modal:open",{type:"layout"})})}update(){if(!this.element)return;const t=this.cartService.getItems(),e=this.cartService.getCount(),a=this.cartService.getTotal(),s=this.element.querySelector("#cartCount");s.textContent=e;const i=this.element.querySelector("#totalSum");i.textContent=`${this.cartService.formatPrice(a)} ₽`;const n=this.element.querySelector("#cartBody");e===0?n.innerHTML=`
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-text">Корзина пуста</div>
        </div>
      `:(n.innerHTML=t.map((o,l)=>`
        <div class="cart-item">
          <button class="cart-item-remove" data-index="${l}">✕</button>
          <div class="cart-item-type">${o.calculator||o.calc||"Расчет"}</div>
          <div class="cart-item-name">${o.name}</div>
          <div class="cart-item-desc">${o.description||o.desc||""}</div>
          <div class="cart-item-calc">
            <span>${o.quantity||o.qty||"1шт"} × ${o.unitPrice||o.unit||"0₽"} = ${this.cartService.formatPrice(o.price)} ₽</span>
          </div>
        </div>
      `).join(""),n.querySelectorAll(".cart-item-remove").forEach(o=>{o.addEventListener("click",()=>{const l=parseInt(o.dataset.index);this.cartService.remove(l)})}))}async copyToClipboard(){if(this.cartService.getCount()===0){this.eventBus.emit("toast:show",{message:"Корзина пуста"});return}const t=this.cartService.exportToText();try{await navigator.clipboard.writeText(t),this.eventBus.emit("toast:show",{message:"Скопировано в буфер обмена",type:"success"});const e=this.element.querySelector("#copyCartBtn");e.classList.add("success"),setTimeout(()=>{e.classList.remove("success")},1e3)}catch{this.fallbackCopy(t)}}fallbackCopy(t){const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.top="-999px",document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy"),this.eventBus.emit("toast:show",{message:"Скопировано в буфер обмена",type:"success"})}catch{this.eventBus.emit("toast:show",{message:"Не удалось скопировать",type:"error"})}document.body.removeChild(e)}mount(t){this.element||this.render(),t.appendChild(this.element)}}class B{constructor(t){this.app=t,this.eventBus=t.eventBus,this.cartService=t.getService("cart"),this.element=null,this.state={}}render(){throw new Error("render() must be implemented")}setState(t){this.state={...this.state,...t},this.onStateChange()}onStateChange(){}calculate(){throw new Error("calculate() must be implemented")}addToCart(){const t=this.calculate(),e=this.prepareCartItem(t);this.cartService.add(e),this.eventBus.emit("toast:show",{message:"Добавлено в корзину",type:"success"})}prepareCartItem(t){throw new Error("prepareCartItem() must be implemented")}destroy(){this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null}getContainer(){return document.querySelector("#calcBody")}}const $={retail:1200,opt1:850,opt2:650,opt3:550},I={mat_gl:1,transp:1.15,mat_gl_lam:1.4,transp_lam:1.5,paper_self:.5},L={50:1200,100:1e3,200:850,500:700,1e3:600,2e3:550,5e3:500},k={premium:5,standard:3.5},x={"with-print":.25,"without-print":.15},y=6e3,A={opt1:5,opt2:10,opt3:15,opt4:20,opt5:25,opt6:30},g=[50,100,200,500,1e3,2e3,3e3,5e3];function b(r){return Math.ceil(r*2)/2}function h(r){return Math.ceil(r*10)/10}function m(r,t){return r*t/100}function O(r,t){const e=Object.keys(t).map(Number).sort((a,s)=>a-s);for(let a=e.length-1;a>=0;a--)if(r>=e[a])return t[e[a]];return t[e[0]]}function v(r,t){return`${r}×${t} мм`}function D(r,t="шт"){return`${r} ${t}`}class M extends B{constructor(t){super(t),this.state={productType:"standard",subType:"standard",width:50,height:50,quantity:100,material:"mat_gl",pricingType:"retail",customPrice:null,polymer:"premium",customPrice3D:null,oracalType:"with-print",customPriceOracal:null}}render(){const t=this.getContainer();t&&(t.innerHTML=`
      <div class="stickers-calculator">
        ${this.renderProductSelector()}
        ${this.renderStandardParams()}
        ${this.render3DParams()}
        ${this.renderOracalParams()}
        ${this.renderResult()}
        ${this.renderQuickQuantities()}
      </div>
    `,this.attachEvents(),this.calculate())}renderProductSelector(){return`
      <div class="panel product-selector">
        <div class="product-selector-title">ВЫБЕРИТЕ ТИП НАКЛЕЙКИ</div>
        <div class="product-cards">
          ${[{id:"standard",icon:"🏷️",label:"Наклейки"},{id:"3d",icon:"💎",label:"3D наклейки"},{id:"oracal",icon:"✂️",label:"Оракал"}].map(e=>`
            <div class="product-card ${e.id===this.state.productType?"active":""}"
                 data-product="${e.id}">
              <div class="product-icon">${e.icon}</div>
              <div class="product-name">${e.label}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `}renderStandardParams(){return`
      <div class="params-block ${this.state.productType==="standard"?"active":""}" id="standard-params">
        <div class="block-title">ПАРАМЕТРЫ НАКЛЕЕК</div>

        <div class="params-section">
          <div class="section-label">Основные параметры</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="width" value="${this.state.width}" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="height" value="${this.state.height}" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantity" value="${this.state.quantity}" min="1" max="100000">
            </div>
            <div class="param-group">
              <label class="label">Материал</label>
              <select class="select" id="material">
                <option value="mat_gl">Пленка мат/гл</option>
                <option value="transp">Пленка прозр.</option>
                <option value="mat_gl_lam">Пленка мат/гл с лам.</option>
                <option value="transp_lam">Пленка прозр. с лам.</option>
                <option value="paper_self">Бумажная самоклейка</option>
              </select>
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип расчёта</label>
              <select class="select" id="pricingType">
                <option value="retail">Розница (1200₽/лист)</option>
                <option value="opt1">Опт1 (850₽/лист)</option>
                <option value="opt2">Опт2 (650₽/лист)</option>
                <option value="opt3">Опт3 (550₽/лист)</option>
                <option value="dynamic">Динамический</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPrice" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `}render3DParams(){return`
      <div class="params-block ${this.state.productType==="3d"?"active":""}" id="3d-params">
        <div class="block-title">ПАРАМЕТРЫ 3D НАКЛЕЕК</div>

        <div class="params-section">
          <div class="section-label">Основные параметры</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="width3d" value="30" min="5" max="500">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="height3d" value="30" min="5" max="500">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantity3d" value="100" min="1" max="10000">
            </div>
            <div class="param-group">
              <label class="label">Полимер</label>
              <select class="select" id="polymer">
                <option value="premium">Премиум полимер (гибкий)</option>
                <option value="standard">Стандарт полимер (твёрдый)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип расчёта</label>
              <select class="select" id="pricingType3d">
                <option value="retail">Розница</option>
                <option value="opt1">Опт1 -5%</option>
                <option value="opt2">Опт2 -10%</option>
                <option value="opt3">Опт3 -15%</option>
                <option value="opt4">Опт4 -20%</option>
                <option value="opt5">Опт5 -25%</option>
                <option value="opt6">Опт6 -30%</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPrice3D" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `}renderOracalParams(){return`
      <div class="params-block ${this.state.productType==="oracal"?"active":""}" id="oracal-params">
        <div class="block-title">ПАРАМЕТРЫ ОРАКАЛ</div>

        <div class="params-section">
          <div class="section-label">Параметры резки</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Тип</label>
              <select class="select" id="oracalType">
                <option value="with-print">С печатью</option>
                <option value="without-print">Без печати</option>
              </select>
            </div>
            <div class="param-group">
              <label class="label">Ширина, мм</label>
              <input type="number" class="input" id="widthOracal" value="100" min="5" max="600">
            </div>
            <div class="param-group">
              <label class="label">Высота, мм</label>
              <input type="number" class="input" id="heightOracal" value="100" min="5" max="2000">
            </div>
            <div class="param-group">
              <label class="label">Количество</label>
              <input type="number" class="input" id="quantityOracal" value="1" min="1" max="10000">
            </div>
          </div>
        </div>

        <div class="params-section">
          <div class="section-label">Тип расчета</div>
          <div class="params-grid">
            <div class="param-group">
              <label class="label">Своя цена (₽/шт)</label>
              <input type="number" class="input" id="customPriceOracal" placeholder="Авто" step="0.01">
            </div>
          </div>
        </div>
      </div>
    `}renderResult(){return`
      <div class="combined-block">
        <div class="result-block">
          <div class="result-item">
            <span class="result-label">За единицу</span>
            <span class="result-value" id="unitPrice">0₽</span>
          </div>
          <div class="result-item">
            <span class="result-label">За тираж</span>
            <span class="result-value" id="totalPrice">0₽</span>
          </div>
        </div>
        <button class="cart-button" id="addToCartBtn">
          <span>📥</span>
          <span>В корзину</span>
        </button>
      </div>
    `}renderQuickQuantities(){return this.state.productType!=="standard"?'<div id="quickQuantities" style="display: none;"></div>':`
      <div class="quick-quantities" id="quickQuantities">
        <div class="quantities-header">
          <div class="quantities-title">БЫСТРЫЙ ВЫБОР ТИРАЖА</div>
          <button class="copy-all-btn" id="copyAllBtn">
            📋 Копировать все
          </button>
        </div>
        <div class="quantities-grid" id="quantitiesGrid"></div>
      </div>
    `}attachEvents(){document.querySelectorAll(".product-card").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.product;this.selectProduct(i)})}),this.attachInputEvent("width",s=>this.setState({width:parseFloat(s)||50})),this.attachInputEvent("height",s=>this.setState({height:parseFloat(s)||50})),this.attachInputEvent("quantity",s=>this.setState({quantity:parseInt(s)||100})),this.attachInputEvent("material",s=>this.setState({material:s})),this.attachInputEvent("pricingType",s=>this.setState({pricingType:s})),this.attachInputEvent("customPrice",s=>this.setState({customPrice:parseFloat(s)||null})),this.attachInputEvent("width3d",s=>this.setState({width:parseFloat(s)||30})),this.attachInputEvent("height3d",s=>this.setState({height:parseFloat(s)||30})),this.attachInputEvent("quantity3d",s=>this.setState({quantity:parseInt(s)||100})),this.attachInputEvent("polymer",s=>this.setState({polymer:s})),this.attachInputEvent("pricingType3d",s=>this.setState({pricingType:s})),this.attachInputEvent("customPrice3D",s=>this.setState({customPrice3D:parseFloat(s)||null})),this.attachInputEvent("widthOracal",s=>this.setState({width:parseFloat(s)||100})),this.attachInputEvent("heightOracal",s=>this.setState({height:parseFloat(s)||100})),this.attachInputEvent("quantityOracal",s=>this.setState({quantity:parseInt(s)||1})),this.attachInputEvent("oracalType",s=>this.setState({oracalType:s})),this.attachInputEvent("customPriceOracal",s=>this.setState({customPriceOracal:parseFloat(s)||null}));const e=document.querySelector("#addToCartBtn");e&&e.addEventListener("click",()=>this.addToCart());const a=document.querySelector("#copyAllBtn");a&&a.addEventListener("click",()=>this.copyAllQuantities())}attachInputEvent(t,e){const a=document.getElementById(t);a&&(a.addEventListener("input",s=>e(s.target.value)),a.addEventListener("change",s=>e(s.target.value)))}selectProduct(t){this.setState({productType:t}),document.querySelectorAll(".product-card").forEach(s=>{s.classList.toggle("active",s.dataset.product===t)}),document.querySelectorAll(".params-block").forEach(s=>{s.classList.remove("active")});const e=document.getElementById(`${t}-params`);e&&e.classList.add("active");const a=document.getElementById("quickQuantities");a&&(a.style.display=t==="standard"?"block":"none"),this.calculate()}onStateChange(){this.calculate()}calculate(){let t;switch(this.state.productType){case"standard":t=this.calculateStandard(),this.updateQuickQuantities();break;case"3d":t=this.calculate3D();break;case"oracal":t=this.calculateOracal();break;default:t={unitPrice:0,totalPrice:0}}return this.updateResult(t),t}calculateStandard(){const{width:t,height:e,quantity:a,material:s,pricingType:i,customPrice:n}=this.state,c=m(t,e);let o;i==="dynamic"?o=O(a,L)/y:o=$[i]/y,o*=I[s];let l=h(c*o);n&&(l=h(n));const d=l*a;return{unitPrice:l,totalPrice:d}}calculate3D(){const{width:t,height:e,quantity:a,polymer:s,pricingType:i,customPrice3D:n}=this.state,c=m(t,e),o=k[s],l=A[i]||0;let d=c*o;d*=1-l/100,d=b(d),n&&(d=b(n));const u=d*a;return{unitPrice:d,totalPrice:u}}calculateOracal(){const{width:t,height:e,quantity:a,oracalType:s,customPriceOracal:i}=this.state,n=m(t,e);let c=h(n*x[s]);i&&(c=h(i));const o=c*a;return{unitPrice:c,totalPrice:o}}updateResult(t){const e=document.getElementById("unitPrice"),a=document.getElementById("totalPrice");e&&(e.textContent=`${t.unitPrice.toFixed(2)}₽`),a&&(a.textContent=`${Math.round(t.totalPrice)}₽`)}updateQuickQuantities(){const t=document.getElementById("quantitiesGrid");if(!t||this.state.productType!=="standard")return;const e=g.map(a=>{const s=this.state.quantity;this.state.quantity=a;const i=this.calculateStandard();return this.state.quantity=s,`
        <div class="qty-card ${a===this.state.quantity?"selected":""}" data-qty="${a}">
          <div class="qty-value">${a}шт</div>
          <div class="qty-price">${i.unitPrice.toFixed(2)}₽/шт</div>
          <div class="qty-total">${Math.round(i.totalPrice)}₽</div>
        </div>
      `}).join("");t.innerHTML=e,t.querySelectorAll(".qty-card").forEach(a=>{a.addEventListener("click",()=>{const s=parseInt(a.dataset.qty);this.setState({quantity:s});const i=document.getElementById("quantity");i&&(i.value=s)})})}copyAllQuantities(){if(this.state.productType!=="standard")return;const{width:t,height:e,material:a}=this.state;let s=`📋 Наклейки ${t}×${e}мм
`;s+=`Материал: ${this.getMaterialName(a)}
`,s+=`─────────
`,g.forEach(i=>{const n=this.state.quantity;this.state.quantity=i;const c=this.calculateStandard();this.state.quantity=n,s+=`${i}шт - ${c.unitPrice.toFixed(2)}₽ = ${Math.round(c.totalPrice)}₽
`}),s+="──────────",navigator.clipboard.writeText(s).then(()=>{this.eventBus.emit("toast:show",{message:"Скопировано в буфер обмена",type:"success"})})}getMaterialName(t){return{mat_gl:"Пленка мат/гл",transp:"Пленка прозр.",mat_gl_lam:"Пленка мат/гл с лам.",transp_lam:"Пленка прозр. с лам.",paper_self:"Бумажная самоклейка"}[t]||t}prepareCartItem(t){const{productType:e,width:a,height:s,quantity:i,material:n,polymer:c,oracalType:o}=this.state;let l="",d="";if(e==="standard")l="Наклейки",d=`${v(a,s)}, ${this.getMaterialName(n)}`;else if(e==="3d"){l="3D наклейки";const u=c==="premium"?"Премиум полимер":"Стандарт полимер";d=`${v(a,s)}, ${u}`}else if(e==="oracal"){l="Оракал";const u=o==="with-print"?"С печатью":"Без печати";d=`${v(a,s)}, ${u}`}return{calculator:"Наклейки",name:l,description:d,quantity:D(i),unitPrice:`${t.unitPrice.toFixed(2)}₽`,price:t.totalPrice}}}async function N(){const r=new C,t=new w("calcpro_"),e=new E(t);r.registerService("storage",t),r.registerService("cart",e);const a=new P,s=new T(r.router),i=new q(e);r.registerComponent("header",a),r.registerComponent("tabs",s),r.registerComponent("cart",i),r.registerCalculator("stickers",M,{name:"Калькулятор наклеек",icon:"🏷️"}),await r.init(),r.mount("#app"),R(r),_(r),r.router.navigate("stickers"),console.log("✅ CalcPRO 2.0 успешно загружен!")}function R(r){const t=r.rootElement;t.innerHTML=`
    <div id="headerContainer"></div>
    <div class="container">
      <div class="calc-panel">
        <div class="calc-body" id="calcBody">
          <div class="empty">
            <div class="empty-icon">📊</div>
            <div>Загрузка калькулятора...</div>
          </div>
        </div>
      </div>
      <div id="cartContainer"></div>
    </div>
    <div class="footer">
      © 2025 Типография Цифра
    </div>
  `;const e=document.getElementById("headerContainer"),a=r.getComponent("header");a.mount(e);const s=a.element;r.getComponent("tabs").mount(s);const n=document.getElementById("cartContainer");r.getComponent("cart").mount(n)}function _(r){const{eventBus:t}=r;t.on("toast:show",({message:e,type:a,duration:s})=>{p.show(e,a,s)}),t.on("modal:open",({type:e})=>{console.log("Open modal:",e)}),window.addEventListener("error",e=>{console.error("Global error:",e.error),p.error("Произошла ошибка. Перезагрузите страницу.")}),window.addEventListener("unhandledrejection",e=>{console.error("Unhandled rejection:",e.reason),p.error("Произошла ошибка. Перезагрузите страницу.")})}document.addEventListener("DOMContentLoaded",N);
