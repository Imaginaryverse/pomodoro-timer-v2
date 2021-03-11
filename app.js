/* DEFAULT VALUES */
const DEF_FOCUS_VAL = 25;
const DEF_BREAK_VAL = 5;
const DEF_REST_VAL = 15;

/* VARIABLES */
const settings = {
  DEFAULT: 'DEFAULT',
  USER: 'USER',
};

const modes = {
  START: 'START',
  FOCUS: 'FOCUS',
  BREAK: 'BREAK',
  REST: 'REST',
};

const states = {
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
};

const userSettings = {
  focusTime: 0,
  breakTime: 0,
  restTime: 0,
};

let setting = settings.DEFAULT;
let mode = modes.START;
let state = states.START;
let timePause = 0;
let timesFocused = 0;
let soundVol = 0;

/* DOM ELEMENTS */
const nav = document.querySelector('.nav');
const hamburgerBtn = document.querySelector('.hamburger-btn');
const barTop = document.querySelector('.top');
const barMid = document.querySelector('.mid');
const barBottom = document.querySelector('.bottom');

const form = document.querySelector('.form');
const focusInput = document.querySelector('.focus-input');
const BreakInput = document.querySelector('.break-input');
const RestInput = document.querySelector('.rest-input');
const saveBtn = document.querySelector('.save-btn');

const muteBtn = document.querySelector('.mute-btn');
const templeBell = document.querySelector('.temple-bell');

const currentMode = document.querySelector('.current-mode');
const timerContainer = document.querySelector('.timer-container');
const tomatoGrid = document.querySelector('.tomato-grid');
const timer = document.querySelector('.timer');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');

const footer = document.querySelector('.footer');
const infoBtn = document.querySelector('.info-btn');
const infoContainer = document.querySelector('.info-container');

/* FUNCTIONS */
const setSetting = (m) => {
  setting = m;
};

const setBackground = (m) => {
  timerContainer.classList.remove('start', 'focus', 'break', 'rest');
  timerContainer.classList.add(`${m.toLowerCase()}`);
};

const createTomato = () => {
  if (tomatoGrid.childElementCount < timesFocused) {
    const img = document.createElement('img');
    img.className = 'tomato-img';
    img.src = 'assets/images/tomato.svg';
    img.alt = 'tomato';
    tomatoGrid.appendChild(img);
  } else {
    tomatoGrid.innerHTML = '';
  }
};

const setMode = (str) => {
  mode = str;
};

const setState = (str) => {
  state = str;
};

const setUserSettings = (f, b, r) => {
  userSettings.focusTime = parseInt(f);
  userSettings.breakTime = parseInt(b);
  userSettings.restTime = parseInt(r);

  setSetting('USER');
  timer.innerHTML = formatTime(toSeconds(userSettings.focusTime));

  console.log(userSettings);
  console.log({ setting });
};

const handleHamburgerBtn = () => {
  hamburgerBtn.classList.toggle('open');
  barTop.classList.toggle('open');
  barMid.classList.toggle('open');
  barBottom.classList.toggle('open');
  form.classList.toggle('open');

  // CHECK IF INFO IS OPEN
  infoBtn.classList.contains('open') ? handleInfoBtn() : null;
};

const handleInfoBtn = () => {
  infoBtn.classList.toggle('open');
  footer.classList.toggle('open');
  infoContainer.classList.toggle('open');

  if (infoBtn.classList.contains('open')) {
    infoBtn.innerHTML = `<i class="fas fa-times-circle"></i>`;
  } else {
    infoBtn.innerHTML = `<i class="fas fa-info-circle"></i>`;
  }
};

const handleStart = () => {
  switch (state) {
    case 'START':
      resetAll();
      setState('PAUSE');
      timer.classList.remove('paused');
      setMode('FOCUS');
      updateStartBtn(state);
      updateResetBtn(state);
      startTimer(setting === 'USER' ? userSettings.focusTime : DEF_FOCUS_VAL);
      break;
    case 'PAUSE':
      setState('RESUME');
      timer.classList.add('paused');
      updateStartBtn(state);
      updateResetBtn(state);
      break;
    case 'RESUME':
      setState('PAUSE');
      timer.classList.remove('paused');
      updateStartBtn(state);
      updateResetBtn(state);
      startTimer(timePause);
      break;
  }
};

