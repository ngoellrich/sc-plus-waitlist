// Always start at the top on load/refresh
window.scrollTo(0, 0);
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    const statesGrid = document.getElementById('states-grid');
    const form = document.getElementById('waitlist-form');
    const formContainer = document.getElementById('form-container');

    // ── Floating Particles ──
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.3 + 0.08);
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.fadeSpeed = Math.random() * 0.0015 + 0.0005;
            // Gentle sine wave drift
            this.driftAmp = Math.random() * 0.3 + 0.1;
            this.driftSpeed = Math.random() * 0.02 + 0.005;
            this.age = Math.random() * 1000;
        }
        update() {
            this.age++;
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.age * this.driftSpeed) * this.driftAmp;
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0 || this.y < -10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 186, 62, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 55; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ── Setup heading with word spans ──
    const heading = document.getElementById('hero-heading');
    const headingText = 'Run your entire solar company on one platform';
    heading.innerHTML = headingText.split(' ').map(w => `<span class="word">${w}</span>`).join('');

    // ── Intro Animation Sequence ──
    const curtain = document.getElementById('intro-curtain');
    const curtainLogo = document.getElementById('curtain-logo');
    const curtainLine = document.getElementById('curtain-line');
    const logo = document.querySelector('.hero .logo');
    const subtitle = document.getElementById('hero-sub');
    const formWrapper = document.querySelector('.form-wrapper');
    const words = heading.querySelectorAll('.word');

    // Step 1 (0ms): Logo fades in on curtain
    setTimeout(() => {
        curtainLogo.classList.add('visible');
    }, 300);

    // Step 1b: Shine sweeps across the logo
    setTimeout(() => {
        curtainLogo.classList.add('shine');
    }, 900);

    // Step 2 (1100ms): Line expands under logo
    setTimeout(() => {
        curtainLine.classList.add('expand');
    }, 1100);

    // Step 3 (1900ms): Glow fades, line shrinks
    setTimeout(() => {
        curtainLogo.classList.add('glow-out');
        curtainLine.classList.add('shrink');
    }, 1900);

    // Step 4 (2300ms): Curtain fades out smoothly to white page
    setTimeout(() => {
        curtain.classList.add('fading');
    }, 2300);

    // Step 5 (2500ms): Logo in hero appears
    setTimeout(() => {
        logo.classList.add('revealed');
    }, 2500);

    // Step 6 (2900ms): Heading words reveal one by one
    words.forEach((word, i) => {
        setTimeout(() => {
            word.classList.add('revealed');
        }, 2900 + i * 100);
    });

    // Step 7: Subtitle fades in
    const subtitleDelay = 2900 + words.length * 100 + 150;
    setTimeout(() => {
        subtitle.classList.add('revealed');
    }, subtitleDelay);

    // Step 8: Perks list items stagger in
    const perksItems = document.querySelectorAll('#perks-list li');
    perksItems.forEach((item, i) => {
        setTimeout(() => {
            item.classList.add('revealed');
        }, subtitleDelay + 300 + i * 150);
    });

    // Step 9: Form slides up
    const formDelay = subtitleDelay + 300 + perksItems.length * 150 + 200;
    setTimeout(() => {
        formWrapper.classList.add('revealed');
    }, formDelay);

    // Step 9: Remove curtain from DOM after transition
    setTimeout(() => {
        curtain.classList.add('done');
    }, 3400);

    // ── Populate States ──
    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    states.forEach(state => {
        const label = document.createElement('label');
        label.className = 'state-checkbox';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'states';
        input.value = state;

        const span = document.createElement('span');
        span.className = 'state-label';
        span.innerText = state;

        label.appendChild(input);
        label.appendChild(span);
        statesGrid.appendChild(label);
    });

    // ── GoHighLevel CRM Integration ──
    // TODO: Add your GHL API key and location ID
    const GHL_CONFIG = {
        apiKey: 'pit-d8263a39-76f9-477d-a52f-7211c0f137fc',
        locationId: 'EjqCKc9ZKLZjkiEEF93c',
        enabled: true
    };

    async function submitToCRM(data) {
        if (!GHL_CONFIG.enabled) {
            console.log('[GHL] Not configured yet — form data:', data);
            return;
        }

        try {
            const response = await fetch('https://rest.gohighlevel.com/v1/contacts/upsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GHL_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    companyName: data.company,
                    locationId: GHL_CONFIG.locationId,
                    tags: ['waitlist'],
                    customField: {
                        active_states: data.states.join(', ')
                    }
                })
            });

            if (!response.ok) throw new Error(`GHL responded ${response.status}`);
            console.log('[GHL] Contact upserted successfully');
        } catch (err) {
            console.error('[GHL] Submission failed:', err);
        }
    }

    // ── Form Submission ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const selectedStates = formData.getAll('states');

        const contactData = {
            company: formData.get('company'),
            firstName: formData.get('first-name'),
            lastName: formData.get('last-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            states: selectedStates
        };

        console.log('Waitlist Entry:', contactData);

        // Send to CRM
        await submitToCRM(contactData);

        // Redirect to success page
        window.location.href = 'success.html';
    });

    // ── Mouse glow on form ──
    formContainer.addEventListener('mousemove', (e) => {
        const rect = formContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        formContainer.style.backgroundImage = `
            radial-gradient(
                800px circle at ${x}px ${y}px,
                rgba(244, 186, 62, 0.03),
                transparent 40%
            )
        `;
    });

    formContainer.addEventListener('mouseleave', () => {
        formContainer.style.backgroundImage = 'none';
    });
});
