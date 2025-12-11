/* ======================================================
   SCRIPT.JS - ALL FEATURES FIXED (Names + Pricing)
   ====================================================== */

// --- 1. Force Page Visibility ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

const GEMINI_API_KEY = ""; // Yahan API Key daalein

let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 2. HEADER & MENU ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

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

    // --- 3. PRICING / AURA PLANS TOGGLE (FIXED) ---
    // Yeh code wapas daal diya gaya hai taaki click karne par plans khulein
    const pricingHeaders = document.querySelectorAll(".pricing-card-header");
    pricingHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const card = header.closest(".pricing-card");
            if (card) {
                // Toggle current card
                card.classList.toggle("expanded");
                
                // Close other cards (Optional: agar ek baar me ek hi kholna ho)
                document.querySelectorAll(".pricing-card").forEach(otherCard => {
                    if (otherCard !== card) otherCard.classList.remove("expanded");
                });
            }
        });
    });

    // --- 4. LANGUAGE LOGIC ---
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
        langBtn.onclick = () => {
            const current = localStorage.getItem("language") === "hi" ? "en" : "hi";
            updateContent(current);
        };
    }
    updateContent(localStorage.getItem("language") || "en");

    // --- 5. THEME LOGIC ---
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

    // --- 6. TYPING EFFECT ---
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

    // ======================================================
    // HERO SEARCH (Local JSON + Detailed View)
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
                // Load both files safely
                const [boysRes, girlsRes] = await Promise.all([
                    fetch('bnames.json').then(res => res.ok ? res.json() : []),
                    fetch('gnames.json').then(res => res.ok ? res.json() : [])
                ]);

                // Flatten Data
                let allNames = [].concat(boysRes, girlsRes).flatMap(item => {
                    if (item.name) return item;
                    return Object.values(item).find(v => Array.isArray(v)) || [];
                });

                const foundPerson = allNames.find(n => n.name && n.name.toLowerCase() === nameToSearch);

                if (foundPerson) {
                    // Yahan saari details dikhayi jayengi
                    detailsBox.innerHTML = `
                        <h2>${foundPerson.name}</h2>
                        <p><strong>Meaning:</strong> ${foundPerson.meaning || 'N/A'}</p>
                        <p><strong>Gender:</strong> ${foundPerson.gender || 'Unknown'}</p>
                        <p><strong>Origin:</strong> ${foundPerson.origin || 'N/A'}</p>
                        <p><strong>Rashi (Zodiac):</strong> ${foundPerson.zodiac || 'N/A'}</p>
                        <p><strong>Nakshatra:</strong> ${foundPerson.nakshatra || 'N/A'}</p>
                        <p><strong>Numerology:</strong> ${foundPerson.numerology || 'N/A'}</p>
                        <p><strong>Horoscope:</strong> ${foundPerson.horoscope || 'N/A'}</p>
                    `;
                } else {
                    detailsBox.innerHTML = `
                        <h2>${nameToSearch}</h2>
                        <p>Sorry, name not found in our database.</p>
                        <button class="back-btn" onclick="location.reload()">Try Another</button>
                    `;
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

            const filtered = namesData.filter(n => 
                n.name && n.name.toUpperCase().startsWith(currentLetter)
            );
            
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
                    
                    // --- DETAILS UPDATE (Sab kuch dikhayega) ---
                    if(nameDetailsBox) {
                        nameDetailsBox.innerHTML = `
                            <h2>${person.name}</h2>
                            <p><strong>Meaning:</strong> ${person.meaning || 'N/A'}</p>
                            <p><strong>Gender:</strong> ${person.gender || currentGender}</p>
                            <p><strong>Origin:</strong> ${person.origin || 'N/A'}</p>
                            <p><strong>Rashi (Zodiac):</strong> ${person.zodiac || 'N/A'}</p>
                            <p><strong>Nakshatra:</strong> ${person.nakshatra || 'N/A'}</p>
                            <p><strong>Numerology:</strong> ${person.numerology || 'N/A'}</p>
                            <p><strong>Horoscope:</strong> ${person.horoscope || 'N/A'}</p>
                        `;
                    }
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

    // --- CHATBOT PLACEHOLDER ---
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
