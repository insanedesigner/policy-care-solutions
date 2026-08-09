/**
 * Serverless Function: Brevo Transactional Email Lead Dispatcher for Policy Care Solutions
 * Path: /api/send-lead
 * 
 * Secure Serverless Backend API Route (Zero secrets stored in git/client code)
 * Environment Variables used from Vercel:
 * - BREVO_API_KEY (Required)
 * - LEAD_RECIPIENT_EMAIL (Optional: supports comma-separated emails, e.g. "sudeep.sangamam@gmail.com, solutions.policycare@gmail.com")
 * - BREVO_SENDER_EMAIL (Optional: defaults to "no-reply@policycaresolutions.com")
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      name,
      phone,
      email,
      coverageType,
      state,
      district,
      city,
      pincode,
      members = [],
      source = 'Website Lead'
    } = req.body || {};

    // 1. Read API Key strictly from Vercel Serverless environment variable
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@policycaresolutions.com';
    const senderName = 'Policy Care Solutions Leads';

    if (!brevoApiKey) {
      console.error('Missing BREVO_API_KEY in Vercel Environment Variables');
      return res.status(500).json({
        error: 'BREVO_API_KEY is not configured in Vercel Environment Variables.'
      });
    }

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required lead fields (name, phone).' });
    }

    // 2. Parse Recipients: Handles single or comma-separated emails in LEAD_RECIPIENT_EMAIL
    let toRecipients = [];
    const envEmails = process.env.LEAD_RECIPIENT_EMAIL;

    if (envEmails && envEmails.trim()) {
      const emailList = envEmails.split(/[,;]/).map(e => e.trim()).filter(e => e.length > 0 && e.includes('@'));
      if (emailList.length > 0) {
        toRecipients = emailList.map(e => ({
          email: e,
          name: e.includes('sudeep') ? 'Sudeep S' : 'Policy Care Desk'
        }));
      }
    }

    // Fallback default to both advisor inboxes if not specified
    if (toRecipients.length === 0) {
      toRecipients = [
        { email: 'sudeep.sangamam@gmail.com', name: 'Sudeep S' },
        { email: 'solutions.policycare@gmail.com', name: 'Policy Care Solutions' }
      ];
    }

    // 3. Format covered family members table
    const membersHtml = Array.isArray(members) && members.length > 0
      ? members.map((m, idx) => `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 12px; font-weight: bold; color: #0284c7;">#${idx + 1}</td>
            <td style="padding: 8px 12px; color: #1e293b;">${m.name || m.relation || 'Member'}</td>
            <td style="padding: 8px 12px; color: #475569;">${m.relation || 'Self'}</td>
            <td style="padding: 8px 12px; color: #16a34a; font-weight: bold;">${m.dob || m.age || 'N/A'}</td>
          </tr>
        `).join('')
      : `<tr><td colspan="4" style="padding: 8px 12px; color: #64748b;">Primary Applicant Only</td></tr>`;

    // 4. Construct Email HTML Template
    const cleanPhone = String(phone).replace(/\D/g, '');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          
          <div style="background: linear-gradient(135deg, #005696 0%, #0d9488 100%); color: #ffffff; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Policy Care Solutions</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">New Insurance Quote Lead Received (${source})</p>
          </div>

          <div style="padding: 24px;">
            
            <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 16px; color: #0369a1;">Customer Profile: ${name}</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #0284c7; font-weight: bold;">Phone: <a href="tel:${cleanPhone}" style="color: #0284c7; text-decoration: none;">+91 ${cleanPhone}</a></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 120px;">Full Name:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Mobile Phone:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">+91 ${cleanPhone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Email Address:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${email || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Coverage Type:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0d9488;">${(coverageType || 'Health').toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Location:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${pincode || ''} ${city ? `(${city})` : ''} ${district ? `, ${district}` : ''} ${state ? `, ${state}` : ''}</td>
              </tr>
            </table>

            <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Covered Family Members</h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f1f5f9; color: #475569;">
                  <th style="padding: 8px 12px;">#</th>
                  <th style="padding: 8px 12px;">Name</th>
                  <th style="padding: 8px 12px;">Relationship</th>
                  <th style="padding: 8px 12px;">Age / DOB</th>
                </tr>
              </thead>
              <tbody>
                ${membersHtml}
              </tbody>
            </table>

            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 8px; text-align: center; margin-top: 20px;">
              <a href="https://wa.me/91${cleanPhone}" target="_blank" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px;">
                Connect with Customer on WhatsApp (+91 ${cleanPhone})
              </a>
            </div>

          </div>

          <div style="background: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Policy Care Solutions Lead Management System • Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>

        </div>
      </body>
      </html>
    `;

    // 5. Send via Brevo Transactional Email API v3
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: toRecipients,
        subject: `🔥 New Quote Lead: ${name} (${city || pincode || 'India'})`,
        htmlContent: htmlContent
      })
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('Brevo API Error Response:', brevoData);
      return res.status(brevoResponse.status).json({
        error: 'Brevo API returned error',
        details: brevoData
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead email sent to advisor inboxes successfully!',
      recipients: toRecipients.map(r => r.email),
      messageId: brevoData.messageId
    });

  } catch (error) {
    console.error('Send Lead Serverless Exception:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
