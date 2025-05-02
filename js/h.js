
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  
  const loader = document.querySelector('.loader');
  const loaderProgress = document.querySelector('.loader-progress');
  let progress = 0;
  
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            loader.classList.add('hidden');
            initializeScrolling();
            initAnimations();
            initParticles();
            initializeProjectTabs();
          }
        });
      }, 500);
    }
    loaderProgress.style.width = `${progress}%`;
  }, 150);

  setTimeout(() => {
    initializeModels();
  }, 500);
  
  document.getElementById('theme-switch').addEventListener('click', toggleTheme);
});

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('#theme-switch i');
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
  }
}

function initParticles() {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 20,
        density: {
          enable: true,
          value_area: 1200
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
        value: 0.1,
        random: true,
        anim: {
          enable: true,
          speed: 0.2,
          opacity_min: 0.05,
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
        distance: 150,
        color: "#4285f4",
        opacity: 0.08,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.4,
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

function initAnimations() {
  const introSection = document.querySelector('#intro');
  if (introSection.classList.contains('active')) {
    gsap.to(introSection.querySelector('.title'), {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    gsap.to(introSection.querySelector('.subtitle'), {
      opacity: 0.8,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out"
    });
    
    gsap.to(introSection.querySelector('.scroll-hint'), {
      opacity: 1,
      duration: 1,
      delay: 0.4,
      ease: "power3.out"
    });
  }
}

function initializeScrolling() {
  const sections = document.querySelectorAll('.section');
  let currentSectionIndex = 0;
  let isScrolling = false;
  let lastScrollTime = 0;
  let scrollCooldown = 1500;
  let touchStartY = 0;
  let touchEndY = 0;
  let wheelAccumulator = 0;
  const wheelThreshold = 60;
  
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
      }
    } else {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
      }
    }
    
    updateSectionVisibility(currentSectionIndex);
    
    setTimeout(() => {
      isScrolling = false;
      wheelAccumulator = 0;
    }, scrollCooldown / 2);
    
    return true;
  }
  
  window.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    wheelAccumulator += Math.abs(e.deltaY);
    
    if (wheelAccumulator > wheelThreshold) {
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleScroll(direction);
      wheelAccumulator = 0;
    }
  }, { passive: false });
  
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    if (Math.abs(deltaY) < 80) return;
    
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
  
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      let targetIndex = -1;
      
      sections.forEach((section, index) => {
        if (section.id === targetId || section.id.includes(targetId)) {
          targetIndex = index;
        }
      });
      
      if (targetIndex !== -1) {
        currentSectionIndex = targetIndex;
        updateSectionVisibility(currentSectionIndex);
      }
    });
  });
}

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
  
  window.history.replaceState(null, null, '#' + sections[index].id);
}

function animateSectionElements(section) {
  if (section.id === 'intro') {
    gsap.to(section.querySelector('.title'), {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    gsap.to(section.querySelector('.subtitle'), {
      opacity: 0.8,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out"
    });
    
    gsap.to(section.querySelector('.scroll-hint'), {
      opacity: 1,
      duration: 1,
      delay: 0.4,
      ease: "power3.out"
    });
  } else if (section.id === 'projects') {
    const activeProject = section.querySelector('.project.active');
    if (activeProject) {
      gsap.to(activeProject.querySelector('.project-info'), {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.to(activeProject.querySelector('.model-container'), {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
      });
    }
  } else if (section.id === 'contact') {
    gsap.to(section.querySelector('h2'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    gsap.to(section.querySelector('p'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power3.out"
    });
    
    gsap.to(section.querySelector('.contact-button'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    });
    
    gsap.to(section.querySelector('.social-links'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out"
    });
  }
}

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
      showProject(index);
    });
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showProject(index);
    });
  });
  
  prevBtn.addEventListener('click', () => {
    if (currentProjectIndex > 0) {
      showProject(currentProjectIndex - 1);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentProjectIndex < projects.length - 1) {
      showProject(currentProjectIndex + 1);
    }
  });
  
  showProject(0);
}

