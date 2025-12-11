const GEMINI_API_KEY = ""; // Agar Chatbot use karna hai to yahan API Key daalein

/* =========================================
   DATA STORE: JSON FILE SE DATA AAYEGA
   ========================================= */
let namesData = []; // Khali array, data fetch hone ke baad bharega

/* =========================================
   HERO SEARCH FUNCTIONALITY (Uses API)
   ========================================= */
async function handleHeroSearch() {
    const heroInput = document.getElementById('hero-search-input');
    if (!heroInput) return;
    const nameToSearch = heroInput.value.trim();
    if (!nameToSearch) return;

    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = nameFinderSection.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
}

/* =========================================
   MAIN DOM CONTENT LOADED
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Header Adjustment
    function adjustContentForFixedHeader() {
        const header = document.querySelector('header');
        if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;
    }
    adjustContentForFixedHeader();
    window.addEventListener('resize', adjustContentForFixedHeader);

    // 2. Typing Effect (Hero Title)
    function typeMainTitle() {
        const element = document.getElementById("naamin-main-title-typing");
        if (!element) return;
        const mainTitleText = "Naamin";
        let charIndex = 0;
        (function type() {
            let currentText = mainTitleText.substring(0, charIndex++);
            element.innerHTML = `<span class="naamin-naam">${currentText.substring(0, 4)}</span><span class="naamin-in">${currentText.substring(4)}</span>`;
            if (charIndex > mainTitleText.length) {
                setTimeout(() => { charIndex = 0; type(); }, 3000);
            } else { setTimeout(type, 150); }
        })();
    }
    typeMainTitle();

    // 3. Theme & Language Handling
    function setTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        const themeToggle = document.getElementById("theme-toggle");
        if (themeToggle) themeToggle.innerHTML = theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) {
                const span = el.querySelector("span:not(.header-naam):not(.header-in):not(.btn-text)");
                const btnText = el.querySelector(".btn-text");
                if (btnText) btnText.textContent = text;
                else if (span) span.textContent = text;
                else if (!el.querySelector("i")) el.innerHTML = text;
            }
        });
    }

    const preferredTheme = localStorage.getItem("theme") || "light";
    setTheme(preferredTheme);
    const preferredLang = localStorage.getItem("language") || "hi";
    updateContent(preferredLang);
    document.body.style.visibility = 'visible';

    document.getElementById("theme-toggle")?.addEventListener("click", () => setTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"));
    document.getElementById("language-toggle")?.addEventListener("click", () => {
        const newLang = document.documentElement.lang === "hi" ? "en" : "hi";
        updateContent(newLang);
    });

    // 4. Mobile Navigation (Hamburger)
    const hamburgerBtn = document.getElementById("hamburger-menu");
    const mainNav = document.getElementById("main-nav");
    if (hamburgerBtn && mainNav) {
        const toggleNav = () => { hamburgerBtn.classList.toggle("active"); mainNav.classList.toggle("active"); };
        hamburgerBtn.addEventListener("click", e => { e.stopPropagation(); toggleNav(); });
        document.addEventListener("click", e => {
            if (mainNav.classList.contains("active") && !mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) toggleNav();
        });
    }

    // 5. Search Listeners
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const heroSearchInput = document.getElementById('hero-search-input');
    if (heroSearchBtn) heroSearchBtn.addEventListener('click', handleHeroSearch);
    if (heroSearchInput) heroSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleHeroSearch(); });

    // 6. Animations
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll("section").forEach(section => sectionObserver.observe(section));

    // 7. Scroll to Top
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => scrollToTopBtn.classList.toggle("show", window.scrollY > 300));
        scrollToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // 8. FAQ Toggles
    document.querySelectorAll(".faq-item").forEach(item => {
        item.addEventListener("toggle", () => {
            if (item.open) {
                document.querySelectorAll('.faq-item[open]').forEach(openItem => { if (openItem !== item) openItem.open = false; });
            }
        });
    });

    /* =========================================
       NAME FINDER LOGIC (JSON DATA FETCH)
       ========================================= */
    const nameFinderSection = document.getElementById('name-finder');
    if (nameFinderSection) {
        const alphabetContainer = document.querySelector('.alphabet-selector');
        const nameListContainer = document.querySelector('.name-list');
        const nameDetailsContainer = document.querySelector('.name-details-container');
        const nameDetailsBox = document.querySelector('.name-details');
        const listSection = document.querySelector('.name-list-container');
        const backBtn = document.querySelector('.back-btn');
        const genderBtns = document.querySelectorAll('.gender-btn');
        
        let currentGender = "Boy";
        let currentLetter = "A";

        // JSON Load Function
        async function loadNames() {
            try {
                // 'names.json' se data mangwaya ja raha hai
                const response = await fetch('names.json'); 
                if (!response.ok) throw new Error("File nahi mili");
                namesData = await response.json(); // Data variable me save hua
                
                generateAlphabet(); // Ab buttons banao
                renderNames(); // Ab list dikhao
            } catch (error) {
                console.error("Error loading names:", error);
                if(nameListContainer) nameListContainer.innerHTML = "<p>Data load nahi ho paya. Please check names.json file.</p>";
            }
        }

        function generateAlphabet() {
            const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            if (alphabetContainer) {
                alphabetContainer.innerHTML = "";
                alphabets.forEach(letter => {
                    const btn = document.createElement("button");
                    btn.textContent = letter;
                    btn.classList.add("alphabet-btn");
                    if (letter === currentLetter) btn.classList.add("active");

                    btn.addEventListener("click", () => {
                        document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        currentLetter = letter;
                        renderNames();
                    });
                    alphabetContainer.appendChild(btn);
                });
            }
        }

        function renderNames() {
            if (!nameListContainer) return;
            nameListContainer.innerHTML = "";
            listSection.style.display = "block";
            nameDetailsContainer.style.display = "none";

            const filteredNames = namesData.filter(n => 
                n.gender === currentGender && n.name.startsWith(currentLetter)
            );

            if (filteredNames.length === 0) {
                nameListContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">No names found starting with ${currentLetter}</p>`;
                return;
            }

            filteredNames.forEach(person => {
                const div = document.createElement("div");
                div.classList.add("name-item");
                div.textContent = person.name;
                div.addEventListener("click", () => showDetails(person));
                nameListContainer.appendChild(div);
            });
        }

        function showDetails(person) {
            listSection.style.display = "none";
            nameDetailsContainer.style.display = "block";
            
            nameDetailsBox.innerHTML = `
                <div class="name-card">
                    <h2>${person.name}</h2>
                    <p><strong>Meaning:</strong> ${person.meaning}</p>
                    <p><strong>Rashi:</strong> ${person.rashi}</p>
                    <p><strong>Origin:</strong> ${person.origin}</p>
                </div>
            `;
        }

        if (backBtn) {
            backBtn.addEventListener("click", () => {
                nameDetailsContainer.style.display = "none";
                listSection.style.display = "block";
            });
        }

        genderBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                genderBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentGender = btn.getAttribute("data-gender");
                renderNames();
            });
        });

        // Start Loading Data from JSON
        loadNames();
    }

    /* =========================================
       CHATBOT LOGIC (Basic UI)
       ========================================= */
    if (document.getElementById("chatbox")) {
        const sendBtn = document.getElementById("sendBtn");
        const userInput = document.getElementById("userInput");
        
        async function sendMessage() {
            const text = userInput.value.trim();
            if(!text) return;
            
            const chatbox = document.getElementById("chatbox");
            const userMsg = document.createElement("div");
            userMsg.className = "message user";
            userMsg.textContent = text;
            chatbox.appendChild(userMsg);
            
            userInput.value = "";
            
            const botMsg = document.createElement("div");
            botMsg.className = "message bot";
            if(GEMINI_API_KEY === "") {
                botMsg.textContent = "Please configure the Gemini API Key in script.js to chat.";
            } else {
                botMsg.textContent = "Processing..."; 
            }
            chatbox.appendChild(botMsg);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        if(sendBtn) sendBtn.addEventListener("click", sendMessage);
        if(userInput) userInput.addEventListener("keypress", (e) => { if(e.key==="Enter") sendMessage(); });
    }
});
