class AstroEngine {
    constructor() {
        // 1. अंक ज्योतिष मैपिंग (Chaldean Method)
        this.numerologyMap = {
            'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
            'B': 2, 'K': 2, 'R': 2,
            'C': 3, 'G': 3, 'L': 3, 'S': 3,
            'D': 4, 'M': 4, 'T': 4,
            'E': 5, 'H': 5, 'N': 5, 'X': 5,
            'U': 6, 'V': 6, 'W': 6,
            'O': 7, 'Z': 7,
            'F': 8, 'P': 8
        };

        // 2. राशि और नक्षत्र मैपिंग (Avakahada Chakra Sounds)
        this.rashiMap = [
            {
                rashi: "मेष (Aries)",
                letters: ["chu", "che", "cho", "la", "li", "lu", "le", "lo", "a"],
                nakshatras: ["Ashwini", "Bharani", "Krittika (1)"],
                phal: "साहसी, ऊर्जावान और नेतृत्व करने वाला।"
            },
            {
                rashi: "वृषभ (Taurus)",
                letters: ["i", "ee", "u", "oo", "e", "o", "va", "vi", "vu", "ve", "vo"],
                nakshatras: ["Krittika (2-4)", "Rohini", "Mrigashira (1-2)"],
                phal: "शांत, विश्वसनीय और कला प्रेमी।"
            },
            {
                rashi: "मिथुन (Gemini)",
                letters: ["ka", "ki", "ku", "gh", "ng", "ch", "ke", "ko", "ha"],
                nakshatras: ["Mrigashira (3-4)", "Ardra", "Punarvasu (1-3)"],
                phal: "बुद्धिमान, वाचाल और बहुमुखी प्रतिभा वाला।"
            },
            {
                rashi: "कर्क (Cancer)",
                letters: ["hi", "hu", "he", "ho", "da", "di", "du", "de", "do"],
                nakshatras: ["Punarvasu (4)", "Pushya", "Ashlesha"],
                phal: "भावुक, संवेदनशील और परिवार प्रेमी।"
            },
            {
                rashi: "सिंह (Leo)",
                letters: ["ma", "mi", "mu", "me", "mo", "ta", "ti", "tu", "te"],
                nakshatras: ["Magha", "Purva Phalguni", "Uttara Phalguni (1)"],
                phal: "आत्मविश्वासी, उदार और राजा जैसा स्वभाव।"
            },
            {
                rashi: "कन्या (Virgo)",
                letters: ["to", "pa", "pi", "pu", "sha", "na", "th", "pe", "po"],
                nakshatras: ["Uttara Phalguni (2-4)", "Hasta", "Chitra (1-2)"],
                phal: "विश्लेषण करने वाला, व्यावहारिक और मेहनती।"
            },
            {
                rashi: "तुला (Libra)",
                letters: ["ra", "ri", "ru", "re", "ro", "ta", "ti", "tu", "te"], 
                nakshatras: ["Chitra (3-4)", "Swati", "Vishakha (1-3)"],
                phal: "न्यायप्रिय, संतुलित और मिलनसार।"
            },
            {
                rashi: "वृश्चिक (Scorpio)",
                letters: ["to", "na", "ni", "nu", "ne", "no", "ya", "yi", "yu"],
                nakshatras: ["Vishakha (4)", "Anuradha", "Jyeshtha"],
                phal: "तीव्र, रहस्यमयी और दृढ़ निश्चय वाला।"
            },
            {
                rashi: "धनु (Sagittarius)",
                letters: ["ye", "yo", "bha", "bhi", "bhu", "dha", "pha", "dha", "bhe"],
                nakshatras: ["Mula", "Purva Ashadha", "Uttara Ashadha (1)"],
                phal: "आशावादी, दार्शनिक और स्वतंत्र।"
            },
            {
                rashi: "मकर (Capricorn)",
                letters: ["bho", "ja", "ji", "ju", "je", "jo", "kha", "ga", "gi"],
                nakshatras: ["Uttara Ashadha (2-4)", "Shravana", "Dhanishtha (1-2)"],
                phal: "महत्वाकांक्षी, अनुशासित और धैर्यवान।"
            },
            {
                rashi: "कुम्भ (Aquarius)",
                letters: ["gu", "ge", "go", "sa", "si", "su", "se", "so", "da"],
                nakshatras: ["Dhanishtha (3-4)", "Shatabhisha", "Purva Bhadrapada (1-3)"],
                phal: "नवीन सोच वाला, मानवीय और मित्रवत।"
            },
            {
                rashi: "मीन (Pisces)",
                letters: ["di", "du", "th", "jha", "yna", "de", "do", "cha", "chi"],
                nakshatras: ["Purva Bhadrapada (4)", "Uttara Bhadrapada", "Revati"],
                phal: "दयालु, आध्यात्मिक और कल्पनाशील।"
            }
        ];

        // 3. (NEW) सम्पूर्ण ज्योतिष फल (ग्रह, रंग और दिन)
        this.astroDetails = {
            1: { planet: "सूर्य (Sun)", color: "सुनहरा, नारंगी (Golden, Orange)", day: "रविवार (Sunday)", trait: "नेतृत्व क्षमता" },
            2: { planet: "चन्द्र (Moon)", color: "सफेद, सिल्वर (White, Silver)", day: "सोमवार (Monday)", trait: "शांतिप्रिय" },
            3: { planet: "बृहस्पति (Jupiter)", color: "पीला (Yellow)", day: "गुरुवार (Thursday)", trait: "ज्ञान और भाग्य" },
            4: { planet: "राहू (Rahu)", color: "नीला, भूरा (Blue, Grey)", day: "शनिवार (Saturday)", trait: "व्यावहारिक और अलग सोच" },
            5: { planet: "बुध (Mercury)", color: "हरा (Green)", day: "बुधवार (Wednesday)", trait: "बुद्धि और संचार" },
            6: { planet: "शुक्र (Venus)", color: "सफेद, गुलाबी (White, Pink)", day: "शुक्रवार (Friday)", trait: "प्रेम और कला" },
            7: { planet: "केतु (Ketu)", color: "चितकबरा (Multi-color)", day: "मंगलवार (Tuesday)", trait: "आध्यात्मिक" },
            8: { planet: "शनि (Saturn)", color: "काला, गहरा नीला (Black, Dark Blue)", day: "शनिवार (Saturday)", trait: "न्याय और मेहनत" },
            9: { planet: "मंगल (Mars)", color: "लाल (Red)", day: "मंगलवार (Tuesday)", trait: "ऊर्जा और साहस" }
        };
    }

