// Verified event data and optional settings live here.
const CONVITE_ART = 'assets/convite-ana-luisa.png';
const evento = Object.freeze({
  tema: 'Reino Encantado',
  nome: 'Ana Luisa Kolesny',
  idade: 15,
  data: '2026-11-14',
  horario: '19:00',
  timezone: 'America/Sao_Paulo',
  dataHoraIso: '2026-11-14T19:00:00-03:00',
  confirmacao: {
    prazo: '2026-11-08',
    fimDoPrazoIso: '2026-11-09T00:00:00-03:00',
    telefone: '5551998443637'
  },
  local: {
    nome: null,
    endereco: 'R. Dona Cecília, 400 - Vila City, Cachoeirinha - RS, 94935-130'
  },
  musica: null
});

const $ = (selector) => document.querySelector(selector);
const cover = $('#cover');
const scene = $('#cover-scene');
const realm = $('#realm');
const entranceFilm = $('#entrance-film');
const entranceVideo = $('#entrance-video');
const views = [...document.querySelectorAll('.view')];
const validViews = new Set(views.map((view) => view.id));
let transitionLocked = false;
let filmFinishing = false;

function alignEnterButton() {
  const image = $('.cover-art');
  if (!image.naturalWidth || !image.naturalHeight) return;
  const { width, height } = scene.getBoundingClientRect();
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const offsetX = (width - image.naturalWidth * scale) / 2;
  const offsetY = (height - image.naturalHeight * scale) * .52;
  const button = $('#enter-button');
  button.style.left = `${offsetX + 212 * scale}px`;
  button.style.top = `${offsetY + 1405 * scale}px`;
  button.style.width = `${520 * scale}px`;
  button.style.height = `${142 * scale}px`;
  button.style.backgroundSize = `${image.naturalWidth * scale}px ${image.naturalHeight * scale}px`;
  button.style.backgroundPosition = `${-212 * scale}px ${-1405 * scale}px`;
  button.style.fontSize = `${Math.max(13, 31 * scale)}px`;
}

function syncSoundButton() {
  const playing = !$('#ambient-audio').paused;
  $('#sound-toggle').setAttribute('aria-pressed', String(playing));
  $('#sound-toggle').setAttribute('aria-label', playing ? 'Pausar música ambiente' : 'Ativar música ambiente');
  $('#sound-toggle').textContent = playing ? '♫' : '♪';
}

function configureEvent() {
  $('#invitation-image').src = CONVITE_ART;
  if (evento.nome) {
    $('#realm-name').textContent = evento.nome;
    $('#realm-name').hidden = false;
    document.title = `${evento.nome} · 15 Anos`;
  }

  const message = `Olá! Gostaria de confirmar minha presença nos 15 anos de ${evento.nome}, dia 14/11/2026.`;
  const whatsappUrl = `https://wa.me/${evento.confirmacao.telefone}?text=${encodeURIComponent(message)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evento.local.endereco)}`;
  $('#whatsapp-link').href = whatsappUrl;
  $('#main-whatsapp-link').href = whatsappUrl;
  $('#maps-link').href = mapsUrl;
  $('#main-maps-link').href = mapsUrl;
  if (evento.musica) {
    $('#ambient-audio').src = evento.musica;
    $('#sound-toggle').hidden = false;
    $('#sound-toggle').addEventListener('click', async () => {
      if ($('#ambient-audio').paused) {
        try { await $('#ambient-audio').play(); } catch { /* Browser may block playback. */ }
      } else {
        $('#ambient-audio').pause();
      }
      syncSoundButton();
    });
  }
}

