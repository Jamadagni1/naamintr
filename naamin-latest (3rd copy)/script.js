const GEMINI_API_KEY = "AIzaSyDB6Rl4vSR_IfyNfgkLmTm8tKmZBeGXdJk";

async function handleHeroSearch() {
    const heroInput = document.getElementById('hero-search-input');
    if (!heroInput) return;
    const nameToSearch = heroInput.value.trim();
    if (!nameToSearch) return;

    const nameFinderSection = document.getElementById('name-finder');
    const nameDetailsContainer = nameFinderSection.querySelector('.name-details-container');
    const nameListContainer = nameFinderSection.querySelector('.name-list-container');
    const nameDetails = nameFinderSection.querySelector('.name-details');

    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0; // हेडर की ऊंचाई पता करें
    const elementPosition = nameDetailsContainer.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - 20; // 20px का अतिरिक्त गैप

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    nameListContainer.style.display = 'none';
    nameDetailsContainer.style.display = 'block';
    nameDetails.innerHTML = '<div class="spinner"></div>';

    const lang = document.documentElement.lang === 'hi' ? 'Hindi' : 'English';
    const prompt = `Provide a short, beautiful, and meaningful description for the Indian Hindu name '${nameToSearch}'. Also, provide the name in Devanagari script. Respond in ${lang}.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error("API request failed");

        const result = await response.json();
        const detailsText = result.candidates[0].content.parts[0].text;

        nameDetails.innerHTML = `
            <h2>${nameToSearch}</h2>
            <p>${detailsText.replace(/\n/g, "<br>")}</p>
        `;
    } catch (error) {
        console.error("Error fetching hero search details:", error);
        nameDetails.innerHTML = `<h2>${nameToSearch}</h2><p>Sorry, could not fetch details for this name.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // --- NEW: Header adjustment logic to prevent content from hiding ---
    function adjustContentForFixedHeader() {
        const header = document.querySelector('header');
        // Hum body ko target karenge taaki saara content neeche shift ho jaaye. Yeh sabse aasaan tareeka hai.
        if (header) {
            const headerHeight = header.offsetHeight;
            document.body.style.paddingTop = `${headerHeight}px`;
        }
    }

    // Page load hone par layout adjust karein
    adjustContentForFixedHeader();
    // Window resize hone par (jaise mobile orientation change) layout adjust karein
    window.addEventListener('resize', adjustContentForFixedHeader);


    let currentCategory = null;
    let isChatboxHovered = false;

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

    function setTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        const themeToggle = document.getElementById("theme-toggle");
        if (themeToggle) {
            themeToggle.innerHTML = theme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    function updateContent(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem("language", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
            const text = el.getAttribute(lang === "hi" ? "data-hi" : "data-en");
            if (text) {
                const span = el.querySelector("span:not(.header-naam):not(.header-in):not(.btn-text)");
                const btnText = el.querySelector(".btn-text");
                if (btnText) {
                    btnText.textContent = text;
                } else if (span) {
                    span.textContent = text;
                } else if (!el.querySelector("i")) {
                    el.innerHTML = text;
                }
            }
        });
        const userInput = document.getElementById("userInput");
        if (userInput) {
            userInput.placeholder = lang === "hi" ? "यहाँ अपना सवाल पूछें..." : "Ask your question here...";
        }
        const whatsappBtn = document.querySelector('.whatsapp-float');
        if (whatsappBtn) {
            const textSpan = whatsappBtn.querySelector('span');
            if (textSpan) {
                textSpan.textContent = whatsappBtn.getAttribute(lang === 'hi' ? 'data-hi' : 'data-en');
            }
        }
    }

    function appendMessage(sender, text, shouldScroll = true) {
        const box = document.getElementById("chatbox");
        if (!box) return;
        const msg = document.createElement("div");
        msg.className = `message ${sender}`;
        msg.innerHTML = text.replace(/\n/g, "<br>");
        box.appendChild(msg);

        if (shouldScroll && !isChatboxHovered) {
            box.scrollTop = box.scrollHeight;
        }
    }

    function selectCategory(cat) {
        const menuButtons = document.getElementById("menuButtons");
        const contextualButtons = document.getElementById("contextualButtons");

        if (menuButtons) menuButtons.style.display = "none";
        if (contextualButtons) contextualButtons.style.display = "flex";

        // --- NEW: Purane bot message (jaise welcome message) ko clear karein ---
        const chatbox = document.getElementById("chatbox");
        if (chatbox) {
            const lastBotMessage = chatbox.querySelector('.message.bot:last-child');
            if (lastBotMessage) {
                lastBotMessage.remove();
            }
        }

        currentCategory = cat;
        const lang = document.documentElement.lang;
        const messages = {
            en: {
                name_analysis: "Enter the name to analyze.",
                baby: "For whom should I suggest a name? (e.g., 'baby boy, calm nature')",
                brand: "What does your company do?",
                motto: "What is your brand's core value?",
                astrology: "Enter your Zodiac Sign."
            },
            hi: {
                name_analysis: "विश्लेषण के लिए नाम दर्ज करें।",
                baby: "मुझे किसके लिए नाम सुझाना चाहिए? (जैसे, 'लड़का, शांत स्वभाव')",
                brand: "आपकी कंपनी क्या करती है?",
                motto: "आपके ब्रांड का मूल मूल्य क्या है?",
                astrology: "अपनी राशि दर्ज करें।"
            }
        };
        appendMessage("bot", messages[lang][cat] || "How can I assist?");
        document.getElementById('userInput')?.focus();
    }

    function resetChat() {
        const chatbox = document.getElementById("chatbox");
        const menuButtons = document.getElementById("menuButtons");
        const contextualButtons = document.getElementById("contextualButtons");

        if (menuButtons) menuButtons.style.display = "grid";
        if (contextualButtons) contextualButtons.style.display = "none";
        if (!chatbox) return;

        currentCategory = null;
        const lang = document.documentElement.lang;
        chatbox.innerHTML = '';
        const welcomeMessage = lang === "en" ? "🙏 Welcome! What would you like to explore?" : "🙏 स्वागत है! आप क्या खोजना चाहेंगे?";

        appendMessage("bot", welcomeMessage, false);
    }

    async function sendMessage() {
        const input = document.getElementById("userInput");
        const sendBtn = document.getElementById("sendBtn");
        if (!input || !sendBtn) return;

        const userText = input.value.trim();
        if (!userText) return;

        const chatbox = document.getElementById("chatbox");
        if (chatbox) {
            // Purana bot response hatao
            const lastBotMessage = chatbox.querySelector('.message.bot:last-child');
            if (lastBotMessage && !lastBotMessage.querySelector('.spinner')) {
                lastBotMessage.remove();
            }
            // Purana user input bhi hatao
            const lastUserMessage = chatbox.querySelector('.message.user:last-child');
            if (lastUserMessage) {
                lastUserMessage.remove();
            }
        }

        appendMessage("user", userText);
        input.value = "";
        input.disabled = true;
        sendBtn.disabled = true;
        const lang = document.documentElement.lang;
        appendMessage("bot", '<div class="spinner"></div>');

        try {
            if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_GEMINI_API_KEY")) {
                throw new Error("API Key not configured. Please contact the administrator.");
            }

            let prompt;
            const englishPrompt = `You are 'Naamin', a wise, eloquent, and concise expert in Sanskrit and Vedic wisdom. Your answers are always direct, insightful, and beautifully formatted. Respond in English.`;
            const hindiPrompt = `आप 'नामिन' हैं, संस्कृत और वैदिक ज्ञान के एक ज्ञानी, वाक्पटु और संक्षिप्त विशेषज्ञ हैं। आपके उत्तर हमेशा सीधे, व्यावहारिक और खूबसूरती से स्वरूपित होते हैं। हिंदी में जवाब दें।`;
            const basePrompt = lang === 'hi' ? hindiPrompt : englishPrompt;

            if (!currentCategory) {
                prompt = `${basePrompt} The user has not selected a specific category. Answer their general query concisely: "${userText}"`;
            } else {
                switch (currentCategory) {
                    case 'name_analysis':
                        prompt = `${basePrompt} Provide a deep but concise name analysis for **"${userText}"** in exactly 3 short, numbered points:\n1. **Meaning & Origin:** (Literal meaning and its roots.)\n2. **Energetic Vibration:** (Associated qualities, numerology, or astrological traits.)\n3. **Recommendation:** (Who this name is best suited for.)`;
                        break;
                    case 'baby':
                        prompt = `${basePrompt} Suggest FIVE beautiful, meaningful, and modern-sounding Sanskrit baby names based on the user's request: **"${userText}"**. For each name, provide its meaning and a short, inspiring description. Format it clearly in a numbered list.`;
                        break;
                    case 'brand':
                        prompt = `${basePrompt} For a business described as **"${userText}"**, suggest FIVE powerful, memorable, and easy-to-pronounce Sanskrit brand names. For each name, format it like this:\n**Brand Name:**\n- **Meaning:** [Direct translation]\n- **Branding Rationale:** [Why it's a strong choice for the brand's identity and audience.]`;
                        break;
                    case 'motto':
                        prompt = `${basePrompt} For a brand with the value of **"${userText}"**, create FIVE inspiring and short Sanskrit mottos. For each, format it like this:\n**Motto:** [Motto in Devanagari] ([Roman transliteration])\n- **Meaning:** [Literal translation]\n- **Core Philosophy:** [Briefly explain the deep wisdom behind it.]`;
                        break;
                    case 'astrology':
                        prompt = `${basePrompt} Provide an encouraging and insightful monthly horoscope for the zodiac sign **"${userText}"**. Keep it concise and positive. Structure the response with short paragraphs for each section:\n**Career:**\n**Finance:**\n**Health:**\n**Lucky Color & Number:**`;
                        break;
                    default:
                        prompt = `${basePrompt} Answer the following user query: "${userText}"`;
                }
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const spinner = chatbox.querySelector(".spinner");
            if (spinner) { spinner.parentElement.remove(); }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `API Error: ${response.status}`);
            }
            const result = await response.json();
            const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
            appendMessage("bot", botResponse);

        } catch (error) {
            console.error("Chatbot Error:", error);
            const chatbox = document.getElementById("chatbox");
            const spinner = chatbox.querySelector(".spinner");
            if (spinner) { spinner.parentElement.remove(); }
            appendMessage("bot", lang === "hi" ? `एक त्रुटि हुई: ${error.message}` : `An error occurred: ${error.message}`);
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            if (window.innerWidth > 768) {
                input.focus();
            }
        }
    }

    const preferredTheme = localStorage.getItem("theme") || "light";
    setTheme(preferredTheme);
    const preferredLang = localStorage.getItem("language") || "hi";
    updateContent(preferredLang);
    document.body.style.visibility = 'visible';

    const hamburgerBtn = document.getElementById("hamburger-menu");
    const mainNav = document.getElementById("main-nav");
    if (hamburgerBtn && mainNav) {
        const toggleNav = () => { hamburgerBtn.classList.toggle("active"); mainNav.classList.toggle("active"); };
        hamburgerBtn.addEventListener("click", e => { e.stopPropagation(); toggleNav(); });
        mainNav.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => { if (mainNav.classList.contains("active")) toggleNav(); });
        });
        document.addEventListener("click", e => {
            if (mainNav.classList.contains("active") && !mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                toggleNav();
            }
        });
    }

    document.getElementById("theme-toggle")?.addEventListener("click", () => setTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"));

    document.getElementById("language-toggle")?.addEventListener("click", () => {
        const newLang = document.documentElement.lang === "hi" ? "en" : "hi";
        updateContent(newLang);
        if (document.getElementById("chatbox")) {
            resetChat();
        }
    });

    const heroSearchBtn = document.getElementById('hero-search-btn');
    const heroSearchInput = document.getElementById('hero-search-input');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', handleHeroSearch);
    }
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleHeroSearch();
            }
        });
    }

    const navLinks = document.querySelectorAll(".nav-links a.nav-items");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute("href").split("/").pop().split("#")[0];
        if (linkPage === currentPage || (currentPage === "index.html" && (linkPage === "" || linkPage === "index.html"))) {
            link.classList.add("active");
        }
    });

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll("section").forEach(section => sectionObserver.observe(section));

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => scrollToTopBtn.classList.toggle("show", window.scrollY > 300));
        scrollToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    if (document.getElementById("chatbox")) {
        document.getElementById("sendBtn")?.addEventListener("click", sendMessage);
        document.getElementById("userInput")?.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });
        document.querySelectorAll('#menuButtons button').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                selectCategory(category);
            });
        });
        document.getElementById("resetChatBtn")?.addEventListener("click", resetChat);
        resetChat();
    }

    document.querySelectorAll(".pricing-card-header").forEach(header => {
        header.addEventListener("click", () => {
            const card = header.closest(".pricing-card");
            card.classList.toggle("expanded");
            document.querySelectorAll(".pricing-card").forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove("expanded");
                }
            });
        });
    });

    document.querySelectorAll(".faq-item").forEach(item => {
        item.addEventListener("toggle", () => {
            if (item.open) {
                document.querySelectorAll('.faq-item[open]').forEach(openItem => {
                    if (openItem !== item) openItem.open = false;
                });
            }
        });
    });

    if (document.getElementById("naamin-main-title-typing")) typeMainTitle();
});

