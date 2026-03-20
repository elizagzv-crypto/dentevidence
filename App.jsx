import { useState, useEffect, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { id: "all",     label: "Все" },
  { id: "therapy", label: "Терапия" },
  { id: "endo",    label: "Эндодонтия" },
  { id: "perio",   label: "Пародонтология" },
  { id: "ortho_p", label: "Ортопедия" },
  { id: "ortho_d", label: "Ортодонтия" },
  { id: "surgery", label: "Хирургия" },
  { id: "implant", label: "Имплантология" },
  { id: "prev",    label: "Профилактика" },
  { id: "coord",   label: "Координатор" },
];

const SCENARIOS = [
  // ─── Терапия
  { id: 1,  spec: "therapy", specLabel: "Терапия",       tag: "тактика",       tagColor: "blue",  title: "Вскрытие пульпы",              prompt: "Случайное вскрытие пульпы при препарировании: прямое покрытие vs пульпотомия — критерии выбора по ESE 2019?" },
  { id: 2,  spec: "therapy", specLabel: "Терапия",       tag: "осложнение",    tagColor: "amber", title: "Боль после пломбирования",     prompt: "Постоперационная чувствительность после реставрации композитом — дифдиагностика и клиническая тактика?" },
  { id: 3,  spec: "therapy", specLabel: "Терапия",       tag: "протокол",      tagColor: "blue",  title: "Полировка пломбы",             prompt: "Протокол финишной полировки прямой композитной реставрации — инструменты, последовательность, критерии качества?" },
  { id: 30, spec: "therapy", specLabel: "Терапия",       tag: "тактика",       tagColor: "blue",  title: "Глубокий кариес",              prompt: "Глубокий кариес с риском вскрытия пульпы — ступенчатое препарирование vs селективное удаление: доказательная база?" },
  { id: 31, spec: "therapy", specLabel: "Терапия",       tag: "выбор",         tagColor: "blue",  title: "Выбор адгезивной системы",     prompt: "Адгезивы 7-го поколения vs тотальное протравливание — клинические показания и доказательная база долгосрочности?" },
  { id: 32, spec: "therapy", specLabel: "Терапия",       tag: "протокол",      tagColor: "blue",  title: "Замена реставрации",           prompt: "Критерии USPHS/FDI для оценки реставраций — когда замена обоснована, когда достаточно коррекции?" },
  { id: 33, spec: "therapy", specLabel: "Терапия",       tag: "тактика",       tagColor: "blue",  title: "Гиперчувствительность дентина",prompt: "Дентинная гиперчувствительность — дифдиагностика с другими состояниями и алгоритм лечения по доказательной базе?" },
  { id: 58, spec: "therapy", specLabel: "Терапия",       tag: "протокол",      tagColor: "blue",  title: "Изоляция рабочего поля",       prompt: "Коффердам в терапевтической стоматологии — показания, техника установки, влияние на качество реставраций?" },
  { id: 59, spec: "therapy", specLabel: "Терапия",       tag: "выбор",         tagColor: "blue",  title: "Матричные системы",            prompt: "Секционные матрицы vs контурные — когда что применять для достижения контактного пункта?" },

  // ─── Эндодонтия
  { id: 4,  spec: "endo",    specLabel: "Эндодонтия",    tag: "неотложно",     tagColor: "red",   title: "Боль после эндолечения",       prompt: "Постпломбировочная боль и флэр-ап после обтурации — механизмы, дифдиагностика, клиническая тактика?" },
  { id: 5,  spec: "endo",    specLabel: "Эндодонтия",    tag: "осложнение",    tagColor: "red",   title: "Перелом инструмента",          prompt: "Фрактура никель-титанового файла в канале — алгоритм принятия решения: извлечение, обход или оставить?" },
  { id: 6,  spec: "endo",    specLabel: "Эндодонтия",    tag: "осложнение",    tagColor: "red",   title: "Перфорация",                   prompt: "Перфорация корня или дна полости зуба: классификация по прогнозу, MTA vs биокерамика, тактика?" },
  { id: 7,  spec: "endo",    specLabel: "Эндодонтия",    tag: "тактика",       tagColor: "blue",  title: "Реэндодонтическое лечение",    prompt: "Показания к реэндодонтическому лечению — когда перелечивать, когда апикальная хирургия, когда удаление?" },
  { id: 21, spec: "endo",    specLabel: "Эндодонтия",    tag: "диагностика",   tagColor: "blue",  title: "Пульпарная диагностика",       prompt: "Тесты витальности пульпы: холодовой, электрический, лазерная допплерометрия — точность и клиническое применение?" },
  { id: 22, spec: "endo",    specLabel: "Эндодонтия",    tag: "протокол",      tagColor: "blue",  title: "Протокол ирригации",           prompt: "Ирригационный протокол: NaOCl концентрация и объём, активация EDTA, финальная обработка — текущие рекомендации ESE?" },
  { id: 34, spec: "endo",    specLabel: "Эндодонтия",    tag: "тактика",       tagColor: "blue",  title: "Травма зуба",                  prompt: "Травматические повреждения зубов: классификация по Andreasen, протоколы реплантации и шинирования по IADT 2020?" },
  { id: 35, spec: "endo",    specLabel: "Эндодонтия",    tag: "выбор",         tagColor: "blue",  title: "Обтурация канала",             prompt: "Латеральная конденсация vs термопластичные методы обтурации — качество запечатывания и клинические исходы?" },
  { id: 60, spec: "endo",    specLabel: "Эндодонтия",    tag: "протокол",      tagColor: "blue",  title: "Витальная пульпотомия",        prompt: "Витальная пульпотомия у постоянных зубов взрослых — биокерамические цементы, показания, долгосрочные результаты?" },

  // ─── Пародонтология
  { id: 10, spec: "perio",   specLabel: "Пародонтология",tag: "протокол",      tagColor: "blue",  title: "Пародонтит III–IV стадии",     prompt: "Поэтапное лечение пародонтита III–IV стадии по протоколу EFP 2022 — каждый этап, критерии перехода?" },
  { id: 11, spec: "perio",   specLabel: "Пародонтология",tag: "осложнение",    tagColor: "amber", title: "Периимплантит",                prompt: "Периимплантит: диагностические критерии, нехирургическое vs хирургическое лечение — алгоритм по EFP/AAP?" },
  { id: 12, spec: "perio",   specLabel: "Пародонтология",tag: "тактика",       tagColor: "blue",  title: "Рецессия десны",               prompt: "Классификация рецессий Cairo 2011 — показания к туннельной технике, CTG, коронарному смещению лоскута?" },
  { id: 36, spec: "perio",   specLabel: "Пародонтология",tag: "протокол",      tagColor: "blue",  title: "Поддерживающая терапия",       prompt: "SPT протокол: оптимальные интервалы по степени риска, объём вмешательства, доказательная база compliance?" },
  { id: 37, spec: "perio",   specLabel: "Пародонтология",tag: "тактика",       tagColor: "blue",  title: "Адъювантные антибиотики",      prompt: "Системные антибиотики при пародонтите: амоксициллин+метронидазол vs метронидазол — показания, схемы, риски резистентности?" },
  { id: 38, spec: "perio",   specLabel: "Пародонтология",tag: "диагностика",   tagColor: "blue",  title: "Пародонтальный скрининг",      prompt: "PSI/BPE vs полная пародонтограмма — когда какой протокол обследования, клинические параметры и их значимость?" },
  { id: 61, spec: "perio",   specLabel: "Пародонтология",tag: "тактика",       tagColor: "amber", title: "Системные заболевания",        prompt: "Двунаправленная связь пародонтита с диабетом и ССЗ — как учитывать в клиническом протоколе?" },

  // ─── Ортопедия
  { id: 13, spec: "ortho_p", specLabel: "Ортопедия",     tag: "тактика",       tagColor: "blue",  title: "Прогноз зуба",                 prompt: "Стратегическое удаление vs сохранение зуба с сомнительным прогнозом — шкалы оценки и критерии принятия решения?" },
  { id: 14, spec: "ortho_p", specLabel: "Ортопедия",     tag: "протокол",      tagColor: "blue",  title: "Немедленная нагрузка",         prompt: "Протокол немедленной нагрузки имплантов — критерии первичной стабильности ISQ, показания и противопоказания?" },
  { id: 39, spec: "ortho_p", specLabel: "Ортопедия",     tag: "протокол",      tagColor: "blue",  title: "Препарирование под коронку",   prompt: "Параметры препарирования под цельнокерамическую коронку — конусность, высота культи, уступ: критерии качества?" },
  { id: 40, spec: "ortho_p", specLabel: "Ортопедия",     tag: "выбор",         tagColor: "blue",  title: "Выбор материала коронки",      prompt: "Монолитный диоксид циркония vs дисиликат лития vs МК — показания по зоне, нагрузке и эстетическим требованиям?" },
  { id: 41, spec: "ortho_p", specLabel: "Ортопедия",     tag: "диагностика",   tagColor: "amber", title: "Дисфункция ВНЧС",              prompt: "Диагностические критерии RDC/TMD — дифдиагностика мышечной и суставной дисфункции, показания к сплинт-терапии?" },
  { id: 42, spec: "ortho_p", specLabel: "Ортопедия",     tag: "выбор",         tagColor: "blue",  title: "Культевая вкладка",            prompt: "Культевая вкладка vs стекловолоконный штифт + композит — биомеханика, клинические исходы, показания?" },
  { id: 62, spec: "ortho_p", specLabel: "Ортопедия",     tag: "протокол",      tagColor: "blue",  title: "Временные конструкции",        prompt: "Временные коронки в комплексном лечении — материалы, функциональные и эстетические задачи, сроки использования?" },

  // ─── Ортодонтия
  { id: 43, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "диагностика",   tagColor: "blue",  title: "Цефалометрический анализ",     prompt: "Ключевые цефалометрические параметры для планирования ортодонтического лечения — какие ориентиры критичны?" },
  { id: 44, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "протокол",      tagColor: "blue",  title: "Ретенция после лечения",       prompt: "Протокол ретенции: фиксированный vs съёмный ретейнер — доказательная база по долгосрочной стабильности?" },
  { id: 45, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "тактика",       tagColor: "blue",  title: "Удаление зубов при лечении",   prompt: "Показания к удалению премоляров при ортодонтическом лечении — когда извлечение обосновано доказательно?" },
  { id: 54, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "осложнение",    tagColor: "red",   title: "Резорбция корней",             prompt: "Ортодонтически индуцированная резорбция корней — факторы риска, мониторинг, тактика при выявлении?" },
  { id: 55, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "тактика",       tagColor: "blue",  title: "Скелетные аномалии",           prompt: "Скелетный III класс у взрослого пациента — ортодонтическая камуфляжная терапия vs ортогнатическая хирургия: критерии выбора?" },
  { id: 56, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "протокол",      tagColor: "blue",  title: "Элайнеры: биомеханика",        prompt: "Ограничения элайнеров при лечении сложных случаев — торк, вертикаль, ротации: что реально достижимо?" },
  { id: 57, spec: "ortho_d", specLabel: "Ортодонтия",    tag: "тактика",       tagColor: "blue",  title: "Ортодонтия + пародонт",        prompt: "Ортодонтическое лечение у пациентов с пародонтитом — когда начинать, какой протокол, риски рецидива?" },

  // ─── Хирургия
  { id: 15, spec: "surgery", specLabel: "Хирургия",      tag: "неотложно",     tagColor: "red",   title: "Альвеолит",                    prompt: "Альвеолит: дифдиагностика сухой лунки и остеомиелита, местное лечение и системная терапия по доказательной базе?" },
  { id: 16, spec: "surgery", specLabel: "Хирургия",      tag: "протокол",      tagColor: "blue",  title: "Антибиотикопрофилактика",      prompt: "Антибиотикопрофилактика в хирургии полости рта — показания AHA/ESC, выбор препарата, однократная доза?" },
  { id: 17, spec: "surgery", specLabel: "Хирургия",      tag: "тактика",       tagColor: "blue",  title: "Зубы мудрости",                prompt: "Профилактическое удаление ретинированных зубов мудрости — показания NICE 2000 и текущие пересмотры?" },
  { id: 46, spec: "surgery", specLabel: "Хирургия",      tag: "осложнение",    tagColor: "red",   title: "Повреждение нерва",            prompt: "Повреждение нижнеальвеолярного нерва при удалении — классификация по Sunderland, мониторинг, сроки восстановления?" },
  { id: 47, spec: "surgery", specLabel: "Хирургия",      tag: "протокол",      tagColor: "blue",  title: "Пациент на антикоагулянтах",   prompt: "Хирургия полости рта при терапии варфарином и НОАК — тактика по INR, нужна ли отмена, местный гемостаз?" },
  { id: 63, spec: "surgery", specLabel: "Хирургия",      tag: "тактика",       tagColor: "amber", title: "MRONJ профилактика",           prompt: "Остеонекроз челюстей при бисфосфонатах и деносумабе — протокол перед экстракцией, drug holiday: за и против?" },
  { id: 64, spec: "surgery", specLabel: "Хирургия",      tag: "диагностика",   tagColor: "blue",  title: "Периапикальная хирургия",      prompt: "Показания к апикальной резекции vs повторное эндолечение — критерии выбора и долгосрочные исходы?" },

  // ─── Имплантология
  { id: 23, spec: "implant", specLabel: "Имплантология", tag: "протокол",      tagColor: "blue",  title: "Выбор импланта",               prompt: "Диаметр и длина импланта в зависимости от анатомии и нагрузки — доказательная база минимальных параметров?" },
  { id: 24, spec: "implant", specLabel: "Имплантология", tag: "тактика",       tagColor: "blue",  title: "Протоколы установки",          prompt: "Немедленная vs ранняя vs отсроченная имплантация — сравнение выживаемости и объёма кости по данным РКИ?" },
  { id: 25, spec: "implant", specLabel: "Имплантология", tag: "осложнение",    tagColor: "red",   title: "Потеря остеоинтеграции",       prompt: "Ранняя и поздняя потеря импланта — анализ причин, протокол повторной установки, прогноз?" },
  { id: 26, spec: "implant", specLabel: "Имплантология", tag: "протокол",      tagColor: "blue",  title: "Синус-лифтинг",                prompt: "Латеральная vs трансальвеолярная аугментация синуса — пороговая высота кости, материалы, исходы?" },
  { id: 48, spec: "implant", specLabel: "Имплантология", tag: "протокол",      tagColor: "blue",  title: "Аугментация кости",            prompt: "GBR с барьерными мембранами — резорбируемые vs нерезорбируемые, материалы заполнения, сроки имплантации?" },
  { id: 49, spec: "implant", specLabel: "Имплантология", tag: "тактика",       tagColor: "amber", title: "Факторы риска",                prompt: "Системные факторы риска в имплантологии — диабет, курение, остеопороз, радиотерапия: протоколы ведения?" },
  { id: 65, spec: "implant", specLabel: "Имплантология", tag: "протокол",      tagColor: "blue",  title: "Мягкие ткани вокруг импланта", prompt: "Кератинизированная десна вокруг имплантов — минимальная ширина, методы аугментации, влияние на периимплантное здоровье?" },

  // ─── Профилактика
  { id: 18, spec: "prev",    specLabel: "Профилактика",  tag: "протокол",      tagColor: "blue",  title: "Фториды: доказательная база",  prompt: "Местные фториды в профилактике кариеса — концентрации по возрасту, частота применения, Cochrane 2020?" },
  { id: 19, spec: "prev",    specLabel: "Профилактика",  tag: "протокол",      tagColor: "blue",  title: "Герметизация фиссур",          prompt: "Герметизация фиссур: показания по ICDAS, стеклоиономер vs смолосодержащий, эффективность по мета-анализам?" },
  { id: 50, spec: "prev",    specLabel: "Профилактика",  tag: "протокол",      tagColor: "blue",  title: "Интервалы recall-визитов",     prompt: "Индивидуализация интервалов профилактических визитов по кариесогенному риску — критерии CAMBRA/ICCMS?" },
  { id: 51, spec: "prev",    specLabel: "Профилактика",  tag: "тактика",       tagColor: "blue",  title: "Начальный кариес",             prompt: "Неинвазивное лечение начального кариеса: реминерализация, герметизация, Icon — показания и доказательная база?" },
  { id: 66, spec: "prev",    specLabel: "Профилактика",  tag: "протокол",      tagColor: "blue",  title: "Кариесогенный риск",           prompt: "Оценка кариесогенного риска у взрослых — валидированные инструменты, клиническое применение в практике?" },
  { id: 67, spec: "prev",    specLabel: "Профилактика",  tag: "тактика",       tagColor: "blue",  title: "Профилактика у детей",         prompt: "Протокол профилактики кариеса у детей до 6 лет — фторидные лаки, герметики, консультирование родителей?" },

  // ─── Координатор
  { id: 20, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Презентация плана лечения",    prompt: "Напиши скрипт презентации комплексного плана лечения пациенту — как объяснить объём, последовательность и ценность?" },
  { id: 28, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Приглашение на повторный визит",prompt: "Напиши скрипт звонка и сообщения для приглашения пациента на повторный визит через 6 месяцев?" },
  { id: 29, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Работа с ценой",               prompt: "Напиши скрипт для работы с возражением «дорого» — как обосновать стоимость лечения без скидок?" },
  { id: 52, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Пациент откладывает лечение",  prompt: "Напиши скрипт для работы с возражением «я подумаю / приду позже» — как создать срочность без давления?" },
  { id: 53, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Жалоба пациента",              prompt: "Напиши скрипт разговора с недовольным пациентом — как принять жалобу, снять напряжение и удержать пациента?" },
  { id: 68, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Страх перед лечением",         prompt: "Напиши скрипт для записи тревожного пациента — как снизить страх по телефону и мотивировать прийти?" },
  { id: 69, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Реактивация спящего пациента", prompt: "Напиши скрипт сообщения и звонка пациенту который не был в клинике больше года — как вернуть без давления?" },
  { id: 70, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Направление к специалисту",    prompt: "Напиши скрипт объяснения пациенту почему его направляют к другому специалисту — как не потерять доверие?" },
  { id: 71, spec: "coord",   specLabel: "Координатор",   tag: "скрипт",        tagColor: "gray",  title: "Согласие на лечение",          prompt: "Напиши скрипт получения информированного согласия на сложное вмешательство — как объяснить риски без пугающих слов?" },
];

// ─── LOADING PHASES ────────────────────────────────────────────────────────

const LOADING_PHASES_STANDARD = [
  { label: "Анализирую вопрос",            sub: "Определяю специальность и контекст..." },
  { label: "Ищу в базе доказательств",     sub: "PubMed · Cochrane · ADA · ESE · AAE..." },
  { label: "Формирую клинический ответ",   sub: "Синтез доказательств и тактики..." },
  { label: "Проверяю источники",           sub: "Уровни доказательности · GRADE..." },
];

const LOADING_PHASES_CASE = [
  { label: "Разбираю клинический кейс",    sub: "Диагноз · дифференциальная диагностика..." },
  { label: "Составляю план лечения",       sub: "Фазы · препараты · материалы..." },
  { label: "Проверяю доказательную базу",  sub: "PubMed · Cochrane · EFP · AAE..." },
  { label: "Готовлю итоговый ответ",       sub: "Прогноз · red flags · источники..." },
];

// ─── SYSTEM PROMPTS ────────────────────────────────────────────────────────

const SYSTEM_STANDARD = `You are DentEvidence — AI clinical decision support for licensed dental professionals.

LANGUAGE RULE: Russian question → respond fully in Russian. English → English. Never mix.

TASK: Answer the clinical question. Think like a senior clinician presenting to a colleague.

TRUSTED SOURCES ONLY: PubMed, Cochrane, ADA, ESE, AAE, EFP, AAP, NICE, WHO, JADA, Journal of Clinical Periodontology, Journal of Endodontics, Journal of Dental Research.
NEVER cite forums, blogs, commercial sites. NEVER invent PMIDs, authors, titles.
If evidence insufficient → say explicitly. If contradictory → show both sides.

CITATION RULE: Every tactic and algorithm step MUST have citation, grade, and pmid.
citation: "AuthorLastname Year" or "Organization Year" (e.g. "Sanz 2020", "ESE 2019", "ADA 2023")
grade: "A" (strong RCT/systematic review) | "B" (moderate, single RCT/cohort) | "C" (expert consensus/low) | "GPP" (good practice, no direct evidence)
pmid: PubMed ID number as string if this is a journal article (e.g. "31912503"), or null for guidelines/organizations

Return ONLY valid JSON, no markdown, no text outside JSON:
{
  "brief_conclusion": "2-3 sentence direct answer",
  "patient_explanation": "Simple 2-3 sentence explanation for the patient. No jargon.",
  "clinical_assessment": {
    "intro": "What to evaluate first",
    "factors": [{"factor": "Name", "why": "Clinical importance"}]
  },
  "tactics": [
    {
      "name": "Tactic name",
      "when": "Indication",
      "grade": "A",
      "citation": "Author Year",
      "pmid": "31912503 or null",
      "steps": ["Step 1", "Step 2"],
      "evidence": "1 sentence evidence summary"
    }
  ],
  "algorithm": [
    {"step": "Step description", "citation": "Author Year", "grade": "A", "pmid": "12345678 or null"}
  ],
  "red_flags": ["Situation where this fails"],
  "when_to_refer": ["Referral condition"],
  "sources": [{"authors": "Surname FM", "title": "Title", "journal": "Journal", "year": "2023", "type": "systematic_review", "pmid": "12345678 or null", "key_point": "Relevant finding"}],
  "confidence_level": "high",
  "confidence_rationale": "Why this level",
  "evidence_gaps": "What is unknown",
  "disclaimer": "For licensed dental professionals only."
}
type: systematic_review | rct | guideline | meta_analysis | expert_consensus | position_statement
confidence_level: high | moderate | low | insufficient
Max 4 sources. Max 3 tactics. Max 6 algorithm steps.`;

const SYSTEM_CASE_ANALYZE = `You are DentEvidence — AI clinical decision support for licensed dental professionals.

LANGUAGE RULE: Russian → Russian. English → English.

TASK: Analyze this clinical case. Determine if you have enough info to give full recommendations.

Critical info by situation type:
- Pulp exposure: vitality, exposure size
- Post-treatment pain: timing, character
- Periodontitis: pocket depths
- Implant issue: loading status, time since placement
- Pediatric: exact age, tooth type
- Trauma: time elapsed, vitality

Return ONLY valid JSON:
{
  "has_enough_info": true,
  "detected_situation": "Brief description of understood situation",
  "clarifications_needed": [
    {"question": "Question text", "options": ["Option 1", "Option 2", "Option 3"], "allow_free_text": false}
  ]
}
RULES: has_enough_info=true if meaningful recommendations possible. Max 2 clarification questions. Only ask if answer changes clinical decision. If has_enough_info=true → clarifications_needed=[].`;

const SYSTEM_CASE_FULL = `Ты — клинический ИИ-ассистент стоматолога. Отвечай на языке вопроса.
Верни ТОЛЬКО JSON без пояснений. Каждое значение — не длиннее 40 символов.
{"d":"диагноз","p":["шаг1","шаг2","шаг3"],"m":["препарат если нужен"],"r":["red flag"],"s":"объяснение для пациента 1 предложение","c":"moderate"}
c: high|moderate|low|insufficient. p макс 4 пункта. m макс 1. r макс 2.`

// Map short keys back to full names for rendering
function expandCaseResult(r) {
  if (!r || typeof r !== "object") return r;
  if (r.case_summary || r.diagnosis) return r; // already expanded
  return {
    case_summary: r.d || "",
    diagnosis: { primary: r.d || "", differential: [], rationale: "" },
    workup: [],
    treatment_plan: r.p?.length ? [{ phase: "План", steps: r.p, timing: "" }] : [],
    medications: (r.m || []).map(x => ({ name: x, indication: "", dose: "", evidence_level: "moderate", evidence_source: "" })),
    materials: [],
    patient_explanation: r.s || "",
    prognosis: null,
    red_flags: r.r || [],
    when_to_refer: [],
    sources: [],
    confidence_level: r.c || "moderate",
    confidence_rationale: "",
    evidence_gaps: "",
    disclaimer: "Только для лицензированных стоматологов. Не заменяет осмотр.",
  };
}

// ─── STYLES ────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #F0EDE7; font-family: 'DM Sans', sans-serif; color: #0D1923; min-height: 100vh; }
.wrap { max-width: 900px; margin: 0 auto; padding: 40px 24px 100px; }

/* Header */
.hdr { margin-bottom: 28px; display: flex; align-items: flex-start; justify-content: space-between; }
.hdr-left {}
.hdr-row { display: flex; align-items: center; gap: 12px; margin-bottom: 5px; }
.logo { font-family: 'Crimson Pro', serif; font-size: 27px; font-weight: 600; letter-spacing: -.5px; }
.logo em { color: #0A5F73; font-style: normal; }
.badge { font-family: 'DM Mono', monospace; font-size: 9px; color: #0A5F73; background: #D8EEF4; padding: 3px 8px; border-radius: 20px; letter-spacing: .8px; }
.tagline { font-size: 12.5px; color: #7D8E9A; font-weight: 300; }

/* History button */
.hist-btn { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #7D8E9A; background: white; border: 0.5px solid #DDD9D1; border-radius: 7px; padding: 6px 12px; cursor: pointer; transition: all .15s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
.hist-btn:hover { border-color: #0A5F73; color: #0A5F73; }
.hist-dot { width: 6px; height: 6px; border-radius: 50%; background: #0A5F73; }

/* History panel */
.hist-panel { background: white; border: 1px solid #DDD9D1; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; animation: reveal .25s ease; }
.hist-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.hist-title { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: 1px; text-transform: uppercase; }
.hist-clear { font-size: 11px; color: #B0ADA8; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
.hist-clear:hover { color: #DC2626; }
.hist-items { display: flex; flex-direction: column; gap: 4px; }
.hist-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 7px; cursor: pointer; transition: background .1s; }
.hist-item:hover { background: #EAF5F8; }
.hist-mode { font-family: 'DM Mono', monospace; font-size: 9px; color: #0A5F73; background: #D8EEF4; padding: 2px 5px; border-radius: 3px; flex-shrink: 0; }
.hist-mode-case { background: #FEF3C7; color: #92400E; }
.hist-text { font-size: 12.5px; color: #1A2B38; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hist-time { font-family: 'DM Mono', monospace; font-size: 10px; color: #C4BFB5; flex-shrink: 0; }

/* Mode tabs */
.mode-tabs { display: flex; gap: 4px; margin-bottom: 20px; background: white; border: 0.5px solid #DDD9D1; border-radius: 9px; padding: 4px; width: fit-content; }
.mode-tab { font-size: 13px; padding: 8px 20px; border-radius: 6px; cursor: pointer; border: none; background: transparent; color: #7D8E9A; font-family: 'DM Sans', sans-serif; font-weight: 400; transition: all .15s; }
.mode-tab.active { background: #0A5F73; color: white; font-weight: 500; }

/* Search box */
.search-box { display: flex; align-items: center; gap: 11px; background: #EAF5F8; border: 1.5px solid #0A5F73; border-radius: 11px; padding: 13px 16px; box-shadow: 0 0 0 4px rgba(10,95,115,0.07); margin-bottom: 12px; cursor: text; }
.search-icon { flex-shrink: 0; color: #0A5F73; }
.search-inner { flex: 1; min-width: 0; }
.search-input { width: 100%; border: none; outline: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0D1923; }
.search-input::placeholder { color: #8BBFC8; }
.search-hint { font-size: 10px; color: #7AB5C0; margin-top: 2px; }
.search-kbd { font-family: 'DM Mono', monospace; font-size: 10px; color: #0A5F73; background: white; border: 0.5px solid #BAD5DF; border-radius: 4px; padding: 3px 8px; white-space: nowrap; flex-shrink: 0; }

/* Dropdown */
.dropdown { background: white; border: 0.5px solid #D4D0C8; border-radius: 10px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.dd-section { padding: 6px 0; border-bottom: 0.5px solid #EDE9E2; }
.dd-section:last-child { border-bottom: none; }
.dd-sec-lbl { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: .8px; padding: 4px 13px 5px; }
.dd-item { display: flex; align-items: center; gap: 9px; padding: 8px 13px; cursor: pointer; transition: background .1s; }
.dd-item:hover { background: #EAF5F8; }
.dd-spec { font-size: 9px; color: #0A5F73; background: #D8EEF4; padding: 2px 6px; border-radius: 3px; white-space: nowrap; flex-shrink: 0; font-family: 'DM Mono', monospace; }
.dd-title { font-size: 13px; color: #0D1923; font-weight: 500; }
.dd-preview { font-size: 11px; color: #7D8E9A; margin-top: 1px; line-height: 1.4; }
.dd-tag { font-size: 9px; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; font-family: 'DM Mono', monospace; }
.dd-tag-red   { background: #FEE2E2; color: #991B1B; }
.dd-tag-amber { background: #FEF3C7; color: #92400E; }
.dd-tag-blue  { background: #D8EEF4; color: #0A5F73; }
.dd-tag-gray  { background: #EDE9E2; color: #7D8E9A; }
.dd-free { display: flex; align-items: center; gap: 10px; padding: 9px 13px; cursor: pointer; transition: background .1s; }
.dd-free:hover { background: #F7F5F0; }
.dd-free-icon { width: 22px; height: 22px; border-radius: 50%; background: #F0EDE7; border: 0.5px solid #DDD9D1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dd-free-main { font-size: 12.5px; color: #4A6070; }
.dd-free-sub  { font-size: 10px; color: #B0ADA8; margin-top: 1px; }

/* Spec pills */
.spec-scroll { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 3px; margin-bottom: 20px; }
.spec-scroll::-webkit-scrollbar { display: none; }
.spec-btn { font-size: 11px; padding: 5px 13px; border: 0.5px solid #DDD9D1; border-radius: 20px; white-space: nowrap; cursor: pointer; color: #6A7D88; background: white; font-family: 'DM Sans', sans-serif; transition: all .15s; flex-shrink: 0; }
.spec-btn:hover  { border-color: #0A5F73; color: #0A5F73; }
.spec-btn.active { background: #0A5F73; color: white; border-color: #0A5F73; }

/* Scenario cards */
.scenarios { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; }
.sc-card { border: 0.5px solid #DDD9D1; border-radius: 9px; padding: 11px 13px; cursor: pointer; background: white; transition: all .15s; }
.sc-card:hover { border-color: #0A5F73; background: #EAF5F8; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(10,95,115,0.1); }
.sc-tag   { display: inline-block; font-size: 9px; padding: 2px 6px; border-radius: 3px; margin-bottom: 6px; font-family: 'DM Mono', monospace; }
.sc-title { font-size: 12.5px; font-weight: 500; color: #0D1923; margin-bottom: 4px; }
.sc-q     { font-size: 11px; color: #7D8E9A; line-height: 1.5; font-style: italic; }

/* ── Progress loader ── */
.progress-wrap { padding: 48px 20px; }
.progress-phases { display: flex; flex-direction: column; gap: 0; margin-bottom: 28px; }
.phase-row { display: flex; align-items: flex-start; gap: 14px; }
.phase-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.phase-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .4s ease; }
.phase-icon.done    { background: #0A5F73; }
.phase-icon.active  { background: #D8EEF4; border: 2px solid #0A5F73; animation: pulse-ring .8s ease infinite; }
.phase-icon.pending { background: #EDE9E2; }
.phase-connector { width: 1px; height: 20px; background: #DDD9D1; transition: background .4s; }
.phase-connector.done { background: #0A5F73; }
.phase-body { padding: 4px 0 22px; }
.phase-label { font-size: 13px; font-weight: 500; transition: color .3s; }
.phase-label.done    { color: #0A5F73; }
.phase-label.active  { color: #0D1923; }
.phase-label.pending { color: #C4BFB5; }
.phase-sub { font-size: 11px; color: #B0ADA8; margin-top: 2px; transition: color .3s; }
.phase-sub.active { color: #7D8E9A; }
@keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(10,95,115,0.3); } 50% { box-shadow: 0 0 0 5px rgba(10,95,115,0); } }
.progress-bar-wrap { background: #EDE9E2; border-radius: 4px; height: 3px; overflow: hidden; }
.progress-bar { height: 100%; background: linear-gradient(90deg, #0A5F73, #1E9AB5); border-radius: 4px; transition: width .6s ease; }

/* Results — animated cards */
.results { }
.result-card-anim { animation: card-in .4s ease both; }
@keyframes card-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
.q-echo { display: flex; gap: 12px; padding: 12px 15px; background: #F7F5F0; border-left: 3px solid #0A5F73; border-radius: 0 7px 7px 0; margin-bottom: 18px; animation: card-in .3s ease; }
.q-echo-lbl { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: .9px; text-transform: uppercase; white-space: nowrap; margin-top: 3px; }
.q-echo-txt { font-family: 'Crimson Pro', serif; font-size: 16px; color: #0D1923; font-style: italic; line-height: 1.5; }

/* Result top actions */
.result-actions { display: flex; justify-content: flex-end; margin-bottom: 14px; gap: 8px; }
.copy-btn { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #7D8E9A; background: white; border: 0.5px solid #DDD9D1; border-radius: 6px; padding: 6px 12px; cursor: pointer; transition: all .15s; font-family: 'DM Sans', sans-serif; }
.copy-btn:hover { border-color: #0A5F73; color: #0A5F73; }
.copy-btn.copied { border-color: #059669; color: #059669; background: #F0FDF4; }

/* Confidence */
.conf { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 8px; margin-bottom: 16px; border: 1px solid transparent; animation: card-in .35s ease .05s both; }
.conf-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.conf-lbl { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: .5px; }
.conf-rat { font-size: 12px; margin-top: 3px; opacity: .8; line-height: 1.5; }

/* Cards */
.card { background: white; border: 1px solid #DDD9D1; border-radius: 12px; padding: 20px 22px; margin-bottom: 12px; }
.card-ttl { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: 1.1px; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 9px; }
.card-ttl::after { content: ''; flex: 1; height: 1px; background: #EDE9E2; }
.brief { font-family: 'Crimson Pro', serif; font-size: 21px; line-height: 1.56; }

/* Patient explanation card */
.patient-card { background: #F0FDF4; border: 1px solid #A7F3D0; border-radius: 12px; padding: 18px 22px; margin-bottom: 12px; }
.patient-card .card-ttl { color: #065F46; }
.patient-card .card-ttl::after { background: #A7F3D0; }
.patient-text { font-family: 'Crimson Pro', serif; font-size: 18px; line-height: 1.65; color: #064E3B; }

/* Clinical assessment */
.assess-intro { font-size: 13.5px; color: #4A6070; margin-bottom: 12px; line-height: 1.6; }
.factors { display: flex; flex-direction: column; gap: 8px; }
.factor { display: flex; gap: 10px; padding: 9px 12px; background: #F7F5F0; border-radius: 7px; }
.factor-name { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; color: #0A5F73; width: 130px; flex-shrink: 0; padding-top: 2px; line-height: 1.4; }
.factor-why  { font-size: 13px; color: #2A3D4A; line-height: 1.55; }

/* Tactics */
.tactic { border: 1px solid #EDE9E2; border-radius: 9px; overflow: hidden; margin-bottom: 10px; }
.tactic:last-child { margin-bottom: 0; }
.tactic-head { padding: 10px 14px; background: #F7F5F0; border-bottom: 1px solid #EDE9E2; }
.tactic-head.has-grade { background: #EAF5F8; border-left: 3px solid #0A5F73; padding-left: 11px; }
.tactic-name { font-size: 13.5px; font-weight: 500; color: #0D1923; }
.tactic-when { font-size: 11.5px; color: #7D8E9A; margin-top: 3px; line-height: 1.4; }
.tactic-body { padding: 11px 14px; }
.tactic-steps { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 0; }
.tactic-step   { display: flex; gap: 9px; font-size: 13px; color: #1E2E38; line-height: 1.55; }
.tactic-step-n { font-family: 'DM Mono', monospace; font-size: 9px; color: #0A5F73; background: #D8EEF4; width: 18px; height: 18px; border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.tactic-ev { font-size: 11px; color: #7D8E9A; line-height: 1.6; border-top: 1px solid #EDE9E2; padding-top: 9px; margin-top: 10px; display: flex; align-items: flex-start; gap: 7px; }
.tactic-ev-icon { flex-shrink: 0; margin-top: 1px; }

/* Algorithm */
.algo { display: flex; flex-direction: column; }
.algo-step  { display: flex; gap: 12px; }
.algo-left  { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.algo-num   { font-family: 'DM Mono', monospace; font-size: 11px; color: white; background: #0A5F73; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.algo-line  { width: 1px; flex: 1; background: #DDD9D1; min-height: 16px; }
.algo-text  { font-size: 14px; color: #1E2E38; line-height: 1.58; padding: 2px 0 18px; }

/* Red flags / refer */
.flags  { display: flex; flex-direction: column; gap: 7px; }
.flag   { display: flex; gap: 9px; padding: 9px 12px; background: #FFF4F4; border: 1px solid #FECDCD; border-radius: 7px; }
.flag-text { font-size: 13px; color: #5A1E1E; line-height: 1.55; }
.refers { display: flex; flex-direction: column; gap: 7px; }
.refer  { display: flex; gap: 9px; padding: 9px 12px; background: #FFFBF0; border: 1px solid #F0D8A0; border-radius: 7px; }
.refer-text { font-size: 13px; color: #4A3010; line-height: 1.55; }

/* Sources */
.src-item  { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #EDE9E2; }
.src-item:last-child { border-bottom: none; padding-bottom: 0; }
.src-n     { font-family: 'DM Mono', monospace; font-size: 10px; color: #B0ADA8; width: 16px; flex-shrink: 0; padding-top: 2px; }
.src-body  { flex: 1; min-width: 0; }
.src-title { font-size: 13px; font-weight: 500; margin-bottom: 4px; line-height: 1.4; }
.src-meta  { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 3px; }
.src-auth  { font-size: 11.5px; color: #7D8E9A; font-style: italic; }
.src-jrnl  { font-size: 11.5px; color: #0A5F73; font-weight: 500; }
.src-yr    { font-family: 'DM Mono', monospace; font-size: 10px; color: #B0ADA8; }
.src-type  { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 5px; border-radius: 3px; background: #EDE9E2; color: #7D8E9A; }
.pmid      { font-family: 'DM Mono', monospace; font-size: 10px; color: #0A5F73; text-decoration: none; background: #D8EEF4; padding: 2px 6px; border-radius: 3px; border: 1px solid #BAD5DF; }
.pmid:hover { background: #B8DDE8; }
.src-point { font-size: 11.5px; color: #7D8E9A; font-style: italic; margin-top: 3px; line-height: 1.5; }

/* Case mode */
.case-intro { font-family: 'Crimson Pro', serif; font-size: 17px; color: #4A6070; margin-bottom: 18px; line-height: 1.55; }
.case-search { display: flex; align-items: flex-start; gap: 11px; background: #EAF5F8; border: 1.5px solid #0A5F73; border-radius: 11px; padding: 14px 16px; box-shadow: 0 0 0 4px rgba(10,95,115,0.07); margin-bottom: 20px; }
.case-textarea { flex: 1; border: none; outline: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #0D1923; resize: none; min-height: 64px; max-height: 160px; overflow-y: auto; line-height: 1.6; }
.case-textarea::placeholder { color: #8BBFC8; }
.case-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(10,95,115,0.15); }
.case-hint { font-size: 10px; color: #7AB5C0; }

/* Buttons */
.sbtn { background: #0D1923; color: white; border: none; padding: 9px 22px; border-radius: 7px; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: all .15s; }
.sbtn:hover:not(:disabled) { background: #0A5F73; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(10,95,115,.22); }
.sbtn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
.sbtn-ghost { background: #F0EDE7; color: #0A5F73; border: 1px solid #0A5F73; }
.sbtn-ghost:hover:not(:disabled) { background: #EAF5F8; }

/* Clarification */
.clarify-block { background: white; border: 1px solid #DDD9D1; border-radius: 12px; padding: 20px 22px; margin-bottom: 20px; }
.clarify-detected { font-size: 13px; color: #4A6070; margin-bottom: 16px; padding: 10px 13px; background: #F7F5F0; border-radius: 7px; line-height: 1.55; }
.clarify-q { margin-bottom: 16px; }
.clarify-q:last-child { margin-bottom: 0; }
.clarify-q-text { font-size: 13.5px; font-weight: 500; color: #0D1923; margin-bottom: 9px; }
.clarify-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.clarify-chip { font-size: 12.5px; padding: 7px 14px; border: 1px solid #DDD9D1; border-radius: 7px; cursor: pointer; transition: all .15s; background: white; color: #4A6070; }
.clarify-chip:hover { border-color: #0A5F73; color: #0A5F73; background: #EAF5F8; }
.clarify-chip.sel { border-color: #0A5F73; background: #D8EEF4; color: #0A5F73; font-weight: 500; }
.clarify-footer { margin-top: 18px; padding-top: 14px; border-top: 1px solid #EDE9E2; display: flex; justify-content: flex-end; gap: 10px; }

/* Case result extras */
.diag-block { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.diag-card  { background: #F7F5F0; border-radius: 8px; padding: 12px 14px; }
.diag-lbl   { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: .8px; text-transform: uppercase; margin-bottom: 6px; }
.diag-val   { font-size: 14px; font-weight: 500; color: #0D1923; line-height: 1.4; }
.diag-diff  { display: flex; flex-direction: column; gap: 5px; }
.diag-diff-item { font-size: 12.5px; color: #4A6070; display: flex; align-items: center; gap: 7px; }
.diag-diff-item::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #B0ADA8; flex-shrink: 0; }
.med-card { border: 1px solid #EDE9E2; border-radius: 9px; padding: 13px 15px; margin-bottom: 9px; }
.med-card:last-child { margin-bottom: 0; }
.med-name { font-size: 14px; font-weight: 500; color: #0D1923; margin-bottom: 4px; }
.med-row  { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; align-items: center; }
.ev-badge { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 3px; }
.ev-high         { background: #D1FAE5; color: #065F46; }
.ev-moderate     { background: #FEF3C7; color: #92400E; }
.ev-low          { background: #FEE2E2; color: #991B1B; }
.ev-insufficient { background: #EDE9E2; color: #7D8E9A; }
.grade-A   { font-family: "DM Mono", monospace; font-size: 9px; padding: 2px 6px; border-radius: 3px; background: #D1FAE5; color: #065F46; font-weight: 500; }
.grade-B   { font-family: "DM Mono", monospace; font-size: 9px; padding: 2px 6px; border-radius: 3px; background: #FEF3C7; color: #92400E; font-weight: 500; }
.grade-C   { font-family: "DM Mono", monospace; font-size: 9px; padding: 2px 6px; border-radius: 3px; background: #FEE2E2; color: #991B1B; font-weight: 500; }
.grade-GPP { font-family: "DM Mono", monospace; font-size: 9px; padding: 2px 6px; border-radius: 3px; background: #EDE9E2; color: #7D8E9A; font-weight: 500; }
.cite-tag  { font-size: 10px; color: #9AACB5; font-style: italic; }
.med-detail { font-size: 12px; color: #4A6070; line-height: 1.6; }
.med-avoid  { font-size: 11.5px; color: #991B1B; margin-top: 5px; background: #FFF4F4; padding: 5px 9px; border-radius: 5px; }
.prog-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.prog-item  { background: #F7F5F0; border-radius: 8px; padding: 11px 13px; }
.prog-lbl   { font-family: 'DM Mono', monospace; font-size: 9px; color: #B0ADA8; letter-spacing: .8px; text-transform: uppercase; margin-bottom: 5px; }
.prog-val   { font-size: 13px; color: #1A2B38; line-height: 1.5; }

/* Misc */
.gap-txt { font-size: 13.5px; color: #7D8E9A; line-height: 1.68; font-style: italic; }
.disc     { padding: 13px 16px; background: #FFFBF0; border: 1px solid #EDD890; border-radius: 8px; margin-bottom: 12px; }
.disc-lbl { font-family: 'DM Mono', monospace; font-size: 9px; color: #8A6810; letter-spacing: .9px; text-transform: uppercase; margin-bottom: 4px; }
.disc-txt { font-size: 12px; color: #5A4410; line-height: 1.65; }
.err      { padding: 13px 16px; background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; color: #991B1B; font-size: 13px; margin-bottom: 14px; line-height: 1.6; }
.footer   { margin-top: 48px; padding-top: 18px; border-top: 1px solid #DDD9D1; font-family: 'DM Mono', monospace; font-size: 9px; color: #C2BDB4; letter-spacing: .3px; text-align: center; line-height: 2; }

@keyframes reveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const TYPE_LABEL = {
  systematic_review: "Сист. обзор", rct: "РКИ", guideline: "Руководство",
  meta_analysis: "Мета-анализ", expert_consensus: "Консенсус",
  narrative_review: "Обзор", position_statement: "Позиц. документ",
};

const CONF_STYLE = {
  high:         { label: "ВЫСОКАЯ ДОСТОВЕРНОСТЬ",   dot: "#059669", bg: "#F0FDF4", text: "#065F46", bdr: "#A7F3D0" },
  moderate:     { label: "УМЕРЕННАЯ ДОСТОВЕРНОСТЬ", dot: "#D97706", bg: "#FFFBEB", text: "#92400E", bdr: "#FDE68A" },
  low:          { label: "НИЗКАЯ ДОСТОВЕРНОСТЬ",    dot: "#DC2626", bg: "#FEF2F2", text: "#991B1B", bdr: "#FECACA" },
  insufficient: { label: "НЕДОСТАТОЧНО ДАННЫХ",     dot: "#6B7280", bg: "#F9FAFB", text: "#374151", bdr: "#E5E7EB" },
};

const EV_CLASS = { high: "ev-high", moderate: "ev-moderate", low: "ev-low", insufficient: "ev-insufficient" };

// ─── JSON REPAIR ───────────────────────────────────────────────────────────

function repairJson(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let json = text.slice(start);

  // Try as-is first
  try { JSON.parse(json); return json; } catch {}

  // Remove trailing incomplete tokens (common truncation patterns)
  // Strip trailing comma before closing
  json = json.replace(/,\s*([}\]])/g, "$1");

  try { JSON.parse(json); return json; } catch {}

  // Walk and close unclosed structures
  let inStr = false, escape = false;
  const stack = [];
  let lastGoodPos = 0;

  for (let i = 0; i < json.length; i++) {
    const c = json[i];
    if (escape) { escape = false; continue; }
    if (c === "\\" && inStr) { escape = true; continue; }
    if (c === '"') {
      inStr = !inStr;
      if (!inStr) lastGoodPos = i; // just closed a string
      continue;
    }
    if (inStr) continue;
    lastGoodPos = i;
    if (c === "{") stack.push("}");
    else if (c === "[") stack.push("]");
    else if (c === "}" || c === "]") stack.pop();
  }

  // If we ended inside a string, truncate back to last good position
  if (inStr) {
    json = json.slice(0, lastGoodPos + 1) + '"';
  }

  // Remove trailing comma if present after truncation
  json = json.replace(/,\s*$/, "");

  // Close all open structures
  json += stack.reverse().join("");

  try { JSON.parse(json); return json; } catch {}

  // Last resort: find the last complete top-level field and close from there
  try {
    const lastComma = json.lastIndexOf(',"');
    if (lastComma > 0) {
      const truncated = json.slice(0, lastComma);
      const closed = truncated + stack.reverse().join("") + "}";
      JSON.parse(closed);
      return closed;
    }
  } catch {}

  return null;
}

// ─── API ───────────────────────────────────────────────────────────────────

async function callClaude(system, userMsg, maxTokens = 2000) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const repaired = repairJson(text);
  if (!repaired) throw new Error("Неверный формат ответа — попробуйте ещё раз");
  return JSON.parse(repaired);
}

// ─── PROGRESS LOADER ───────────────────────────────────────────────────────

function ProgressLoader({ phases, activePhase }) {
  const pct = Math.round(((activePhase + 1) / phases.length) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-phases">
        {phases.map((ph, i) => {
          const status = i < activePhase ? "done" : i === activePhase ? "active" : "pending";
          return (
            <div key={i} className="phase-row">
              <div className="phase-left">
                <div className={`phase-icon ${status}`}>
                  {status === "done" && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {status === "active" && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0A5F73" }} />
                  )}
                </div>
                {i < phases.length - 1 && <div className={`phase-connector ${status === "done" ? "done" : ""}`} />}
              </div>
              <div className="phase-body">
                <div className={`phase-label ${status}`}>{ph.label}</div>
                {status === "active" && <div className={`phase-sub ${status}`}>{ph.sub}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── SHARED BLOCKS ─────────────────────────────────────────────────────────

function ConfBlock({ level, rationale, delay = 0 }) {
  const c = CONF_STYLE[level] || CONF_STYLE.insufficient;
  return (
    <div className="conf result-card-anim" style={{ background: c.bg, borderColor: c.bdr, animationDelay: `${delay}s` }}>
      <div className="conf-dot" style={{ background: c.dot }} />
      <div>
        <div className="conf-lbl" style={{ color: c.text }}>{c.label}</div>
        {rationale && <div className="conf-rat" style={{ color: c.text }}>{rationale}</div>}
      </div>
    </div>
  );
}

function PatientBlock({ text, delay = 0 }) {
  if (!text) return null;
  return (
    <div className="patient-card result-card-anim" style={{ animationDelay: `${delay}s` }}>
      <div className="card-ttl" style={{ color: "#065F46" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ opacity: .7 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Что сказать пациенту
      </div>
      <div className="patient-text">{text}</div>
    </div>
  );
}

function AnimCard({ delay = 0, ttl, icon, children }) {
  return (
    <div className="card result-card-anim" style={{ animationDelay: `${delay}s` }}>
      <div className="card-ttl">{icon}{ttl}</div>
      {children}
    </div>
  );
}

function SourcesBlock({ sources, delay = 0 }) {
  if (!sources?.length) return null;
  return (
    <AnimCard delay={delay} ttl={`Источники · ${sources.length}`}>
      {sources.map((src, i) => (
        <div key={i} className="src-item">
          <span className="src-n">{i + 1}.</span>
          <div className="src-body">
            <div className="src-title">{src.title}</div>
            <div className="src-meta">
              {src.authors && <span className="src-auth">{src.authors}</span>}
              {src.journal && <span className="src-jrnl">{src.journal}</span>}
              {src.year    && <span className="src-yr">{src.year}</span>}
              {src.type    && <span className="src-type">{TYPE_LABEL[src.type] || src.type}</span>}
              {src.pmid && src.pmid !== "null" && src.pmid !== null && (
                <a className="pmid" href={`https://pubmed.ncbi.nlm.nih.gov/${src.pmid}/`} target="_blank" rel="noopener noreferrer">
                  PMID {src.pmid}
                </a>
              )}
            </div>
            {src.key_point && <div className="src-point">{src.key_point}</div>}
          </div>
        </div>
      ))}
    </AnimCard>
  );
}

function MedCard({ med }) {
  const evCls = EV_CLASS[med.evidence_level] || "ev-insufficient";
  return (
    <div className="med-card">
      <div className="med-name">{med.name}</div>
      <div className="med-row">
        <span className={`ev-badge ${evCls}`}>{med.evidence_level?.toUpperCase()}</span>
        {med.evidence_source && <span style={{ fontSize: 11, color: "#9AACB5" }}>{med.evidence_source}</span>}
      </div>
      <div className="med-detail">
        {med.indication && <div><strong>Показание:</strong> {med.indication}</div>}
        {med.dose       && <div><strong>Дозировка:</strong> {med.dose}</div>}
        {med.alternatives && <div><strong>Альтернатива:</strong> {med.alternatives}</div>}
      </div>
      {med.avoid && <div className="med-avoid">⚠ Не назначать: {med.avoid}</div>}
    </div>
  );
}

function MatCard({ mat }) {
  const evCls = EV_CLASS[mat.evidence_level] || "ev-insufficient";
  return (
    <div className="med-card">
      <div className="med-name">{mat.recommended} <span style={{ fontSize: 12, fontWeight: 400, color: "#7D8E9A" }}>· {mat.category}</span></div>
      <div className="med-row">
        <span className={`ev-badge ${evCls}`}>{mat.evidence_level?.toUpperCase()}</span>
        {mat.evidence_source && <span style={{ fontSize: 11, color: "#9AACB5" }}>{mat.evidence_source}</span>}
      </div>
      <div className="med-detail">
        {mat.indication      && <div><strong>Показание:</strong> {mat.indication}</div>}
        {mat.vs_alternatives && <div><strong>vs альтернативы:</strong> {mat.vs_alternatives}</div>}
        {mat.considerations  && <div><strong>Учесть:</strong> {mat.considerations}</div>}
      </div>
    </div>
  );
}

// ─── COPY BUTTON ───────────────────────────────────────────────────────────

function CopyBtn({ result }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const lines = [];
    if (result.brief_conclusion) lines.push(`ВЫВОД\n${result.brief_conclusion}`);
    if (result.case_summary)     lines.push(`КЕЙС\n${result.case_summary}`);
    if (result.algorithm?.length) lines.push(`АЛГОРИТМ\n${result.algorithm.map((s,i) => { const t = typeof s === 'string' ? s : s.step; const cit = typeof s === 'object' && s.citation ? ` [${s.citation}]` : ''; return `${i+1}. ${t}${cit}`; }).join('\n')}`);
    if (result.treatment_plan?.length) {
      lines.push(`ПЛАН ЛЕЧЕНИЯ\n${result.treatment_plan.map(p => `${p.phase}:\n${p.steps.map((s,i) => `  ${i+1}. ${s}`).join("\n")}`).join("\n")}`);
    }
    if (result.medications?.length) {
      lines.push(`ПРЕПАРАТЫ\n${result.medications.map(m => `• ${m.name}: ${m.indication}${m.dose ? `, ${m.dose}` : ""}`).join("\n")}`);
    }
    if (result.sources?.length) {
      lines.push(`ИСТОЧНИКИ\n${result.sources.map((s,i) => `${i+1}. ${s.authors} (${s.year}). ${s.title}${s.pmid && s.pmid !== "null" ? ` PMID: ${s.pmid}` : ""}`).join("\n")}`);
    }
    lines.push(`\nDentEvidence · ${new Date().toLocaleDateString("ru")}`);
    navigator.clipboard.writeText(lines.join("\n\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )}
      {copied ? "Скопировано" : "Копировать ответ"}
    </button>
  );
}

// ─── STANDARD RESULT ──────────────────────────────────────────────────────

function StandardResult({ result, question }) {
  return (
    <div className="results">
      <div className="q-echo">
        <span className="q-echo-lbl">Вопрос</span>
        <span className="q-echo-txt">{question}</span>
      </div>
      <div className="result-actions"><CopyBtn result={result} /></div>
      <ConfBlock level={result.confidence_level} rationale={result.confidence_rationale} delay={0} />

      {result.brief_conclusion && (
        <AnimCard delay={0.05} ttl="Краткий вывод">
          <div className="brief">{result.brief_conclusion}</div>
        </AnimCard>
      )}

      <PatientBlock text={result.patient_explanation} delay={0.1} />

      {result.clinical_assessment && (
        <AnimCard delay={0.12} ttl="Что оценить сначала">
          {result.clinical_assessment.intro && <div className="assess-intro">{result.clinical_assessment.intro}</div>}
          <div className="factors">
            {(result.clinical_assessment.factors || []).map((f, i) => (
              <div key={i} className="factor">
                <div className="factor-name">{f.factor}</div>
                <div className="factor-why">{f.why}</div>
              </div>
            ))}
          </div>
        </AnimCard>
      )}

      {result.tactics?.length > 0 && (
        <AnimCard delay={0.16} ttl="Варианты тактики">
          {result.tactics.map((t, i) => (
            <div key={i} className="tactic">
              <div className={"tactic-head" + (t.grade ? " has-grade" : "")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div className="tactic-name">{t.name}</div>
                  {t.grade && <span className={"grade-" + t.grade}>{t.grade}</span>}
                </div>
                {t.when && <div className="tactic-when">{t.when}</div>}
              </div>
              <div className="tactic-body">
                <ol className="tactic-steps">
                  {(t.steps || []).map((s, j) => (
                    <li key={j} className="tactic-step">
                      <span className="tactic-step-n">{j + 1}</span><span>{s}</span>
                    </li>
                  ))}
                </ol>
                {(t.citation || t.evidence) && (
                  <div className="tactic-ev">
                    <svg className="tactic-ev-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9AACB5" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>
                      {t.citation && (
                        t.pmid && t.pmid !== "null" ? (
                          <a href={"https://pubmed.ncbi.nlm.nih.gov/" + t.pmid + "/"} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#0A5F73", fontWeight: 500, fontStyle: "normal", marginRight: 6, textDecoration: "none", borderBottom: "1px solid #BAD5DF" }}>
                            {t.citation} ↗
                          </a>
                        ) : (
                          <strong style={{ color: "#5A7A88", fontStyle: "normal", marginRight: 6 }}>{t.citation}</strong>
                        )
                      )}
                      {t.evidence}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </AnimCard>
      )}

      {result.algorithm?.length > 0 && (
        <AnimCard delay={0.2} ttl="Рекомендуемый алгоритм">
          <div className="algo">
            {result.algorithm.map((item, i) => {
              const stepText = typeof item === "string" ? item : item.step;
              const citation = typeof item === "object" ? item.citation : null;
              return (
                <div key={i} className="algo-step">
                  <div className="algo-left">
                    <div className="algo-num">{i + 1}</div>
                    {i < result.algorithm.length - 1 && <div className="algo-line" />}
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div className="algo-text" style={{ paddingBottom: 0 }}>{stepText}</div>
                    {citation && (
                      typeof item === "object" && item.pmid && item.pmid !== "null" ? (
                        <a href={"https://pubmed.ncbi.nlm.nih.gov/" + item.pmid + "/"} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 10, color: "#0A5F73", fontStyle: "italic", marginTop: 3, display: "inline-block", textDecoration: "none", borderBottom: "1px solid #BAD5DF" }}>
                          {citation} ↗
                        </a>
                      ) : (
                        <span className="cite-tag" style={{ marginTop: 3, display: "inline-block" }}>{citation}</span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AnimCard>
      )}

      {result.red_flags?.length > 0 && (
        <AnimCard delay={0.24} ttl="Когда подход не подходит">
          <div className="flags">
            {result.red_flags.map((f, i) => (
              <div key={i} className="flag">
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1, color: "#991B1B" }}>⚑</span>
                <span className="flag-text">{f}</span>
              </div>
            ))}
          </div>
        </AnimCard>
      )}

      {result.when_to_refer?.length > 0 && (
        <AnimCard delay={0.27} ttl="Когда изменить тактику или направить">
          <div className="refers">
            {result.when_to_refer.map((r, i) => (
              <div key={i} className="refer">
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>→</span>
                <span className="refer-text">{r}</span>
              </div>
            ))}
          </div>
        </AnimCard>
      )}

      <SourcesBlock sources={result.sources} delay={0.3} />

      {result.evidence_gaps && (
        <AnimCard delay={0.33} ttl="Пробелы в доказательной базе">
          <div className="gap-txt">{result.evidence_gaps}</div>
        </AnimCard>
      )}

      <div className="disc result-card-anim" style={{ animationDelay: "0.36s" }}>
        <div className="disc-lbl">⚠ Дисклеймер</div>
        <div className="disc-txt">{result.disclaimer}</div>
      </div>
    </div>
  );
}

// ─── CASE RESULT ──────────────────────────────────────────────────────────

function CaseResult({ result, caseText }) {
  return (
    <div className="results">
      <div className="q-echo">
        <span className="q-echo-lbl">Кейс</span>
        <span className="q-echo-txt">{caseText}</span>
      </div>
      <div className="result-actions"><CopyBtn result={result} /></div>
      <ConfBlock level={result.confidence_level} rationale={result.confidence_rationale} delay={0} />

      {result.case_summary && (
        <AnimCard delay={0.05} ttl="Резюме кейса">
          <div className="brief">{result.case_summary}</div>
        </AnimCard>
      )}

      {result.diagnosis && (
        <AnimCard delay={0.09} ttl="Диагностика">
          <div className="diag-block">
            <div className="diag-card">
              <div className="diag-lbl">Рабочий диагноз</div>
              <div className="diag-val">{result.diagnosis.primary}</div>
              {result.diagnosis.rationale && (
                <div style={{ fontSize: 11.5, color: "#7D8E9A", marginTop: 6, lineHeight: 1.5 }}>{result.diagnosis.rationale}</div>
              )}
            </div>
            {result.diagnosis.differential?.length > 0 && (
              <div className="diag-card">
                <div className="diag-lbl">Дифф. диагноз</div>
                <div className="diag-diff">
                  {result.diagnosis.differential.map((d, i) => (
                    <div key={i} className="diag-diff-item">{d}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AnimCard>
      )}

      {result.workup?.length > 0 && (
        <AnimCard delay={0.12} ttl="Дообследование">
          <div className="refers">
            {result.workup.map((w, i) => (
              <div key={i} className="refer">
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>→</span>
                <span className="refer-text">{w}</span>
              </div>
            ))}
          </div>
        </AnimCard>
      )}

      {result.treatment_plan?.length > 0 && (
        <AnimCard delay={0.15} ttl="План лечения">
          {result.treatment_plan.map((phase, i) => (
            <div key={i} className="tactic" style={{ marginBottom: i < result.treatment_plan.length - 1 ? 10 : 0 }}>
              <div className="tactic-head">
                <div className="tactic-name">{phase.phase}</div>
                {phase.timing && <div className="tactic-when">{phase.timing}</div>}
              </div>
              <div className="tactic-body">
                <ol className="tactic-steps">
                  {(phase.steps || []).map((s, j) => (
                    <li key={j} className="tactic-step">
                      <span className="tactic-step-n">{j + 1}</span><span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </AnimCard>
      )}

      {result.medications?.length > 0 && (
        <AnimCard delay={0.18} ttl="Препараты">
          {result.medications.map((med, i) => <MedCard key={i} med={med} />)}
        </AnimCard>
      )}

      {result.materials?.length > 0 && (
        <AnimCard delay={0.21} ttl="Материалы">
          {result.materials.map((mat, i) => <MatCard key={i} mat={mat} />)}
        </AnimCard>
      )}

      <PatientBlock text={result.patient_explanation} delay={0.24} />

      {result.prognosis && (
        <AnimCard delay={0.27} ttl="Прогноз">
          <div className="prog-grid">
            <div className="prog-item">
              <div className="prog-lbl">Ближайший</div>
              <div className="prog-val">{result.prognosis.short_term}</div>
            </div>
            <div className="prog-item">
              <div className="prog-lbl">Долгосрочный</div>
              <div className="prog-val">{result.prognosis.long_term}</div>
            </div>
          </div>
        </AnimCard>
      )}

      {result.red_flags?.length > 0 && (
        <AnimCard delay={0.3} ttl="Red flags">
          <div className="flags">
            {result.red_flags.map((f, i) => (
              <div key={i} className="flag">
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1, color: "#991B1B" }}>⚑</span>
                <span className="flag-text">{f}</span>
              </div>
            ))}
          </div>
        </AnimCard>
      )}

      <SourcesBlock sources={result.sources} delay={0.33} />

      {result.evidence_gaps && (
        <AnimCard delay={0.36} ttl="Пробелы в доказательной базе">
          <div className="gap-txt">{result.evidence_gaps}</div>
        </AnimCard>
      )}

      <div className="disc result-card-anim" style={{ animationDelay: "0.39s" }}>
        <div className="disc-lbl">⚠ Дисклеймер</div>
        <div className="disc-txt">{result.disclaimer}</div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────

export default function DentEvidence() {
  // Mode
  const [mode, setMode] = useState("standard");

  // Standard mode state
  const [activeSpec,   setActiveSpec]   = useState("all");
  const [searchVal,    setSearchVal]    = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [loadPhase,    setLoadPhase]    = useState(0);
  const [result,       setResult]       = useState(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [error,        setError]        = useState(null);

  // Case mode state
  const [caseText,       setCaseText]       = useState("");
  const [caseStage,      setCaseStage]      = useState("input");
  const [caseLoading,    setCaseLoading]    = useState(false);
  const [caseLoadPhase,  setCaseLoadPhase]  = useState(0);
  const [clarifyData,    setClarifyData]    = useState(null);
  const [clarifyAnswers, setClarifyAnswers] = useState({});
  const [caseResult,     setCaseResult]     = useState(null);
  const [caseError,      setCaseError]      = useState(null);

  // History (session only)
  const [history,     setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const searchRef  = useRef(null);
  const resultsRef = useRef(null);
  const caseRef    = useRef(null);

  // Inject styles
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Auto-resize case textarea
  useEffect(() => {
    const ta = caseRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [caseText]);

  // Progress phase ticker
  const startPhases = (setPhase, phases, totalMs = 8000) => {
    setPhase(0);
    const interval = totalMs / phases.length;
    const timers = phases.map((_, i) => setTimeout(() => setPhase(i), i * interval));
    return () => timers.forEach(clearTimeout);
  };

  // Add to history
  const addHistory = (text, modeLabel) => {
    setHistory(prev => [
      { text: text.slice(0, 80), mode: modeLabel, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) },
      ...prev.slice(0, 4),
    ]);
  };

  // Filtered scenarios
  const filteredScenarios = SCENARIOS.filter(sc => {
    const specMatch = activeSpec === "all" || sc.spec === activeSpec;
    if (!searchVal.trim()) return specMatch;
    const q = searchVal.toLowerCase();
    return specMatch && (sc.title.toLowerCase().includes(q) || sc.prompt.toLowerCase().includes(q) || sc.specLabel.toLowerCase().includes(q));
  });

  // ── Standard submit ──
  const submitStandard = async (question) => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLastQuestion(q);
    setSearchVal(q);
    setShowDropdown(false);
    addHistory(q, "вопрос");
    const stopPhases = startPhases(setLoadPhase, LOADING_PHASES_STANDARD, 9000);
    try {
      const data = await callClaude(SYSTEM_STANDARD, q, 2500);
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(e.message);
    } finally {
      stopPhases();
      setLoading(false);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitStandard(searchVal); }
    if (e.key === "Escape") setShowDropdown(false);
  };

  // ── Case analyze ──
  const analyzeCase = async () => {
    const q = caseText.trim();
    if (!q || caseStage !== "input") return;
    setCaseStage("loading");
    setCaseError(null);
    setCaseLoading(true);
    const stopPhases = startPhases(setCaseLoadPhase, LOADING_PHASES_CASE, 12000);
    try {
      const data = await callClaude(SYSTEM_CASE_ANALYZE, q, 500);
      if (data.has_enough_info || !data.clarifications_needed?.length) {
        await submitCaseFull(q, {}, stopPhases);
      } else {
        stopPhases();
        setCaseLoading(false);
        setClarifyData(data);
        setClarifyAnswers({});
        setCaseStage("clarifying");
      }
    } catch (e) {
      stopPhases();
      setCaseError(e.message);
      setCaseStage("input");
      setCaseLoading(false);
    }
  };

  const submitCaseFull = async (text, answers, stopPhasesFn) => {
    const stopPhases = stopPhasesFn || startPhases(setCaseLoadPhase, LOADING_PHASES_CASE, 12000);
    setCaseStage("loading");
    setCaseLoading(true);
    addHistory(text, "кейс");
    const answerStr = Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join("\n");
    const userMsg = `Кейс: ${text}${answerStr ? `\n\nУточнения:\n${answerStr}` : ""}`;
    try {
      const raw = await callClaude(SYSTEM_CASE_FULL, userMsg, 400);
      const data = expandCaseResult(raw);
      setCaseResult(data);
      setCaseStage("result");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setCaseError(e.message);
      setCaseStage(clarifyData ? "clarifying" : "input");
    } finally {
      stopPhases();
      setCaseLoading(false);
    }
  };

  const handleClarifySubmit = () => submitCaseFull(caseText, clarifyAnswers, null);

  const resetCase = () => {
    setCaseText(""); setCaseStage("input"); setClarifyData(null);
    setClarifyAnswers({}); setCaseResult(null); setCaseError(null); setCaseLoading(false);
  };

  const resetStandard = () => {
    setSearchVal(""); setResult(null); setError(null); setShowDropdown(false); setLoading(false);
  };

  const tagClass = (color) => {
    const map = { red: "dd-tag-red", amber: "dd-tag-amber", blue: "dd-tag-blue", gray: "dd-tag-gray" };
    return `dd-tag ${map[color] || "dd-tag-blue"}`;
  };

  const scTagStyle = (color) => ({
    red:   { background: "#FEE2E2", color: "#991B1B" },
    amber: { background: "#FEF3C7", color: "#92400E" },
    blue:  { background: "#D8EEF4", color: "#0A5F73" },
    gray:  { background: "#EDE9E2", color: "#7D8E9A" },
  }[color] || { background: "#D8EEF4", color: "#0A5F73" });

  // ── Render ──
  return (
    <div className="wrap">

      {/* Header */}
      <div className="hdr">
        <div className="hdr-left">
          <div className="hdr-row">
            <div className="logo">Dent<em>Evidence</em></div>
            <span className="badge">v0.4</span>
          </div>
          <div className="tagline">AI clinical decision support · Доказательная стоматология · RU / EN</div>
        </div>
        {history.length > 0 && (
          <button className="hist-btn" onClick={() => setShowHistory(v => !v)}>
            <div className="hist-dot" />
            История ({history.length})
          </button>
        )}
      </div>

      {/* History panel */}
      {showHistory && history.length > 0 && (
        <div className="hist-panel">
          <div className="hist-header">
            <span className="hist-title">Последние запросы</span>
            <button className="hist-clear" onClick={() => { setHistory([]); setShowHistory(false); }}>Очистить</button>
          </div>
          <div className="hist-items">
            {history.map((h, i) => (
              <div key={i} className="hist-item" onClick={() => {
                setShowHistory(false);
                if (h.mode === "кейс") { setMode("case"); setCaseText(h.text); resetCase(); setTimeout(() => setCaseText(h.text), 10); }
                else { setMode("standard"); resetStandard(); submitStandard(h.text); }
              }}>
                <span className={`hist-mode ${h.mode === "кейс" ? "hist-mode-case" : ""}`}>{h.mode}</span>
                <span className="hist-text">{h.text}</span>
                <span className="hist-time">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode tabs */}
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === "standard" ? "active" : ""}`}
          onClick={() => { setMode("standard"); resetCase(); setShowHistory(false); }}>
          Клинический вопрос
        </button>
        <button className={`mode-tab ${mode === "case" ? "active" : ""}`}
          onClick={() => { setMode("case"); resetStandard(); setShowHistory(false); }}>
          Разбор кейса
        </button>
      </div>

      {/* ══════════════ STANDARD MODE ══════════════ */}
      {mode === "standard" && !result && !loading && (
        <>
          {/* Search */}
          <div className="search-box" onClick={() => searchRef.current?.focus()}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <div className="search-inner">
              <input ref={searchRef} className="search-input"
                placeholder="Выберите вариант ниже или напишите свой вопрос..."
                value={searchVal}
                onChange={e => { setSearchVal(e.target.value); setShowDropdown(e.target.value.length > 0); }}
                onKeyDown={handleSearchKey}
                onFocus={() => { if (searchVal) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              <div className="search-hint">Полировка пломбы · подготовка под протез · боль после лечения · перелом файла · и другое</div>
            </div>
            <span className="search-kbd">Enter ↵</span>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="dropdown">
              {filteredScenarios.length > 0 && (
                <div className="dd-section">
                  <div className="dd-sec-lbl">СОВПАДЕНИЯ</div>
                  {filteredScenarios.slice(0, 5).map(sc => (
                    <div key={sc.id} className="dd-item" onMouseDown={() => submitStandard(sc.prompt)}>
                      <span className="dd-spec">{sc.specLabel}</span>
                      <div style={{ flex: 1 }}>
                        <div className="dd-title">{sc.title}</div>
                        <div className="dd-preview">{sc.prompt}</div>
                      </div>
                      <span className={tagClass(sc.tagColor)}>{sc.tag}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="dd-section">
                <div className="dd-free" onMouseDown={() => submitStandard(searchVal)}>
                  <div className="dd-free-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                  <div>
                    <div className="dd-free-main">Спросить: «{searchVal.slice(0, 55)}{searchVal.length > 55 ? "…" : ""}»</div>
                    <div className="dd-free-sub">Нажмите Enter или кликните</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specialty pills */}
          <div className="spec-scroll">
            {SPECIALTIES.map(sp => (
              <button key={sp.id} className={`spec-btn ${activeSpec === sp.id ? "active" : ""}`}
                onClick={() => setActiveSpec(sp.id)}>{sp.label}</button>
            ))}
          </div>

          {/* Scenario cards */}
          <div className="scenarios">
            {filteredScenarios.slice(0, 8).map(sc => (
              <div key={sc.id} className="sc-card" onClick={() => submitStandard(sc.prompt)}>
                <span className="sc-tag" style={scTagStyle(sc.tagColor)}>{sc.tag}</span>
                <div className="sc-title">{sc.title}</div>
                <div className="sc-q">{sc.prompt}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Standard: loading */}
      {mode === "standard" && loading && (
        <ProgressLoader phases={LOADING_PHASES_STANDARD} activePhase={loadPhase} />
      )}

      {/* Standard: error */}
      {error && mode === "standard" && (
        <div className="err" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div><strong>⚠ Ошибка</strong> — {error}</div>
          <button onClick={() => setError(null)}
            style={{ flexShrink: 0, fontSize: 11, color: "#991B1B", background: "none", border: "1px solid #FCA5A5", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-sans, DM Sans)" }}>
            Закрыть
          </button>
        </div>
      )}

      {/* Standard: result */}
      {mode === "standard" && result && (
        <>
          <div ref={resultsRef}><StandardResult result={result} question={lastQuestion} /></div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <button className="sbtn sbtn-ghost" onClick={resetStandard}>← Новый вопрос</button>
          </div>
        </>
      )}

      {/* ══════════════ CASE MODE ══════════════ */}
      {mode === "case" && (
        <>
          {/* Input stage */}
          {caseStage === "input" && (
            <>
              <div className="case-intro">
                Опишите клиническую ситуацию как коллеге — одной фразой или подробно.<br/>
                AI задаст уточняющие вопросы если нужно.
              </div>
              <div className="case-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A5F73" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <div style={{ flex: 1 }}>
                  <textarea ref={caseRef} className="case-textarea"
                    placeholder="Например: при препарировании вскрылся рог пульпы, зуб 26, пациент 34 года, витальный зуб"
                    value={caseText}
                    onChange={e => setCaseText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); analyzeCase(); } }}
                  />
                  <div className="case-actions">
                    <span className="case-hint">Enter — отправить · Shift+Enter — новая строка</span>
                    <button className="sbtn" onClick={analyzeCase} disabled={!caseText.trim()}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                      Разобрать кейс
                    </button>
                  </div>
                </div>
              </div>

              {/* Case examples */}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#B0ADA8", letterSpacing: "1px", textTransform: "uppercase" }}>Примеры</span>
              </div>
              <div className="scenarios" style={{ marginBottom: 0 }}>
                {[
                  { title: "Вскрытие пульпы",    text: "При препарировании вскрылся рог пульпы, зуб 26, пациент 34 года, витальный" },
                  { title: "Боль после лечения",  text: "Сильная боль на следующий день после пломбирования канала зуба 36" },
                  { title: "Ранняя потеря импланта", text: "Имплант начал шататься через 3 недели после установки, боли нет" },
                  { title: "Периимплантит",       text: "Кровоточивость и глубина кармана 5 мм вокруг импланта, установленного 2 года назад" },
                ].map((ex, i) => (
                  <div key={i} className="sc-card" onClick={() => setCaseText(ex.text)}>
                    <div className="sc-title">{ex.title}</div>
                    <div className="sc-q">{ex.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Case: loading */}
          {caseStage === "loading" && (
            <ProgressLoader phases={LOADING_PHASES_CASE} activePhase={caseLoadPhase} />
          )}

          {/* Case: clarifying */}
          {caseStage === "clarifying" && clarifyData && (
            <div className="clarify-block">
              <div className="card-ttl" style={{ marginBottom: 14 }}>Уточняющие вопросы</div>
              {clarifyData.detected_situation && (
                <div className="clarify-detected">Понял ситуацию: {clarifyData.detected_situation}</div>
              )}
              {(clarifyData.clarifications_needed || []).map((cl, i) => (
                <div key={i} className="clarify-q">
                  <div className="clarify-q-text">{cl.question}</div>
                  <div className="clarify-chips">
                    {(cl.options || []).map((opt, j) => (
                      <div key={j}
                        className={`clarify-chip ${clarifyAnswers[cl.question] === opt ? "sel" : ""}`}
                        onClick={() => setClarifyAnswers(prev => ({ ...prev, [cl.question]: opt }))}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="clarify-footer">
                <button className="sbtn sbtn-ghost" onClick={resetCase}>← Назад</button>
                <button className="sbtn" onClick={handleClarifySubmit}>Получить рекомендации →</button>
              </div>
            </div>
          )}

          {/* Case: error */}
          {caseError && caseStage !== "loading" && (
            <div className="err" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <strong>⚠ Ошибка</strong> — {caseError.includes("формат") || caseError.includes("format")
                  ? "Ответ получился слишком длинным и был обрезан. Попробуйте упростить описание или отправить снова."
                  : caseError}
              </div>
              <button onClick={() => { setCaseError(null); setCaseStage("input"); }}
                style={{ flexShrink: 0, fontSize: 11, color: "#991B1B", background: "none", border: "1px solid #FCA5A5", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-sans, DM Sans)" }}>
                Попробовать снова
              </button>
            </div>
          )}

          {/* Case: result */}
          {caseStage === "result" && caseResult && (
            <>
              <div ref={resultsRef}><CaseResult result={caseResult} caseText={caseText} /></div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <button className="sbtn sbtn-ghost" onClick={resetCase}>← Новый кейс</button>
              </div>
            </>
          )}
        </>
      )}

      <div className="footer">
        DentEvidence v0.4 · AI Clinical Decision Support · Claude AI<br/>
        PubMed · Cochrane · ADA · ESE · AAE · EFP · AAP · NICE · WHO<br/>
        Только для лицензированных стоматологов · Не заменяет клиническое суждение
      </div>
    </div>
  );
}
