// /scripts/incident-details.js
const API_URL = '/api/incidents';

// ──────────────────────────────────────────────────────────────
// Надёжное получение ID инцидента
// ──────────────────────────────────────────────────────────────
let id = null;
const pathParts = window.location.pathname.split('/').filter(Boolean);

if (pathParts.length >= 2 && !isNaN(pathParts[pathParts.length - 1])) {
  id = pathParts[pathParts.length - 1];
} else {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id');
  if (paramId && !isNaN(paramId)) id = paramId;
}

if (!id) {
  document.body.innerHTML = `
    <h2 style="color:#dc3545; text-align:center; margin-top:80px;">
      Ошибка: не указан или некорректен ID инцидента
    </h2>`;
  console.error('Incident ID not found or invalid');
  throw new Error('No valid incident ID');
}

console.log(
  '%c[Incident Details] Загружаем инцидент ID:',
  'color:#28a745; font-weight:bold',
  id,
);

// ──────────────────────────────────────────────────────────────
// DOM-элементы
// ──────────────────────────────────────────────────────────────
const incidentNumberTitle = document.getElementById('incident-number');
const fields = {
  id: document.getElementById('id'),
  incidentNumber: document.getElementById('incidentNumber'),
  incidentDate: document.getElementById('incidentDate'),

  operationSurname: document.getElementById('operationSurname'),
  operationAddress: document.getElementById('operationAddress'),
  operationPhone: document.getElementById('operationPhone'),
  operationEmail: document.getElementById('operationEmail'),

  griibSurname: document.getElementById('griibSurname'),
  griibAddress: document.getElementById('griibAddress'),
  griibPhone: document.getElementById('griibPhone'),
  griibEmail: document.getElementById('griibEmail'),

  whatHappened: document.getElementById('whatHappened'),
  howHappened: document.getElementById('howHappened'),
  whyHappened: document.getElementById('whyHappened'),
  affectedComponents: document.getElementById('affectedComponents'),
  businessImpact: document.getElementById('businessImpact'),
  identifiedVulnerabilities: document.getElementById(
    'identifiedVulnerabilities',
  ),

  startDateTime: document.getElementById('startDateTime'),
  detectDateTime: document.getElementById('detectDateTime'),
  reportDateTime: document.getElementById('reportDateTime'),

  incidentType: document.getElementById('incidentType'),
  information: document.getElementById('information'),
  hardware: document.getElementById('hardware'),
  software: document.getElementById('software'),
  communicationMeans: document.getElementById('communicationMeans'),
  documentation: document.getElementById('documentation'),
  negativeImpact: document.getElementById('negativeImpact'),

  isIncidentResolved: document.getElementById('isIncidentResolved'),
  investigationStartDate: document.getElementById('investigationStartDate'),
  investigators: document.getElementById('investigators'),
  incidentEndDate: document.getElementById('incidentEndDate'),
  impactEndDate: document.getElementById('impactEndDate'),
  investigationEndDate: document.getElementById('investigationEndDate'),
  investigationReportLocation: document.getElementById(
    'investigationReportLocation',
  ),

  violatorType: document.getElementById('violatorType'),
  violatorDescription: document.getElementById('violatorDescription'),
  violatorMotivation: document.getElementById('violatorMotivation'),

  resolutionActions: document.getElementById('resolutionActions'),
  plannedResolutionActions: document.getElementById('plannedResolutionActions'),
  otherActions: document.getElementById('otherActions'),
};

// Кнопки и состояние
let editBtn, saveBtn, cancelBtn, deleteBtn;
let currentIncident = null;
let isEditMode = false;

// ──────────────────────────────────────────────────────────────
// ENUM-ы (точно как в Drizzle-модели)
// ──────────────────────────────────────────────────────────────
const ENUMS = {
  incidentType: [
    'хищение',
    'хакерство',
    'мошенничество',
    'неправильное использование ресурсов',
    'саботаж',
    'иное намеренное',
    'отказ аппаратуры',
    'отказ ПО',
    'другие природные события',
    'отказ системы связи',
    'потеря значимых сервисов',
    'пожар',
    'недостаточное кадровое обеспечение',
    'другие случайные случаи',
    'операционная ошибка',
    'ошибка пользователя',
    'ошибка в эксплуатации аппаратных средств',
    'ошибка проектирования',
    'ошибка в эксплуатации',
    'другие случаи ошибок',
  ],
  negativeImpact: [
    'нарушение конфиденциальности',
    'нарушение целостности',
    'нарушение доступности',
    'нарушение неотказуемости',
    'уничтожение',
    'значимость указатели',
  ],
  violatorType: [
    'PE Лицо',
    'OI Организация/учреждение',
    'GR Организованная группа',
    'AC Случайность',
    'NP Отсутствие нарушителя',
  ],
  violatorMotivation: [
    'CG Криминальная/финансовая выгода',
    'PH Развлечение/хакерство',
    'PT Политика/терроризм',
    'RE Месть',
    'OM Другие мотивы',
  ],
};

