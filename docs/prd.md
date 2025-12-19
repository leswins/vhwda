# PRD — VHWDA Health Careers Catalog (Digital)

**Last updated:** 2025-12-18  

---

## 1. Product Summary

The Virginia Health Workforce Development Authority (VHWDA) Health Careers Catalog is being digitized into a **responsive, accessible, bilingual (EN/ES)** web app. The product helps students, job seekers, and career explorers **discover, compare, and plan** healthcare careers in Virginia through a browsable catalog, guided quiz, resource hub, and print-friendly outputs.

The app is powered by a **Sanity CMS** for content creation/updates and a **React 18 + TypeScript + Vite + Tailwind + Zustand** frontend.

---

## 2. Goals & Objectives

### 2.1 Goals
- Replace/extend the printed catalog with a **durable digital experience**.
- Make information **easy to find** (search, filters, navigation) and **easy to understand** (plain language).
- Provide **career exploration tools**: quiz, compare, similar occupations, training/schools, financial aid.
- Ensure **accessibility** and **bilingual access** (English/Spanish).
- Enable VHWDA to **maintain content internally** via Sanity after launch.

### 2.2 Success Metrics (initial)
- Engagement: career detail views, time on career pages, quiz completion rate.
- Discovery: search usage, filter usage, click-through to resources/training links.
- Utility: compare usage, print/export actions, share actions.
- Accessibility: zero critical a11y issues pre-launch; ongoing monitoring.
- Content health: ability for VHWDA to update careers/resources without engineering support.

---

## 3. Target Users & Personas

### 3.1 Primary users
- **Students (HS / Community college)** exploring pathways into healthcare.
- **Job seekers / career switchers** evaluating training time, salary, outlook.
- **Parents/guardians** supporting a student’s decision.
- **Career advisors / educators** helping students compare options and plan next steps.

### 3.2 Secondary users
- **Workforce partners** linking people to training/resources.
- **VHWDA content editors** maintaining content in Sanity.

---

## 4. Assumptions & Constraints

### 4.1 Tech stack constraint (must follow)
- **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Zustand**
- **Sanity** for CMS (managed via **Sanity MCP** from Cursor agents)

### 4.2 Product constraints
- Public-facing app should be usable **without account creation**.
- Any data capture (ex: email for save/share) must be **minimal, explicit-consent**, and privacy-safe.
- Must support **mobile-first** and school devices (Chromebooks, etc.).
- Must meet **WCAG AA** accessibility expectations.

---

## 5. High-Level User Stories (authoritative)

1. A user should be able to browse careers with filters.  
2. A user should be able to view detailed career information, including job responsibilities and growth potential.  
3. A user should be able to compare careers side-by-side.  
4. A user should be able to take a quiz to receive career recommendations based on interests and goals.  
5. A user should be able to find and access additional resources such as scholarships, professional organizations, and training programs.  
6. A user should be able to save or share careers via email for later reference.  
7. A user should be able to view salary information for careers, including ranges and median salary.  
8. A user should be able to learn about required education, certifications, and licensure for careers.  
9. A user should be able to identify similar occupations related to a selected career.  
10. A user should be able to identify programs that offer prerequisite courses and information about these programs.  
11. A user should be able to access information about courses in terms of length, cost, and prerequisites.  
12. A user should be able to find financial aid resources relevant to their chosen career path.  
13. A user should be able to access information about local training programs and schools offering relevant education.  
15. A user should be able to access information in English or Spanish language.

---

## 6. Information Architecture (IA)

### 6.1 Primary navigation (proposed)
- Home
- Browse Careers
- Career Quiz
- Compare
- Resources
- AI Career Chat

### 6.2 Core page inventory
- **Home / Landing**
- **Browse Careers (List + Filters)**
- **Career Detail**
- **Compare Careers**
- **Career Quiz (Intro → Questions → Results)**
- **Resources Hub**
  - Scholarships & Financial Aid
  - Professional Organizations & Networks
  - Training / Schools / Programs
  - Continuing Education & Certifications
  - Grants / Opportunities (if included)
- Utility pages: About, Contact, Privacy, Accessibility Statement, 404

---

## 7. Functional Requirements

