// Health Policies Data for Policy Care Solutions (Star Health & Care Health)
const healthPolicies = [
    // --- STAR HEALTH POLICIES ---
    {
        id: "star-comprehensive",
        provider: "Star Health",
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
        provider: "Star Health",
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
        provider: "Star Health",
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
        provider: "Star Health",
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
        provider: "Star Health",
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

    // --- CARE HEALTH POLICIES (AGENCY CODE NOT NEEDED) ---
    {
        id: "care-supreme",
        provider: "Care Health",
        title: "Care Supreme Health Plan",
        badge: "Next-Gen Comprehensive",
        category: "Family & Individual",
        summary: "Supercharged health plan with Unlimited Automatic Recharge, 500% NCB Shield, and 100% cashless hospitalization.",
        sumInsured: "₹7 Lakhs - ₹1 Crore",
        entryAge: "18 Yrs - Lifetime (Children 90 days onwards)",
        keyHighlights: [
            "Unlimited Automatic Recharge of Sum Insured for any illness",
            "Cumulative Bonus Shield up to 500% increase in coverage",
            "Zero co-payment option with 11,000+ cashless hospitals",
            "Coverage for AYUSH treatments & Advanced Cyber Robotics surgery",
            "Free Annual Health Check-ups for all insured members"
        ],
        icon: "shield-halved",
        accent: "teal"
    },
    {
        id: "care-advantage",
        provider: "Care Health",
        title: "Care Advantage 1 Crore Cover",
        badge: "High Sum Insured",
        category: "Family & High Coverage",
        summary: "Massive ₹1 Crore sum insured protection at an unbelievably affordable premium with no room rent sub-limits.",
        sumInsured: "₹25 Lakhs - ₹6 Crore",
        entryAge: "18 Yrs - Lifetime",
        keyHighlights: [
            "₹1 Crore high-value sum insured protection at budget rates",
            "No Sub-Limits on ICU fees, doctor fees, or hospital room rent",
            "Automatic Sum Insured Restoration once per policy year",
            "Comprehensive OPD, Ambulance & Daycare treatment cover",
            "Organ donor medical expenses fully covered"
        ],
        icon: "award",
        accent: "cyan"
    },
    {
        id: "care-freedom",
        provider: "Care Health",
        title: "Care Freedom Insurance",
        badge: "Pre-Existing Cover",
        category: "Pre-Existing Conditions",
        summary: "Specially designed for individuals with Pre-Existing Diseases (Diabetes, Hypertension, High BP) with short waiting periods.",
        sumInsured: "₹3 Lakhs - ₹10 Lakhs",
        entryAge: "18 Yrs - Lifetime (No age cap)",
        keyHighlights: [
            "No Pre-Policy Medical Checkup required up to age 65",
            "Shorter 2-year waiting period for pre-existing medical conditions",
            "Annual Health Check-up included from Year 1",
            "Dialysis coverage allowance & Day care treatment cover",
            "Guaranteed lifetime renewal with no age restrictions"
        ],
        icon: "heart-circle-check",
        accent: "indigo"
    },
    {
        id: "care-senior",
        provider: "Care Health",
        title: "Care Senior Citizens Plan",
        badge: "Senior Citizens",
        category: "Parents & Elderly (60+ Yrs)",
        summary: "Dedicated health protection tailored for senior parents with cashless treatment and hassle-free claim processing.",
        sumInsured: "₹3 Lakhs - ₹10 Lakhs",
        entryAge: "60 Yrs - Lifetime",
        keyHighlights: [
            "Cashless hospitalization across top hospital networks",
            "Domiciliary hospitalization & emergency ambulance cover",
            "Section 80D tax deduction up to ₹75,000 for adult children",
            "Annual health check-up tailored for senior health parameters",
            "Covers pre-existing illnesses after specified waiting duration"
        ],
        icon: "user-shield",
        accent: "emerald"
    }
];

if (typeof window !== 'undefined') {
    window.healthPolicies = healthPolicies;
    window.starPolicies = healthPolicies; // Backward compatibility alias
}

