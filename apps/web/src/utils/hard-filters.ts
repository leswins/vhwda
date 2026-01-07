import type { CareerForMatching } from "../sanity/queries/careers"
import type { HardFilter } from "../ui/widgets/quiz/questions"

type CareerHardFilter = {
  type: string
  educationLevel?: string
  minSalary?: number
  dealbreakerType?: string
  excludeLicensure?: boolean
  region?: string
}

export function checkEducationCeiling(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (filter.type !== "education_ceiling" || !filter.educationLevel) {
    return false
  }

  const educationOrder: Record<string, number> = {
    FF: 0,
    CSC: 1,
    CERT: 2,
    AAS: 3,
    BACH: 4,
    GRAD: 5
  }

  const userMaxLevel = educationOrder[filter.educationLevel] ?? 999

  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.type === "education_ceiling" && careerFilter.educationLevel) {
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

export function checkLicensureRule(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (filter.type !== "licensure_rule" || !filter.excludeLicensure) {
    return false
  }

  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.type === "licensure_required") {
        return true
      }
    }
  }

  return career.licensureRequired === true
}

export function checkMinStartSalary(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (filter.type !== "min_start_salary" || !filter.salaryMin) {
    return false
  }

  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.type === "min_start_salary" && careerFilter.minSalary) {
        if (careerFilter.minSalary < filter.salaryMin) {
          return true
        }
      }
    }
  }

  const careerMinSalary = career.salary?.rangeMin
  if (careerMinSalary) {
    if (careerMinSalary < filter.salaryMin) {
      return true
    }
  }

  return false
}

export function checkDealbreaker(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (filter.type !== "dealbreaker" || !filter.dealbreakerType) {
    return false
  }

  if (career.hardFilters && career.hardFilters.length > 0) {
    for (const careerFilter of career.hardFilters) {
      if (careerFilter.type === "dealbreaker_lifting" && filter.dealbreakerType === "exclude_requires_lifting") {
        return true
      }
      if (careerFilter.type === "dealbreaker_nights_weekends" && filter.dealbreakerType === "exclude_requires_nights_weekends") {
        return true
      }
      if (careerFilter.type === "dealbreaker_blood_needles" && filter.dealbreakerType === "exclude_requires_blood_needles") {
        return true
      }
      if (careerFilter.type === "dealbreaker_high_stress" && filter.dealbreakerType === "exclude_requires_acute_stress") {
        return true
      }
    }
  }

  const hardRequirements = career.hardRequirements
  if (!hardRequirements) {
    return false
  }

  const dealbreakerMap: Record<string, keyof typeof hardRequirements> = {
    "exclude_requires_lifting": "requiresLifting",
    "exclude_requires_nights_weekends": "requiresNightsWeekends",
    "exclude_requires_blood_needles": "requiresBloodNeedles",
    "exclude_requires_acute_stress": "requiresAcuteStress"
  }

  const careerField = dealbreakerMap[filter.dealbreakerType]
  if (!careerField) {
    return false
  }

  return hardRequirements[careerField] === true
}

export function checkRegion(
  filter: HardFilter,
  career: CareerForMatching
): boolean {
  if (filter.type !== "region" || !filter.region) {
    return false
  }

  return false
}

export function shouldExcludeCareer(
  hardFilters: HardFilter[],
  career: CareerForMatching
): boolean {
  if (!hardFilters || hardFilters.length === 0) {
    return false
  }

  for (const filter of hardFilters) {
    if (!filter.type) continue

    let excluded = false

    switch (filter.type) {
      case "education_ceiling":
        excluded = checkEducationCeiling(filter, career)
        break
      case "licensure_rule":
        excluded = checkLicensureRule(filter, career)
        break
      case "min_start_salary":
        excluded = checkMinStartSalary(filter, career)
        break
      case "dealbreaker":
        excluded = checkDealbreaker(filter, career)
        break
      case "region":
        excluded = checkRegion(filter, career)
        break
    }

    if (excluded) {
      return true
    }
  }

  return false
}

export function collectHardFiltersFromAnswers(
  selectedAnswers: Record<string, string | string[]>,
  questions: Array<{
    id: string
    type?: string
    options: Array<{
      id: string
      hardFilter?: HardFilter
    }>
  }>
): HardFilter[] {
  const filters: HardFilter[] = []
  const seenFilters = new Set<string>()

  for (const [questionId, answerIds] of Object.entries(selectedAnswers)) {
    const question = questions.find(q => q.id === questionId)
    if (!question) continue

    const answerIdArray = Array.isArray(answerIds) ? answerIds : [answerIds]

    for (const answerId of answerIdArray) {
      const option = question.options.find(o => o.id === answerId)
      if (!option || !option.hardFilter) continue

      const filterKey = `${option.hardFilter.type}-${JSON.stringify({
        educationLevel: option.hardFilter.educationLevel,
        excludeLicensure: option.hardFilter.excludeLicensure,
        salaryMin: option.hardFilter.salaryMin,
        dealbreakerType: option.hardFilter.dealbreakerType,
        region: option.hardFilter.region
      })}`
      
      if (!seenFilters.has(filterKey)) {
        filters.push(option.hardFilter)
        seenFilters.add(filterKey)
      }
    }
  }

  return filters
}

