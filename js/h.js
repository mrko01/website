
document.addEventListener('DOMContentLoaded', function() {
  // Initialize resources to load
  const resources = [
    { name: 'three.js', url: 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js' },
    { name: 'OrbitControls', url: 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js' },
    { name: 'GSAP', url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js' },
    { name: 'ScrollTrigger', url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js' },
    { name: 'particles.js', url: 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js' }
  ];
  
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  const loadingText = document.querySelector('.loading-text');
  
  let loadedResources = 0;
  const totalResources = resources.length;
  
  // Update loader progress
  function updateProgress(percent) {
    loaderProgress.style.width = `${percent}%`;
    
    if (percent < 30) {
      loadingText.textContent = 'Loading assets...';
    } else if (percent < 60) {
      loadingText.textContent = 'Initializing 3D models...';
    } else if (percent < 80) {
      loadingText.textContent = 'Preparing user interface...';
    } else {
      loadingText.textContent = 'Almost ready...';
    }
    
    if (percent >= 100) {
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            loader.classList.add('hidden');
            initializeUI();
          }
        });
      }, 300);
    }
  }
  
  // Load a single resource
  function loadResource(resource) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = resource.url;
      script.onload = () => {
        loadedResources++;
        updateProgress((loadedResources / totalResources) * 100);
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  
  // Load all resources sequentially
  async function loadAllResources() {
    for (const resource of resources) {
      await loadResource(resource);
    }
    
    setTimeout(() => {
      initializeTheme();
      initializeModels();
    }, 100);
  }
  
  loadAllResources();
  
  // Initialize all UI components after loading
  function initializeUI() {
    initializeScrolling();
    initAnimations();
    initParticles();
    initializeProjectTabs();
    initFloatingNav();
  }
});

// Theme management
function initializeTheme() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  document.getElementById('theme-switch').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  gsap.to('body', {
    opacity: 0.9,
    duration: 0.2,
    onComplete: () => {
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      updateModelBackgrounds();
      
      gsap.to('body', {
        opacity: 1,
        duration: 0.2
      });
    }
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('#theme-switch i');
  const themeLabel = document.querySelector('.theme-label');
  
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
    if (themeLabel) themeLabel.textContent = 'Light';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
    if (themeLabel) themeLabel.textContent = 'Dark';
  }
  
  gsap.from(themeIcon, {
    rotation: 360,
    duration: 0.5,
    ease: "power2.out"
  });
}

function updateModelBackgrounds() {
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  const modelContainers = document.querySelectorAll('.model-container, #intro-visual, #contact-visual');
  
  modelContainers.forEach(container => {
    const canvas = container.querySelector('canvas');
    if (canvas && canvas.userData?.scene) {
      const scene = canvas.userData.scene;
      
      const currentColor = scene.background;
      const targetColor = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
      
      gsap.to(currentColor, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        onUpdate: function() {
          scene.background.setRGB(currentColor.r, currentColor.g, currentColor.b);
        }
      });
    }
  });
}

// Particles background
function initParticles() {
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 15,
        density: {
          enable: true,
          value_area: 1500
        }
      },
      color: {
        value: ["#4285f4", "#ea4335", "#fbbc05", "#34a853"]
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
      },
      opacity: {
        value: 0.08,
        random: true,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0.03,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 200,
        color: isDarkMode ? "#8ab4f8" : "#4285f4",
        opacity: 0.05,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: false,
        },
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.2
          }
        }
      }
    },
    retina_detect: true
  });
}

// Section animations
function initAnimations() {
  const introSection = document.querySelector('#intro');
  if (introSection.classList.contains('active')) {
    animateHeroSection();
  }
}

