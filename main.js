document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const phone = document.getElementById('phone');
  const dialog = document.getElementById('contactDialog');
  const openButton = document.getElementById('openDialog');
  const closeButton = document.getElementById('closeDialog');

  // Лёгкая маска телефона
  if (phone) {
      phone.addEventListener('input', () => {
          const digits = phone.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр
          const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
          const parts = [];
          
          if (d.length > 0) parts.push('+7');
          if (d.length > 1) parts.push(' (' + d.slice(1, 4));
          if (d.length >= 4) parts[parts.length - 1] += ')';
          if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
          if (d.length >= 8) parts.push('-' + d.slice(7, 9));
          if (d.length >= 10) parts.push('-' + d.slice(9, 11));
          
          phone.value = parts.join('');
      });

      // Строгая проверка
      phone.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
  }

  // Обработчик отправки формы
  if (form) {
      form.addEventListener('submit', (e) => {
          // 1) Сброс кастомных сообщений
          [...form.elements].forEach(el => {
              if (el.setCustomValidity) el.setCustomValidity('');
          });
          
          // 2) Проверка встроенных ограничений
          if (!form.checkValidity()) {
              e.preventDefault();
              
              // Пример: таргетированное сообщение
              const email = form.elements.email;
              if (email && email.validity && email.validity.typeMismatch) {
                  email.setCustomValidity('Введите корректный e-mail, например name@example.com');
              }
              
              form.reportValidity(); // показать браузерные подсказки
              
              // A11y: подсветка проблемных полей
              [...form.elements].forEach(el => {
                  if (el.willValidate) {
                      el.toggleAttribute('aria-invalid', !el.checkValidity());
                  }
              });
              
              return;
          }
          
          // 3) Успешная «отправка» (без сервера)
          e.preventDefault();
          
          // Если форма внутри <dialog>, закрываем окно:
          if (dialog) {
              dialog.close('success');
          }
          form.reset();
      });
  }

  // Управление модальным окном
  if (openButton && dialog) {
      // Открытие модального окна
      openButton.addEventListener('click', () => {
          dialog.showModal();
          // Перенос фокуса на первый элемент формы
          setTimeout(() => {
              if (form && form.elements[0]) {
                  form.elements[0].focus();
              }
          }, 100);
      });
  }

  if (dialog) {
      // Закрытие по Esc
      dialog.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              dialog.close();
              if (openButton) {
                  openButton.focus(); // Возврат фокуса на кнопку открытия
              }
          }
      });

      // Обработка Tab внутри модального окна
      dialog.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
              const focusableElements = dialog.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              
              if (focusableElements.length === 0) return;
              
              const firstFocusable = focusableElements[0];
              const lastFocusable = focusableElements[focusableElements.length - 1];
              
              if (e.shiftKey) {
                  // Shift+Tab
                  if (document.activeElement === firstFocusable) {
                      e.preventDefault();
                      lastFocusable.focus();
                  }
              } else {
                  // Tab
                  if (document.activeElement === lastFocusable) {
                      e.preventDefault();
                      firstFocusable.focus();
                  }
              }
          }
      });
  }

  // Закрытие по кнопке
  if (closeButton && dialog && openButton) {
      closeButton.addEventListener('click', () => {
          dialog.close();
          openButton.focus();
      });
  }
});