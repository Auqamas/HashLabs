
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Toggle Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check on page load

    // Hover animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Typewriter effect for hero title
    const heroTitle = document.querySelector('.page1 h1');
    if (heroTitle) {
        const heroText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < heroText.length) {
                heroTitle.textContent += heroText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.reset();
        });
    }

    // Scene animations
    const animateScene = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scene = entry.target;
                scene.classList.add('animated');
                observer.unobserve(scene);
            }
        });
    };

    const sceneObserver = new IntersectionObserver(animateScene, {
        root: null,
        threshold: 0.1
    });

    const scenes = document.querySelectorAll('.animate-on-scroll');
    scenes.forEach(scene => {
        sceneObserver.observe(scene);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }

    // Interactive project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('img').style.transform = 'scale(1.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('img').style.transform = 'scale(1)';
        });
    });

    // Animated counter for achievements
    const animateCounter = (element, target, duration) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            if (start >= target) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, 16);
    };

    const achievementCounters = document.querySelectorAll('.achievement-counter');
    achievementCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target, 2000);
    });
});

const content = [
    {
        heading: "Empowering Smart Energy Networks",
        text: "Offering high-performance switchgear solutions to safeguard electrical systems and enhance operational safety.",
    },
    {
        heading: "Smarter Grids for Smarter Cities",
        text: "Connecting communities with intelligent, adaptive grid technologies for sustainable urban growth.",
    },
    {
        heading: "Reliable Protection, Powering Your Systems",
        text: "Offering high-performance switchgear solutions to safeguard electrical systems and enhance operational safety.",
    },
    {
        heading: "Research-Driven Excellence",
        text: "Combining deep expertise in computer science, AI, and engineering, we focus on R&D with the help of simulations to model complex systems, solve challenges, and deliver future-ready solutions.",
    },
];

let currentIndex = 0;
let autoScroll = true;
let interval;

const scrollContainer = document.getElementById("scrollContainer");
const heading = document.getElementById("heading");
const description = document.getElementById("description");
const pauseBtn = document.getElementById("pauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function updateContent() {
    scrollContainer.style.transform = `translateX(-${currentIndex * 25}%)`;
    heading.textContent = content[currentIndex].heading;
    description.textContent = content[currentIndex].text;
}

function startAutoScroll() {
    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % content.length;
        updateContent();
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(interval);
}

function toggleAutoScroll() {
    autoScroll = !autoScroll;
    if (autoScroll) {
        pauseBtn.textContent = "❚❚ Pause";
        startAutoScroll();
    } else {
        pauseBtn.textContent = "▶ Resume";
        stopAutoScroll();
    }
}

function slideLeft() {
    stopAutoScroll();
    currentIndex = (currentIndex - 1 + content.length) % content.length;
    updateContent();
}

function slideRight() {
    stopAutoScroll();
    currentIndex = (currentIndex + 1) % content.length;
    updateContent();
}

// Event Listeners
pauseBtn.addEventListener("click", toggleAutoScroll);
prevBtn.addEventListener("click", slideLeft);
nextBtn.addEventListener("click", slideRight);

// Initialize
window.onload = () => {
    updateContent();
    startAutoScroll();
};

// Progress Bar Update
document.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / docHeight) * 100;

    const progressBar = document.querySelector(".custom-progress-bar");
    progressBar.style.width = `${scrollProgress}%`;
});

// Section Animation on Scroll
const customSections = document.querySelectorAll(".custom-section");

const customObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    },
    {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: "-100px", // Adjust viewport margin
    }
);

// Attach the observer to each section
customSections.forEach((section) => customObserver.observe(section));

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('#main');

    if (mainElement) {
        const scroll = new LocomotiveScroll({
            el: mainElement,
            smooth: true,
            getSpeed: true,  // Optional, depends on your use
            getDirection: true, // Optional, depends on your use
        });

        // Refresh Locomotive Scroll on content changes
        window.addEventListener('load', () => {
            scroll.update();
        });

        // Example for page-specific behavior
        scroll.on('scroll', (args) => {
            console.log(args); // Debug scrolling data
        });
    } else {
        console.warn("Locomotive Scroll: #main element not found on this page.");
    }
});


Shery.textAnimate("#headings h1", {
    zindex: 999,
    style: 2,
    y: 10,
    delay: 0.3,
    duration: 2,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
});

// GSAP Animation for navigation links
gsap.from(".animation-ephemeral", {
    stagger: .3,        // Animates one after the other
    y: 50,              // Moves from 10px below
    duration: 1,        // Animation lasts 2 seconds
    ease: "expo",       // Easing function
    opacity: 0          // Fades in
});

