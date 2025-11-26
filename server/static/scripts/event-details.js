// /scripts/event-details.js
const API_URL = '/api/events';
const path = window.location.pathname;
const id = path.split('/').pop();

// DOM-элементы
const eventNumberTitle = document.getElementById('event-id');
const title = document.querySelector('h1');
const fields = {
  id: document.getElementById('id'),
  date: document.getElementById('date'),
  start: document.getElementById('start'),
  detect: document.getElementById('detect'),
  end: document.getElementById('end'),
  eventDuration: document.getElementById('eventDuration'),
  address: document.getElementById('address'),
  number: document.getElementById('number'),
  phoneNumber: document.getElementById('phoneNumber'),
  mail: document.getElementById('mail'),
  surname: document.getElementById('surname'),
  happened: document.getElementById('happened'),
  happenedCause: document.getElementById('happenedCause'),
  rootCause: document.getElementById('rootCause'),
  affectedComponents: document.getElementById('affectedComponents'),
  identifiedVulnerabilities: document.getElementById(
    'identifiedVulnerabilities',
  ),
  businessImpact: document.getElementById('businessImpact'),
  isEventResolved: document.getElementById('isEventResolved'),
};

// Кнопки
let editBtn, saveBtn, cancelBtn, deleteBtn, similarBtn;
let currentEvent = null;
let isEditMode = false;

// Универсальный authFetch (без Content-Type, если нет body)
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Вы не авторизованы! Перенаправляю на вход...');
    window.location.href = '/login';
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    alert('Сессия истекла. Войдите заново.');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  return response;
}

// Панель управления для админа
function createAdminControls() {
  if (localStorage.getItem('role') !== 'admin') return;

  const controls = document.createElement('div');
  controls.className = 'admin-controls';
  controls.style.cssText = `
    margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;
    display: flex; gap: 12px; flex-wrap: wrap; align-items: center; font-size: 15px;
  `;

  editBtn = btn('Редактировать', () => enterEditMode(), '#007bff');
  deleteBtn = btn('Удалить событие', () => confirmDelete(), '#dc3545');
  // similarBtn = btn('Похожие', () => alert('Функция в разработке'), '#17a2b8');

  controls.append(editBtn, deleteBtn);
  title.after(controls);
}

function btn(text, click, bg) {
  const b = document.createElement('button');
  b.textContent = text;
  b.type = 'button';
  b.onclick = click;
  b.style.cssText = `
    padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer;
    color: white; background: ${bg}; font-weight: 500; transition: opacity .2s;
  `;
  b.onmouseover = () => (b.style.opacity = '0.9');
  b.onmouseout = () => (b.style.opacity = '1');
  return b;
}

// Вход в режим редактирования
function enterEditMode() {
  isEditMode = true;
  Object.keys(fields).forEach(
    (k) => (fields[k].dataset.original = fields[k].textContent),
  );
  makeFieldsEditable();

  const controls = document.querySelector('.admin-controls');
  controls.innerHTML = '';
  saveBtn = btn('Сохранить', () => saveChanges(), '#28a745');
  cancelBtn = btn('Отмена', () => exitEditMode(), '#6c757d');
  controls.append(saveBtn, cancelBtn);
}

// Выход без сохранения
function exitEditMode() {
  isEditMode = false;
  Object.keys(fields).forEach((k) => {
    const el = fields[k];
    el.textContent = el.dataset.original || el.textContent;
    el.contentEditable = false;
    el.style.cssText = '';
    if (el.querySelector) el.innerHTML = el.dataset.original || el.innerHTML;
  });

  const controls = document.querySelector('.admin-controls');
  controls.innerHTML = '';
  controls.append(editBtn, deleteBtn);
}

// Делаем поля редактируемыми
function makeFieldsEditable() {
  const nonEditable = ['id', 'eventDuration'];
  Object.keys(fields).forEach((key) => {
    const el = fields[key];
    if (nonEditable.includes(key)) return;

    if (key === 'isEventResolved') {
      const select = document.createElement('select');
      select.innerHTML = `<option value="false">Нет</option><option value="true">Да</option>`;
      select.value = currentEvent.isEventResolved ? 'true' : 'false';
      el.textContent = '';
      el.appendChild(select);
      return;
    }

    el.contentEditable = true;
    el.style.cssText =
      'background:#fff; padding:4px 6px; border:1px solid #007bff; border-radius:4px;';
  });
}

