import { career } from "./documents/career"
import { careerCategory } from "./documents/career-category"
import { program } from "./documents/program"
import { scholarship } from "./documents/scholarship"
import { resource } from "./documents/resource"
import { professionalOrganization } from "./documents/professional-organization"
import { quiz } from "./documents/quiz"
import { siteSettings } from "./documents/site-settings"

import { localizedString } from "./objects/localized-string"
import { localizedText } from "./objects/localized-text"
import { localizedPortableText } from "./objects/localized-portable-text"
import { duration } from "./objects/duration"
import { moneyRange } from "./objects/money-range"
import { salary } from "./objects/salary"
import { outlook } from "./objects/outlook"

export const schemaTypes = [
  // documents
  siteSettings,
  career,
  careerCategory,
  program,
  scholarship,
  resource,
  professionalOrganization,
  quiz,

  // objects
  localizedString,
  localizedText,
  localizedPortableText,
  duration,
  moneyRange,
  salary,
  outlook
]


