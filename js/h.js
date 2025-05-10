document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    animateElements();
});

async function initParticles() {
    try {
        await tsParticles.load("particles-canvas", {
            fullScreen: false,
            background: {
                color: {
                    value: "transparent"
                }
            },
            fpsLimit: 60,
            particles: {
                color: {
                    value: ["#4285f4", "#ea4335", "#fbbc05", "#34a853"]
                },
                links: {
                    color: "#5f6368",
                    distance: 150,
                    enable: true,
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "out"
                    },
                    random: false,
                    speed: 0.8,
                    straight: false
                },
                number: {
                    density: {
                        enable: true,
                        area: 1000
                    },
                    value: 40
                },
                opacity: {
                    value: 0.5
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 3 }
                }
            },
            detectRetina: true
        });
    } catch (error) {
        console.error("Particles initialization error:", error);
        // Fallback to simple background
        document.body.style.background = "#ffffff";
    }
}

function animateElements() {
    const timeline = gsap.timeline({
        defaults: { 
            ease: "power3.out"
        }
    });

    timeline
        .to("#logo", {
            opacity: 1,
            y: 0,
            duration: 1.2
        })
        .to("#coming-soon", {
            opacity: 1,
            y: 0,
            duration: 1
        }, "-=0.7");

    // Subtle animation for the backdrop
    gsap.to(".backdrop", {
        scale: 1.05,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Responsive handling
    function handleResize() {
        if (window.innerWidth < 768) {
            gsap.set("#logo", { fontSize: "4rem" });
            gsap.set("#coming-soon", { fontSize: "1.5rem" });
        } else {
            gsap.set("#logo", { fontSize: "6rem" });
            gsap.set("#coming-soon", { fontSize: "2rem" });
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
}
