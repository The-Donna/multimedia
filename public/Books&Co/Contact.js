document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");

    // Handle form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Simple validation
        if (!name || !email || !message) {
            alert("Please fill in all the fields.");
            return;
        }

        // Optionally, you can validate the email format here
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Simulate sending data (you can replace this with an AJAX request if needed)
        console.log("Form Submitted:");
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Message:", message);

        // After form submission, display a success message
        alert("Thank you for your submission!");

        // Optionally, clear the form after submission
        form.reset();
    });
});

