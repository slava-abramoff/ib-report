import PDFDocument from "pdfkit";
import fs from "fs";
import { Event } from "../models/event.model";
import { Incident } from "../models/incident.model";

export function generateIncidentsPDF(incident: Incident, outputPath: string) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.font("/usr/share/fonts/noto/NotoSans-Regular.ttf");
  const emptyString = "____________________________";

  // === Заголовок ===
  doc.fontSize(16).text("Отчет об инциденте информационной безопасности", {
    align: "center",
  });
  doc.moveDown(1.5);

  // === Основные данные ===
  doc
    .fontSize(12)
    .text(`Дата инцидента: ${incident.incidentDate ?? emptyString}`);
  doc.text(`Номер инцидента: ${incident.incidentNumber ?? emptyString}`);
  doc.moveDown(1);

  // === Сотрудник группы эксплуатации ===
  doc
    .fontSize(12)
    .text("Сотрудник группы обеспечения эксплуатации", { underline: true });
  doc.moveDown(0.5);
  doc.text(`Фамилия: ${incident.operationSurname ?? emptyString}`);
  doc.text(`Адрес: ${incident.operationAddress ?? emptyString}`);
  doc.text(`Телефон: ${incident.operationPhone ?? emptyString}`);
  doc.text(`Электронная почта: ${incident.operationEmail ?? emptyString}`);
  doc.moveDown(1);

  // === Сотрудник ГРИИБ ===
  doc.fontSize(12).text("Сотрудник ГРИИБ", { underline: true });
  doc.moveDown(0.5);
  doc.text(`Фамилия: ${incident.griibSurname ?? emptyString}`);
  doc.text(`Адрес: ${incident.griibAddress ?? emptyString}`);
  doc.text(`Телефон: ${incident.griibPhone ?? emptyString}`);
  doc.text(`Электронная почта: ${incident.griibEmail ?? emptyString}`);
  doc.moveDown(1);

  // === Описание инцидента ===
  doc.fontSize(12).text("Описание инцидента", { underline: true });
  doc.moveDown(0.5);
  doc.text(`Что произошло: ${incident.whatHappened ?? emptyString}`);
  doc.text(`Как произошло: ${incident.howHappened ?? emptyString}`);
  doc.text(`Почему произошло: ${incident.whyHappened ?? emptyString}`);
  doc.text(
    `Пораженные компоненты: ${incident.affectedComponents ?? emptyString}`,
  );
  doc.text(
    `Негативное воздействие на бизнес: ${incident.businessImpact ?? emptyString}`,
  );
  doc.text(
    `Идентифицированные уязвимости: ${incident.identifiedVulnerabilities ?? emptyString}`,
  );
  doc.moveDown(1);

  // === Временные поля ===
  doc.text("Временные данные", { underline: true });
  doc.moveDown(0.5);
  doc.text(
    `Дата и время наступления: ${incident.startDateTime ?? emptyString}`,
  );
  doc.text(
    `Дата и время обнаружения: ${incident.detectDateTime ?? emptyString}`,
  );
  doc.text(`Дата и время сообщения: ${incident.reportDateTime ?? emptyString}`);
  doc.moveDown(1);

  // === Статус ===
  doc.text("Статус инцидента", { underline: true });
  doc.moveDown(0.3);
  doc.text(
    incident.isIncidentResolved
      ? "Закончился: Да [  ]     Нет [ X ]"
      : "Закончился: Да [ X ]     Нет [  ]",
  );
  doc.moveDown(1);

  // === Тип инцидента ===
  doc.text(`Тип инцидента: ${incident.incidentType ?? emptyString}`);
  doc.moveDown(1);

  // === Дополнительная информация ===
  doc.text("Дополнительная информация", { underline: true });
  doc.moveDown(0.3);
  doc.text(`Информация: ${incident.information ?? emptyString}`);
  doc.text(`Аппаратные средства: ${incident.hardware ?? emptyString}`);
  doc.text(`Программное обеспечение: ${incident.software ?? emptyString}`);
  doc.text(`Средства связи: ${incident.communicationMeans ?? emptyString}`);
  doc.text(`Документация: ${incident.documentation ?? emptyString}`);
  doc.moveDown(1);

  // === Негативное воздействие ===
  doc.text("Негативное воздействие", { underline: true });
  doc.moveDown(0.3);
  doc.text(`Тип: ${incident.negativeImpact ?? emptyString}`);
  doc.moveDown(1);

  doc
    .fontSize(10)
    .text(
      "<1> Номера инцидентов назначаются руководителем ГРИИБ организации и привязываются к номеру(ам) соответствующих событий.",
      { align: "left", lineGap: 3 },
    );

  doc.end();
}

