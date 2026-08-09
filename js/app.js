// Main JavaScript Logic for Policy Care Solutions

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initForm();
    initLocationDropdowns();
    renderPolicies('all');
    renderInstagramFeed();
    initSmoothScrolling();
});

// Helper: Calculate Age from DOB string YYYY-MM-DD
function calculateAge(dobString) {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();
    
    if (isNaN(dob.getTime())) return null;

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    
    if (today.getDate() < dob.getDate()) {
        months--;
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 0) return { error: "Future date invalid" };

    if (years === 0 && months === 0) {
        return { text: "Newborn (< 1 Month)", years: 0, months: 0 };
    } else if (years === 0) {
        return { text: `${months} Month${months > 1 ? 's' : ''} Old`, years: 0, months };
    } else {
        return { 
            text: `${years} Year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} Month${months > 1 ? 's' : ''}` : ''}`, 
            years, 
            months 
        };
    }
}

// Global Form State
let formCoverageType = 'individual'; // 'individual' or 'family'
let indAgeMode = 'dob'; // 'dob' or 'age'
let familyMembersCount = 0;

// Dual Age Mode Switcher for Individual Applicant
window.toggleIndAgeMode = function(mode) {
    indAgeMode = mode;
    const dobContainer = document.getElementById('ind-dob-container');
    const directAgeContainer = document.getElementById('ind-direct-age-container');
    const dobBtn = document.getElementById('ind-mode-dob-btn');
    const ageBtn = document.getElementById('ind-mode-age-btn');
    const indAgeDisplay = document.getElementById('ind-age-display');

    if (!dobContainer || !directAgeContainer || !dobBtn || !ageBtn) return;

    if (mode === 'dob') {
        dobContainer.classList.remove('hidden');
        directAgeContainer.classList.add('hidden');
        dobBtn.className = "px-3 py-1.5 rounded-lg font-bold bg-sky-600 text-white transition-all";
        ageBtn.className = "px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:text-slate-900 transition-all";
        indAgeDisplay.innerHTML = '';
    } else {
        directAgeContainer.classList.remove('hidden');
        dobContainer.classList.add('hidden');
        ageBtn.className = "px-3 py-1.5 rounded-lg font-bold bg-sky-600 text-white transition-all";
        dobBtn.className = "px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:text-slate-900 transition-all";
        indAgeDisplay.innerHTML = '';
    }
};

function initForm() {
    const individualBtn = document.getElementById('btn-individual');
    const familyBtn = document.getElementById('btn-family');
    const individualSection = document.getElementById('individual-section');
    const familySection = document.getElementById('family-section');
    const indDobInput = document.getElementById('ind-dob');
    const indDirectAgeInput = document.getElementById('ind-direct-age');
    const indAgeDisplay = document.getElementById('ind-age-display');
    const primaryDobInput = document.getElementById('primary-dob');
    const primaryAgeDisplay = document.getElementById('primary-age-display');

    // Toggle Coverage Type
    if (individualBtn && familyBtn) {
        individualBtn.addEventListener('click', () => {
            formCoverageType = 'individual';
            individualBtn.classList.add('radio-pill-active', 'bg-sky-600', 'text-white');
            individualBtn.classList.remove('bg-slate-100', 'text-slate-700');
            familyBtn.classList.remove('radio-pill-active', 'bg-sky-600', 'text-white');
            familyBtn.classList.add('bg-slate-100', 'text-slate-700');

            individualSection.classList.remove('hidden');
            familySection.classList.add('hidden');
        });

        familyBtn.addEventListener('click', () => {
            formCoverageType = 'family';
            familyBtn.classList.add('radio-pill-active', 'bg-sky-600', 'text-white');
            familyBtn.classList.remove('bg-slate-100', 'text-slate-700');
            individualBtn.classList.remove('radio-pill-active', 'bg-sky-600', 'text-white');
            individualBtn.classList.add('bg-slate-100', 'text-slate-700');

            familySection.classList.remove('hidden');
            individualSection.classList.add('hidden');
            
            // Add default spouse row if empty
            const memberContainer = document.getElementById('family-members-container');
            if (memberContainer && memberContainer.children.length === 0) {
                addFamilyMemberRow('Spouse');
            }
        });
    }

    // DOB Change listeners for Individual Mode
    if (indDobInput) {
        indDobInput.addEventListener('change', () => {
            if (indAgeMode === 'dob') {
                const ageObj = calculateAge(indDobInput.value);
                if (ageObj && !ageObj.error) {
                    indAgeDisplay.innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-cake-candles mr-1.5 text-sky-600"></i> Calculated Age: ${ageObj.text}</span>`;
                } else if (ageObj && ageObj.error) {
                    indAgeDisplay.innerHTML = `<span class="text-xs text-rose-500 font-medium">Please enter a valid past Date of Birth</span>`;
                } else {
                    indAgeDisplay.innerHTML = '';
                }
            }
        });
    }

    if (indDirectAgeInput) {
        indDirectAgeInput.addEventListener('input', () => {
            if (indAgeMode === 'age' && indDirectAgeInput.value) {
                indAgeDisplay.innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-user-check mr-1.5 text-sky-600"></i> Direct Age Specified: ${indDirectAgeInput.value} Years</span>`;
            } else if (indAgeMode === 'age') {
                indAgeDisplay.innerHTML = '';
            }
        });
    }

    // DOB Change listener for Primary Member in Family Mode
    if (primaryDobInput) {
        primaryDobInput.addEventListener('change', () => {
            const ageObj = calculateAge(primaryDobInput.value);
            if (ageObj && !ageObj.error) {
                primaryAgeDisplay.innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-cake-candles mr-1.5 text-sky-600"></i> Age: ${ageObj.text}</span>`;
            } else {
                primaryAgeDisplay.innerHTML = '';
            }
        });
    }

    // Add Family Member Button Handler
    const addMemberBtn = document.getElementById('add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            addFamilyMemberRow();
        });
    }

    // Form Submission Handler
    const quoteForm = document.getElementById('insurance-quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmit);
    }
}

