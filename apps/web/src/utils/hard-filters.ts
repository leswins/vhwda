import type { CareerForMatching } from "../sanity/queries/careers"
import type { HardFilter } from "../ui/widgets/quiz/questions"

type CareerHardFilter = {
  requiresLicensure?: boolean
  requiresLifting?: boolean
  requiresNightsWeekends?: boolean
  requiresBloodNeedles?: boolean
  requiresAcuteHighStress?: boolean
  hasMinimumEducation?: boolean
  educationLevel?: string
  hasMinimumSalary?: boolean
  region?: string
  type?: string // Legacy field for backward compatibility
  minSalary?: number // Legacy field
  dealbreakerType?: string // Legacy field
  excludeLicensure?: boolean // Legacy field
}

const educationOrder: Record<string, number> = {
  FF: 0,
  CSC: 1,
  CERT: 2,
  AAS: 3,
  BACH: 4,
  GRAD: 5
}

function checkEducationCeiling(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  const educationLevel = filter.educationLevel
  
  if (!educationLevel || (!filter.hasMinimumEducation && filter.type !== "education_ceiling")) {
    return false
  }

  const userMaxLevel = educationOrder[educationLevel] ?? 999

  // Check hardRequirements first (new format)
  if (career.hardRequirements?.hasMinimumEducation && career.hardRequirements.educationLevel) {
    const careerMinLevel = educationOrder[career.hardRequirements.educationLevel] ?? 999
    if (careerMinLevel > userMaxLevel) {
      return true
    }
  }

  // Legacy support: check hardFilters array
  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if ((careerFilter.hasMinimumEducation || careerFilter.type === "education_ceiling") && careerFilter.educationLevel) {
        const careerMinLevel = educationOrder[careerFilter.educationLevel] ?? 999
        if (careerMinLevel > userMaxLevel) {
          return true
        }
      }
    }
  }

  const careerEducation = career.educationMin
  if (careerEducation) {
    const careerMinLevel = educationOrder[careerEducation] ?? 999
    if (careerMinLevel > userMaxLevel) {
      return true
    }
  }

  return false
}

function checkLicensureRule(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  const shouldCheck = filter.requiresLicensure || (filter.type === "licensure_rule" && filter.excludeLicensure)
  
  if (!shouldCheck) {
    return false
  }

  // Check hardRequirements first (new format)
  if (career.hardRequirements?.requiresLicensure) {
    return true
  }

  // Legacy support: check hardFilters array
  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.requiresLicensure || careerFilter.type === "licensure_required") {
        return true
      }
    }
  }

  return career.licensureRequired === true
}

function checkMinStartSalary(
  filter: HardFilter,
  career: CareerForMatching,
  userMinSalary?: number
): boolean {
  const shouldCheck = filter.hasMinimumSalary || filter.type === "min_start_salary"
  
  if (!shouldCheck) {
    return false
  }

  const filterSalaryMin = filter.salaryMin || userMinSalary
  
  if (!filterSalaryMin) {
    return false
  }

  // Check hardRequirements first (new format)
  if (career.hardRequirements?.hasMinimumSalary) {
    const careerMinSalary = career.salary?.rangeMin
    if (careerMinSalary !== undefined && careerMinSalary < filterSalaryMin) {
      return true
    }
  }

  // Legacy support: check hardFilters array
  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.hasMinimumSalary || careerFilter.type === "min_start_salary") {
        const careerMinSalary = career.salary?.rangeMin
        if (careerMinSalary === undefined) {
          continue
        }
        if (careerMinSalary < filterSalaryMin) {
          return true
        }
      }
    }
  }

  const careerMinSalary = career.salary?.rangeMin
  if (careerMinSalary !== undefined && careerMinSalary < filterSalaryMin) {
    return true
  }

  return false
}

function checkDealbreaker(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  let dealbreakerType: string | undefined

  if (filter.requiresLifting) {
    dealbreakerType = "exclude_requires_lifting"
  } else if (filter.requiresNightsWeekends) {
    dealbreakerType = "exclude_requires_nights_weekends"
  } else if (filter.requiresBloodNeedles) {
    dealbreakerType = "exclude_requires_blood_needles"
  } else if (filter.requiresAcuteHighStress) {
    dealbreakerType = "exclude_requires_acute_stress"
  } else if (filter.type === "dealbreaker") {
    dealbreakerType = filter.dealbreakerType
  }

  if (!dealbreakerType) {
    return false
  }

  // Check hardRequirements first (new format)
  const hardRequirements = career.hardRequirements
  if (hardRequirements) {
    if (hardRequirements.requiresLifting && dealbreakerType === "exclude_requires_lifting") {
      return true
    }
    if (hardRequirements.requiresNightsWeekends && dealbreakerType === "exclude_requires_nights_weekends") {
      return true
    }
    if (hardRequirements.requiresBloodNeedles && dealbreakerType === "exclude_requires_blood_needles") {
      return true
    }
    if (hardRequirements.requiresAcuteStress && dealbreakerType === "exclude_requires_acute_stress") {
      return true
    }
  }

  // Legacy support: check hardFilters array
  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.requiresLifting && dealbreakerType === "exclude_requires_lifting") {
        return true
      }
      if (careerFilter.requiresNightsWeekends && dealbreakerType === "exclude_requires_nights_weekends") {
        return true
      }
      if (careerFilter.requiresBloodNeedles && dealbreakerType === "exclude_requires_blood_needles") {
        return true
      }
      if (careerFilter.requiresAcuteHighStress && dealbreakerType === "exclude_requires_acute_stress") {
        return true
      }
      // Legacy support
      if (careerFilter.type === "dealbreaker_lifting" && dealbreakerType === "exclude_requires_lifting") {
        return true
      }
      if (careerFilter.type === "dealbreaker_nights_weekends" && dealbreakerType === "exclude_requires_nights_weekends") {
        return true
      }
      if (careerFilter.type === "dealbreaker_blood_needles" && dealbreakerType === "exclude_requires_blood_needles") {
        return true
      }
      if (careerFilter.type === "dealbreaker_high_stress" && dealbreakerType === "exclude_requires_acute_stress") {
        return true
      }
    }
  }

  // Legacy support: check old hardRequirements format
  if (hardRequirements) {
    const dealbreakerMap: Record<string, keyof typeof hardRequirements> = {
      "exclude_requires_lifting": "requiresLifting",
      "exclude_requires_nights_weekends": "requiresNightsWeekends",
      "exclude_requires_blood_needles": "requiresBloodNeedles",
      "exclude_requires_acute_stress": "requiresAcuteStress"
    }

    const careerField = dealbreakerMap[dealbreakerType]
    if (careerField && hardRequirements[careerField] === true) {
      return true
    }
  }

  return false
}