export function generateEventsPDF(event: Event, outputPath: string) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  doc.font("/usr/share/fonts/noto/NotoSans-Regular.ttf");
  const emptyString = "____________________________";

  // === Заголовок ===
  doc.fontSize(16).text("Отчет об инциденте информационной безопасности", {
    align: "center",
  });
  doc.moveDown(1.5);

  // === Дата и номер ===
  doc.fontSize(12).text(`Дата инцидента: ${event.date}`);
  doc.text(
    `Номер инцидента: ${event.number ?? "________"}    Соответствующие идентификационные номера событий (если требуется):`,
  );
  doc.moveDown(1);

  // === Сотрудники эксплуатации ===
  doc
    .fontSize(12)
    .text("Информация о сотруднике группы обеспечения эксплуатации", {
      underline: true,
    });
  doc.moveDown(0.5);
  doc.text(`Фамилия ${"Иванов"}    Адрес ${event.address ?? emptyString}`);
  doc.text(
    `Телефон ${event.phoneNumber ?? emptyString}    Электронная почта ${event.mail ?? emptyString}`,
  );
  doc.moveDown(1);

  // === Дополнительное описание ===
  doc.text("Дополнительное описание инцидента:", { underline: true });
  doc.moveDown(0.3);
  doc.text(`Что произошло ${event.happened ?? emptyString}`);
  doc.text(`Как произошло ${event.happenedCause ?? emptyString}`);
  doc.text(`Почему произошло ${event.rootCause ?? emptyString}`);
  doc.text(`Пораженные компоненты ${event.affectedComponents ?? emptyString}`);
  doc.text(
    `Негативное воздействие на бизнес ${event.businessImpact ?? emptyString}`,
  );
  doc.text(
    `Любые идентифицированные уязвимости ${event.identifiedVulnerabilities ?? emptyString}`,
  );
  doc.moveDown(1);

  // === Подробности ===
  doc.text("Подробности об инциденте ИБ", { underline: true });
  doc.moveDown(0.5);
  doc.text(
    `Дата и время возникновения инцидента ${event.start ?? emptyString}`,
  );
  doc.text(`Дата и время обнаружения инцидента ${event.detect ?? emptyString}`);
  doc.text(`Дата и время сообщения об инциденте ${event.end ?? emptyString}`);
  doc.moveDown(0.5);

  // === Отметки и флаги ===
  doc.text("Продолжается ли инцидент? (отметить в квадрате)");
  doc.text(
    event.isEventResolved ? "Да [  ]     Нет [ X ]" : "Да [ X ]     Нет [  ]",
  );
  doc.moveDown(0.5);
  doc.text(
    "Если 'Да', то уточнить длительность инцидента в днях/часах/минутах. Если 'Нет', то уточнить, как долго он уже длится.",
  );
  doc.moveDown(1);

  doc
    .fontSize(10)
    .text(
      "<1> Номера инцидентов назначаются руководителем ГРИИБ организации и привязываются к номеру(ам) соответствующих событий.",
      { align: "left", lineGap: 3 },
    );

  doc.end();
}