function animateHeroSection() {
  const timeline = gsap.timeline();
  const heroSection = document.querySelector('#intro');
  
  timeline
    .fromTo(heroSection.querySelector('.title'), 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(heroSection.querySelector('.subtitle'),
      { opacity: 0, y: 20 },
      { opacity: 0.9, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(heroSection.querySelector('.action-buttons'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(heroSection.querySelector('.hero-visual'),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=0.7"
    )
    .fromTo(heroSection.querySelector('.scroll-hint'),
      { opacity: 0 },
      { opacity: 0.8, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    );
}

// Scrolling functionality
function initializeScrolling() {
  const sections = document.querySelectorAll('.section');
  let currentSectionIndex = 0;
  let isScrolling = false;
  let lastScrollTime = 0;
  let scrollCooldown = 800;
  let touchStartY = 0;
  let touchEndY = 0;
  let wheelAccumulator = 0;
  const wheelThreshold = 50;
  
  updateSectionVisibility(currentSectionIndex);
  
  function handleScroll(direction) {
    const now = Date.now();
    
    if (now - lastScrollTime < scrollCooldown || isScrolling) {
      return false;
    }
    
    isScrolling = true;
    lastScrollTime = now;
    
    if (direction === 'down') {
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        updateActiveSection(currentSectionIndex);
      }
    } else {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        updateActiveSection(currentSectionIndex);
      }
    }
    
    updateSectionVisibility(currentSectionIndex);
    
    setTimeout(() => {
      isScrolling = false;
      wheelAccumulator = 0;
    }, scrollCooldown / 2);
    
    return true;
  }
  
  function updateActiveSection(index) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((navItem, idx) => {
      if (idx === index) {
        navItem.classList.add('active');
        gsap.to(navItem.querySelector('.icon-container'), {
          y: -4,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      } else {
        navItem.classList.remove('active');
        gsap.to(navItem.querySelector('.icon-container'), {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }
  
  window.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    const delta = Math.abs(e.deltaY);
    wheelAccumulator += Math.min(delta, 40);
    
    if (wheelAccumulator > wheelThreshold) {
      const direction = e.deltaY > 0 ? 'down' : 'up';
      if (handleScroll(direction)) {
        wheelAccumulator = 0;
      }
    }
    
    setTimeout(() => {
      wheelAccumulator = Math.max(0, wheelAccumulator - 15);
    }, 150);
    
  }, { passive: false });
  
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) < 70) return;
    
    const direction = deltaY > 0 ? 'down' : 'up';
    handleScroll(direction);
  }, { passive: true });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      handleScroll('down');
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      handleScroll('up');
    }
  });
  
  const allNavLinks = document.querySelectorAll('nav a, .nav-item, .action-buttons a, .scroll-hint');
  allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      let targetIndex = -1;
      
      sections.forEach((section, index) => {
        if (section.id === targetId) {
          targetIndex = index;
        }
      });
      
      if (targetIndex !== -1 && targetIndex !== currentSectionIndex) {
        gsap.to(window, {
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            currentSectionIndex = targetIndex;
            updateSectionVisibility(currentSectionIndex);
            updateActiveSection(currentSectionIndex);
          }
        });
      }
    });
  });
}

// Update section visibility
function updateSectionVisibility(index) {
  const sections = document.querySelectorAll('.section');
  
  sections.forEach((section, i) => {
    if (i === index) {
      section.classList.add('active');
      animateSectionElements(section);
    } else {
      section.classList.remove('active');
    }
  });
  
  history.replaceState(null, null, '#' + sections[index].id);
}

