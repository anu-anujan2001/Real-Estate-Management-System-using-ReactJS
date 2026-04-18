const dotenv = require("dotenv");
dotenv.config();

const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (options) => {
  try {
    const BREVO_API_KEY = (process.env.BREVO_API_KEY || "").trim();
    const EMAIL_USER = (process.env.EMAIL_USER || "").trim();

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not defined in environment variables.");
    }

    if (!EMAIL_USER) {
      throw new Error("EMAIL_USER is not defined in environment variables.");
    }

    const data = {
      sender: {
        name: "Real Estate Management System",
        email: EMAIL_USER,
      },
      to: [
        {
          email: options.email,
        },
      ],
      subject: options.subject,
      htmlContent: options.message,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", result);
      throw new Error(result.message || result.code || "Failed to send email");
    }

    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
});

module.exports = sendEmail;