function animateProjectElements(project) {
  gsap.fromTo(project.querySelector('.project-info'),
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out"
    }
  );
  
  gsap.fromTo(project.querySelector('.model-container'),
    { opacity: 0, x: 20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    }
  );
}

function initializeModels() {
  createModel('model-1', 'neuro', 0x4285f4);
  createModel('model-2', 'chat', 0x34a853);
  createModel('model-3', 'sync', 0xea4335);
}

function createModel(containerId, type, color) {
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
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
  backLight.position.set(-5, -5, -5);
  scene.add(backLight);
  
  switch (type) {
    case 'neuro':
      const neuralGroup = createNeuralNetwork(color);
      scene.add(neuralGroup);
      
      const animate = () => {
        requestAnimationFrame(animate);
        neuralGroup.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      
      animate();
      break;
      
    case 'chat':
      const chatGroup = createChatModel(color);
      scene.add(chatGroup);
      
      const animateChat = () => {
        requestAnimationFrame(animateChat);
        
        chatGroup.rotation.y += 0.005;
        
        renderer.render(scene, camera);
      };
      
      animateChat();
      break;
      
    case 'sync':
      const syncGroup = createSyncModel(color);
      scene.add(syncGroup);
      
      const animateSync = () => {
        requestAnimationFrame(animateSync);
        
        syncGroup.rotation.y += 0.004;
        
        syncGroup.traverse((child) => {
          if (child.isMesh && child.userData.animate) {
            const ud = child.userData;
            
            if (ud.rotationSpeed) {
              child.rotation.x += ud.rotationSpeed.x;
              child.rotation.y += ud.rotationSpeed.y;
              child.rotation.z += ud.rotationSpeed.z;
            }
            
            if (ud.oscillate) {
              child.position.y = ud.baseY + Math.sin(Date.now() * 0.001 + ud.phase) * ud.oscillateAmount;
            }
          }
        });
        
        const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.03;
        syncGroup.children[0].scale.set(pulseScale, pulseScale, pulseScale);
        
        renderer.render(scene, camera);
      };
      
      animateSync();
      break;
  }
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  
  window.addEventListener('resize', () => {
    if (container.clientWidth && container.clientHeight) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  });
  
  document.getElementById('theme-switch').addEventListener('click', () => {
    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    scene.background.set(isDarkMode ? 0x28292c : 0xf8f9fa);
  });
  
  return { scene, camera, renderer };
}

function createNeuralNetwork(color) {
  const neuralGroup = new THREE.Group();
  
  const material = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
    specular: 0xffffff,
    shininess: 50
  });
  
  const connectionMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.4
  });
  
  const nodes = [];
  const nodeMeshes = [];
  
  const addNode = (x, y, z, size) => {
    const nodeGeometry = new THREE.BoxGeometry(size, size, size);
    const node = new THREE.Mesh(nodeGeometry, material);
    node.position.set(x, y, z);
    neuralGroup.add(node);
    
    nodes.push(new THREE.Vector3(x, y, z));
    nodeMeshes.push(node);
    
    return node;
  };
  
  const createLayer = (x, count, size) => {
    const layerNodes = [];
    for (let i = 0; i < count; i++) {
      const yOffset = (i - (count - 1) / 2) * 0.7;
      const node = addNode(x, yOffset, 0, size);
      node.userData = {
        animate: true,
        rotationSpeed: {
          x: 0.005 + Math.random() * 0.01,
          y: 0.005 + Math.random() * 0.01,
          z: 0.005 + Math.random() * 0.01
        }
      };
      layerNodes.push(node);
    }
    return layerNodes;
  };
  
  const inputLayer = createLayer(-3, 4, 0.25);
  const hiddenLayer1 = createLayer(-1, 6, 0.25);
  const hiddenLayer2 = createLayer(1, 6, 0.25);
  const outputLayer = createLayer(3, 3, 0.25);
  
  const connectLayers = (layer1, layer2) => {
    for (let i = 0; i < layer1.length; i++) {
      for (let j = 0; j < layer2.length; j++) {
        const startNode = layer1[i].position;
        const endNode = layer2[j].position;
        
        const points = [startNode, endNode];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, connectionMaterial);
        neuralGroup.add(line);
      }
    }
  };
  
  connectLayers(inputLayer, hiddenLayer1);
  connectLayers(hiddenLayer1, hiddenLayer2);
  connectLayers(hiddenLayer2, outputLayer);
  
  neuralGroup.scale.set(0.8, 0.8, 0.8);
  
  return neuralGroup;
}

