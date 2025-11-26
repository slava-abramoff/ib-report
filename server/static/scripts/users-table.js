const API_URL = '/api/users';
const LIMIT = 10;
let currentSkip = 0;
let total = 0;

const tableBody = document.getElementById('eventsBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

function truncateText(text, maxLength = 50) {
  if (!text) return '';
  const str = String(text);
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

async function loadUsers(skip = 0) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const response = await fetch(`${API_URL}?skip=${skip}&take=${LIMIT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // иногда помогает явно указать
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      alert('Сессия истекла. Пожалуйста, войдите заново.');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // ←←← ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ ←←←
    const result = await response.json(); // ← весь ответ уже здесь
    const { data: users, total: totalCount, skip: returnedSkip } = result;
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    total = totalCount;
    currentSkip = returnedSkip ?? skip; // на случай, если бэк не вернёт skip

    tableBody.innerHTML = '';

    if (!users || users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Нет пользователей</td></tr>';
      updatePagination();
      return;
    }

    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${user.id || ''}</td>
          <td>${truncateText(user.login)}</td>
          <td>${user.role === 'admin' ? 'Администратор' : 'Пользователь'}</td>
        `;
      tableBody.appendChild(row);
    });

    updatePagination();
  } catch (err) {
    console.error('Ошибка загрузки пользователей:', err);
    tableBody.innerHTML =
      '<tr><td colspan="3">Ошибка сети или сервера</td></tr>';
    updatePagination();
  }
}

function updatePagination() {
  const currentPage = Math.floor(currentSkip / LIMIT) + 1;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  pageInfo.textContent = `Страница ${currentPage} из ${totalPages} (всего: ${total})`;
  prevBtn.disabled = currentSkip === 0;
  nextBtn.disabled = currentSkip + LIMIT >= total;
}

prevBtn.addEventListener('click', () => {
  if (currentSkip >= LIMIT) {
    loadUsers(currentSkip - LIMIT);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentSkip + LIMIT < total) {
    loadUsers(currentSkip + LIMIT);
  }
});

// Первая загрузка
loadUsers(0);
