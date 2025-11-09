document.addEventListener("DOMContentLoaded", () => {
  const isIncidentSelect = document.getElementById("isIncident");
  const incidentFormContainer = document.getElementById(
    "incidentFormContainer",
  );
  const sendBtn = document.getElementById("sendBtn");

  // Показ/скрытие формы инцидента
  isIncidentSelect.addEventListener("change", () => {
    if (isIncidentSelect.value === "yes") {
      incidentFormContainer.classList.remove("hidden");
    } else {
      incidentFormContainer.classList.add("hidden");
    }
  });

  sendBtn.addEventListener("click", async () => {
    // Собираем данные события
    const eventForm = document.getElementById("eventForm");
    const eventData = Object.fromEntries(new FormData(eventForm).entries());

    // Конвертируем isEventResolved в boolean
    if ("isEventResolved" in eventData) {
      eventData.isEventResolved = eventData.isEventResolved === "да";
    }

    // Проверка обязательных полей события
    const requiredEventFields = [
      "date",
      "number",
      "surname",
      "address",
      "phoneNumber",
      "happened",
      "happenedCause",
      "rootCause",
      "affectedComponents",
      "businessImpact",
      "identifiedVulnerabilities",
    ];
    const missingEventFields = requiredEventFields.filter(
      (f) => !eventData[f] || eventData[f].trim() === "",
    );
    if (missingEventFields.length) {
      return alert(
        "Заполните обязательные поля события: " + missingEventFields.join(", "),
      );
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Отправка...";

    try {
      // Отправляем событие
      const eventResp = await fetch("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!eventResp.ok) throw new Error("Ошибка при сохранении события");

      const eventResJson = await eventResp.json();
      const eventId = eventResJson.id;

      // Если выбрано "Да" — отправляем инцидент
      if (isIncidentSelect.value === "yes") {
        const incidentForm = document.getElementById("incidentForm");
        const incidentData = Object.fromEntries(
          new FormData(incidentForm).entries(),
        );

        // Конвертируем isIncidentResolved в boolean
        if ("isIncidentResolved" in incidentData) {
          incidentData.isIncidentResolved =
            incidentData.isIncidentResolved === "true";
        }

        // Привязка к событию
        incidentData.eventId = eventId;

        // Отправляем инцидент
        const incidentResp = await fetch("/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(incidentData),
        });

        if (!incidentResp.ok)
          throw new Error("Ошибка при сохранении инцидента");

        alert("✅ Событие и инцидент успешно отправлены!");
      } else {
        alert("✅ Событие успешно отправлено!");
      }

      // Сброс форм
      eventForm.reset();
      document.getElementById("incidentForm").reset();
      incidentFormContainer.classList.add("hidden");
      isIncidentSelect.value = "";
    } catch (err) {
      console.error(err);
      alert(err.message || "Ошибка при отправке данных");
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Отправить";
    }
  });
});
