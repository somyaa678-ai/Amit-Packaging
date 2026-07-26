require("dotenv").config();

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 3000;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Serve all static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("Public"));

// Homepage

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
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📦 New Enquiry - AMIT PACKAGING",

        text: `
New Enquiry Received

Name: ${name}

Email: ${email}

Phone: ${phone}

Requirement:

${requirement}
        `,
    };

    try {

        await transporter.sendMail(mailOptions);

        res.status(200).json({
    message: "Enquiry sent successfully."
});

    } catch (error) {

        console.error(error);

        res.status(500).json({
    message: "Something went wrong."
});

    }

});


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
