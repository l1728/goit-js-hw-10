// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";



let timerInterval;
let userSelectedDate;
// Функція, яка перевіряє, чи є дата майбутньою
function isFutureDate(date) {
    return date > new Date();
};

 // Ініціалізація flatpickr
const flatpickrInput = flatpickr("#datetime-picker", {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose: function (selectedDates) {
        userSelectedDate = selectedDates[0];
        if (isFutureDate(userSelectedDate)) {
            document.querySelector("[data-start]").disabled = false;
        } else {
            document.querySelector("[data-start]").disabled = true;
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future"
            });
        }
    }
});
 
// Функція для форматування числа з доданням нулів
function addLeadingZero(value) {
    return value < 10 ? "0" + value : value;
};

// Функція оновлення таймера
function updateTimer() {
    const difference = userSelectedDate.getTime() - new Date().getTime();
    if (difference <= 0) {
        clearInterval(timerInterval);
        document.querySelector("[data-start]").disabled = false;
        return;
    }
    const { days, hours, minutes, seconds } = convertMs(difference);
    document.querySelector("[data-days]").textContent = addLeadingZero(days);
    document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
    document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
    document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
};

// Функція перетворення мілісекунд у дні, години, хвилини та секунди
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
};

const startButton = document.querySelector("[data-start]");

// Встановлюємо або знімаємо клас "disabled" в залежності від стану кнопки
function toggleButtonState(disable) {
  if (disable) {
    startButton.classList.add("disabled");
  } else {
    startButton.classList.remove("disabled");
  }
}






// Натискання на кнопку "Start"
document.querySelector("[data-start]").addEventListener("click", function () {
    this.disabled = true;
    toggleButtonState(true); // Застосовуємо стилі для вимкненої кнопки
    flatpickrInput.close();// Закриття календаря після натискання кнопки
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    disableInputAndButton(true);// Функція для вимкнення інпуту і кнопки

});

// Функція для вимкнення або увімкнення інпуту і кнопки
function disableInputAndButton(disable) {
    const input = document.querySelector("#datetime-picker");
    const button = document.querySelector("[data-start]");
    input.disabled = disable;
    button.disabled = disable;
};

// Перевірка на вибір нової дати
flatpickrInput.calendarContainer.onclick = (function(event) {
    if (timerInterval) {
        iziToast.warning({
            title: "Warning",
            message: "Please reload the page to change the date."
        });
        event.preventDefault();
    }
});