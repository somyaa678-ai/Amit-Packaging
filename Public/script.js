// Get the contact form
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.getElementById("submitBtn");
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    statusMessage.textContent = "";
    statusMessage.className = "";

    const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        requirement: contactForm.requirement.value
    };

    
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {

        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {

    submitBtn.textContent = "✓ Enquiry Sent";
    submitBtn.classList.add("success-btn");

    contactForm.reset();

    setTimeout(() => {
        submitBtn.textContent = "Send Enquiry";
        submitBtn.classList.remove("success-btn");
        submitBtn.disabled = false;
    }, 3000);

} else {
const result = await response.json();
    statusMessage.textContent = `❌ ${result.message}`;
    statusMessage.className = "error";
    
    submitBtn.textContent = "Send Enquiry";
    submitBtn.disabled = false;
   
    

    } 
}catch (error) {


    console.error(error);

    statusMessage.textContent = "❌ Could not connect to the server.";
    statusMessage.className = "error";

    submitBtn.textContent = "Send Enquiry";
    submitBtn.disabled = false;
}


    
});