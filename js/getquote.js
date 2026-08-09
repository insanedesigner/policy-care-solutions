/**
 * Policy Care Solutions - Full-Screen Campaign Quote Assistant
 * Multilingual Support: English, Malayalam (മലയാളം), Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिंदी), Kannada (ಕನ್ನಡ)
 * MANDATORY: Output WhatsApp Payload is ALWAYS in ENGLISH ONLY!
 */

// Theme Toggle System (Default: Light Theme)
function initTheme() {
    const theme = localStorage.getItem('pcs_theme') || 'light';
    applyTheme(theme);
}

function applyTheme(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        if (icon) icon.className = 'fa-solid fa-moon text-sky-400 text-xs';
    } else {
        document.documentElement.classList.remove('dark');
        if (icon) icon.className = 'fa-solid fa-sun text-amber-500 text-xs';
    }
    localStorage.setItem('pcs_theme', theme);
}

window.toggleTheme = function() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
};

// Conversational State
const quoteState = {
    lang: 'en',
    step: 1,
    name: '',
    countryCode: '+91',
    phone: '',
    email: '',
    coverageType: 'family',
    members: [],
    pincode: '',
    district: '',
    city: ''
};

// 6-Language Dictionary
const i18n = {
    en: {
        welcomeMsg: "Hello! Welcome to <strong>Policy Care Solutions</strong>. I am your dedicated insurance advisor. Let's find your ideal health & motor protection plan!",
        confirmLangQuestion: "Hello! Welcome to <strong>Policy Care Solutions</strong>. I am your dedicated insurance advisor. Shall we continue in <strong>English</strong>?",
        confirmLangYes: "Yes, Continue in English",
        changeLangBtn: "Change Language",
        askName: "Great! First, may I know your <strong>Full Name</strong>?",
        namePlaceholder: "Enter your full name...",
        askPhone: "Nice to meet you, <strong>{name}</strong>! What is your <strong>Contact Number</strong>? (Select your country code if NRI)",
        phonePlaceholder: "Mobile number...",
        askEmail: "Thank you, <strong>{name}</strong>! What is your <strong>Email Address</strong>? (Optional to receive brochures)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "Skip Email for Now",
        askCoverage: "Awesome <strong>{name}</strong>! Are you looking for insurance for <strong>yourself only (Individual)</strong> or for your <strong>family (Family Floater)</strong>?",
        covIndividual: "Individual Policy (Self Only)",
        covFamily: "Family Floater (Self, Spouse, Children, Parents)",
        askMembers: "Please select the family members you wish to cover and enter their age or Date of Birth:",
        addMemberBtn: "+ Add Member",
        askPincode: "Got it, <strong>{name}</strong>! What is your <strong>6-digit Pincode</strong>?",
        pincodePlaceholder: "Enter 6-digit pincode...",
        askCity: "Thank you, <strong>{name}</strong>! What is your <strong>Town or City Name</strong>?",
        cityPlaceholder: "Town or City name...",
        locationPersonalization: "Perfect, <strong>{name}</strong>! For policyholders in <strong>{location}</strong>, Policy Care Solutions provides 24/7 direct cashless claim support across top network hospitals in India & Kerala. Let's finalize your quote profile!",
        reviewMsg: "All set, <strong>{name}</strong>! I have compiled your official quote profile. Click below to connect with our Policy Care advisor desk on WhatsApp now:",
        submitWaBtn: "Get Official Quote on WhatsApp",
        nextBtn: "Continue",
        backBtn: "Back",
        verifiedTitle: "Quote Profile Verified",
        modeAge: "Enter Age (Years)",
        modeDob: "Select DOB",
        self: "Self",
        spouse: "Spouse",
        child1: "Child 1",
        child2: "Child 2",
        father: "Father",
        mother: "Mother"
    },
    ml: {
        welcomeMsg: "നമസ്കാരം! <strong>പോളിസി കെയർ സൊല്യൂഷൻസിലേക്ക്</strong> സ്വാഗതം. നിങ്ങളുടെ കുടുംബത്തിനായുള്ള മികച്ച ഇൻഷുറൻസ് പ്ലാൻ കണ്ടെത്താൻ ഞാൻ സഹായിക്കാം!",
        confirmLangQuestion: "നമസ്കാരം! <strong>പോളിസി കെയർ സൊല്യൂഷൻസിലേക്ക്</strong> സ്വാഗതം. നമുക്ക് <strong>മലയാളത്തിൽ</strong> തുടരാമോ?",
        confirmLangYes: "അതെ, മലയാളത്തിൽ തുടരുക",
        changeLangBtn: "ഭാഷ മാറ്റുക",
        askName: "വളരെ സന്തോഷം! ആദ്യം, നിങ്ങളുടെ <strong>പൂർണ്ണമായ പേര്</strong> എന്താണ്?",
        namePlaceholder: "നിങ്ങളുടെ പേര് നൽകുക...",
        askPhone: "കണ്ടുമുട്ടിയതിൽ സന്തോഷം, <strong>{name}</strong>! നിങ്ങളുടെ <strong>മൊബൈൽ നമ്പർ</strong> എന്താണ്?",
        phonePlaceholder: "മൊബൈൽ നമ്പർ...",
        askEmail: "നന്ദി, <strong>{name}</strong>! നിങ്ങളുടെ <strong>ഇമെയിൽ വിലാസം</strong> എന്താണ്? (ഇത് ഐച്ഛികമാണ്)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ഇമെയിൽ ഇപ്പോൾ ഒഴിവാക്കുക",
        askCoverage: "വളരെ നല്ലത് <strong>{name}</strong>! ഇൻഷുറൻസ് നോക്കുന്നത് <strong>നിങ്ങൾക്ക് മാത്രമാണോ (Individual)</strong> അതോ <strong>കുടുംബത്തിനാണോ (Family Floater)</strong>?",
        covIndividual: "ഇൻഡിവിജ്വൽ പോളിസി (എനിക്ക് മാത്രം)",
        covFamily: "ഫാമിലി ഫ്ലോട്ടർ (എനിക്ക്, പങ്കാളി, മക്കൾ, മാതാപിതാക്കൾ)",
        askMembers: "പോളിസിയിൽ ഉൾപ്പെടുത്തേണ്ട കുടുംബാംഗങ്ങളുടെ പ്രായം അല്ലെങ്കിൽ ജനനത്തീയതി നൽകുക:",
        addMemberBtn: "+ അംഗത്തെ ചേർക്കുക",
        askPincode: "മനസ്സിലായി, <strong>{name}</strong>! നിങ്ങളുടെ <strong>6 അക്ക പിൻകോഡ്</strong> നൽകുക:",
        pincodePlaceholder: "6 അക്ക പിൻകോഡ്...",
        askCity: "നന്ദി, <strong>{name}</strong>! നിങ്ങളുടെ <strong>സ്ഥലത്തിന്റെ / നഗരത്തിന്റെ പേര്</strong> എന്താണ്?",
        cityPlaceholder: "സ്ഥലത്തിന്റെ പേര്...",
        locationPersonalization: "വളരെ കൊള്ളാം, <strong>{name}</strong>! <strong>{location}</strong>-ൽ ഉള്ളവർക്ക് പ്രമുഖ ആശുപത്രികളിൽ നേരിട്ടുള്ള ക്യാഷ്‌ലെസ്സ് സൗകര്യം പോളിസി കെയർ ലഭ്യമാക്കുന്നു.",
        reviewMsg: "എല്ലാം തയ്യാറായിക്കഴിഞ്ഞു, <strong>{name}</strong>! നിങ്ങളുടെ ക്വോട്ട് വിവരങ്ങൾ താഴെ കാണാം. വാട്സ്ആപ്പിൽ ഞങ്ങളുടെ അഡ്വൈസറുമായി സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക:",
        submitWaBtn: "വാട്സ്ആപ്പിൽ ക്വോട്ട് നേടുക",
        nextBtn: "തുടരുക",
        backBtn: "പിന്നോട്ട്",
        verifiedTitle: "ക്വോട്ട് വിവരങ്ങൾ തയ്യാറാണ്",
        modeAge: "പ്രായം നൽകുക (വർഷം)",
        modeDob: "ജനനത്തീയതി തിരഞ്ഞെടുക്കുക",
        self: "സ്വയം",
        spouse: "ഭർത്താവ് / ഭാര്യ",
        child1: "ആദ്യത്തെ കുട്ടി",
        child2: "രണ്ടാമത്തെ കുട്ടി",
        father: "അച്ഛൻ",
        mother: "അമ്മ"
    },
    ta: {
        welcomeMsg: "வணக்கம்! <strong>பாலிசி கேர் சொல்யூஷன்ஸுக்கு</strong> வரவேற்கிறோம். உங்கள் குடும்பத்திற்கான சிறந்த பாலிசியைத் தேர்ந்தெடுக்க நான் உதவுகிறேன்!",
        confirmLangQuestion: "வணக்கம்! <strong>பாலிசி கேர் சொல்யூஷன்ஸுக்கு</strong> வரவேற்கிறோம். <strong>தமிழில்</strong> தொடரலாமா?",
        confirmLangYes: "ஆம், தமிழில் தொடரவும்",
        changeLangBtn: "மொழியை மாற்றவும்",
        askName: "மிக்க மகிழ்ச்சி! முதலில் உங்கள் <strong>முழு பெயர்</strong> என்ன?",
        namePlaceholder: "உங்கள் பெயரை உள்ளிடவும்...",
        askPhone: "உங்களைச் சந்தித்ததில் மகிழ்ச்சி, <strong>{name}</strong>! உங்கள் <strong>மொபைல் எண்</strong> என்ன?",
        phonePlaceholder: "மொபைல் எண்...",
        askEmail: "நன்றி, <strong>{name}</strong>! உங்கள் <strong>மின்னஞ்சல் முகவரி</strong> என்ன? (விருப்பமானது)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "மின்னஞ்சலைத் தவிர்க்கவும்",
        askCoverage: "சிறப்பு <strong>{name}</strong>! பாலிசி <strong>உங்களுக்கு மட்டுமா (Individual)</strong> அல்லது <strong>குடும்பத்திற்கா (Family Floater)</strong>?",
        covIndividual: "தனிநபர் பாலிசி (எனக்கு மட்டும்)",
        covFamily: "குடும்ப பாலிசி (எனக்கு, துணைவர், பிள்ளைகள், பெற்றோர்)",
        askMembers: "குடும்ப உறுப்பினர்களின் வயது அல்லது பிறந்த தேதியை உள்ளிடவும்:",
        addMemberBtn: "+ உறுப்பினரைச் சேர்",
        askPincode: "புரிந்தது, <strong>{name}</strong>! உங்கள் <strong>6 இலக்க பின்கோடு</strong> என்ன?",
        pincodePlaceholder: "6 இலக்க பின்கோடு...",
        askCity: "நன்றி, <strong>{name}</strong>! உங்கள் <strong>ஊர் அல்லது நகரம்</strong> எது?",
        cityPlaceholder: "ஊர் பெயர்...",
        locationPersonalization: "மிக்க நன்று, <strong>{name}</strong>! <strong>{location}</strong>-ல் உள்ள வாடிக்கையாளர்களுக்கு முன்னணி மருத்துவமனைகளில் நேரடி கேஷ்லெஸ் வசதியை வழங்குகிறோம்!",
        reviewMsg: "அனைத்தும் தயார், <strong>{name}</strong>! உங்கள் பாலிசி விவரங்கள் தயார். வாட்ஸ்அப்பில் எங்களோடு பேச கீழே கிளிக் செய்யவும்:",
        submitWaBtn: "வாட்ஸ்அப்பில் பாலிசி பெறுக",
        nextBtn: "தொடரவும்",
        backBtn: "பின்னே",
        verifiedTitle: "விவரங்கள் தயார்",
        modeAge: "வயது (ஆண்டுகள்)",
        modeDob: "பிறந்த தேதி",
        self: "நான்",
        spouse: "துணைவர்",
        child1: "முதல் குழந்தை",
        child2: "இரண்டாம் குழந்தை",
        father: "தந்தை",
        mother: "தாய்"
    },
    te: {
        welcomeMsg: "నమస్కారం! <strong>పాలసీ కేర్ సొల్యూషన్స్ (Policy Care Solutions)</strong> కి స్వాగతం. మీ కుటుంబానికి సరిపోయే ఇన్సూరెన్స్ ప్లాన్ ఎంచుకోవడానికి నేను సహాయం చేస్తాను!",
        confirmLangQuestion: "నమస్కారం! <strong>పాలసీ కేర్ సొల్యూషన్స్</strong>కి స్వాగతం. మనం <strong>తెలుగులో</strong> కొనసాగుదామా?",
        confirmLangYes: "అవును, తెలుగులో కొనసాగించండి",
        changeLangBtn: "భాష మార్చండి",
        askName: "చాలా సంతోషం! ముందుగా మీ <strong>పూర్తి పేరు</strong> తెలుసుకోవచ్చా?",
        namePlaceholder: "మీ పేరును ఇక్కడ ఎంటర్ చేయండి...",
        askPhone: "మిమ్మల్ని కలవడం సంతోషంగా ఉంది, <strong>{name}</strong>! మీ <strong>మొబైల్ నంబర్</strong> ఏమిటి?",
        phonePlaceholder: "మొబైల్ నంబర్...",
        askEmail: "ధన్యవాదాలు, <strong>{name}</strong>! మీ <strong>ఇమెయిల్ ఐడీ</strong> ఏమిటి? (ఇది ఐచ్ఛికం)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ఇమెయిల్ ఇప్పుడు వద్దు",
        askCoverage: "అద్భుతం <strong>{name}</strong>! మీరు ఇన్సూరెన్స్ <strong>కేవలం మీ కోసమా (Individual)</strong> లేదా <strong>కుటుంబం కోసమా (Family Floater)</strong>?",
        covIndividual: "వ్యక్తిగత పాలసీ (నాకు మాత్రమే)",
        covFamily: "ఫ్యామిలీ ఫ్లోటర్ (నేను, భాగస్వామి, పిల్లలు, తల్లిదండ్రులు)",
        askMembers: "కుటుంబ సభ్యుల వయస్సు లేదా పుట్టిన తేదీని ఎంచుకోండి:",
        addMemberBtn: "+ సభ్యులను జోడించండి",
        askPincode: "అర్థమైంది, <strong>{name}</strong>! మీ <strong>6 అంకెల పిన్‌కోడ్</strong> ఎంటర్ చేయండి:",
        pincodePlaceholder: "6 అంకెల పిన్‌కోడ్...",
        askCity: "ధన్యవాదాలు, <strong>{name}</strong>! మీ <strong>నగరం లేదా ఊరి పేరు</strong> ఏమిటి?",
        cityPlaceholder: "నగరం పేరు...",
        locationPersonalization: "చాలా బాగుంది, <strong>{name}</strong>! <strong>{location}</strong> లో ఉన్నవారికి నెట్‌వర్క్ ఆసుపత్రులలో నేరుగా క్యాష్‌లెస్ సౌకర్యాన్ని అందిస్తున్నాము.",
        reviewMsg: "అన్నీ సిద్ధంగా ఉన్నాయి, <strong>{name}</strong>! మీ కోట్ వివరాలు సిద్ధంగా ఉన్నాయి. వాట్సాప్‌లో మా ప్రతినిధితో మాట్లాడటానికి కింద క్లిక్ చేయండి:",
        submitWaBtn: "వాట్సాప్‌లో కోట్ పొందండి",
        nextBtn: "కొనసాగించండి",
        backBtn: "వెనుకకు",
        verifiedTitle: "వివరాలు సిద్ధంగా ఉన్నాయి",
        modeAge: "వయస్సు (సంవత్సరాలు)",
        modeDob: "పుట్టిన తేదీ",
        self: "నేను",
        spouse: "భాగస్వామి",
        child1: "మొదటి బిడ్డ",
        child2: "రెండవ బిడ్డ",
        father: "తండ్రి",
        mother: "తల్లి"
    },
    hi: {
        welcomeMsg: "नमस्ते! <strong>पॉलिसी केयर सॉल्यूशंस</strong> में आपका स्वागत है। मैं आपकी स्वास्थ्य सुरक्षा के लिए सही पॉलिसी चुनने में सहायता करूँगा!",
        confirmLangQuestion: "नमस्ते! <strong>पॉलिसी केयर सॉल्यूशंस</strong> में आपका स्वागत है। क्या हम <strong>हिंदी</strong> में जारी रखें?",
        confirmLangYes: "हाँ, हिंदी में जारी रखें",
        changeLangBtn: "भाषा बदलें",
        askName: "बहुत बढ़िया! सबसे पहले, क्या मैं आपका <strong>पूरा नाम</strong> जान सकता हूँ?",
        namePlaceholder: "अपना नाम दर्ज करें...",
        askPhone: "आपसे मिलकर खुशी हुई, <strong>{name}</strong>! आपका <strong>मोबाइल नंबर</strong> क्या है?",
        phonePlaceholder: "मोबाइल नंबर...",
        askEmail: "धन्यवाद, <strong>{name}</strong>! आपका <strong>ईमेल पता</strong> क्या है? (ऐच्छिक)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ईमेल अभी छोड़ें",
        askCoverage: "शानदार <strong>{name}</strong>! क्या आप बीमा <strong>केवल अपने लिए (Individual)</strong> या <strong>पूरे परिवार के लिए (Family Floater)</strong> चाहते हैं?",
        covIndividual: "व्यक्तिगत पॉलिसी (केवल स्वयं)",
        covFamily: "फैमिली फ्लोटर (स्वयं, जीवनसाथी, बच्चे, माता-पिता)",
        askMembers: "परिवार के सदस्यों की आयु या जन्म तिथि चुनें:",
        addMemberBtn: "+ सदस्य जोड़ें",
        askPincode: "समझ गया, <strong>{name}</strong>! आपका <strong>6 अंकों का पिनकोड</strong> क्या है?",
        pincodePlaceholder: "6 अंकों का पिनकोड...",
        askCity: "धन्यवाद, <strong>{name}</strong>! आपका <strong>शहर या स्थान</strong> कौन सा है?",
        cityPlaceholder: "शहर का नाम...",
        locationPersonalization: "बहुत बढ़िया, <strong>{name}</strong>! <strong>{location}</strong> में पॉलिसी धारकों के लिए हम टॉप अस्पतालों में डायरेक्ट कैशलेस सुविधा प्रदान करते हैं।",
        reviewMsg: "सब तैयार है, <strong>{name}</strong>! आपकी पॉलिसी कोट प्रोफाइल तैयार है। व्हाट्सऐप पर सलाहकारों से जुड़ने के लिए नीचे क्लिक करें:",
        submitWaBtn: "व्हाट्सऐप पर कोट प्राप्त करें",
        nextBtn: "आगे बढ़ें",
        backBtn: "पीछे",
        verifiedTitle: "कोट प्रोफाइल तैयार है",
        modeAge: "आयु (वर्ष)",
        modeDob: "जन्म तिथि",
        self: "स्वयं",
        spouse: "पति/पत्नी",
        child1: "पहला बच्चा",
        child2: "दूसरा बच्चा",
        father: "पिता",
        mother: "माता"
    },
    kn: {
        welcomeMsg: "ನಮಸ್ಕಾರ! <strong>ಪಾಲಿಸಿ ಕೇರ್ ಸೊಲ್ಯೂಷನ್ಸ್</strong> ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕುಟುಂಬದ ಪಾಲಿಸಿ ಆಯ್ಕೆಗೆ ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ!",
        confirmLangQuestion: "ನಮಸ್ಕಾರ! <strong>ಪಾಲಿಸಿ ಕೇರ್ ಸೊಲ್ಯೂಷನ್ಸ್</strong>ಗೆ ಸುಸ್ವಾಗತ. ನಾವು <strong>ಕನ್ನಡದಲ್ಲಿ</strong> ಮುಂದುವರಿಯೋಣವೇ?",
        confirmLangYes: "ಹೌದು, ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ",
        changeLangBtn: "ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ",
        askName: "ತುಂಬಾ ಸಂತೋಷ! ಮೊದಲಿಗೆ ನಿಮ್ಮ <strong>ಪೂರ್ಣ ಹೆಸರು</strong> ತಿಳಿಸುವಿರಾ?",
        namePlaceholder: "ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ...",
        askPhone: "ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿದ್ದಕ್ಕೆ ಸಂತೋಷ, <strong>{name}</strong>! ನಿಮ್ಮ <strong>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</strong> ಏನು?",
        phonePlaceholder: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ...",
        askEmail: "ಧನ್ಯವಾದಗಳು, <strong>{name}</strong>! ನಿಮ್ಮ <strong>ಇಮೇಲ್ ವಿಳಾಸ</strong> ಏನು? (ಐಚ್ಛಿಕ)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ಇಮೇಲ್ ಈಗ ಬೇಡ",
        askCoverage: "ಉತ್ತಮ <strong>{name}</strong>! ನೀವು ಪಾಲಿಸಿ <strong>ನಿಮಗಾಗಿ ಮಾತ್ರವೇ (Individual)</strong> ಅಥವಾ <strong>ಕುಟುಂಬಕ್ಕಾಗಿ (Family Floater)</strong> ನೋಡುತ್ತಿದ್ದೀರಾ?",
        covIndividual: "ವೈಯಕ್ತಿಕ ಪಾಲಿಸಿ (ನನಗೆ ಮಾತ್ರ)",
        covFamily: "ಫ್ಯಾಮಿಲಿ ಫ್ಲೋಟರ್ (ನಾನು, ಸಂಗಾತಿ, ಮಕ್ಕಳು, ಪೋಷಕರು)",
        askMembers: "ಕುಟುಂಬದ ಸದಸ್ಯರ ವಯಸ್ಸು ಅಥವಾ ಜನ್ಮ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ:",
        addMemberBtn: "+ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
        askPincode: "ಅರ್ಥವಾಯಿತು, <strong>{name}</strong>! ನಿಮ್ಮ <strong>6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್</strong> ತಿಳಿಸಿ:",
        pincodePlaceholder: "6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್...",
        askCity: "ಧನ್ಯವಾದಗಳು, <strong>{name}</strong>! ನಿಮ್ಮ <strong>ನಗರ ಅಥವಾ ಊರಿನ ಹೆಸರು</strong> ಏನು?",
        cityPlaceholder: "ನಗರದ ಹೆಸರು...",
        locationPersonalization: "ಧನ್ಯವಾದಗಳು, <strong>{name}</strong>! <strong>{location}</strong> ಪ್ರದೇಶದ ಗ್ರಾಹಕರಿಗೆ ನೆಟ್‌ವರ್ಕ್ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ನೇರ ಕ್ಯಾಶ್‌ಲೆಸ್ ಸೌಲಭ್ಯ ಒದಗಿಸುತ್ತೇವೆ.",
        reviewMsg: "ಎಲ್ಲವೂ ಸಿದ್ಧವಾಗಿದೆ, <strong>{name}</strong>! ಪಾಲಿಸಿ ವಿವರಗಳು ಸಿದ್ಧವಾಗಿವೆ. ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನಮ್ಮ ಪ್ರತಿನಿಧಿಯೊಂದಿಗೆ ಮಾತನಾಡಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ:",
        submitWaBtn: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕೋಟ್ ಪಡೆಯಿರಿ",
        nextBtn: "ಮುಂದುವರಿಯಿರಿ",
        backBtn: "ಹಿಂದೆ",
        verifiedTitle: "ವಿವರಗಳು ಸಿದ್ಧವಾಗಿವೆ",
        modeAge: "ವಯಸ್ಸು (ವರ್ಷ)",
        modeDob: "ಜನ್ಮ ದಿನಾಂಕ",
        self: "ನಾನು",
        spouse: "ಸಂಗಾತಿ",
        child1: "ಮೊದಲ ಮಗು",
        child2: "ಎರಡನೇ ಮಗು",
        father: "ತಂದೆ",
        mother: "ತಾಯಿ"
    }
};