// Add a dynamic family member row with dual DOB or Direct Age input
function addFamilyMemberRow(defaultRelation = 'Child') {
    const container = document.getElementById('family-members-container');
    if (!container) return;

    familyMembersCount++;
    const rowId = `member-row-${Date.now()}-${familyMembersCount}`;

    const row = document.createElement('div');
    row.id = rowId;
    row.className = "glass-card p-4 rounded-xl border border-slate-200 relative mb-3 bg-white/80 transition-all";
    row.innerHTML = `
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span class="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center">
                <i class="fa-solid fa-user-plus mr-1.5 text-sky-500"></i> Family Member #${container.children.length + 1}
            </span>
            <button type="button" onclick="removeFamilyMemberRow('${rowId}')" class="text-slate-400 hover:text-rose-500 text-xs font-semibold transition-colors flex items-center gap-1">
                <i class="fa-solid fa-trash-can"></i> Remove
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" class="member-name w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Member Name" required />
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Relationship</label>
                <select class="member-relation w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                    <option value="Spouse" ${defaultRelation === 'Spouse' ? 'selected' : ''}>Spouse (Husband / Wife)</option>
                    <option value="Son" ${defaultRelation === 'Child' ? 'selected' : ''}>Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Father-in-Law">Father-in-Law</option>
                    <option value="Mother-in-Law">Mother-in-Law</option>
                    <option value="Other Dependent">Other Dependent</option>
                </select>
            </div>
            <div>
                <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-medium text-slate-700">Age / DOB</label>
                    <button type="button" class="member-mode-toggle text-[10px] text-sky-600 font-bold hover:underline">Switch to Age in Years</button>
                </div>
                
                <!-- DOB Input Container -->
                <div class="member-dob-box">
                    <input type="date" class="member-dob w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                
                <!-- Direct Age Input Container -->
                <div class="member-age-box hidden">
                    <input type="number" min="1" max="100" placeholder="e.g. 32" class="member-direct-age w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" />
                </div>

                <div class="member-age-display mt-1 min-h-[1.25rem]"></div>
            </div>
        </div>
    `;

    container.appendChild(row);

    // Dynamic dual mode toggle for this row
    let memberMode = 'dob';
    const toggleBtn = row.querySelector('.member-mode-toggle');
    const dobBox = row.querySelector('.member-dob-box');
    const ageBox = row.querySelector('.member-age-box');
    const dobInput = row.querySelector('.member-dob');
    const directAgeInput = row.querySelector('.member-direct-age');
    const ageDisplay = row.querySelector('.member-age-display');

    toggleBtn.addEventListener('click', () => {
        if (memberMode === 'dob') {
            memberMode = 'age';
            dobBox.classList.add('hidden');
            ageBox.classList.remove('hidden');
            toggleBtn.textContent = 'Switch to DOB Picker';
            ageDisplay.innerHTML = '';
        } else {
            memberMode = 'dob';
            ageBox.classList.add('hidden');
            dobBox.classList.remove('hidden');
            toggleBtn.textContent = 'Switch to Age in Years';
            ageDisplay.innerHTML = '';
        }
    });

    dobInput.addEventListener('change', () => {
        if (memberMode === 'dob') {
            const ageObj = calculateAge(dobInput.value);
            if (ageObj && !ageObj.error) {
                ageDisplay.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-cake-candles mr-1 text-sky-600"></i> Age: ${ageObj.text}</span>`;
            } else {
                ageDisplay.innerHTML = '';
            }
        }
    });

    directAgeInput.addEventListener('input', () => {
        if (memberMode === 'age' && directAgeInput.value) {
            ageDisplay.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-user-check mr-1 text-sky-600"></i> Age: ${directAgeInput.value} Yrs</span>`;
        } else if (memberMode === 'age') {
            ageDisplay.innerHTML = '';
        }
    });
}

