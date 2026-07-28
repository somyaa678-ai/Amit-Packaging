require("dotenv").config();

const express = require("express");
const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));

// Contact Form
app.post("/contact", async (req, res) => {

    const { name, email, phone, requirement } = req.body;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedRequirement = requirement.trim();

    if (
        !trimmedName ||
        !trimmedEmail ||
        !trimmedPhone ||
        !trimmedRequirement
    ) {
        return res.status(400).json({
            message: "Please fill all fields."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
            message: "Please enter a valid email address."
        });
    }

    try {

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: process.env.EMAIL_USER,
            subject: "📦 New Enquiry - AMIT PACKAGING",
            text: `
New Enquiry Received

Name: ${trimmedName}

Email: ${trimmedEmail}

Phone: ${trimmedPhone}

Requirement:

${trimmedRequirement}
            `,
        });

        return res.status(200).json({
            message: "Enquiry sent successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Something went wrong."
        });

    }

});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});