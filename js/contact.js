// ======================================
// NAVBAR SCROLL EFFECT
// ======================================

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".custom-navbar");

    if (navbar) {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

});

// ======================================
// SCROLL REVEAL ANIMATION
// ======================================

const revealElements = document.querySelectorAll(
    ".contact-card, .contact-form-box, .location-details, .hours-box, .accordion-item"
);

revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = "all .8s ease";

});

function revealOnScroll() {

    const triggerBottom =
        window.innerHeight * 0.85;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < triggerBottom) {

            element.style.opacity = "1";
            element.style.transform =
                "translateY(0)";

        }

    });

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();

// ======================================
// CONTACT FORM VALIDATION
// ======================================

const contactForm =
    document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const inputs =
                contactForm.querySelectorAll(
                    "input, textarea"
                );

            let isValid = true;

            inputs.forEach(input => {

                if (
                    input.value.trim() === ""
                ) {

                    isValid = false;

                }

            });

            if (isValid) {

                showSuccess(
                    "Message sent successfully! We will contact you soon."
                );

                contactForm.reset();

            } else {

                showWarning(
                    "Please fill in all fields."
                );

            }

        }
    );

}

// ======================================
// CTA BUTTON ACTION
// ======================================

// CTA button is handled by navbar.js

// ======================================
// NEWSLETTER SUBSCRIBE
// ======================================

const newsletterButton =
    document.querySelector(".newsletter-btn");

if (newsletterButton) {

    newsletterButton.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            const emailInput = document.querySelector('.newsletter-input');
            if (emailInput && emailInput.value.trim()) {
                showSuccess("Thank you for subscribing!");
                emailInput.value = '';
            } else {
                showWarning("Please enter a valid email address");
            }

        }
    );

}

// ======================================
// CONTACT CARD HOVER EFFECT
// ======================================

const contactCards =
    document.querySelectorAll(".contact-card");

contactCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transition = ".4s";

    });

});

// ======================================
// FAQ ACCORDION ENHANCEMENT
// ======================================

const accordionButtons =
    document.querySelectorAll(
        ".accordion-button"
    );

accordionButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            button.style.transition =
                ".3s ease";

        }
    );

});

// ======================================
// BACK TO TOP BUTTON
// ======================================

const topButton =
    document.createElement("button");

topButton.innerHTML =
    '<i class="fa-solid fa-arrow-up"></i>';

topButton.style.position = "fixed";
topButton.style.bottom = "20px";
topButton.style.right = "20px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#d4af37";
topButton.style.color = "#111";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "999";
topButton.style.boxShadow =
    "0 10px 25px rgba(0,0,0,.2)";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topButton.style.display =
            "block";

    } else {

        topButton.style.display =
            "none";

    }

});

topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);

// ======================================
// BOOK NOW BUTTONS
// ======================================

// Book Now buttons are handled by navbar.js

// ======================================
// PAGE LOADED
// ======================================

window.addEventListener(
    "load",
    () => {

        console.log(
            "Contact page loaded successfully"
        );

    }
);