const API_URL = "/events";
let currentSkip = 0;
const limit = 10;
let total = 0;

const tableBody = document.getElementById("eventsBody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

async function loadEvents(skip = 0) {
  try {
    const response = await fetch(`${API_URL}?skip=${skip}&limit=${limit}`);
    const result = await response.json();

    if (!result.success) {
      tableBody.innerHTML =
        '<tr><td colspan="19">Ошибка загрузки данных</td></tr>';
      return;
    }

    const {
      data,
      total: totalCount,
      skip: returnedSkip,
      limit: returnedLimit,
    } = result.data;

    total = totalCount;
    currentSkip = returnedSkip;

    // Очистка таблицы
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="19">Нет данных</td></tr>';
      updatePagination();
      return;
    }

    data.forEach((event) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${event.id || ""}</td>
          <td>${event.date || ""}</td>
          <td>${event.number || ""}</td>
          <td>${event.surname || ""}</td>
          <td>${event.address || ""}</td>
          <td>${event.phoneNumber || ""}</td>
          <td>${event.mail || ""}</td>
          <td>${event.happened || ""}</td>
          <td>${event.happenedCause || ""}</td>
          <td>${event.rootCause || ""}</td>
          <td>${event.affectedComponents || ""}</td>
          <td>${event.businessImpact || ""}</td>
          <td>${event.identifiedVulnerabilities || ""}</td>
          <td>${event.isEventResolved ? "Да" : "Нет"}</td>
          <td>${event.eventDuration || ""}</td>
          <td>${event.start || ""}</td>
          <td>${event.detect || ""}</td>
          <td>${event.end || ""}</td>
          <td><a href="/pdf/${event.id}.pdf" target="_blank">PDF</a></td>
        `;

      tableBody.appendChild(row);
    });

    updatePagination();
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = '<tr><td colspan="19">Ошибка сети</td></tr>';
  }
}

function updatePagination() {
  const currentPage = Math.floor(currentSkip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  pageInfo.textContent = `Страница ${currentPage} из ${totalPages} (всего: ${total})`;

  prevBtn.disabled = currentSkip === 0;
  nextBtn.disabled = currentSkip + limit >= total;
}

prevBtn.addEventListener("click", () => {
  if (currentSkip >= limit) {
    loadEvents(currentSkip - limit);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentSkip + limit < total) {
    loadEvents(currentSkip + limit);
  }
});

loadEvents(0);
