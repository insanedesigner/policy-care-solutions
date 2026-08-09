/**
 * Policy Care Solutions - Understand Health Insurance Before Buying (UBB) Guide
 * Multilingual Support: Malayalam (മലയാളം), English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिंदी), Kannada (കನ್ನಡ)
 */

// Theme System
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

// Language State
const ubbState = {
    lang: 'ml', // Default to Malayalam base
    checkedRules: new Set()
};

// Multilingual Dictionary
const ubbI18n = {
    ml: {
        pageTitle: "ഹെൽത്ത് ഇൻഷുറൻസ്: പോളിസി എടുക്കുന്നതിനു മുൻപും ക്ലെയിം നിരസിക്കപ്പെടുമ്പോഴും അറിഞ്ഞിരിക്കേണ്ട കാര്യങ്ങൾ",
        pageSub: "മിക്ക ആളുകളും പോളിസി എടുക്കുമ്പോൾ രേഖകൾ മുഴുവൻ വായിക്കാറില്ല. ആശുപത്രിയിലെത്തിയ ശേഷം 'ഇത് കവർ ചെയ്യില്ല' എന്ന് അറിയുന്നതിന് പകരം ഈ ലളിതമായ മാർഗ്ഗനിർദ്ദേശം വായിക്കൂ.",
        quickSummaryTag: "അത്യാവശ്യ മാർഗ്ഗനിർദ്ദേശം",
        sec1Title: "1. വെയിറ്റിംഗ് പീരിയഡ് – ഏറ്റവും വലിയ തെറ്റിദ്ധാരണ",
        sec1Desc: "പോളിസി എടുത്ത ദിവസം മുതൽ എല്ലാ രോഗങ്ങൾക്കും കവർ ലഭിക്കില്ല.",
        tab30Days: "ആദ്യ 30 ദിവസം",
        tab30DaysDesc: "അപകടങ്ങൾ ഒഴികെ മറ്റ് രോഗങ്ങൾക്ക് ആദ്യ 30 ദിവസം കവർ ലഭിക്കില്ല.",
        tab24Months: "ആദ്യ 24 മാസം (ചില രോഗങ്ങൾ/ശസ്ത്രക്രിയകൾ)",
        tab24MonthsDesc: "ചില രോഗങ്ങൾക്കും ശസ്ത്രക്രിയകൾക്കും 2 വർഷത്തെ കാത്തിരിപ്പ് ബാധകമാണ്.",
        surgeriesList: [
            "ടോൺസിൽ, അഡിനോയ്ഡ്, സൈനസ് ശസ്ത്രക്രിയ",
            "ഹെർണിയ (Hernia)",
            "മൂലക്കുരു, ഫിസ്റ്റുല (Piles & Fistula)",
            "കാറ്ററാക്റ്റ് (Cataract / തിമിരം)",
            "മുട്ട് മാറ്റിവയ്ക്കൽ (Knee Replacement)",
            "ഗർഭാശയ സംബന്ധമായ ചില ശസ്ത്രക്രിയകൾ",
            "പിത്താശയ, മൂത്രാശയ കല്ല് (Gallbladder & Kidney Stones)"
        ],
        waitingNote: "ശ്രദ്ധിക്കുക: ഈ രോഗം പോളിസി എടുത്തതിന് ശേഷമാണ് വന്നതെങ്കിലും 24 മാസത്തെ കാത്തിരിപ്പ് ബാധകമായിരിക്കും.",
        tab36Months: "നിലവിലുള്ള രോഗങ്ങൾ (Pre-existing Disease)",
        tab36MonthsDesc: "പോളിസി എടുക്കുന്നതിന് മുമ്പേ ഉണ്ടായിരുന്ന രോഗങ്ങൾക്ക് പരമാവധി 36 മാസത്തെ കാത്തിരിപ്പ് ബാധകമാണ്.",
        cancerNoteTitle: "ഒരു പ്രധാന കാര്യം (കാൻസർ കവറേജ്):",
        cancerNoteDesc: "പല പോളിസികളിലും കാൻസർ 24 മാസത്തെ പട്ടികയിൽ ഉൾപ്പെടുന്നില്ല. സാധാരണയായി 30 ദിവസത്തിന് ശേഷം കവർ ലഭിക്കാം. എന്നാൽ നിങ്ങളുടെ പോളിസിയിലെ വ്യവസ്ഥകൾ നിർബന്ധമായും പരിശോധിക്കുക.",

        sec2Title: "2. ആരോഗ്യ വിവരങ്ങൾ മറച്ചുവയ്ക്കരുത്",
        sec2Desc: "പോളിസി എടുക്കുമ്പോൾ ചോദിക്കുന്ന എല്ലാ ആരോഗ്യ വിവരങ്ങളും സത്യസന്ധമായി നൽകണം. പ്രഷർ, പ്രമേഹം, തൈറോയ്ഡ് തുടങ്ങിയ രോഗങ്ങൾ മറച്ചുവയ്ക്കുന്നത് വലിയ അപകടമാണ്.",
        hiddenConsequencesTitle: "വിവരങ്ങൾ മറച്ചുവച്ചാൽ സംഭവിക്കുന്നത്:",
        hiddenConsequences: [
            "പോളിസി റദ്ദാക്കാം (Policy Cancellation)",
            "ക്ലെയിം പൂർണ്ണമായി നിരസിക്കാം (Claim Rejection)",
            "അടച്ച പ്രീമിയം തുക നഷ്ടപ്പെടാം",
            "ചില സാഹചര്യങ്ങളിൽ നിയമനടപടിയും ഉണ്ടാകാം"
        ],
        truthResultsTitle: "സത്യസന്ധമായി വെളിപ്പെടുത്തിയാൽ സാധാരണ സംഭവിക്കുന്നത്:",
        truthResults: [
            "സാധാരണ രീതിയിൽ പോളിസി അനുവദിക്കും",
            "അല്ലെങ്കിൽ ചെറിയ അധിക പ്രീമിയം ഈടാക്കും (Loading)",
            "അല്ലെങ്കിൽ ആ രോഗത്തിന് മാത്രം അധിക വെയിറ്റിംഗ് പീരിയഡ് നൽകും"
        ],
        disclosureTakeaway: "ഇവയൊന്നും ക്ലെയിം നിരസിക്കപ്പെടുന്നതിനേക്കാൾ വലിയ പ്രശ്നമല്ല!",

        sec3Title: "3. അഞ്ച് വർഷത്തെ മൊറട്ടോറിയം സംരക്ഷണം (Moratorium Period)",
        sec3Desc: "IRDAI നിയമപ്രകാരം തുടർച്ചയായി അഞ്ച് വർഷം പോളിസി നിലനിർത്തിയാൽ, പിന്നീട് 'വിവരങ്ങൾ മറച്ചുവച്ചു' എന്ന കാരണം പറഞ്ഞ് സാധാരണ സാഹചര്യങ്ങളിൽ ക്ലെയിം നിരസിക്കാൻ കമ്പനിക്ക് കഴിയില്ല.",
        moratoriumExceptionsTitle: "എന്നാൽ താഴെ പറയുന്നവയ്ക്ക് മൊറട്ടോറിയം ബാധകമല്ല:",
        moratoriumExceptions: [
            "മനഃപൂർവ്വമായ വഞ്ചന (Fraudulent Claims)",
            "പോളിസിയിൽ സ്ഥിരമായി ഒഴിവാക്കിയ കാര്യങ്ങൾ (Permanent Exclusions)",
            "കോ-പേ (Co-pay percentages)",
            "റൂം റെന്റ് പരിധി (Room Rent Capping)",
            "സബ്-ലിമിറ്റുകൾ (Sub-limits)"
        ],
        sumInsuredIncreaseNote: "ശ്രദ്ധിക്കുക: ഇൻഷുറൻസ് തുക കൂട്ടിയാൽ, കൂട്ടിയ തുകയ്ക്ക് അഞ്ച് വർഷത്തെ കാലയളവ് വീണ്ടും തുടങ്ങും.",

        sec4Title: "4. പോളിസി ഒരിക്കലും ലാപ്സ് ആകരുത്",
        sec4Desc: "ഒരു ദിവസം പോലും പോളിസി മുടങ്ങാതിരിക്കാൻ ശ്രദ്ധിക്കുക.",
        lapseLossesTitle: "ലാപ്സ് ആയാൽ നഷ്ടമാകുന്നത്:",
        lapseLosses: [
            "വെയിറ്റിംഗ് പീരിയഡ് പൂർത്തിയായ ആനുകൂല്യം",
            "മൊറട്ടോറിയം കാലയളവ് സംരക്ഷണം",
            "ശേഖരിച്ച നോ-ക്ലെയിം ബോണസ് (No Claim Bonus)",
            "മറ്റു തുടർച്ചാ ആനുകൂല്യങ്ങൾ (Cumulative Continuity Benefits)"
        ],
        gracePeriodWarning: "ഗ്രേസ് പീരിയഡ് ലഭിച്ചാലും ആ ദിവസങ്ങളിൽ സാധാരണയായി ഇൻഷുറൻസ് കവർ ഉണ്ടായിരിക്കില്ല. ഓട്ടോ ഡെബിറ്റ് (Auto-Debit) സംവിധാനം ഉപയോഗിക്കുന്നത് നല്ലതാണ്.",

        sec5Title: "5. കമ്പനി ഇൻഷുറൻസ് (Corporate Policy) മാത്രം മതിയോ?",
        sec5Answer: "ഉത്തരം – ഇല്ല!",
        sec5Reasons: [
            "ജോലി നഷ്ടപ്പെട്ടാലോ മാറിയാലോ ഇൻഷുറൻസ് കവറേജ് അവസാനിക്കും.",
            "കവറേജ് തുക പലപ്പോഴും കുടുംബത്തിന്റെ ചികിത്സയ്ക്ക് പര്യാപ്തമല്ല.",
            "കമ്പനിക്ക് എപ്പോൾ വേണമെങ്കിലും പോളിസി നിബന്ധനകൾ മാറ്റാം."
        ],
        sec5Advice: "അതുകൊണ്ട് സ്വന്തമായി ഒരു വ്യക്തിഗത ഹെൽത്ത് ഇൻഷുറൻസ് (Personal Health Policy) ഉണ്ടായിരിക്കണം. മാതാപിതാക്കൾക്ക് പ്രത്യേകം പോളിസി എടുക്കുന്നതാണ് കൂടുതൽ സുരക്ഷിതം.",

        sec6Title: "6. ഗുരുതര രോഗം വന്ന ശേഷം പോളിസി പോർട്ട് ചെയ്യരുത്",
        sec6Desc: "രോഗം കണ്ടെത്തിയ ശേഷം ഇൻഷുറൻസ് കമ്പനി മാറുന്നത് (Portability) പലപ്പോഴും ദോഷകരമാകാം.",
        portRisks: [
            "പുതിയ കമ്പനി ആ രോഗത്തെ പൂർണ്ണമായി ഒഴിവാക്കാം (Exclusion)",
            "പോളിസി അപേക്ഷ നിരസിക്കാം (Rejection)",
            "പുതിയ വെയിറ്റിംഗ് പീരിയഡ് വീണ്ടും നൽകാം"
        ],
        portAdvice: "നിലവിലുള്ള പോളിസി തുടരുകയും ആവശ്യമെങ്കിൽ പുതിയൊരു പോളിസി അധികമായി എടുക്കുകയും ചെയ്യുന്നതാണ് നല്ലത്.",

        sec7Title: "7. ക്ലെയിം നിരസിച്ചാൽ എന്ത് ചെയ്യണം?",
        sec7Desc: "ആദ്യം നിരസിക്കലിന്റെ കാരണം കൃത്യമായി മനസ്സിലാക്കുക.",
        claimSteps: [
            { step: "1", title: "ക്ലെയിം നിരസിക്കൽ കത്ത് വായിക്കുക", text: "കമ്പനി നൽകിയ Rejection Letter ലെ കാരണം പരിശോധിക്കുക." },
            { step: "2", title: "ആവശ്യപ്പെട്ട രേഖകൾ നൽകുക", text: "ചികിത്സാ രേഖകൾ തീയതിയോടെ വീണ്ടും നൽകുക." },
            { step: "3", title: "Grievance Officer-ന് പരാതി നൽകുക", text: "ഇൻഷുറൻസ് കമ്പനിയുടെ പരാതി പരിഹാര ഓഫീസറെ സമീപിക്കുക." },
            { step: "4", title: "IRDAI Bima Bharosa പോർട്ടൽ", text: "പരാതി പരിഹരിക്കപ്പെട്ടില്ലെങ്കിൽ Bima Bharosa പോർട്ടലിൽ രജിസ്റ്റർ ചെയ്യുക." },
            { step: "5", title: "Insurance Ombudsman", text: "സൗജന്യ നിയമ സഹായത്തിനായി ഇൻഷുറൻസ് ഓംബുഡ്സ്മാനെ സമീപിക്കുക." }
        ],

        sec8Title: "8. പോളിസി വാങ്ങുന്നതിന് മുമ്പ് നിർബന്ധമായും പരിശോധിക്കേണ്ട 5 കാര്യങ്ങൾ",
        checkItems: [
            { title: "റൂം റെന്റ് പരിധി (Room Rent Limit)", text: "പരിധിയുള്ള പോളിസികളിൽ ആശുപത്രി ബില്ലിന്റെ വലിയ ഭാഗം സ്വന്തമായി നൽകേണ്ടിവരാം." },
            { title: "കോ-പേ (Co-pay)", text: "ഓരോ ക്ലെയിമിലും നിങ്ങൾ സ്വന്തം കൈയ്യിൽ നിന്ന് അടയ്ക്കേണ്ട ശതമാനം എത്രയാണെന്ന് നോക്കുക." },
            { title: "സബ്-ലിമിറ്റുകൾ (Sub-limits)", text: "ചില ശസ്ത്രക്രിയകൾക്കും ചികിത്സകൾക്കും പ്രത്യേക പരിധിയുണ്ടോ എന്ന് പരിശോധിക്കുക." },
            { title: "ബോണസ് & റീസ്റ്റോറേഷൻ (Restoration)", text: "ക്ലെയിം ചെയ്യാത്ത വർഷങ്ങളിൽ ഇൻഷുറൻസ് തുക വർധിക്കുമോ എന്ന് നോക്കുക." },
            { title: "നെറ്റ്‌വർക്ക് ആശുപത്രികൾ (Network Hospitals)", text: "നിങ്ങൾ സ്ഥിരമായി ആശ്രയിക്കുന്ന ആശുപത്രി നെറ്റ്‌വർക്കിലുണ്ടോ എന്ന് ഉറപ്പാക്കുക." }
        ],

        sec9Title: "9. ഒ.പി. (Outpatient) ചികിത്സ സാധാരണയായി കവർ ചെയ്യില്ല",
        sec9Desc: "മിക്ക ഹെൽത്ത് ഇൻഷുറൻസ് പോളിസികളും 24 മണിക്കൂർ ആശുപത്രിയിൽ അഡ്മിറ്റ് ആയ ചികിത്സകൾക്കാണ് ബാധകമാകുന്നത്.",
        opExclusions: ["ഡോക്ടർ കൺസൾട്ടേഷൻ ഫീസ്", "പതിവ് ലബോറട്ടറി പരിശോധനകൾ", "സ്കാനുകൾ", "ദിവസേനയുള്ള മരുന്നുകൾ", "ഫോളോ-അപ്പ് സന്ദർശനങ്ങൾ"],
        opAdvice: "അതുകൊണ്ട് ഇത്തരം OP ചെലവുകൾക്കായി പ്രത്യേകം സാമ്പത്തിക പദ്ധതി തയ്യാറാക്കുക.",

        sec10Title: "10. ഏത് ഇൻഷുറൻസ് കമ്പനി തിരഞ്ഞെടുക്കണം?",
        sec10Desc: "പരസ്യങ്ങളിൽ കാണുന്ന Claim Settlement Ratio മാത്രം നോക്കരുത്.",
        sec10Factors: [
            "Claim Settlement Ratio (CSR) - ക്ലെയിം തീർപ്പാക്കൽ ശതമാനം",
            "Incurred Claim Ratio (ICR) - ഇൻഷുറൻസ് കമ്പനിയുടെ സാമ്പത്തിക ഭദ്രത",
            "പരാതികളുടെ എണ്ണവും പരിഹാര വേഗതയും"
        ],

        sec11Title: "11. ഏജന്റ് ക്ലെയിം പാസാക്കുമോ?",
        sec11Answer: "ഇല്ല!",
        sec11Desc: "ഏജന്റിന് രേഖകൾ തയ്യാറാക്കാൻ സഹായിക്കാനും ക്ലെയിം പിന്തുടരാനും കഴിയും. എന്നാൽ ക്ലെയിം അംഗീകരിക്കാനോ നിരസിക്കാനോ അധികാരമില്ല. ഏജന്റ് വഴി എടുത്താലും നേരിട്ട് എടുത്താലും പ്രീമിയം ഒരുപോലെയാണ്.",

        sec12Title: "ഓർമ്മിക്കേണ്ട 12 പ്രധാന കാര്യങ്ങൾ (Checklist)",
        rulesList: [
            "ചെറുപ്പത്തിൽ തന്നെ ഹെൽത്ത് ഇൻഷുറൻസ് എടുക്കുക.",
            "എല്ലാ ആരോഗ്യ വിവരങ്ങളും സത്യസന്ധമായി നൽകുക.",
            "പോളിസി ഒരിക്കലും ലാപ്സ് ആകരുത്.",
            "ഓട്ടോ ഡെബിറ്റ് സംവിധാനം ഉപയോഗിക്കുക.",
            "കമ്പനി ഇൻഷുറൻസിനെ മാത്രം ആശ്രയിക്കരുത്.",
            "മാതാപിതാക്കൾക്ക് പ്രത്യേകം പോളിസി എടുക്കുക.",
            "ഗുരുതര രോഗത്തിന് ശേഷം പോളിസി പോർട്ട് ചെയ്യരുത്.",
            "റൂം റെന്റ് പരിധിയും കോ-പേയും പരിശോധിക്കുക.",
            "ബോണസ് വിവരങ്ങൾ ഇടയ്ക്കിടെ ഉറപ്പാക്കുക.",
            "ക്ലെയിം നിരസിച്ചാൽ കാരണം രേഖാമൂലം ചോദിക്കുക.",
            "Bima Bharosa, Insurance Ombudsman എന്നീ സൗജന്യ സംവിധാനങ്ങൾ ഉപയോഗിക്കുക.",
            "എല്ലാ ചികിത്സാ രേഖകളും തീയതിയോടെ സൂക്ഷിക്കുക."
        ],

        closingQuote: "ഹെൽത്ത് ഇൻഷുറൻസ് ഒരു ചെലവല്ല, ഒരു സാമ്പത്തിക സുരക്ഷയാണ്.",
        closingDesc: "ഒരു പോളിസി വാങ്ങുന്നതിന് മുമ്പ് അതിലെ പ്രധാന നിബന്ധനകൾ വായിക്കാൻ ഒരു മണിക്കൂർ ചെലവഴിച്ചാൽ, ഭാവിയിൽ ലക്ഷക്കണക്കിന് രൂപയുടെ നഷ്ടം ഒഴിവാക്കാൻ കഴിയും.",
        ctaTitle: "നിങ്ങളുടെ കുടുംബത്തിനായി മികച്ച ഇൻഷുറൻസ് പ്ലാൻ ഉടൻ കണ്ടെത്തൂ!",
        ctaWaBtn: "വാട്സ്ആപ്പിൽ വിവരങ്ങൾ നേടുക",
        ctaAiBotBtn: "AI Quote Assistant ആരംഭിക്ക്",
        callAdvisorBtn: "അഡ്വൈസറുമായി സംസാരിക്കുക (+91 9048360880)"
    },

    en: {
        pageTitle: "Health Insurance Guide: Things to Know Before Buying & When Claims are Rejected",
        pageSub: "Most people do not read policy terms thoroughly before buying, realizing exclusions only after hospitalization. Here is a simplified comprehensive guide by Policy Care Solutions.",
        quickSummaryTag: "Essential Buying Guide",
        sec1Title: "1. Waiting Period – The Biggest Misconception",
        sec1Desc: "Insurance does not cover all illnesses from Day 1 of policy issuance.",
        tab30Days: "Initial 30 Days",
        tab30DaysDesc: "Except for accidental emergencies, no medical illnesses are covered during the first 30 days.",
        tab24Months: "First 24 Months (Specific Surgeries/Conditions)",
        tab24MonthsDesc: "A 2-year waiting period applies to specific conditions and surgeries.",
        surgeriesList: [
            "Tonsils, Adenoids, and Sinus surgeries",
            "Hernia repair",
            "Piles, Fistula & Fissures",
            "Cataract surgery",
            "Joint & Knee Replacement",
            "Uterine & Gynaecological surgeries",
            "Gallbladder & Kidney stones"
        ],
        waitingNote: "Note: Even if diagnosed post-policy inception, the 24-month waiting period strictly applies.",
        tab36Months: "Pre-existing Diseases (PED)",
        tab36MonthsDesc: "Conditions existing prior to purchasing the policy have a maximum waiting period of up to 36 months.",
        cancerNoteTitle: "Important Note (Cancer Coverage):",
        cancerNoteDesc: "In most policies, cancer is NOT in the 24-month waiting list and is usually covered after 30 days unless pre-existing. Always check your specific policy terms.",

        sec2Title: "2. Never Hide Health Details (Full Disclosure)",
        sec2Desc: "Disclose all pre-existing conditions truthfully during policy application. Hiding BP, Diabetes, or Thyroid to lower premium is extremely dangerous.",
        hiddenConsequencesTitle: "If health details are hidden:",
        hiddenConsequences: [
            "Policy cancellation by insurer",
            "Total claim rejection",
            "Forfeiture of paid premium",
            "Possible legal complications"
        ],
        truthResultsTitle: "If health details are disclosed honestly:",
        truthResults: [
            "Policy issued normally",
            "Slight premium loading applied if required",
            "Specific waiting period assigned for disclosed condition"
        ],
        disclosureTakeaway: "None of these are worse than experiencing a total claim rejection at the hospital!",

        sec3Title: "3. 5-Year Moratorium Protection (IRDAI Rule)",
        sec3Desc: "As per IRDAI regulations, if a policy is continuously renewed for 5 years, the insurer cannot reject claims citing non-disclosure under normal circumstances.",
        moratoriumExceptionsTitle: "Moratorium protection does NOT apply to:",
        moratoriumExceptions: [
            "Proven Fraudulent Claims",
            "Permanent Policy Exclusions",
            "Co-payment clauses",
            "Room Rent Capping limits",
            "Specific Sub-limits"
        ],
        sumInsuredIncreaseNote: "Note: If you increase the Sum Insured, a fresh 5-year moratorium period applies to the enhanced amount.",

        sec4Title: "4. Never Let Your Policy Lapse",
        sec4Desc: "Ensure continuous renewal without even a single day break.",
        lapseLossesTitle: "Consequences of policy lapse:",
        lapseLosses: [
            "Loss of completed waiting period credits",
            "Loss of moratorium period protection",
            "Loss of accumulated No-Claim Bonus (NCB)",
            "Loss of continuity benefits across portability"
        ],
        gracePeriodWarning: "Note: Medical cover is inactive during grace period days. Setting up Auto-Debit is highly recommended.",

        sec5Title: "5. Is Corporate / Company Health Policy Enough?",
        sec5Answer: "Answer – NO!",
        sec5Reasons: [
            "Insurance ends immediately upon job loss or resignation.",
            "Sum insured is often insufficient for major critical care.",
            "Employers can alter policy terms or terms annually."
        ],
        sec5Advice: "Maintain your personal family health policy. Secure separate individual policies for elderly parents.",

        sec6Title: "6. Avoid Porting Policy After Critical Diagnosis",
        sec6Desc: "Switching insurers after being diagnosed with a major disease can be detrimental.",
        portRisks: [
            "New insurer may permanently exclude the diagnosed disease",
            "Portability application may be rejected",
            "Fresh waiting periods may be imposed"
        ],
        portAdvice: "Retain your existing policy and opt for a secondary top-up policy if extra coverage is needed.",

        sec7Title: "7. What to Do If a Claim is Rejected?",
        sec7Desc: "First, analyze the exact ground of rejection stated in the repudiation letter.",
        claimSteps: [
            { step: "1", title: "Read Rejection Letter", text: "Examine the specific clause referenced by the claims desk." },
            { step: "2", title: "Submit Supporting Records", text: "Provide complete dated medical records and doctor certificates." },
            { step: "3", title: "Escalate to Grievance Officer", text: "Lodge a formal appeal with the insurer's Grievance Redressal Officer." },
            { step: "4", title: "IRDAI Bima Bharosa Portal", text: "Escalate unsolved grievances on the official IRDAI portal." },
            { step: "5", title: "Insurance Ombudsman", text: "Approach the free Insurance Ombudsman for binding resolution." }
        ],

        sec8Title: "8. Top 5 Parameters to Check Before Buying",
        checkItems: [
            { title: "Room Rent Capping", text: "Proportionate deductions apply if room rent limits are exceeded." },
            { title: "Co-Payment", text: "Check your percentage share out-of-pocket for every claim." },
            { title: "Sub-Limits", text: "Check specific capping on surgeries, day-care & procedures." },
            { title: "Bonus & Restoration", text: "Verify automatic restoration of sum insured and NCB growth." },
            { title: "Network Hospitals", text: "Confirm cashless facility at your preferred local hospitals." }
        ],

        sec9Title: "9. Outpatient (OP) Expenses Are Excluded",
        sec9Desc: "Standard health policies cover inpatient treatments requiring 24-hour hospitalization.",
        opExclusions: ["Doctor consultation fees", "Routine diagnostic lab tests", "MRI / CT Scans", "Daily outpatient medicines", "Follow-up clinic visits"],
        opAdvice: "Maintain an emergency fund for routine OP expenses.",

        sec10Title: "10. How to Choose the Right Insurance Company?",
        sec10Desc: "Do not rely solely on advertised Claim Settlement Ratios.",
        sec10Factors: [
            "Claim Settlement Ratio (CSR) - Percentage of claims paid",
            "Incurred Claim Ratio (ICR) - Financial solvency indicator (Ideal: 65% - 85%)",
            "Grievance volume and resolution speed"
        ],

        sec11Title: "11. Can an Insurance Agent Approve Claims?",
        sec11Answer: "No!",
        sec11Desc: "Insurance agents assist with documentation and follow-ups but have zero authority to approve or reject claims. Premiums are identical whether bought through an agent or directly online.",

        sec12Title: "12 Golden Rules Checklist Before Buying",
        rulesList: [
            "Buy health insurance at a young age.",
            "Disclose all health conditions truthfully.",
            "Never allow policy lapse.",
            "Set up Auto-Debit for renewals.",
            "Do not rely solely on corporate policy.",
            "Buy separate individual coverage for elderly parents.",
            "Avoid porting policies post major diagnosis.",
            "Check room rent limits and co-pay clauses.",
            "Verify No-Claim Bonus accumulation.",
            "Demand written repudiation letters upon claim rejection.",
            "Utilize free IRDAI Bima Bharosa & Ombudsman remedies.",
            "Maintain all medical records chronologically with dates."
        ],

        closingQuote: "Health insurance is not an expense, it is financial security.",
        closingDesc: "Spending one hour reading policy terms before buying can save lakhs of rupees during unexpected medical emergencies.",
        ctaTitle: "Get Your Ideal Family Health & Motor Quote Today!",
        ctaWaBtn: "Get Official Quote on WhatsApp",
        ctaAiBotBtn: "Start AI Quote Assistant",
        callAdvisorBtn: "Call Advisor Desk (+91 9048360880)"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initChecklist();
});

