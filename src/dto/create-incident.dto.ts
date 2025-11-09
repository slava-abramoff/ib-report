import { z } from "zod";

const incidentTypeEnum = [
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

const negativeImpactEnum = [
  "нарушение конфиденциальности",
  "нарушение целостности",
  "нарушение доступности",
  "нарушение неотказуемости",
  "уничтожение",
  "значимость указатели",
] as const;

export const createIncidentSchema = z.object({
  incidentDate: z.string().optional(),
  incidentNumber: z.string().optional(),
  operationSurname: z.string().optional(),
  operationAddress: z.string().optional(),
  operationPhone: z.string().optional(),
  operationEmail: z.string().optional(),

  // Сотрудник ГРИИБ
  griibSurname: z.string().optional(),
  griibAddress: z.string().optional(),
  griibPhone: z.string().optional(),
  griibEmail: z.string().optional(),

  // Описание инцидента
  whatHappened: z.string().optional(),
  howHappened: z.string().optional(),
  whyHappened: z.string().optional(),
  affectedComponents: z.string().optional(),
  businessImpact: z.string().optional(),
  identifiedVulnerabilities: z.string().optional(),

  // Временные поля
  startDateTime: z.string().optional(),
  detectDateTime: z.string().optional(),
  reportDateTime: z.string().optional(),

  // Статус
  isIncidentResolved: z.boolean().optional(),

  // Тип инцидента
  incidentType: z.enum(incidentTypeEnum).optional(),

  // Дополнительная информация
  information: z.string().optional(),
  hardware: z.string().optional(),
  software: z.string().optional(),
  communicationMeans: z.string().optional(),
  documentation: z.string().optional(),

  // Негативное воздействие
  negativeImpact: z.enum(negativeImpactEnum).optional(),
});

export type CreateIncidentDTO = z.infer<typeof createIncidentSchema>;
