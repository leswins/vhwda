import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { trackEvent } from "../utils/analytics"
import { Button } from "../ui/components/Button"
import { CareerCard } from "../ui/widgets/CareerCard"
import { fetchHomePageData, HomePageData } from "../sanity/queries/homePage"
import { getLocalizedString } from "../sanity/queries/careers"
import { useGlobalLoadingStore } from "../zustand/useGlobalLoadingStore"
import quizHoverAnimation from "../assets/lottie/quiz-hover.json"

const StepIconQuiz = () => (
  <svg aria-hidden="true" viewBox="0 0 67 67" className="h-[67px] w-[67px]">
    <path d="M0 31C0 13.8792 13.8792 0 31 0V31H0Z" fill="rgb(var(--color-accent-orange))" />
    <path d="M0 35.8334H31V66.8334H30C13.4315 66.8334 0 53.4019 0 36.8334V35.8334Z" fill="rgb(var(--color-accent-yellow))" />
    <path d="M36 36.1665H51.3335C59.802 36.1665 66.667 43.0315 66.667 51.5C66.667 59.9685 59.802 66.8335 51.3335 66.8335C42.865 66.8335 36 59.9685 36 51.5V36.1665Z" fill="rgb(var(--color-accent-blue))" />
    <path d="M35.6666 0C52.7875 0 66.6666 13.8792 66.6666 31H35.6666V0Z" fill="rgb(var(--color-accent-pink))" />
  </svg>
)

const StepIconBrowse = () => (
  <svg aria-hidden="true" viewBox="0 0 67 67" className="h-[67px] w-[67px]">
    <path d="M66.6667 22.5C66.6667 34.9264 56.5931 45 44.1667 45C31.7403 45 21.6667 34.9264 21.6667 22.5C21.6667 10.0736 31.7403 0 44.1667 0C56.5931 0 66.6667 10.0736 66.6667 22.5Z" fill="rgb(var(--color-accent-green))" />
    <path d="M45 44.1667C45 56.5932 34.9264 66.6667 22.5 66.6667C10.0736 66.6667 0 56.5932 0 44.1667C0 31.7403 10.0736 21.6667 22.5 21.6667C34.9264 21.6667 45 31.7403 45 44.1667Z" fill="rgb(var(--color-accent-blue))" />
    <path d="M22.5 21.6667C34.9264 21.6667 45 31.7403 45 44.1667C45 44.4401 44.9921 44.7124 44.9824 44.9834C44.7118 44.993 44.4397 45 44.1667 45C31.7403 45 21.6667 34.9264 21.6667 22.5C21.6667 22.2264 21.6729 21.9539 21.6826 21.6826C21.9539 21.6729 22.2264 21.6667 22.5 21.6667Z" fill="rgb(var(--color-accent-yellow))" />
  </svg>
)

const StepIconPlan = () => (
  <svg aria-hidden="true" viewBox="0 0 67 67" className="h-[67px] w-[67px]">
    <path d="M33.35 0L40.7778 15.4178L56.932 9.76799L51.2822 25.9222L66.7 33.35L51.2822 40.7778L56.932 56.932L40.7778 51.2822L33.35 66.7L25.9222 51.2822L9.76799 56.932L15.4178 40.7778L0 33.35L15.4178 25.9222L9.76799 9.76799L25.9222 15.4178L33.35 0Z" fill="rgb(var(--color-accent-orange))" />
    <path d="M52.7433 33.3501C52.7433 44.0609 44.0604 52.7438 33.3496 52.7438C22.6388 52.7438 13.9559 44.0609 13.9559 33.3501C13.9559 22.6393 22.6388 13.9564 33.3496 13.9564C44.0604 13.9564 52.7433 22.6393 52.7433 33.3501Z" fill="rgb(var(--color-accent-yellow))" />
  </svg>
)

const ArrowIndicator = () => (
  <div className="relative flex h-full aspect-square items-center justify-center overflow-hidden self-stretch" aria-hidden="true">
    <div className="absolute inset-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
    <svg className="relative z-10 h-[28px] w-[28px] text-foreground transition-colors duration-300 group-hover:text-surface" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
    </svg>
  </div>
)

const PatternCircle = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <circle cx="8.5535" cy="8.5535" r="8.5535" fill="currentColor" />
  </svg>
)

const PatternSquare = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <rect width="17.107" height="17.107" fill="currentColor" />
  </svg>
)

const PatternTriangle = () => (
  <svg aria-hidden="true" viewBox="0 0 20 18" className="h-full w-full">
    <path d="M9.87673 0L19.7535 17.107H0L9.87673 0Z" fill="currentColor" />
  </svg>
)

const PatternStar = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <path d="M8.5535 0L10.5175 3.81206L14.6017 2.50526L13.2949 6.58953L17.107 8.5535L13.2949 10.5175L14.6017 14.6017L10.5175 13.2949L8.5535 17.107L6.58953 13.2949L2.50526 14.6017L3.81206 10.5175L0 8.5535L3.81206 6.58953L2.50526 2.50526L6.58953 3.81206L8.5535 0Z" fill="currentColor" />
  </svg>
)

const PatternSlice = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <path d="M0 15.945C0 7.13883 7.13883 0 15.945 0H17.107V17.107H0V15.945Z" fill="currentColor" />
  </svg>
)

