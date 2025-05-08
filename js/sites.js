
document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
  const firebaseImports = `
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
    import {
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      sendPasswordResetEmail,
      sendEmailVerification,
      GoogleAuthProvider,
      signInWithPopup,
      OAuthProvider,
      signOut,
      onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
  `;

  const firebaseConfig = `
    const firebaseConfig = {
      apiKey: "AIzaSyBXHEcBnUwDJ4OiFxXk6f4aeH4qkto9k_8",
      authDomain: "mrko-xyz.firebaseapp.com",
      databaseURL: "https://mrko-xyz-default-rtdb.firebaseio.com",
      projectId: "mrko-xyz",
      storageBucket: "mrko-xyz.appspot.com",
      messagingSenderId: "454712108707"
    };
  `;

  // DOM Elements
  const elements = {
    // Editors
    htmlEditor: document.getElementById('html-code'),
    cssEditor: document.getElementById('css-code'),
    jsEditor: document.getElementById('js-code'),
    
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Preview
    previewFrame: document.getElementById('preview-frame'),
    refreshPreview: document.getElementById('refresh-preview'),
    loadingPreview: document.getElementById('loading-preview'),
    deviceButtons: document.querySelectorAll('.device-btn'),
    previewContainer: document.querySelector('.preview-container'),
    
    // URL Generation
    generateUrlBtn: document.getElementById('generate-url'),
    copyUrlBtn: document.getElementById('copy-url'),
    copyIconBtn: document.getElementById('copy-icon'),
    urlDisplay: document.getElementById('url-display'),
    generatedUrlElement: document.getElementById('generated-url'),
    visitSiteLink: document.getElementById('visit-site'),
    
    // Custom URL
    customUrlSection: document.getElementById('custom-url'),
    customUrlInput: document.getElementById('custom-url-input'),
    checkUrlBtn: document.getElementById('check-url'),
    urlStatus: document.getElementById('url-status'),
    cooldownTimer: document.getElementById('cooldown-timer'),
    urlCooldown: document.querySelector('.url-cooldown'),
    
    // Example and Clear
    loadExampleBtn: document.getElementById('load-example'),
    clearAllBtn: document.getElementById('clear-all'),
    
    // Saved Sites
    sitesList: document.getElementById('sites-list'),
    noSitesMessage: document.getElementById('no-sites'),
    clearSitesBtn: document.getElementById('clear-sites'),
    searchSites: document.getElementById('search-sites'),
    
    // Modal
    modal: document.getElementById('confirm-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalConfirm: document.getElementById('modal-confirm'),
    modalCancel: document.getElementById('modal-cancel'),
    closeModal: document.querySelector('.close-modal')
  };
  
  // Default code snippets
  const defaultCode = {
    html: `<div class="container">
  <h1>Welcome to my site</h1>
  <p>This is a paragraph of text. You can edit this content to create your own website.</p>
  <button id="myButton" class="btn">Click me</button>
  
  <div class="counter">
    <h2>Counter: <span id="count">0</span></h2>
    <div class="button-group">
      <button id="increment" class="btn btn-sm">+</button>
      <button id="decrement" class="btn btn-sm">-</button>
      <button id="reset" class="btn btn-sm">Reset</button>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  color: #333;
  background-color: #f8fafc;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #8B5CF6;
  margin-top: 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

p {
  margin-bottom: 20px;
  color: #4b5563;
}

.btn {
  background: #8B5CF6;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background: #7C3AED;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.875rem;
}

.counter {
  margin-top: 30px;
  padding: 20px;
  background: #ede9fe;
  border-radius: 8px;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

#count {
  font-weight: bold;
  font-size: 1.5em;
  color: #6D28D9;
}`,
    js: `// Initialize button event listener
document.getElementById('myButton').addEventListener('click', function() {
  alert('Button clicked!');
});

// Counter functionality
let count = 0;
const countDisplay = document.getElementById('count');

document.getElementById('increment').addEventListener('click', function() {
  count++;
  updateCount();
  animateCount('+1');
});

document.getElementById('decrement').addEventListener('click', function() {
  if (count > 0) {
    count--;
    updateCount();
    animateCount('-1');
  }
});

document.getElementById('reset').addEventListener('click', function() {
  count = 0;
  updateCount();
});

// Update the counter display
function updateCount() {
  countDisplay.textContent = count;
}

// Create a small animation when changing the counter
function animateCount(value) {
  const animation = document.createElement('span');
  animation.textContent = value;
  animation.style.position = 'absolute';
  animation.style.color = value.includes('+') ? '#10B981' : '#EF4444';
  animation.style.fontSize = '0.875rem';
  animation.style.opacity = '1';
  animation.style.top = '0';
  animation.style.left = '50%';
  animation.style.transform = 'translateX(-50%)';
  animation.style.transition = 'all 0.5s ease-out';
  
  const counter = document.querySelector('.counter');
  counter.style.position = 'relative';
  counter.appendChild(animation);
  
  setTimeout(() => {
    animation.style.opacity = '0';
    animation.style.top = '-20px';
  }, 50);
  
  setTimeout(() => {
    counter.removeChild(animation);
  }, 500);
}

// Log Firebase initialization
console.log('Firebase is available and ready to use!');`
  };
  
  // Application State
  const state = {
    currentTab: 'html',
    currentPreviewDevice: 'desktop',
    lastGeneratedUrl: null,
    customUrl: null,
    isPreviewLoading: false,
    savedSites: {},
    debounceTimer: null,
    urlCooldown: false,
    cooldownTime: 10, // seconds
    cooldownInterval: null,
    searchQuery: ''
  };

  // Initialize the application
  function init() {
    // Load saved code or set defaults
    loadFromLocalStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial preview update
    updatePreview();
    
    // Load saved sites
    loadSavedSites();
  }
  
  // Setup all event listeners
  function setupEventListeners() {
    // Tab switching
    elements.tabButtons.forEach(button => {
      button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Code editing with debounce
    [elements.htmlEditor, elements.cssEditor, elements.jsEditor].forEach(editor => {
      editor.addEventListener('input', debouncePreviewUpdate);
    });
    
    // Preview controls
    elements.refreshPreview.addEventListener('click', updatePreview);
    elements.deviceButtons.forEach(button => {
      button.addEventListener('click', () => switchPreviewDevice(button.dataset.device));
    });
    
    // URL Generation
    elements.generateUrlBtn.addEventListener('click', () => {
      elements.customUrlSection.classList.remove('hidden');
      generateAndSaveUrl();
    });
    elements.copyUrlBtn.addEventListener('click', copyUrlToClipboard);
    elements.copyIconBtn.addEventListener('click', copyUrlToClipboard);
    
    // Custom URL
    elements.customUrlInput.addEventListener('input', handleCustomUrlInput);
    elements.checkUrlBtn.addEventListener('click', checkCustomUrl);
    
    // Example and Clear
    elements.loadExampleBtn.addEventListener('click', loadExample);
    elements.clearAllBtn.addEventListener('click', () => {
      showModal('Clear All Code', 'Are you sure you want to clear all code? This cannot be undone.', clearAllCode);
    });
    
    // Saved Sites
    elements.clearSitesBtn.addEventListener('click', () => {
      showModal('Clear Saved Sites', 'Are you sure you want to delete all your saved sites? This cannot be undone.', clearAllSavedSites);
    });
    
    // Search sites
    elements.searchSites.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      updateSavedSitesList();
    });
    
    // Modal controls
    elements.modalCancel.addEventListener('click', hideModal);
    elements.closeModal.addEventListener('click', hideModal);
    
    // Save to localStorage before unload
    window.addEventListener('beforeunload', saveToLocalStorage);
  }
  
  // Tab switching functionality
  function switchTab(tab) {
    state.currentTab = tab;
    
    // Update active states
    elements.tabButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });
    
    elements.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tab}-editor`);
    });
  }
  
  // Switch preview device (responsive testing)
  function switchPreviewDevice(device) {
    state.currentPreviewDevice = device;
    
    // Update active states
    elements.deviceButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.device === device);
    });
    
    // Update preview container class
    elements.previewContainer.className = `preview-container ${device}`;
  }
  
  // Debounced preview update to avoid constant refreshing
  function debouncePreviewUpdate() {
    // Save to localStorage as user types
    saveToLocalStorage();
    
    // Debounce preview update
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => {
      updatePreview();
    }, 1000);
  }
  
  // Update the preview iframe with current code
  function updatePreview() {
    // Show loading indicator
    showPreviewLoading(true);
    
    // Get current code
    const htmlCode = elements.htmlEditor.value;
    const cssCode = elements.cssEditor.value;
    const jsCode = elements.jsEditor.value;
    
    // Create content for the iframe
    const iframeContent = generateHtmlContent(htmlCode, cssCode, jsCode);
    
    // Update iframe (with slight delay to show loading indicator)
    setTimeout(() => {
      try {
        const iframe = elements.previewFrame;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(iframeContent);
        doc.close();
        
        // Hide loading after a slight delay to ensure content is rendered
        setTimeout(() => {
          showPreviewLoading(false);
        }, 200);
      } catch (error) {
        showToast('Error updating preview', 'error');
        showPreviewLoading(false);
      }
    }, 200);
  }
  
  // Generate the complete HTML content for the iframe
  function generateHtmlContent(html, css, js) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>mrko.xyz/sites</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script type="module">
          ${firebaseImports}
          ${firebaseConfig}
          // Initialize Firebase
          document.addEventListener("DOMContentLoaded", () => {
            try {
              const app = initializeApp(firebaseConfig);
              const auth = getAuth(app);
              const database = getDatabase(app);
              
              // User's script
              ${js}
            } catch (error) {
              console.error("Firebase initialization error:", error);
            }
          });
        </script>
      </body>
      </html>
    `;
  }
  
  // Show/hide preview loading indicator
  function showPreviewLoading(show) {
    state.isPreviewLoading = show;
    elements.loadingPreview.classList.toggle('hidden', !show);
  }
  
  // Handle custom URL input
  function handleCustomUrlInput() {
    const customUrl = elements.customUrlInput.value.trim();
    
    // Enable/disable check button based on input
    elements.checkUrlBtn.disabled = customUrl.length === 0;
    
    // Basic validation (alphanumeric and hyphens only)
    if (customUrl && !/^[a-zA-Z0-9-]+$/.test(customUrl)) {
      elements.urlStatus.textContent = 'URL can only contain letters, numbers, and hyphens';
      elements.urlStatus.className = 'url-info error';
      elements.urlStatus.classList.remove('hidden');
      elements.checkUrlBtn.disabled = true;
    } else if (elements.urlStatus.classList.contains('error')) {
      elements.urlStatus.classList.add('hidden');
    }
  }
  
  // Start cooldown timer for URL checking
  function startCooldown() {
    state.urlCooldown = true;
    state.cooldownTime = 10;
    elements.cooldownTimer.textContent = state.cooldownTime;
    elements.urlCooldown.classList.remove('hidden');
    elements.checkUrlBtn.disabled = true;
    
    // Update cooldown timer every second
    state.cooldownInterval = setInterval(() => {
      state.cooldownTime--;
      elements.cooldownTimer.textContent = state.cooldownTime;
      
      if (state.cooldownTime <= 0) {
        clearInterval(state.cooldownInterval);
        state.urlCooldown = false;
        elements.urlCooldown.classList.add('hidden');
        elements.checkUrlBtn.disabled = elements.customUrlInput.value.trim().length === 0;
      }
    }, 1000);
  }
  
  // Check if URL contains profanity using free API
  async function checkForProfanity(text) {
    try {
      // First do a simple check with a basic list
      const basicBadWords = ['fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy', 'cock', 'penis', 'vagina', 'sex'];
      const lowercaseText = text.toLowerCase();
      
      for (const word of basicBadWords) {
        if (lowercaseText.includes(word)) {
          return true;
        }
      }
      
      // Then use the public API for a more thorough check
      const response = await fetch(`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(text)}`);
      const result = await response.text();
      return result.trim() === 'true';
    } catch (error) {
      console.error('Error checking profanity:', error);
      return false; // Assume no profanity if the check fails
    }
  }
  
  // Check if custom URL is available and valid
  async function checkCustomUrl() {
    const customUrl = elements.customUrlInput.value.trim();
    
    if (!customUrl) {
      return;
    }
    
    // Show checking status
    elements.urlStatus.textContent = 'Checking URL availability...';
    elements.urlStatus.className = 'url-info';
    elements.urlStatus.classList.remove('hidden');
    elements.checkUrlBtn.disabled = true;
    
    try {
      // Check for profanity
      const hasProfanity = await checkForProfanity(customUrl);
      
      if (hasProfanity) {
        elements.urlStatus.textContent = 'This URL contains inappropriate content. Please choose another.';
        elements.urlStatus.className = 'url-info error';
        startCooldown();
        return;
      }
      
      // Check if URL is already taken (in local storage for this demo)
      if (state.savedSites[customUrl]) {
        elements.urlStatus.textContent = 'This URL is already taken. Please choose another.';
        elements.urlStatus.className = 'url-info error';
        startCooldown();
        return;
      }
      
      // URL is available
      elements.urlStatus.textContent = 'URL is available! Click "Generate URL" to use it.';
      elements.urlStatus.className = 'url-info success';
      state.customUrl = customUrl;
      startCooldown();
      
      // Update the generate URL button to use custom URL
      elements.generateUrlBtn.textContent = 'Use This URL';
      elements.generateUrlBtn.onclick = () => generateAndSaveUrl(customUrl);
      
    } catch (error) {
      console.error('Error checking URL:', error);
      elements.urlStatus.textContent = 'Error checking URL. Please try again.';
      elements.urlStatus.className = 'url-info error';
      startCooldown();
    }
  }
  
  // Generate a URL for the site and save it
  function generateAndSaveUrl(customUrl = null) {
    try {
      // Show loading state
      elements.generateUrlBtn.textContent = 'Generating...';
      elements.generateUrlBtn.disabled = true;
      
      setTimeout(() => {
        // Generate a unique URL or use custom one
        const url = customUrl || generateUniqueUrl();
        const fullUrl = `mrko.xyz/sites/${url}`;
        state.lastGeneratedUrl = url;
        
        // Get current code
        const siteData = {
          html: elements.htmlEditor.value,
          css: elements.cssEditor.value,
          js: elements.jsEditor.value,
          createdAt: new Date().toISOString(),
          title: extractTitleFromHTML(elements.htmlEditor.value) || `Site ${url}`,
          custom: customUrl !== null
        };
        
        // Save to local storage
        state.savedSites[url] = siteData;
        localStorage.setItem('savedSites', JSON.stringify(state.savedSites));
        
        // Update UI
        elements.generatedUrlElement.textContent = `https://${fullUrl}`;
        elements.urlDisplay.classList.remove('hidden');
        elements.copyUrlBtn.disabled = false;
        elements.visitSiteLink.href = `https://${fullUrl}`;
        
        // Reset button state
        elements.generateUrlBtn.textContent = 'Generate URL';
        elements.generateUrlBtn.disabled = false;
        elements.generateUrlBtn.onclick = () => {
          elements.customUrlSection.classList.remove('hidden');
          generateAndSaveUrl();
        };
        
        // Reset custom URL input and status
        if (customUrl) {
          elements.customUrlInput.value = '';
          elements.urlStatus.classList.add('hidden');
        }
        
        // Show success message
        showToast('URL generated successfully!', 'success');
        
        // Update saved sites list
        updateSavedSitesList();
      }, 500);
    } catch (error) {
      console.error('Error generating URL:', error);
      elements.generateUrlBtn.textContent = 'Generate URL';
      elements.generateUrlBtn.disabled = false;
      showToast('Failed to generate URL. Please try again.', 'error');
    }
  }
  
  // Extract title from HTML content
  function extractTitleFromHTML(html) {
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (titleMatch && titleMatch[1]) {
      // Strip any HTML tags from the title
      return titleMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
    }
    return null;
  }
  
  // Generate a unique URL (alphanumeric, 8 characters)
  function generateUniqueUrl() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const length = 8;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }
  
  // Copy the generated URL to clipboard
  function copyUrlToClipboard() {
    if (state.lastGeneratedUrl) {
      const fullUrl = `https://mrko.xyz/sites/${state.lastGeneratedUrl}`;
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          showToast('URL copied to clipboard!', 'success');
        })
        .catch(() => {
          showToast('Failed to copy URL. Please try again.', 'error');
        });
    }
  }
  
  // Load example code
  function loadExample() {
    elements.htmlEditor.value = defaultCode.html;
    elements.cssEditor.value = defaultCode.css;
    elements.jsEditor.value = defaultCode.js;
    
    // Update preview
    updatePreview();
    showToast('Example code loaded!', 'info');
  }
  
  // Clear all code
  function clearAllCode() {
    elements.htmlEditor.value = '';
    elements.cssEditor.value = '';
    elements.jsEditor.value = '';
    
    // Update preview
    updatePreview();
    hideModal();
    showToast('All code cleared!', 'info');
  }
  
  // Load saved sites from localStorage
  function loadSavedSites() {
    try {
      const savedSites = localStorage.getItem('savedSites');
      if (savedSites) {
        state.savedSites = JSON.parse(savedSites);
        updateSavedSitesList();
      }
    } catch (error) {
      console.error('Error loading saved sites:', error);
      showToast('Failed to load saved sites.', 'error');
    }
  }
  
  // Update the list of saved sites
  function updateSavedSitesList() {
    const sitesList = elements.sitesList;
    
    // Clear current list (except no-sites message)
    while (sitesList.firstChild && sitesList.firstChild !== elements.noSitesMessage) {
      sitesList.removeChild(sitesList.firstChild);
    }
    
    // Check if there are any saved sites
    let sites = Object.entries(state.savedSites);
    
    // Filter sites by search query if any
    if (state.searchQuery) {
      sites = sites.filter(([url, site]) => 
        site.title.toLowerCase().includes(state.searchQuery) || 
        url.toLowerCase().includes(state.searchQuery)
      );
    }
    
    if (sites.length === 0) {
      elements.noSitesMessage.classList.remove('hidden');
      if (state.searchQuery) {
        elements.noSitesMessage.querySelector('p').textContent = 'No sites found matching your search.';
      } else {
        elements.noSitesMessage.querySelector('p').textContent = 'No saved sites yet. Generate a URL to save your site.';
      }
      return;
    }
    
    elements.noSitesMessage.classList.add('hidden');
    
    // Add each site
    sites
      .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
      .forEach(([url, site]) => {
        const card = createSiteCard(url, site);
        sitesList.appendChild(card);
      });
  }
  
  // Create a card element for a saved site
  function createSiteCard(url, site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    
    const createdDate = new Date(site.createdAt);
    const formattedDate = createdDate.toLocaleDateString() + ' ' + 
      createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const fullUrl = `mrko.xyz/sites/${url}`;
    
    // Create preview iframe
    const previewDiv = document.createElement('div');
    previewDiv.className = 'site-preview';
    
    const previewIframe = document.createElement('iframe');
    previewIframe.srcdoc = generateHtmlContent(site.html, site.css, site.js);
    previewIframe.title = site.title;
    previewDiv.appendChild(previewIframe);
    
    // Add URL type badge
    const urlTypeBadge = document.createElement('div');
    urlTypeBadge.className = `url-type ${site.custom ? 'custom' : 'auto'}`;
    urlTypeBadge.textContent = site.custom ? 'Custom URL' : 'Auto URL';
    urlTypeBadge.title = site.custom ? 'Custom URL chosen by user' : 'Automatically generated URL';
    previewDiv.appendChild(urlTypeBadge);
    
    // Create site info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'site-info';
    
    const title = document.createElement('h3');
    title.className = 'site-title';
    title.textContent = site.title;
    
    const date = document.createElement('div');
    date.className = 'site-date';
    date.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
    
    const urlDisplay = document.createElement('div');
    urlDisplay.className = 'site-url';
    urlDisplay.innerHTML = `<span class="url-label">URL:</span> <span class="url-value">${url}</span>`;
    
    const actions = document.createElement('div');
    actions.className = 'site-actions';
    
    // Visit button
    const visitBtn = document.createElement('a');
    visitBtn.className = 'btn btn-sm btn-outline';
    visitBtn.href = `https://${fullUrl}`;
    visitBtn.target = '_blank';
    visitBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit';
    
    // Load button
    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn btn-sm btn-primary';
    loadBtn.innerHTML = '<i class="fas fa-code"></i> Edit';
    loadBtn.addEventListener('click', () => {
      showModal('Load Site', `Are you sure you want to load "${site.title}"? This will replace your current code.`, () => {
        loadSite(site);
        hideModal();
      });
    });
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-outline';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
      showModal('Delete Site', `Are you sure you want to delete "${site.title}"?`, () => {
        deleteSite(url);
        hideModal();
      });
    });
    
    // Assemble the card
    actions.appendChild(visitBtn);
    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(date);
    infoDiv.appendChild(urlDisplay);
    infoDiv.appendChild(actions);
    
    card.appendChild(previewDiv);
    card.appendChild(infoDiv);
    
    // Add custom styles for URL type badge
    const style = document.createElement('style');
    style.textContent = `
      .url-type {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .url-type.custom {
        background-color: #EDE9FE;
        color: #6D28D9;
      }
      .url-type.auto {
        background-color: #F1F5F9;
        color: #64748B;
      }
      .site-url {
        margin-bottom: 0.75rem;
        font-size: 0.75rem;
        color: var(--text-light);
        word-break: break-all;
      }
      .url-label {
        font-weight: 500;
      }
      .url-value {
        font-family: 'JetBrains Mono', monospace;
      }
    `;
    document.head.appendChild(style);
    
    return card;
  }
  
  // Load a saved site into the editor
  function loadSite(site) {
    elements.htmlEditor.value = site.html;
    elements.cssEditor.value = site.css;
    elements.jsEditor.value = site.js;
    
    // Update preview
    updatePreview();
    showToast('Site loaded successfully!', 'success');
  }
  
  // Delete a saved site
  function deleteSite(url) {
    try {
      delete state.savedSites[url];
      localStorage.setItem('savedSites', JSON.stringify(state.savedSites));
      updateSavedSitesList();
      showToast('Site deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting site:', error);
      showToast('Failed to delete site.', 'error');
    }
  }
  
  // Clear all saved sites
  function clearAllSavedSites() {
    try {
      state.savedSites = {};
      localStorage.setItem('savedSites', JSON.stringify(state.savedSites));
      updateSavedSitesList();
      hideModal();
      showToast('All saved sites cleared!', 'info');
    } catch (error) {
      console.error('Error clearing saved sites:', error);
      showToast('Failed to clear saved sites.', 'error');
      hideModal();
    }
  }
  
  // Show confirmation modal
  function showModal(title, message, confirmCallback) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modalConfirm.onclick = confirmCallback;
    elements.modal.classList.add('active');
  }
  
  // Hide confirmation modal
  function hideModal() {
    elements.modal.classList.remove('active');
  }
  
  // Save current code to localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('htmlCode', elements.htmlEditor.value);
      localStorage.setItem('cssCode', elements.cssEditor.value);
      localStorage.setItem('jsCode', elements.jsEditor.value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  // Load code from localStorage
  function loadFromLocalStorage() {
    try {
      const savedHtml = localStorage.getItem('htmlCode');
      const savedCss = localStorage.getItem('cssCode');
      const savedJs = localStorage.getItem('jsCode');
      
      elements.htmlEditor.value = savedHtml || defaultCode.html;
      elements.cssEditor.value = savedCss || defaultCode.css;
      elements.jsEditor.value = savedJs || defaultCode.js;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      
      // Fall back to defaults
      elements.htmlEditor.value = defaultCode.html;
      elements.cssEditor.value = defaultCode.css;
      elements.jsEditor.value = defaultCode.js;
    }
  }
  
  // Show toast notification
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon;
    switch (type) {
      case 'success':
        icon = 'check-circle';
        break;
      case 'error':
        icon = 'exclamation-circle';
        break;
      case 'warning':
        icon = 'exclamation-triangle';
        break;
      default:
        icon = 'info-circle';
    }
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="toast-content">
        ${message}
      </div>
      <div class="toast-progress"></div>
    `;
    
    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Initialize the application
  init();
});
