document.addEventListener("DOMContentLoaded", () => {
  const isIncidentSelect = document.getElementById("isIncident");
  const sendBtn = document.getElementById("sendBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const sections = [
    document.getElementById("eventForm"),
    document.getElementById("incidentForm"),
    document.getElementById("incidentFormType"),
    document.getElementById("incidentFormAddInfo"),
    document.getElementById("incidentFormResolution"),
  ];

  let currentSectionIndex = 0;
  let isIncident = false;

  // Вспомогательная функция — fetch с токеном и обработкой 401
  async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Вы не авторизованы! Перенаправляю на вход...");
      window.location.href = "/form";
      return null;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // Автоматический логаут при истёкшем токене
    if (response.status === 401) {
      alert("Сессия истекла. Войдите заново.");
      localStorage.removeItem("token");
      window.location.href = "/form";
      return null;
    }

    return response;
  }

  const updateSections = () => {
    sections.forEach((section, i) => {
      section.classList.toggle("hidden", i !== currentSectionIndex);
    });
    prevBtn.classList.toggle("hidden", currentSectionIndex === 0);

    const isLastSection = currentSectionIndex === sections.length - 1;
    nextBtn.classList.toggle(
      "hidden",
      isLastSection || (!isIncident && currentSectionIndex >= 0),
    );
    sendBtn.classList.toggle(
      "hidden",
      !(
        (isIncident && isLastSection) ||
        (!isIncident && currentSectionIndex === 0)
      ),
    );
  };

  const resetForm = () => {
    currentSectionIndex = 0;
    updateSections();
  };

  const collectFormData = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return {};
    const data = {};
    new FormData(form).forEach((value, key) => {
      if (value === "true" || value === "да") data[key] = true;
      else if (value === "false" || value === "нет") data[key] = false;
      else data[key] = value;
    });
    return data;
  };

  // Инициализация
  updateSections();

  isIncidentSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    isIncident = value === "yes";
    resetForm();
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      currentSectionIndex < sections.length - 1 &&
      (isIncident || currentSectionIndex === 0)
    ) {
      currentSectionIndex++;
      updateSections();
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      updateSections();
    }
  });

  // ОТПРАВКА С ТОКЕНОМ
  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // 1. Отправляем событие
      const eventData = collectFormData("eventFormContent");
      const eventResponse = await authFetch("/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      });

      if (!eventResponse) return; // уже обработано в authFetch
      if (!eventResponse.ok) {
        const error = await eventResponse.json();
        throw new Error(error.error || "Ошибка при создании события");
      }

      // 2. Если это инцидент — отправляем его тоже
      if (isIncident) {
        const incidentData = {
          ...collectFormData("incidentFormContent"),
          ...collectFormData("incidentFormTypeContent"),
          ...collectFormData("incidentFormAddInfoContent"),
          ...collectFormData("incidentFormResolutionContent"),
        };

        const incidentResponse = await authFetch("/incidents", {
          method: "POST",
          body: JSON.stringify(incidentData),
        });

        if (!incidentResponse) return;
        if (!incidentResponse.ok) {
          const error = await incidentResponse.json();
          throw new Error(error.error || "Ошибка при создании инцидента");
        }
      }

      alert("Всё успешно отправлено!");

      // Сброс
      document.querySelectorAll("form").forEach((f) => f.reset());
      isIncidentSelect.value = "";
      isIncident = false;
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.message || "Произошла ошибка при отправке");
    }
  });
});
