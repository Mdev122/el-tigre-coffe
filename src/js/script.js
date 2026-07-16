import { settings } from './settings.js';

class App {
  constructor(){
    this.data = {};

    this.productListEl = document.querySelector(settings.selectors.productsList);
    this.productTemplate = Handlebars.compile(
      document.querySelector(settings.selectors.productTemplate).innerHTML
    );

    this.navLinks = Array.from(document.querySelectorAll(settings.selectors.navLink));
    this.views = Array.from(document.querySelectorAll(settings.selectors.view));

    this.navToggle = document.querySelector(settings.selectors.navToggle);
    this.primaryNav = document.querySelector(settings.selectors.primaryNav);

    this.contactForm = document.querySelector(settings.selectors.contactForm);
    this.contactFeedback = document.querySelector(settings.selectors.contactFeedback);

    this.footerYearEl = document.querySelector(settings.selectors.footerYear);
    this.logoCanvas = document.querySelector(settings.selectors.logoCanvas);

    this.init();
  }

  init(){
    const thisApp = this;

    thisApp.initFooterYear();
    thisApp.initMobileNav();
    thisApp.initPageNav();
    thisApp.initContactForm();
    thisApp.initLogoCanvas();
    thisApp.initData();
  }

  // ---------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------
  initFooterYear(){
    if(this.footerYearEl){
      this.footerYearEl.textContent = String(new Date().getFullYear());
    }
  }

  // ---------------------------------------------------------------------
  // Mobile hamburger nav
  // ---------------------------------------------------------------------
  initMobileNav(){
    if(!this.navToggle) return;

    this.navToggle.addEventListener('click', () => {
      const isOpen = this.primaryNav.classList.toggle('is-open');
      this.navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  closeMobileNav(){
    this.primaryNav.classList.remove('is-open');
    this.navToggle.setAttribute('aria-expanded', 'false');
  }

  // ---------------------------------------------------------------------
  // SPA view switching (no reload: hide the current view, show the next)
  // ---------------------------------------------------------------------
  initPageNav(){
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        const target = link.dataset.target;
        const scrollToId = link.dataset.scrollTo;

        this.showView(target);
        this.setActiveLink(link);
        this.closeMobileNav();

        if(scrollToId){
          const scrollTarget = document.getElementById(scrollToId);
          if(scrollTarget){
            window.requestAnimationFrame(() => {
              scrollTarget.scrollIntoView({behavior: 'smooth'});
            });
          }
        } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      });
    });
  }

  showView(pageName){
    this.views.forEach((view) => {
      view.classList.toggle('is-active', view.dataset.page === pageName);
    });
  }

  setActiveLink(activeLink){
    this.navLinks.forEach((link) => link.classList.remove('is-active'));
    activeLink.classList.add('is-active');
  }

  // ---------------------------------------------------------------------
  // Products: fetched from the JSON-Server API (settings.js holds the
  // URL), stored on `this.data`, rendered via the single Handlebars view.
  // ---------------------------------------------------------------------
  initData(){
    const thisApp = this;
    const url = settings.db.url + '/' + settings.db.products;

    thisApp.data = {};

    fetch(url)
      .then((rawResponse) => {
        if(!rawResponse.ok){
          throw new Error('Network response was not ok');
        }
        return rawResponse.json();
      })
      .then((parsedResponse) => {
        thisApp.data.products = parsedResponse;
        thisApp.renderProducts(thisApp.data.products);
      })
      .catch(() => {
        thisApp.productListEl.innerHTML = '<li class="products__status">Unable to load products right now.</li>';
      });
  }

  renderProducts(products){
    const markup = products
      .map((product, index) => {
        const templateData = Object.assign({}, product, {
          indexLabel: String(index + 1).padStart(2, '0'),
          isReversed: index % 2 === 1
        });
        return this.productTemplate(templateData);
      })
      .join('');

    this.productListEl.innerHTML = markup;
  }

  // ---------------------------------------------------------------------
  // Contact form (static markup, simple client-side feedback)
  // ---------------------------------------------------------------------
  initContactForm(){
    if(!this.contactForm) return;

    this.contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.contactFeedback.textContent = 'Thanks! Your message has been sent.';
      this.contactForm.reset();
    });
  }

  // ---------------------------------------------------------------------
  // Signature touch: a tiny canvas logo, a tiger head over a steaming cup
  // ---------------------------------------------------------------------
  initLogoCanvas(){
    if(!this.logoCanvas || !this.logoCanvas.getContext) return;

    const ctx = this.logoCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 44;

    this.logoCanvas.width = size * dpr;
    this.logoCanvas.height = size * dpr;
    this.logoCanvas.style.width = size + 'px';
    this.logoCanvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const drawTiger = () => {
      ctx.save();

      ctx.fillStyle = '#bea67c';
      ctx.beginPath();
      ctx.arc(11, 9, 5, 0, Math.PI * 2);
      ctx.arc(24, 9, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(17.5, 17, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';

      const stripes = [
        [8, 11, 12, 8],
        [12, 24, 17, 21],
        [21, 9, 26, 14],
        [22, 21, 27, 18]
      ];

      stripes.forEach((points) => {
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        ctx.lineTo(points[2], points[3]);
        ctx.stroke();
      });

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(13, 17, 1.3, 0, Math.PI * 2);
      ctx.arc(22, 17, 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawCup = () => {
      ctx.save();
      ctx.fillStyle = '#ffffff';

      ctx.beginPath();
      ctx.moveTo(13, 31);
      ctx.lineTo(27, 31);
      ctx.lineTo(24.5, 41);
      ctx.lineTo(15.5, 41);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(28.5, 35, 3.2, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawSteam = (t) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';

      [16, 19, 22].forEach((baseX, i) => {
        const wave = Math.sin(t / 16 + i * 2) * 2.4;
        const rise = (t * 0.55 + i * 10) % 26;
        const alpha = 1 - rise / 26;

        ctx.globalAlpha = Math.max(alpha, 0);
        ctx.beginPath();
        ctx.moveTo(baseX, 30 - rise);
        ctx.quadraticCurveTo(baseX + wave, 25 - rise, baseX, 20 - rise);
        ctx.stroke();
      });

      ctx.restore();
    };

    let frame = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderFrame = () => {
      ctx.clearRect(0, 0, size, size);
      drawTiger();
      drawCup();
      drawSteam(frame);
    };

    if(prefersReducedMotion){
      frame = 6;
      renderFrame();
      return;
    }

    const loop = () => {
      renderFrame();
      frame += 1;
      window.requestAnimationFrame(loop);
    };

    loop();
  }
}

const app = new App();

export { app };
