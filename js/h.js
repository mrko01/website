document.addEventListener('DOMContentLoaded', () => {
    setupParticles();
    animateElements();
});

function setupParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#4285f4', '#ea4335', '#fbbc05', '#34a853']
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#5f6368',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

function animateElements() {
    const timeline = gsap.timeline({
        defaults: { 
            ease: 'power3.out'
        }
    });

    timeline
        .to('#logo', {
            duration: 1.2,
            opacity: 1,
            y: 0,
            stagger: 0.2
        })
        .to('.dots-container', {
            duration: 0.8,
            opacity: 1,
            y: 0
        }, '-=0.4')
        .to('#coming-soon', {
            duration: 1,
            opacity: 1,
            y: 0
        }, '-=0.4');

    animateDots();
}

function animateDots() {
    const dots = document.querySelectorAll('.dot');
    
    gsap.to(dots, {
        scale: 1.2,
        duration: 0.8,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        gsap.set('#logo', { fontSize: '3.5rem' });
        gsap.set('#coming-soon', { fontSize: '1.5rem' });
    } else {
        gsap.set('#logo', { fontSize: '5rem' });
        gsap.set('#coming-soon', { fontSize: '2rem' });
    }
});
