"use strict";

import { getTodos } from "./api.js";

// Код писать здесь
const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
export let isLoaded = false;

function getComments() {
  const loadingElement = document.getElementById("loading");
  if (isLoaded === false) {
    loadingElement.style.display = "block";
  }
  isLoaded = true;
  getTodos()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date:
            new Date(comment.date).toLocaleDateString("ru-RU", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            }) +
            " " +
            new Date(comment.date).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          text: comment.text,
          likeCount: comment.likes,
          isLiked: false,
        };
      });
      comments = appComments;
      render();
      loadingElement.style.display = "none";
    })
    .catch((error) => {
      if (error.messeg !== "Ответ не был успешным") {
        console.error("Возникла проблема с операцией fetch:", error);
        alert("Кажется, у вас сломался интернет, попробуйте позже.");
      }
    })
    .finally(() => {
      loadingElement.textContent = "Не удалось загрузить страницу";
    });
}
getComments();

let comments = [];

function funcDate(currentDate) {
  return (currentDate =
    new Date().toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }) +
    " " +
    new Date(comment.date).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }));
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
  const formElementText = document.querySelector(".add-form-text");
  const formElementName = document.querySelector(".add-form-name");
  comment.forEach((el, index) => {
    el.addEventListener("click", (event) => {
      formElementText.value = `>${comments[index].name} \n ${comments[index].text}`;
    });
  });
}

function initEventListener() {
  const likeButtonElements = document.querySelectorAll(".like-button");
  for (const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButtonElement.dataset.index;
      if (comments[index].isLiked) {
        comments[index].isLiked = !comments[index].isLiked;
        comments[index].likeCount--;
      } else {
        comments[index].isLiked = !comments[index].isLiked;
        comments[index].likeCount++;
      }
      render();
    });
  }
}

buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  textInputElement.classList.remove("error");
  if (
    nameInputElement.value.trim() === "" ||
    textInputElement.value.trim() === ""
  ) {
    nameInputElement.classList.add("error");
    textInputElement.classList.add("error");
    return;
  }

  let currentDate = new Date();

  function addComment() {
    const loadingMessageElement = document.getElementById("loading-message");
    loadingMessageElement.style.display = "block";

    //Скрываем форму добавления комментария
    const textFormElement = document.querySelector(".add-form");
    textFormElement.style.display = "none";

    // Функция добавления данных на сервер
    fetch("https://wedev-api.sky.pro/api/v1/anastasia-petrova/comments", {
      method: "POST",
      body: JSON.stringify({
        name: nameInputElement.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        text: textInputElement.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        forceError: true,
      }),
    })
      .catch(() => {
        throw new Error("Возникла проблема с операцией fetch:");
      })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error(
              "Имя и комментарий должны быть не меньше 3 символов"
            );
          } else if (response.status === 500) {
            throw new Error("Сервер сломался, попробуйте позже");
          }
          throw new Error("Ответ сервера не был успешным");
        }
        return response.json();
      })
      .then(() => {
        return getComments();
      })
      .then(() => {
        nameInputElement.value = "";
        textInputElement.value = "";
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        loadingMessageElement.style.display = "none";
        textFormElement.style.display = "flex";
      });
  }
  addComment();
});

render();

console.log("It works!");