function collectFormData() {
  const data = {};

  // Поля 1 в 1 как в DTO (camelCase)
  const dtoKeys = {
    date: 'date',
    start: 'start',
    detect: 'detect',
    end: 'end',
    address: 'address',
    number: 'number',
    phoneNumber: 'phoneNumber',
    mail: 'mail',
    surname: 'surname',
    happened: 'happened',
    happenedCause: 'happenedCause',
    rootCause: 'rootCause',
    affectedComponents: 'affectedComponents',
    identifiedVulnerabilities: 'identifiedVulnerabilities',
    businessImpact: 'businessImpact',
    isEventResolved: 'isEventResolved',
  };

  Object.entries(dtoKeys).forEach(([jsKey, dtoKey]) => {
    const el = fields[jsKey];
    if (!el) return;

    let newValue;

    // Boolean (select)
    if (jsKey === 'isEventResolved') {
      const select = el.querySelector('select');
      if (select) newValue = select.value === 'true';
    }

    // Обычные текстовые поля
    else if (el.contentEditable === 'true') {
      const trimmed = el.textContent.trim();
      const old =
        currentEvent[jsKey] !== null && currentEvent[jsKey] !== undefined
          ? String(currentEvent[jsKey]).trim()
          : '';

      if (trimmed !== old) {
        newValue = trimmed === '' ? null : trimmed;
      }
    }

    // Записываем только изменившиеся
    if (newValue !== undefined) {
      data[dtoKey] = newValue; // <-- camelCase
    }
  });

  console.log(
    '%cОтправка на сервер:',
    'background:#ff0;color:#000;font-weight:bold',
    data,
  );

  return data;
}

// Сохранение
async function saveChanges() {
  const payload = collectFormData();

  if (Object.keys(payload).length === 0) {
    alert('Ничего не изменилось');
    exitEditMode();
    return;
  }

  try {
    const res = await authFetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!res) return;

    if (res.ok) {
      alert('Событие успешно обновлено!');
      // const fresh = await (await authFetch(`${API_URL}/${id}`)).json();
      // currentEvent = fresh.data;
      // renderEvent(currentEvent);
      exitEditMode();
    } else {
      const err = await res.json().catch(() => ({}));
      alert('Ошибка: ' + (err.error || err.message || 'Неизвестная ошибка'));
    }
  } catch (e) {
    console.error(e);
    alert('Ошибка сети');
  }
}

// Удаление
async function confirmDelete() {
  if (!confirm('Удалить событие навсегда? Это действие нельзя отменить.'))
    return;

  try {
    const res = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res) return;

    if (res.ok) {
      alert('Событие удалено');
      window.location.href = '/event-table';
    } else {
      const err = await res.json().catch(() => ({}));
      alert(
        'Ошибка удаления: ' +
          (err.error || err.message || 'Неизвестная ошибка'),
      );
    }
  } catch (e) {
    console.error(e);
    alert('Ошибка при удалении');
  }
}

// Рендер события
function renderEvent(event) {
  if (!event) {
    document.body.innerHTML = `<h2 style="color:red;text-align:center;">Событие не найдено</h2>`;
    return;
  }

  currentEvent = event;

  eventNumberTitle.textContent = event.number || '—';
  Object.entries(fields).forEach(([key, el]) => {
    if (key === 'isEventResolved') {
      el.textContent = event.isEventResolved ? 'Да' : 'Нет';
    } else {
      el.textContent = event[key] ?? '—';
    }
    el.contentEditable = false;
    el.style.cssText = '';
  });

  document.querySelector('.admin-controls')?.remove();
  createAdminControls();
}

// Загрузка
async function getEvent(id) {
  if (!id || isNaN(id)) {
    document.body.innerHTML = `<h2 style="color:red;">Неверный ID</h2>`;
    return;
  }

  try {
    const res = await authFetch(`${API_URL}/${id}`);
    if (!res) return;
    if (!res.ok) throw new Error('Не удалось загрузить событие');

    const json = await res.json();

    // сервер возвращает сам объект события, без success/data
    renderEvent(json);
  } catch (e) {
    console.error(e);
    document.body.innerHTML = `<h2 style="color:red;text-align:center;">${e.message}</h2>`;
  }
}

// Старт
getEvent(id);