// Remove Family Member Row
window.removeFamilyMemberRow = function(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        // Update header counters
        const container = document.getElementById('family-members-container');
        if (container) {
            Array.from(container.children).forEach((child, index) => {
                const titleSpan = child.querySelector('.text-sky-700');
                if (titleSpan) {
                    titleSpan.innerHTML = `<i class="fa-solid fa-user-plus mr-1.5 text-sky-500"></i> Family Member #${index + 1}`;
                }
            });
        }
    }
}

// Initialize Indian Location Dropdowns
function initLocationDropdowns() {
    const stateSelect = document.getElementById('user-state');
    const districtSelect = document.getElementById('user-district');

    if (!stateSelect || !districtSelect) return;

    // Populate States
    stateSelect.innerHTML = `<option value="">-- Select State / UT --</option>`;
    if (window.indiaLocationData) {
        Object.keys(window.indiaLocationData).sort().forEach(state => {
            const opt = document.createElement('option');
            opt.value = state;
            opt.textContent = state;
            stateSelect.appendChild(opt);
        });
    }

    // Handle State change to populate Districts
    stateSelect.addEventListener('change', () => {
        const selectedState = stateSelect.value;
        districtSelect.innerHTML = `<option value="">-- Select District --</option>`;

        if (selectedState && window.indiaLocationData[selectedState]) {
            districtSelect.disabled = false;
            window.indiaLocationData[selectedState].forEach(dist => {
                const opt = document.createElement('option');
                opt.value = dist;
                opt.textContent = dist;
                districtSelect.appendChild(opt);
            });
        } else {
            districtSelect.disabled = true;
            districtSelect.innerHTML = `<option value="">-- First Select State --</option>`;
        }
    });
}

// Handle Form Submission and generate pre-filled WhatsApp Link
function handleFormSubmit(e) {
    e.preventDefault();

    const fullName = document.getElementById('user-name')?.value.trim();
    const phone = document.getElementById('user-phone')?.value.trim();
    const email = document.getElementById('user-email')?.value.trim();
    const state = document.getElementById('user-state')?.value;
    const district = document.getElementById('user-district')?.value;
    const city = document.getElementById('user-city')?.value.trim();
    const pincode = document.getElementById('user-pincode')?.value.trim();

    // Basic Validation
    if (!fullName) {
        alert("Please enter your Full Name.");
        return;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        alert("Please enter a valid 10-digit Indian Mobile Number.");
        return;
    }
    if (!state || !district || !city || !pincode) {
        alert("Please complete your State, District, City and 6-digit Pincode.");
        return;
    }
    if (!/^\d{6}$/.test(pincode)) {
        alert("Please enter a valid 6-digit Pincode.");
        return;
    }

    let membersSummaryText = '';
    let membersListForModal = [];

    if (formCoverageType === 'individual') {
        let ageText = '';
        let dobOrAgeVal = '';
        if (indAgeMode === 'dob') {
            const indDob = document.getElementById('ind-dob')?.value;
            if (!indDob) {
                alert("Please select your Date of Birth or switch to Direct Age entry.");
                return;
            }
            const ageObj = calculateAge(indDob);
            ageText = ageObj && !ageObj.error ? ageObj.text : 'Not calculated';
            dobOrAgeVal = `DOB: ${indDob}`;
            membersSummaryText = `• Self (${fullName}): ${dobOrAgeVal} (Age: ${ageText})`;
        } else {
            const directAge = document.getElementById('ind-direct-age')?.value;
            if (!directAge || directAge < 1 || directAge > 100) {
                alert("Please enter a valid Age between 1 and 100.");
                return;
            }
            ageText = `${directAge} Years`;
            dobOrAgeVal = `Age: ${directAge} Years`;
            membersSummaryText = `• Self (${fullName}): ${dobOrAgeVal}`;
        }
        membersListForModal.push({ name: fullName, relation: 'Self (Individual)', dob: dobOrAgeVal, age: ageText });
    } else {
        // Family Mode
        const primaryDob = document.getElementById('primary-dob')?.value;
        const primaryRelation = document.getElementById('primary-relation')?.value || 'Primary Self';
        if (!primaryDob) {
            alert("Please select Date of Birth for Primary Member (Self).");
            return;
        }
        const primaryAgeObj = calculateAge(primaryDob);
        const primaryAgeText = primaryAgeObj && !primaryAgeObj.error ? primaryAgeObj.text : 'N/A';
        
        membersSummaryText = `• ${fullName} (${primaryRelation}): DOB: ${primaryDob} (Age: ${primaryAgeText})\n`;
        membersListForModal.push({ name: fullName, relation: primaryRelation, dob: `DOB: ${primaryDob}`, age: primaryAgeText });

        const container = document.getElementById('family-members-container');
        if (container) {
            const memberRows = container.querySelectorAll('[id^="member-row-"]');
            memberRows.forEach((row, idx) => {
                const mName = row.querySelector('.member-name')?.value.trim() || `Member ${idx + 1}`;
                const mRelation = row.querySelector('.member-relation')?.value || 'Family Member';
                const dobBox = row.querySelector('.member-dob-box');
                const isDobMode = dobBox && !dobBox.classList.contains('hidden');

                let mAgeText = 'N/A';
                let rowSummary = '';

                if (isDobMode) {
                    const mDob = row.querySelector('.member-dob')?.value;
                    const mAgeObj = calculateAge(mDob);
                    mAgeText = mAgeObj && !mAgeObj.error ? mAgeObj.text : 'N/A';
                    const mValText = mDob ? `DOB: ${mDob}` : 'N/A';
                    rowSummary = `• ${mName} (${mRelation}): ${mValText} (Age: ${mAgeText})`;
                    membersListForModal.push({ name: mName, relation: mRelation, dob: mValText, age: mAgeText });
                } else {
                    const mDirectAge = row.querySelector('.member-direct-age')?.value;
                    mAgeText = mDirectAge ? `${mDirectAge} Years` : 'N/A';
                    const mValText = mDirectAge ? `Age: ${mDirectAge} Years` : 'N/A';
                    rowSummary = `• ${mName} (${mRelation}): ${mValText}`;
                    membersListForModal.push({ name: mName, relation: mRelation, dob: mValText, age: mAgeText });
                }
                
                membersSummaryText += `${rowSummary}\n`;
            });
        }
    }

    // Construct WhatsApp formatted string with clean standard formatting
    const whatsappMessage = `*HEALTH & MOTOR INSURANCE QUOTE REQUEST*
----------------------------------------
*Advisor Team*: Policy Care Solutions
*Agency*: Policy Care Solutions (Ottapalam & Palakkad Agents)

*Coverage Type*: ${formCoverageType.toUpperCase()}
*Persons Covered*:
${membersSummaryText.trim()}

*Address Details*:
• State: ${state}
• District: ${district}
• City: ${city}
• Pincode: ${pincode}

*Contact Details*:
• Phone: +91 ${phone}
• Email: ${email || 'Not Provided'}

Kindly provide best Star Health & Care Health policy options and premium quote details!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const targetWhatsAppNum = "919048360880";
    const waUrl = `https://wa.me/${targetWhatsAppNum}?text=${encodedMessage}`;

    // Trigger Brevo API Lead Email Dispatch in background
    if (window.leadService) {
        window.leadService.sendLeadEmail({
            name: fullName,
            phone: phone,
            email: email,
            coverageType: formCoverageType,
            state: state,
            district: district,
            city: city,
            pincode: pincode,
            members: membersListForModal,
            source: 'Homepage Quote Calculator'
        });
    }

    // Show Confirmation Modal
    showQuoteModal({
        fullName,
        phone,
        email,
        coverageType: formCoverageType,
        state,
        district,
        city,
        pincode,
        members: membersListForModal,
        waUrl,
        whatsappMessage
    });
}

