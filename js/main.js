document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS ---
    const themeBtn   = document.getElementById('theme-toggle');
    const mobileBtn  = document.getElementById('mobile-menu-btn');
    const navLinks   = document.querySelector('.nav-links');   // FIX: usaba getElementById pero el <ul> no tiene id, solo class
    const body       = document.body;

    const themeIcon  = themeBtn  ? themeBtn.querySelector('i')  : null;
    const mobileIcon = mobileBtn ? mobileBtn.querySelector('i') : null;

    // --- MODO OSCURO / CLARO ---
    if (themeBtn) {

        // Aplicar preferencia guardada al cargar
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            if (themeIcon) themeIcon.classList.replace('ph-sun', 'ph-moon');
        }

        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');

            if (themeIcon) {
                themeIcon.classList.toggle('ph-sun', !isLight);
                themeIcon.classList.toggle('ph-moon', isLight);
            }

            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

    } else {
        console.error("No se encontró el botón con id 'theme-toggle'");
    }

    // --- MENÚ MÓVIL ---
    if (mobileBtn && navLinks) {

        const toggleMenu = (forceClose = false) => {
            const isOpen = forceClose ? false : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isOpen);
            if (mobileIcon) {
                mobileIcon.classList.toggle('ph-list', !isOpen);
                mobileIcon.classList.toggle('ph-x', isOpen);
            }
        };

        mobileBtn.addEventListener('click', () => toggleMenu());

        // Cerrar al hacer click en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        // Cerrar al hacer click fuera del menú
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                toggleMenu(true);
            }
        });

    } else {
        console.error("No se encontró el botón de menú o la lista de navegación");
    }

    // --- FORMULARIO DE CONTACTO (FORMSPREE) ---
    const contactForm  = document.getElementById('contact-form');
    const formStatus   = document.getElementById('form-status');

    if (contactForm && formStatus) {

        const setStatus = (message, isSuccess) => {
            formStatus.textContent    = message;
            formStatus.style.display  = 'block';
            formStatus.style.color    = isSuccess ? 'var(--accent)' : 'red';  // 
            return isSuccess;
        };

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled     = true;
            submitButton.textContent  = 'Enviando...';

            let success = false;

            try {
                const response = await fetch(event.target.action, {
                    method:  contactForm.method,
                    body:    new FormData(event.target),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    success = true;
                    setStatus('¡Gracias! Tu mensaje ha sido enviado.', true);
                    contactForm.reset();
                } else {
                    const json = await response.json();
                    const msg  = json.errors
                        ? json.errors.map(e => e.message).join(', ')
                        : 'Hubo un problema al enviar el mensaje.';
                    setStatus(msg, false);
                }

            } catch {
                setStatus('Error de conexión. Inténtalo de nuevo.', false);

            } finally {
                submitButton.disabled    = false;
                submitButton.textContent = 'Enviar mensaje';

                // Ocultar el mensaje de éxito después de 5 segundos
                if (success) {
                    setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
                }
            }
        });
    }

});