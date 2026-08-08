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
let familyMembersCount = 0;

function initForm() {
    const individualBtn = document.getElementById('btn-individual');
    const familyBtn = document.getElementById('btn-family');
    const individualSection = document.getElementById('individual-section');
    const familySection = document.getElementById('family-section');
    const indDobInput = document.getElementById('ind-dob');
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
            const ageObj = calculateAge(indDobInput.value);
            if (ageObj && !ageObj.error) {
                indAgeDisplay.innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold age-badge"><i class="fa-solid fa-cake-candles mr-2 text-sky-600"></i> Calculated Age: ${ageObj.text}</span>`;
            } else if (ageObj && ageObj.error) {
                indAgeDisplay.innerHTML = `<span class="text-xs text-rose-500 font-medium">Please enter a valid past Date of Birth</span>`;
            } else {
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

// Add a dynamic family member row
function addFamilyMemberRow(defaultRelation = 'Child') {
    const container = document.getElementById('family-members-container');
    if (!container) return;

    familyMembersCount++;
    const rowId = `member-row-${Date.now()}-${familyMembersCount}`;

    const row = document.createElement('div');
    row.id = rowId;
    row.className = "glass-card p-4 rounded-xl border border-slate-200 relative mb-3 bg-white/80 transition-all";
    row.innerHTML = `
        <div class="flex items-center justify-between mb-2">
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
                <label class="block text-xs font-medium text-slate-700 mb-1">Date of Birth</label>
                <input type="date" class="member-dob w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                <div class="member-age-display mt-1 min-h-[1.25rem]"></div>
            </div>
        </div>
    `;

    container.appendChild(row);

    // Attach DOB listener for this row
    const dobInput = row.querySelector('.member-dob');
    const ageDisplay = row.querySelector('.member-age-display');
    dobInput.addEventListener('change', () => {
        const ageObj = calculateAge(dobInput.value);
        if (ageObj && !ageObj.error) {
            ageDisplay.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold age-badge"><i class="fa-solid fa-cake-candles mr-1 text-sky-600"></i> Age: ${ageObj.text}</span>`;
        } else {
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
        const indDob = document.getElementById('ind-dob')?.value;
        if (!indDob) {
            alert("Please select your Date of Birth.");
            return;
        }
        const ageObj = calculateAge(indDob);
        const ageText = ageObj && !ageObj.error ? ageObj.text : 'Not calculated';
        membersSummaryText = `• Self (${fullName}): DOB: ${indDob} (Age: ${ageText})`;
        membersListForModal.push({ name: fullName, relation: 'Self (Individual)', dob: indDob, age: ageText });
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
        
        membersSummaryText = `• ${fullName} (${primaryRelation}): DOB ${primaryDob} (Age: ${primaryAgeText})\n`;
        membersListForModal.push({ name: fullName, relation: primaryRelation, dob: primaryDob, age: primaryAgeText });

        const container = document.getElementById('family-members-container');
        if (container) {
            const memberRows = container.querySelectorAll('[id^="member-row-"]');
            memberRows.forEach((row, idx) => {
                const mName = row.querySelector('.member-name')?.value.trim() || `Member ${idx + 1}`;
                const mRelation = row.querySelector('.member-relation')?.value || 'Family Member';
                const mDob = row.querySelector('.member-dob')?.value;
                const mAgeObj = calculateAge(mDob);
                const mAgeText = mAgeObj && !mAgeObj.error ? mAgeObj.text : 'N/A';
                
                membersSummaryText += `• ${mName} (${mRelation}): DOB ${mDob || 'N/A'} (Age: ${mAgeText})\n`;
                membersListForModal.push({ name: mName, relation: mRelation, dob: mDob || 'N/A', age: mAgeText });
            });
        }
    }

    // Construct WhatsApp formatted string
    const whatsappMessage = `🏥 *Health Insurance Quote Request*
----------------------------------------
👤 *Advisor*: Sudeep S
🏢 *Agency*: Policy Care Solutions (Star Health & Care Health)

📋 *Coverage Type*: ${formCoverageType.toUpperCase()}
👨‍👩‍👧 *Persons Covered*:
${membersSummaryText.trim()}

📍 *Address Details*:
• State: ${state}
• District: ${district}
• City: ${city}
• Pincode: ${pincode}

📞 *Contact Details*:
• Phone: +91 ${phone}
• Email: ${email || 'Not Provided'}

Kindly provide best Star Health & Care Health policy options and premium quote details!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const targetWhatsAppNum = "919048360880";
    const waUrl = `https://wa.me/${targetWhatsAppNum}?text=${encodedMessage}`;

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
                <p class="mt-1 text-slate-600">Your custom WhatsApp quote message has been prepared for Advisor Sudeep S.</p>
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

        const quickMsg = encodeURIComponent(`Hello Sudeep S, I am interested in knowing more about the *${policy.title}* (${policy.provider}) policy for my family.`);

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

