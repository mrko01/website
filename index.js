
document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordButton = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const icon = this.querySelector('i');
      icon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerText;
      
      submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
      submitButton.disabled = true;
      
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
        
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
          alert(`Login attempt with email: ${email}\nThis is a demo with no actual functionality.`);
        }, 1500);
      }, 1500);
    });
  }
  
  const formControls = document.querySelectorAll('.form-control');
  if (formControls.length) {
    formControls.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.querySelector('.input-icon').style.color = 'var(--primary-color)';
      });
      
      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.querySelector('.input-icon').style.color = 'var(--text-muted)';
        }
      });
    });
  }
  
  const addRippleEffect = (elements) => {
    elements.forEach(element => {
      element.addEventListener('mousedown', function(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        const rippleSize = Math.max(element.offsetWidth, element.offsetHeight);
        ripple.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        ripple.style.width = `${rippleSize * 2}px`;
        ripple.style.height = `${rippleSize * 2}px`;
        ripple.style.opacity = '0';
        
        setTimeout(() => {
          ripple.remove();
        }, 700);
      });
    });
  };
  
  addRippleEffect(document.querySelectorAll('.btn, .social-btn'));
  
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(button => {
    button.addEventListener('click', function() {
      const providerName = this.innerText.trim();
      alert(`${providerName} login would be initiated here.\nThis is a demo with no actual functionality.`);
    });
  });
  
  const brandLogoElement = document.querySelector('.brand-logo');
  if (brandLogoElement) {
    brandLogoElement.addEventListener('click', function() {
      this.classList.add('rotating');
      setTimeout(() => {
        this.classList.remove('rotating');
      }, 1000);
    });
  }
  
  document.body.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    const imageSection = document.querySelector('.image-section');
    if (imageSection) {
      imageSection.style.background = `linear-gradient(${135 + x * 30}deg, var(--primary-color), var(--secondary-color))`;
    }
  });
});