### 7.1 Home / Landing
**FR-HOME-1**: Display a clear value proposition and entry points into:
- Browse careers
- Start quiz
- Explore resources
- (Optional) Highlight featured careers and/or categories

**FR-HOME-2**: Provide global search input (typeahead optional).

**FR-HOME-3**: Language toggle (EN/ES) visible and persistent.

**Acceptance Criteria**
- Home loads fast on mobile and presents at least 2 obvious next actions (Browse / Quiz).
- Language selection persists across navigation.

---

### 7.2 Browse Careers (Catalog List)
**FR-BROWSE-1**: Show a list/grid of careers with summary cards (at minimum: title, short description/tagline, key facts).

**FR-BROWSE-2**: Support filtering (minimum set aligned to user stories):
- Salary (range and/or brackets)
- Education level / training requirement
- Job outlook / demand indicator
- Category/domain (ex: Dentistry, Imaging, Nursing, etc.)
- (Optional) Time-to-train, credential type, work setting, region

**FR-BROWSE-3**: Support sorting:
- Relevance (default)
- Salary (high → low)
- Time-to-train (short → long) if data exists

**FR-BROWSE-4**: Search within careers (by title + keywords + tags).

**FR-BROWSE-5**: Filter panel must be mobile-friendly (drawer) and accessible via keyboard.

**FR-BROWSE-6**: Empty state when no results:
- Show guidance (“Try removing a filter”)
- Provide reset filters button

**Acceptance Criteria**
- Filters apply within 250ms perceived response for typical datasets (client-side or optimized queries).
- URL reflects browse state (query params) so results are shareable and back-button works.

---

### 7.3 Career Detail Page
Career details are the core “truth” page. It should be scannable, structured, and printable.

**FR-CAREER-1**: Display key overview:
- Career name
- Short description
- Key facts: salary, education level, demand/outlook, typical settings

**FR-CAREER-2**: Sections (minimum):
- Responsibilities / What you’ll do
- Work environment / Where you’ll work
- Salary info (median + range; clarify source/timeframe if available)
- Growth outlook / job demand (qual + quant if available)
- Education & prerequisites
- Licensure & certifications
- Training programs / schools (accredited where relevant)
- Scholarships & financial aid links
- Professional orgs & networks
- Similar occupations / related roles

**FR-CAREER-3**: “Similar occupations” module links to other careers.

**FR-CAREER-4**: “Schools/Programs” module:
- List programs with: name, location/region, credential, duration (if available), prerequisites (if available), estimated cost (if available), link out
- Filter within the module (optional) by region/credential

**FR-CAREER-5**: Save / Share:
- Save to favorites (local by default)
- Share via link
- Optional: “Send to email” (requires explicit consent)

**FR-CAREER-6**: Add to compare CTA, with feedback state (“Added to compare”).

**FR-CAREER-7**: Print-friendly view link (career-only print or include selected sections).

**Acceptance Criteria**
- All sections are navigable by headings (H2/H3), keyboard accessible, screen-reader friendly.
- No dead-ends: each key module links to next action (programs, resources, compare, quiz).

---

### 7.4 Compare Careers
**FR-COMPARE-1**: Compare 2–4 careers side-by-side (configurable).
- Minimum comparable fields: salary, education, time-to-train, responsibilities (summary), work environment, outlook, certifications/licensure.

**FR-COMPARE-2**: Add/remove careers from compare set from:
- Browse list
- Career detail page
- Quiz results page

**FR-COMPARE-3**: Sticky header / column labels for readability (especially on desktop).

**FR-COMPARE-4**: Print comparison (print stylesheet) and share compare link.

**Acceptance Criteria**
- Compare page handles missing data gracefully (shows “Not available”).
- Compare state persists on refresh (localStorage).

---

### 7.5 Career Quiz
Quiz is a guided experience for users without a specific career in mind.

**FR-QUIZ-1**: Quiz intro page:
- Explains purpose, time estimate, and data usage (if any)
- Start CTA

**FR-QUIZ-2**: Question flow supports:
- Multiple choice and/or Likert scale
- “Back” navigation
- Progress indicator
- Skip logic (optional)

**FR-QUIZ-3**: Quiz results page:
- Shows ranked recommended careers
- Each result shows “why this matched” (explainability)
- CTAs: view details, add to compare, save/share results

