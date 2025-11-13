document.addEventListener("DOMContentLoaded", () => {
  const isIncidentSelect = document.getElementById("isIncident");
  const sendBtn = document.getElementById("sendBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  // ВАЖНО: все секции, включая новую
  const sections = [
    document.getElementById("eventForm"),
    document.getElementById("incidentForm"),
    document.getElementById("incidentFormType"),
    document.getElementById("incidentFormAddInfo"),
    document.getElementById("incidentFormResolution"), // Добавлена!
  ];

  let currentSectionIndex = 0;
  let isIncident = false;

  const updateSections = () => {
    sections.forEach((section, i) => {
      section.classList.toggle("hidden", i !== currentSectionIndex);
    });

    prevBtn.classList.toggle("hidden", currentSectionIndex === 0);
    
    // Кнопка "Далее" скрывается, если:
    // - это последняя секция
    // - или не инцидент и мы уже на 1-й секции
    const isLastSection = currentSectionIndex === sections.length - 1;
    nextBtn.classList.toggle("hidden", isLastSection || (!isIncident && currentSectionIndex >= 0));

    // Кнопка "Отправить" видна только на последней секции и только если инцидент
    sendBtn.classList.toggle("hidden", !(isIncident && isLastSection || !isIncident && currentSectionIndex === 0));
  };

  const resetForm = () => {
    currentSectionIndex = 0;
    updateSections();
  };

  // Сбор данных из формы по ID формы (не секции!)
  const collectFormData = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return {};
    const data = {};
    new FormData(form).forEach((value, key) => {
      if (value === "true") data[key] = true;
      else if (value === "false") data[key] = false;
      else if (value === "да") data[key] = true;
      else if (value === "нет") data[key] = false;
      else data[key] = value;
    });
    return data;
  };

  // Инициализация
  updateSections();

  // Выбор: инцидент или нет
  isIncidentSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    isIncident = value === "yes";
    resetForm();
  });

  // Навигация
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSectionIndex < sections.length - 1 && (isIncident || currentSectionIndex === 0)) {
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

  // Отправка
  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const eventData = collectFormData("eventFormContent");

    try {
      const eventResponse = await fetch("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!eventResponse.ok) throw new Error("Ошибка при отправке события");

      if (isIncident) {
        const incidentData = {
          ...collectFormData("incidentFormContent"),
          ...collectFormData("incidentFormTypeContent"),
          ...collectFormData("incidentFormAddInfoContent"),
          ...collectFormData("incidentFormResolutionContent"),
        };

        const incidentResponse = await fetch("/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(incidentData),
        });

        if (!incidentResponse.ok) throw new Error("Ошибка при отправке инцидента");
      }

      alert("Данные успешно отправлены!");
      // Сброс формы
      document.querySelectorAll("form").forEach(f => f.reset());
      isIncidentSelect.value = "";
      isIncident = false;
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  });
});