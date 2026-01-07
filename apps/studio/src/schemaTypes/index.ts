import { career } from "./documents/career"
import { careerCategory } from "./documents/career-category"
import { educationalInstitution } from "./documents/educational-institution"
import { program } from "./documents/program"
import { scholarship } from "./documents/scholarship"
import { resource } from "./documents/resource"
import { professionalOrganization } from "./documents/professional-organization"
import { quiz } from "./documents/quiz"
import { siteSettings } from "./documents/site-settings"

import { localizedString } from "./objects/localized-string"
import { localizedText } from "./objects/localized-text"
import { localizedBulletList } from "./objects/localized-bullet-list"
import { localizedPortableText } from "./objects/localized-portable-text"
import { localizedPortableTextSmall } from "./objects/localized-portable-text-small"
import { duration } from "./objects/duration"
import { moneyRange } from "./objects/money-range"
import { salary } from "./objects/salary"
import { outlook } from "./objects/outlook"
import { hardFilter } from "./objects/hardFilter"
import { careerHardFilter } from "./objects/careerHardFilter"

export const schemaTypes = [
  // documents
  siteSettings,
  career,
  careerCategory,
  educationalInstitution,
  program,
  scholarship,
  resource,
  professionalOrganization,
  quiz,

  // objects
  localizedString,
  localizedText,
  localizedBulletList,
  localizedPortableText,
  localizedPortableTextSmall,
  duration,
  moneyRange,
  salary,
  outlook,
  hardFilter,
  careerHardFilter
]