if (document.getElementById("name-finder")) {
    const genderSelector = document.querySelector(".gender-selector");
    const alphabetSelector = document.querySelector(".alphabet-selector");
    const nameListContainer = document.querySelector(".name-list-container");
    const nameList = document.querySelector(".name-list");
    const nameDetailsContainer = document.querySelector(".name-details-container");
    const nameDetails = document.querySelector(".name-details");
    const backBtn = document.querySelector(".back-btn");

    let selectedGender = "Boy";
    let selectedLetter = "A";

    function renderAlphabet() {
        alphabetSelector.innerHTML = "";
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement("button");
            button.className = "alphabet-btn";
            button.textContent = letter;
            if (letter === selectedLetter) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => {
                selectedLetter = letter;
                renderAlphabet();
                fetchAndRenderNames();
            });
            alphabetSelector.appendChild(button);
        }
    }

    async function fetchAndRenderNames() {
        nameList.innerHTML = '<div class="spinner"></div>';

        const lang = document.documentElement.lang === 'hi' ? 'Hindi' : 'English';
        const genderText = selectedGender === 'Boy' ? (lang === 'Hindi' ? 'लड़कों' : 'boys') : (lang === 'Hindi' ? 'लड़कियों' : 'girls');

        const prompt = `Suggest 15 modern and meaningful Indian Hindu names for ${genderText} starting with the letter '${selectedLetter}'. For each name, provide it in this exact format: RomanName (DevanagariName). The final output must be a single comma-separated list. For example: Aarav (आरव), Arjun (अर्जुन), Advik (अद्विक)`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) throw new Error("API request failed");

            const result = await response.json();
            const namesText = result.candidates[0].content.parts[0].text;
            const namesArray = namesText.split(',').map(name => name.trim());

            nameList.innerHTML = "";
            if (namesArray.length === 0 || namesArray[0] === "") {
                nameList.innerHTML = `<p>No names found for this letter.</p>`;
                return;
            }

            namesArray.forEach(name => {
                if (name) {
                    const nameDiv = document.createElement("div");
                    nameDiv.className = "name-item";
                    nameDiv.textContent = name;
                    nameDiv.addEventListener("click", () => fetchAndShowNameDetails(name));
                    nameList.appendChild(nameDiv);
                }
            });
        } catch (error) {
            console.error("Error fetching names:", error);
            nameList.innerHTML = `<p>Sorry, could not fetch names. Please try again.</p>`;
        }
    }

    async function fetchAndShowNameDetails(name) {
        nameListContainer.style.display = "none";
        nameDetailsContainer.style.display = "block";
        nameDetails.innerHTML = '<div class="spinner"></div>';

        const romanName = name.split('(')[0].trim();
        const lang = document.documentElement.lang === 'hi' ? 'Hindi' : 'English';
        const prompt = `Provide a short, beautiful, and meaningful description for the Indian Hindu name '${romanName}'. Respond in ${lang}.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error("API request failed");

            const result = await response.json();
            const detailsText = result.candidates[0].content.parts[0].text;

            nameDetails.innerHTML = `
                <h2>${name}</h2>
                <p>${detailsText.replace(/\n/g, "<br>")}</p>
            `;
        } catch (error) {
            console.error("Error fetching details:", error);
            nameDetails.innerHTML = `<h2>${name}</h2><p>Sorry, could not fetch details for this name.</p>`;
        }
    }

    backBtn.addEventListener("click", () => {
        nameListContainer.style.display = "block";
        nameDetailsContainer.style.display = "none";
    });

    genderSelector.querySelectorAll(".gender-btn").forEach(button => {
        button.addEventListener("click", () => {
            genderSelector.querySelector(".active").classList.remove("active");
            button.classList.add("active");
            selectedGender = button.dataset.gender;
            fetchAndRenderNames();
        });
    });

    renderAlphabet();
    fetchAndRenderNames();
}

/* =========================================
   NAAMIN NAME FINDER LOGIC (A-Z & Details)
   ========================================= */

// 1. Data Store: Yahan apne A se Z tak naam add karte rahein
const namesData = [
    // --- LADPKE (BOY) ---
    { name: "Aarav", gender: "Boy", meaning: "Peaceful", rashi: "Mesh (Aries)", origin: "Sanskrit" },
    { name: "Advik", gender: "Boy", meaning: "Unique", rashi: "Mesh (Aries)", origin: "Sanskrit" },
    { name: "Bhavya", gender: "Boy", meaning: "Grand, Splendid", rashi: "Dhanu (Sagittarius)", origin: "Sanskrit" },
    { name: "Chirag", gender: "Boy", meaning: "Lamp, Light", rashi: "Meen (Pisces)", origin: "Hindi" },
    { name: "Darsh", gender: "Boy", meaning: "Sight, Vision", rashi: "Meen (Pisces)", origin: "Sanskrit" },
    
    // --- LADKI (GIRL) ---
    { name: "Aadya", gender: "Girl", meaning: "The First, Mother Earth", rashi: "Mesh (Aries)", origin: "Sanskrit" },
    { name: "Bhumika", gender: "Girl", meaning: "Earth, Role", rashi: "Dhanu (Sagittarius)", origin: "Hindi" },
    { name: "Chhaya", gender: "Girl", meaning: "Shadow", rashi: "Mithun (Gemini)", origin: "Hindi" },
    { name: "Diya", gender: "Girl", meaning: "Lamp", rashi: "Meen (Pisces)", origin: "Hindi" },
    // Aur naam yahan add karein...
];

// 2. HTML Elements ko select karna
const alphabetContainer = document.querySelector('.alphabet-selector');
const nameListContainer = document.querySelector('.name-list');
const nameDetailsContainer = document.querySelector('.name-details-container');
const nameDetailsBox = document.querySelector('.name-details');
const listSection = document.querySelector('.name-list-container');
const backBtn = document.querySelector('.back-btn');
const genderBtns = document.querySelectorAll('.gender-btn');

let currentGender = "Boy"; // Default shuruwat Ladke se hogi
let currentLetter = "A";   // Default shuruwat A se hogi

// 3. A se Z tak Buttons Banana
function generateAlphabet() {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    if(alphabetContainer) {
        alphabetContainer.innerHTML = ""; // Purana clear karein
        alphabets.forEach(letter => {
            const btn = document.createElement("button");
            btn.textContent = letter;
            btn.classList.add("alphabet-btn"); // CSS class
            if (letter === currentLetter) btn.classList.add("active");

            // Button click hone par kya hoga
            btn.addEventListener("click", () => {
                document.querySelectorAll(".alphabet-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentLetter = letter;
                renderNames(); // List update karein
            });

            alphabetContainer.appendChild(btn);
        });
    }
}

// 4. Naam ki List Show Karna
function renderNames() {
    if(!nameListContainer) return;
    
    nameListContainer.innerHTML = ""; // List clear karein
    listSection.style.display = "block"; // List dikhayein
    nameDetailsContainer.style.display = "none"; // Details chupayein

    // Filter: Gender aur Letter ke hisaab se
    const filteredNames = namesData.filter(n => 
        n.gender === currentGender && n.name.startsWith(currentLetter)
    );

    if (filteredNames.length === 0) {
        nameListContainer.innerHTML = `<p style="grid-column: 1/-1;">No names found starting with ${currentLetter}</p>`;
        return;
    }

    filteredNames.forEach(person => {
        const div = document.createElement("div");
        div.classList.add("name-item"); // CSS class
        div.textContent = person.name;
        
        // Naam par click karne par details dikhana
        div.addEventListener("click", () => showDetails(person));
        
        nameListContainer.appendChild(div);
    });
}

// 5. Details Show Karna
function showDetails(person) {
    listSection.style.display = "none"; // List chupayein
    nameDetailsContainer.style.display = "block"; // Details dikhayein

    // Details ka HTML banana
    nameDetailsBox.innerHTML = `
        <h2>${person.name}</h2>
        <p><strong>Meaning:</strong> ${person.meaning}</p>
        <p><strong>Rashi:</strong> ${person.rashi}</p>
        <p><strong>Origin:</strong> ${person.origin}</p>
    `;
}

// 6. Back Button ka Logic
if(backBtn) {
    backBtn.addEventListener("click", () => {
        nameDetailsContainer.style.display = "none";
        listSection.style.display = "block";
    });
}

// 7. Gender Button (Boy/Girl) Toggle
genderBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        genderBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentGender = btn.getAttribute("data-gender");
        renderNames(); // List refresh karein
    });
});

// Shuruat mein run karein
document.addEventListener('DOMContentLoaded', () => {
    generateAlphabet();
    renderNames();
});
