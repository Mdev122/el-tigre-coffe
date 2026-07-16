export const settings = {
  db: {
    url: 'http://localhost:3131',
    products: 'products'
  },
  selectors: {
    productsList: '#products-list',
    productTemplate: '#product-template',
    navLink: '[data-nav-link]',
    view: '.view',
    navToggle: '#nav-toggle',
    primaryNav: '#primary-nav',
    contactForm: '#contact-form',
    contactFeedback: '#contact-feedback',
    footerYear: '#footer-year',
    logoCanvas: '#logo-canvas',
    heroTitle: '.hero__title',
    teamCarousel: '#team-carousel',
    teamCarouselSlide: '.team-carousel__slide'
  },
  // Same visual style every time, only the copy changes (client's request).
  // Rendered with innerHTML on purpose (the <br> controls the line break),
  // content is fixed/hardcoded here, never user input.
  heroHeadlines: [
    'Home of<br>Original Tastes',
    'Real Venezuela,<br>Real Coffee',
    'Taste Real<br>Venezuela'
  ],
  carouselIntervalMs: 5000
};
