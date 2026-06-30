import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 2. Destructure and basic sanitization
    const { name, email, phone, company, service, message } = req.body;

    // 3. Validation
    if (!name || !email || !phone || !company || !service || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Basic regex validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Strip HTML tags for basic sanitization (simple approach)
    const sanitize = (str) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safePhone = sanitize(phone);
    const safeCompany = sanitize(company);
    const safeService = sanitize(service);
    const safeMessage = sanitize(message);

    // Limit lengths (increased to 5000 to accommodate detailed project briefs)
    if (safeMessage.length > 5000) {
      return res.status(400).json({ success: false, code: 'VALIDATION_FAILED', message: 'Message is too long. Please keep it under 5000 characters.' });
    }

    // 4. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Increase timeout for serverless environments
      connectionTimeout: 10000,
    });

    // Verify connection configuration (optional, but good for robust error throwing)
    // await transporter.verify(); // can slow down cold starts, omitted for speed, but try/catch catches send errors anyway.

    // 5. Admin Email Template
    const adminMailOptions = {
      from: `"${safeName}" <${process.env.FROM_EMAIL}>`, // Use authenticated email to prevent bounce, but show sender name
      replyTo: safeEmail,
      to: 'editaura.ea@gmail.com',
      subject: `🚀 New Website Enquiry - Edit Aura`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111111; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
          <div style="background-color: #000000; padding: 24px; border-bottom: 1px solid #333; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">EDIT AURA</h1>
            <p style="margin: 8px 0 0 0; color: #888; font-size: 12px; letter-spacing: 1px;">NEW PIPELINE ENQUIRY</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; width: 120px; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #ffffff; text-decoration: none;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Company</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px;">${safeCompany}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; font-size: 14px; font-weight: bold;">${safeService}</td>
              </tr>
            </table>
            
            <div style="margin-top: 24px;">
              <p style="margin: 0 0 8px 0; color: #888; font-size: 11px; text-transform: uppercase; font-weight: bold;">Project Brief</p>
              <div style="background-color: #1a1a1a; padding: 16px; border-radius: 8px; border: 1px solid #222; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
            </div>
          </div>
          
          <div style="background-color: #000; padding: 16px 24px; border-top: 1px solid #222; font-size: 10px; color: #666; font-family: monospace;">
            TIMESTAMP: ${new Date().toISOString()}<br>
            USER AGENT: ${req.headers['user-agent'] || 'Unknown'}<br>
            SOURCE: Edit Aura Website
          </div>
        </div>
      `
    };

    // 6. Customer Auto Reply Template
    const customerMailOptions = {
      from: `"Edit Aura" <${process.env.FROM_EMAIL}>`,
      to: safeEmail,
      subject: `Thank You for Contacting Edit Aura`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #111111; border-radius: 12px; overflow: hidden; border: 1px solid #eeeeee;">
          <div style="background-color: #000000; padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">EDIT AURA</h1>
          </div>
          
          <div style="padding: 40px 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: bold;">Hello ${safeName},</h2>
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #444;">
              Thank you for reaching out. We have successfully received your project brief regarding <strong>${safeService}</strong>.
            </p>
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #444;">
              Our creative team will review your requirements and a specialist will get back to you within the next 24-48 hours to discuss how we can build a brand people remember.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Your Submitted Details</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Company:</strong> ${safeCompany}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Service:</strong> ${safeService}</p>
            </div>
            
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #444;">
              Best regards,<br>
              <strong>The Edit Aura Team</strong>
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; font-size: 12px; color: #888;">
              Edit Aura Creative Agency<br>
              <a href="mailto:editaura.ea@gmail.com" style="color: #000; text-decoration: none;">editaura.ea@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };

    // 7. Send Emails (Using Promise.all for parallel execution to reduce response time)
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    // 8. Return Success
    return res.status(200).json({ success: true, message: 'Enquiry sent successfully.' });

  } catch (error) {
    console.error('SMTP Error Stack Trace:', error.stack || error);
    
    // Provide structured JSON with detailed diagnostics
    return res.status(500).json({
      success: false,
      code: error.code || 'SMTP_INTERNAL_ERROR',
      message: 'Unable to send your enquiry. Please try again later.',
      details: error.message || 'Unknown SMTP error occurred during transmission'
    });
  }
}