function initLanguage() {
    const savedLang = localStorage.getItem('pcs_ubb_lang') || 'ml';
    setLanguage(savedLang);
}

window.setLanguage = function(langCode) {
    if (!ubbI18n[langCode] && langCode !== 'en') {
        ubbState.lang = 'en'; // fallback for regional codes to English/Malayalam UI
    } else {
        ubbState.lang = langCode;
    }
    localStorage.setItem('pcs_ubb_lang', ubbState.lang);
    updateLangUI();
    renderContent();
};

function updateLangUI() {
    const btnMl = document.getElementById('lang-btn-ml');
    const btnEn = document.getElementById('lang-btn-en');
    
    if (btnMl && btnEn) {
        if (ubbState.lang === 'ml') {
            btnMl.className = "px-3 py-1.5 rounded-full bg-sky-600 text-white font-extrabold text-xs shadow-md transition-all";
            btnEn.className = "px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all";
        } else {
            btnEn.className = "px-3 py-1.5 rounded-full bg-sky-600 text-white font-extrabold text-xs shadow-md transition-all";
            btnMl.className = "px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all";
        }
    }
}

function renderContent() {
    const d = ubbI18n[ubbState.lang] || ubbI18n.ml;

    // Helper for safe element assignment
    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };
    const setElemHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    setElemText('ubb-page-title', d.pageTitle);
    setElemText('ubb-page-sub', d.pageSub);
    setElemText('ubb-summary-tag', d.quickSummaryTag);

    // Section 1
    setElemText('sec1-title', d.sec1Title);
    setElemText('sec1-desc', d.sec1Desc);
    setElemText('tab-30days-title', d.tab30Days);
    setElemText('tab-30days-desc', d.tab30DaysDesc);
    setElemText('tab-24months-title', d.tab24Months);
    setElemText('tab-24months-desc', d.tab24MonthsDesc);
    setElemText('sec1-waiting-note', d.waitingNote);
    setElemText('tab-36months-title', d.tab36Months);
    setElemText('tab-36months-desc', d.tab36MonthsDesc);
    setElemText('sec1-cancer-title', d.cancerNoteTitle);
    setElemText('sec1-cancer-desc', d.cancerNoteDesc);

    // Render surgeries grid
    const surgeriesContainer = document.getElementById('sec1-surgeries-grid');
    if (surgeriesContainer) {
        surgeriesContainer.innerHTML = d.surgeriesList.map(s => `
            <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                <i class="fa-solid fa-stethoscope text-sky-500"></i> ${s}
            </div>
        `).join('');
    }

    // Section 2
    setElemText('sec2-title', d.sec2Title);
    setElemText('sec2-desc', d.sec2Desc);
    setElemText('sec2-hidden-title', d.hiddenConsequencesTitle);
    setElemText('sec2-truth-title', d.truthResultsTitle);
    setElemText('sec2-takeaway', d.disclosureTakeaway);

    setElemHtml('sec2-hidden-list', d.hiddenConsequences.map(item => `<li class="flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation text-rose-500 shrink-0"></i> ${item}</li>`).join(''));
    setElemHtml('sec2-truth-list', d.truthResults.map(item => `<li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-emerald-500 shrink-0"></i> ${item}</li>`).join(''));

    // Section 3
    setElemText('sec3-title', d.sec3Title);
    setElemText('sec3-desc', d.sec3Desc);
    setElemText('sec3-exceptions-title', d.moratoriumExceptionsTitle);
    setElemText('sec3-note', d.sumInsuredIncreaseNote);
    setElemHtml('sec3-exceptions-list', d.moratoriumExceptions.map(e => `<li class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-shield-halved text-amber-500 shrink-0"></i> ${e}</li>`).join(''));

    // Section 4
    setElemText('sec4-title', d.sec4Title);
    setElemText('sec4-desc', d.sec4Desc);
    setElemText('sec4-losses-title', d.lapseLossesTitle);
    setElemText('sec4-warning', d.gracePeriodWarning);
    setElemHtml('sec4-losses-list', d.lapseLosses.map(l => `<li class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-circle-xmark text-rose-500 shrink-0"></i> ${l}</li>`).join(''));

    // Section 5
    setElemText('sec5-title', d.sec5Title);
    setElemText('sec5-answer', d.sec5Answer);
    setElemText('sec5-advice', d.sec5Advice);
    setElemHtml('sec5-reasons-list', d.sec5Reasons.map(r => `<li class="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-building-user text-indigo-500 shrink-0 mt-0.5"></i> ${r}</li>`).join(''));

    // Section 6
    setElemText('sec6-title', d.sec6Title);
    setElemText('sec6-desc', d.sec6Desc);
    setElemText('sec6-advice', d.portAdvice);
    setElemHtml('sec6-risks-list', d.portRisks.map(r => `<li class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-circle-exclamation text-rose-500 shrink-0"></i> ${r}</li>`).join(''));

    // Section 7 (Steps)
    setElemText('sec7-title', d.sec7Title);
    setElemText('sec7-desc', d.sec7Desc);
    const stepsContainer = document.getElementById('sec7-steps-container');
    if (stepsContainer) {
        stepsContainer.innerHTML = d.claimSteps.map(st => `
            <div class="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center">${st.step}</span>
                    <h4 class="font-extrabold text-xs text-slate-900 dark:text-white">${st.title}</h4>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 pl-9">${st.text}</p>
            </div>
        `).join('');
    }

    // Section 8 (Check items)
    setElemText('sec8-title', d.sec8Title);
    const checkContainer = document.getElementById('sec8-check-container');
    if (checkContainer) {
        checkContainer.innerHTML = d.checkItems.map(item => `
            <div class="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
                <h4 class="font-extrabold text-xs text-sky-600 dark:text-sky-400 flex items-center gap-2">
                    <i class="fa-solid fa-circle-check"></i> ${item.title}
                </h4>
                <p class="text-[11px] text-slate-600 dark:text-slate-300">${item.text}</p>
            </div>
        `).join('');
    }

    // Section 9
    setElemText('sec9-title', d.sec9Title);
    setElemText('sec9-desc', d.sec9Desc);
    setElemText('sec9-advice', d.opAdvice);
    setElemHtml('sec9-exclusions-list', d.opExclusions.map(op => `<li class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-ban text-rose-500 shrink-0"></i> ${op}</li>`).join(''));

    // Section 10
    setElemText('sec10-title', d.sec10Title);
    setElemText('sec10-desc', d.sec10Desc);
    setElemHtml('sec10-factors-list', d.sec10Factors.map(f => `<li class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"><i class="fa-solid fa-chart-line text-emerald-500 shrink-0"></i> ${f}</li>`).join(''));

    // Section 11
    setElemText('sec11-title', d.sec11Title);
    setElemText('sec11-answer', d.sec11Answer);
    setElemText('sec11-desc', d.sec11Desc);

    // Section 12 (Checklist)
    setElemText('sec12-title', d.sec12Title);
    renderChecklistItems(d.rulesList);

    // Closing & CTAs
    setElemText('ubb-closing-quote', d.closingQuote);
    setElemText('ubb-closing-desc', d.closingDesc);
    setElemText('ubb-cta-title', d.ctaTitle);
    setElemText('ubb-wa-btn-label', d.ctaWaBtn);
    setElemText('ubb-aibot-btn-label', d.ctaAiBotBtn);
    setElemText('ubb-call-btn-label', d.callAdvisorBtn);
}