**FR-QUIZ-4**: Users can refine results using filters post-quiz (optional but recommended).

**Acceptance Criteria**
- Quiz can be completed on mobile with one hand.
- Results are stable and deterministic given same answers (unless explicitly designed otherwise).

---

### 7.6 Resources Hub
Centralized, categorized hub for non-career-specific content.

**FR-RES-1**: Resource categories (minimum aligned to flows/user stories):
- Scholarships & Financial Aid
- Professional Organizations & Networks
- Training / Schools / Programs
- Continuing Education & Certifications
- Grants / Opportunities (if applicable)

**FR-RES-2**: Resources are searchable and filterable (by category, region, eligibility, program type where relevant).

**FR-RES-3**: Resource detail page (optional) or outbound link with tracking.

**Acceptance Criteria**
- Resources can be maintained fully in Sanity (no code changes).

---

### 7.7 Scholarships & Financial Aid (Resource sub-section)
**FR-SCHOL-1**: Searchable list of scholarships.
**FR-SCHOL-2**: Filters (if data available): region, eligibility, program type, deadline.
**FR-SCHOL-3**: Clear outbound links and “last updated” (if tracked).

---

### 7.9 Bilingual (English/Spanish)
**FR-I18N-1**: Global language toggle.
**FR-I18N-2**: All core UI strings translated.
**FR-I18N-3**: Content translation support in Sanity:
- Careers and resources can have EN + ES fields
- Fallback behavior configurable (ex: show EN if ES missing, with notice)

**Acceptance Criteria**
- User can complete core journeys fully in Spanish.

---

### 7.10 Optional: AI Career Chat

**FR-AI-1**: Chat entry point:
- Global “Ask AI” page and/or contextual “Ask about this career” module on career detail pages.

**FR-AI-2**: Chat behavior:
- Suggested prompts
- Streaming responses (preferred)
- Clear disclaimers: informational only; not medical/legal advice

**FR-AI-3**: Grounding:
- The assistant should preferentially use catalog data from Sanity as context.
- If it cannot answer from catalog data, it should say so and suggest next best actions (resources, advisors, official links).

**FR-AI-4**: Safety:
- Content moderation and abuse prevention (rate limits, prompt injection hardening).
- No collection of sensitive personal data via chat.

**Acceptance Criteria**
- AI feature can be disabled with a single config flag.
- No PII required to use chat.

---

## 8. CMS Requirements (Sanity)

### 8.1 CMS Roles
- Admin
- Editor (content updates)
- Viewer (read-only)

### 8.2 Core content types (schemas)
**Career**
- id/slug
- title (EN/ES)
- summary (EN/ES)
- responsibilities (rich text EN/ES)
- workEnvironment (rich text EN/ES)
- salary: median, rangeMin, rangeMax, notes, source, year
- outlook: qualitative label + numeric fields if available + source/year
- educationRequirements (structured + rich text EN/ES)
- prerequisites (structured EN/ES)
- licensureAndCerts (structured list EN/ES)
- categories/tags
- similarCareers (references)
- programs (references)
- scholarships (references)
- professionalOrgs (references)
- media: images, optional video URL
- lastReviewedAt, lastUpdatedAt

**Program / School**
- name
- region/location
- credential type
- duration (value + unit)
- cost (range/estimate + notes)
- prerequisites
- accreditation info (if relevant)
- link

**Scholarship**
- name, eligibility, region, deadline, link, summary (EN/ES)

**Resource**
- category, title (EN/ES), summary (EN/ES), link, region, tags

**ProfessionalOrganization**
- name, link, description (EN/ES)

**Quiz**
- questions, answer options, scoring/mapping metadata to careers/tags

**Site Settings**
- nav, footer links, announcements, feature flags, SEO defaults


### 8.3 Content governance (recommended fields)
- “Last reviewed” date and “Reviewer” (internal)
- Content source attribution fields (where applicable)

---

## 9. State Management & Data Fetching (Frontend)

### 9.1 Zustand usage (guidance)
Use Zustand for:
- Compare set
- Favorites
- Language preference
- Quiz in-progress state
- Feature flags (hydrated from CMS settings)
- UI state (filter drawer open, etc.)

### 9.2 Persistence
- localStorage for favorites/compare/language
- URL query params for browse filters/search/sort