const ShortcutIconSearch = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7C23.4478 7 26.7544 8.36964 29.1924 10.8076C31.6304 13.2456 33 16.5522 33 20C33 23.22 31.82 26.18 29.88 28.46L30.42 29H32L42 39L39 42L29 32V30.42L28.46 29.88C26.1007 31.8929 23.1013 32.9991 20 33C16.5522 33 13.2456 31.6304 10.8076 29.1924C8.36964 26.7544 7 23.4478 7 20C7 16.5522 8.36964 13.2456 10.8076 10.8076C13.2456 8.36964 16.5522 7 20 7ZM20 11C15 11 11 15 11 20C11 25 15 29 20 29C25 29 29 25 29 20C29 15 25 11 20 11Z" fill="currentColor" />
  </svg>
)

const ShortcutIconScale = () => (
  <svg width="52" height="50" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.3779 10.0962V7H7.83002V10.863C7.83002 10.863 0.00592731 23.644 0.00754386 23.6882L0 23.6995L0.0102382 23.7054C0.105076 27.6708 3.99611 30.8624 8.80318 30.8624C13.5585 30.8624 17.407 27.7355 17.5821 23.8283L11.7502 10.8953H23.656V38.1649H15.6212V42H35.5862V38.1654H27.5519V10.8953H39.9007L33.4291 23.5578C33.4291 27.5927 37.3741 30.8624 42.242 30.8624C47.0868 30.8624 51.0123 27.6191 51.0474 23.6079L43.3779 10.0962ZM2.36878 23.5583L9.81514 11.3485L15.3831 23.5578L2.36878 23.5583ZM35.8243 23.5583L41.8487 11.3491L48.8122 23.5583H35.8243Z" fill="currentColor" />
  </svg>
)

const ShortcutIconHelp = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.07787 40.2042L5.9662 42L0 31.6668L3.11167 29.871H3.10985C3.5515 29.6192 4.11359 29.7688 4.37093 30.2086L9.41346 38.9449C9.66714 39.3865 9.51566 39.9504 9.07583 40.2041L9.07787 40.2042ZM37.5353 29.537C37.5335 28.9256 37.194 28.3653 36.652 28.0806C35.7486 27.5896 34.6426 27.6681 33.8177 28.2795C33.8068 28.2868 33.7958 28.2923 33.7849 28.2978L25.5065 32.8074C23.9534 33.9663 20.82 33.7454 15.9307 32.1321C15.7573 32.081 15.6113 31.9624 15.5274 31.8036C15.4434 31.643 15.427 31.4569 15.4836 31.2853C15.5401 31.1137 15.6642 30.9714 15.8267 30.8929C15.9891 30.8126 16.1752 30.8035 16.345 30.8655C18.1499 31.5098 20.0206 31.9496 21.9239 32.1777C22.8656 31.6831 23.3948 31.1539 23.4149 30.683C23.4368 30.1647 22.8637 29.5023 21.8454 28.869C18.8651 27.0203 13.204 26.0037 11.3772 26.9892C11.2093 27.0933 9.33134 28.2229 5.94407 30.2688L10.0029 37.2988L10.4866 36.9867V36.9849C10.7713 36.7385 11.1728 36.6728 11.5213 36.8188C11.5724 36.8371 11.6363 36.859 11.7221 36.8827L19.7304 39.0818C19.745 39.0855 19.7596 39.091 19.7724 39.0946V39.0964C21.0097 39.6001 22.415 39.4742 23.5447 38.7588L23.5556 38.7515L35.9109 31.3001H35.909C35.9309 31.2873 35.9528 31.2763 35.9747 31.2654C36.942 30.8219 37.495 30.2069 37.5296 29.5371L37.5353 29.537Z" fill="currentColor" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M40.2852 8.79584L43.3969 7L49.3631 17.3332L46.2514 19.129H46.2532C45.8116 19.3808 45.2495 19.2312 44.9921 18.7914L39.9496 10.0551C39.6959 9.61346 39.8474 9.04955 40.2872 8.79586L40.2852 8.79584ZM11.8278 19.463C11.8296 20.0744 12.169 20.6347 12.7111 20.9194C13.6145 21.4104 14.7204 21.3319 15.5453 20.7205C15.5563 20.7132 15.5672 20.7077 15.5782 20.7022L23.8566 16.1926C25.4096 15.0337 28.5431 15.2546 33.4324 16.8679C33.6058 16.919 33.7518 17.0376 33.8357 17.1964C33.9197 17.357 33.9361 17.5432 33.8795 17.7147C33.8229 17.8863 33.6988 18.0286 33.5364 18.1071C33.374 18.1874 33.1878 18.1965 33.0181 18.1345C31.2131 17.4902 29.3425 17.0504 27.4392 16.8223C26.4975 17.3169 25.9683 17.8461 25.9482 18.317C25.9263 18.8353 26.4993 19.4977 27.5177 20.131C30.4979 21.9797 36.1591 22.9963 37.9859 22.0108C38.1538 21.9067 40.0317 20.7771 43.419 18.7312L39.3602 11.7012L38.8765 12.0133V12.0151C38.5918 12.2615 38.1903 12.3272 37.8417 12.1812C37.7906 12.1629 37.7268 12.141 37.641 12.1173L29.6326 9.91817C29.618 9.91452 29.6034 9.90905 29.5907 9.9054V9.90357C28.3533 9.39988 26.9481 9.5258 25.8184 10.2412L25.8074 10.2485L13.4522 17.6999H13.454C13.4321 17.7127 13.4102 17.7237 13.3883 17.7346C12.4211 18.1781 11.8681 18.7931 11.8334 19.4629L11.8278 19.463Z" fill="currentColor" />
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