function initChecklist() {
    renderChecklistProgress();
}

function renderChecklistItems(rulesList) {
    const container = document.getElementById('sec12-checklist-container');
    if (!container) return;

    container.innerHTML = rulesList.map((rule, idx) => {
        const isChecked = ubbState.checkedRules.has(idx);
        return `
            <div onclick="toggleRuleCheck(${idx})" class="p-3.5 rounded-2xl ${isChecked ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} border transition-all cursor-pointer shadow-sm flex items-start gap-3 group hover:border-emerald-400">
                <div class="w-6 h-6 rounded-lg ${isChecked ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'} flex items-center justify-center shrink-0 text-xs transition-colors mt-0.5">
                    <i class="fa-solid ${isChecked ? 'fa-check' : 'fa-check opacity-0 group-hover:opacity-100'}"></i>
                </div>
                <div class="text-xs font-extrabold ${isChecked ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' : 'text-slate-800 dark:text-slate-100'}">
                    ${idx + 1}. ${rule}
                </div>
            </div>
        `;
    }).join('');

    renderChecklistProgress();
}

window.toggleRuleCheck = function(idx) {
    if (ubbState.checkedRules.has(idx)) {
        ubbState.checkedRules.delete(idx);
    } else {
        ubbState.checkedRules.add(idx);
    }
    const d = ubbI18n[ubbState.lang] || ubbI18n.ml;
    renderChecklistItems(d.rulesList);
};

function renderChecklistProgress() {
    const total = 12;
    const count = ubbState.checkedRules.size;
    const percent = Math.round((count / total) * 100);

    const bar = document.getElementById('checklist-progress-bar');
    const label = document.getElementById('checklist-progress-label');

    if (bar) bar.style.width = `${percent}%`;
    if (label) label.innerText = `${count} of ${total} Completed (${percent}%)`;
}
