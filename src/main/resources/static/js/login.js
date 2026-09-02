(() => {
  'use strict';

  // const SESSION_KEY = 'financas95.sessionUser';
  const $ = (selector) => document.querySelector(selector);

  const form = $('#loginForm');
  const error = $('#loginError');
  const toast = $('#toast');
  const clock = $('#taskbarClock');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  form.addEventListener('submit', (event) => {
    const username = $('#loginUsername').value.trim();
    const password = $('#loginPassword').value;

    if (!username || !password) {
      event.preventDefault();
      error.textContent = 'Preencha o usuário e a senha.';
      error.hidden = false;
      return;
    }

    error.hidden = true;
  });

  function updateClock() {
    clock.textContent = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }

  updateClock();
  setInterval(updateClock, 30000);
})();