    // --- Core Functions ---

    calculateNumerology(name) {
        let cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
        let total = 0;
        for (let char of cleanName) {
            total += this.numerologyMap[char] || 0;
        }
        while (total > 9) {
            let sum = 0;
            while (total > 0) {
                sum += total % 10;
                total = Math.floor(total / 10);
            }
            total = sum;
        }
        return total;
    }

    calculateRashi(name) {
        let cleanName = name.toLowerCase().trim();
        for (let rashiObj of this.rashiMap) {
            for (let sound of rashiObj.letters) {
                if (cleanName.startsWith(sound)) {
                    return rashiObj;
                }
            }
        }
        return {
            rashi: "Unknown",
            nakshatras: [],
            phal: "General info not available."
        };
    }

    // --- Main Processor ---
    processName(nameData) {
        const num = this.calculateNumerology(nameData.name);
        const rashiDetails = this.calculateRashi(nameData.name);
        
        // लकी डिटेल्स निकालना
        const luckyInfo = this.astroDetails[num] || this.astroDetails[1]; // Fallback to Sun if error

        return {
            Name: nameData.name,
            Meaning: nameData.meaning,
            
            // --- Astrology Data ---
            Rashi: rashiDetails.rashi,
            Nakshatra_Group: rashiDetails.nakshatras.join(", "),
            Rashiphal: rashiDetails.phal,
            
            // --- Numerology & Lucky Factors ---
            Lucky_Number: num,
            Planet: luckyInfo.planet,
            Lucky_Color: luckyInfo.color,
            Lucky_Day: luckyInfo.day,
            Key_Trait: luckyInfo.trait
        };
    }
}

// --- EXAMPLE USAGE ---

const engine = new AstroEngine();

const sampleData = [
  { "name": "Santosh", "meaning": "Satisfaction" },
  { "name": "Ramesh", "meaning": "Lord Vishnu" }
];

const result = sampleData.map(item => engine.processName(item));
console.log(JSON.stringify(result, null, 2));