// AI Smart Policy Recommendation Assistant Rule Engine
window.runAiPolicyMatcher = function() {
    const who = document.getElementById('ai-q-who')?.value;
    const priority = document.getElementById('ai-q-priority')?.value;
    const outputBox = document.getElementById('ai-recommendation-output');
    const policiesList = window.healthPolicies || window.starPolicies;

    if (!outputBox || !policiesList) return;

    // Rule-based policy matching
    let matchedPolicy = null;
    let matchScore = 96;
    let matchReason = '';

    if (who === 'family_kids') {
        if (priority === 'zero_copay') {
            matchedPolicy = policiesList.find(p => p.id === 'star-comprehensive') || policiesList[0];
            matchReason = "Offers 100% Zero Co-Pay across all network hospitals, full maternity & newborn cover, and 100% automatic sum insured restoration.";
            matchScore = 98;
        } else if (priority === 'high_sum') {
            matchedPolicy = policiesList.find(p => p.id === 'care-advantage') || policiesList.find(p => p.id === 'care-supreme');
            matchReason = "Provides massive ₹1 Crore sum insured cover with unlimited automatic restoration and global cashless network access.";
            matchScore = 97;
        } else {
            matchedPolicy = policiesList.find(p => p.id === 'care-supreme') || policiesList[0];
            matchReason = "Flexible family floater plan with Cumulative Bonus Super up to 500% increase and zero co-pay options.";
            matchScore = 96;
        }
    } else if (who === 'young_adult') {
        matchedPolicy = policiesList.find(p => p.id === 'young-star') || policiesList.find(p => p.id === 'care-supreme');
        matchReason = "Designed specifically for young individuals aged 18-40 with locked low premiums, wellness reward discounts up to 20%, and instant auto restoration.";
        matchScore = 99;
    } else if (who === 'senior_parents') {
        if (priority === 'quick_waiting') {
            matchedPolicy = policiesList.find(p => p.id === 'care-freedom') || policiesList.find(p => p.id === 'care-senior');
            matchReason = "Specialized senior plan with shortened 2-year waiting period for pre-existing illnesses like hypertension & diabetes.";
            matchScore = 95;
        } else {
            matchedPolicy = policiesList.find(p => p.id === 'senior-red-carpet') || policiesList.find(p => p.id === 'care-senior');
            matchReason = "No pre-policy medical test required for entry up to age 75 with coverage for pre-existing conditions after specified period.";
            matchScore = 94;
        }
    } else if (who === 'pre_existing') {
        matchedPolicy = policiesList.find(p => p.id === 'care-freedom') || policiesList.find(p => p.id === 'star-comprehensive');
        matchReason = "Optimized for individuals with pre-existing medical conditions (Diabetes, BP, Thyroid) featuring shorter waiting windows and day-1 annual health checkups.";
        matchScore = 96;
    } else {
        matchedPolicy = policiesList[0];
        matchReason = "Top-tier comprehensive health insurance coverage for overall family medical safety.";
        matchScore = 95;
    }

    const isStar = matchedPolicy.provider === 'Star Health';
    const waMsg = encodeURIComponent(`Hello Policy Care Team (Ottapalam & Palakkad), the AI Assistant recommended the *${matchedPolicy.title}* (${matchedPolicy.provider}) policy for me. Please provide a quote.`);
    const waUrl = `https://wa.me/919048360880?text=${waMsg}`;

    outputBox.innerHTML = `
        <div class="mt-6 p-6 rounded-2xl bg-slate-900 border border-white/20 text-white animate-fadeIn shadow-2xl">
            <div class="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-white/10">
                <span class="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                    <i class="fa-solid fa-sparkles"></i> AI Match Score: ${matchScore}% Best Fit
                </span>
                <span class="text-xs text-slate-400 font-medium">Insurer: <strong>${matchedPolicy.provider}</strong></span>
            </div>

            <h3 class="text-2xl font-extrabold text-white mb-2 font-heading">${matchedPolicy.title}</h3>
            <p class="text-xs text-amber-300 leading-relaxed mb-4 font-medium"><i class="fa-solid fa-lightbulb text-amber-400 mr-1.5"></i> <strong>Why this plan fits you:</strong> ${matchReason}</p>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs mb-4">
                <div><span class="text-slate-400 block text-[10px] uppercase font-bold">Sum Insured</span><span class="font-extrabold text-teal-300 text-sm">${matchedPolicy.sumInsured}</span></div>
                <div><span class="text-slate-400 block text-[10px] uppercase font-bold">Entry Age</span><span class="font-bold text-white">${matchedPolicy.entryAge}</span></div>
                <div class="col-span-2 sm:col-span-1"><span class="text-slate-400 block text-[10px] uppercase font-bold">Network Hospitals</span><span class="font-bold text-sky-300">22,000+ Cashless</span></div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="${waUrl}" target="_blank" class="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25">
                    <i class="fa-brands fa-whatsapp text-lg"></i> Get Quote for ${matchedPolicy.title} on WhatsApp
                </a>
                <a href="#calculator" class="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center">
                    Fill Calculator Form
                </a>
            </div>
        </div>
    `;

    outputBox.classList.remove('hidden');
};

