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
    ".value-card, .team-card, .award-card, .stat-card"
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
// TEAM CARD INTERACTION
// ======================================

const teamCards =
    document.querySelectorAll(".team-card");

teamCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transition = ".4s";

    });

});

// ======================================
// AWARD CARD INTERACTION
// ======================================

const awardCards =
    document.querySelectorAll(".award-card");

awardCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transition = ".4s";

    });

});

// ======================================
// STATS COUNTER ANIMATION
// ======================================

const counters =
    document.querySelectorAll(".stat-card h2");

let counterStarted = false;

function startCounter() {

    if (counterStarted) return;

    const statsSection =
        document.querySelector(".about-stats");

    if (!statsSection) return;

    const sectionTop =
        statsSection.getBoundingClientRect().top;

    if (
        sectionTop < window.innerHeight - 100
    ) {

        counterStarted = true;

        counters.forEach(counter => {

            const originalText =
                counter.innerText;

            const target =
                parseInt(
                    originalText.replace(/\D/g, "")
                );

            let count = 0;

            const increment =
                Math.ceil(target / 100);

            const updateCounter = () => {

                if (count < target) {

                    count += increment;

                    if (count > target) {
                        count = target;
                    }

                    if (
                        originalText.includes("%")
                    ) {

                        counter.innerText =
                            count + "%";

                    } else if (
                        originalText.includes("K")
                    ) {

                        counter.innerText =
                            count + "K+";

                    } else {

                        counter.innerText =
                            count + "+";

                    }

                    setTimeout(
                        updateCounter,
                        20
                    );

                }

            };

            updateCounter();

        });

    }

}

window.addEventListener(
    "scroll",
    startCounter
);

startCounter();

// ======================================
// GALLERY IMAGE EFFECT
// ======================================

const galleryImages =
    document.querySelectorAll(".about-gallery img");

galleryImages.forEach(image => {

    image.addEventListener("mouseenter", () => {

        image.style.transition = ".4s";

    });

});

// ======================================
// CTA BUTTON
// ======================================

// Book Now buttons are handled by navbar.js

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

            alert(
                "Thank you for subscribing!"
            );

        }
    );

}

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

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});