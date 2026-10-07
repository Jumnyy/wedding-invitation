document.addEventListener('DOMContentLoaded', () => {
    initGuestParam();
    initEnvelope();
    initAudio();
    initRSVP();
    initCountdown();
    initPetals();
});

/* --- 1. GET GUEST NAME FROM URL QUERY PARAMETER --- */
function initGuestParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('name') || urlParams.get('khach') || urlParams.get('invite');
    
    if (guestName) {
        const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        const targetEl = document.getElementById('curtainGuestName');
        const nameInput = document.getElementById('rsvpName');
        
        if (targetEl) targetEl.textContent = decodedName;
        if (nameInput) nameInput.value = decodedName;
        
        document.title = `Thiệp Cưới - Kính Mời ${decodedName}`;
    }
}

/* --- 2. ENVELOPE OPENING ANIMATION --- */
function initEnvelope() {
    const overlay = document.getElementById('envelopeOverlay');
    const btnOpen = document.getElementById('btnOpenInvitation');
    const audio = document.getElementById('weddingAudio');

    if (btnOpen && overlay) {
        btnOpen.addEventListener('click', () => {
            overlay.classList.add('opened');
            if (audio) {
                audio.play().catch(e => console.log('Autoplay prevented:', e));
            }
            showToast('Cảm ơn bạn đã mở thiệp!');
        });
    }
}

/* --- 3. AUDIO PLAYER TOGGLE --- */
function initAudio() {
    const audio = document.getElementById('weddingAudio');
    const btn = document.getElementById('floatingAudioDisc');
    const discWrapper = document.getElementById('discWrapper');

    if (!audio || !btn) return;

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            if (discWrapper) discWrapper.classList.add('disc-rotating');
            showToast('Đang phát nhạc cưới');
        } else {
            audio.pause();
            if (discWrapper) discWrapper.classList.remove('disc-rotating');
            showToast('Đã tạm dừng nhạc');
        }
    });
}

/* --- 4. COUNTDOWN TIMER TO 14/11/2026 09:30 AM --- */
function initCountdown() {
    const weddingDate = new Date('2026-11-14T09:30:00').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        const timerContainer = document.getElementById('countdownTimer');

        if (diff <= 0) {
            if (timerContainer) {
                timerContainer.innerHTML = '<div class="col-span-4 text-gold-300 font-cinzel font-bold text-sm">HÔN LỄ ĐANG DIỄN RA!</div>';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const cdDays = document.getElementById('cdDays');
        const cdHours = document.getElementById('cdHours');
        const cdMins = document.getElementById('cdMins');
        const cdSecs = document.getElementById('cdSecs');

        if (cdDays) cdDays.textContent = days < 10 ? '0' + days : days;
        if (cdHours) cdHours.textContent = hours < 10 ? '0' + hours : hours;
        if (cdMins) cdMins.textContent = mins < 10 ? '0' + mins : mins;
        if (cdSecs) cdSecs.textContent = secs < 10 ? '0' + secs : secs;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* --- 5. RSVP FORM SUBMISSION --- */
function initRSVP() {
    const form = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('rsvpName');
        const guestOfEl = document.getElementById('rsvpGuestOf');
        const msgEl = document.getElementById('rsvpMessage');

        const name = nameEl ? nameEl.value.trim() : '';
        const guestOf = guestOfEl ? guestOfEl.value : '';
        const msg = msgEl ? msgEl.value.trim() : '';

        if (!name) {
            showToast('Vui lòng nhập tên quý khách!');
            return;
        }

        if (msg && wishesList) {
            const newWish = document.createElement('div');
            newWish.className = 'bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs';
            newWish.innerHTML = `<p class="font-bold text-weddingRed-900">${escapeHTML(name)} <span class="text-[10px] text-stone-400 font-normal">(${escapeHTML(guestOf)})</span></p><p class="text-stone-700 mt-1">${escapeHTML(msg)}</p>`;
            wishesList.prepend(newWish);
        }

        showToast('Gửi xác nhận thành công! ♥');
        form.reset();
    });
}

/* --- 6. PETALS FALLING CANVAS --- */
function initPetals() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const colors = ['rgba(212, 175, 55, 0.6)', 'rgba(255, 255, 255, 0.7)', 'rgba(212, 175, 55, 0.4)'];

    for (let i = 0; i < 22; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 3 + Math.random() * 5,
            d: Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < petals.length; i++) {
            const p = petals[i];
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            ctx.fill();

            p.y += 1 + Math.sin(p.d) * 0.5;
            p.x += Math.sin(p.d) * 0.5;

            if (p.y > height) {
                petals[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d, color: p.color };
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* --- TOAST HELPER FUNCTION --- */
function showToast(msg) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-heart text-gold-300"></i> <span>${escapeHTML(msg)}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}