// Country Codes List
const countryCodes = [
    { code: '+91', country: '🇮🇳 India' },
    { code: '+971', country: '🇦🇪 UAE' },
    { code: '+966', country: '🇸🇦 Saudi Arabia' },
    { code: '+965', country: '🇰🇼 Kuwait' },
    { code: '+968', country: '🇴🇲 Oman' },
    { code: '+974', country: '🇶🇦 Qatar' },
    { code: '+973', country: '🇧🇭 Bahrain' },
    { code: '+1', country: '🇺🇸 USA / Canada' },
    { code: '+44', country: '🇬🇧 UK' },
    { code: '+65', country: '🇸🇬 Singapore' },
    { code: '+60', country: '🇲🇾 Malaysia' }
];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGetQuoteFlow();
    checkFirstVisitModal();
});

function checkFirstVisitModal() {
    const modal = document.getElementById('language-modal-popup');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

window.openLanguageModal = function() {
    const modal = document.getElementById('language-modal-popup');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.confirmLanguageModal = function(langCode) {
    quoteState.lang = langCode;
    updateLangBadge();

    const modal = document.getElementById('language-modal-popup');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    const messages = document.getElementById('quote-chat-messages');
    if (messages) messages.innerHTML = '';

    initGetQuoteFlow();
};

function initGetQuoteFlow() {
    renderStep1Welcome();
}

function t(key) {
    const dict = i18n[quoteState.lang] || i18n.en;
    return dict[key] || i18n.en[key] || '';
}

function updateLangBadge() {
    const badge = document.getElementById('selected-lang-label');
    if (badge) {
        if (quoteState.lang === 'ml') badge.innerText = 'മലയാളം';
        else if (quoteState.lang === 'ta') badge.innerText = 'தமிழ்';
        else if (quoteState.lang === 'te') badge.innerText = 'తెలుగు';
        else if (quoteState.lang === 'hi') badge.innerText = 'हिंदी';
        else if (quoteState.lang === 'kn') badge.innerText = 'ಕನ್ನಡ';
        else badge.innerText = 'English';
    }
}

function appendBotMessage(htmlContent) {
    const container = document.getElementById('quote-chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start gap-3 animate-fadeIn mb-3";
    msgDiv.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md">
            <i class="fa-solid fa-headset"></i>
        </div>
        <div class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 max-w-lg text-xs leading-relaxed shadow-md">
            ${htmlContent}
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function appendUserMessage(textContent) {
    const container = document.getElementById('quote-chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex items-start justify-end gap-3 animate-fadeIn mb-3";
    msgDiv.innerHTML = `
        <div class="bg-gradient-to-r from-sky-600 to-teal-600 text-white p-3.5 rounded-2xl rounded-tr-none text-xs font-semibold max-w-md shadow-md">
            ${textContent}
        </div>
        <div class="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md">
            <i class="fa-solid fa-user"></i>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// STEP 1: Language Confirmation Question & Option Buttons
function renderStep1Welcome() {
    quoteState.step = 1;
    appendBotMessage(t('confirmLangQuestion'));
    renderStep1LanguageOptions();
}

function renderStep1LanguageOptions() {
    const inputArea = document.getElementById('quote-input-container');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
            <button onclick="confirmPreferredLanguage()" class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white border border-sky-400/30 text-left transition-all shadow-md group flex items-center justify-between">
                <div class="font-extrabold text-xs sm:text-sm flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-300"></i> ${t('confirmLangYes')}
                </div>
                <i class="fa-solid fa-arrow-right text-xs opacity-75 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button onclick="showLanguageSelectorOptions()" class="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 text-left transition-all shadow-sm group flex items-center justify-between">
                <div class="font-extrabold text-xs sm:text-sm flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <i class="fa-solid fa-globe text-sky-500"></i> ${t('changeLangBtn')}
                </div>
                <i class="fa-solid fa-chevron-right text-xs text-slate-400 group-hover:translate-x-1 transition-transform"></i>
            </button>
        </div>
    `;
}

window.confirmPreferredLanguage = function() {
    appendUserMessage(t('confirmLangYes'));
    renderStep2Name();
};

window.showLanguageSelectorOptions = function() {
    const inputArea = document.getElementById('quote-input-container');
    if (!inputArea) return;

    const languages = [
        { code: 'en', label: 'English', sub: 'Continue in English' },
        { code: 'ml', label: 'മലയാളം', sub: 'മലയാളത്തിൽ തുടരുക' },
        { code: 'ta', label: 'தமிழ்', sub: 'தமிழில் தொடரவும்' },
        { code: 'te', label: 'తెలుగు', sub: 'తెలుగులో కొనసాగించండి' },
        { code: 'hi', label: 'हिंदी', sub: 'हिंदी में जारी रखें' },
        { code: 'kn', label: 'ಕನ್ನಡ', sub: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ' }
    ];

    const langBtns = languages.map(l => `
        <button onclick="selectLanguageOption('${l.code}')" class="p-3 rounded-xl ${quoteState.lang === l.code ? 'bg-sky-600 text-white border-sky-500 font-black shadow-md' : 'bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'} border text-left transition-all shadow-sm flex flex-col gap-0.5">
            <span class="font-extrabold text-xs flex items-center justify-between">
                ${l.label} ${quoteState.lang === l.code ? '<i class="fa-solid fa-check text-[10px]"></i>' : ''}
            </span>
            <span class="text-[10px] ${quoteState.lang === l.code ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}">${l.sub}</span>
        </button>
    `).join('');

    inputArea.innerHTML = `
        <div class="space-y-2 animate-fadeIn">
            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between pb-1">
                <span>Choose Preferred Language:</span>
                <button onclick="renderStep1LanguageOptions()" class="text-sky-600 dark:text-sky-400 hover:underline text-[10px] font-semibold">Cancel</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                ${langBtns}
            </div>
        </div>
    `;
};

window.selectLanguageOption = function(langCode) {
    quoteState.lang = langCode;
    document.documentElement.setAttribute('lang', langCode);
    updateLangBadge();

    const langNames = {
        en: 'English',
        ml: 'മലയാളം (Malayalam)',
        ta: 'தமிழ் (Tamil)',
        te: 'తెలుగు (Telugu)',
        hi: 'हिंदी (Hindi)',
        kn: 'ಕನ್ನಡ (Kannada)'
    };

    appendUserMessage(langNames[langCode] || langCode);

    setTimeout(() => {
        renderStep2Name();
    }, 300);
};

// Localized Relation Options for Family Floater
const relationOptions = [
    { key: 'Self', labels: { en: 'Self (Primary Insured)', ml: 'സ്വയം (Self)', ta: 'நான் (Self)', te: 'నేను (Self)', hi: 'स्वयं (Self)', kn: 'ಸ್ವಯಂ (Self)' } },
    { key: 'Spouse', labels: { en: 'Spouse (Wife / Husband)', ml: 'ഭർത്താവ് / ഭാര്യ (Spouse)', ta: 'துணைவர் (Spouse)', te: 'భాగస్వామి (Spouse)', hi: 'पति / पत्नी (Spouse)', kn: 'ಸಂಗಾತಿ (Spouse)' } },
    { key: 'Son', labels: { en: 'Son', ml: 'മകൻ (Son)', ta: 'மகன் (Son)', te: 'కుమారుడు (Son)', hi: 'बेटा (Son)', kn: 'ಮಗ (Son)' } },
    { key: 'Daughter', labels: { en: 'Daughter', ml: 'മകൾ (Daughter)', ta: 'மகள் (Daughter)', te: 'కుమార్తె (Daughter)', hi: 'बेटी (Daughter)', kn: 'ಮಗಳು (Daughter)' } },
    { key: 'Father', labels: { en: 'Father', ml: 'അച്ഛൻ (Father)', ta: 'தந்தை (Father)', te: 'తండ్రి (Father)', hi: 'पिता (Father)', kn: 'ತಂದೆ (Father)' } },
    { key: 'Mother', labels: { en: 'Mother', ml: 'അമ്മ (Mother)', ta: 'தாய் (Mother)', te: 'తల్లి (Mother)', hi: 'माता (Mother)', kn: 'ತಾಯಿ (Mother)' } },
    { key: 'Father-in-law', labels: { en: 'Father-in-law', ml: 'ഭാര്യാപിതാവ് / ഭർത്താവിന്റെ പിതാവ്', ta: 'மாமனார் (Father-in-law)', te: 'మామగారు (Father-in-law)', hi: 'ससुर (Father-in-law)', kn: 'ಮಾವ (Father-in-law)' } },
    { key: 'Mother-in-law', labels: { en: 'Mother-in-law', ml: 'ഭാര്യാമാതാവ് / ഭർത്താവിന്റെ മാതാവ്', ta: 'மாமியார் (Mother-in-law)', te: 'అత్తగారు (Mother-in-law)', hi: 'सास (Mother-in-law)', kn: 'ಅತ್ತೆ (Mother-in-law)' } },
    { key: 'Other', labels: { en: 'Other Dependent', ml: 'മറ്റ് ആശ്രിതർ (Other)', ta: 'மற்றவர் (Other)', te: 'ఇతర సభ్యులు (Other)', hi: 'अन्य सदस्य (Other)', kn: 'ಇತರರು (Other)' } }
];

function getRelationDisplay(relKey) {
    const opt = relationOptions.find(o => o.key.toLowerCase() === (relKey || '').toLowerCase());
    if (opt && opt.labels[quoteState.lang]) return opt.labels[quoteState.lang];
    if (opt) return opt.labels.en;
    return relKey;
}

// STEP 2: Name Input
function renderStep2Name() {
    quoteState.step = 2;
    setTimeout(() => {
        appendBotMessage(t('askName'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleNameSubmit(event)" class="flex gap-2">
                <input type="text" id="input-name" placeholder="${t('namePlaceholder')}" required class="flex-1 h-13 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="name" />
                <button type="submit" class="px-5 sm:px-6 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5">
                    <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        `;
        // No automatic focus() call to prevent auto keypad pop-up on mobile
    }, 300);
}

window.handleNameSubmit = function(e) {
    e.preventDefault();
    const val = document.getElementById('input-name')?.value.trim();
    if (!val) return;

    quoteState.name = val;
    appendUserMessage(val);
    renderStep3Phone();
};

// STEP 3: Phone + Country Code
function renderStep3Phone() {
    quoteState.step = 3;
    setTimeout(() => {
        const msg = t('askPhone').replace('{name}', quoteState.name);
        appendBotMessage(msg);

        const optionsHtml = countryCodes.map(c => `<option value="${c.code}" ${c.code === '+91' ? 'selected' : ''}>${c.country} (${c.code})</option>`).join('');

        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handlePhoneSubmit(event)" class="space-y-3">
                <div class="flex gap-2">
                    <select id="input-country-code" class="w-36 h-13 px-3 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold shadow-sm">
                        ${optionsHtml}
                    </select>
                    <input type="tel" id="input-phone" placeholder="${t('phonePlaceholder')}" required class="flex-1 h-13 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="tel" />
                </div>
                <button type="submit" class="w-full h-12 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5">
                    <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        `;
        // No automatic focus() call to prevent auto keypad pop-up
    }, 300);
}

window.handlePhoneSubmit = function(e) {
    e.preventDefault();
    const cc = document.getElementById('input-country-code')?.value || '+91';
    const num = document.getElementById('input-phone')?.value.trim();
    if (!num) return;

    quoteState.countryCode = cc;
    quoteState.phone = num;

    appendUserMessage(`${cc} ${num}`);
    renderStep4Email();
};

// STEP 4: Email
function renderStep4Email() {
    quoteState.step = 4;
    setTimeout(() => {
        const msg = t('askEmail').replace('{name}', quoteState.name);
        appendBotMessage(msg);
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleEmailSubmit(event)" class="space-y-2">
                <div class="flex gap-2">
                    <input type="email" id="input-email" placeholder="${t('emailPlaceholder')}" class="flex-1 h-13 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="email" />
                    <button type="submit" class="px-5 sm:px-6 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5">
                        <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                <button type="button" onclick="skipEmail()" class="text-xs text-slate-500 dark:text-slate-400 hover:underline block mx-auto pt-1 font-semibold">
                    ${t('skipEmailBtn')}
                </button>
            </form>
        `;
        // No automatic focus() call
    }, 300);
}

window.handleEmailSubmit = function(e) {
    e.preventDefault();
    const val = document.getElementById('input-email')?.value.trim();
    quoteState.email = val || 'Not Provided';
    appendUserMessage(quoteState.email);
    renderStep5Coverage();
};

window.skipEmail = function() {
    quoteState.email = 'Not Provided';
    appendUserMessage(t('skipEmailBtn'));
    renderStep5Coverage();
};

// STEP 5: Coverage Type
function renderStep5Coverage() {
    quoteState.step = 5;
    setTimeout(() => {
        const msg = t('askCoverage').replace('{name}', quoteState.name);
        appendBotMessage(msg);
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onclick="selectCoverage('individual')" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-left transition-all group shadow-sm">
                    <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-lg mb-2 font-black">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-sky-600">${t('covIndividual')}</div>
                </button>
                <button onclick="selectCoverage('family')" class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-left transition-all group shadow-sm">
                    <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-lg mb-2 font-black">
                        <i class="fa-solid fa-people-roof"></i>
                    </div>
                    <div class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-teal-600">${t('covFamily')}</div>
                </button>
            </div>
        `;
    }, 300);
}

window.selectCoverage = function(type) {
    quoteState.coverageType = type;
    if (type === 'individual') {
        appendUserMessage(t('covIndividual'));
        quoteState.members = [{ relation: 'Self', mode: 'age', age: 30, dob: '' }];
        renderStep6Members();
    } else {
        appendUserMessage(t('covFamily'));
        quoteState.members = [
            { relation: 'Self', mode: 'age', age: 35, dob: '' },
            { relation: 'Spouse', mode: 'age', age: 32, dob: '' }
        ];
        renderStep6Members();
        // Automatically open the Family Members Modal Popup so user can comfortably add/edit members without scrolling issues
        setTimeout(() => {
            openFamilyModal();
        }, 400);
    }
};

// STEP 6: Members & Ages / DOB (Enhanced with Dedicated Modal Popup)
function renderStep6Members() {
    quoteState.step = 6;
    setTimeout(() => {
        appendBotMessage(t('askMembers'));
        renderMembersSummaryCard();
    }, 300);
}

function renderMembersSummaryCard() {
    const inputArea = document.getElementById('quote-input-container');
    if (!inputArea) return;

    const chipsHtml = quoteState.members.map(m => {
        const valStr = m.mode === 'dob' && m.dob ? m.dob : `${m.age} Yrs`;
        return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 font-bold text-xs shadow-sm">
                <i class="fa-solid fa-user text-[10px] text-sky-500"></i>
                <span>${getRelationDisplay(m.relation)}:</span>
                <span class="text-sky-600 dark:text-sky-400 font-extrabold">${valStr}</span>
            </span>
        `;
    }).join('');

    inputArea.innerHTML = `
        <div class="space-y-2.5 animate-fadeIn">
            <!-- Members Chips Card (Compact so it never gets hidden below screen) -->
            <div class="p-3 bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                <div class="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <span class="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                        <i class="fa-solid fa-people-roof"></i> ${quoteState.members.length} Member(s) Added
                    </span>
                    <button type="button" onclick="openFamilyModal()" class="text-sky-600 hover:text-sky-700 dark:text-sky-400 text-xs font-bold flex items-center gap-1 hover:underline">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                </div>
                <div class="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto chat-scroll-touch">
                    ${chipsHtml}
                </div>
            </div>

            <!-- Action Buttons: Open Modal / Continue -->
            <div class="flex flex-col sm:flex-row gap-2">
                <button type="button" onclick="openFamilyModal()" class="w-full sm:flex-1 h-12 py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                    <i class="fa-solid fa-user-plus text-sky-500"></i>
                    <span>${quoteState.coverageType === 'individual' ? 'Change Age / Details' : '+ Add / Edit Family Members'}</span>
                </button>
                <button type="button" onclick="submitMembersStep()" class="w-full sm:flex-1 h-12 py-2.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all">
                    <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

// Modal Popup Management Functions
window.openFamilyModal = function() {
    const modal = document.getElementById('family-members-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderModalMembersList();
};

window.closeFamilyModal = function() {
    const modal = document.getElementById('family-members-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.saveAndCloseFamilyModal = function() {
    closeFamilyModal();
    renderMembersSummaryCard();
};

window.renderModalMembersList = function() {
    const listContainer = document.getElementById('modal-members-list');
    if (!listContainer) return;

    const cardsHtml = quoteState.members.map((m, index) => {
        return `
            <div class="p-3.5 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                    <span class="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                        <i class="fa-solid fa-user-shield"></i> Member #${index + 1}
                    </span>
                    ${quoteState.members.length > 1 ? `
                        <button type="button" onclick="removeMemberInModal(${index})" class="text-rose-500 hover:text-rose-600 text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 font-bold transition-colors flex items-center gap-1">
                            <i class="fa-solid fa-trash-can"></i> <span class="hidden sm:inline">Remove</span>
                        </button>
                    ` : ''}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                    <!-- Relation Select -->
                    <div class="sm:col-span-5">
                        <label class="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Relationship</label>
                        <select onchange="updateMemberRelation(${index}, this.value)" class="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 shadow-sm">
                            ${relationOptions.map(rel => `
                                <option value="${rel.key}" ${m.relation.toLowerCase() === rel.key.toLowerCase() ? 'selected' : ''}>
                                    ${rel.labels[quoteState.lang] || rel.labels.en}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Format Select (Age vs DOB) -->
                    <div class="sm:col-span-3">
                        <label class="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Format</label>
                        <select onchange="updateMemberModeInModal(${index}, this.value)" class="w-full h-11 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-sky-500 shadow-sm">
                            <option value="age" ${m.mode === 'age' ? 'selected' : ''}>${t('modeAge')}</option>
                            <option value="dob" ${m.mode === 'dob' ? 'selected' : ''}>${t('modeDob')}</option>
                        </select>
                    </div>

                    <!-- Value Input (Age / DOB) -->
                    <div class="sm:col-span-4">
                        <label class="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">${m.mode === 'dob' ? 'Date of Birth' : 'Age in Years'}</label>
                        ${m.mode === 'age' 
                            ? `<input type="number" min="0" max="100" value="${m.age}" onchange="updateMemberAge(${index}, this.value)" class="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-sky-500 shadow-sm" placeholder="e.g. 35" />`
                            : `<input type="date" value="${m.dob}" onchange="updateMemberDob(${index}, this.value)" class="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-sky-500 shadow-sm" />`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = cardsHtml;
};

window.addFamilyMemberInModal = function() {
    const defaultSeq = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Father-in-law', 'Mother-in-law', 'Other'];
    let nextRel = 'Other';
    for (const rel of defaultSeq) {
        if (!quoteState.members.some(m => m.relation.toLowerCase() === rel.toLowerCase())) {
            nextRel = rel;
            break;
        }
    }
    const defaultAge = nextRel === 'Spouse' ? 32 : (nextRel === 'Father' || nextRel === 'Mother' ? 60 : 10);
    quoteState.members.push({ relation: nextRel, mode: 'age', age: defaultAge, dob: '' });
    renderModalMembersList();

    // Scroll modal to newly added card
    const listContainer = document.getElementById('modal-members-list');
    if (listContainer) {
        setTimeout(() => {
            listContainer.scrollTo({ top: listContainer.scrollHeight, behavior: 'smooth' });
        }, 50);
    }
};

window.removeMemberInModal = function(idx) {
    quoteState.members.splice(idx, 1);
    renderModalMembersList();
};

window.updateMemberModeInModal = function(idx, mode) {
    if (quoteState.members[idx]) {
        quoteState.members[idx].mode = mode;
        renderModalMembersList();
    }
};

window.updateMemberRelation = function(idx, val) {
    if (quoteState.members[idx]) {
        quoteState.members[idx].relation = val;
    }
};

window.updateMemberAge = function(idx, val) {
    if (quoteState.members[idx]) {
        quoteState.members[idx].age = parseInt(val) || 0;
    }
};

window.updateMemberDob = function(idx, val) {
    if (quoteState.members[idx]) {
        quoteState.members[idx].dob = val;
    }
};

window.submitMembersStep = function() {
    const summary = quoteState.members.map(m => `${getRelationDisplay(m.relation)}: ${m.mode === 'dob' && m.dob ? m.dob : m.age + ' Yrs'}`).join(', ');
    appendUserMessage(summary);
    renderStep7Pincode();
};

// STEP 7A: Pincode First
function renderStep7Pincode() {
    quoteState.step = 7;
    setTimeout(() => {
        const msg = t('askPincode').replace('{name}', quoteState.name);
        appendBotMessage(msg);
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handlePincodeSubmit(event)" class="flex gap-2">
                <input type="text" id="input-pincode" placeholder="${t('pincodePlaceholder')}" maxlength="6" required class="flex-1 h-13 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
                <button type="submit" class="px-5 sm:px-6 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5">
                    <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        `;
        // No automatic focus() call
    }, 300);
}

window.handlePincodeSubmit = function(e) {
    e.preventDefault();
    const pin = document.getElementById('input-pincode')?.value.trim();
    if (!pin) return;

    quoteState.pincode = pin;
    appendUserMessage(pin);
    renderStep7City();
};

// STEP 7B: City / Town Location Next
function renderStep7City() {
    quoteState.step = 7.5;
    setTimeout(() => {
        const msg = t('askCity').replace('{name}', quoteState.name);
        appendBotMessage(msg);
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleCitySubmit(event)" class="flex gap-2">
                <input type="text" id="input-city" placeholder="${t('cityPlaceholder')}" required class="flex-1 h-13 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
                <button type="submit" class="px-5 sm:px-6 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5">
                    <span>${t('nextBtn')}</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        `;
        // No automatic focus() call
    }, 300);
}

window.handleCitySubmit = function(e) {
    e.preventDefault();
    const city = document.getElementById('input-city')?.value.trim();
    if (!city) return;

    quoteState.city = city;
    appendUserMessage(city);

    // Location Personalization Message
    setTimeout(() => {
        const locMsg = t('locationPersonalization').replace('{name}', quoteState.name).replace('{location}', city);
        appendBotMessage(locMsg);
        renderStep8Review();
    }, 400);
};

// STEP 8: Final Review & WhatsApp Lead Transfer (WHATSAPP PAYLOAD IS ALWAYS IN ENGLISH ONLY)
function renderStep8Review() {
    quoteState.step = 8;
    setTimeout(() => {
        const reviewText = t('reviewMsg').replace('{name}', quoteState.name).replace('{location}', quoteState.city);
        appendBotMessage(reviewText);

        // English-Only Summary Lines for WhatsApp
        const memberSummaryLines = quoteState.members.map(m => `• ${m.relation}: ${m.mode === 'dob' && m.dob ? 'DOB ' + m.dob : m.age + ' Years'}`).join('\n');

        // ALWAYS ENGLISH PAYLOAD FOR WHATSAPP TO ADVISOR TEAM (+91 9048360880)
        const waPayload = `*POLICY CARE SOLUTIONS - OFFICIAL QUOTE REQUEST*
----------------------------------------
*Customer Name*: ${quoteState.name}
*Phone Number*: ${quoteState.countryCode} ${quoteState.phone}
*Email Address*: ${quoteState.email}
*Coverage Type*: ${quoteState.coverageType.toUpperCase()}
*Location*: ${quoteState.pincode} (${quoteState.city})

*Members Covered*:
${memberSummaryLines}

Hello Policy Care Solutions, my name is ${quoteState.name}. I submitted my quote details for ${quoteState.coverageType} health policy. Please guide me with official Star & Care Health quotes!`;

        const encodedWa = encodeURIComponent(waPayload);
        const waUrl = `https://wa.me/919048360880?text=${encodedWa}`;

        // Trigger Brevo API Lead Email Dispatch in background
        if (window.leadService) {
            window.leadService.sendLeadEmail({
                name: quoteState.name,
                phone: `${quoteState.countryCode} ${quoteState.phone}`,
                email: quoteState.email,
                coverageType: quoteState.coverageType,
                pincode: quoteState.pincode,
                city: quoteState.city,
                members: quoteState.members,
                source: 'Get Quote Assistant'
            });
        }

        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <div class="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span><i class="fa-solid fa-circle-check mr-1"></i> ${t('verifiedTitle')}</span>
                    <span class="text-xs text-sky-600 dark:text-sky-400 font-bold">${quoteState.coverageType.toUpperCase()} PLAN</span>
                </div>
                <div class="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p><strong>Name:</strong> ${quoteState.name}</p>
                    <p><strong>Pincode:</strong> ${quoteState.pincode}</p>
                    <p><strong>Location:</strong> ${quoteState.city}</p>
                </div>
                <a href="${waUrl}" target="_blank" class="block w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm text-center shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <i class="fa-brands fa-whatsapp text-xl"></i> ${t('submitWaBtn')}
                </a>
            </div>
        `;
    }, 400);
}

// Mobile Viewport Keyboard Scroll Listener for iOS & Android
document.addEventListener('focusin', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 280);
    }
});
