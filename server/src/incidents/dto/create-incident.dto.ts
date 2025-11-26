import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IncidentType,
  NegativeImpact,
  ViolatorMotivation,
  ViolatorType,
} from '@prisma/client';

// Enum-типизация
// export enum IncidentType {
//   хищение = 'хищение',
//   хакерство = 'хакерство',
//   мошенничество = 'мошенничество',
//   неправильное_использование_ресурсов = 'неправильное_использование_ресурсов',
//   саботаж = 'саботаж',
//   иное_намеренное = 'иное_намеренное',
//   отказ_аппаратуры = 'отказ_аппаратуры',
//   отказ_ПО = 'отказ_ПО',
//   другие_природные_события = 'другие_природные_события',
//   отказ_системы_связи = 'отказ_системы_связи',
//   потеря_значимых_сервисов = 'потеря_значимых_сервисов',
//   пожар = 'пожар',
//   недостаточное_кадровое_обеспечение = 'недостаточное_кадровое_обеспечение',
//   другие_случайные_случаи = 'другие_случайные_случаи',
//   операционная_ошибка = 'операционная_ошибка',
//   ошибка_пользователя = 'ошибка_пользователя',
//   ошибка_в_эксплуатации_аппаратных_средств = 'ошибка_в_эксплуатации_аппаратных_средств',
//   ошибка_проектирования = 'ошибка_проектирования',
//   ошибка_в_эксплуатации = 'ошибка_в_эксплуатации',
//   другие_случаи_ошибок = 'другие_случаи_ошибок',
// }

// export enum NegativeImpact {
//   нарушение_конфиденциальности = 'нарушение_конфиденциальности',
//   нарушение_целостности = 'нарушение_целостности',
//   нарушение_доступности = 'нарушение_доступности',
//   нарушение_неотказуемости = 'нарушение_неотказуемости',
//   уничтожение = 'уничтожение',
//   значимость_указатели = 'значимость_указатели',
// }

// export enum ViolatorType {
//   PE = 'PE Лицо',
//   OI = 'OI Организация/учреждение',
//   GR = 'GR Организованная группа',
//   AC = 'AC Случайность',
//   NP = 'NP Отсутствие нарушителя',
// }

// export enum ViolatorMotivation {
//   CG = 'CG Криминальная/финансовая выгода',
//   PH = 'PH Развлечение/хакерство',
//   PT = 'PT Политика/терроризм',
//   RE = 'RE Месть',
//   OM = 'OM Другие мотивы',
// }

// DTO для создания инцидента
export class CreateIncidentDto {
  @IsOptional()
  incidentDate?: string;

  @IsOptional()
  @IsString()
  incidentNumber?: string;

  @IsOptional()
  @IsString()
  operationSurname?: string;

  @IsOptional()
  @IsString()
  operationAddress?: string;

  @IsOptional()
  @IsString()
  operationPhone?: string;

  @IsOptional()
  @IsString()
  operationEmail?: string;

  @IsOptional()
  @IsString()
  griibSurname?: string;

  @IsOptional()
  @IsString()
  griibAddress?: string;

  @IsOptional()
  @IsString()
  griibPhone?: string;

  @IsOptional()
  @IsString()
  griibEmail?: string;

  @IsOptional()
  @IsString()
  whatHappened?: string;

  @IsOptional()
  @IsString()
  howHappened?: string;

  @IsOptional()
  @IsString()
  whyHappened?: string;

  @IsOptional()
  @IsString()
  affectedComponents?: string;

  @IsOptional()
  @IsString()
  businessImpact?: string;

  @IsOptional()
  @IsString()
  identifiedVulnerabilities?: string;

  @IsOptional()
  startDateTime?: string;

  @IsOptional()
  detectDateTime?: string;

  @IsOptional()
  reportDateTime?: string;

  @IsOptional()
  @IsBoolean()
  isIncidentResolved?: boolean;

  @IsOptional()
  @IsEnum(IncidentType)
  incidentType?: IncidentType;

  @IsOptional()
  @IsString()
  information?: string;

  @IsOptional()
  @IsString()
  hardware?: string;

  @IsOptional()
  @IsString()
  software?: string;

  @IsOptional()
  @IsString()
  communicationMeans?: string;

  @IsOptional()
  @IsString()
  documentation?: string;

  @IsOptional()
  @IsEnum(NegativeImpact)
  negativeImpact?: NegativeImpact;

  @IsOptional()
  investigationStartDate?: string;

  @IsOptional()
  @IsString()
  investigators?: string;

  @IsOptional()
  incidentEndDate?: string;

  @IsOptional()
  impactEndDate?: string;

  @IsOptional()
  investigationEndDate?: string;

  @IsOptional()
  @IsString()
  investigationReportLocation?: string;

  @IsOptional()
  @IsEnum(ViolatorType)
  violatorType?: ViolatorType;

  @IsOptional()
  @IsString()
  violatorDescription?: string;

  @IsOptional()
  @IsEnum(ViolatorMotivation)
  violatorMotivation?: ViolatorMotivation;

  @IsOptional()
  @IsString()
  resolutionActions?: string;

  @IsOptional()
  @IsString()
  plannedResolutionActions?: string;

  @IsOptional()
  @IsString()
  otherActions?: string;
}

export class PaginationIncident {
  skip: string;
  take: string;
  type?: IncidentType;
}

export class UpdateIncidentDto extends CreateIncidentDto {}
