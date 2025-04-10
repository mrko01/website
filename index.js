import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup, OAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBXHEcBnUwDJ4OiFxXk6f4aeH4qkto9k_8",
    authDomain: "mrko-xyz.firebaseapp.com",
    databaseURL: "https://mrko-xyz-default-rtdb.firebaseio.com",
    projectId: "mrko-xyz",
    storageBucket: "mrko-xyz.appspot.com",
    messagingSenderId: "454712108707"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  onAuthStateChanged(auth, user => {
    if (user && user.emailVerified) window.location.href = '/h';
  });
  let currentMode = "login";
  const togglePasswordButton = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.querySelector('i').className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });
  }
  const loginForm = document.getElementById('login-form');
  const confirmPasswordGroup = document.getElementById('confirm-password-group');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const heading = document.querySelector('h1');
  const subtext = document.querySelector('p');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  const registerLink = document.getElementById('register-link');
  const clearInputs = () => {
    document.getElementById('email').value = "";
    passwordInput.value = "";
    if (confirmPasswordInput) confirmPasswordInput.value = "";
  }
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    try {
      if (currentMode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (!result.user.emailVerified) {
          await signOut(auth);
          showModal("Your email is not verified. Please check your Gmail for a verification link and then try signing in again.");
          submitButton.innerHTML = "Sign In";
          submitButton.disabled = false;
          return;
        }
      } else {
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        showModal(`A verification email has been sent to ${email}. Please check your Gmail, verify your account, then sign in.`);
        clearInputs();
        submitButton.innerHTML = "Register";
        submitButton.disabled = false;
        return;
      }
      submitButton.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
      setTimeout(() => { window.location.href = '/h'; }, 1500);
    } catch (error) {
      submitButton.innerHTML = currentMode === "login" ? "Sign In" : "Register";
      submitButton.disabled = false;
      alert(error.message);
    }
  });
  registerLink.addEventListener('click', e => {
    e.preventDefault();
    if (currentMode === "login") {
      currentMode = "register";
      heading.innerText = "Create an Account";
      subtext.innerText = "Enter your details to register your account";
      confirmPasswordGroup.style.display = "block";
      submitButton.innerText = "Register";
      registerLink.innerText = "Already have an account? Sign In";
      clearInputs();
    } else {
      currentMode = "login";
      heading.innerText = "Welcome Back!";
      subtext.innerText = "Enter your credentials to access your account";
      confirmPasswordGroup.style.display = "none";
      submitButton.innerText = "Sign In";
      registerLink.innerText = "Don't have an account? Register";
      clearInputs();
    }
  });
  document.getElementById('forgot-password-link').addEventListener('click', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) { alert("Please enter your email address for password reset."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) { alert(error.message); }
  });
  document.getElementById('google-login').addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); }
    catch (error) { alert(error.message); }
  });
  document.getElementById('apple-login').addEventListener('click', async () => {
    const provider = new OAuthProvider('apple.com');
    try { await signInWithPopup(auth, provider); }
    catch (error) { alert(error.message); }
  });
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.querySelector('.input-icon').style.color = 'var(--primary-color)';
    });
    input.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.parentElement.querySelector('.input-icon').style.color = 'var(--text-muted)';
      }
    });
  });
  const addRippleEffect = elements => {
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
        setTimeout(() => { ripple.remove(); }, 700);
      });
    });
  };
  addRippleEffect(document.querySelectorAll('.btn, .social-btn'));
  const brandLogoElement = document.querySelector('.brand-logo');
  if (brandLogoElement) {
    brandLogoElement.addEventListener('click', function() {
      this.classList.add('rotating');
      setTimeout(() => { this.classList.remove('rotating'); }, 1000);
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
  function showModal(message) {
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = 0;
    modalOverlay.style.left = 0;
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '1000';
    const modalBox = document.createElement('div');
    modalBox.style.backgroundColor = '#fff';
    modalBox.style.padding = '20px';
    modalBox.style.borderRadius = '8px';
    modalBox.style.textAlign = 'center';
    modalBox.style.maxWidth = '90%';
    const modalMsg = document.createElement('p');
    modalMsg.innerText = message;
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '20px';
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.style.padding = '10px 20px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '4px';
    okButton.style.backgroundColor = 'var(--primary-color)';
    okButton.style.color = '#fff';
    okButton.addEventListener('click', async () => {
      modalOverlay.remove();
      try { await signOut(auth); } catch (error) {}
      window.location.reload();
    });
    btnContainer.appendChild(okButton);
    modalBox.appendChild(modalMsg);
    modalBox.appendChild(btnContainer);
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
  }
});
