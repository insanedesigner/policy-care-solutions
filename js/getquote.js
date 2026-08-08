/**
 * Policy Care Solutions - Interactive Multilingual Conversational Quote Generator
 * Support for English, Malayalam (മലയാളം), and Tamil (தமிழ்)
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
        if (icon) icon.className = 'fa-solid fa-moon text-sky-400 text-sm';
    } else {
        document.documentElement.classList.remove('dark');
        if (icon) icon.className = 'fa-solid fa-sun text-amber-500 text-sm';
    }
    localStorage.setItem('pcs_theme', theme);
}

window.toggleTheme = function() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGetQuoteFlow();
});

// Conversational State
const quoteState = {
    lang: 'en',
    step: 1,
    name: '',
    countryCode: '+91',
    phone: '',
    email: '',
    coverageType: 'family', // 'individual' or 'family'
    members: [], // [{ relation: 'Self', mode: 'age', age: 30, dob: '' }]
    pincode: '',
    district: '',
    city: ''
};

// Multilingual Dictionary
const i18n = {
    en: {
        welcomeMsg: "Hello! Welcome to <strong>Policy Care Solutions</strong> (Ottapalam & Palakkad). I am your insurance quote specialist. Which language do you prefer for our chat?",
        langSelectPrompt: "Please choose your preferred language:",
        askName: "Great! First, may I know your <strong>Full Name</strong>?",
        namePlaceholder: "Enter your full name...",
        askPhone: "Nice to meet you, <strong>{name}</strong>! What is your <strong>Contact Number</strong>? Please select your country code.",
        phonePlaceholder: "Enter mobile number...",
        askEmail: "Thank you! What is your <strong>Email Address</strong>? (This helps us send official policy brochures)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "Skip Email for Now",
        askCoverage: "Are you looking for insurance for <strong>yourself only (Individual)</strong> or for your <strong>family (Family Floater)</strong>?",
        covIndividual: "Individual Policy (Self Only)",
        covFamily: "Family Floater (Self, Spouse, Children, Parents)",
        askMembers: "Please select the family members you wish to include, and enter their age or Date of Birth:",
        addMemberBtn: "+ Add Member",
        askLocation: "Almost done! What is your <strong>Pincode</strong> or local town (e.g. Ottapalam, Palakkad, Shornur, Cherpulassery, Pattambi)?",
        pincodePlaceholder: "Enter 6-digit pincode...",
        cityPlaceholder: "Enter city or town name...",
        reviewMsg: "Thank you, <strong>{name}</strong>! I have compiled your complete insurance quote profile. Click below to connect with our Policy Care advisor team on WhatsApp now:",
        submitWaBtn: "Connect Live on WhatsApp (+91 9048360880)",
        nextBtn: "Continue",
        backBtn: "Back",
        verifiedTitle: "Client Quote Request Ready",
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
        welcomeMsg: "നമസ്കാരം! <strong>പോളിസി കെയർ സൊല്യൂഷൻസിലേക്ക്</strong> (ഒറ്റപ്പാലം & പാലക്കാട്) സ്വാഗതം. ഞാൻ നിങ്ങളുടെ ഇൻഷുറൻസ് അഡ്വൈസറാണ്. ഏത് ഭാഷയിലാണ് നിങ്ങൾക്ക് സംസാരിക്കാൻ താല്പര്യം?",
        langSelectPrompt: "ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:",
        askName: "വളരെ സന്തോഷം! ആദ്യം, നിങ്ങളുടെ <strong>പൂർണ്ണമായ പേര്</strong> അറിയിക്കാമോ?",
        namePlaceholder: "നിങ്ങളുടെ പേര് നൽകുക...",
        askPhone: "കണ്ടുമുട്ടിയതിൽ സന്തോഷം, <strong>{name}</strong>! നിങ്ങളുടെ <strong>ഫോൺ നമ്പർ</strong> എന്താണ്? കൺട്രി കോഡ് തിരഞ്ഞെടുക്കാം.",
        phonePlaceholder: "മൊബൈൽ നമ്പർ നൽകുക...",
        askEmail: "നന്ദി! നിങ്ങളുടെ <strong>ഇമെയിൽ വിലാസം</strong> എന്താണ്? (പോളിസി വിവരങ്ങൾ അയച്ചുതരാൻ സഹായിക്കും)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "ഇമെയിൽ ഇപ്പോൾ ഒഴിവാക്കുക",
        askCoverage: "നിങ്ങൾ ഇൻഷുറൻസ് നോക്കുന്നത് <strong>നിങ്ങൾക്ക് മാത്രമാണോ (Individual)</strong> അതോ <strong>കുടുംബത്തിനാണോ (Family Floater)</strong>?",
        covIndividual: "ഇൻഡിവിജ്വൽ പോളിസി (എനിക്ക് മാത്രം)",
        covFamily: "ഫാമിലി ഫ്ലോട്ടർ (എനിക്ക്, പങ്കാളി, മക്കൾ, മാതാപിതാക്കൾ)",
        askMembers: "പോളിസിയിൽ ഉൾപ്പെടുത്തേണ്ട കുടുംബാംഗങ്ങളെ തിരഞ്ഞെടുത്ത് പ്രായം അല്ലെങ്കിൽ ജനനത്തീയതി നൽകുക:",
        addMemberBtn: "+ അംഗത്തെ ചേർക്കുക",
        askLocation: "ഇനി ഒരു കാര്യം കൂടി! നിങ്ങളുടെ <strong>പിൻകോഡ്</strong> അല്ലെങ്കിൽ സ്ഥലം ഏതാണ് (ഉദാഹരണത്തിന്: ഒറ്റപ്പാലം, പാലക്കാട്, ഷൊർണ്ണൂർ, ചെറുപ്പുളശ്ശേരി, പട്ടാമ്പി)?",
        pincodePlaceholder: "6 അക്ക പിൻകോഡ് നൽകുക...",
        cityPlaceholder: "സ്ഥലത്തിന്റെ പേര് നൽകുക...",
        reviewMsg: "വളരെ നന്ദി, <strong>{name}</strong>! നിങ്ങളുടെ ഇൻഷുറൻസ് ക്വോട്ട് വിവരങ്ങൾ തയ്യാറാക്കി കഴിഞ്ഞു. വാട്സ്ആപ്പിൽ ഞങ്ങളുടെ അഡ്വൈസറുമായി നേരിട്ട് സംസാരിക്കാൻ താഴെ ക്ലിക്ക് ചെയ്യുക:",
        submitWaBtn: "വാട്സ്ആപ്പിൽ വിവരങ്ങൾ അയക്കുക (+91 9048360880)",
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
        welcomeMsg: "வணக்கம்! <strong>பாலிசி கேர் சொல்யூஷன்ஸுக்கு</strong> (ஒற்றப்பாலம் & பாலக்காடு) வரவேற்கிறோம். நான் உங்கள் இன்சூரன்ஸ் ஆலோசகர். எந்த மொழியில் பேச விரும்புகிறீர்கள்?",
        langSelectPrompt: "தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:",
        askName: "மிக்க மகிழ்ச்சி! முதலில் உங்கள் <strong>முழு பெயர்</strong> என்ன?",
        namePlaceholder: "உங்கள் பெயரை உள்ளிடவும்...",
        askPhone: "உங்களைச் சந்தித்ததில் மகிழ்ச்சி, <strong>{name}</strong>! உங்கள் <strong>மொபைல் எண்</strong> என்ன? நாட்டின் குறியீட்டைத் தேர்ந்தெடுக்கவும்.",
        phonePlaceholder: "மொபைல் எண் உள்ளிடவும்...",
        askEmail: "நன்றி! உங்கள் <strong>மின்னஞ்சல் முகவரி</strong> என்ன? (பாலிசி விவரங்களை அனுப்ப உதவும்)",
        emailPlaceholder: "name@example.com",
        skipEmailBtn: "மின்னஞ்சலைத் தவிர்க்கவும்",
        askCoverage: "நீங்கள் இன்சூரன்ஸ் <strong>உங்களுக்கு மட்டும் (Individual)</strong> பார்க்கிறீர்களா அல்லது <strong>குடும்பத்திற்கா (Family Floater)</strong>?",
        covIndividual: "தனிநபர் பாலிசி (எனக்கு மட்டும்)",
        covFamily: "குடும்ப பாலிசி (எனக்கு, துணைவர், பிள்ளைகள், பெற்றோர்)",
        askMembers: "பாலிசியில் சேர்க்க வேண்டிய குடும்ப உறுப்பினர்களைத் தேர்ந்தெடுத்து வயது அல்லது பிறந்த தேதியை உள்ளிடவும்:",
        addMemberBtn: "+ உறுப்பினரைச் சேர்",
        askLocation: "கடைசியாக, உங்கள் <strong>பின்கோடு</strong> அல்லது ஊர் எது (எ.கா: ஒற்றப்பாலம், பாலக்காடு, ஷொர்ணூர்)?",
        pincodePlaceholder: "6 இலக்க பின்கோடு...",
        cityPlaceholder: "ஊர் பெயர்...",
        reviewMsg: "மிக்க நன்றி, <strong>{name}</strong>! உங்கள் இன்சூரன்ஸ் குவாட் விவரங்கள் தயார். வாட்ஸ்அப்பில் எங்களோடு பேச கீழே கிளிக் செய்யவும்:",
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
    }
};

// Country Codes Registry
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

function initGetQuoteFlow() {
    renderStep1Language();
}

function t(key) {
    const dict = i18n[quoteState.lang] || i18n.en;
    return dict[key] || i18n.en[key] || '';
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
        <div class="bg-slate-800/90 text-slate-100 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 max-w-lg text-xs leading-relaxed shadow-md">
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

function updateLangBadge() {
    const badge = document.getElementById('selected-lang-label');
    if (badge) {
        if (quoteState.lang === 'ml') badge.innerText = 'മലയാളം';
        else if (quoteState.lang === 'ta') badge.innerText = 'தமிழ்';
        else badge.innerText = 'English';
    }
}

// STEP 1: Language Selection
function renderStep1Language() {
    quoteState.step = 1;
    appendBotMessage(i18n.en.welcomeMsg);

    const inputArea = document.getElementById('quote-input-container');
    if (!inputArea) return;

    inputArea.innerHTML = `
        <div class="space-y-3">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">${i18n.en.langSelectPrompt}</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onclick="selectLanguage('en')" class="p-4 rounded-2xl bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-500 text-left transition-all group">
                    <div class="text-xl mb-1">🇬🇧</div>
                    <div class="font-extrabold text-sm text-white group-hover:text-sky-400">English</div>
                    <div class="text-[11px] text-slate-400">Continue in English</div>
                </button>
                <button onclick="selectLanguage('ml')" class="p-4 rounded-2xl bg-slate-800 hover:bg-teal-950 border border-slate-700 hover:border-teal-500 text-left transition-all group">
                    <div class="text-xl mb-1">🇮🇳</div>
                    <div class="font-extrabold text-sm text-white group-hover:text-teal-400">മലയാളം</div>
                    <div class="text-[11px] text-slate-400">മലയാളത്തിൽ തുടരുക</div>
                </button>
                <button onclick="selectLanguage('ta')" class="p-4 rounded-2xl bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-left transition-all group">
                    <div class="text-xl mb-1">🇮🇳</div>
                    <div class="font-extrabold text-sm text-white group-hover:text-emerald-400">தமிழ்</div>
                    <div class="text-[11px] text-slate-400">தமிழில் தொடரவும்</div>
                </button>
            </div>
        </div>
    `;
}

window.selectLanguage = function(langCode) {
    quoteState.lang = langCode;
    updateLangBadge();

    let langName = "English";
    if (langCode === 'ml') langName = "മലയാളം";
    if (langCode === 'ta') langName = "தமிழ்";

    appendUserMessage(langName);
    renderStep2Name();
};

// STEP 2: Name
function renderStep2Name() {
    quoteState.step = 2;
    setTimeout(() => {
        appendBotMessage(t('askName'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleNameSubmit(event)" class="flex gap-2">
                <input type="text" id="input-name" placeholder="${t('namePlaceholder')}" required class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" autocomplete="name" />
                <button type="submit" class="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors">
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
                    <select id="input-country-code" class="w-36 px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold">
                        ${optionsHtml}
                    </select>
                    <input type="tel" id="input-phone" placeholder="${t('phonePlaceholder')}" required class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" autocomplete="tel" />
                </div>
                <button type="submit" class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors">
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
        appendBotMessage(t('askEmail'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleEmailSubmit(event)" class="space-y-2">
                <div class="flex gap-2">
                    <input type="email" id="input-email" placeholder="${t('emailPlaceholder')}" class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" autocomplete="email" />
                    <button type="submit" class="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors">
                        ${t('nextBtn')} <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
                <button type="button" onclick="skipEmail()" class="text-xs text-slate-400 hover:text-white underline block mx-auto pt-1">
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
        appendBotMessage(t('askCoverage'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onclick="selectCoverage('individual')" class="p-4 rounded-2xl bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-500 text-left transition-all group">
                    <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-lg mb-2 font-black">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="font-extrabold text-sm text-white group-hover:text-sky-400">${t('covIndividual')}</div>
                </button>
                <button onclick="selectCoverage('family')" class="p-4 rounded-2xl bg-slate-800 hover:bg-teal-950 border border-slate-700 hover:border-teal-500 text-left transition-all group">
                    <div class="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg mb-2 font-black">
                        <i class="fa-solid fa-people-roof"></i>
                    </div>
                    <div class="font-extrabold text-sm text-white group-hover:text-teal-400">${t('covFamily')}</div>
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
            <div class="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                        <i class="fa-solid fa-user-tag"></i> ${m.relation}
                    </span>
                    ${quoteState.members.length > 1 ? `<button type="button" onclick="removeMember(${index})" class="text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <select onchange="updateMemberMode(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]">
                            <option value="age" ${m.mode === 'age' ? 'selected' : ''}>${t('modeAge')}</option>
                            <option value="dob" ${m.mode === 'dob' ? 'selected' : ''}>${t('modeDob')}</option>
                        </select>
                    </div>
                    <div>
                        ${m.mode === 'age' 
                            ? `<input type="number" min="0" max="100" value="${m.age}" onchange="updateMemberAge(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]" placeholder="Age in Years" />`
                            : `<input type="date" value="${m.dob}" onchange="updateMemberDob(${index}, this.value)" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]" />`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');

    inputArea.innerHTML = `
        <div class="space-y-3">
            <div class="max-h-56 overflow-y-auto space-y-2 pr-1">
                ${rowsHtml}
            </div>
            <div class="flex gap-2">
                <button type="button" onclick="addFamilyMember()" class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 font-bold text-xs">
                    ${t('addMemberBtn')}
                </button>
                <button type="button" onclick="submitMembersStep()" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs">
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

// STEP 7: Location
function renderStep7Location() {
    quoteState.step = 7;
    setTimeout(() => {
        appendBotMessage(t('askLocation'));
        const inputArea = document.getElementById('quote-input-container');
        inputArea.innerHTML = `
            <form onsubmit="handleLocationSubmit(event)" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" id="input-pincode" placeholder="${t('pincodePlaceholder')}" maxlength="6" required class="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <input type="text" id="input-city" placeholder="${t('cityPlaceholder')}" class="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <button type="submit" class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors">
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
    renderStep8Review();
};

// STEP 8: Final Review & WhatsApp Lead Transfer
function renderStep8Review() {
    quoteState.step = 8;
    setTimeout(() => {
        const reviewText = t('reviewMsg').replace('{name}', quoteState.name);
        appendBotMessage(reviewText);

        const memberSummaryLines = quoteState.members.map(m => `• ${m.relation}: ${m.mode === 'dob' && m.dob ? 'DOB ' + m.dob : m.age + ' Years'}`).join('\n');

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
            <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div class="flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2">
                    <span><i class="fa-solid fa-circle-check mr-1"></i> ${t('verifiedTitle')}</span>
                    <span class="text-slate-400">${quoteState.countryCode} ${quoteState.phone}</span>
                </div>
                <div class="text-xs text-slate-300 space-y-1">
                    <p><strong>Name:</strong> ${quoteState.name}</p>
                    <p><strong>Coverage:</strong> ${quoteState.coverageType.toUpperCase()}</p>
                    <p><strong>Location:</strong> ${quoteState.pincode} (${quoteState.city})</p>
                </div>
                <a href="${waUrl}" target="_blank" class="block w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs text-center shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                    <i class="fa-brands fa-whatsapp text-lg"></i> ${t('submitWaBtn')}
                </a>
            </div>
        `;
    }, 300);
}
