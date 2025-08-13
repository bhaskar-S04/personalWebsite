

const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

sections.forEach(section => {
    observer.observe(section);
});

const fadeTexts = document.querySelectorAll(".fade-in-text");

fadeTexts.forEach (text => {
    observer.observe(text);
});


// Contact form Handling....
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://formsubmission-73ah.onrender.com";

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Reset previous message
    formMessage.classList.remove("show");

    let errorText = "";
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //Email validation...


    // Basic validation...
    if (!name || !email || !message) {
        errorText = "! Please fill in all the fields.";
        formMessage.style.color = "crimson";
        formMessage.classList.add("show");
        return;
    }


    if (!emailPattern.test(email)) {
        errorText = "! Please enter a valid email address.";
        formMessage.style.color = "crimson";
        formMessage.classList.add("show");
        return;
    } 

    // Sending status...
    formMessage.textContent = "Sending...";
    formMessage.style.color = "black";
    formMessage.classList.add("show");

    try {
        const response = await fetch (`${API_BASE_URL}/contact`, {
            method: "POST",
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify({name, email, message})
        });

        const result = await response.json();

        if (response.ok) {
            formMessage.textContent = "Message sent successfully!";
            formMessage.style.color = "green";
            contactForm.reset();

            Swal.fire({
                title: "Success!",
                text: "Your message has been sent",
                icon: "success",
                confirmButton: "#3085d6"
            });
        } else {
            throw new Error(result.message || "Unknown error occured.");
        }
    } catch (error) {
        console.error("Wrror:", error);
        formMessage.textContent = "Error sending message.";
        formMessage.style.color = "red";

        Swal.fire({
            title: "Oops!",
            text: error.message || "Something went wrong. Please try again later.",
            icon: "error",
            confirmButtonColor: "#d33"
        });
    }
    

});


// Scroll to Top button...
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


const typingText = document.getElementById("typingText");
const textToType = "Welcome to my website";
let charIndex = 0;

function typeEffect() {
    if (charIndex < textToType.length) {
        typingText.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    }
}

const homeSection = document.getElementById("home");

const homeObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
        typeEffect();
        observer.unobserve(homeSection);
    }
}, {
    threshold: 0.5
});

homeObserver.observe(homeSection);

const fadeObserver = new IntersectionObserver((entries, fadeObserver) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

const fadeText = document.querySelectorAll(".fade-in-text");
fadeText.forEach(text => fadeObserver.observe(text));




const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "アァイィウヴエカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for(let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i*fontSize, drops[i]*fontSize);

        if (drops[i]*fontSize > canvas.height && Math.random()>0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
