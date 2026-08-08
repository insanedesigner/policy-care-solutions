/**
 * Policy Care Solutions - Full-Screen Campaign Quote Assistant
 * Multilingual Support: English, Malayalam (മലയാളം), Tamil (தமிழ்), Hindi (हिंदी), Kannada (ಕನ್ನಡ)
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

// 5-Language Dictionary
const i18n = {
    en: {
        welcomeMsg: "Hello! Welcome to <strong>Policy Care Solutions</strong> (Ottapalam & Palakkad Desk). I am your dedicated insurance advisor. Let's find your ideal health & motor protection plan!",
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
        askLocation: "Got it! What is your <strong>Pincode or Town/City</strong> (e.g. Ottapalam, Palakkad, Shornur, Cherpulassery, Pattambi, Perinthalmanna)?",
        pincodePlaceholder: "6-digit pincode...",
        cityPlaceholder: "Town or City name...",
        locationPersonalization: "Perfect, <strong>{name}</strong>! For policyholders in <strong>{location}</strong>, Policy Care Solutions provides direct cashless claim processing at top network hospitals (including Valluvanad Hospital, PK Das Medical College, KIMS Al Shifa, and Crest Hospital). Let's finalize your quote!",
        reviewMsg: "All set, <strong>{name}</strong>! I have compiled your official quote profile for policyholders in <strong>{location}</strong>. Click below to connect with our Policy Care advisor team on WhatsApp now:",
        submitWaBtn: "Send Pre-Filled Quote to WhatsApp (+91 9048360880)",
        nextBtn: "Continue",
        backBtn: "Back",
        verifiedTitle: "Client Quote Profile Ready",
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
        welcomeMsg: "നമസ്കാരം! <strong>പോളിസി കെയർ സൊല്യൂഷൻസിലേക്ക്</strong> (ഒറ്റപ്പാലം & പാലക്കാട്) സ്വാഗതം. നിങ്ങളുടെ കുടുംബത്തിനായുള്ള മികച്ച ഇൻഷുറൻസ് പ്ലാൻ കണ്ടെത്താൻ ഞാൻ സഹായിക്കാം!",
        askName: "വളരെ സന്തോഷം! ആദ്യം, നിങ്ങളുടെ <strong>പൂർണ്ണമായ പേര്</strong> എന്താണ്?",
        namePlaceholder: "നിങ്ങളുടെ പേര് നൽകുക...",
        askPhone: "കണ്ടുമുട്ടിയതിൽ സന്തോഷം, <strong>{name}</strong>! നിങ്ങളുടെ <strong>മൊബൈൽ നമ്പർ</strong> എന്താണ്? കൺട്രി കോഡ് തിരഞ്ഞെടുക്കാം.",
        phonePlaceholder: "മൊബൈൽ നമ്പർ...",
        askEmail: "നന്ദി, <strong>{name}</strong>! നിങ്ങളുടെ <strong>ഇമെയിൽ വിലാസം</strong> എന്താണ്? (ഇത് ഐച്ഛികമാണ്)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ഇമെയിൽ ഇപ്പോൾ ഒഴിവാക്കുക",
        askCoverage: "വളരെ നല്ലത് <strong>{name}</strong>! ഇൻഷുറൻസ് നോക്കുന്നത് <strong>നിങ്ങൾക്ക് മാത്രമാണോ (Individual)</strong> അതോ <strong>കുടുംബത്തിനാണോ (Family Floater)</strong>?",
        covIndividual: "ഇൻഡിവിജ്വൽ പോളിസി (എനിക്ക് മാത്രം)",
        covFamily: "ഫാമിലി ഫ്ലോട്ടർ (എനിക്ക്, പങ്കാളി, മക്കൾ, മാതാപിതാക്കൾ)",
        askMembers: "പോളിസിയിൽ ഉൾപ്പെടുത്തേണ്ട കുടുംബാംഗങ്ങളുടെ പ്രായം അല്ലെങ്കിൽ ജനനത്തീയതി നൽകുക:",
        addMemberBtn: "+ അംഗത്തെ ചേർക്കുക",
        askLocation: "മനസ്സിലായി! നിങ്ങളുടെ <strong>പിൻകോഡ് അല്ലെങ്കിൽ സ്ഥലം</strong> (ഉദാ: ഒറ്റപ്പാലം, പാലക്കാട്, ഷൊർണ്ണൂർ, ചെറുപ്പുളശ്ശേരി, പട്ടാമ്പി, പെരിന്തൽമണ്ണ) ഏതാണ്?",
        pincodePlaceholder: "6 അക്ക പിൻകോഡ്...",
        cityPlaceholder: "സ്ഥലത്തിന്റെ പേര്...",
        locationPersonalization: "വളരെ കൊള്ളാം, <strong>{name}</strong>! <strong>{location}</strong>-ൽ ഉള്ളവർക്ക് വള്ളുവനാട് ഹോസ്പിറ്റൽ, PK ദാസ് മെഡിക്കൽ കോളേജ്, KIMS അൽ ഷിഫ തുടങ്ങിയ ആശുപത്രികളിൽ നേരിട്ടുള്ള ക്യാഷ്‌ലെസ്സ് സൗകര്യം പോളിസി കെയർ ലഭ്യമാക്കുന്നു. നിങ്ങളുടെ ക്വോട്ട് തയ്യാറാണ്!",
        reviewMsg: "എല്ലാം തയ്യാറായിക്കഴിഞ്ഞു, <strong>{name}</strong>! <strong>{location}</strong> ലൊക്കേഷനിലേക്കുള്ള നിങ്ങളുടെ ക്വോട്ട് വിവരങ്ങൾ താഴെ കാണാം. വാട്സ്ആപ്പിൽ ഞങ്ങളുടെ അഡ്വൈസറുമായി സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക:",
        submitWaBtn: "വാട്സ്ആപ്പിൽ ക്വോട്ട് സന്ദേശം അയക്കുക (+91 9048360880)",
        nextBtn: "തുടരുക",
        backBtn: "പിന്നോട്ട്",
        verifiedTitle: "ക്വോട്ട് പ്രൊഫൈൽ തയ്യാറാണ്",
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
        welcomeMsg: "வணக்கம்! <strong>பாலிசி கேர் சொல்யூஷன்ஸுக்கு</strong> (ஒற்றப்பாலம் & பாலக்காடு) வரவேற்கிறோம். உங்கள் குடும்பத்திற்கான சிறந்த பாலிசியைத் தேர்ந்தெடுக்க நான் உதவுகிறேன்!",
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
        askLocation: "புரிந்தது! உங்கள் <strong>பின்கோடு அல்லது ஊர்</strong> (எ.கா: ஒற்றப்பாலம், பாலக்காடு, ஷொர்ணூர்) எது?",
        pincodePlaceholder: "6 இலக்க பின்கோடு...",
        cityPlaceholder: "ஊர் பெயர்...",
        locationPersonalization: "மிக்க நன்று, <strong>{name}</strong>! <strong>{location}</strong>-ல் உள்ள வாடிக்கையாளர்களுக்கு வள்ளுவநாடு மருத்துவமனை, PK தாஸ் மருத்துவக் கல்லூரி ஆகியவற்றில் நேரடி கேஷ்லெஸ் வசதியை வழங்குகிறோம்!",
        reviewMsg: "அனைத்தும் தயார், <strong>{name}</strong>! <strong>{location}</strong> பகுதிக்கான பாலிசி விவரங்கள் தயார். வாட்ஸ்அப்பில் எங்களோடு பேச கீழே கிளிக் செய்யவும்:",
        submitWaBtn: "வாட்ஸ்அப்பில் தொடர்புகொள்ள (+91 9048360880)",
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
        askLocation: "చివరగా, మీ <strong>పిన్‌కోడ్ లేదా నగరం</strong> (ఉదా: ఒట్టాపాలెం, పాలక్కాడ్) ఏమిటి?",
        pincodePlaceholder: "6 అంకెల పిన్‌కోడ్...",
        cityPlaceholder: "నగరం పేరు...",
        locationPersonalization: "చాలా బాగుంది, <strong>{name}</strong>! <strong>{location}</strong> లో ఉన్నవారికి నెట్‌వర్క్ ఆసుపత్రులలో నేరుగా క్యాష్‌లెస్ సౌకర్యాన్ని అందిస్తున్నాము.",
        reviewMsg: "అన్నీ సిద్ధంగా ఉన్నాయి, <strong>{name}</strong>! <strong>{location}</strong> పాలసీ వివరాలు సిద్ధంగా ఉన్నాయి. వాట్సాప్‌లో మా ప్రతినిధితో మాట్లాడటానికి కింద క్లిక్ చేయండి:",
        submitWaBtn: "వాట్సాప్‌లో వివరాలు పంపండి (+91 9048360880)",
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
        welcomeMsg: "नमस्ते! <strong>पॉलिसी केयर सॉल्यूशंस</strong> (ओट्टापालम और पालक्काड) में आपका स्वागत है। मैं आपकी स्वास्थ्य सुरक्षा के लिए सही पॉलिसी चुनने में सहायता करूँगा!",
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
        askLocation: "समझ गया! आपका <strong>पिनकोड या शहर</strong> (जैसे: ओट्टापालम, पालक्काड) कौन सा है?",
        pincodePlaceholder: "6 अंकों का पिनकोड...",
        cityPlaceholder: "शहर का नाम...",
        locationPersonalization: "बहुत बढ़िया, <strong>{name}</strong>! <strong>{location}</strong> में पॉलिसी धारकों के लिए हम वल्लुवनाड, पीके दास और केआईएमएस अस्पतालों में डायरेक्ट कैशलेस सुविधा प्रदान करते हैं।",
        reviewMsg: "सब तैयार है, <strong>{name}</strong>! <strong>{location}</strong> के लिए आपकी पॉलिसी कोट प्रोफाइल तैयार है। व्हाट्सऐप पर सलाहकारों से जुड़ने के लिए नीचे क्लिक करें:",
        submitWaBtn: "व्हाट्सऐप पर कोट भेजें (+91 9048360880)",
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
        welcomeMsg: "ನಮಸ್ಕಾರ! <strong>ಪಾಲಿಸಿ ಕೇರ್ ಸೊಲ್ಯೂಷನ್ಸ್</strong> (ಒಟ್ಟಾಪಾಲಂ & ಪಾಲಕ್ಕಾಡ್) ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಕುಟುಂಬದ ಪಾಲಿಸಿ ಆಯ್ಕೆಗೆ ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ!",
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
        askLocation: "ಅರ್ಥವಾಯಿತು! ನಿಮ್ಮ <strong>ಪಿನ್‌ಕೋಡ್ ಅಥವಾ ನಗರ</strong> (ಉದಾ: ಒಟ್ಟಾಪಾಲಂ, ಪಾಲಕ್ಕಾಡ್) ಯಾವುದು?",
        pincodePlaceholder: "6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್...",
        cityPlaceholder: "ನಗರದ ಹೆಸರು...",
        locationPersonalization: "ಧನ್ಯವಾದಗಳು, <strong>{name}</strong>! <strong>{location}</strong> ಪ್ರದೇಶದ ಗ್ರಾಹಕರಿಗೆ ನೆಟ್‌ವರ್ಕ್ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ನೇರ ಕ್ಯಾಶ್‌ಲೆಸ್ ಸೌಲಭ್ಯ ಒದಗಿಸುತ್ತೇವೆ.",
        reviewMsg: "ಎಲ್ಲವೂ ಸಿದ್ಧವಾಗಿದೆ, <strong>{name}</strong>! <strong>{location}</strong> ಪಾಲಿಸಿ ವಿವರಗಳು ಸಿದ್ಧವಾಗಿವೆ. ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನಮ್ಮ ಪ್ರತಿನಿಧಿಯೊಂದಿಗೆ ಮಾತನಾಡಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ:",
        submitWaBtn: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ವಿವರ ಕಳುಹಿಸಿ (+91 9048360880)",
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

// STEP 1: Welcome & Ask Name
function renderStep1Welcome() {
    quoteState.step = 1;
    appendBotMessage(t('welcomeMsg'));
    renderStep2Name();
}

// STEP 2: Name Input
function renderStep2Name() {
    quoteState.step = 2;
    setTimeout(() => {
        appendBotMessage(t('askName'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleNameSubmit(event)" class="flex gap-2">
                <input type="text" id="input-name" placeholder="${t('namePlaceholder')}" required class="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="name" />
                <button type="submit" class="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-colors">
                    ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
            </form>
        `;
        document.getElementById('input-name')?.focus();
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
                    <select id="input-country-code" class="w-36 px-3 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold shadow-sm">
                        ${optionsHtml}
                    </select>
                    <input type="tel" id="input-phone" placeholder="${t('phonePlaceholder')}" required class="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="tel" />
                </div>
                <button type="submit" class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-colors">
                    ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
            </form>
        `;
        document.getElementById('input-phone')?.focus();
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
                    <input type="email" id="input-email" placeholder="${t('emailPlaceholder')}" class="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" autocomplete="email" />
                    <button type="submit" class="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-colors">
                        ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
                <button type="button" onclick="skipEmail()" class="text-xs text-slate-500 dark:text-slate-400 hover:underline block mx-auto pt-1 font-semibold">
                    ${t('skipEmailBtn')}
                </button>
            </form>
        `;
        document.getElementById('input-email')?.focus();
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
                <button onclick="selectCoverage('individual')" class="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-left transition-all group shadow-sm">
                    <div class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-lg mb-2 font-black">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-sky-600">${t('covIndividual')}</div>
                </button>
                <button onclick="selectCoverage('family')" class="p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-left transition-all group shadow-sm">
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
        quoteState.members = [{ relation: t('self'), mode: 'age', age: 30, dob: '' }];
        renderStep6Members();
    } else {
        appendUserMessage(t('covFamily'));
        quoteState.members = [
            { relation: t('self'), mode: 'age', age: 35, dob: '' },
            { relation: t('spouse'), mode: 'age', age: 32, dob: '' }
        ];
        renderStep6Members();
    }
};

// STEP 6: Members & Ages / DOB
function renderStep6Members() {
    quoteState.step = 6;
    setTimeout(() => {
        appendBotMessage(t('askMembers'));
        renderMembersInputForm();
    }, 300);
}

function renderMembersInputForm() {
    const inputArea = document.getElementById('quote-input-container');

    const rowsHtml = quoteState.members.map((m, index) => {
        return `
            <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                        <i class="fa-solid fa-user-tag"></i> ${m.relation}
                    </span>
                    ${quoteState.members.length > 1 ? `<button type="button" onclick="removeMember(${index})" class="text-rose-500 hover:text-rose-600 text-xs"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <select onchange="updateMemberMode(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]">
                            <option value="age" ${m.mode === 'age' ? 'selected' : ''}>${t('modeAge')}</option>
                            <option value="dob" ${m.mode === 'dob' ? 'selected' : ''}>${t('modeDob')}</option>
                        </select>
                    </div>
                    <div>
                        ${m.mode === 'age' 
                            ? `<input type="number" min="0" max="100" value="${m.age}" onchange="updateMemberAge(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]" placeholder="Age in Years" />`
                            : `<input type="date" value="${m.dob}" onchange="updateMemberDob(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]" />`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    inputArea.innerHTML = `
        <div class="space-y-3">
            <div class="max-h-48 overflow-y-auto space-y-2 pr-1">
                ${rowsHtml}
            </div>
            <div class="flex gap-2">
                <button type="button" onclick="addFamilyMember()" class="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 font-bold text-xs shadow-sm">
                    ${t('addMemberBtn')}
                </button>
                <button type="button" onclick="submitMembersStep()" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md">
                    ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>
    `;
}

window.updateMemberMode = function(idx, mode) {
    if (quoteState.members[idx]) {
        quoteState.members[idx].mode = mode;
        renderMembersInputForm();
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

window.removeMember = function(idx) {
    quoteState.members.splice(idx, 1);
    renderMembersInputForm();
};

window.addFamilyMember = function() {
    const relations = [t('child1'), t('child2'), t('father'), t('mother')];
    const nextRel = relations[quoteState.members.length - 1] || `Member ${quoteState.members.length + 1}`;
    quoteState.members.push({ relation: nextRel, mode: 'age', age: 10, dob: '' });
    renderMembersInputForm();
};

window.submitMembersStep = function() {
    const summary = quoteState.members.map(m => `${m.relation}: ${m.mode === 'dob' && m.dob ? m.dob : m.age + ' Yrs'}`).join(', ');
    appendUserMessage(summary);
    renderStep7Location();
};

// STEP 7: Location + Location Personalization Message
function renderStep7Location() {
    quoteState.step = 7;
    setTimeout(() => {
        appendBotMessage(t('askLocation'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleLocationSubmit(event)" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" id="input-pincode" placeholder="${t('pincodePlaceholder')}" maxlength="6" required class="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
                    <input type="text" id="input-city" placeholder="${t('cityPlaceholder')}" class="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
                </div>
                <button type="submit" class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-colors">
                    ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
            </form>
        `;
        document.getElementById('input-pincode')?.focus();
    }, 300);
}

window.handleLocationSubmit = function(e) {
    e.preventDefault();
    const pin = document.getElementById('input-pincode')?.value.trim();
    const city = document.getElementById('input-city')?.value.trim() || 'Ottapalam / Palakkad';

    quoteState.pincode = pin;
    quoteState.city = city;

    appendUserMessage(`${pin} - ${city}`);

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

        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <div class="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span><i class="fa-solid fa-circle-check mr-1"></i> ${t('verifiedTitle')}</span>
                    <span class="text-slate-500">${quoteState.countryCode} ${quoteState.phone}</span>
                </div>
                <div class="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p><strong>Name:</strong> ${quoteState.name}</p>
                    <p><strong>Coverage:</strong> ${quoteState.coverageType.toUpperCase()}</p>
                    <p><strong>Location:</strong> ${quoteState.pincode} (${quoteState.city})</p>
                </div>
                <a href="${waUrl}" target="_blank" class="block w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs text-center shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                    <i class="fa-brands fa-whatsapp text-lg"></i> ${t('submitWaBtn')}
                </a>
            </div>
        `;
    }, 400);
}
