// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


document.addEventListener('DOMContentLoaded', function() {
    // Функція для створення промісу
    function createPromise(delay, state) {
      return new Promise((resolve, reject) => {
        // Виконання або відхилення промісу через вказану затримку
        setTimeout(() => {
          if (state === 'fulfilled') {
            resolve(delay);
          } else {
            reject(delay);
          }
        }, delay);
      });
    }

    // Обробка події submit форми
    document.querySelector('.form').addEventListener('submit', function(event) {
      event.preventDefault();
      
      const delay = parseInt(this.querySelector('[name="delay"]').value);
      const state = this.querySelector('[name="state"]:checked').value;
      
      // Створення промісу
      createPromise(delay, state)
        .then(delay => {
          // Виведення повідомлення про виконаний проміс
          iziToast.success({
            title: 'Fulfilled promise',
            message: `✅ Fulfilled promise in ${delay}ms`,
            position: 'topRight'
          });
        })
        .catch(delay => {
          // Виведення повідомлення про відхилення промісу
          iziToast.error({
            title: 'Rejected promise',
            message: `❌ Rejected promise in ${delay}ms`,
            position: 'topRight'
          });
        });
        // Очищення форми
        this.reset();
    });
  });