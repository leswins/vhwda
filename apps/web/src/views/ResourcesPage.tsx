import React, { useEffect, useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PlanYourNextStepsSection, type ResourceSectionId } from "../ui/widgets/PlanYourNextStepsSection"
import { trackEvent } from "../utils/analytics"

const ArrowIndicator = () => (
  <div
    className="relative flex h-full aspect-square items-center justify-center overflow-hidden self-stretch"
    aria-hidden="true"
  >
    <div className="absolute inset-0 top-[-5px] -translate-y-full bg-foreground transition-transform duration-300 ease-out group-hover:translate-y-0" />
    <svg
      className="relative z-10 h-[22px] w-[22px] text-foreground transition-colors duration-300 group-hover:text-surface"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 7L10 13L16 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

const ShortcutIconHelp = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.07787 40.2042L5.9662 42L0 31.6668L3.11167 29.871H3.10985C3.5515 29.6192 4.11359 29.7688 4.37093 30.2086L9.41346 38.9449C9.66714 39.3865 9.51566 39.9504 9.07583 40.2041L9.07787 40.2042ZM37.5353 29.537C37.5335 28.9256 37.194 28.3653 36.652 28.0806C35.7486 27.5896 34.6426 27.6681 33.8177 28.2795C33.8068 28.2868 33.7958 28.2923 33.7849 28.2978L25.5065 32.8074C23.9534 33.9663 20.82 33.7454 15.9307 32.1321C15.7573 32.081 15.6113 31.9624 15.5274 31.8036C15.4434 31.643 15.427 31.4569 15.4836 31.2853C15.5401 31.1137 15.6642 30.9714 15.8267 30.8929C15.9891 30.8126 16.1752 30.8035 16.345 30.8655C18.1499 31.5098 20.0206 31.9496 21.9239 32.1777C22.8656 31.6831 23.3948 31.1539 23.4149 30.683C23.4368 30.1647 22.8637 29.5023 21.8454 28.869C18.8651 27.0203 13.204 26.0037 11.3772 26.9892C11.2093 27.0933 9.33134 28.2229 5.94407 30.2688L10.0029 37.2988L10.4866 36.9867V36.9849C10.7713 36.7385 11.1728 36.6728 11.5213 36.8188C11.5724 36.8371 11.6363 36.859 11.7221 36.8827L19.7304 39.0818C19.745 39.0855 19.7596 39.091 19.7724 39.0946V39.0964C21.0097 39.6001 22.415 39.4742 23.5447 38.7588L23.5556 38.7515L35.9109 31.3001H35.909C35.9309 31.2873 35.9528 31.2763 35.9747 31.2654C36.942 30.8219 37.495 30.2069 37.5296 29.5371L37.5353 29.537Z" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M40.2852 8.79584L43.3969 7L49.3631 17.3332L46.2514 19.129H46.2532C45.8116 19.3808 45.2495 19.2312 44.9921 18.7914L39.9496 10.0551C39.6959 9.61346 39.8474 9.04955 40.2872 8.79586L40.2852 8.79584ZM11.8278 19.463C11.8296 20.0744 12.169 20.6347 12.7111 20.9194C13.6145 21.4104 14.7204 21.3319 15.5453 20.7205C15.5563 20.7132 15.5672 20.7077 15.5782 20.7022L23.8566 16.1926C25.4096 15.0337 28.5431 15.2546 33.4324 16.8679C33.6058 16.919 33.7518 17.0376 33.8357 17.1964C33.9197 17.357 33.9361 17.5432 33.8795 17.7147C33.8229 17.8863 33.6988 18.0286 33.5364 18.1071C33.374 18.1874 33.1878 18.1965 33.0181 18.1345C31.2131 17.4902 29.3425 17.0504 27.4392 16.8223C26.4975 17.3169 25.9683 17.8461 25.9482 18.317C25.9263 18.8353 26.4993 19.4977 27.5177 20.131C30.4979 21.9797 36.1591 22.9963 37.9859 22.0108C38.1538 21.9067 40.0317 20.7771 43.419 18.7312L39.3602 11.7012L38.8765 12.0133V12.0151C38.5918 12.2615 38.1903 12.3272 37.8417 12.1812C37.7906 12.1629 37.7268 12.141 37.641 12.1173L29.6326 9.91817C29.618 9.91452 29.6034 9.90905 29.5907 9.9054V9.90357C28.3533 9.39988 26.9481 9.5258 25.8184 10.2412L25.8074 10.2485L13.4522 17.6999H13.454C13.4321 17.7127 13.4102 17.7237 13.3883 17.7346C12.4211 18.1781 11.8681 18.7931 11.8334 19.4629L11.8278 19.463Z" fill="currentColor" />
  </svg>
)

