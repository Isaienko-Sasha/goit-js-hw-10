import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button[data-start]');
const inputEl = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.disabled = true;
let userSelectedDate = null;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
        startBtn.disabled = true;
        iziToast.error({
            message: "Please choose a date in the future",
            position: 'topRight',
        });
    } else {
      userSelectedDate = selected;
      startBtn.disabled = false;
    }
  },
});


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

class Timer {
  constructor({ onTick }) {
    this.onTick = onTick;
    this.isActive = false;
    this.intervalId = null;
  }

  start() {
      startBtn.disabled = true;
      inputEl.disabled = true;
    

    if (this.isActive) {
      return;
    }

    this.isActive = true;

    const startTime = Date.now();

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - Date.now();

      if (deltaTime <= 0) {
        clearInterval(this.intervalId);
        const time = convertMs(0);
          this.onTick(time);
          this.isActive = false;
          inputEl.disabled = false;
        return;
      }
      const time = convertMs(deltaTime);

      this.onTick(time);
    }, 1000);
  }
}

const time = new Timer({ onTick: updateClock });
startBtn.addEventListener('click', time.start.bind(time));

function updateClock({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

