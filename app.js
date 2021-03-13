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
  focusTime: DEF_FOCUS_VAL,
  breakTime: DEF_BREAK_VAL,
  restTime: DEF_REST_VAL,
};

let setting = settings.DEFAULT;
let mode = modes.START;
let state = states.START;
let timePause = 0;
let timesFocused = 0;
let soundVol = 0;

/* DOM ELEMENTS */
const app = document.querySelector('.app');

const nav = document.querySelector('.nav');
const hamburgerBtn = document.querySelector('.hamburger-btn');
const barTop = document.querySelector('.top');
const barMid = document.querySelector('.mid');
const barBottom = document.querySelector('.bottom');

const form = document.querySelector('.form');
const focusInput = document.querySelector('.focus-input');
const breakInput = document.querySelector('.break-input');
const restInput = document.querySelector('.rest-input');
const saveIndicator = document.querySelector('.save-indicator');
const saveBtn = document.querySelector('.save-btn');
const defaultBtn = document.querySelector('.default-btn');

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

const saveToLocalStorage = () => {
  const settings_serialized = JSON.stringify(userSettings);

  localStorage.setItem('userSettings', settings_serialized);
};

const getFromLocalStorage = () => {
  if (localStorage.getItem('userSettings')) {
    const settings_deserialized = JSON.parse(
      localStorage.getItem('userSettings')
    );
    setUserSettings(
      settings_deserialized.focusTime,
      settings_deserialized.breakTime,
      settings_deserialized.restTime
    );
  }
};

const clearLocalStorage = () => {
  localStorage.clear();
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
    case states.START:
      resetAll();
      setState(states.PAUSE);
      timer.classList.remove('paused');
      setMode(modes.FOCUS);
      updateStartBtn(state);
      updateResetBtn(state);
      startTimer(userSettings.focusTime);
      break;
    case states.PAUSE:
      setState(states.RESUME);
      timer.classList.add('paused');
      updateStartBtn(state);
      updateResetBtn(state);
      break;
    case states.RESUME:
      setState(states.PAUSE);
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

const indicateSaved = () => {
  saveIndicator.classList.add('show');

  setTimeout(() => {
    saveIndicator.classList.remove('show');
  }, 3000);
};

const updateSaveBtn = (f, b, r) => {
  if (f && b && r) {
    saveBtn.disabled = false;
  }
};

const updateDefaultBtn = () => {
  if (setting != 'USER') {
    defaultBtn.disabled = true;
  } else {
    defaultBtn.disabled = false;
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

  function addZero(n) {
    return String(n).padStart(2, '0');
  }

  const hrsFormatted = addZero(hrs);
  const minsFormatted = addZero(mins);
  const secFormatted = addZero(sec);

  return `${hrsFormatted}:${minsFormatted}:${secFormatted}`;
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
      templeBell.muted = false;
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
  }, 10);
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
  updateSaveBtn(focusInput.value, breakInput.value, restInput.value);
});

saveBtn.addEventListener('click', (e) => {
  if (
    isValid(focusInput, 15, 120) &&
    isValid(breakInput, 1, 15) &&
    isValid(restInput, 10, 30)
  ) {
    console.log('VALID');
    e.preventDefault();
    indicateSaved();
    setUserSettings(focusInput.value, breakInput.value, restInput.value);
    saveToLocalStorage();

    setTimeout(() => {
      saveBtn.disabled = true;
    }, 500);
  } else {
    console.log('INVALID');
  }
  updateDefaultBtn();
});

defaultBtn.addEventListener('click', clearLocalStorage);

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
    if (e.target.classList.contains('fas')) {
      handleInfoBtn();
    }
  }
});

/* START */
updateResetBtn(state);
updateModeText('PRESS START');
setBackground(state);
getFromLocalStorage();
if (setting != 'USER') {
  timer.innerHTML = formatTime(toSeconds(DEF_FOCUS_VAL));

  focusInput.placeholder = DEF_FOCUS_VAL;
  breakInput.placeholder = DEF_BREAK_VAL;
  restInput.placeholder = DEF_REST_VAL;
} else {
  focusInput.value = userSettings.focusTime;
  breakInput.value = userSettings.breakTime;
  restInput.value = userSettings.restTime;
}
updateDefaultBtn();
muteBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
templeBell.volume = soundVol;