const ShortcutIconDoctor = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6856 33.8703C12.2444 36.4872 13.7521 38.8047 15.918 40.376C18.084 41.9474 20.7549 42.6615 23.416 42.3807C26.0771 42.0999 28.5402 40.844 30.3304 38.8552C32.1207 36.8664 33.1114 34.2853 33.1118 31.6094V27.2597C35.6041 26.8028 37.8577 25.4875 39.4813 23.5421C41.105 21.5968 41.9961 19.1443 42 16.6105V11.0553C41.9985 10.2455 41.6762 9.46917 41.1035 8.89651C40.5308 8.32384 39.7545 8.00147 38.9447 8H34.5006V11.8886H38.1114V16.6105C38.1114 18.4521 37.3798 20.2183 36.0776 21.5206C34.7753 22.8228 33.0091 23.5544 31.1675 23.5544C29.3258 23.5544 27.5596 22.8228 26.2574 21.5206C24.9551 20.2183 24.2235 18.4521 24.2235 16.6105V11.8886H27.8344V8H23.3903C22.5804 8.00147 21.8041 8.32384 21.2315 8.89651C20.6588 9.46917 20.3364 10.2455 20.3349 11.0553V16.6105C20.3388 19.1443 21.23 21.5968 22.8536 23.5421C24.4772 25.4875 26.7308 26.8028 29.2232 27.2597V31.6094C29.2243 33.2697 28.6304 34.8755 27.5493 36.1356C26.4681 37.3957 24.9713 38.2267 23.33 38.478C21.6888 38.7292 20.0119 38.3841 18.6033 37.5051C17.1947 36.6262 16.1476 35.2716 15.652 33.687C17.0734 33.1484 18.2563 32.1206 18.988 30.7882C19.7197 29.4558 19.9524 27.9062 19.6441 26.4176C19.3359 24.9291 18.507 23.5993 17.3063 22.6671C16.1057 21.7348 14.6119 21.2612 13.0935 21.3314C11.575 21.4016 10.1313 22.0109 9.02177 23.0499C7.91222 24.089 7.20952 25.4896 7.03991 27.0002C6.87029 28.5108 7.24488 30.0324 8.09638 31.2916C8.94788 32.5508 10.2205 33.4651 11.6856 33.8703ZM13.391 25.2209C13.8854 25.2209 14.3687 25.3676 14.7798 25.6422C15.1909 25.9169 15.5113 26.3073 15.7005 26.7641C15.8897 27.2209 15.9392 27.7235 15.8428 28.2084C15.7463 28.6934 15.5083 29.1388 15.1586 29.4884C14.809 29.838 14.3636 30.0761 13.8787 30.1725C13.3938 30.269 12.8912 30.2195 12.4344 30.0303C11.9776 29.8411 11.5872 29.5207 11.3125 29.1096C11.0378 28.6985 10.8912 28.2152 10.8912 27.7208C10.8912 27.0578 11.1546 26.4219 11.6234 25.9531C12.0922 25.4843 12.728 25.2209 13.391 25.2209Z" fill="currentColor" />
  </svg>
)

const ShortcutIconEducation = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3636 27.1955V33.5591L24.5 39.6364L35.6364 33.5591V27.1955L24.5 33.2727L13.3636 27.1955ZM24.5 11L7 20.5455L24.5 30.0909L38.8182 22.2795V33.2727H42V20.5455L24.5 11Z" fill="currentColor" />
  </svg>
)

