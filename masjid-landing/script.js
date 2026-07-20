(function () {
    const header = document.getElementById('header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const year = document.getElementById('year');

    if (year) year.textContent = new Date().getFullYear();

    const onScroll = () => {
        if (window.scrollY > 8) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        nav.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (form && status) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();
            if (!name || !email || !message) {
                status.textContent = 'Please fill in your name, email, and a short message.';
                status.style.color = '#a13a2a';
                return;
            }
            status.textContent = 'Shukran — your message has been received. We will respond within two working days, InshaAllah.';
            status.style.color = '';
            form.reset();
        });
    }
})();
