import React from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t, type TranslationKey } from "../../utils/i18n"

export function Footer() {
  const { language, setLanguage } = useLanguageStore()

  const exploreLinks: Array<{ key: TranslationKey; to?: string }> = [
    { key: "footer.link.home", to: "/" },
    { key: "footer.link.browseCareers", to: "/careers" },
    { key: "footer.link.findCareer", to: "/quiz" },
    { key: "footer.link.resources", to: "/resources" },
    { key: "footer.link.scholarship", to: "/resources" }
  ]

  const helpLinks: Array<{ key: TranslationKey; to?: string }> = [
    { key: "footer.link.compareCareers", to: "/compare" },
    // TODO: add routes when pages exist
    { key: "footer.link.glossary" },
    { key: "footer.link.contact" }
  ]

  return (
    <footer className="bg-surface text-foreground px-6">
      <div className="site-grid-container">
        <div className="grid md:grid-cols-2 border-t border-foreground">
          {/* Left column - Brand & Info */}
          <div className="flex flex-col gap-[250px] pl-[35px] pr-[200px] py-[35px]">
            <svg width="133" height="41" viewBox="0 0 133 41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={t(language, "brand.name")}>
              <path d="M8.208 25.2L0 0H6.3L11.88 18.54L17.46 0H23.76L15.552 25.2H8.208Z" fill="currentColor"/>
              <path d="M39.6056 0H45.3656V25.2H39.6056V15.192H31.6856V25.2H25.9256V0H31.6856V9.648H39.6056V0Z" fill="currentColor"/>
              <path d="M54.8392 25.2L47.8913 0H53.9393L58.2952 17.64L63.1553 0H67.8353L72.6953 17.64L77.0513 0H83.0993L76.1513 25.2H69.5993L65.4952 10.332L61.3913 25.2H54.8392Z" fill="currentColor"/>
              <path d="M95.7009 0C102.649 0 107.941 5.472 107.941 12.6C107.941 19.728 102.649 25.2 95.7009 25.2H85.6209V0H95.7009ZM95.7009 19.656C99.6609 19.656 102.397 16.92 102.397 12.6C102.397 8.28 99.6609 5.544 95.7009 5.544H91.3809V19.656H95.7009Z" fill="currentColor"/>
              <path d="M126.285 25.2L125.025 21.24H115.665L114.405 25.2H108.105L116.673 0H124.017L132.585 25.2H126.285ZM117.393 15.84H123.297L120.345 6.588L117.393 15.84Z" fill="currentColor"/>
              <path d="M5.27206 32.9478H6.69141V40.2H5.27206V37.1955H2.57839V40.2H1.14867V32.9478H2.57839V35.828H5.27206V32.9478Z" fill="currentColor"/>
              <path d="M9.46837 38.8324H12.5246V40.2H8.03865V32.9478H12.4728V34.3154H9.46837V35.8591H12.2138V37.2059H9.46837V38.8324Z" fill="currentColor"/>
              <path d="M18.3058 40.2L17.8707 38.8946H14.9802L14.5451 40.2H13.0014L15.5396 32.9478H17.3112L19.8599 40.2H18.3058ZM15.436 37.5581H17.4252L16.4306 34.5951L15.436 37.5581Z" fill="currentColor"/>
              <path d="M21.9938 38.8324H24.76V40.2H20.564V32.9478H21.9938V38.8324Z" fill="currentColor"/>
              <path d="M29.6304 32.9478V34.3154H27.6723V40.2H26.2426V34.3154H24.2949V32.9478H29.6304Z" fill="currentColor"/>
              <path d="M34.5519 32.9478H35.9713V40.2H34.5519V37.1955H31.8583V40.2H30.4285V32.9478H31.8583V35.828H34.5519V32.9478Z" fill="currentColor"/>
              <path d="M43.3482 40.345C41.1518 40.345 39.5771 38.6874 39.5771 36.5739C39.5771 34.4501 41.1518 32.8028 43.3482 32.8028C44.6743 32.8028 45.845 33.4762 46.4666 34.5122L45.2338 35.2271C44.8815 34.5847 44.177 34.1911 43.3482 34.1911C41.9288 34.1911 40.9964 35.1753 40.9964 36.5739C40.9964 37.9622 41.9288 38.9464 43.3482 38.9464C44.177 38.9464 44.8919 38.5527 45.2338 37.9207L46.4666 38.6356C45.8554 39.6716 44.6847 40.345 43.3482 40.345Z" fill="currentColor"/>
              <path d="M51.9767 40.2L51.5415 38.8946H48.651L48.2159 40.2H46.6722L49.2105 32.9478H50.9821L53.5307 40.2H51.9767ZM49.1069 37.5581H51.0961L50.1015 34.5951L49.1069 37.5581Z" fill="currentColor"/>
              <path d="M58.2132 40.2L56.7524 37.6825H55.6646V40.2H54.2349V32.9478H57.1358C58.4722 32.9478 59.5497 34.0253 59.5497 35.3514C59.5497 36.2631 58.9799 37.0816 58.1511 37.4649L59.7569 40.2H58.2132ZM55.6646 34.2843V36.4289H57.1358C57.6745 36.4289 58.12 35.9523 58.12 35.3514C58.12 34.7505 57.6745 34.2843 57.1358 34.2843H55.6646Z" fill="currentColor"/>
              <path d="M62.0285 38.8324H65.0848V40.2H60.5988V32.9478H65.033V34.3154H62.0285V35.8591H64.7739V37.2059H62.0285V38.8324Z" fill="currentColor"/>
              <path d="M67.5222 38.8324H70.5785V40.2H66.0925V32.9478H70.5267V34.3154H67.5222V35.8591H70.2677V37.2059H67.5222V38.8324Z" fill="currentColor"/>
              <path d="M75.5646 40.2L74.1039 37.6825H73.016V40.2H71.5863V32.9478H74.4872C75.8236 32.9478 76.9011 34.0253 76.9011 35.3514C76.9011 36.2631 76.3313 37.0816 75.5025 37.4649L77.1083 40.2H75.5646ZM73.016 34.2843V36.4289H74.4872C75.0259 36.4289 75.4714 35.9523 75.4714 35.3514C75.4714 34.7505 75.0259 34.2843 74.4872 34.2843H73.016Z" fill="currentColor"/>
              <path d="M80.315 40.345C78.8335 40.345 77.8596 39.6302 77.4659 38.5527L78.6884 37.8379C78.9474 38.5113 79.4551 38.9464 80.3564 38.9464C81.2163 38.9464 81.5168 38.5838 81.5168 38.1798C81.5168 37.641 81.0298 37.4338 79.9524 37.123C78.8438 36.8018 77.7664 36.3356 77.7664 34.9577C77.7664 33.5902 78.906 32.8028 80.1492 32.8028C81.3407 32.8028 82.2524 33.414 82.7393 34.4293L81.5375 35.1235C81.2785 34.5744 80.8848 34.1911 80.1492 34.1911C79.5483 34.1911 79.1961 34.5019 79.1961 34.9163C79.1961 35.3618 79.4758 35.6 80.574 35.9316C81.724 36.2942 82.9465 36.6775 82.9465 38.159C82.9465 39.5162 81.8587 40.345 80.315 40.345Z" fill="currentColor"/>
              <path d="M89.9087 40.345C87.7123 40.345 86.1375 38.6874 86.1375 36.5739C86.1375 34.4501 87.7123 32.8028 89.9087 32.8028C91.2348 32.8028 92.4055 33.4762 93.0271 34.5122L91.7942 35.2271C91.442 34.5847 90.7375 34.1911 89.9087 34.1911C88.4893 34.1911 87.5569 35.1753 87.5569 36.5739C87.5569 37.9622 88.4893 38.9464 89.9087 38.9464C90.7375 38.9464 91.4523 38.5527 91.7942 37.9207L93.0271 38.6356C92.4158 39.6716 91.2451 40.345 89.9087 40.345Z" fill="currentColor"/>
              <path d="M98.5371 40.2L98.102 38.8946H95.2115L94.7764 40.2H93.2327L95.771 32.9478H97.5426L100.091 40.2H98.5371ZM95.6674 37.5581H97.6565L96.6619 34.5951L95.6674 37.5581Z" fill="currentColor"/>
              <path d="M105.066 32.9478V34.3154H103.108V40.2H101.678V34.3154H99.7305V32.9478H105.066Z" fill="currentColor"/>
              <path d="M110 40.2L109.565 38.8946H106.675L106.239 40.2H104.696L107.234 32.9478H109.006L111.554 40.2H110ZM107.13 37.5581H109.12L108.125 34.5951L107.13 37.5581Z" fill="currentColor"/>
              <path d="M113.688 38.8324H116.454V40.2H112.258V32.9478H113.688V38.8324Z" fill="currentColor"/>
              <path d="M120.251 40.345C118.158 40.345 116.49 38.6874 116.49 36.5739C116.49 34.4501 118.158 32.8028 120.251 32.8028C122.343 32.8028 124.022 34.4501 124.022 36.5739C124.022 38.6874 122.343 40.345 120.251 40.345ZM120.251 38.9464C121.566 38.9464 122.592 37.9622 122.592 36.5739C122.592 35.1753 121.566 34.1911 120.251 34.1911C118.935 34.1911 117.909 35.1753 117.909 36.5739C117.909 37.9622 118.935 38.9464 120.251 38.9464Z" fill="currentColor"/>
              <path d="M132.144 36.3045V36.864C132.144 38.9568 130.663 40.345 128.58 40.345C126.311 40.345 124.695 38.6563 124.695 36.5843C124.695 34.4811 126.332 32.8028 128.497 32.8028C129.875 32.8028 131.046 33.4969 131.657 34.4915L130.435 35.196C130.103 34.6158 129.368 34.1911 128.487 34.1911C127.109 34.1911 126.114 35.2064 126.114 36.5843C126.114 37.9311 127.078 38.9464 128.591 38.9464C129.73 38.9464 130.455 38.3973 130.704 37.5685H128.508V36.3045H132.144Z" fill="currentColor"/>
            </svg>

            <div className="flex flex-col gap-[50px] text-base leading-[1.35] tracking-[-0.4px]">
              <p>{t(language, "footer.about")}</p>
              <p>{t(language, "footer.address")}</p>
            </div>
          </div>

          {/* Right column - Navigation */}
          <div className="grid grid-cols-2">
            {/* Explore */}
            <div className="flex flex-col gap-[20px] px-[50px] py-[59px]">
              <div className="text-base font-bold uppercase tracking-[2.4px] leading-[1.35]">{t(language, "footer.heading.explore")}</div>
              <ul className="flex flex-col gap-[10px] text-base leading-[1.35] tracking-[-0.4px]">
                {exploreLinks.map((l) => (
                  <li key={l.key as string}>
                    {l.to ? (
                      <Link className="hover:underline" to={l.to}>
                        {t(language, l.key)}
                      </Link>
                    ) : (
                      <span className="text-foreground/70">{t(language, l.key)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Tools */}
            <div className="flex flex-col gap-[20px] px-[50px] py-[59px]">
              <div className="text-base font-bold uppercase tracking-[2.4px] leading-[1.35]">{t(language, "footer.heading.helpTools")}</div>
              <ul className="flex flex-col gap-[10px] text-base leading-[1.35] tracking-[-0.4px]">
                {helpLinks.map((l) => (
                  <li key={l.key as string}>
                    {l.to ? (
                      <Link className="hover:underline" to={l.to}>
                        {t(language, l.key)}
                      </Link>
                    ) : (
                      <span className="text-foreground/70">{t(language, l.key)}</span>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={language === "en" ? "font-bold" : "hover:text-foreground"}
                    onClick={() => setLanguage("en")}
                  >
                    {t(language, "language.english")}
                  </button>
                  <span className="px-1">•</span>
                  <button
                    type="button"
                    className={language === "es" ? "font-bold" : "hover:text-foreground"}
                    onClick={() => setLanguage("es")}
                  >
                    {t(language, "language.spanish")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

