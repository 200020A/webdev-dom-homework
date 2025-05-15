"use strict";

import { getTodos, addTodo, login, register, isLoggedIn, getUser, setUser, logout } from "./api.js";
import { renderLoginForm, renderRegisterForm } from "./login.js";

const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const loadingElement = document.getElementById("loading");
const loadingMessageElement = document.getElementById("loading-message");
const addFormElement = document.querySelector(".add-form");
export let isLoaded = false;

let comments = [];

init();

function init() {
  if (isLoggedIn()) {
    showAuthorizedUI();
  } else {
    showUnauthorizedUI();
  }
  
  getComments();
}

function showAuthorizedUI() {
  const user = getUser();
  
  addFormElement.style.display = "flex";
  
  nameInputElement.value = user.name;
  nameInputElement.setAttribute("readonly", true);
  
  let logoutButton = document.querySelector(".logout-button");
  if (!logoutButton) {
    logoutButton = document.createElement("button");
    logoutButton.textContent = "Выйти";
    logoutButton.className = "logout-button";
    logoutButton.addEventListener("click", handleLogout);
    
    document.querySelector(".add-form-row").appendChild(logoutButton);
  }
  
  const authLink = document.getElementById("auth-link");
  if (authLink) {
    authLink.remove();
  }
}

function showUnauthorizedUI() {
  addFormElement.style.display = "none";
  
  let authLink = document.getElementById("auth-link");
  if (!authLink) {
    authLink = document.createElement("div");
    authLink.id = "auth-link";
    authLink.innerHTML = '<a href="#" id="auth-link-button">Чтобы добавить комментарий, авторизуйтесь</a>';
    authLink.style.margin = "20px 0";
    authLink.style.textAlign = "center";
    
    document.querySelector(".container").insertBefore(authLink, addFormElement);
    
    document.getElementById("auth-link-button").addEventListener("click", showLoginForm);
  }
  
  const logoutButton = document.querySelector(".logout-button");
  if (logoutButton) {
    logoutButton.remove();
  }
}

function handleLogout() {
  logout();
  showUnauthorizedUI();
}

function showLoginForm(event) {
  if (event) event.preventDefault();
  
  const loginForm = renderLoginForm();
  
  loginForm.loginButton.addEventListener("click", () => {
    const loginValue = loginForm.loginInput.value.trim();
    const passwordValue = loginForm.passwordInput.value.trim();
    
    if (!loginValue || !passwordValue) {
      showError(loginForm.errorMessage, "Логин и пароль обязательны для заполнения");
      return;
    }
    
    login(loginValue, passwordValue)
      .then((data) => {
        setUser(data.user);
        loginForm.element.innerHTML = loginForm.originalContent;
        init();
      })
      .catch((error) => {
        showError(loginForm.errorMessage, error.message);
      });
  });
  
  loginForm.registerButton.addEventListener("click", () => {
    showRegisterForm();
  });
  
  loginForm.backButton.addEventListener("click", () => {
    loginForm.element.innerHTML = loginForm.originalContent;
    init();
  });
}

function showRegisterForm() {
  const registerForm = renderRegisterForm();
  
  registerForm.registerButton.addEventListener("click", () => {
    const nameValue = registerForm.nameInput.value.trim();
    const loginValue = registerForm.loginInput.value.trim();
    const passwordValue = registerForm.passwordInput.value.trim();
    
    if (!nameValue || !loginValue || !passwordValue) {
      showError(registerForm.errorMessage, "Все поля обязательны для заполнения");
      return;
    }
    
    register(loginValue, passwordValue, nameValue)
      .then((data) => {
        setUser(data.user);
        registerForm.element.innerHTML = registerForm.originalContent;
        init();
      })
      .catch((error) => {
        showError(registerForm.errorMessage, error.message);
      });
  });
  
  registerForm.backButton.addEventListener("click", () => {
    showLoginForm();
  });
}

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 3000);
}

function getComments() {
  if (isLoaded === false) {
    loadingElement.style.display = "block";
  }
  
  isLoaded = true;
  
  getTodos()
    .then((responseData) => {
      comments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: formatDate(comment.date),
          text: comment.text,
          likeCount: comment.likes,
          isLiked: comment.isLiked,
        };
      });
      
      render();
      loadingElement.style.display = "none";
    })
    .catch((error) => {
      console.error("Возникла проблема с операцией fetch:", error);
      loadingElement.textContent = "Не удалось загрузить страницу";
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  
  return (
    date.toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }) +
    " " +
    date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
}

function render() {
  listElement.innerHTML = comments
    .map((comment, index) => {
      const classButton = comment.isLiked ? "-active-like" : "";
      return `<li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text}
            </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter" data-index ="${index}">${comment.likeCount}</span>
                  <button class="like-button ${classButton}" data-index ="${index}" data-like="${comment.isLiked}"></button>
                  </div>
                  </div>
        </li>`;
    })
    .join("");

  initEventListener();
  answerComment();
}

function answerComment() {
  const comment = document.querySelectorAll(".comment");
  
  comment.forEach((el, index) => {
    el.addEventListener("click", (event) => {
      if (isLoggedIn()) {
        textInputElement.value = `>${comments[index].name} \n ${comments[index].text}`;
      }
    });
  });
}

function initEventListener() {
  const likeButtonElements = document.querySelectorAll(".like-button");
  
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButtonElement.dataset.index;
      
      if (isLoggedIn()) {
        if (comments[index].isLiked) {
          comments[index].isLiked = !comments[index].isLiked;
          comments[index].likeCount--;
        } else {
          comments[index].isLiked = !comments[index].isLiked;
          comments[index].likeCount++;
        }
        render();
      } else {
        alert("Чтобы ставить лайки, необходимо авторизоваться");
      }
    });
  }
}

buttonElement.addEventListener("click", () => {
  if (!isLoggedIn()) {
    alert("Чтобы добавлять комментарии, необходимо авторизоваться");
    return;
  }
  
  textInputElement.classList.remove("error");
  
  if (textInputElement.value.trim() === "") {
    textInputElement.classList.add("error");
    return;
  }

  loadingMessageElement.style.display = "block";
  
  addFormElement.style.display = "none";

  const name = nameInputElement.value.trim();

  addTodo(
    textInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    name
  )
    .then(() => {
      return getComments();
    })
    .then(() => {
      textInputElement.value = "";
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      loadingMessageElement.style.display = "none";
      addFormElement.style.display = "flex";
    });
});