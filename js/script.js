// ======================================
// STACKLY RESORT & HOTEL
// ULTIMATE SCRIPT.JS
// ======================================

// ======================================
// NAVBAR SCROLL EFFECT
// ======================================

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".custom-navbar");

    if (!navbar) return;

    if (window.scrollY > 80) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});

// ======================================
// SMOOTH SCROLL
// ======================================

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
        "click",
        function(e){

            const target =
                this.getAttribute("href");

            if(
                target === "#" ||
                target.length <= 1
            ){
                return;
            }

            const section =
                document.querySelector(target);

            if(section){

                e.preventDefault();

                section.scrollIntoView({

                    behavior:"smooth"

                });

            }

        }
    );

});

// ======================================
// COUNTER ANIMATION
// ======================================

const counters =
    document.querySelectorAll(".counter");

function startCounter(){

    counters.forEach(counter => {

        const target =
            Number(
                counter.dataset.target
            );

        let count = 0;

        const increment =
            Math.ceil(target / 100);

        const updateCounter = () => {

            if(count < target){

                count += increment;

                if(count > target){

                    count = target;

                }

                counter.innerText =
                    count;

                setTimeout(
                    updateCounter,
                    20
                );

            }

        };

        updateCounter();

    });

}

// ======================================
// INTERSECTION OBSERVER
// ======================================

const statsSection =
    document.querySelector(
        ".stats-section"
    );

if(statsSection){

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if(
                            entry.isIntersecting
                        ){

                            startCounter();

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold:0.3
            }

        );

    observer.observe(
        statsSection
    );

}

// ======================================
// BOOK NOW BUTTONS
// ======================================

// Book Now buttons are now handled by navbar.js
// which properly redirects to rooms.html

// ======================================
// SEARCH BUTTON
// ======================================

// Search button functionality handled by rooms.js

// ======================================
// IMAGE HOVER EFFECT
// ======================================

const galleryImages =
    document.querySelectorAll(
        ".gallery-section img"
    );

galleryImages.forEach(image => {

    image.addEventListener(
        "mouseenter",
        () => {

            image.style.transition =
                ".4s";

        }
    );

});

// ======================================
// SCROLL REVEAL ANIMATION
// ======================================

const revealElements =
    document.querySelectorAll(

        ".featured-room-card, \
        .amenity-card, \
        .testimonial-card, \
        .stat-card"

    );

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if(
                        entry.isIntersecting
                    ){

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                }
            );

        },

        {
            threshold:0.2
        }

    );

revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(40px)";

    element.style.transition =
        ".6s ease";

    revealObserver.observe(
        element
    );

});

// ======================================
// BACK TO TOP BUTTON
// ======================================

const topButton =
    document.createElement(
        "button"
    );

topButton.classList.add(
    "back-to-top"
);

topButton.innerHTML =
    '<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(
    topButton
);

window.addEventListener(
    "scroll",
    () => {

        if(window.scrollY > 300){

            topButton.style.display =
                "block";

        } else {

            topButton.style.display =
                "none";

        }

    }
);

topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }
);

// ======================================
// CURRENT YEAR
// ======================================

const year =
    document.getElementById(
        "currentYear"
    );

if(year){

    year.textContent =
        new Date().getFullYear();

}

// ======================================
// PAGE LOADED
// ======================================

window.addEventListener(
    "load",
    () => {

        console.log(
            "✅ Stackly Resort & Hotel Loaded Successfully"
        );

    }
);

// ======================================
// PRELOADER SUPPORT (OPTIONAL)
// ======================================

const preloader =
    document.querySelector(
        ".preloader"
    );

if(preloader){

    window.addEventListener(
        "load",
        () => {

            preloader.style.display =
                "none";

        }
    );

}