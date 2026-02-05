import React from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"

export function BrowseCareersPage() {
    const { language } = useLanguageStore()

    return (
        <div className="space-y-2">
            <PageHead
                title="Browse Healthcare Careers"
                description="Browse through our comprehensive catalog of healthcare careers in Virginia. Filter by education level, salary, job outlook, and more to find the perfect career path for you."
                path="/browse"
            />
            <h1 className="text-2xl font-semibold">{t(language, "browse.title")}</h1>
            <p className="text-muted">{t(language, "browse.body")}</p>
        </div>
    )
}


