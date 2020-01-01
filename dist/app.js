window.onload = startApp;

const state = {
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
    state.down && debouncer.emit(play);
  }
}

function render(state) {
  const app = document.querySelector('#app');
  app.innerHTML = html(state);
}

function html(state) {
  const button = `app-button ${state.down ? 'app-pressed' : 'app-unpressed'}`;
  return `
		<div class="app" style="${backgroundImage}">
      <div class="button-container">
		    <button data-element="button" class="${button}">APP</button>
      </div>
		</div>
	`;
}

function play() {
  try {
    const random = Math.ceil(Math.random() * 12);
    new Audio(`sounds/app${random}.m4a`).play();
  } catch (error) {
    console.log(error);
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
