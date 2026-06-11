import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupMobileMenu();
  setupFAQAccordion();
  setupScrollAnimations();
  setupHeroCarousel();
});

// 1. Sticky Navbar & Shrink on Scroll
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    const threshold = window.innerHeight - 80;
    if (window.scrollY > threshold) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run once initially to handle direct load or refresh scroll position
  handleScroll();
}

// 2. Mobile Menu Toggle
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('animate-[slide-down_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  });

  // Close menu when clicking link
  const links = mobileMenu.querySelectorAll('.mobile-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
}

// 3. Accordion FAQ
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-open');
      
      // Close other active FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('faq-open')) {
          otherItem.classList.remove('faq-open');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      // Toggle current FAQ
      if (isOpen) {
        item.classList.remove('faq-open');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('faq-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// 4. Scroll Reveal Animations (Page Entrance)
function setupScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-element');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

// 5. Hero Carousel Background Animation with Manual Nav & Indicators
function setupHeroCarousel() {
  const slides = document.querySelectorAll('#hero-carousel .carousel-slide');
  if (slides.length === 0) return;

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('#carousel-indicators .carousel-dot');

  let currentSlide = 0;
  let intervalId = null;
  const intervalTime = 5000; // 5 seconds per slide

  const showSlide = (index) => {
    // Fade out current slide
    slides[currentSlide].classList.remove('opacity-100');
    slides[currentSlide].classList.add('opacity-0');

    // Update dot classes (inactive state)
    if (dots.length > currentSlide) {
      dots[currentSlide].classList.remove('w-8', 'bg-white');
      dots[currentSlide].classList.add('w-2', 'bg-white/40');
    }

    // Update current index
    currentSlide = (index + slides.length) % slides.length;

    // Fade in new slide
    slides[currentSlide].classList.remove('opacity-0');
    slides[currentSlide].classList.add('opacity-100');

    // Update new dot classes (active state)
    if (dots.length > currentSlide) {
      dots[currentSlide].classList.remove('w-2', 'bg-white/40');
      dots[currentSlide].classList.add('w-8', 'bg-white');
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalId = setInterval(() => {
      showSlide(currentSlide + 1);
    }, intervalTime);
  };

  const stopAutoSlide = () => {
    if (intervalId) clearInterval(intervalId);
  };

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide(); // reset timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoSlide(); // reset timer
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide(); // reset timer
    });
  });

  // Start initial timer
  startAutoSlide();
}
