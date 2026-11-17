((MafiaShop) => {
const { $ } = MafiaShop;

function initializeAnimations(closeAll) {
    const introScene = $('#intro-scene');
    const introCanvas = $('#intro-canvas');
    const cx = introCanvas.getContext('2d');
    const introMessage = $('#intro-message');
    const introFinalMessage = $('#intro-final-message');
    const introPlayingCards = $('#intro-playing-cards');
    const introFlashOverlay = $('#intro-flash-overlay');

    let timers = [];
    let raf = 0;
    let run = false;
    let particles = [];

    const schedule = (callback, delay) => {
        timers.push(setTimeout(callback, delay));
    };

    let letterDelay = 0;

    $('#intro-message-title').innerHTML = 'ЛАСКАВО ПРОСИМО ДО МАФІЇ'
        .split(' ')
        .map(word => `
            <b class="intro-word">
                ${[...word].map(char => `
                    <span style="animation-delay:${letterDelay++ * 70}ms">${char}</span>
                `).join('')}
            </b>
        `).join(' ');

    function initializeIntroCanvas() {
        introCanvas.width = innerWidth / 2 | 0;
        introCanvas.height = innerHeight / 2 | 0;

        particles = Array.from(
            { length: innerWidth < 760 ? 12 : 26 },
            () => ({
                x: Math.random() * introCanvas.width,
                y: Math.random() * introCanvas.height,
                r: 70 + Math.random() * 120,
                vx: (Math.random() - .5) * .4,
                vy: -.15 - Math.random() * .25,
                a: .3 + Math.random() * .3,
                red: Math.random() < .3,
                ph: Math.random() * 6
            })
        );
    }

    function renderIntroFrame() {
        cx.clearRect(0, 0, introCanvas.width, introCanvas.height);

        const time = performance.now() / 1500;

        particles.forEach(particle => {
            particle.x += particle.vx + Math.sin(time + particle.ph) * .2;
            particle.y += particle.vy;

            if (particle.y < -particle.r) {
                particle.y = introCanvas.height + particle.r;
            }

            if (particle.x < -particle.r) {
                particle.x = introCanvas.width + particle.r;
            }

            if (particle.x > introCanvas.width + particle.r) {
                particle.x = -particle.r;
            }

            const color = particle.red ? '130,14,28' : '48,40,43';
            const gradient = cx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.r
            );

            gradient.addColorStop(
                0,
                `rgba(${color},${particle.a * (particle.red ? .5 : 1)})`
            );
            gradient.addColorStop(1, `rgba(${color},0)`);

            cx.fillStyle = gradient;
            cx.fillRect(
                particle.x - particle.r,
                particle.y - particle.r,
                particle.r * 2,
                particle.r * 2
            );
        });

        if (run) {
            raf = requestAnimationFrame(renderIntroFrame);
        }
    }

    function playIntroFlash() {
        [
            [0, 'r'],
            [110, 0],
            [190, 'w'],
            [270, 0],
            [400, 'r'],
            [500, 0],
            [620, 'w'],
            [1000, 0]
        ].forEach(([time, type]) => {
            schedule(() => {
                introFlashOverlay.style.background = type === 'r'
                    ? '#5c0012'
                    : 'repeating-linear-gradient(0deg,#cfc8c8 0 3px,#8f8a8a 3px 5px)';

                introFlashOverlay.style.opacity = type
                    ? (type === 'r' ? .6 : .42)
                    : 0;
            }, time);
        });
    }

    function finishIntro() {
        timers.forEach(clearTimeout);
        timers = [];

        introFinalMessage.classList.remove('is-visible');
        introMessage.classList.remove('is-visible');
        introFlashOverlay.style.opacity = 0;

        introScene.classList.add('is-hidden');
        document.body.classList.remove('intro-transition-active');

        schedule(() => {
            introScene.style.display = 'none';
            run = false;
            cancelAnimationFrame(raf);
        }, 1500);
    }

    function startIntro() {
        timers.forEach(clearTimeout);
        timers = [];

        cancelAnimationFrame(raf);
        document.body.classList.add('intro-transition-active');
        closeAll();

        introScene.style.display = 'grid';
        introScene.classList.remove('is-hidden');
        introMessage.classList.remove('is-visible');
        introFinalMessage.classList.remove('is-visible');
        introCanvas.classList.remove('is-visible');

        const emojis = ['🕵️‍♂️', '🤵‍♂️', '💀', '🔪', '👩🏽', '🎭', '🃏', '😈', '💘'];
        const width = innerWidth;
        const height = innerHeight;

        introPlayingCards.innerHTML = emojis.map((emoji, index) => `
            <div
                class="intro-playing-card"
                style="
                    --j:${(index - 4) * 3}deg;
                    --x:${((Math.random() - .5) * width * .7) | 0}px;
                    --y:${((Math.random() - .5) * height * .6) | 0}px;
                    --r:${((Math.random() - .5) * 80) | 0}deg;
                    transition-delay:${index * 70}ms
                "
            >${emoji}</div>
        `).join('');

        run = true;
        initializeIntroCanvas();
        raf = requestAnimationFrame(renderIntroFrame);

        schedule(() => introMessage.classList.add('is-visible'), 500);

        schedule(() => {
            introMessage.classList.remove('is-visible');
            introCanvas.classList.add('is-visible');
        }, 2700);

        schedule(() => {
            introPlayingCards.querySelectorAll('.intro-playing-card')
                .forEach(card => card.classList.add('is-visible'));
        }, 3300);

        schedule(() => {
            introPlayingCards.querySelectorAll('.intro-playing-card')
                .forEach(card => card.classList.add('is-flying'));
        }, 3900);

        schedule(playIntroFlash, 5300);
        schedule(() => introFinalMessage.classList.add('is-visible'), 6300);
        schedule(finishIntro, 8300);
    }

    const secondaryIntroScene = $('#secondary-intro-scene');
    const featuredCard = $('#intro-featured-card');
    const dealingCards = $('#intro-dealing-cards');
    const introRingEffect = $('#intro-ring-effect');
    const introTitle = $('#intro-title');

    let curB = true;

    function finishSecondaryIntro() {
        timers.forEach(clearTimeout);
        timers = [];

        secondaryIntroScene.classList.add('is-fading', 'is-open');
        document.body.classList.remove('intro-transition-active');

        schedule(() => {
            secondaryIntroScene.style.display = 'none';
        }, 1700);
    }

    function startSecondaryIntro() {
        timers.forEach(clearTimeout);
        timers = [];

        cancelAnimationFrame(raf);
        run = false;
        introScene.style.display = 'none';
        document.body.classList.add('intro-transition-active');
        closeAll();

        secondaryIntroScene.style.display = 'block';
        secondaryIntroScene.className = '';
        featuredCard.className = 'intro-featured-card';
        introTitle.className = 'intro-title';
        introRingEffect.className = 'intro-ring-effect';

        const width = innerWidth;
        const height = innerHeight;
        const cardCount = 14;
        const radiusX = width * .4;
        const radiusY = height * .36;

        dealingCards.innerHTML = Array.from({ length: cardCount }, (_, index) => {
            const angle = index / cardCount * Math.PI * 2 - Math.PI / 2;

            return `
                <div
                    class="intro-dealing-card"
                    style="
                        --x:${(Math.cos(angle) * radiusX) | 0}px;
                        --y:${(Math.sin(angle) * radiusY) | 0}px;
                        --r:${(Math.random() * 40 - 20 + angle * 57.3 + 90) | 0}deg;
                        transition-delay:${index * 90}ms
                    "
                >♠</div>
            `;
        }).join('');

        schedule(() => secondaryIntroScene.classList.add('is-lit'), 300);
        schedule(() => featuredCard.classList.add('is-visible'), 1000);

        schedule(() => {
            featuredCard.classList.add('is-hidden');

            dealingCards.querySelectorAll('.intro-dealing-card')
                .forEach(card => card.classList.add('is-dealt'));
        }, 2900);

        schedule(() => {
            introTitle.classList.add('is-visible');
            introRingEffect.classList.add('is-active');
            secondaryIntroScene.classList.add('is-shaking');

            dealingCards.querySelectorAll('.intro-dealing-card')
                .forEach(card => card.classList.add('is-highlighted'));
        }, 4900);

        schedule(() => {
            secondaryIntroScene.classList.remove('is-shaking');
        }, 5400);

        schedule(finishSecondaryIntro, 7300);
    }

    $('#skip-intro').onclick = finishIntro;
    $('#skip-secondary-intro').onclick = finishSecondaryIntro;

    $('.logo').onclick = () => {
        timers.forEach(clearTimeout);
        timers = [];

        introScene.style.display = 'none';
        secondaryIntroScene.style.display = 'none';
        run = false;
        cancelAnimationFrame(raf);
        curB = !curB;

        if (curB) {
            startSecondaryIntro();
        } else {
            startIntro();
        }
    };

    $('.logo').title = 'Повторити вступ';

    addEventListener('resize', () => {
        if (run) {
            initializeIntroCanvas();
        }
    });

    let seen2 = false;

    try {
        seen2 = sessionStorage.getItem('mi2') === '1';
    } catch (e) {
    }

    introScene.style.display = 'none';

    if (!(matchMedia('(prefers-reduced-motion: reduce)').matches || seen2)) {
        try {
            sessionStorage.setItem('mi2', '1');
        } catch (e) {
        }

        curB = true;
        startSecondaryIntro();
    }
}

MafiaShop.initializeAnimations = initializeAnimations;
})(window.MafiaShop = window.MafiaShop || {});