export function ResourcesPage() {
  const { language } = useLanguageStore()
  const [openSections, setOpenSections] = useState<ResourceSectionId[]>([])
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [])
  const handleToggleSection = (sectionId: ResourceSectionId) => {
    setOpenSections((prev) => {
      const isOpen = prev.includes(sectionId)
      const next = isOpen ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]

      trackEvent("resource_section_jump", {
        section_id: sectionId,
        language
      })

      return next
    })
  }

  return (
    <div className="space-y-0">
      <section className="bg-surface px-fluid-20 py-fluid-30 lg:p-fluid-50 border-b-[0.5px] border-foreground">
        <div className="grid w-full gap-fluid-30 lg:grid-cols-[48%_52%]">
          <div className="flex flex-col gap-fluid-15">
            <span className="text-sub2 font-bold uppercase tracking-[0.15em] text-onSurfaceSecondary">
              {t(language, "resources.kicker")}
            </span>
            <h2 className="text-h2 text-foreground">
              {t(language, "planNextSteps.title")}
            </h2>
            <p className="text-body-base lg:text-body-lg text-muted max-w-[520px]">
              {t(language, "planNextSteps.description")}
            </p>
          </div>
          <div className="flex flex-col gap-fluid-20">
            {[
              {
                id: "scholarships",
                sectionId: "scholarships" as ResourceSectionId,
                title: t(language, "planNextSteps.card.scholarships.title"),
                description: t(language, "planNextSteps.card.scholarships.description"),
                icon: <ShortcutIconHelp />,
                bgColor: "bg-accentGreen"
              },
              {
                id: "orgs",
                sectionId: "organizations" as ResourceSectionId,
                title: t(language, "planNextSteps.card.professionalOrganizations.title"),
                description: t(language, "planNextSteps.card.professionalOrganizations.description"),
                icon: <ShortcutIconDoctor />,
                bgColor: "bg-accentPink"
              },
              {
                id: "schools",
                sectionId: "schools" as ResourceSectionId,
                title: t(language, "planNextSteps.card.schoolsPrerequisites.title"),
                description: t(language, "planNextSteps.card.schoolsPrerequisites.description"),
                icon: <ShortcutIconEducation />,
                bgColor: "bg-accentBlue"
              }
            ].map((shortcut, index, array) => {
              const isOpen = openSections.includes(shortcut.sectionId)
              return (
              <React.Fragment key={shortcut.id}>
                <button
                  type="button"
                  onClick={() => handleToggleSection(shortcut.sectionId)}
                  className="group flex w-full items-center text-left py-fluid-15"
                >
                  <div className={`mr-fluid-20 flex h-[60px] w-[60px] items-center justify-center ${shortcut.bgColor}`}>
                    <div className="flex h-fluid-35 w-fluid-35 items-center justify-center text-foreground">
                      {shortcut.icon}
                    </div>
                  </div>
                  <div className="h-[60px] w-[0.5px] bg-foreground" />
                  <div className="flex flex-1 flex-col justify-center gap-fluid-7 px-fluid-20">
                    <h3 className="text-h4 lg:text-h4 font-bold text-foreground leading-tight">
                      {shortcut.title}
                    </h3>
                    <p className="text-body-sm lg:text-body-base text-onSurfaceSecondary leading-snug">
                      {shortcut.description}
                    </p>
                  </div>
                  {/* Mobile: black toggle button */}
                  <div className="flex h-[60px] w-[70px] items-center justify-center lg:hidden">
                    <div className="flex h-full aspect-square items-center justify-center bg-foreground text-surface" aria-hidden="true">
                      <svg
                        className="h-[22px] w-[22px]"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d={isOpen ? "M4 13L10 7L16 13" : "M4 7L10 13L16 7"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                {index < array.length - 1 && (
                  <div className="h-[2px] lg:h-[1px] w-full bg-foreground" aria-hidden="true" />
                )}
                {/* Mobile: render the active section content right below its card */}
                {isOpen && (
                  <div className="mt-fluid-10 lg:hidden">
                    <PlanYourNextStepsSection activeSections={[shortcut.sectionId]} />
                  </div>
                )}
              </React.Fragment>
            )})}
          </div>
        </div>
      </section>
      {/* Desktop: show all sections stacked below hero */}
      <div className="hidden lg:block">
        <PlanYourNextStepsSection activeSections={["scholarships", "organizations", "schools"]} />
      </div>
    </div>
  )
}


