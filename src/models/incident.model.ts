import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { InferModel, sql } from "drizzle-orm";

// ENUM для типа инцидента
export const incidentTypeEnum = [
  "хищение",
  "хакерство",
  "мошенничество",
  "неправильное использование ресурсов",
  "саботаж",
  "иное намеренное",
  "отказ аппаратуры",
  "отказ ПО",
  "другие природные события",
  "отказ системы связи",
  "потеря значимых сервисов",
  "пожар",
  "недостаточное кадровое обеспечение",
  "другие случайные случаи",
  "операционная ошибка",
  "ошибка пользователя",
  "ошибка в эксплуатации аппаратных средств",
  "ошибка проектирования",
  "ошибка в эксплуатации",
  "другие случаи ошибок",
] as const;

// ENUM для негативного воздействия
export const negativeImpactEnum = [
  "нарушение конфиденциальности",
  "нарушение целостности",
  "нарушение доступности",
  "нарушение неотказуемости",
  "уничтожение",
  "значимость указатели",
] as const;

// ENUM для типа нарушителя
export const violatorTypeEnum = [
  "PE Лицо", // Лицо
  "OI Организация/учреждение", // Организация/учреждение
  "GR Организованная группа", // Организованная группа
  "AC Случайность", // Случайность
  "NP Отсутствие нарушителя", // Отсутствие нарушителя
] as const;

// ENUM для мотивации нарушителя
export const motivationEnum = [
  "CG Криминальная/финансовая выгода", // Криминальная/финансовая выгода
  "PH Развлечение/хакерство", // Развлечение/хакерство
  "PT Политика/терроризм", // Политика/терроризм
  "RE Месть", // Месть
  "OM Другие мотивы", // Другие мотивы
] as const;

export const incidents = sqliteTable("incident", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Основные данные
  incidentDate: text("incident_date"),
  incidentNumber: text("incident_number"),

  // Сотрудник группы обеспечения эксплуатации
  operationSurname: text("operation_surname"),
  operationAddress: text("operation_address"),
  operationPhone: text("operation_phone"),
  operationEmail: text("operation_email"),

  // Сотрудник ГРИИБ
  griibSurname: text("griib_surname"),
  griibAddress: text("griib_address"),
  griibPhone: text("griib_phone"),
  griibEmail: text("griib_email"),

  // Описание инцидента
  whatHappened: text("what_happened"),
  howHappened: text("how_happened"),
  whyHappened: text("why_happened"),
  affectedComponents: text("affected_components"),
  businessImpact: text("business_impact"),
  identifiedVulnerabilities: text("identified_vulnerabilities"),

  // Временные метки
  startDateTime: text("start_datetime"),
  detectDateTime: text("detect_datetime"),
  reportDateTime: text("report_datetime"),

  // Статус
  isIncidentResolved: integer("is_incident_resolved", { mode: "boolean" }),

  // Тип инцидента
  incidentType: text("incident_type", {
    enum: incidentTypeEnum,
  }),

  // Информация
  information: text("information"),
  hardware: text("hardware"),
  software: text("software"),
  communicationMeans: text("communication_means"),
  documentation: text("documentation"),

  // Негативное воздействие
  negativeImpact: text("negative_impact", {
    enum: negativeImpactEnum,
  }),

  // ───────────────────────────────────────────────
  // СТРАНИЦА 4 — Разрешение инцидента
  // ───────────────────────────────────────────────

  // Подзаголовок 1 — Разрешение инцидента
  investigationStartDate: text("investigation_start_date"),
  investigators: text("investigators"),
  incidentEndDate: text("incident_end_date"),
  impactEndDate: text("impact_end_date"),
  investigationEndDate: text("investigation_end_date"),
  investigationReportLocation: text("investigation_report_location"),

  // Подзаголовок 2 — Причастные лица / нарушители
  violatorType: text("violator_type", {
    enum: violatorTypeEnum,
  }),
  violatorDescription: text("violator_description"),

  // Подзаголовок 3 — Мотивация
  violatorMotivation: text("violator_motivation", {
    enum: motivationEnum,
  }),

  // Подзаголовок 4–6 — Действия по разрешению
  resolutionActions: text("resolution_actions"),
  plannedResolutionActions: text("planned_resolution_actions"),
  otherActions: text("other_actions"),

  // Служебные метки
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Incident = InferModel<typeof incidents>;
export type NewIncident = InferModel<typeof incidents, "insert">;
