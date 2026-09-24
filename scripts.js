/* ==========================================================================
   NG MAKEOVER LANDING PAGE - COMPONENT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Navigation
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // ==========================================
  // 2. Before / After Image Comparison Slider
  // ==========================================
  const slider = document.getElementById('beforeAfterSlider');
  const afterImageWrapper = document.getElementById('afterImageWrapper');
  const sliderHandle = document.getElementById('sliderHandle');

  if (slider && afterImageWrapper && sliderHandle) {
    let isDragging = false;

    const getSliderWidth = () => slider.offsetWidth;

    const setSliderPosition = (xPos) => {
      const rect = slider.getBoundingClientRect();
      const relativeX = xPos - rect.left;
      const sliderWidth = rect.width;
      
      // Calculate percentage clamped between 0% and 100%
      let percentage = (relativeX / sliderWidth) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Update clip width and handle position
      afterImageWrapper.style.width = `${percentage}%`;
      sliderHandle.style.left = `${percentage}%`;
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile screens
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Prevent default drag behaviors inside slider
    slider.addEventListener('dragstart', (e) => e.preventDefault());
  }


  // ==========================================
  // 3. Service Card Booking Selection
  // ==========================================
  const serviceCardButtons = document.querySelectorAll('.btn-card-book');
  const serviceSelect = document.getElementById('serviceType');

  serviceCardButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        // Find matching option in the dropdown and select it
        for (let option of serviceSelect.options) {
          if (option.value === serviceName) {
            option.selected = true;
            break;
          }
        }
      }
    });
  });


  // ==========================================
  // 4. WhatsApp Appointment Form Submission
  // ==========================================
  const bookingForm = document.getElementById('bookingForm');
  const salonPhoneNumber = '919404075732'; // Salon's business WhatsApp number

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const dateVal = document.getElementById('prefDate').value;
      const timeVal = document.getElementById('prefTime').value;
      const service = document.getElementById('serviceType').value;

      // Basic validation check
      if (!name || !phone || !dateVal || !timeVal || !service) {
        alert('Please fill out all required fields.');
        return;
      }

      // Format Date for readability (YYYY-MM-DD -> DD-MM-YYYY)
      const dateParts = dateVal.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : dateVal;

      // Format 24h Time to 12h AM/PM for easier local salon readability
      const [hour, minute] = timeVal.split(':');
      let hourNum = parseInt(hour, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      hourNum = hourNum % 12;
      hourNum = hourNum ? hourNum : 12; // conversion of '0' hour to '12'
      const formattedTime = `${hourNum}:${minute} ${ampm}`;

      // Construct WhatsApp message template
      const messageText = `Hello NG Makeover,
My name is ${name}.
I would like to book an appointment.

Service: ${service}
Date: ${formattedDate}
Time: ${formattedTime}

Please confirm availability.`;

      // Encode and launch WhatsApp redirect URL
      const encodedMsg = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/${salonPhoneNumber}?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
    });
  }


  // ==========================================
  // 5. Accordion (FAQ Section)
  // ==========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const content = header.nextElementSibling;

      // Close other open accordions (collapsible style)
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current accordion
      header.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      content.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
    });
  });


  // ==========================================
  // 6. Navigation Active Links scroll-spy
  // ==========================================
  const sections = document.querySelectorAll('section, header');
  const scrollOffset = 120; // Match sticky header height offset

  const updateActiveLink = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach(sec => {
      const top = sec.offsetTop - scrollOffset;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}` || (id === 'hero' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Run once initially on load


  // ==========================================
  // 7. Sticky Mobile Book CTA & Header Shadow
  // ==========================================
  const stickyMobileCta = document.getElementById('stickyMobileCta');
  const mainHeader = document.getElementById('header');

  const handleScrollState = () => {
    const scrollPos = window.scrollY;

    // Header Shadow on Scroll
    if (scrollPos > 30) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Sticky CTA visible past Hero section on mobile
    if (stickyMobileCta) {
      if (scrollPos > 500 && window.innerWidth <= 768) {
        stickyMobileCta.classList.add('active');
      } else {
        stickyMobileCta.classList.remove('active');
      }
    }
  };

  window.addEventListener('scroll', handleScrollState);
  window.addEventListener('resize', handleScrollState);
  handleScrollState(); // Run initial state check


  // ==========================================
  // 8. Intersection Observer for Scroll Reveals
  // ==========================================
  // Add class reveal to sections we want to animate on load
  const revealElements = document.querySelectorAll(
    '.service-card, .gallery-item, .about-content, .about-visual, .why-card, .testimonial-card, .booking-card, .accordion-item, .hero-content, .hero-visual'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing after reveal has happened
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Reveals slightly before elements enter full view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