// Animate section elements
function animateSectionElements(section) {
  if (section.id === 'intro') {
    animateHeroSection();
  } 
  else if (section.id === 'projects') {
    const activeProject = section.querySelector('.project.active');
    if (activeProject) {
      gsap.fromTo(activeProject.querySelector('.project-info'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
      );
      
      gsap.fromTo(activeProject.querySelector('.model-container'),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
      );
    }
    
    const tabs = section.querySelectorAll('.tab');
    gsap.fromTo(tabs, 
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    );

    gsap.fromTo(section.querySelector('.project-nav'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" }
    );
  } 
  else if (section.id === 'contact') {
    const timeline = gsap.timeline();
    
    timeline
      .fromTo(section.querySelector('.contact-info h2'),
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(section.querySelector('.contact-info p'),
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(section.querySelector('.contact-form'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      )
      .fromTo(section.querySelector('#contact-visual'),
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
        "-=0.7"
      );
    
    const socialLinks = section.querySelectorAll('.social-link');
    gsap.fromTo(socialLinks,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        delay: 0.5,
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      }
    );
  }
}

// Project tabs
function initializeProjectTabs() {
  const tabs = document.querySelectorAll('.tab');
  const projects = document.querySelectorAll('.project');
  const prevBtn = document.querySelector('.nav-button.prev');
  const nextBtn = document.querySelector('.nav-button.next');
  const indicators = document.querySelectorAll('.indicator');
  let currentProjectIndex = 0;
  
  function showProject(index) {
    projects.forEach((project, i) => {
      project.classList.remove('active');
      tabs[i].classList.remove('active');
      indicators[i].classList.remove('active');
    });
    
    projects[index].classList.add('active');
    tabs[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentProjectIndex = index;
    
    prevBtn.disabled = currentProjectIndex === 0;
    nextBtn.disabled = currentProjectIndex === projects.length - 1;
    
    animateProjectElements(projects[index]);
  }
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (index !== currentProjectIndex) {
        const activeProject = document.querySelector('.project.active');
        if (activeProject) {
          gsap.to(activeProject.querySelector('.project-info'), {
            opacity: 0,
            x: -10,
            duration: 0.3,
            ease: "power2.in"
          });
          
          gsap.to(activeProject.querySelector('.model-container'), {
            opacity: 0,
            x: 10,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => showProject(index)
          });
        } else {
          showProject(index);
        }
      }
    });
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index !== currentProjectIndex) {
        const activeProject = document.querySelector('.project.active');
        if (activeProject) {
          gsap.to(activeProject.querySelector('.project-info'), {
            opacity: 0,
            x: -10,
            duration: 0.3,
            ease: "power2.in"
          });
          
          gsap.to(activeProject.querySelector('.model-container'), {
            opacity: 0,
            x: 10,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => showProject(index)
          });
        } else {
          showProject(index);
        }
      }
    });
  });
  
  indicators.forEach(indicator => {
    indicator.addEventListener('mouseenter', () => {
      if (!indicator.classList.contains('active')) {
        gsap.to(indicator, {
          scale: 1.2,
          opacity: 0.6,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    indicator.addEventListener('mouseleave', () => {
      if (!indicator.classList.contains('active')) {
        gsap.to(indicator, {
          scale: 1,
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
  
  prevBtn.addEventListener('click', () => {
    if (currentProjectIndex > 0) {
      const activeProject = document.querySelector('.project.active');
      if (activeProject) {
        gsap.to(activeProject.querySelector('.project-info'), {
          opacity: 0,
          x: 10,
          duration: 0.3,
          ease: "power2.in"
        });
        
        gsap.to(activeProject.querySelector('.model-container'), {
          opacity: 0,
          x: 20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => showProject(currentProjectIndex - 1)
        });
      } else {
        showProject(currentProjectIndex - 1);
      }
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentProjectIndex < projects.length - 1) {
      const activeProject = document.querySelector('.project.active');
      if (activeProject) {
        gsap.to(activeProject.querySelector('.project-info'), {
          opacity: 0,
          x: -10,
          duration: 0.3,
          ease: "power2.in"
        });
        
        gsap.to(activeProject.querySelector('.model-container'), {
          opacity: 0,
          x: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => showProject(currentProjectIndex + 1)
        });
      } else {
        showProject(currentProjectIndex + 1);
      }
    }
  });
  
  showProject(0);
}

function animateProjectElements(project) {
  gsap.fromTo(project.querySelector('.project-info'),
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
  );
  
  gsap.fromTo(project.querySelector('.model-container'),
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
  );
  
  const features = project.querySelectorAll('.feature-badge');
  if (features.length > 0) {
    gsap.fromTo(features,
      { opacity: 0, y: 10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        delay: 0.2,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
  }
}

// Models initialization
function initializeModels() {
  createIntroModel('intro-visual');
  createNeurocraftModel('model-1');
  createChatModel('model-2');
  createSyncModel('model-3');
  createContactModel('contact-visual');
}

// Intro visual 3D model
function createIntroModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  scene.background = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 7;
  camera.position.y = 0;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  renderer.domElement.userData = { scene: scene };
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  const group = new THREE.Group();
  scene.add(group);
  
  const googleColors = [
    new THREE.Color(0x4285f4), // Google Blue
    new THREE.Color(0xea4335), // Google Red
    new THREE.Color(0xfbbc05), // Google Yellow
    new THREE.Color(0x34a853)  // Google Green
  ];
  
  const sphereGeometries = [
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16),
    new THREE.OctahedronGeometry(0.7, 1)
  ];
  
  // Create spheres with google colors
  for (let i = 0; i < googleColors.length; i++) {
    const geometry = sphereGeometries[i % sphereGeometries.length];
    
    const material = new THREE.MeshPhongMaterial({ 
      color: googleColors[i],
      emissive: googleColors[i],
      emissiveIntensity: 0.2,
      shininess: 50,
      transparent: true,
      opacity: 0.9,
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    
    const angle = (i / googleColors.length) * Math.PI * 2;
    const radius = 2.2;
    
    sphere.position.x = Math.cos(angle) * radius;
    sphere.position.z = Math.sin(angle) * radius;
    
    sphere.userData = {
      angle: angle,
      radius: radius,
      orbitSpeed: 0.001 + (i * 0.0003),
      rotationSpeed: {
        x: 0.003 * (i % 2 === 0 ? 1 : -1),
        y: 0.004 * (i % 3 === 0 ? 1 : -1),
        z: 0.002 * (i % 4 === 0 ? 1 : -1)
      },
      pulseSpeed: 0.002 + (i * 0.001),
      pulseOffset: i * Math.PI * 0.5
    };
    
    group.add(sphere);
  }
  
  // Add connection lines between spheres
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: isDarkMode ? 0x8ab4f8 : 0x4285f4, 
    transparent: true,
    opacity: 0.3
  });
  
  const centerPoint = new THREE.Vector3(0, 0, 0);
  
  group.children.forEach((sphere) => {
    // Line from center to sphere
    const points = [centerPoint, sphere.position];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    
    line.userData = {
      from: { position: centerPoint },
      to: sphere
    };
    
    group.add(line);
    
    // Lines between adjacent spheres
    const idx = group.children.indexOf(sphere);
    if (idx < googleColors.length - 1) {
      const nextSphere = group.children[idx + 1];
      const spherePoints = [sphere.position, nextSphere.position];
      const sphereLineGeometry = new THREE.BufferGeometry().setFromPoints(spherePoints);
      const sphereLine = new THREE.Line(sphereLineGeometry, lineMaterial);
      
      sphereLine.userData = {
        from: sphere,
        to: nextSphere
      };
      
      group.add(sphereLine);
    }
  });
  
  if (group.children.length >= googleColors.length) {
    const firstSphere = group.children[0];
    const lastSphere = group.children[googleColors.length - 1];
    const connectingPoints = [firstSphere.position, lastSphere.position];
    const connectingGeometry = new THREE.BufferGeometry().setFromPoints(connectingPoints);
    const connectingLine = new THREE.Line(connectingGeometry, lineMaterial);
    
    connectingLine.userData = {
      from: firstSphere,
      to: lastSphere
    };
    
    group.add(connectingLine);
  }
  
  // Create Brain Network Effect in Center
  const particlesGroup = new THREE.Group();
  const particleCount = 80;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    positions[i3] = (Math.random() - 0.5) * 1.5;
    positions[i3 + 1] = (Math.random() - 0.5) * 1.5;
    positions[i3 + 2] = (Math.random() - 0.5) * 1.5;
    
    const colorIndex = Math.floor(Math.random() * googleColors.length);
    const color = googleColors[colorIndex];
    
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  particlesGroup.add(particles);
  
  // Add inner connections between particles
  for (let i = 0; i < particleCount; i++) {
    if (Math.random() > 0.8) continue;
    
    const pos1 = new THREE.Vector3(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    
    // Find a close particle to connect
    for (let j = 0; j < particleCount; j++) {
      if (i === j || Math.random() > 0.15) continue;
      
      const pos2 = new THREE.Vector3(
        positions[j * 3],
        positions[j * 3 + 1],
        positions[j * 3 + 2]
      );
      
      const distance = pos1.distanceTo(pos2);
      
      if (distance < 0.7) {
        const innerLineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.1 * (1 - distance / 0.7)
        });
        
        const innerPoints = [pos1, pos2];
        const innerLineGeometry = new THREE.BufferGeometry().setFromPoints(innerPoints);
        const innerLine = new THREE.Line(innerLineGeometry, innerLineMaterial);
        
        particlesGroup.add(innerLine);
      }
    }
  }
  
  group.add(particlesGroup);
  
  function updateLines() {
    group.children.forEach(child => {
      if (child instanceof THREE.Line && child.userData.from && child.userData.to) {
        const points = [
          child.userData.from.position || child.userData.from,
          child.userData.to.position
        ];
        child.geometry.setFromPoints(points);
      }
    });
  }
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.3;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  function animate() {
    requestAnimationFrame(animate);
    
    group.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const data = child.userData;
        
        data.angle += data.orbitSpeed;
        child.position.x = Math.cos(data.angle) * data.radius;
        child.position.z = Math.sin(data.angle) * data.radius;
        
        child.rotation.x += data.rotationSpeed.x;
        child.rotation.y += data.rotationSpeed.y;
        child.rotation.z += data.rotationSpeed.z;
        
        const pulseScale = 1 + Math.sin(Date.now() * data.pulseSpeed + data.pulseOffset) * 0.05;
        child.scale.set(pulseScale, pulseScale, pulseScale);
      }
    });
    
    particlesGroup.rotation.y += 0.001;
    
    updateLines();
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  resizeObserver.observe(container);
}

function createNeurocraftModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  scene.background = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 6;
  camera.position.y = 1;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  renderer.domElement.userData = { scene: scene };
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  const gridGroup = new THREE.Group();
  
  const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const googleColors = [
    new THREE.MeshPhongMaterial({ color: 0x4285f4, emissive: 0x4285f4, emissiveIntensity: 0.2 }),
    new THREE.MeshPhongMaterial({ color: 0xea4335, emissive: 0xea4335, emissiveIntensity: 0.2 }),
    new THREE.MeshPhongMaterial({ color: 0xfbbc05, emissive: 0xfbbc05, emissiveIntensity: 0.2 }),
    new THREE.MeshPhongMaterial({ color: 0x34a853, emissive: 0x34a853, emissiveIntensity: 0.2 })
  ];

  for (let x = -2; x <= 2; x++) {
    for (let y = -2; y <= 2; y++) {
      for (let z = -0.5; z <= 0.5; z++) {
        if (Math.random() > 0.7) continue;

        const material = googleColors[Math.floor(Math.random() * googleColors.length)];
        const cube = new THREE.Mesh(cubeGeometry, material);
        
        cube.position.set(x, y, z);
        cube.scale.set(
          0.4 + Math.random() * 0.2, 
          0.4 + Math.random() * 0.2, 
          0.4 + Math.random() * 0.2
        );
        
        cube.rotation.set(
          Math.random() * Math.PI * 0.1,
          Math.random() * Math.PI * 0.1,
          Math.random() * Math.PI * 0.1
        );
        
        cube.userData = {
          floatSpeed: 0.0005 + Math.random() * 0.002,
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
          },
          originalY: cube.position.y,
          floatAmplitude: 0.08 + Math.random() * 0.15,
          floatOffset: Math.random() * Math.PI * 2
        };
        
        gridGroup.add(cube);
      }
    }
  }

  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: isDarkMode ? 0x8ab4f8 : 0x4285f4, 
    transparent: true,
    opacity: 0.4
  });
  
  const cubes = gridGroup.children;
  
  for (let i = 0; i < cubes.length; i++) {
    if (Math.random() > 0.35) continue;
    
    const cube1 = cubes[i];
    let closestCubes = findClosestCubes(cube1, cubes, 2);
    
    closestCubes.forEach(cube2 => {
      const points = [cube1.position, cube2.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      
      line.userData = {
        from: cube1,
        to: cube2
      };
      
      gridGroup.add(line);
    });
  }
  
  scene.add(gridGroup);
  
  function findClosestCubes(cube, allCubes, maxCount) {
    const distances = [];
    
    for (let i = 0; i < allCubes.length; i++) {
      if (allCubes[i] === cube) continue;
      
      const distance = cube.position.distanceTo(allCubes[i].position);
      if (distance < 3) {
        distances.push({ cube: allCubes[i], distance: distance });
      }
    }
    
    distances.sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, maxCount).map(d => d.cube);
  }
  
  function updateLines() {
    gridGroup.children.forEach(child => {
      if (child instanceof THREE.Line && child.userData.from && child.userData.to) {
        const points = [child.userData.from.position, child.userData.to.position];
        child.geometry.setFromPoints(points);
      }
    });
  }
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  
  let pulsePhase = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    gridGroup.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        const data = child.userData;
        
        child.position.y = data.originalY + Math.sin(Date.now() * data.floatSpeed + data.floatOffset) * data.floatAmplitude;
        
        child.rotation.x += data.rotationSpeed.x;
        child.rotation.y += data.rotationSpeed.y;
        child.rotation.z += data.rotationSpeed.z;
      }
    });
    
    pulsePhase += 0.005;
    const pulseFactor = 1 + Math.sin(pulsePhase) * 0.03;
    gridGroup.scale.set(pulseFactor, pulseFactor, pulseFactor);
    
    updateLines();
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  resizeObserver.observe(container);
}

function createChatModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  scene.background = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  renderer.domElement.userData = { scene: scene };
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  const chatGroup = new THREE.Group();
  
  const googleColors = [
    0x4285f4,
    0xea4335,
    0xfbbc05,
    0x34a853
  ];
  
  function createMessageBubble(x, y, z, width, height, depth, isUser, colorIndex) {
    const bubbleGeometry = new THREE.BoxGeometry(width, height, depth);
    bubbleGeometry.translate(width/2, height/2, 0);
    
    const bubbleMaterial = new THREE.MeshPhongMaterial({
      color: isUser ? 0xeeeef5 : googleColors[colorIndex % googleColors.length],
      specular: 0x111111,
      shininess: 30,
      flatShading: false
    });
    
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(x, y, z);
    
    bubble.userData = {
      floatSpeed: 0.0008 + Math.random() * 0.0005,
      floatAmplitude: 0.03 + Math.random() * 0.02,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.003
      },
      phaseOffset: Math.random() * Math.PI * 2
    };
    
    return bubble;
  }
  
  const messageCount = 4;
  const userMessageCount = 3;
  
  for (let i = 0; i < messageCount; i++) {
    const y = 1.5 - i * 0.7;
    const width = 0.8 + Math.random() * 0.3;
    const height = 0.25 + Math.random() * 0.1;
    
    const bubble = createMessageBubble(
      -1.6, 
      y, 
      0, 
      width, 
      height, 
      0.1, 
      false, 
      i % googleColors.length
    );
    
    chatGroup.add(bubble);
  }
  
  for (let i = 0; i < userMessageCount; i++) {
    const y = 1.2 - i * 0.9;
    const width = 0.7 + Math.random() * 0.4;
    const height = 0.2 + Math.random() * 0.15;
    
    const bubble = createMessageBubble(
      0.8, 
      y, 
      0, 
      width, 
      height, 
      0.1, 
      true, 
      0
    );
    
    chatGroup.add(bubble);
  }
  
  scene.add(chatGroup);
  
  const typingGroup = new THREE.Group();
  typingGroup.position.set(-1.4, -1.5, 0);
  
  for (let i = 0; i < 3; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const dotMaterial = new THREE.MeshPhongMaterial({ 
      color: googleColors[0],
      emissive: googleColors[0],
      emissiveIntensity: 0.5
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    
    dot.position.x = i * 0.15;
    
    dot.userData = {
      phaseOffset: i * Math.PI * 0.5,
      amplitude: 0.05,
      speed: 0.008
    };
    
    typingGroup.add(dot);
  }
  
  scene.add(typingGroup);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  function animate() {
    requestAnimationFrame(animate);
    
    chatGroup.children.forEach(bubble => {
      const data = bubble.userData;
      
      bubble.position.y += Math.sin(Date.now() * data.floatSpeed + data.phaseOffset) * 0.0015;
      
      bubble.rotation.x += data.rotationSpeed.x;
      bubble.rotation.y += data.rotationSpeed.y;
      bubble.rotation.z += data.rotationSpeed.z;
    });
    
    typingGroup.children.forEach((dot, i) => {
      const data = dot.userData;
      dot.position.y = Math.sin(Date.now() * data.speed + data.phaseOffset) * data.amplitude;
      
      const scale = 0.8 + Math.sin(Date.now() * 0.01 + i * 1) * 0.2;
      dot.scale.set(scale, scale, scale);
    });
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  resizeObserver.observe(container);
}

function createSyncModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  scene.background = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  renderer.domElement.userData = { scene: scene };
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  const syncGroup = new THREE.Group();
  
  const centerGeometry = new THREE.OctahedronGeometry(0.6, 1);
  const centerMaterial = new THREE.MeshPhongMaterial({
    color: 0x4285f4,
    emissive: 0x4285f4,
    emissiveIntensity: 0.2,
    specular: 0xffffff,
    shininess: 70,
    flatShading: true
  });
  
  const centerNode = new THREE.Mesh(centerGeometry, centerMaterial);
  centerNode.userData = {
    rotationSpeed: { x: 0.002, y: 0.004, z: 0.001 }
  };
  
  syncGroup.add(centerNode);
  
  const shapes = [
    new THREE.TetrahedronGeometry(0.2, 0),
    new THREE.OctahedronGeometry(0.2, 0),
    new THREE.IcosahedronGeometry(0.15, 0),
    new THREE.BoxGeometry(0.2, 0.2, 0.2)
  ];
  
  const googleColors = [0x4285f4, 0x34a853, 0xfbbc05, 0xea4335];
  
  const createOrbitRing = (radius, count, yOffset, rotSpeed) => {
    const ringGroup = new THREE.Group();
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      const geometry = shapes[Math.floor(Math.random() * shapes.length)];
      const material = new THREE.MeshPhongMaterial({
        color: googleColors[i % googleColors.length],
        emissive: googleColors[i % googleColors.length],
        emissiveIntensity: 0.1,
        flatShading: true,
        shininess: 50
      });
      
      const node = new THREE.Mesh(geometry, material);
      
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y = yOffset;
      
      node.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      node.userData = {
        angle: angle,
        radius: radius,
        rotationSpeed: rotSpeed,
        orbitSpeed: 0.0005 + Math.random() * 0.001,
        selfRotation: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02
        },
        baseY: yOffset,
        oscillate: true,
        oscillateAmount: 0.05 + Math.random() * 0.1,
        oscillateSpeed: 0.001 + Math.random() * 0.002,
        phaseOffset: Math.random() * Math.PI * 2
      };
      
      ringGroup.add(node);
    }
    
    return ringGroup;
  };
  
  const ring1 = createOrbitRing(1.6, 6, 0, 0.005);
  const ring2 = createOrbitRing(2.2, 8, 0.5, -0.003);
  const ring3 = createOrbitRing(2.8, 10, -0.5, 0.002);
  
  syncGroup.add(ring1);
  syncGroup.add(ring2);
  syncGroup.add(ring3);
  
  const connectNodes = () => {
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x8ab4f8 : 0x4285f4,
      transparent: true,
      opacity: 0.3
    });
    
    [ring1, ring2, ring3].forEach(ring => {
      ring.children.forEach((node, index) => {
        if (index % 2 === 0) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            centerNode.position,
            node.position
          ]);
          
          const line = new THREE.Line(lineGeometry, connectionMaterial);
          line.userData = {
            from: centerNode,
            to: node,
            pulseFreq: 0.001 + Math.random() * 0.002,
            pulseOffset: Math.random() * Math.PI * 2
          };
          
          syncGroup.add(line);
        }
      });
    });
  };
  
  connectNodes();
  
  const updateConnections = () => {
    syncGroup.children.forEach(child => {
      if (child instanceof THREE.Line && child.userData.from && child.userData.to) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          child.userData.from.position,
          child.userData.to.position
        ]);
        
        child.geometry.dispose();
        child.geometry = lineGeometry;
        
        if (child.userData.pulseFreq) {
          const opacity = 0.2 + Math.sin(Date.now() * child.userData.pulseFreq + child.userData.pulseOffset) * 0.15;
          child.material.opacity = opacity;
        }
      }
    });
  };
  
  scene.add(syncGroup);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  
  function animate() {
    requestAnimationFrame(animate);
    
    centerNode.rotation.x += centerNode.userData.rotationSpeed.x;
    centerNode.rotation.y += centerNode.userData.rotationSpeed.y;
    centerNode.rotation.z += centerNode.userData.rotationSpeed.z;
    
    const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
    centerNode.scale.set(pulseScale, pulseScale, pulseScale);
    
    [ring1, ring2, ring3].forEach(ring => {
      ring.children.forEach(node => {
        const data = node.userData;
        
        data.angle += data.orbitSpeed;
        node.position.x = Math.cos(data.angle) * data.radius;
        node.position.z = Math.sin(data.angle) * data.radius;
        
        if (data.oscillate) {
          node.position.y = data.baseY + Math.sin(Date.now() * data.oscillateSpeed + data.phaseOffset) * data.oscillateAmount;
        }
        
        node.rotation.x += data.selfRotation.x;
        node.rotation.y += data.selfRotation.y;
        node.rotation.z += data.selfRotation.z;
      });
    });
    
    updateConnections();
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  resizeObserver.observe(container);
}

function createContactModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const scene = new THREE.Scene();
  
  const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
  scene.background = new THREE.Color(isDarkMode ? 0x28292c : 0xf8f9fa);
  
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  renderer.domElement.userData = { scene: scene };
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  const group = new THREE.Group();
  scene.add(group);
  
  const googleColors = [
    new THREE.Color(0x4285f4),  // Google Blue
    new THREE.Color(0xea4335),  // Google Red
    new THREE.Color(0xfbbc05),  // Google Yellow
    new THREE.Color(0x34a853)   // Google Green
  ];
  
  const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16, 2, 3);
  const torusMaterial = new THREE.MeshPhongMaterial({
    color: googleColors[0],
    emissive: googleColors[0],
    emissiveIntensity: 0.2,
    shininess: 60,
    transparent: true,
    opacity: 0.95,
  });
  
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.userData = {
    rotationSpeed: { 
      x: 0.002,
      y: 0.003,
      z: 0.001
    }
  };
  group.add(torus);
  
  const smallSphereCount = 20;
  
  for (let i = 0; i < smallSphereCount; i++) {
    const size = 0.05 + Math.random() * 0.1;
    const sphereGeometry = new THREE.SphereGeometry(size, 16, 16);
    const colorIndex = Math.floor(Math.random() * googleColors.length);
    
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: googleColors[colorIndex],
      emissive: googleColors[colorIndex],
      emissiveIntensity: 0.3,
      shininess: 70
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.8 + Math.random() * 1.5;
    
    sphere.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * radius
    );
    
    sphere.userData = {
      originalPosition: sphere.position.clone(),
      pulseSpeed: 0.002 + Math.random() * 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() - 0.5) * 0.002,
      orbitRadius: radius,
      orbitAngle: angle
    };
    
    group.add(sphere);
  }
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: isDarkMode ? 0x8ab4f8 : 0x4285f4,
    transparent: true,
    opacity: 0.15
  });
  
  // Create connections between spheres and torus
  const spheres = [];
  group.children.forEach(child => {
    if (child instanceof THREE.Mesh && child !== torus) {
      spheres.push(child);
      
      if (Math.random() > 0.5) {
        const torusPosition = new THREE.Vector3(0, 0, 0);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          torusPosition,
          child.position
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          from: { position: torusPosition },
          to: child,
          pulseFreq: 0.001 + Math.random() * 0.002,
          pulseOffset: Math.random() * Math.PI * 2
        };
        
        group.add(line);
      }
    }
  });
  
  // Create connections between spheres
  for (let i = 0; i < spheres.length; i++) {
    for (let j = i + 1; j < spheres.length; j++) {
      if (Math.random() > 0.95) continue;
      
      const sphere1 = spheres[i];
      const sphere2 = spheres[j];
      
      const distance = sphere1.position.distanceTo(sphere2.position);
      
      if (distance < 1.5) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          sphere1.position,
          sphere2.position
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          from: sphere1,
          to: sphere2,
          pulseFreq: 0.001 + Math.random() * 0.002,
          pulseOffset: Math.random() * Math.PI * 2
        };
        
        group.add(line);
      }
    }
  }
  
  function updateConnections() {
    group.children.forEach(child => {
      if (child instanceof THREE.Line && child.userData.from && child.userData.to) {
        const from = child.userData.from.position || child.userData.from;
        const to = child.userData.to.position;
        
        const points = [from, to];
        child.geometry.setFromPoints(points);
        
        if (child.userData.pulseFreq) {
          const opacity = 0.05 + Math.sin(Date.now() * child.userData.pulseFreq + child.userData.pulseOffset) * 0.05;
          child.material.opacity = opacity;
        }
      }
    });
  }
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.4;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  function animate() {
    requestAnimationFrame(animate);
    
    torus.rotation.x += torus.userData.rotationSpeed.x;
    torus.rotation.y += torus.userData.rotationSpeed.y;
    torus.rotation.z += torus.userData.rotationSpeed.z;
    
    const pulseScale = 1 + Math.sin(Date.now() * 0.0005) * 0.05;
    torus.scale.set(pulseScale, pulseScale, pulseScale);
    
    spheres.forEach(sphere => {
      const data = sphere.userData;
      
      // Orbit motion
      data.orbitAngle += data.orbitSpeed;
      sphere.position.x = Math.cos(data.orbitAngle) * data.orbitRadius;
      sphere.position.z = Math.sin(data.orbitAngle) * data.orbitRadius;
      
      // Pulse motion
      const scale = 1 + Math.sin(Date.now() * data.pulseSpeed + data.pulseOffset) * 0.2;
      sphere.scale.set(scale, scale, scale);
    });
    
    updateConnections();
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
  
  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  resizeObserver.observe(container);
}

function initFloatingNav() {
  const floatingNav = document.querySelector('.floating-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  
  updateActiveNavItem();
  
  gsap.fromTo(floatingNav, 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" }
  );
  
  navItems.forEach((item) => {
    item.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        gsap.to(this.querySelector('.icon-container'), {
          y: -3,
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      }
    });
    
    item.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        gsap.to(this.querySelector('.icon-container'), {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
  
  function updateActiveNavItem() {
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.classList.contains('active')) {
        activeIndex = index;
      }
    });
    
    navItems.forEach((item, index) => {
      if (index === activeIndex) {
        if (!item.classList.contains('active')) {
          item.classList.add('active');
          gsap.to(item.querySelector('.icon-container'), {
            y: -4,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
      } else {
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          gsap.to(item.querySelector('.icon-container'), {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });
  }
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (mutation.target.classList.contains('active')) {
          updateActiveNavItem();
        }
      }
    });
  });
  
  sections.forEach((section) => {
    observer.observe(section, { attributes: true });
  });
}
