const API_URL = "/events"; // Замени на реальный путь, если нужно
const LIMIT = 10;

let currentSkip = 0;
let total = 0;

const tableBody = document.getElementById("eventsBody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// Функция обрезки текста
function truncateText(text, maxLength = 50) {
  if (!text) return "";
  const str = String(text);
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

async function loadEvents(skip = 0) {
  try {
    const response = await fetch(`${API_URL}?skip=${skip}&limit=${LIMIT}`);
    const result = await response.json();

    if (!result.success || !result.data) {
      tableBody.innerHTML = '<tr><td colspan="19">Ошибка загрузки</td></tr>';
      return;
    }

    const { data: events, total: totalCount, skip: returnedSkip } = result.data;

    total = totalCount;
    currentSkip = returnedSkip;

    tableBody.innerHTML = "";

    if (events.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="19">Нет данных</td></tr>';
      updatePagination();
      return;
    }

    events.forEach((event) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${event.id || ""}</td>
        <td>${truncateText(event.date)}</td>
        <td>${truncateText(event.number)}</td>
        <td>${truncateText(event.surname)}</td>
        <td>${truncateText(event.address)}</td>
        <td>${event.isEventResolved ? "Да" : "Нет"}</td>
        <td><a href="/events/${event.id}/doc" target="_blank">PDF</a></td>
      `;

      tableBody.appendChild(row);
    });

    updatePagination();
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    tableBody.innerHTML = '<tr><td colspan="19">Ошибка сети</td></tr>';
  }
}

function updatePagination() {
  const currentPage = Math.floor(currentSkip / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  pageInfo.textContent = `Страница ${currentPage} из ${totalPages} (всего: ${total})`;

  prevBtn.disabled = currentSkip === 0;
  nextBtn.disabled = currentSkip + LIMIT >= total;
}

// Обработчики пагинации
prevBtn.addEventListener("click", () => {
  if (currentSkip >= LIMIT) {
    loadEvents(currentSkip - LIMIT);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentSkip + LIMIT < total) {
    loadEvents(currentSkip + LIMIT);
  }
});

// Стартовая загрузка
loadEvents(0);