function checkRegion(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (!filter.region || (filter.type !== "region" && !filter.region)) {
    return false
  }

  return false
}

export function shouldExcludeCareer(
  hardFilters: HardFilter[],
  career: CareerForMatching,
  userMinSalary?: number
): boolean {
  if (!hardFilters || hardFilters.length === 0) {
    return false
  }

  for (const filter of hardFilters) {
    // Education ceiling filter removed - no longer excluding careers based on education level
    // if (filter.hasMinimumEducation || filter.type === "education_ceiling") {
    //   if (checkEducationCeiling(filter, career)) {
    //     console.log(`      🚫 Hard filter: Education ceiling - User max: ${filter.educationLevel}, Career requires higher`)
    //     return true
    //   }
    // }

    if (filter.requiresLicensure || filter.type === "licensure_rule") {
      if (checkLicensureRule(filter, career)) {
        return true
      }
    }

    if (filter.hasMinimumSalary || filter.type === "min_start_salary") {
      if (checkMinStartSalary(filter, career, userMinSalary)) {
        return true
      }
    }

    if (
      filter.requiresLifting ||
      filter.requiresNightsWeekends ||
      filter.requiresBloodNeedles ||
      filter.requiresAcuteHighStress ||
      filter.type === "dealbreaker"
    ) {
      if (checkDealbreaker(filter, career)) {
        return true
      }
    }

    if (filter.region || filter.type === "region") {
      if (checkRegion(filter, career)) {
        return true
      }
    }
  }

  return false
}

function extractSalaryFromLabel(label: string): number | undefined {
  const salaryPattern = /\$?\s*(\d{1,3}(?:,\d{3})*)/g
  const matches = [...label.matchAll(salaryPattern)]
  
  if (matches.length > 0) {
    const firstMatch = matches[0]
    const value = parseInt(firstMatch[1].replace(/,/g, ""), 10)
    return isNaN(value) ? undefined : value
  }
  
  return undefined
}

export function collectHardFiltersFromAnswers(
  selectedAnswers: Record<string, string | string[]>,
  questions: Array<{
    id: string
    type?: string
    options: Array<{
      id: string
      label?: string
      hardFilter?: HardFilter
    }>
  }>
): HardFilter[] {
  const filters: HardFilter[] = []
  const seenFilterKeys = new Set<string>()

  for (const [questionId, answerIds] of Object.entries(selectedAnswers)) {
    const question = questions.find(q => q.id === questionId)
    if (!question) continue

    const answerIdArray = Array.isArray(answerIds) ? answerIds : [answerIds]

    for (const answerId of answerIdArray) {
      const option = question.options.find(o => o.id === answerId)
      if (!option || !option.hardFilter) continue

      const filter = { ...option.hardFilter }
      
      if (filter.hasMinimumSalary && !filter.salaryMin && option.label) {
        const extractedSalary = extractSalaryFromLabel(option.label)
        if (extractedSalary) {
          filter.salaryMin = extractedSalary
        }
      }
      
      const filterKey = JSON.stringify({
        requiresLicensure: filter.requiresLicensure,
        requiresLifting: filter.requiresLifting,
        requiresNightsWeekends: filter.requiresNightsWeekends,
        requiresBloodNeedles: filter.requiresBloodNeedles,
        requiresAcuteHighStress: filter.requiresAcuteHighStress,
        hasMinimumEducation: filter.hasMinimumEducation,
        educationLevel: filter.educationLevel,
        hasMinimumSalary: filter.hasMinimumSalary,
        salaryMin: filter.salaryMin,
        region: filter.region,
        type: filter.type,
        excludeLicensure: filter.excludeLicensure,
        dealbreakerType: filter.dealbreakerType
      })
      
      if (!seenFilterKeys.has(filterKey)) {
        filters.push(filter)
        seenFilterKeys.add(filterKey)
      }
    }
  }

  return filters
}