### 9.3 Data layer
- Sanity GROQ queries for careers/resources/programs
- Caching strategy: client caching (recommended via lightweight cache or query library) + CDN caching via hosting

---

## 10. Analytics & Tracking Requirements

**Events (minimum)**
- Page views (by route)
- Search: query submitted
- Filters: applied/cleared
- Career: detail viewed
- Compare: add/remove, view compare
- Quiz: start, question progress, completion, result clicks
- Resources: outbound link clicks
- Print: initiated
- Share: copy link, email send (if implemented)
- AI chat: open, message sent, response received (if implemented)

**Dashboards**
- Top careers
- Top searches
- Filter usage
- Quiz completion + top recommendations
- Resource link click-through

---

## 11. Non-Functional Requirements

### 11.1 Accessibility (WCAG AA)
- Keyboard navigation for all interactive elements
- Visible focus states
- Proper semantic headings and landmarks
- Screen reader labels for form controls
- Color contrast meets AA
- Skip-to-content link
- Accessible modals/drawers (focus trap, ESC close, ARIA)
- Testing: automated (axe) + manual (screen reader spot checks)

### 11.2 Performance
- Lighthouse targets (initial): Performance ≥ 85 on mobile for key pages
- Core Web Vitals: optimize LCP/CLS/INP (best effort)
- Image optimization (responsive sizes; lazy-load below fold)
- Code splitting by route
- Avoid blocking requests on initial paint

### 11.3 Security & Privacy
- HTTPS everywhere
- Sanity tokens not exposed client-side (read-only public dataset or proxy as needed)
- If email save/share exists:
  - Explicit consent
  - Minimal storage
  - Clear privacy statement
- Rate limiting for AI endpoints (if used)
- No sensitive personal data required for core usage

### 11.4 Reliability & Observability
- Error boundary + friendly fallback UI
- Logging and error tracking (Sentry or equivalent recommended)
- Graceful handling of CMS downtime (cached content, friendly message)

### 11.5 Maintainability
- Type-safe models for CMS data
- Component library patterns (Tailwind + reusable primitives)
- Consistent routing and data fetching conventions
- Documentation in-repo: schema notes + how to update content

### 11.6 Compatibility
- Responsive design: mobile, tablet, desktop
- Browser support: latest two versions of Chrome, Edge, Safari, Firefox
- Basic support for school-managed devices (Chromebooks)

---

## 12. Edge Cases & Error States (must design/implement)

- No careers match filters
- Missing salary/outlook/education data
- Program links broken or unavailable
- Partial Spanish translations
- Compare set empty or only 1 item
- Quiz abandoned mid-way
- Sanity fetch fails (network/offline)
- Print layout overflow (very long rich text)

---

## 13. Out of Scope (explicit)
- User accounts with full profiles, passwords, or social login
- Payments, subscriptions, e-commerce
- Job board / application submission system
- Real-time messaging with advisors
- Any feature requiring collection of sensitive personal data
- Native mobile apps (iOS/Android) (web responsive only)

---

## 14. Release Plan (suggested)

### MVP (Launch)
- Home, Browse + Filters + Search
- Career detail pages (all sections)
- Compare careers
- Career quiz + results
- Resource hub + scholarships sub-section
- Print-friendly pages
- EN/ES support (UI + content where available)
- Analytics baseline
- Accessibility baseline

### Post-launch (Enhancements)
- Deeper program/school filtering and map view (if desired)
- Advanced quiz logic and explainability improvements
- AI career chat behind a feature flag
- PDF export server-side (optional)

---

## 15. Acceptance Criteria Summary (Definition of Done)
- All MVP flows complete end-to-end on mobile and desktop.
- WCAG AA checks pass (no critical issues).
- Content fully manageable in Sanity by non-engineers.
- Analytics events implemented for key actions.
- Print outputs are usable and readable.
- App supports EN/ES with persistent language selection.

---

## 16. Open Questions (track in repo)
- Is AI Career Chat in scope for MVP or post-launch (feature-flagged)?
- Exact filter taxonomy (salary bands, education levels, outlook labels).
- Source-of-truth for salary/outlook data and update frequency.
- Required Virginia/state branding/footer/legal copy.
- Whether “save/share via email” requires storage or can be “send-only”.

---