const handleMuteBtn = () => {
  switch (soundVol) {
    case 0:
      muteBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
      soundVol = 1;
      console.log('SOUND ON');
      break;
    case 1:
      muteBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
      soundVol = 0;
      console.log('SOUND OFF');

      break;
  }

  templeBell.volume = soundVol;
};

const updateSaveBtn = (f, b, r) => {
  if (f && b && r) {
    saveBtn.disabled = false;
  }
};

const isValid = (input, min, max) => {
  return input.value >= min && input.value <= max ? true : false;
};

const updateStartBtn = (st) => {
  startBtn.innerHTML = st;
};

const updateResetBtn = (st) => {
  if (st != 'START') {
    resetBtn.disabled = false;
  } else {
    resetBtn.disabled = true;
  }
};

const updateModeText = (m) => {
  if (m != 'START') {
    currentMode.innerHTML = m;
  } else {
    currentMode.innerHTML = '';
  }
};

const toSeconds = (n) => {
  return n * 60;
};

const toMinutes = (n) => {
  return n / 60;
};

const formatTime = (t) => {
  const hrs = Math.floor(t / 60 / 60);
  const mins = Math.floor(t / 60) - hrs * 60;
  const sec = t % 60;

  /* TODO
  IF NO HRS DO NOT DISPLAY 0
  IF NO MINS DO NOT DISPLAY 0
  IF NO SEC DO NOT DISPLAY 0
  */

  return `${hrs}:${mins}:${sec}`;
};

const startTimer = (t) => {
  updateModeText(mode);
  if (mode === 'BREAK' || mode === 'REST') {
    timesFocused++;
    createTomato();
  }
  setBackground(mode);
  let time = toSeconds(t);
  let interval;

  interval = setInterval(() => {
    time--;

    if (!time) {
      templeBell.play();
      clearInterval(interval);

      switch (mode) {
        case 'FOCUS':
          if (timesFocused < 3) {
            setMode('BREAK');
            startTimer(
              setting === 'USER' ? userSettings.breakTime : DEF_BREAK_VAL
            );
            break;
          } else {
            setMode('REST');
            startTimer(
              setting === 'USER' ? userSettings.restTime : DEF_REST_VAL
            );
            break;
          }
        case 'BREAK':
          setMode('FOCUS');
          startTimer(
            setting === 'USER' ? userSettings.focusTime : DEF_FOCUS_VAL
          );
          break;
        case 'REST':
          updateModeText('WELL DONE!');
          setState('START');
          updateStartBtn(state);
          updateResetBtn(state);
      }
    }

    if (state === 'PAUSE') {
      startBtn.addEventListener('click', () => {
        clearInterval(interval);
        timePause = toMinutes(time);
      });

      resetBtn.addEventListener('click', () => {
        clearInterval(interval);
      });
    }

    timer.innerHTML = formatTime(time);
  }, 1000);
};

const resetAll = () => {
  setState('START');
  updateStartBtn(state);
  updateResetBtn(state);
  updateModeText(state);
  setMode(state);
  setBackground(state);

  timesFocused = 0;

  timer.innerHTML = formatTime(
    toSeconds(setting === 'USER' ? userSettings.focusTime : DEF_FOCUS_VAL)
  );
  tomatoGrid.innerHTML = '';
};

/* EVENT LISTENERS */
hamburgerBtn.addEventListener('click', handleHamburgerBtn);

form.addEventListener('change', () => {
  updateSaveBtn(focusInput.value, BreakInput.value, RestInput.value);
});

saveBtn.addEventListener('click', (e) => {
  if (
    isValid(focusInput, 15, 120) &&
    isValid(BreakInput, 1, 15) &&
    isValid(RestInput, 10, 30)
  ) {
    console.log('VALID');
    e.preventDefault();
    setUserSettings(focusInput.value, BreakInput.value, RestInput.value);
  } else {
    console.log('INVALID');
  }
});

startBtn.addEventListener('click', handleStart);

resetBtn.addEventListener('click', () => {
  resetAll();
  updateModeText('PRESS START');
  timer.classList.remove('paused');
});

muteBtn.addEventListener('click', handleMuteBtn);

infoBtn.addEventListener('click', handleInfoBtn);

document.addEventListener('click', (e) => {
  if (hamburgerBtn.classList.contains('open') && !nav.contains(e.target)) {
    handleHamburgerBtn();
  }
});

/* START */
updateResetBtn(state);
updateModeText('PRESS START');
setBackground(state);
timer.innerHTML = formatTime(toSeconds(DEF_FOCUS_VAL));
muteBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
templeBell.volume = soundVol;
