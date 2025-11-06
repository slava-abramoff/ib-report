import PDFDocument from "pdfkit";
import fs from "fs";
import { Event } from "../models/event.model";

export function generateEventsPDF(event: Event, outputPath: string) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Основной шрифт (Noto Sans поддерживает кириллицу)
  doc.font("/usr/share/fonts/noto/NotoSans-Regular.ttf");
  const emptyString = "____________________________"

  // === Заголовок ===
  doc.fontSize(16).text("Отчет об инциденте информационной безопасности", {
    align: "center",
  });
  doc.moveDown(1.5);

  // === Дата и номер ===
  doc.fontSize(12).text(`Дата инцидента: ${event.dateEvent}`);
  doc.text(
    `Номер инцидента: ${event.numberEvent ?? "________"}    Соответствующие идентификационные номера событий (если требуется):`
  );
  doc.moveDown(1);

  // === Сотрудники эксплуатации ===
  doc.fontSize(12).text("Информация о сотруднике группы обеспечения эксплуатации", {
    underline: true,
  });
  doc.moveDown(0.5);
  doc.text(`Фамилия ${"Иванов"}    Адрес ${event.address ?? emptyString}`);
  doc.text(`Телефон ${event.phoneNumber ?? emptyString}    Электронная почта ${event.mail ?? emptyString}`);
  doc.moveDown(1);

  // === Описание ===
  doc.text(`Описание инцидента ИБ:`, { underline: true });
  doc.moveDown(0.5);
  doc.text(`Описание инцидента: ${event.incidentDescription || "-"}`);
  doc.text(`Причина инцидента: ${event.incidentCause || "-"}`);
  doc.moveDown(1);

  // === Дополнительное описание ===
  doc.text("Дополнительное описание инцидента:", { underline: true });
  doc.moveDown(0.3);
  doc.text(`Что произошло ${emptyString}`);
  doc.text(`Как произошло ${emptyString}`);
  doc.text(`Почему произошло ${emptyString}`);
  doc.text(`Пораженные компоненты ${event.affectedComponents ?? emptyString}`);
  doc.text(`Негативное воздействие на бизнес ${event.businessImpact ?? emptyString}`);
  doc.text(`Любые идентифицированные уязвимости ${event.identifiedVulnerabilities ?? emptyString}`);
  doc.moveDown(1);

  // === Подробности ===
  doc.text("Подробности об инциденте ИБ", { underline: true });
  doc.moveDown(0.5);
  doc.text("Дата и время возникновения инцидента ________________________");
  doc.text("Дата и время обнаружения инцидента __________________________");
  doc.text("Дата и время сообщения об инциденте _________________________");
  doc.moveDown(0.5);

  // === Отметки и флаги ===
  doc.text("Продолжается ли инцидент? (отметить в квадрате)");
  doc.text("Да [  ]     Нет [  ]");
  doc.moveDown(0.5);
  doc.text(
    "Если 'Да', то уточнить длительность инцидента в днях/часах/минутах. Если 'Нет', то уточнить, как долго он уже длится."
  );
  doc.moveDown(1);

  // === Статус ===
  doc.text(`Статус: ${event.isEventResolved ? "Решено" : "Не решено"}`);
  doc.moveDown(1);

  doc.fontSize(10).text(
    "<1> Номера инцидентов назначаются руководителем ГРИИБ организации и привязываются к номеру(ам) соответствующих событий.",
    { align: "left", lineGap: 3 }
  );

  doc.end();
}
