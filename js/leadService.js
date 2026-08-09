/**
 * Policy Care Solutions - Client-Side Lead & Brevo Email Service
 */

window.leadService = {
    // Brevo Configuration Credentials
    defaultApiKey: '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',
    defaultSenderEmail: 'no-reply@policycaresolutions.com',
    defaultRecipients: [
        { email: 'sudeep.sangamam@gmail.com', name: 'Sudeep S' },
        { email: 'solutions.policycare@gmail.com', name: 'Policy Care Solutions' }
    ],

    // Get stored or default Brevo config
    getConfig: function() {
        return {
            apiKey: localStorage.getItem('pcs_brevo_api_key') || this.defaultApiKey,
            senderEmail: localStorage.getItem('pcs_brevo_sender_email') || this.defaultSenderEmail,
            recipients: this.defaultRecipients
        };
    },

    // Dispatch lead email asynchronously without blocking the user UI
    sendLeadEmail: async function(leadData) {
        const config = this.getConfig();
        const payload = {
            ...leadData,
            apiKey: config.apiKey,
            senderEmail: config.senderEmail,
            recipients: config.recipients
        };

        console.log("🚀 Dispatching Lead Email via Brevo Service...", payload);

        // 1. Try Vercel Serverless Endpoint /api/send-lead first
        try {
            const apiRes = await fetch('/api/send-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (apiRes.ok) {
                const data = await apiRes.json();
                console.log("✅ Lead Email sent via serverless API to sudeep.sangamam@gmail.com & solutions.policycare@gmail.com:", data);
                return { success: true, method: 'serverless', data };
            }
        } catch (err) {
            console.warn("Serverless /api/send-lead not reachable, executing direct Brevo client API dispatch...", err);
        }

        // 2. Direct Brevo API client dispatch
        if (config.apiKey) {
            try {
                const cleanPhone = (leadData.phone || '').replace(/\D/g, '');
                const membersHtml = Array.isArray(leadData.members) && leadData.members.length > 0
                    ? leadData.members.map((m, idx) => `
                        <tr>
                            <td style="padding: 6px; border-bottom: 1px solid #eee;">#${idx + 1}</td>
                            <td style="padding: 6px; border-bottom: 1px solid #eee; font-weight: bold;">${m.name || m.relation || 'Member'}</td>
                            <td style="padding: 6px; border-bottom: 1px solid #eee;">${m.relation || 'Self'}</td>
                            <td style="padding: 6px; border-bottom: 1px solid #eee; color: #16a34a;">${m.dob || m.age || 'N/A'}</td>
                        </tr>
                    `).join('')
                    : `<tr><td colspan="4" style="padding: 6px; color: #64748b;">Primary Applicant Only</td></tr>`;

                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px;">
                            <h2 style="color: #005696; margin-top: 0;">🔥 New Quote Lead: ${leadData.name}</h2>
                            <p><strong>Phone:</strong> +91 ${leadData.phone}</p>
                            <p><strong>Email:</strong> ${leadData.email || 'Not Provided'}</p>
                            <p><strong>Coverage:</strong> ${(leadData.coverageType || 'Health').toUpperCase()}</p>
                            <p><strong>Location:</strong> ${leadData.pincode || ''} ${leadData.city ? `(${leadData.city})` : ''} ${leadData.state ? `, ${leadData.state}` : ''}</p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                            <h3>Covered Family Members</h3>
                            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                <thead>
                                    <tr style="background: #f1f5f9;">
                                        <th style="padding: 6px; text-align: left;">#</th>
                                        <th style="padding: 6px; text-align: left;">Name</th>
                                        <th style="padding: 6px; text-align: left;">Relation</th>
                                        <th style="padding: 6px; text-align: left;">Age/DOB</th>
                                    </tr>
                                </thead>
                                <tbody>${membersHtml}</tbody>
                            </table>
                            <div style="margin-top: 20px; text-align: center;">
                                <a href="https://wa.me/91${cleanPhone}" target="_blank" style="background: #10b981; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                                    Connect on WhatsApp (+91 ${leadData.phone})
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': config.apiKey,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: "Policy Care Solutions Leads", email: config.senderEmail },
                        to: config.recipients,
                        subject: `🔥 New Quote Lead: ${leadData.name} (+91 ${leadData.phone})`,
                        htmlContent: htmlContent
                    })
                });

                if (brevoRes.ok) {
                    console.log("✅ Direct Brevo API Lead Email delivered to sudeep.sangamam@gmail.com & solutions.policycare@gmail.com!");
                    return { success: true, method: 'direct_brevo' };
                } else {
                    const errData = await brevoRes.json();
                    console.error("Direct Brevo Response Error:", errData);
                }
            } catch (directErr) {
                console.error("Direct Brevo API Exception:", directErr);
            }
        }

        return { success: false, message: 'Lead dispatch failed' };
    }
};
