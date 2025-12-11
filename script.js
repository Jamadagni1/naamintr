/* ======================================================
   SCRIPT.JS - UPDATED VERSION (Details + Pricing Fixed)
   ====================================================== */

// --- 1. Force Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

// --- DEBUG MESSAGE (Console me dikhega) ---
console.log("✅ NEW SCRIPT LOADED: Pricing & Details Fixed");

const GEMINI_API_KEY = ""; 
let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 2. HEADER & MENU ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

    const hamburger = document.getElementById("hamburger-menu");
    const nav = document.getElementById("main-nav");
    if(hamburger && nav) {
        hamburger.onclick = (e) => { 
            e.stopPropagation();
            hamburger.classList.toggle("active"); 
            nav.classList.toggle("active"); 
        };
        document.onclick = (e) => {
            if (nav.classList.contains("active") && !nav.contains(e.target)) {
                hamburger.classList.remove("active");
                nav.classList.remove("active");
            }
        };
    }

    // --- 3. PRICING / AURA PLANS TOGGLE (FIXED) ---
    const pricingHeaders = document.querySelectorAll(".pricing-card-header");
    
    // Debug: Check karein ki pricing cards mile ya nahi
    if(pricingHeaders.length === 0) console.warn("⚠️ Pricing headers nahi mile!");

    pricingHeaders.forEach(header => {
        header.addEventListener("click", () => {
            console.log("Pricing Card Clicked!"); // Check click
            const card = header.closest(".pricing-card");
            if (card) {
                // Sirf clicked card ko toggle karein
                card.classList.toggle("expanded");
            }
        });
    });

    // --- 4. TEXT & LANGUAGE ---
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) el.textContent = text;
        });
        const heroInput = document.getElementById("hero-search-input");
        if(heroInput) heroInput.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
    }
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) {
        langBtn.onclick = () => updateContent(localStorage.getItem("language") === "hi" ? "en" : "hi");
    }
    updateContent(localStorage.getItem("language") || "en");

    // --- 5. THEME ---
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const current = document.body.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });

    // --- 6. TYPING EFFECT ---
    const typeElement = document.getElementById("naamin-main-title-typing");
    if (typeElement) {
        const text = "Naamin";
        let i = 0;
        (function type() {
            typeElement.innerHTML = `<span class="naamin-naam">${text.slice(0, 4)}</span><span class="naamin-in">${text.slice(4, i++)}</span>`;
            if (i <= text.length) setTimeout(type, 150); else setTimeout(() => { i = 0; type(); }, 3000);
        })();
    }

    // ======================================================
    // SEARCH LOGIC
    // ======================================================
    async function handleHeroSearch() {
        const heroInput = document.getElementById('hero-search-input');
        if (!heroInput || !heroInput.value.trim()) return;
        const nameToSearch = heroInput.value.trim().toLowerCase();

        const nameFinderSection = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const detailsContainer = document.querySelector('.name-details-container');
        const listContainer = document.querySelector('.name-list-container');

        if (nameFinderSection) {
            const header = document.querySelector('header');
            window.scrollTo({ top: nameFinderSection.offsetTop - (header ? header.offsetHeight : 0), behavior: 'smooth' });

            if(listContainer) listContainer.style.display = 'none';
            if(detailsContainer) detailsContainer.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching Database...</div>';

            try {
                const [boysRes, girlsRes] = await Promise.all([
                    fetch('bnames.json').then(res => res.ok ? res.json() : []),
                    fetch('gnames.json').then(res => res.ok ? res.json() : [])
                ]);

                let allNames = [].concat(boysRes, girlsRes).flatMap(item => {
                    if (item.name) return item;
                    return Object.values(item).find(v => Array.isArray(v)) || [];
                });

                const foundPerson = allNames.find(n => n.name && n.name.toLowerCase() === nameToSearch);

                if (foundPerson) {
                    showDetailsInBox(detailsBox, foundPerson);
                } else {
                    detailsBox.innerHTML = `<h2>${nameToSearch}</h2><p>Name not found.</p><button class="back-btn" onclick="location.reload()">Try Another</button>`;
                }
            } catch(e) {
                console.error(e);
                detailsBox.innerHTML = `<p>Error searching data.</p>`;
            }
        }
    }

    const heroBtn = document.getElementById('hero-search-btn');
    const heroInp = document.getElementById('hero-search-input');
    if(heroBtn) heroBtn.onclick = handleHeroSearch;
    if(heroInp) heroInp.onkeypress = (e) => { if(e.key === "Enter") handleHeroSearch(); };


    // ======================================================
    // NAME FINDER LOGIC (A-Z)
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

        async function loadNames(gender) {
            const fileName = (gender === "Boy") ? "bnames.json" : "gnames.json";
            try {
                if(nameListContainer) nameListContainer.innerHTML = '<div class="spinner">Loading...</div>';
                const response = await fetch(fileName);
                if (!response.ok) throw new Error(`File missing: ${fileName}`);
                let rawData = await response.json();

                if (Array.isArray(rawData)) {
                    namesData = rawData;
                } else {
                    const values = Object.values(rawData);
                    const found = values.find(v => Array.isArray(v));
                    namesData = found || [];
                }
                renderNames();
            } catch (error) {
                console.error("Load Error:", error);
                if(nameListContainer) nameListContainer.innerHTML = `<p style="color:red">Error loading list.</p>`;
            }
        }

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

        function renderNames() {
            if(!nameListContainer) return;
            nameListContainer.innerHTML = "";
            const listSection = document.querySelector('.name-list-container');
            if(listSection) listSection.style.display = 'block';
            if(nameDetailsContainer) nameDetailsContainer.style.display = 'none';

            if (!Array.isArray(namesData)) return;

            const filtered = namesData.filter(n => n.name && n.name.toUpperCase().startsWith(currentLetter));
            
            if (filtered.length === 0) {
                nameListContainer.innerHTML = `<p style="width:100%; text-align:center;">No names found for ${currentLetter}</p>`;
                return;
            }

            filtered.forEach(person => {
                const div = document.createElement("div");
                div.className = "name-item";
                div.textContent = person.name;
                div.onclick = () => {
                    if(listSection) listSection.style.display = 'none';
                    if(nameDetailsContainer) nameDetailsContainer.style.display = 'block';
                    showDetailsInBox(nameDetailsBox, person);
                };
                nameListContainer.appendChild(div);
            });
        }

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

        generateAlphabet();
        loadNames("Boy");
    }

    // --- HELPER: SHOW DETAILS ---
    function showDetailsInBox(box, person) {
        if(!box) return;
        box.innerHTML = `
            <h2>${person.name}</h2>
            <div style="text-align: left; margin-top: 15px;">
                <p><strong>Meaning:</strong> ${person.meaning || 'N/A'}</p>
                <p><strong>Gender:</strong> ${person.gender || 'N/A'}</p>
                <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
                <p><strong>Rashi (Zodiac):</strong> ${person.zodiac || 'N/A'}</p>
                <p><strong>Numerology:</strong> ${person.numerology || 'N/A'}</p>
                <p><strong>Horoscope:</strong> ${person.horoscope || 'N/A'}</p>
                <p><strong>Nakshatra:</strong> ${person.nakshatra || 'N/A'}</p>
            </div>
        `;
    }

    // --- CHATBOT ---
    if (document.getElementById("chatbox")) {
        const sendBtn = document.getElementById("sendBtn");
        const userInput = document.getElementById("userInput");
        const chatbox = document.getElementById("chatbox");

        function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;
            chatbox.innerHTML += `<div class="message user">${text}</div>`;
            userInput.value = "";
            chatbox.scrollTop = chatbox.scrollHeight;
            chatbox.innerHTML += `<div class="message bot">API Key required for chat.</div>`;
        }
        if(sendBtn) sendBtn.onclick = sendMessage;
        if(userInput) userInput.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
    }
});
