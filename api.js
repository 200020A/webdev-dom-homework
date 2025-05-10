export function getTodos() {
  return fetch("https://wedev-api.sky.pro/api/v1/anastasia-petrova/comments", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 500) {
        alert("Сервер сломался, попробуйте позже");
      }
      throw new Error("Ответ сервера не был успешным");
    }
    return response.json();
  });
}