// ──────────────────────────────────────────────────────────────
// Универсальный authFetch
// ──────────────────────────────────────────────────────────────
async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Вы не авторизованы! Перенаправляю на вход...');
    window.location.href = '/form';
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
    window.location.href = '/form';
    return null;
  }
  return response;
}

// ──────────────────────────────────────────────────────────────
// Админ-панель
// ──────────────────────────────────────────────────────────────
function createAdminControls() {
  if (localStorage.getItem('role') !== 'admin') return;

  const controls = document.createElement('div');
  controls.className = 'admin-controls';
  controls.style.cssText = `margin:20px 0; padding:15px; background:#f8f9fa; border-radius:8px; display:flex; gap:12px; flex-wrap:wrap; font-size:15px;`;

  editBtn = btn('Редактировать', enterEditMode, '#007bff');
  deleteBtn = btn('Удалить инцидент', confirmDelete, '#dc3545');

  controls.append(editBtn, deleteBtn);
  document.querySelector('h1').after(controls);
}

function btn(text, click, bg) {
  const b = document.createElement('button');
  b.textContent = text;
  b.type = 'button';
  b.onclick = click;
  b.style.cssText = `padding:10px 18px; border:none; border-radius:6px; cursor:pointer; color:white; background:${bg}; font-weight:500; transition:opacity .2s;`;
  b.onmouseover = () => (b.style.opacity = '0.9');
  b.onmouseout = () => (b.style.opacity = '1');
  return b;
}

// ──────────────────────────────────────────────────────────────
// Режим редактирования
// ──────────────────────────────────────────────────────────────
function enterEditMode() {
  isEditMode = true;
  Object.keys(fields).forEach(
    (k) => (fields[k].dataset.original = fields[k].innerHTML),
  );
  makeFieldsEditable();

  const controls = document.querySelector('.admin-controls');
  controls.innerHTML = '';
  saveBtn = btn('Сохранить', saveChanges, '#28a745');
  cancelBtn = btn('Отмена', exitEditMode, '#6c757d');
  controls.append(saveBtn, cancelBtn);
}

function exitEditMode() {
  isEditMode = false;
  Object.keys(fields).forEach((k) => {
    const el = fields[k];
    el.innerHTML = el.dataset.original || el.innerHTML;
    el.contentEditable = false;
    el.style.cssText = '';
  });

  const controls = document.querySelector('.admin-controls');
  controls.innerHTML = '';
  controls.append(editBtn, deleteBtn);
}

function makeFieldsEditable() {
  Object.keys(fields).forEach((key) => {
    const el = fields[key];
    if (key === 'id') return;

    if (
      [
        'incidentType',
        'negativeImpact',
        'violatorType',
        'violatorMotivation',
      ].includes(key)
    ) {
      const current = currentIncident[key] || '';
      const options = ENUMS[key]
        .map(
          (val) =>
            `<option value="${val}" ${val === current ? 'selected' : ''}>${val}</option>`,
        )
        .join('');
      el.innerHTML = `<select style="width:100%; padding:6px; border:1px solid #007bff; border-radius:4px;">${options}</select>`;
      return;
    }

    if (key === 'isIncidentResolved') {
      const select = document.createElement('select');
      select.innerHTML = `<option value="false">Нет</option><option value="true">Да</option>`;
      select.value = currentIncident.isIncidentResolved ? 'true' : 'false';
      select.style.cssText =
        'width:100%; padding:6px; border:1px solid #007bff; border-radius:4px;';
      el.textContent = '';
      el.appendChild(select);
      return;
    }

    el.contentEditable = true;
    el.style.cssText =
      'background:#fff; padding:4px 6px; border:1px solid #007bff; border-radius:4px;';
  });
}

