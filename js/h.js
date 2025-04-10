const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const placeholderOverlay = document.querySelector(".placeholder-overlay");
const API_KEY = "AIzaSyDG55m1mIek1S7HH3oJILfuWDNWT1DEx3U";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
const placeholderExamples = ["Generate a brief business email", "Draft a thank you note for an interview", "Explain quantum computing in simple terms", "Summarize the latest technology news", "Draft an invitation for a corporate event", "Write a motivational quote", "Describe a beautiful sunset", "Explain the stock market in simple words", "Generate a creative poem about nature", "Write a review for a new restaurant", "Outline a business plan for a startup", "Compose a professional apology email", "Suggest ideas for a team-building event", "Write an introduction for a blog post", "Describe the benefits of meditation", "Explain how to improve public speaking skills", "Write a short story about friendship", "Draft a polite invitation for a dinner party", "Summarize events from a recent conference", "Create a catchy slogan for a product", "Generate an outline for a research paper", "Explain the importance of cybersecurity", "Draft a congratulatory message for a promotion", "Write a concise product description", "Generate a humorous tweet about coffee", "Draft a professional LinkedIn summary", "Explain the recycling process simply", "Write a thank you note for client appreciation", "Summarize the benefits of remote work"];
let placeholderIndex = 0;
function cyclePlaceholder() {
  placeholderOverlay.style.opacity = 0;
  setTimeout(() => {
    placeholderOverlay.textContent = placeholderExamples[placeholderIndex];
    placeholderOverlay.style.opacity = 1;
    placeholderIndex = (placeholderIndex + 1) % placeholderExamples.length;
  }, 500);
}
setInterval(cyclePlaceholder, 5000);
userInput.addEventListener("focus", () => {
  document.querySelector(".input-wrapper").classList.add("focused");
});
userInput.addEventListener("blur", () => {
  document.querySelector(".input-wrapper").classList.remove("focused");
  if (userInput.value.trim() !== "") {
    document.querySelector(".input-wrapper").classList.add("filled");
  } else {
    document.querySelector(".input-wrapper").classList.remove("filled");
  }
});
userInput.addEventListener("input", () => {
  if (userInput.value.trim() !== "") {
    document.querySelector(".input-wrapper").classList.add("filled");
  } else {
    document.querySelector(".input-wrapper").classList.remove("filled");
  }
});
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "ai"} animate__animated animate__fadeIn`;
  const messagePara = document.createElement("p");
  messagePara.innerHTML = isUser ? text : marked.parse(text);
  messageDiv.appendChild(messagePara);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai";
  loadingDiv.id = "loadingMessage";
  const loadingDots = document.createElement("div");
  loadingDots.className = "loading-dots";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    loadingDots.appendChild(dot);
  }
  loadingDiv.appendChild(loadingDots);
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeLoadingIndicator() {
  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) loadingMessage.remove();
}
const presetRejectionEmails = ["Thank you for your interest, but I must decline this opportunity.", "I appreciate the offer; however, I have to respectfully pass.", "Thank you for considering me, but I will not be able to proceed.", "I am grateful for your proposal, but I must decline.", "Your offer is appreciated; however, I am unable to accept it at this time.", "Thank you for reaching out; unfortunately, I must decline."];
const newsItems = [
  { size: "large", image: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", headline: "Welcome to MRKO.XYZ, the AI space.", publishedAt: "2025-04-10T12:00:00Z" },
  { size: "small", image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80", headline: "More coming soon.", url: "https://google.com", publishedAt: "2025-04-10T10:00:00Z" },
];
function renderNews() {
  const newsSection = document.getElementById("newsSection");
  if (!newsSection) return;
  newsSection.innerHTML = "";
  let sortedNews = newsItems.slice().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  sortedNews.forEach(item => {
    const card = document.createElement("div");
    card.className = `news-card ${item.size} animate__animated animate__fadeIn`;
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.headline;
    card.appendChild(img);
    const content = document.createElement("div");
    content.className = "news-content";
    const title = document.createElement("h3");
    title.textContent = item.headline;
    content.appendChild(title);
    if (item.url) {
      const btn = document.createElement("a");
      btn.href = item.url;
      btn.target = "_blank";
      btn.className = "news-button";
      btn.textContent = "Read More";
      content.appendChild(btn);
    }
    card.appendChild(content);
    newsSection.appendChild(card);
  });
}
async function processUserInput() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;
  addMessage(userMessage, true);
  userInput.value = "";
  document.querySelector(".input-wrapper").classList.remove("filled");
  addLoadingIndicator();
  if (userMessage.toLowerCase() === "generate a brief business email") {
    setTimeout(() => {
      removeLoadingIndicator();
      const preset = presetRejectionEmails[Math.floor(Math.random() * presetRejectionEmails.length)];
      addMessage(preset);
    }, 1000);
    return;
  }
  try {
    const promptText = "Provide a concise, professional answer formatted in Markdown. " + userMessage;
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200, topP: 0.95 }
      })
    });
    removeLoadingIndicator();
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
      addMessage(data.candidates[0].content.parts[0].text);
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    removeLoadingIndicator();
    addMessage("Sorry, an error occurred processing your request. Please try again.");
  }
}
sendButton.addEventListener("click", processUserInput);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") processUserInput();
});
document.querySelectorAll(".option-button").forEach(button => {
  button.addEventListener("click", () => {
    const text = button.textContent.trim();
    if (text.includes("Search")) {
      userInput.value = "Search for: ";
    } else if (text.includes("Discuss")) {
      userInput.value = "Let's discuss ";
    } else {
      userInput.value = `Tell me about ${text}`;
    }
    userInput.focus();
    userInput.selectionStart = userInput.value.length;
  });
});
document.querySelector(".more-option").addEventListener("click", () => {
  document.querySelector(".more-option").classList.toggle("active");
});
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.style.boxShadow = window.scrollY > 10 ? "0 1px 3px rgba(0,0,0,0.1)" : "none";
});
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("q")) {
    userInput.value = urlParams.get("q");
    processUserInput();
  }
  renderNews();
});
