// Star Health Policies Data for Policy Care Solutions
const starPolicies = [
    {
        id: "comprehensive",
        title: "Star Comprehensive Health Insurance",
        badge: "Most Popular",
        category: "Family & Individual",
        summary: "Complete health cover with zero co-payment, maternity coverage, free annual health checkups, and air ambulance.",
        sumInsured: "₹5 Lakhs - ₹1 Crore",
        entryAge: "18 Yrs - 65 Yrs (Children 16 days - 25 yrs)",
        keyHighlights: [
            "No Co-Payment required for claims across India",
            "Maternity cover for up to 2 deliveries + Newborn coverage",
            "Out-patient (OPD) consultation and diagnostics cover",
            "Air Ambulance coverage up to ₹5 Lakhs per policy year",
            "Automatic 100% Restore of Sum Insured upon exhaustion"
        ],
        icon: "shield-check",
        accent: "emerald"
    },
    {
        id: "young-star",
        title: "Young Star Insurance Policy",
        badge: "Best for Youth (18-40)",
        category: "Young Adults & Couples",
        summary: "Specially designed for young adults and growing families with affordable premiums and wellness discounts.",
        sumInsured: "₹3 Lakhs - ₹1 Crore",
        entryAge: "18 Yrs - 40 Yrs",
        keyHighlights: [
            "Locked-in low premium rates when enrolled early",
            "Roadside Assistance & Mid-term inclusion for newly wed spouse",
            "Automatic 100% Sum Insured Restoration once a year",
            "Wellness program discounts up to 10% on renewal",
            "Cover for modern treatment methods & day-care procedures"
        ],
        icon: "zap",
        accent: "blue"
    },
    {
        id: "senior-red-carpet",
        title: "Senior Citizens Red Carpet Plan",
        badge: "Senior Citizens",
        category: "Parents & Elderly (60-75 Yrs)",
        summary: "Dedicated health policy for senior citizens with NO pre-acceptance medical screening required.",
        sumInsured: "₹1 Lakh - ₹25 Lakhs",
        entryAge: "60 Yrs - 75 Yrs",
        keyHighlights: [
            "No pre-insurance medical test required to enroll",
            "Covers pre-existing diseases after just 12 months",
            "Outpatient medical consultation at network hospitals",
            "Higher tax savings for adult children under Section 80D",
            "Guaranteed lifetime policy renewal options"
        ],
        icon: "heart-pulse",
        accent: "rose"
    },
    {
        id: "family-optima",
        title: "Star Family Health Optima Plan",
        badge: "Family Super Saver",
        category: "Complete Family",
        summary: "Super recharge benefit with triple coverage for the entire family under a single affordable float plan.",
        sumInsured: "₹3 Lakhs - ₹25 Lakhs",
        entryAge: "18 Yrs - 65 Yrs",
        keyHighlights: [
            "3 Times Automatic Restoration of Sum Insured per year",
            "Free Health Check-up for every block of claim-free year",
            "Coverage for organ donor expenses up to sum insured",
            "Domiciliary hospitalization & AYUSH treatment cover",
            "Single policy covers Self, Spouse & up to 3 Dependent Children"
        ],
        icon: "users",
        accent: "violet"
    },
    {
        id: "women-care",
        title: "Star Women Care Insurance Policy",
        badge: "Specialized for Women",
        category: "Women & Maternity",
        summary: "A revolutionary health policy curated for female health requirements, pregnancy, newborn care, and pediatric care.",
        sumInsured: "₹5 Lakhs - ₹1 Crore",
        entryAge: "18 Yrs - 75 Yrs",
        keyHighlights: [
            "Assisted Reproduction Treatment (IVF/Fertility) coverage",
            "Maternity expenses + Newborn congenital defect cover",
            "In Utero fetal surgery and preventive health checks",
            "No pre-acceptance medical test required",
            "Cover for voluntary sterilization & cancer screening"
        ],
        icon: "sparkles",
        accent: "pink"
    },
    {
        id: "critical-illness",
        title: "Star Critical Illness Multispeciality",
        badge: "Critical Protection",
        category: "Lump Sum Payout",
        summary: "Guaranteed cash lump sum payout upon diagnosis of 37 critical medical conditions like heart attack, cancer, or stroke.",
        sumInsured: "₹5 Lakhs - ₹50 Lakhs",
        entryAge: "18 Yrs - 65 Yrs",
        keyHighlights: [
            "Direct 100% Lump sum cash payout upon diagnosis",
            "Covers 37 major critical illnesses including Cancer & Stroke",
            "Can be taken alongside regular health insurance policy",
            "No hospital bills submission required for lump sum claim",
            "Tax benefit under Section 80D of Income Tax Act"
        ],
        icon: "activity",
        accent: "amber"
    }
];

if (typeof window !== 'undefined') {
    window.starPolicies = starPolicies;
}