Shery.imageEffect(".anim2 .serv-main-img img", {
    style: 3,
    config: {"uFrequencyX":{"value":5.34,"range":[0,100]},"uFrequencyY":{"value":5.34,"range":[0,100]},"uFrequencyZ":{"value":11.45,"range":[0,100]},"geoVertex":{"range":[1,64],"value":11.1},"zindex":{"value":"-1","range":[-1,9999999]},"aspect":{"value":0.7481582205264546},"ignoreShapeAspect":{"value":false},"shapePosition":{"value":{"x":-0.05,"y":0}},"shapeScale":{"value":{"x":0.5,"y":0.5}},"shapeEdgeSoftness":{"value":0,"range":[0,0.5]},"shapeRadius":{"value":0.02,"range":[0,2]},"currentScroll":{"value":0},"scrollLerp":{"value":0.07},"gooey":{"value":false},"infiniteGooey":{"value":false},"growSize":{"value":4,"range":[1,15]},"durationOut":{"value":1,"range":[0.1,5]},"durationIn":{"value":1.5,"range":[0.1,5]},"displaceAmount":{"value":0.5},"masker":{"value":true},"maskVal":{"value":1.4,"range":[1,5]},"scrollType":{"value":0},"noEffectGooey":{"value":true},"onMouse":{"value":0},"noise_speed":{"value":0.2,"range":[0,10]},"metaball":{"value":0.2,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0.002,"range":[0,0.1]},"noise_height":{"value":0.5,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]}},
});

// Force the image's z-index to ensure it doesn’t overlap with other elements
const imageText = document.querySelector("#imagetext img");
if (imageText) {
    imageText.style.zIndex = "-2"; // Set z-index to be behind other elements
    imageText.style.position = "relative"; // Ensure proper stacking context
}


Shery.imageEffect("#susimagewrapper img", {
    style: 5,
    config: { "a": { "value": 0.23, "range": [0, 30] }, "b": { "value": -0.85, "range": [-1, 1] }, "zindex": { "value": 1, "range": [-1, 9999999] }, "aspect": { "value": 0.6666666666666666 }, "ignoreShapeAspect": { "value": true }, "shapePosition": { "value": { "x": 0, "y": 0 } }, "shapeScale": { "value": { "x": 0.5, "y": 0.5 } }, "shapeEdgeSoftness": { "value": 0, "range": [0, 0.5] }, "shapeRadius": { "value": 0, "range": [0, 2] }, "currentScroll": { "value": 0 }, "scrollLerp": { "value": 0.07 }, "gooey": { "value": false }, "infiniteGooey": { "value": false }, "growSize": { "value": 4, "range": [1, 15] }, "durationOut": { "value": 1, "range": [0.1, 5] }, "durationIn": { "value": 1.5, "range": [0.1, 5] }, "displaceAmount": { "value": 0.5 }, "masker": { "value": true }, "maskVal": { "value": 1.21, "range": [1, 5] }, "scrollType": { "value": 0 }, "geoVertex": { "range": [1, 64], "value": 1 }, "noEffectGooey": { "value": true }, "onMouse": { "value": 0 }, "noise_speed": { "value": 0.2, "range": [0, 10] }, "metaball": { "value": 0.2, "range": [0, 2] }, "discard_threshold": { "value": 0.5, "range": [0, 1] }, "antialias_threshold": { "value": 0.002, "range": [0, 0.1] }, "noise_height": { "value": 0.5, "range": [0, 2] }, "noise_scale": { "value": 10, "range": [0, 100] } },
});


Shery.imageEffect("#page-image img", {
    style: 6,
    config: {"noiseDetail":{"value":7.44,"range":[0,100]},"distortionAmount":{"value":2.98,"range":[0,10]},"scale":{"value":36.36,"range":[0,100]},"speed":{"value":0.79,"range":[0,1]},"zindex":{"value":"-1","range":[-1,1]},"aspect":{"value":0.732824427480916},"ignoreShapeAspect":{"value":true},"shapePosition":{"value":{"x":0,"y":0}},"shapeScale":{"value":{"x":0.5,"y":0.5}},"shapeEdgeSoftness":{"value":0,"range":[0,0.5]},"shapeRadius":{"value":0,"range":[0,2]},"currentScroll":{"value":0},"scrollLerp":{"value":0.07},"gooey":{"value":false},"infiniteGooey":{"value":false},"growSize":{"value":4,"range":[1,15]},"durationOut":{"value":1,"range":[0.1,5]},"durationIn":{"value":1.5,"range":[0.1,5]},"displaceAmount":{"value":0.5},"masker":{"value":true},"maskVal":{"value":1.34,"range":[1,5]},"scrollType":{"value":0},"geoVertex":{"range":[1,64],"value":3.4},"noEffectGooey":{"value":true},"onMouse":{"value":1},"noise_speed":{"value":0.2,"range":[0,10]},"metaball":{"value":0.2,"range":[0,2]},"discard_threshold":{"value":0.5,"range":[0,1]},"antialias_threshold":{"value":0.002,"range":[0,0.1]},"noise_height":{"value":0.5,"range":[0,2]},"noise_scale":{"value":10,"range":[0,100]},"uFrequencyX":{"value":5.34,"range":[0,100]},"uFrequencyY":{"value":5.34,"range":[0,100]},"uFrequencyZ":{"value":11.45,"range":[0,100]}},
});


gsap.from("#imgetext img", {
    z: "70",
    opacity: 0,
    zindex: 0,
    duration: 2,
    ease: Expo,
});


// Team Page Codes
// Global smooth scroll fix
document.documentElement.style.scrollBehavior = 'smooth';
