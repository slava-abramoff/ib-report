// scripts/form-event.js
document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(
    document.querySelectorAll("input, textarea, select"),
  );

  const btn = document.createElement("button");
  btn.textContent = "Отправить";
  btn.type = "button";
  btn.onclick = send;
  document.body.appendChild(btn);

  async function send() {
    const [
      date,
      number,
      surname,
      address,
      phoneNumber,
      mail,
      happened,
      happenedCause,
      rootCause,
      affectedComponents,
      businessImpact,
      identifiedVulnerabilities,
      start,
      detect,
      end,
      isResolvedSelect,
      eventDurationInput,
    ] = inputs.map((el) => el.value.trim());

    const isEventResolved = isResolvedSelect.value === "да";

    const payload = {
      date,
      number,
      surname,
      address,
      phoneNumber,
      mail: mail || undefined,
      happened,
      happenedCause,
      rootCause,
      affectedComponents,
      businessImpact,
      identifiedVulnerabilities,
      isEventResolved,
      eventDuration: isEventResolved
        ? eventDurationInput || undefined
        : undefined,
      start: start || undefined,
      detect: detect || undefined,
      end: end || undefined,
    };

    const req = [
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
    const miss = req.filter((k) => !payload[k]);
    if (miss.length) {
      alert("Заполни: " + miss.join(", "));
      return;
    }

    btn.disabled = true;
    btn.textContent = "...";

    try {
      const r = await fetch("/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        alert("Отправлено");
        inputs.forEach((i) => (i.value = ""));
      } else {
        alert("Ошибка: " + (await r.text()));
      }
    } catch {
      alert("Нет связи");
    } finally {
      btn.disabled = false;
      btn.textContent = "Отправить";
    }
  }
});
