window.onload = startApp;

const state = {
  down: false
};

function startApp() {
  const down = e => react(e, { ...state, down: true });
  const up = e => react(e, { ...state, down: false });

  document.body.addEventListener('touchstart', down);
  document.body.addEventListener('touchend', down);
  document.body.addEventListener('mousedown', down);
  document.body.addEventListener('mouseup', up);

  readSounds();

  render(state);
}

function react(e, state) {
  state = { ...state };
  const { element } = e.target.dataset;
  if (element === 'button') {
    render(state);
    state.down && play();
  }
}

function render(state) {
  const app = document.querySelector('#app');
  app.innerHTML = html(state);
}

function html(state) {
  const button = `app-button ${state.down ? 'app-pressed' : 'app-unpressed'}`;
  return `
		<div class="app">
			 <button data-element="button" class="${button}">App!</button>
		</div>
	`;
}

let sounds = [];
function readSounds() {
  try {
    sounds = [1, 2, 3, 4, 5, 6].map(n => new Audio(`sounds/app${n}.mp3`));
  } catch (error) {
    console.log(error);
  }
}

function play() {
  try {
    sounds[Math.round(Math.random() * sounds.length)].play();
  } catch (error) {
    console.log(error);
  }
}
