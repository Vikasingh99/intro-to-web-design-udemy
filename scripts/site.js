document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('[data-counter]');
    const revealItems = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            const target = Number(element.dataset.counter);
            const suffix = element.dataset.suffix || '';
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 45));
            const timer = window.setInterval(() => {
                current = Math.min(current + step, target);
                element.textContent = `${current.toLocaleString()}${suffix}`;
                if (current === target) window.clearInterval(timer);
            }, 28);
            observer.unobserve(element);
        });
    }, { threshold: 0.7 });

    counters.forEach((counter) => counterObserver.observe(counter));

    document.querySelectorAll('[data-filter-group]').forEach((group) => {
        const search = group.querySelector('[data-search]');
        const buttons = group.querySelectorAll('[data-filter]');
        const cards = group.querySelectorAll('[data-category]');
        let activeFilter = 'all';

        const update = () => {
            const query = (search?.value || '').trim().toLowerCase();
            cards.forEach((card) => {
                const matchesFilter = activeFilter === 'all' || card.dataset.category.includes(activeFilter);
                const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
                card.closest('[data-filter-item]').hidden = !(matchesFilter && matchesSearch);
            });
        };

        buttons.forEach((button) => button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            buttons.forEach((item) => item.classList.toggle('active', item === button));
            update();
        }));
        search?.addEventListener('input', update);
    });

    const profile = document.querySelector('[data-species-profile]');
    document.querySelectorAll('[data-species]').forEach((button) => button.addEventListener('click', () => {
        if (!profile) return;
        const data = button.dataset;
        profile.querySelector('[data-profile-image]').src = data.image;
        profile.querySelector('[data-profile-image]').alt = data.name;
        profile.querySelector('[data-profile-name]').textContent = data.name;
        profile.querySelector('[data-profile-scientific]').textContent = data.scientific;
        profile.querySelector('[data-profile-status]').textContent = data.status;
        profile.querySelector('[data-profile-habitat]').textContent = data.habitat;
        profile.querySelector('[data-profile-copy]').textContent = data.copy;
        profile.hidden = false;
        profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    document.querySelectorAll('[data-lightbox-image]').forEach((image) => image.addEventListener('click', () => {
        const lightbox = document.querySelector('[data-lightbox]');
        if (!lightbox) return;
        lightbox.querySelector('img').src = image.src;
        lightbox.querySelector('[data-lightbox-caption]').textContent = image.dataset.caption || image.alt;
        lightbox.hidden = false;
    }));
    document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
        document.querySelector('[data-lightbox]').hidden = true;
    });

    document.querySelectorAll('[data-demo-form]').forEach((form) => form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        form.hidden = true;
        form.nextElementSibling.hidden = false;
    }));

    document.querySelectorAll('[data-donation-amount]').forEach((button) => button.addEventListener('click', () => {
        document.querySelectorAll('[data-donation-amount]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const custom = document.querySelector('[data-custom-amount]');
        if (custom) custom.value = button.dataset.donationAmount;
    }));
});