// Show Quote Confirmation Modal
function showQuoteModal(data) {
    const modal = document.getElementById('quote-modal');
    const modalContent = document.getElementById('modal-summary-content');
    const waModalBtn = document.getElementById('modal-wa-btn');

    if (!modal || !modalContent) return;

    let membersHtml = data.members.map(m => `
        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs border border-slate-200">
            <div>
                <span class="font-bold text-slate-800">${m.name}</span>
                <span class="text-slate-500">(${m.relation})</span>
            </div>
            <span class="font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">${m.age}</span>
        </div>
    `).join('');

    modalContent.innerHTML = `
        <div class="space-y-3 text-sm">
            <div class="bg-sky-50 border border-sky-200 p-3 rounded-xl text-sky-900 text-xs">
                <p class="font-bold"><i class="fa-solid fa-circle-check text-sky-600 mr-1"></i> Form Validated Successfully!</p>
                <p class="mt-1 text-slate-600">Your custom WhatsApp quote message has been prepared for Policy Care Solutions.</p>
            </div>

            <div>
                <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500 mb-1.5">Coverage (${data.coverageType})</h4>
                <div class="space-y-1.5">${membersHtml}</div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span class="text-slate-500">State:</span> <span class="font-semibold text-slate-800">${data.state}</span></div>
                <div><span class="text-slate-500">District:</span> <span class="font-semibold text-slate-800">${data.district}</span></div>
                <div><span class="text-slate-500">City:</span> <span class="font-semibold text-slate-800">${data.city}</span></div>
                <div><span class="text-slate-500">Pincode:</span> <span class="font-semibold text-slate-800">${data.pincode}</span></div>
                <div><span class="text-slate-500">Phone:</span> <span class="font-semibold text-slate-800">+91 ${data.phone}</span></div>
                <div><span class="text-slate-500">Email:</span> <span class="font-semibold text-slate-800">${data.email || 'N/A'}</span></div>
            </div>
        </div>
    `;

    if (waModalBtn) {
        waModalBtn.href = data.waUrl;
        waModalBtn.onclick = () => {
            window.open(data.waUrl, '_blank');
        };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close Modal
window.closeQuoteModal = function() {
    const modal = document.getElementById('quote-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Global Filter States
let currentProviderFilter = 'all';
let currentCategoryFilter = 'all';

window.setProviderFilter = function(provider) {
    currentProviderFilter = provider;
    
    // Update provider button active states
    ['all', 'star', 'care'].forEach(p => {
        const btn = document.getElementById(`prov-btn-${p}`);
        if (btn) {
            btn.className = "px-5 py-2 rounded-xl text-xs font-bold transition-all text-slate-700 hover:bg-slate-200";
        }
    });

    let activeBtnId = 'prov-btn-all';
    if (provider === 'Star Health') activeBtnId = 'prov-btn-star';
    if (provider === 'Care Health') activeBtnId = 'prov-btn-care';

    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.className = "px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm transition-all flex items-center gap-1.5";
    }

    renderPolicies();
};

window.setCategoryFilter = function(category) {
    currentCategoryFilter = category;

    const catButtons = document.querySelectorAll('#category-filter-buttons .cat-pill');
    catButtons.forEach(btn => {
        btn.classList.remove('bg-slate-800', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
    });

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.remove('bg-slate-100', 'text-slate-700');
        window.event.currentTarget.classList.add('bg-slate-800', 'text-white');
    }

    renderPolicies();
};

// Render Health Policies (Star Health & Care Health)
function renderPolicies(legacyFilter = null) {
    const container = document.getElementById('policies-grid');
    const policiesList = window.healthPolicies || window.starPolicies;
    if (!container || !policiesList) return;

    if (legacyFilter && legacyFilter !== 'all') {
        currentCategoryFilter = legacyFilter;
    }

    let filtered = policiesList;

    // Filter by Provider
    if (currentProviderFilter !== 'all') {
        filtered = filtered.filter(p => p.provider === currentProviderFilter);
    }

    // Filter by Category
    if (currentCategoryFilter !== 'all') {
        filtered = filtered.filter(p => 
            p.category.toLowerCase().includes(currentCategoryFilter.toLowerCase()) || 
            (p.badge && p.badge.toLowerCase().includes(currentCategoryFilter.toLowerCase()))
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <i class="fa-solid fa-folder-open text-4xl text-slate-400 mb-3"></i>
                <p class="text-sm font-bold text-slate-700">No policies found matching your selection.</p>
                <p class="text-xs text-slate-500 mt-1">Try switching insurer or category filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(policy => {
        const isStar = policy.provider === 'Star Health';
        const providerBadge = isStar 
            ? `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 flex items-center gap-1"><i class="fa-solid fa-star text-amber-500 text-[10px]"></i> Star Health</span>`
            : `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200/80 flex items-center gap-1"><i class="fa-solid fa-shield-halved text-teal-600 text-[10px]"></i> Care Health</span>`;

        const highlightsHtml = policy.keyHighlights.map(h => `
            <li class="flex items-start text-xs text-slate-600 gap-2">
                <i class="fa-solid fa-shield-halved ${isStar ? 'text-sky-500' : 'text-teal-500'} mt-0.5 shrink-0"></i>
                <span>${h}</span>
            </li>
        `).join('');

        const quickMsg = encodeURIComponent(`Hello Policy Care Team, I am interested in knowing more about the *${policy.title}* (${policy.provider}) policy for my family.`);

        return `
            <div class="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-28 h-28 ${isStar ? 'bg-sky-500/10' : 'bg-teal-500/10'} rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
                <div>
                    <div class="flex items-center justify-between mb-3">
                        ${providerBadge}
                        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">${policy.badge}</span>
                    </div>

                    <h3 class="text-xl font-bold text-slate-900 mb-2">${policy.title}</h3>
                    <p class="text-xs text-slate-600 leading-relaxed mb-4">${policy.summary}</p>

                    <div class="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-xs border border-slate-100">
                        <div>
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Sum Insured</span>
                            <span class="font-bold ${isStar ? 'text-sky-700' : 'text-teal-700'}">${policy.sumInsured}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Entry Age</span>
                            <span class="font-semibold text-slate-700">${policy.entryAge}</span>
                        </div>
                    </div>

                    <ul class="space-y-2 mb-6">
                        ${highlightsHtml}
                    </ul>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a href="#calculator" class="flex-1 text-center py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors">
                        Calculate Quote
                    </a>
                    <a href="https://wa.me/919048360880?text=${quickMsg}" target="_blank" class="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                        <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Render Instagram Feed Section for @policycaresolutions
function renderInstagramFeed() {
    const container = document.getElementById('instagram-posts-grid');
    if (!container) return;

    const mockInstaPosts = [
        {
            id: 1,
            tag: "Tax Savings",
            title: "Save up to ₹75,000 in Income Tax under Section 80D with Star & Care Health Insurance!",
            imageGradient: "from-blue-600 to-indigo-900",
            icon: "fa-calculator",
            likes: "428",
            comments: "32",
            date: "2 days ago"
        },
        {
            id: 2,
            tag: "Cashless Network",
            title: "Over 22,000+ Cashless Hospitals across India. Direct claim approval with zero hassle.",
            imageGradient: "from-teal-500 to-emerald-800",
            icon: "fa-hospital-user",
            likes: "592",
            comments: "47",
            date: "4 days ago"
        },
        {
            id: 3,
            tag: "Care Supreme",
            title: "Why Care Supreme is trending: Unlimited Automatic Recharge & 500% NCB Bonus!",
            imageGradient: "from-teal-600 to-cyan-900",
            icon: "fa-shield-halved",
            likes: "815",
            comments: "74",
            date: "5 days ago"
        },
        {
            id: 4,
            tag: "Senior Citizens",
            title: "No pre-insurance medical test required for Senior Citizens up to age 65 with top health plans.",
            imageGradient: "from-violet-600 to-purple-900",
            icon: "fa-user-shield",
            likes: "614",
            comments: "53",
            date: "1 week ago"
        }
    ];

    container.innerHTML = mockInstaPosts.map(post => `
        <div class="insta-card glass-card rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between">
            <div>
                <div class="relative h-44 bg-gradient-to-br ${post.imageGradient} p-5 text-white flex flex-col justify-between">
                    <div class="flex justify-between items-center">
                        <span class="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase text-white">
                            ${post.tag}
                        </span>
                        <i class="fa-brands fa-instagram text-xl opacity-80"></i>
                    </div>
                    <div>
                        <i class="fa-solid ${post.icon} text-3xl mb-2 text-amber-300 opacity-90"></i>
                        <p class="text-xs font-semibold leading-snug text-white/95 line-clamp-3">${post.title}</p>
                    </div>
                </div>
                <div class="p-4 bg-white">
                    <div class="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-800">
                        <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1px]">
                            <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-[9px] font-extrabold text-sky-700">PC</div>
                        </div>
                        <span>@policycaresolutions</span>
                    </div>
                </div>
            </div>
            <div class="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1"><i class="fa-regular fa-heart text-rose-500"></i> ${post.likes}</span>
                    <span class="flex items-center gap-1"><i class="fa-regular fa-comment text-sky-500"></i> ${post.comments}</span>
                </div>
                <a href="https://www.instagram.com/policycaresolutions" target="_blank" class="text-sky-600 font-bold text-[11px] hover:underline flex items-center gap-1">
                    View Post <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ----------------------------------------------------
// CONVERSATIONAL AI LIVE CHAT ASSISTANT STATE MACHINE
// ----------------------------------------------------
let aiChatState = {
    step: 0, // 0: ask name, 1: ask policy type, 2: ask phone, 3: ask email, 4: complete
    userName: '',
    policyType: '',
    phone: '',
    email: '',
    initialized: false
};

// Toggle Floating Chat Drawer
window.toggleAiChatWidget = function() {
    const drawer = document.getElementById('ai-chat-drawer');
    if (!drawer) return;

    if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        drawer.classList.add('flex');
        
        if (!aiChatState.initialized) {
            initAiChatConversation();
        }
    } else {
        drawer.classList.add('hidden');
        drawer.classList.remove('flex');
    }
};

// Initialize Chat Sequence
function initAiChatConversation() {
    aiChatState.initialized = true;
    aiChatState.step = 0;
    const container = document.getElementById('chat-messages-container');
    if (container) container.innerHTML = '';

    appendBotChatMessage("Hi there! 👋 Welcome to Policy Care Solutions (Ottapalam & Palakkad).");
    setTimeout(() => {
        appendBotChatMessage("May I know your full name please so I can personalize your consultation?");
    }, 600);
}

// Append Bot Message
function appendBotChatMessage(text, quickOptions = null) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex gap-2 items-start animate-fadeIn";

    let optionsHtml = '';
    if (quickOptions && quickOptions.length > 0) {
        optionsHtml = `
            <div class="flex flex-wrap gap-1.5 mt-2">
                ${quickOptions.map(opt => `
                    <button type="button" onclick="selectQuickChatOption('${opt}')" class="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-800 font-bold text-[11px] transition-all border border-sky-200">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    }

    msgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0">
            <i class="fa-solid fa-headset"></i>
        </div>
        <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 max-w-[85%] text-slate-800 text-xs">
            <p class="leading-relaxed font-medium">${text}</p>
            ${optionsHtml}
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// Append User Message
function appendUserChatMessage(text) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex justify-end animate-fadeIn";
    msgDiv.innerHTML = `
        <div class="bg-sky-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md max-w-[85%] text-xs font-medium">
            <p class="leading-relaxed">${text}</p>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// Quick Option Click Handler
window.selectQuickChatOption = function(optionText) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
        input.value = optionText;
        processAiChatStep(optionText);
        input.value = '';
    }
};

// Form Input Submit Handler
window.handleAiChatSubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    processAiChatStep(text);
    input.value = '';
};

// Process Conversational Steps
function processAiChatStep(userText) {
    appendUserChatMessage(userText);

    setTimeout(() => {
        if (aiChatState.step === 0) {
            // STEP 0: Capture Name
            aiChatState.userName = userText;
            aiChatState.step = 1;
            appendBotChatMessage(
                `Nice to meet you, <strong>${aiChatState.userName}</strong>! 😊`,
                null
            );
            setTimeout(() => {
                appendBotChatMessage(
                    `What type of insurance policy are you looking for today, <strong>${aiChatState.userName}</strong>?`,
                    ['Health Insurance', 'Motor Insurance (Car/Bike)']
                );
            }, 600);

        } else if (aiChatState.step === 1) {
            // STEP 1: Capture Policy Type
            aiChatState.policyType = userText;
            aiChatState.step = 2;
            appendBotChatMessage(
                `Got it, <strong>${aiChatState.userName}</strong>! To connect you directly with our senior advisor team on WhatsApp, what is your 10-digit Mobile Phone Number?`
            );

        } else if (aiChatState.step === 2) {
            // STEP 2: Capture Phone
            if (!/^[6-9]\d{9}$/.test(userText.replace(/\s+/g, ''))) {
                appendBotChatMessage(`Please enter a valid 10-digit Indian Mobile Number, <strong>${aiChatState.userName}</strong>.`);
                return;
            }
            aiChatState.phone = userText.replace(/\s+/g, '');
            aiChatState.step = 3;
            appendBotChatMessage(
                `Thank you, <strong>${aiChatState.userName}</strong>! Optionally, what is your Email ID? (Or click below to skip)`,
                ['Skip Email']
            );

        } else if (aiChatState.step === 3) {
            // STEP 3: Capture Email & Finalize
            if (userText.toLowerCase() !== 'skip email' && userText.toLowerCase() !== 'skip') {
                aiChatState.email = userText;
            } else {
                aiChatState.email = 'Not Provided';
            }
            aiChatState.step = 4;

            const waPayload = `*LIVE AGENT CONSULTATION REQUEST*
----------------------------------------
*Name*: ${aiChatState.userName}
*Interest*: ${aiChatState.policyType}
*Phone*: +91 ${aiChatState.phone}
*Email*: ${aiChatState.email}
*Location*: Ottapalam & Palakkad

Hello Policy Care Solutions, my name is ${aiChatState.userName}. I would like live assistance for ${aiChatState.policyType}!`;

            const encodedWa = encodeURIComponent(waPayload);
            const waUrl = `https://wa.me/919048360880?text=${encodedWa}`;

            appendBotChatMessage(`Awesome, <strong>${aiChatState.userName}</strong>! 🎉 I have prepared your live consultation profile for Policy Care Solutions.`);
            
            setTimeout(() => {
                appendBotChatMessage(`Click below to start your live WhatsApp chat now:`);
                appendWhatsAppTransferCard(waUrl, aiChatState);
            }, 600);
        } else {
            // Step 4+: Already completed
            appendBotChatMessage(`You are all set, <strong>${aiChatState.userName}</strong>! Click the WhatsApp button above to chat live with our advisor team.`);
        }
    }, 400);
}

// Append WhatsApp Transfer Card inside Chat Drawer
function appendWhatsAppTransferCard(waUrl, stateData) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const cardDiv = document.createElement('div');
    cardDiv.className = "p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl border border-white/20 animate-fadeIn space-y-2 mt-2";
    cardDiv.innerHTML = `
        <div class="flex items-center justify-between text-[11px] text-amber-300 font-bold border-b border-white/10 pb-1.5">
            <span><i class="fa-solid fa-user-check mr-1"></i> Client Profile Verified</span>
            <span class="text-emerald-400">Ready</span>
        </div>
        <div class="text-xs space-y-1 text-slate-200">
            <p><strong>Name:</strong> ${stateData.userName}</p>
            <p><strong>Interest:</strong> ${stateData.policyType}</p>
            <p><strong>Mobile:</strong> +91 ${stateData.phone}</p>
        </div>
        <a href="${waUrl}" target="_blank" class="block w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs text-center shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2">
            <i class="fa-brands fa-whatsapp text-base"></i> Start Live WhatsApp Chat Now
        </a>
    `;

    container.appendChild(cardDiv);
    container.scrollTop = container.scrollHeight;
}

// Header More Dropdown Toggle
window.toggleMoreMenu = function(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('more-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

// Close Dropdowns on Click Outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('more-menu-dropdown');
    const btn = document.getElementById('more-menu-btn');
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    }
});

// Theme Switcher System (Default: Light Mode)
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

document.addEventListener('DOMContentLoaded', initTheme);