// ──────────────────────────────────────────────────────────────
// Сбор данных для PUT
// ──────────────────────────────────────────────────────────────
function collectFormData() {
  const data = {};
  const mapping = {
    incidentNumber: 'incident_number',
    incidentDate: 'incident_date',
    operationSurname: 'operation_surname',
    operationAddress: 'operation_address',
    operationPhone: 'operation_phone',
    operationEmail: 'operation_email',
    griibSurname: 'griib_surname',
    griibAddress: 'griib_address',
    griibPhone: 'griib_phone',
    griibEmail: 'griib_email',
    whatHappened: 'what_happened',
    howHappened: 'how_happened',
    whyHappened: 'why_happened',
    affectedComponents: 'affected_components',
    businessImpact: 'business_impact',
    identifiedVulnerabilities: 'identified_vulnerabilities',
    startDateTime: 'start_datetime',
    detectDateTime: 'detect_datetime',
    reportDateTime: 'report_datetime',
    incidentType: 'incident_type',
    information: 'information',
    hardware: 'hardware',
    software: 'software',
    communicationMeans: 'communication_means',
    documentation: 'documentation',
    negativeImpact: 'negative_impact',
    isIncidentResolved: 'is_incident_resolved',
    investigationStartDate: 'investigation_start_date',
    investigators: 'investigators',
    incidentEndDate: 'incident_end_date',
    impactEndDate: 'impact_end_date',
    investigationEndDate: 'investigation_end_date',
    investigationReportLocation: 'investigation_report_location',
    violatorType: 'violator_type',
    violatorDescription: 'violator_description',
    violatorMotivation: 'violator_motivation',
    resolutionActions: 'resolution_actions',
    plannedResolutionActions: 'planned_resolution_actions',
    otherActions: 'other_actions',
  };

  Object.entries(mapping).forEach(([jsKey, dbKey]) => {
    const el = fields[jsKey];
    if (!el) return;

    let newValue;
    if (jsKey === 'isIncidentResolved') {
      const select = el.querySelector('select');
      newValue = select ? select.value === 'true' : currentIncident[jsKey];
    } else if (
      [
        'incidentType',
        'negativeImpact',
        'violatorType',
        'violatorMotivation',
      ].includes(jsKey)
    ) {
      const select = el.querySelector('select');
      newValue = select ? select.value : currentIncident[jsKey];
    } else if (el.contentEditable === 'true') {
      const trimmed = el.textContent.trim();
      const old =
        currentIncident[jsKey] != null
          ? String(currentIncident[jsKey]).trim()
          : '';
      if (trimmed !== old) newValue = trimmed === '' ? null : trimmed;
    }

    if (newValue !== undefined) data[dbKey] = newValue;
  });

  return data;
}

// ──────────────────────────────────────────────────────────────
// Сохранение и удаление
// ──────────────────────────────────────────────────────────────
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
      alert('Инцидент успешно обновлён!');
      const fresh = await (await authFetch(`${API_URL}/${id}`)).json();
      currentIncident = fresh.data;
      renderIncident(currentIncident);
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

async function confirmDelete() {
  if (!confirm('Удалить инцидент навсегда? Это действие нельзя отменить.'))
    return;
  try {
    const res = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res || !res.ok) throw new Error('Ошибка удаления');
    alert('Инцидент удалён');
    window.location.href = '/incident-table';
  } catch (e) {
    console.error(e);
    alert('Ошибка при удалении');
  }
}

// ──────────────────────────────────────────────────────────────
// Рендер
// ──────────────────────────────────────────────────────────────
function renderIncident(incident) {
  if (!incident) {
    document.body.innerHTML = `<h2 style="color:red;text-align:center;">Инцидент не найден</h2>`;
    return;
  }
  currentIncident = incident;
  incidentNumberTitle.textContent = incident.incidentNumber || '—';

  Object.entries(fields).forEach(([key, el]) => {
    if (key === 'isIncidentResolved') {
      el.textContent = incident[key] ? 'Да' : 'Нет';
    } else {
      el.textContent = incident[key] ?? '—';
    }
    el.contentEditable = false;
    el.style.cssText = '';
  });

  document.querySelector('.admin-controls')?.remove();
  createAdminControls();
}

// ──────────────────────────────────────────────────────────────
// Загрузка инцидента
// ──────────────────────────────────────────────────────────────
async function getIncident(id) {
  try {
    const res = await authFetch(`${API_URL}/${id}`);
    if (!res || !res.ok) throw new Error('Не удалось загрузить инцидент');
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('Инцидент не найден');
    renderIncident(json.data);
  } catch (e) {
    console.error(e);
    document.body.innerHTML = `<h2 style="color:red;text-align:center;">${e.message}</h2>`;
  }
}

// ──────────────────────────────────────────────────────────────
// ЗАПУСК
// ──────────────────────────────────────────────────────────────
getIncident(id);
