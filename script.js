// NAV
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

// REVEAL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// CARROSSEL — spotlight central
(function () {
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    const slides = Array.from(track.querySelectorAll('.slide'));
    let current = 0;

    // ── Dots ──
    function buildDots() {
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'dot' + (i === current ? ' active' : '');
            d.setAttribute('aria-label', 'Foto ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        });
    }
    function updateDots() {
        dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // ── Posicionar ──
    function goTo(idx) {
        current = ((idx % slides.length) + slides.length) % slides.length;
        // destaque visual
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        // calcula deslocamento para centralizar o card ativo
        const vp = track.parentElement;          // .carousel-viewport
        const vpW = vp.offsetWidth;
        const slideW = slides[0].offsetWidth;
        const gap = 22; // px — mesmo valor do gap no CSS (1.4rem ≈ 22px)
        const offset = current * (slideW + gap) - (vpW - slideW) / 2;
        track.style.transform = `translateX(${-Math.max(0, offset)}px)`;
        updateDots();
    }

    document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

    // ── Touch / Drag ──
    let startX = 0, startTranslate = 0, isDragging = false, moved = false;

    function getTranslate() {
        const st = window.getComputedStyle(track);
        const mx = new DOMMatrix(st.transform);
        return mx.m41;
    }

    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startTranslate = getTranslate();
        isDragging = true; moved = false;
    }, { passive: true });

    track.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        track.style.transition = 'none';
        track.style.transform = `translateX(${startTranslate + dx}px)`;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = '';
        if (moved) {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
            else goTo(current);
        }
    });

    // drag com mouse
    track.addEventListener('mousedown', e => {
        startX = e.clientX; startTranslate = getTranslate();
        isDragging = true; moved = false;
        track.classList.add('dragging');
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        track.style.transition = 'none';
        track.style.transform = `translateX(${startTranslate + dx}px)`;
    });
    window.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');
        track.style.transition = '';
        if (moved) {
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
            else goTo(current);
        }
    });

    buildDots();
    // pequeno delay para o layout estar pronto
    requestAnimationFrame(() => { requestAnimationFrame(() => goTo(0)); });
    window.addEventListener('resize', () => goTo(current));
})();

// MASK TELEFONE
document.getElementById('telefone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    this.value = v;
});

// WHATSAPP
function enviarWhatsApp() {
    const whatsapp = "5511977719678"

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const instrumento = document.getElementById('instrumento').value;
    if (!nome) { alert('Por favor, informe seu nome.'); return; }
    if (!telefone) { alert('Por favor, informe seu telefone.'); return; }
    if (!instrumento) { alert('Por favor, selecione o instrumento.'); return; }
    const msg = encodeURIComponent(
        `Olá! Tenho interesse em aulas de música na Musics Andrade! 🎵\n\n` +
        `*Nome:* ${nome}\n*Telefone:* ${telefone}\n*Instrumento:* ${instrumento}\n\n` +
        `Gostaria de saber mais sobre as aulas e valores. 😊`
    );
    
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
}
