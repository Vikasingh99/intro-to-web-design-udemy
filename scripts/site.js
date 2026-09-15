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

    const storyPage = document.querySelector('[data-story-title]');
    if (storyPage) {
        const stories = {
            forests: {
                title: 'Protecting the forests of Central America', meta: 'Conservation · 12 June 2025', intro: 'Forest corridors make room for wildlife and the communities who live alongside it.',
                image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80',
                body: 'A forest is more than a collection of trees. It is a living route for animals, a source of clean water, and a place where communities build their future. Our demonstration corridor project brings those needs into the same conversation.',
                bodyTwo: 'The work begins with listening: mapping movement, understanding pressure points, and supporting local decisions that keep habitat connected. Protection becomes stronger when it belongs to the people who know the landscape best.', note: 'Central America · Habitat corridor demonstration'
            },
            rescue: {
                title: 'Every rescue is a second chance', meta: 'Rescue · 28 May 2025', intro: 'A careful response, a quiet recovery, and a safe return to the canopy.',
                image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=80',
                body: 'Wildlife rescue is a chain of small, careful decisions. Teams assess the animal, reduce stress, coordinate care, and make sure the return site is ready before the final release.',
                bodyTwo: 'The visible moment is the return. The real work includes training, transport, habitat checks, and the patient observation that follows. Every step gives an animal a better chance to recover.', note: 'Rescue and recovery · Demonstration field note'
            },
            habitat: {
                title: 'When a habitat comes back to life', meta: 'Research · 04 April 2025', intro: 'Monitoring gives restoration teams the evidence to keep improving.',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
                body: 'Restoration is not a single event. Teams return to the same places, record what is changing, and use those observations to make the next season of work more useful.',
                bodyTwo: 'Bird calls, seedlings, tracks, and water quality can all tell a story. Research turns those signals into decisions that help a restored habitat become self-sustaining.', note: 'Research and restoration · Demonstration monitoring note'
            },
            community: {
                title: 'Inside our wildlife rescue program', meta: 'Community · 19 February 2025', intro: 'Conservation grows stronger when local knowledge leads the way.',
                image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=1400&q=80',
                body: 'The best conservation programs are built with people, not simply delivered to them. Schools, volunteers, rangers, and local organizations each bring knowledge that makes the work more practical.',
                bodyTwo: 'Together, communities can identify risks earlier, share responsible wildlife guidance, and create a culture where asking for help is part of protecting animals.', note: 'Community conservation · Demonstration partner story'
            }
        };
        const story = stories[new URLSearchParams(window.location.search).get('story')] || stories.forests;
        document.querySelector('[data-story-image]').src = story.image;
        document.querySelector('[data-story-image]').alt = story.title;
        document.querySelector('[data-story-meta]').textContent = story.meta;
        storyPage.textContent = story.title;
        document.querySelector('[data-story-intro]').textContent = story.intro;
        document.querySelector('[data-story-body]').textContent = story.body;
        document.querySelector('[data-story-body-two]').textContent = story.bodyTwo;
        document.querySelector('[data-story-note]').textContent = story.note;
        document.title = `${story.title} | APC Americas`;
    }
});