const heroPatternIcons = [PatternCircle, PatternSquare, PatternTriangle, PatternStar, PatternSlice]

const PatternBar = ({ iconSize = 15, height = "fit-content" }: { iconSize?: number; height?: string | number }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [count, setCount] = useState(0)
  const [gap, setGap] = useState(8)

  useEffect(() => {
    const target = containerRef.current
    if (!target) return

    const minGap = 5
    const maxGap = iconSize

    const updatePattern = () => {
      const width = target.clientWidth
      if (!width) return
      let c = Math.floor((width + maxGap) / (iconSize + minGap))
      if (c < 1) c = 1
      let g = c > 1 ? (width - c * iconSize) / (c - 1) : 0
      while (c > 1 && g < minGap) {
        c -= 1
        g = (width - c * iconSize) / (c - 1)
      }
      if (c > 1 && g > maxGap) {
        const expandedCount = Math.min(
          c + Math.floor((width - c * (iconSize + maxGap)) / (iconSize + maxGap)),
          Math.floor((width + maxGap) / (iconSize + minGap))
        )
        if (expandedCount > c) {
          c = expandedCount
          g = (width - c * iconSize) / (c - 1)
        }
      }
      const clampedGap = Math.min(maxGap, Math.max(minGap, g || minGap))
      setCount(c)
      setGap(clampedGap)
    }

    updatePattern()
    const observer = new ResizeObserver(updatePattern)
    observer.observe(target)
    return () => observer.disconnect()
  }, [iconSize])

  return (
    <div
      ref={containerRef}
      className="flex w-full items-center text-onSurfaceDisabledLight"
      style={{ gap: `${gap}px`, height }}
    >
      {Array.from({ length: count }).map((_, index) => {
        const Icon = heroPatternIcons[index % heroPatternIcons.length]
        return (
          <span key={`pattern-${index}`} style={{ width: iconSize, height: iconSize }} className="shrink-0">
            <Icon />
          </span>
        )
      })}
    </div>
  )
}

const ClockIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.2549 6.12755V12.255L15.9313 15.9315M1.22546 12.255C1.22546 13.7034 1.51075 15.1376 2.06503 16.4758C2.61931 17.8139 3.43173 19.0298 4.4559 20.054C5.48008 21.0781 6.69595 21.8906 8.0341 22.4448C9.37225 22.9991 10.8065 23.2844 12.2549 23.2844C13.7033 23.2844 15.1375 22.9991 16.4756 22.4448C17.8138 21.8906 19.0297 21.0781 20.0538 20.054C21.078 19.0298 21.8904 17.8139 22.4447 16.4758C22.999 15.1376 23.2843 13.7034 23.2843 12.255C23.2843 9.32982 22.1223 6.52444 20.0538 4.45603C17.9854 2.38761 15.1801 1.22559 12.2549 1.22559C9.32969 1.22559 6.52432 2.38761 4.4559 4.45603C2.38749 6.52444 1.22546 9.32982 1.22546 12.255Z" stroke="currentColor" stroke-width="2.45098" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

const accentClasses = ["bg-accentPink", "bg-accentOrange", "bg-accentYellow", "bg-accentBlue", "bg-accentGreen"]

