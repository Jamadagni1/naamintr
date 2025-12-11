/* ======================================================
   SCRIPT.JS - COMPLETE FIX (Text, Buttons & Search)
   ====================================================== */

// --- 1. Force Page Visibility (Safety) ---
document.body.style.visibility = "visible";
document.body.style.opacity = "1";

let namesData = []; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 2. TEXT & LANGUAGE FIX (Problems 1 & 2 Solved) ---
    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        
        // Sabhi elements jinke paas data-en hai, unhe dhoondo
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            
            if (text) {
                // Agar element button hai ya heading hai, toh seedha text badal do
                // Yeh logic Buttons aur Headings ko wapas le aayega
                el.textContent = text;
            }
        });

        // Search Placeholder update
        const heroInput = document.getElementById("hero-search-input");
        if(heroInput) {
            heroInput.placeholder = lang === "hi" ? "उदा: आरव, अद्विक..." : "e.g., Aarav, Advik...";
        }
    }

    // Language Toggle Logic
    const langBtn = document.getElementById("language-toggle");
    if(langBtn) {
        langBtn.onclick = () => {
            const current = localStorage.getItem("language") === "hi" ? "en" : "hi";
            updateContent(current);
        };
    }

    // Load Default Language
    updateContent(localStorage.getItem("language") || "en");


    // --- 3. HERO SEARCH - LOCAL JSON VERSION (Problem 3 Solved) ---
    async function handleHeroSearch() {
        const heroInput = document.getElementById('hero-search-input');
        if (!heroInput || !heroInput.value.trim()) return;
        const nameToSearch = heroInput.value.trim().toLowerCase();

        const nameFinderSection = document.getElementById('name-finder');
        const detailsBox = document.querySelector('.name-details');
        const detailsContainer = document.querySelector('.name-details-container');
        const listContainer = document.querySelector('.name-list-container');

        if (nameFinderSection) {
            // Scroll to section
            const header = document.querySelector('header');
            window.scrollTo({ top: nameFinderSection.offsetTop - (header ? header.offsetHeight : 0), behavior: 'smooth' });

            // UI Show Loading
            if(listContainer) listContainer.style.display = 'none';
            if(detailsContainer) detailsContainer.style.display = 'block';
            if(detailsBox) detailsBox.innerHTML = '<div class="spinner">Searching Database...</div>';

            try {
                // Dono files (Boy & Girl) load karein
                const [boysRes, girlsRes] = await Promise.all([
                    fetch('bnames.json'),
                    fetch('gnames.json')
                ]);

                const boysData = await boysRes.json();
                const girlsData = await girlsRes.json();

                // Dono lists ko milayein (Safe Checks ke sath)
                let allNames = [];
                if(Array.isArray(boysData)) allNames = allNames.concat(boysData);
                if(Array.isArray(girlsData)) allNames = allNames.concat(girlsData);

                // Naam dhoondein
                const foundPerson = allNames.find(n => n.name.toLowerCase() === nameToSearch);

                if (foundPerson) {
                    detailsBox.innerHTML = `
                        <h2>${foundPerson.name}</h2>
                        <p><strong>Meaning:</strong> ${foundPerson.meaning}</p>
                        <p><strong>Gender:</strong> ${foundPerson.gender || 'Unknown'}</p>
                        <p><strong>Rashi:</strong> ${foundPerson.zodiac || 'N/A'}</p>
                        <p><strong>Horoscope:</strong> ${foundPerson.horoscope || 'N/A'}</p>
                        <p><strong>Origin:</strong> ${foundPerson.origin || 'N/A'}</p>
                    `;
                } else {
                    detailsBox.innerHTML = `
                        <h2>${nameToSearch}</h2>
                        <p>Sorry, this name is not in our database yet.</p>
                        <button class="back-btn" onclick="location.reload()">Try Another</button>
                    `;
                }

            } catch(e) {
                console.error(e);
                detailsBox.innerHTML = `<p>Error searching data. Check JSON files.</p>`;
            }
        }
    }

    const heroBtn = document.getElementById('hero-search-btn');
    const heroInp = document.getElementById('hero-search-input');
    if(heroBtn) heroBtn.onclick = handleHeroSearch;
    if(heroInp) heroInp.onkeypress = (e) => { if(e.key === "Enter") handleHeroSearch(); };


    // --- 4. TYPING EFFECT (Styling) ---
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

    // --- 5. THEME & MENU ---
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

    // --- 6. HEADER PADDING ---
    const header = document.querySelector('header');
    if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;


    // ======================================================
    // NAME FINDER LOGIC (A-Z Section)
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

        // Load Names Function
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

        // Render A-Z
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

        // Render List
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
});
