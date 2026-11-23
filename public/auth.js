const logoutBtn = document.querySelector('#logout-btn');
const authForm = document.querySelector('#auth-form');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/';
  });
}

if (authForm) {
  const errorBox = document.querySelector('#auth-error');

  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(authForm));
    const button = authForm.querySelector('button');

    errorBox.textContent = '';
    button.disabled = true;
    try {
      const response = await fetch(authForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const { error } = await response.json();
        errorBox.textContent = error;
        return;
      }

      window.location.href = '/profiles';
    } catch (error) {
      errorBox.textContent = `Something went wrong. ${error.message}`;
    } finally {
      button.disabled = false;
      if (document.activeElement === document.body) button.focus();
    }
  });
}