export function HomePage() {
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const { setLoading, isLoading } = useGlobalLoadingStore()
  const [data, setData] = useState<HomePageData | null>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [colorIndex, setColorIndex] = useState(0)
  const [hasHovered, setHasHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Show global loading on mount to hide video loading
  useEffect(() => {
    setIsMounted(true)
    setLoading(true)
  }, [setLoading])

  useEffect(() => {
    if (hasHovered) return
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % accentClasses.length)
    }, 1250) // 500ms animation + 750ms downtime
    return () => clearInterval(interval)
  }, [hasHovered])

  const steps = [
    {
      id: "quiz",
      to: "/quiz",
      title: t(language, "home.steps.quiz.title"),
      description: t(language, "home.steps.quiz.description"),
      icon: <StepIconQuiz />
    },
    {
      id: "browse",
      to: "/careers",
      title: t(language, "home.steps.browse.title"),
      description: t(language, "home.steps.browse.description"),
      icon: <StepIconBrowse />
    },
    {
      id: "plan",
      to: "/resources",
      title: t(language, "home.steps.plan.title"),
      description: t(language, "home.steps.plan.description"),
      icon: <StepIconPlan />
    }
  ]

  useEffect(() => {
    fetchHomePageData().then((res) => {
      setData(res)
      // If there's no hero video, we can stop loading now
      if (!res?.heroVideoUrl) {
        setLoading(false)
      }
    })
  }, [setLoading])

  // Don't render content during initial mount or while global loading is active
  if (!isMounted || (isLoading && !data)) {
    return null
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-surface border-b border-foreground">
        <div className="w-full px-0 py-0">
          <div className="grid w-full lg:grid-cols-[55%_45%] lg:items-start">
            <div className="relative flex h-full flex-col px-fluid-50 pt-fluid-50 pb-fluid-50">
              <h1 className="text-h1 text-foreground">{t(language, "home.hero.title")}</h1>
              <p className="mt-fluid-25 text-body-lg text-onSurfaceSecondary max-w-[620px]">
                {t(language, "home.hero.subtitle")}
              </p>
              <div className="mt-fluid-40 flex flex-wrap gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="!rounded-none !bg-accentPink px-6 py-3 text-body-base text-foreground hover:!bg-accentPink/90"
                  onClick={() => navigate("/quiz")}
                >
                  {t(language, "home.hero.primaryCTA")}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="!rounded-none !bg-surface2 px-6 py-3 text-body-base text-foreground hover:!bg-surface1"
                  onClick={() => navigate("/careers")}
                >
                  {t(language, "home.hero.secondaryCTA")}
                </Button>
              </div>
              <div className="pointer-events-none absolute bottom-[0px] left-0 right-0 p-fluid-10">
                <PatternBar iconSize={15} />
              </div>
            </div>
            <div className="border-t border-foreground lg:border-t-0 lg:border-l lg:flex lg:items-start">
              <div className="aspect-square w-full overflow-hidden bg-surface2 lg:h-[545px] lg:w-full lg:aspect-auto">
                {data?.heroVideoUrl ? (
                  <video
                    className="h-full w-full object-cover"
                    src={data.heroVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setLoading(false)}
                    onError={() => setLoading(false)}
                  />
                ) : (
                  <div className="h-full w-full bg-surface2" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-surface border-b border-foreground">
        <div className="w-full px-fluid-30 pt-fluid-30 pb-fluid-30">
          <h2 className="sr-only">{t(language, "home.steps.heading")}</h2>
          <div className="w-full h-fit">
            {steps.map((step, index) => (
              <div key={step.id} className="group w-full">
                <Link
                  to={step.to}
                  className="flex w-full items-center"
                >
                  <div className="flex h-[125px] w-fluid-25 items-center justify-center py-fluid-30">
                    <span className="text-sub2 text-foreground">{index + 1}</span>
                  </div>
                  <div className="flex self-stretch w-fluid-50 items-center justify-center z-10" aria-hidden="true">
                    <div className="h-full w-[0.5px] bg-foreground" />
                  </div>
                  <div className="flex h-[130px] w-[125px] items-center justify-center" aria-hidden="true">
                    {step.icon}
                  </div>
                  <div className="flex flex-1 flex-col gap-fluid-10 px-fluid-20 py-fluid-20">
                    <span className="text-h3 text-foreground font-semibold">{step.title}</span>
                    <p className="text-body-lg text-muted font-normal">{step.description}</p>
                  </div>
                  <div className="flex self-stretch w-[0.5px] items-center justify-center z-10" aria-hidden="true">
                    <div className="h-full w-[0.5px] bg-foreground" />
                  </div>
                  <div className="flex w-[130px] items-center justify-center self-stretch">
                    <ArrowIndicator />
                  </div>
                </Link>
                {index < steps.length - 1 && (
                  <div className="h-[0.5px] w-full bg-foreground my-fluid-30" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Highlight Section */}
      <section className="bg-surface border-b border-foreground">
        <div className="bg-foreground text-surface">
          <div className="flex h-full w-full items-center justify-between px-fluid-25 py-fluid-50 text-xs uppercase tracking-widest">
            <span>{t(language, "home.catalogBanner.left")}</span>
            <span>{t(language, "home.catalogBanner.right")}</span>
          </div>
        </div>
        <div className="grid h-[300px] grid-cols-1 md:grid-cols-3 border-t border-foreground">
          <div className="flex h-full flex-col items-center justify-center border-b border-foreground bg-accentBlue px-fluid-25 py-fluid-50 text-center md:border-b-0 md:border-r">
            <h3 className="text-h3 text-foreground">{t(language, "home.catalogHighlights.careers.title")}</h3>
            <p className="mt-3 text-body-base font-medium text-foreground">{t(language, "home.catalogHighlights.careers.description")}</p>
          </div>
          <div className="flex h-full flex-col items-center justify-center border-b border-foreground bg-accentYellow px-fluid-25 py-fluid-50 text-center md:border-b-0 md:border-r">
            <h3 className="text-h3 text-foreground">{t(language, "home.catalogHighlights.updated.title")}</h3>
            <p className="mt-3 text-body-base font-medium text-foreground">{t(language, "home.catalogHighlights.updated.description")}</p>
          </div>
          <div className="flex h-full flex-col items-center justify-center bg-accentGreen px-fluid-25 py-fluid-50 text-center">
            <h3 className="text-h3 text-foreground">{t(language, "home.catalogHighlights.local.title")}</h3>
            <p className="mt-3 text-body-base font-medium text-foreground">{t(language, "home.catalogHighlights.local.description")}</p>
          </div>
        </div>
      </section>

      {/* Featured Careers Section */}
      <section className="w-full py-0 overflow-hidden border-b border-foreground">
        <div className="w-full px-0 border-b-[0.5px] border-foreground">
          <div className="flex w-full items-stretch justify-between gap-0">
            <div className="flex flex-1 flex-col gap-fluid-15 p-fluid-50">
              <div className="text-sm font-bold uppercase tracking-widest text-foreground">
                {t(language, "home.featuredCareers.kicker")}
              </div>
              <h2 className="text-h2 text-foreground">
                {t(language, "home.featuredCareers.headline")}
              </h2>
            </div>
            <div className="flex w-max flex-col items-center justify-around border-l border-foreground px-fluid-50 py-fluid-25 whitespace-nowrap">
              <Link to="/careers" className="text-h5 text-foreground hover:no-underline px-fluid-25">
                {t(language, "home.featuredCareers.ctaExplore")}
              </Link>
              <div className="h-[0.5px] w-full bg-foreground/60" aria-hidden="true" />
              <Link to="/quiz" className="text-h5 text-foreground hover:no-underline px-fluid-25">
                {t(language, "home.featuredCareers.ctaFind")}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {data?.featuredCareers && data.featuredCareers.length > 0 ? (
            data.featuredCareers.map((career) => (
              <div
                key={career._id}
                className="snap-start shrink-0 w-[30%] min-w-[30%] border-r-[0.5px] border-foreground last:border-r-0"
              >
                <CareerCard
                  language={language}
                  title={getLocalizedString(language, career.title) || ""}
                  salary={career.salary?.median ? `$${career.salary.median.toLocaleString()}` : undefined}
                  to={`/careers/${career.slug}`}
                  imageUrl={career.imageUrl}
                  videoUrl={career.videoUrl}
                  onClick={() => {
                    trackEvent("career_click", {
                      source: "home_featured",
                      career_id: career._id,
                      career_slug: career.slug ?? undefined,
                      career_title: getLocalizedString(language, career.title) || "",
                      language
                    })
                  }}
                />
              </div>
            ))
          ) : (
            // Placeholder cards if no data
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[480px] w-[30%] min-w-[30%] shrink-0 bg-surface2 border border-foreground animate-pulse"
              />
            ))
          )}
        </div>
      </section>

      {/* Quiz Callout Section */}
      <section className="w-full bg-surface border-b border-foreground">
        <div className="flex h-[100px] w-full items-center px-fluid-25 border-b border-foreground">
          <PatternBar iconSize={25} />
        </div>
        <div className="flex h-[535px] w-full items-stretch">
          <div className="relative flex w-1/2 flex-col justify-between overflow-hidden bg-foreground p-fluid-50 text-surface">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Lottie
                lottieRef={lottieRef}
                animationData={quizHoverAnimation}
                loop={false}
                autoplay={false}
                style={{ height: "100%", width: "100%" }}
                rendererSettings={{
                  preserveAspectRatio: "xMaxYMax meet"
                }}
              />
            </div>
            <div className="relative z-10 flex flex-col gap-fluid-15">
              <svg width="200" height="36" viewBox="0 0 404 73" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-surface" aria-label="VHWDA">
                <path d="M205.323 36.7937C203.489 40.1203 202.049 43.2637 201.003 46.2237C200.757 46.9153 200.442 47.5819 200.063 48.2137C198.429 50.907 197.366 52.9837 196.873 54.4437C194.903 60.3637 192.463 64.3737 189.563 71.2137C189.468 71.4442 189.306 71.6414 189.097 71.7803C188.889 71.9191 188.644 71.9934 188.393 71.9937H183.093C182.834 71.9943 182.58 71.919 182.362 71.7771C182.144 71.6352 181.971 71.4326 181.863 71.1937L151.043 2.38367C150.968 2.21504 150.936 2.03044 150.951 1.84654C150.965 1.66264 151.025 1.48525 151.126 1.33041C151.226 1.17556 151.363 1.04814 151.525 0.959665C151.687 0.871191 151.868 0.824451 152.053 0.823672H169.403C169.787 0.823202 170.164 0.932125 170.488 1.13763C170.812 1.34313 171.071 1.63665 171.233 1.98367L186.083 33.5737C186.153 33.7218 186.265 33.847 186.404 33.9345C186.543 34.0221 186.703 34.0686 186.868 34.0686C187.032 34.0686 187.193 34.0221 187.332 33.9345C187.471 33.847 187.582 33.7218 187.653 33.5737L202.983 0.763672C203.069 0.575361 203.208 0.415852 203.384 0.304154C203.559 0.192455 203.764 0.133278 203.973 0.133672H208.213C208.479 0.133656 208.739 0.209819 208.964 0.353257C209.189 0.496695 209.369 0.70148 209.483 0.943672L225.433 34.8637C225.49 34.9847 225.58 35.0872 225.692 35.1593C225.805 35.2314 225.936 35.2702 226.07 35.2713C226.203 35.2723 226.335 35.2356 226.448 35.1652C226.562 35.0949 226.654 34.9938 226.713 34.8737L243.073 1.46367C243.147 1.30514 243.265 1.17108 243.414 1.07721C243.563 0.983332 243.736 0.933541 243.913 0.933672H261.283C261.392 0.932788 261.499 0.958024 261.596 1.00732C261.693 1.05661 261.778 1.12857 261.842 1.21731C261.906 1.30605 261.949 1.40905 261.966 1.51791C261.984 1.62677 261.976 1.7384 261.943 1.84367C261.656 2.77701 261.266 3.75034 260.773 4.76367C256.533 13.4437 251.996 23.3037 247.163 34.3437C246.949 34.837 246.466 35.547 245.713 36.4737C245.495 36.7445 245.332 37.0535 245.233 37.3837C244.493 39.8303 243.303 42.6703 241.663 45.9037C240.363 48.477 239.059 51.2803 237.753 54.3137C236.726 56.727 234.056 62.377 229.743 71.2637C229.641 71.4767 229.48 71.6564 229.28 71.7821C229.08 71.9077 228.849 71.9742 228.613 71.9737H222.713C222.51 71.9733 222.312 71.9026 222.154 71.7735C221.996 71.6443 221.886 71.4644 221.843 71.2637C221.623 70.217 221.223 69.0637 220.643 67.8037C214.649 54.737 210.313 45.337 207.633 39.6037C207.079 38.4303 206.513 37.4737 205.933 36.7337C205.896 36.6859 205.848 36.6484 205.793 36.6245C205.737 36.6007 205.677 36.5914 205.616 36.5973C205.555 36.6033 205.497 36.6244 205.445 36.6587C205.394 36.693 205.352 36.7394 205.323 36.7937Z" fill="currentColor" />
                <path d="M264.693 71.0037V2.17367C264.693 2.03115 264.724 1.89032 264.782 1.76045C264.84 1.63058 264.925 1.51461 265.031 1.42015C265.137 1.3257 265.261 1.25491 265.396 1.21242C265.53 1.16994 265.673 1.15674 265.813 1.17367C268.103 1.44367 269.813 0.253672 271.963 0.253672C272.736 0.253672 276.369 0.180339 282.863 0.0336724C294.483 -0.236328 304.133 1.04367 314.943 6.56367C321.569 9.95034 326.576 15.1003 329.963 22.0137C332.113 26.4037 332.373 28.9137 332.803 33.9237C333.483 41.7703 331.286 49.1203 326.213 55.9737C319.763 64.6737 307.513 69.5737 296.723 71.2337C286.063 72.8737 276.703 72.4037 265.513 71.8637C265.292 71.8534 265.083 71.7582 264.93 71.5981C264.778 71.4379 264.692 71.225 264.693 71.0037ZM283.303 16.1337L283.243 55.3737C283.241 55.4722 283.259 55.57 283.296 55.6615C283.332 55.753 283.387 55.8364 283.455 55.907C283.524 55.9775 283.606 56.0339 283.696 56.0728C283.787 56.1117 283.884 56.1324 283.983 56.1337L290.693 56.1437C293.616 56.1496 296.513 55.6766 299.216 54.7515C301.919 53.8265 304.376 52.4675 306.447 50.7524C308.518 49.0372 310.162 46.9994 311.285 44.7553C312.408 42.5112 312.988 40.1049 312.993 37.6737V33.9537C313.002 29.0454 310.666 24.3339 306.499 20.8553C302.332 17.3766 296.675 15.4157 290.773 15.4037L284.063 15.3937C283.964 15.3923 283.866 15.4104 283.775 15.4469C283.683 15.4834 283.6 15.5375 283.529 15.6063C283.459 15.675 283.402 15.7569 283.364 15.8474C283.325 15.9379 283.304 16.0352 283.303 16.1337Z" fill="currentColor" />
                <path d="M383.363 71.2137L379.353 63.5137C379.254 63.3261 379.106 63.1691 378.924 63.0598C378.743 62.9505 378.535 62.8931 378.323 62.8937H349.173C348.961 62.8931 348.753 62.9505 348.571 63.0598C348.389 63.1691 348.241 63.3261 348.143 63.5137L344.093 71.2337C343.994 71.4213 343.846 71.5782 343.664 71.6875C343.483 71.7968 343.275 71.8543 343.063 71.8537H324.853C324.653 71.8543 324.456 71.8031 324.281 71.7052C324.107 71.6072 323.961 71.4659 323.857 71.2948C323.754 71.1237 323.696 70.9287 323.69 70.7288C323.684 70.5288 323.73 70.3307 323.823 70.1537L360.253 0.763672C360.351 0.576094 360.5 0.419131 360.681 0.309828C360.863 0.200525 361.071 0.14306 361.283 0.143673H366.103C366.315 0.14306 366.523 0.200525 366.704 0.309828C366.886 0.419131 367.034 0.576094 367.133 0.763672L403.313 70.1337C403.406 70.3107 403.452 70.5088 403.446 70.7088C403.439 70.9087 403.382 71.1037 403.278 71.2748C403.175 71.4459 403.028 71.5872 402.854 71.6852C402.68 71.7831 402.483 71.8343 402.283 71.8337H384.393C384.181 71.8343 383.973 71.7768 383.791 71.6675C383.609 71.5582 383.461 71.4013 383.363 71.2137ZM355.793 48.7437C355.772 48.8027 355.765 48.8658 355.774 48.9278C355.783 48.9898 355.806 49.0488 355.843 49.0998C355.879 49.1508 355.927 49.1923 355.983 49.2208C356.038 49.2493 356.1 49.264 356.163 49.2637H371.423C371.489 49.2635 371.554 49.2466 371.611 49.2145C371.669 49.1825 371.717 49.1363 371.752 49.0804C371.787 49.0244 371.808 48.9605 371.811 48.8946C371.815 48.8288 371.801 48.7631 371.773 48.7037L364.123 32.4437C364.081 32.3547 364.014 32.2795 363.931 32.2268C363.848 32.1741 363.751 32.1462 363.653 32.1462C363.554 32.1462 363.458 32.1741 363.375 32.2268C363.291 32.2795 363.225 32.3547 363.183 32.4437L357.163 44.9737C356.996 45.3266 356.849 45.6908 356.723 46.0637L355.793 48.7437Z" fill="currentColor" />
                <path d="M79.6027 0.903672L62.7327 33.0237C62.7073 33.0699 62.6701 33.1086 62.625 33.1359C62.5798 33.1631 62.5283 33.178 62.4756 33.1791C62.4228 33.1801 62.3708 33.1672 62.3246 33.1416C62.2785 33.1161 62.2398 33.0789 62.2127 33.0337L44.8927 1.14367C44.8687 1.09835 44.8568 1.04766 44.8581 0.996424C44.8593 0.945191 44.8736 0.895127 44.8997 0.851006C44.9258 0.806886 44.9627 0.770179 45.007 0.744388C45.0513 0.718596 45.1014 0.704579 45.1527 0.703672L79.3327 0.463672C79.3848 0.462858 79.4362 0.475621 79.4818 0.500705C79.5275 0.525789 79.5658 0.56233 79.5931 0.606731C79.6203 0.651131 79.6355 0.701861 79.6372 0.753928C79.6389 0.805994 79.627 0.857602 79.6027 0.903672Z" fill="currentColor" />
                <path d="M0.0626709 1.71367C0.0193647 1.63272 -0.00217132 1.54191 0.000172833 1.45013C0.00251699 1.35836 0.0286608 1.26876 0.0760431 1.19013C0.123425 1.11149 0.190421 1.04651 0.270468 1.00156C0.350514 0.956602 0.440865 0.93321 0.532671 0.933672H19.7327C20.1778 0.93406 20.6141 1.05878 20.9922 1.29376C21.3703 1.52875 21.6752 1.86468 21.8727 2.26367L48.6327 56.8737C48.8318 57.2779 48.9353 57.7232 48.9353 58.1756C48.9353 58.628 48.8318 59.0754 48.6327 59.4837C46.746 63.3703 45.0727 66.517 43.6127 68.9237C42.8927 70.1137 43.1427 71.8337 41.3527 71.9937C40.1927 72.0937 38.916 72.0903 37.5227 71.9837C37.2623 71.9626 37.0114 71.8764 36.793 71.7332C36.5746 71.5899 36.3957 71.3941 36.2727 71.1637L0.0626709 1.71367Z" fill="currentColor" />
                <path d="M115.163 28.9037C120.609 28.9037 124.343 28.9003 126.363 28.8937C128.089 28.8937 128.953 28.317 128.953 27.1637C128.953 22.877 128.963 15.857 128.983 6.10367C128.989 4.49034 129.113 2.98367 129.353 1.58367C129.379 1.42975 129.459 1.29004 129.58 1.18935C129.701 1.08865 129.854 1.0335 130.013 1.03367H146.543C146.813 1.03367 147.073 1.14114 147.264 1.33242C147.455 1.52371 147.563 1.78315 147.563 2.05367V70.8137C147.563 71.0974 147.45 71.3696 147.249 71.5703C147.049 71.7709 146.776 71.8837 146.493 71.8837H130.343C129.966 71.8837 129.605 71.7341 129.339 71.4678C129.072 71.2015 128.923 70.8403 128.923 70.4637V43.6837C128.923 43.4802 128.844 43.2848 128.704 43.1391C128.564 42.9934 128.373 42.9089 128.173 42.9037C127.613 42.8837 123.279 42.877 115.173 42.8837C107.066 42.8837 102.729 42.8903 102.163 42.9037C101.962 42.9089 101.771 42.9934 101.631 43.1391C101.491 43.2848 101.413 43.4802 101.413 43.6837L101.423 70.4637C101.423 70.8403 101.273 71.2015 101.007 71.4678C100.74 71.7341 100.379 71.8837 100.003 71.8837L83.8527 71.8937C83.5689 71.8937 83.2967 71.7809 83.0961 71.5803C82.8954 71.3796 82.7827 71.1075 82.7827 70.8237L82.7627 2.06367C82.7627 1.79315 82.8701 1.53371 83.0614 1.34242C83.2527 1.15114 83.5121 1.04367 83.7827 1.04367L100.313 1.03367C100.471 1.03349 100.624 1.08864 100.745 1.18934C100.866 1.29003 100.947 1.42975 100.973 1.58367C101.213 2.98367 101.336 4.49034 101.343 6.10367C101.369 15.857 101.383 22.877 101.383 27.1637C101.383 28.317 102.246 28.897 103.973 28.9037C105.993 28.9037 109.723 28.9037 115.163 28.9037Z" fill="currentColor" />
              </svg>
              <div className="text-h2 !font-medium">{t(language, "home.quizSection.left.title")}</div>
            </div>
            <div className="inline-flex w-fit bg-surface">
              <Button
                variant="ghost"
                className="relative z-10 flex w-fit items-center gap-4 overflow-hidden !rounded-none px-8 py-4 !text-h4 font-bold text-foreground transition-all duration-[250ms] ease-in-out"
                onClick={() => navigate("/quiz")}
                onMouseEnter={() => {
                  setHasHovered(true)
                  lottieRef.current?.play()
                }}
              >
                {/* Background layers */}
                <div className={`absolute inset-0 z-0 bg-surface transition-opacity duration-300 ${hasHovered ? "opacity-100" : "opacity-0"}`} />
                {!hasHovered && (
                  <>
                    <div
                      className={`absolute inset-0 z-0 ${accentClasses[(colorIndex - 1 + accentClasses.length) % accentClasses.length]}`}
                    />
                    <div
                      key={colorIndex}
                      className={`absolute inset-0 z-0 animate-wipe-right ${accentClasses[colorIndex]}`}
                    />
                  </>
                )}

                <span className="relative z-10">{t(language, "home.quizSection.left.cta")}</span>
                <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 shrink-0">
                  <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex w-1/2 flex-col justify-between border-l border-foreground bg-surface text-foreground">
            <div className="flex flex-col gap-fluid-15 p-fluid-50">
              <div className="text-sm font-bold uppercase tracking-widest text-onSurfaceSecondary">
                {t(language, "home.quizSection.right.kicker")}
              </div>
              <h2 className="text-h2 text-foreground">
                {t(language, "home.quizSection.right.title")}
              </h2>
              <p className="max-w-[500px] text-body-lg text-muted">
                {t(language, "home.quizSection.right.description")}
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-foreground mx-fluid-50 px-0 py-fluid-25 text-muted">
              <ClockIcon />
              <span className="text-sm font-medium">{t(language, "home.quizSection.right.estimate")}</span>
            </div>
          </div>
        </div>
        <div className="flex h-[100px] w-full items-center px-fluid-25 border-t border-foreground">
          <PatternBar iconSize={25} />
        </div>
      </section>

      {/* Shortcuts Section */}
      <section className="bg-surface">
        <div className="grid w-full lg:grid-cols-[35%_65%]">
          <div className="p-fluid-50 border-foreground lg:sticky lg:top-0 lg:h-fit">
            <h2 className="text-h2 text-foreground">
              {t(language, "home.shortcuts.heading")}
            </h2>
          </div>
          <div className="flex flex-col p-fluid-25 gap-fluid-30 border-l-[0.5px] border-foreground">
            {[
              {
                id: "browse",
                to: "/careers",
                title: t(language, "home.shortcuts.browse.title"),
                description: t(language, "home.shortcuts.browse.description"),
                icon: <ShortcutIconSearch />,
                bgColor: "bg-accentOrange"
              },
              {
                id: "compare",
                to: "/compare",
                title: t(language, "home.shortcuts.compare.title"),
                description: t(language, "home.shortcuts.compare.description"),
                icon: <ShortcutIconScale />,
                bgColor: "bg-accentYellow"
              },
              {
                id: "scholarships",
                to: "/resources",
                title: t(language, "planNextSteps.card.scholarships.title"),
                description: t(language, "planNextSteps.card.scholarships.description"),
                icon: <ShortcutIconHelp />,
                bgColor: "bg-accentGreen"
              },
              {
                id: "orgs",
                to: "/resources",
                title: t(language, "planNextSteps.card.professionalOrganizations.title"),
                description: t(language, "planNextSteps.card.professionalOrganizations.description"),
                icon: <ShortcutIconDoctor />,
                bgColor: "bg-accentPink"
              },
              {
                id: "schools",
                to: "/resources",
                title: t(language, "planNextSteps.card.schoolsPrerequisites.title"),
                description: t(language, "planNextSteps.card.schoolsPrerequisites.description"),
                icon: <ShortcutIconEducation />,
                bgColor: "bg-accentBlue"
              }
            ].map((shortcut, index, array) => (
              <React.Fragment key={shortcut.id}>
                <Link to={shortcut.to} className="group flex items-center h-[100px] w-full">
                  <div className={`flex aspect-square h-full items-center justify-center mr-fluid-25 ${shortcut.bgColor}`}>
                    <div className="h-fluid-50 w-fluid-50 text-foreground">
                      {shortcut.icon}
                    </div>
                  </div>
                  <div className="w-[0.5px] h-full bg-foreground" />
                  <div className="flex flex-1 flex-col gap-fluid-10 px-fluid-25 justify-center">
                    <h3 className="text-h4 font-bold text-foreground leading-tight">{shortcut.title}</h3>
                    <p className="text-body-base text-onSurfaceSecondary leading-snug">{shortcut.description}</p>
                  </div>
                  <div className="w-[100px] h-full flex items-center justify-center">
                    <ArrowIndicator />
                  </div>
                </Link>
                {index < array.length - 1 && (
                  <div className="h-[0.5px] w-full bg-foreground" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
