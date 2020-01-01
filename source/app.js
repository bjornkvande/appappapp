window.onload = startApp;

let state = {
  down: false
};

const backgroundImage = background();

function startApp() {
  const debouncer = new Debouncer();
  const down = e => react(e, { ...state, down: true }, debouncer);
  const up = e => react(e, { ...state, down: false }, debouncer);

  document.body.addEventListener('touchstart', down);
  document.body.addEventListener('touchend', up);
  document.body.addEventListener('mousedown', down);
  document.body.addEventListener('mouseup', up);

  render(state);
}

function react(e, state, debouncer) {
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
		</div>
	`;
}

async function playSound() {
  try {
    const random = Math.ceil(Math.random() * 12);
    const sound = new Audio(`sounds/app${random}.m4a`);
    sound.onended = () => {
      state = render({ ...state, down: false, playing: false });
    };
    await sound.play();
    const { duration } = sound;
    state = render({ ...state, down: true, playing: true, duration });
  } catch (error) {
    console.log(error);
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

const DEFAULT_PAUSE_MS = 200;

function background() {
  const which = Math.ceil(Math.random() * 10);
  const img = `app${which}.jpg`;
  const src =
    'https://res.cloudinary.com/trailguide-as/image/upload/dpr_auto,w_auto/appappapp/' +
    img;
  return `background-image: url('${src}');`;
}