function updateCountdown() {
  const difference = Math.max(0, Date.parse(evento.dataHoraIso) - Date.now());
  const units = {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
  for (const [key, value] of Object.entries(units)) {
    const element = $(`#${key}`);
    const text = String(value).padStart(2, '0');
    element.textContent = text;
    element.setAttribute('aria-label', `${{days:'Dias',hours:'Horas',minutes:'Minutos',seconds:'Segundos'}[key]}: ${text}`);
  }
  $('#days').classList.toggle('three-digits', units.days > 99);
}

function updateRsvp() {
  const expired = Date.now() >= Date.parse(evento.confirmacao.fimDoPrazoIso);
  $('#rsvp-copy').textContent = expired
    ? 'O prazo informado para confirmação foi 08 de novembro de 2026.'
    : 'Confirme sua presença até 08 de novembro de 2026.';
}

function showView(id, { updateUrl = true } = {}) {
  const nextId = validViews.has(id) ? id : 'invitation';
  cover.hidden = true;
  realm.hidden = false;
  realm.classList.toggle('showing-art', ['invitation', 'dress-code', 'presentes'].includes(nextId));
  views.forEach((view) => { view.hidden = view.id !== nextId; });
  updateRsvp();
  if (updateUrl) history.pushState({ view: nextId }, '', `#${nextId}`);
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (nextId !== 'invitation') {
    ($(`#${nextId} .section-title`) || (['dress-code', 'presentes'].includes(nextId) ? $(`#${nextId}`) : null))
      ?.focus({ preventScroll: true });
  }
}

function finishEntranceFilm() {
  if (!transitionLocked || filmFinishing) return;
  filmFinishing = true;
  entranceVideo.pause();
  showView('invitation');
  entranceFilm.classList.add('is-finishing');
  const fadeMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 900;
  window.setTimeout(() => {
    entranceFilm.hidden = true;
    entranceFilm.classList.remove('is-finishing');
    $('#film-loading').hidden = false;
    $('#enter-button').disabled = false;
    transitionLocked = false;
    filmFinishing = false;
  }, fadeMs);
}

function enterCastle() {
  if (transitionLocked) return;
  transitionLocked = true;
  $('#enter-button').disabled = true;
  $('#film-loading').hidden = false;
  entranceFilm.hidden = false;
  entranceVideo.muted = false;
  entranceVideo.currentTime = 0;
  const playback = entranceVideo.play();
  if (playback) playback.catch(async () => {
    entranceVideo.muted = true;
    try { await entranceVideo.play(); }
    catch { finishEntranceFilm(); }
  });
}

function returnToCastle() {
  if (evento.musica) { $('#ambient-audio').pause(); syncSoundButton(); }
  entranceVideo.pause();
  entranceFilm.hidden = true;
  realm.hidden = true;
  cover.hidden = false;
  scene.classList.remove('entering');
  $('#enter-button').disabled = false;
  history.pushState({ view: 'cover' }, '', location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function syncFromUrl() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (validViews.has(id)) showView(id, { updateUrl: false });
  else returnToCastleWithoutHistory();
}

function returnToCastleWithoutHistory() {
  entranceVideo.pause();
  entranceFilm.hidden = true;
  realm.hidden = true;
  cover.hidden = false;
  scene.classList.remove('entering');
  $('#enter-button').disabled = false;
}

configureEvent();
$('.cover-art').addEventListener('load', alignEnterButton);
window.addEventListener('resize', alignEnterButton);
alignEnterButton();
updateCountdown();
updateRsvp();
window.setInterval(updateCountdown, 1000);
window.setInterval(updateRsvp, 60000);
$('#enter-button').addEventListener('click', enterCastle);
$('#film-skip').addEventListener('click', finishEntranceFilm);
entranceVideo.addEventListener('playing', () => { $('#film-loading').hidden = true; });
entranceVideo.addEventListener('waiting', () => { $('#film-loading').hidden = false; });
entranceVideo.addEventListener('ended', finishEntranceFilm);
entranceVideo.addEventListener('error', finishEntranceFilm);
document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});
document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => showView('invitation'));
});
window.addEventListener('popstate', syncFromUrl);
window.addEventListener('hashchange', syncFromUrl);
if (validViews.has(location.hash.slice(1))) syncFromUrl();

