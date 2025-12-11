/* ======================================================
   SCRIPT.JS - FINAL WORKING VERSION
   ====================================================== */

// ⚠️ IMPORTANT: Paste your API Key here if you want Chatbot/Search to work
const GEMINI_API_KEY = ""; 

// --- IMMEDIATE FIX: Force page visibility immediately ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// Global Variables
let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // Ensure visibility again just in case
    document.body.style.visibility = 'visible'; 
    document.body.style.opacity = '1';

    // --- 1. Header Adjustment ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    // --- 2. Typing Effect ---
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin";
        let i = 0;
        (function type() {
            typeElement.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i++)}</span>`;
            if (i <= text.length) setTimeout(type, 150);
            else setTimeout(() => { i = 0; type(); }, 3000);
        })();
    }

    // --- 3. Theme & Language ---
    const setTheme = (t) => {
        document.body.setAttribute("data-theme", t);
        localStorage.setItem("theme", t);
        const btn = document.getElementById("theme-toggle");
        if(btn) btn.innerHTML = t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    setTheme(localStorage.getItem("theme") || "light");
    
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
    });

    // --- 4. Mobile Menu ---
    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.addEventListener("click", (e) => { 
            e.stopPropagation();
            hamburger.classList.toggle("active"); 
            nav.classList.toggle("active"); 
        });
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
            }
        });
    }

    // ======================================================
    // NAME FINDER LOGIC
    // ======================================================
    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const alphabetContainer = document.querySelector('.alphabet-selector');
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsBox = document.querySelector('.name-details');
        const nameDetailsContainer = document.querySelector('.name-details-container');
        const genderBtns = document.querySelectorAll('.gender-btn');
        const backBtn = document.querySelector('.back-btn');
        
        let currentGender = "Boy";
        let currentLetter = "A";

        // --- LOAD DATA ---
        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                
                const response = await fetch(fileName);
                if (!response.ok) throw new Error(`File not found: ${fileName}`);
                
                let rawData = await response.json();

                // Smart Check: Is it a List or an Object?
                if (Array.isArray(rawData)) {
                    namesData = rawData;
                } else {
                    // Try to find the array inside the object
                    const values = Object.values(rawData);
                    const found = values.find(v => Array.isArray(v));
                    namesData = found || [];
                }
                
                renderNames();

            } catch (error) {
                console.error("Error:", error);
                if(nameListContainer) nameListContainer.innerHTML = `<p style="color:red">Error loading ${fileName}.<br>Check if file exists.</p>`;
            }
        }

        // --- RENDER A-Z BUTTONS ---
        function generateAlphabet() {
            if(!alphabetContainer) return;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            alphabetContainer.innerHTML = "";
            chars.forEach(char => {
                const btn = document.createElement("button");
                btn.className = `alphabet-btn ${char === currentLetter ? 'active' : ''}`;
                btn.textContent = char;
                btn.onclick = () => {
                    document.querySelectorAll('.alphabet-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLetter = char;
                    renderNames();
                };
                alphabetContainer.appendChild(btn);
            });
        }

        // --- RENDER NAMES LIST ---
        function renderNames() {
            if(!nameListContainer) return;
            nameListContainer.innerHTML = "";
            
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            if (!Array.isArray(namesData)) return;

            // Filter Logic (Case Insensitive)
            const filtered = namesData.filter(n => 
                n.name && n.name.toUpperCase().startsWith(currentLetter)
            );
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found starting with ${currentLetter}</p>`;
                return;
            }

            // Create Cards
            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name;
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    
                    if(nameDetailsBox) {
                        nameDetailsBox.innerHTML = `
                            <h2>${person.name}</h2>
                            <p><strong>Meaning:</strong> ${person.meaning || 'N/A'}</p>
                            <p><strong>Rashi:</strong> ${person.zodiac || 'N/A'}</p>
                            <p><strong>Horoscope:</strong> ${person.horoscope || 'N/A'}</p>
                            <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
                        `;
                    }
                };
                nameListContainer.appendChild(div);
            });
        }

        // --- BUTTON EVENTS ---
        genderBtns.forEach(btn => {
            btn.onclick = () => {
                genderBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGender = btn.dataset.gender;
                loadNames(currentGender);
            };
        });

        if(backBtn) backBtn.onclick = () => {
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
        };

        // Initialize
        generateAlphabet();
        loadNames("Boy");
    }

    // ======================================================
    // HERO SEARCH & CHATBOT (API BASED)
    // ======================================================
    
    // Hero Search
    async function handleHeroSearch() {
        const heroInput = document.getElementById('hero-search-input');
        if (!heroInput) return;
        const nameToSearch = heroInput.value.trim();
        if (!nameToSearch) return;

        const nameFinderSection = document.getElementById('name-finder');
        if (nameFinderSection) {
            // Scroll to section
            const header = document.querySelector('header');
            const offset = nameFinderSection.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 20;
            window.scrollTo({ top: offset, behavior: 'smooth' });

            // Show Loading in Details
            const listSection = document.querySelector('.name-list-container');
            const detailsSection = document.querySelector('.name-details-container');
            const detailsBox = document.querySelector('.name-details');
            
            if(listSection) listSection.style.display = 'none';
            if(detailsSection) detailsSection.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching API...</div>';

            // API Call
            try {
                if(!GEMINI_API_KEY) throw new Error("API Key missing");
                
                const prompt = `Provide meaning and origin for name '${nameToSearch}'`;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No details found.";
                
                detailsBox.innerHTML = `<h2>${nameToSearch}</h2><p>${text.replace(/\n/g, "<br>")}</p>`;

            } catch(e) {
                if(detailsBox) detailsBox.innerHTML = `<h2>${nameToSearch}</h2><p>Could not fetch details (Check API Key).</p>`;
            }
        }
    }

    const heroBtn = document.getElementById('hero-search-btn');
    const heroInput = document.getElementById('hero-search-input');
    if(heroBtn) heroBtn.onclick = handleHeroSearch;
    if(heroInput) heroInput.onkeypress = (e) => { if(e.key === "Enter") handleHeroSearch(); };

    // Chatbot
    if (document.getElementById("chatbox")) {
        const sendBtn = document.getElementById("sendBtn");
        const userInput = document.getElementById("userInput");
        const chatbox = document.getElementById("chatbox");

        function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;
            
            // Add User Message
            chatbox.innerHTML += `<div class="message user">${text}</div>`;
            userInput.value = "";
            chatbox.scrollTop = chatbox.scrollHeight;

            // Add Bot Message
            setTimeout(() => {
                chatbox.innerHTML += `<div class="message bot">For AI Chat, please add API Key in script.js</div>`;
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 500);
        }
        if(sendBtn) sendBtn.onclick = sendMessage;
        if(userInput) userInput.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
    }
});
