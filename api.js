const BASE_URL = "https://wedev-api.sky.pro/api/v1/anastasia-petrova";
const AUTH_URL = "https://wedev-api.sky.pro/api";

export function getTodos() {
  return fetch(`${BASE_URL}/comments`, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуйте позже");
      }
      throw new Error("Ответ сервера не был успешным");
    }
    return response.json();
  });
}

export function addTodo(text, name) {
  const token = getToken();
  
  return fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      text: text,
      name: name
    }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Вы не авторизованы");
      }
      if (response.status === 400) {
        return response.json().then((data) => {
          throw new Error(data.error || "Некорректные данные");
        });
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуйте позже");
      }
      throw new Error("Ответ сервера не был успешным");
    }
    return response.json();
  });
}

export function login(login, password) {
  return fetch(`${AUTH_URL}/user/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуйте позже");
      }
      throw new Error("Ответ сервера не был успешным");
    }
    return response.json();
  });
}

export function register(login, password, name) {
  return fetch(`${AUTH_URL}/user`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
    }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Пользователь с таким логином уже существует");
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуйте позже");
      }
      throw new Error("Ответ сервера не был успешным");
    }
    return response.json();
  });
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function getToken() {
  const user = getUser();
  return user ? user.token : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("user");
}