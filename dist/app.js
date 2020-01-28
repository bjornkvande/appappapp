window.onload = startApp;

let state = {
  down: false
};

let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  deferredPrompt = e;
  e.preventDefault();
});

let installed = false;
window.addEventListener('appinstalled', () => {
  installed = true;
  render(state);
});

const backgroundImage = background();

function startApp() {
  const debouncer = new Debouncer();
  const down = e => update(e, { ...state, down: true }, debouncer);
  const up = e => update(e, { ...state, down: false }, debouncer);

  document.body.addEventListener('touchstart', down);
  document.body.addEventListener('touchend', up);
  document.body.addEventListener('mousedown', down);
  document.body.addEventListener('mouseup', up);

  document.addEventListener('touchend', installOrShare);

  render(state);
}

function update(e, state, debouncer) {
  state = { ...state };
  const { element } = e.target.dataset;
  if (element === 'button') {
    render(state);
    state.down && debouncer.emit(playSound);
  }
}

function render(state) {
  document.querySelector('#app').innerHTML = html(state);
  return state;
}

function html(state) {
  const pressed = `${state.down ? 'app-pressed' : 'app-unpressed'}`;
  const playing = playAnimation(state);
  return `
		<div class="app" style="${backgroundImage}">
      <div class="button-container ${pressed}" style="${playing}">
		    <button data-element="button" class="app-button">APP</button>
      </div>
      ${installButton()}
      ${canShare()}
		</div>
	`;
}

function installButton() {
  if (deferredPrompt != null) {
    const label = installed ? 'Installed' : 'Install';
    return `<button data-element="install" class="install">${label}</button>`;
  } else {
    return '';
  }
}

function canShare() {
  if (navigator.share) {
    return `
      <div data-element="share" class="icon share" data-element="share">
        <svg data-element="share" class="align-middle" viewBox="0 0 24 24">
          <path data-element="share" d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
        </svg>
      </div>
    `;
  } else {
    return '';
  }
}

async function playSound() {
  try {
    const random = Math.ceil(Math.random() * 5);
    const sound = new Audio(`sounds/app${random}.mp3`);
    sound.onended = () => {
      state = render({ ...state, down: false, playing: false });
    };
    await sound.play();
    const { duration } = sound;
    state = render({ ...state, down: true, playing: true, duration });
  } catch (error) {
    console.error(error);
  }
}

function playAnimation(state) {
  if (state.playing) {
    return `
      transition: background-color ${state.duration}s;
      background-color: rgba(255,255,0,0.5);
    `.trim();
  } else {
    return 'background-color: rgba(0,0,0,0.05);';
  }
}

function installOrShare(e) {
  if (e.target.dataset.element === 'share') {
    navigator.share({
      url: 'https://appappapp.no',
      text: 'Appen som sier app app app',
      title: 'App! App! App!'
    });
  } else if (e.target.dataset.element === 'install') {
    if (deferredPrompt && !installed) {
      deferredPrompt.prompt();
    }
  }
}

class Debouncer {
  constructor(delay = DEFAULT_PAUSE_MS) {
    this.delay = delay;
  }

  emit(callback) {
    if (!this.timeoutId) {
      callback();
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
      }, this.delay);
    }
  }

  cancel() {
    this.timeoutId && clearTimeout(this.timeoutId);
  }
}

const DEFAULT_PAUSE_MS = 50;

function background() {
  const which = Math.ceil(Math.random() * 10);
  const img = `app${which}.jpg`;
  const src =
    'https://res.cloudinary.com/trailguide-as/image/upload/dpr_auto,w_auto/appappapp/' +
    img;
  return `background-image: url('${src}');`;
}
