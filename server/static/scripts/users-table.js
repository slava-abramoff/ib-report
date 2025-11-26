// static/scripts/users-table.js

const API_URL = "/users"; // твой защищённый эндпоинт
const LIMIT = 10;
let currentSkip = 0;
let total = 0;

const tableBody = document.getElementById("eventsBody"); // да, в HTML у тебя id="eventsBody" — оставил как есть
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Утилита для обрезки длинного текста (на всякий случай, логин обычно короткий, но пусть будет)
function truncateText(text, maxLength = 50) {
  if (!text) return "";
  const str = String(text);
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

// Основная функция загрузки пользователей
async function loadUsers(skip = 0) {
  try {
    const token = localStorage.getItem("token"); // предполагается, что токен сохраняется после логина
    const response = await fetch(`${API_URL}?skip=${skip}&limit=${LIMIT}`, {
      headers: {
        Authorization: `Bearer ${token}`, // если используешь fastify-jwt — именно так передаётся
        // Если ты передаёшь токен через cookie — этот заголовок можно убрать
      },
    });

    // Если 401 — токен истёк или его нет
    if (response.status === 401) {
      alert("Сессия истекла. Пожалуйста, войдите заново.");
      localStorage.removeItem("token");
      window.location.href = "/form"; // или на страницу логина
      return;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      tableBody.innerHTML =
        '<tr><td colspan="3">Ошибка загрузки данных</td></tr>';
      return;
    }

    const { data: users, total: totalCount, skip: returnedSkip } = result.data;

    total = totalCount;
    currentSkip = returnedSkip;

    tableBody.innerHTML = "";

    if (users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Нет пользователей</td></tr>';
      updatePagination();
      return;
    }

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id || ""}</td>
        <td>${truncateText(user.login)}</td>
        <td>${user.role === "admin" ? "Администратор" : "Пользователь"}</td>
      `;
      tableBody.appendChild(row);
    });

    updatePagination();
  } catch (err) {
    console.error("Ошибка загрузки пользователей:", err);
    tableBody.innerHTML = '<tr><td colspan="3">Ошибка сети</td></tr>';
  }
}

// Обновление пагинации
function updatePagination() {
  const currentPage = Math.floor(currentSkip / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT) || 1;
  pageInfo.textContent = `Страница ${currentPage} из ${totalPages} (всего: ${total})`;
  prevBtn.disabled = currentSkip === 0;
  nextBtn.disabled = currentSkip + LIMIT >= total;
}

// Навигация
prevBtn.addEventListener("click", () => {
  if (currentSkip >= LIMIT) {
    loadUsers(currentSkip - LIMIT);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentSkip + LIMIT < total) {
    loadUsers(currentSkip + LIMIT);
  }
});

// Первая загрузка при открытии страницы
loadUsers(0);
