export function renderLoginForm() {
  const appEl = document.querySelector('.container');
  const originalContent = appEl.innerHTML;
  
  appEl.innerHTML = `
    <div class="login-form">
      <h3>Авторизация</h3>
      <div id="error-message" class="error-message" style="display: none; color: red;"></div>
      <input type="text" id="login-input" class="login-form-input" placeholder="Логин" />
      <input type="password" id="password-input" class="login-form-input" placeholder="Пароль" />
      <div class="login-form-row">
        <button id="login-button" class="login-form-button">Войти</button>
        <button id="register-button" class="login-form-button">Зарегистрироваться</button>
      </div>
      <div class="login-form-row">
        <button id="back-button" class="login-form-button">Назад</button>
      </div>
    </div>
  `;

  return {
    element: appEl,
    originalContent,
    loginButton: document.getElementById('login-button'),
    registerButton: document.getElementById('register-button'),
    backButton: document.getElementById('back-button'),
    loginInput: document.getElementById('login-input'),
    passwordInput: document.getElementById('password-input'),
    errorMessage: document.getElementById('error-message')
  };
}

export function renderRegisterForm() {
  const appEl = document.querySelector('.container');
  const originalContent = appEl.innerHTML;
  
  appEl.innerHTML = `
    <div class="register-form">
      <h3>Регистрация</h3>
      <div id="error-message" class="error-message" style="display: none; color: red;"></div>
      <input type="text" id="name-input" class="register-form-input" placeholder="Имя" />
      <input type="text" id="login-input" class="register-form-input" placeholder="Логин" />
      <input type="password" id="password-input" class="register-form-input" placeholder="Пароль" />
      <div class="register-form-row">
        <button id="register-button" class="register-form-button">Зарегистрироваться</button>
      </div>
      <div class="register-form-row">
        <button id="back-button" class="register-form-button">Назад</button>
      </div>
    </div>
  `;

  return {
    element: appEl,
    originalContent,
    registerButton: document.getElementById('register-button'),
    backButton: document.getElementById('back-button'),
    nameInput: document.getElementById('name-input'),
    loginInput: document.getElementById('login-input'),
    passwordInput: document.getElementById('password-input'),
    errorMessage: document.getElementById('error-message')
  };
}