function createChatModel(color) {
  const chatGroup = new THREE.Group();
  
  const material = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
    specular: 0xffffff,
    shininess: 50,
    flatShading: true
  });
  
  const createChatBubble = (x, y, isUser) => {
    const bubbleGroup = new THREE.Group();
    
    const boxGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.2);
    const bubble = new THREE.Mesh(boxGeometry, material);
    
    const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    bubble.add(edges);
    
    bubbleGroup.add(bubble);
    
    if (isUser) {
      const indicatorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      for (let i = 0; i < 3; i++) {
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(-0.3 + i * 0.3, 0, 0.2);
        bubble.add(indicator);
      }
    }
    
    bubbleGroup.position.set(x, y, 0);
    bubbleGroup.userData = {
      animate: true,
      baseY: y,
      oscillate: true,
      oscillateAmount: 0.1,
      phase: isUser ? 0 : Math.PI
    };
    
    return bubbleGroup;
  };
  
  chatGroup.add(createChatBubble(-1.2, 0.7, false));
  chatGroup.add(createChatBubble(1.2, 0, true));
  chatGroup.add(createChatBubble(-1.2, -0.7, false));
  
  chatGroup.scale.set(1.2, 1.2, 1.2);
  
  return chatGroup;
}

function createSyncModel(color) {
  const syncGroup = new THREE.Group();
  
  const centerGeometry = new THREE.OctahedronGeometry(0.8, 1);
  const centerMaterial = new THREE.MeshPhongMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.2,
    specular: 0xffffff,
    shininess: 50,
    flatShading: true
  });
  
  const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
  centerSphere.userData = {
    animate: true,
    rotationSpeed: {
      x: 0.002,
      y: 0.004,
      z: 0.001
    }
  };
  
  syncGroup.add(centerSphere);
  
  const orbitGroup = new THREE.Group();
  
  const createOrbit = (radius, objectCount, height, orbitSpeed) => {
    const ring = new THREE.Group();
    
    const dataPointGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const dataPointMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.2,
      flatShading: true
    });
    
    for (let i = 0; i < objectCount; i++) {
      const angle = (i / objectCount) * Math.PI * 2;
      
      const dataPoint = new THREE.Mesh(dataPointGeometry, dataPointMaterial);
      
      dataPoint.position.x = Math.cos(angle) * radius;
      dataPoint.position.z = Math.sin(angle) * radius;
      dataPoint.position.y = height;
      
      dataPoint.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      dataPoint.userData = {
        animate: true,
        angle: angle,
        radius: radius,
        orbitSpeed: orbitSpeed,
        rotationSpeed: {
          x: 0.01,
          y: 0.01,
          z: 0.01
        },
        baseY: height,
        oscillate: true,
        oscillateAmount: 0.1,
        phase: Math.random() * Math.PI * 2
      };
      
      ring.add(dataPoint);
    }
    
    return ring;
  };
  
  orbitGroup.add(createOrbit(1.5, 6, 0, 0.005));
  orbitGroup.add(createOrbit(2.2, 8, 0.5, -0.003));
  orbitGroup.add(createOrbit(2.8, 10, -0.5, 0.002));
  
  syncGroup.add(orbitGroup);
  
  const updateOrbit = () => {
    orbitGroup.traverse((child) => {
      if (child.isMesh && child.userData.orbitSpeed) {
        const ud = child.userData;
        ud.angle += ud.orbitSpeed;
        
        child.position.x = Math.cos(ud.angle) * ud.radius;
        child.position.z = Math.sin(ud.angle) * ud.radius;
      }
    });
  };
  
  orbitGroup.userData = {
    update: updateOrbit
  };
  
  return syncGroup;
}
