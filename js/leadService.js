/**
 * Policy Care Solutions - Client-Side Lead Service
 * Dispatches leads securely via Vercel Serverless Function /api/send-lead
 */

window.leadService = {
    // Dispatch lead email asynchronously without blocking the user UI
    sendLeadEmail: async function(leadData) {
        console.log("🚀 Dispatching Lead Email to Advisor Inboxes...", leadData);

        try {
            const apiRes = await fetch('/api/send-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            });

            if (apiRes.ok) {
                const data = await apiRes.json();
                console.log("✅ Lead Email successfully dispatched to advisor inboxes via serverless API:", data);
                return { success: true, method: 'serverless', data };
            } else {
                const errData = await apiRes.json();
                console.warn("⚠️ Lead email API response:", errData);
            }
        } catch (err) {
            console.warn("Could not reach /api/send-lead serverless function:", err);
        }

        return { success: false, message: 'Serverless API dispatch completed' };
    }
};
