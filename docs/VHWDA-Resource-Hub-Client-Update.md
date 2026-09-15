# VHWDA Career Resources Hub

## Client update: what’s new and how to maintain it

**Prepared for:** Virginia Health Workforce Development Authority  
**Date:** September 10, 2026  
**Companion:** A Loom walkthrough will show how publishing a change in Sanity appears on the live website. Paste the Loom link here when it is ready: _[Loom URL]_

This document describes the new Career Resources Hub, the educator library, and the submit/review process. It is written for staff who will add and maintain listings over time. You do not need to be a developer to use this guide.

---

## 1. Purpose of these updates

The site already helped people explore healthcare careers. These updates add a second job: helping students, career changers, and educators take the **next step** after they find a path they like.

Three things are now in place:

1. **A public Resources page** that groups next-step opportunities in one place (scholarships, organizations, schools, internships, and grants).
2. **An educator library** where teachers and counselors can sign in and download classroom materials.
3. **A submit-and-review process** so partners can send listings to VHWDA, and staff can approve them into the CMS.

Content is still edited in **Sanity Studio**. Publishing in Studio is what updates the website. The Loom video walks through that path.

---

## 2. What visitors see

### 2.1 Public Resources page

**Live URL:** [https://vahealthcareers.org/resources](https://vahealthcareers.org/resources)

The page is titled **Plan Your Next Steps**. On the left, visitors get a short introduction and a button to the **Educator resource library**. On the right, they jump to a section. Each section has its own listings, filters, and (where useful) sort options.

**Desktop:** The introduction stays in place while they scroll the list of sections.  
**Mobile:** Sections open one at a time, like an accordion.

| Section | What it is | How people use it |
|---|---|---|
| Scholarships & Financial Aid | Funding for education | Shown as “coming soon” until you turn scholarships on in Site Settings (see section 6). When on, visitors can search by keyword and open the scholarship website. |
| Professional Organizations | Associations and networks | Filter by membership type, geographic focus, and career area. Open the organization’s website. |
| Schools & Prerequisites | Virginia training programs and schools | Browse by region and use the map. Selecting a school or pin opens the school website. There is no sidebar filter on this section. |
| Internships & Experiences | Internships, shadowing, volunteer, research, and similar | Filter by experience type, pay, audience, location, setting, and career area. Sort by title, deadline, or recently added. |
| Grants & Opportunities | Workforce and training funding | Filter by opportunity type, who can apply, location, and career area. Sort by title, deadline, or recently added. |

Classroom materials for teachers do **not** appear on this public page. They live only in the educator library.

### 2.2 Educator resource library

**Live URL:** [https://vahealthcareers.org/teachers](https://vahealthcareers.org/teachers)

Also linked from the site header (**For Educators**), the footer, and the Resources page button.

Educators:

1. Create an account or sign in (email and password).
2. Complete a short school profile the first time (name, school, and why they need the materials; role and grade levels are optional).
3. Browse and search **Classroom materials**.
4. **Download** a file when one is attached, or **Visit site** when the item is only a web link.

Downloads are logged (who, school, which file, when) so VHWDA can see usage in the review portal.

There is no approved-school list in the product today. Anyone who can create an account can use the library. Google sign-in can be added later; it is turned off until that is configured.

### 2.3 Submit a resource (unlisted)

**URL:** [https://vahealthcareers.org/resource-submit](https://vahealthcareers.org/resource-submit)

This form is **not** in the main navigation. Share the link with partners when you want outside submissions.

Submitters choose a type (scholarship, organization, internship, grant, or classroom resource), then enter name, description, link, and their contact information. Schools cannot be submitted through this form.

The form does **not** collect every filter field (for example, internship compensation or classroom material type). After you approve a submission, complete those fields in Sanity so the listing filters correctly on the site.

There is no file upload on the public form. For classroom materials, submitters can paste a file link. Staff can also upload the file in Sanity after review.

Submitters do **not** receive an automatic email when they submit, or when you approve or decline.

### 2.4 Review portal (staff only, unlisted)

**URL:** [https://vahealthcareers.org/resource-portal](https://vahealthcareers.org/resource-portal)

This page is password-protected. Share the password only with staff who should review submissions.

**Submissions tab**

- Filter by pending, approved, or declined.
- Open a row to read everything the partner sent.
- **Approve** creates a published listing in Sanity right away. It can appear on the site as soon as the page is refreshed.
- **Decline** closes the request. Nothing is created in Sanity.

What gets created depends on the type:

- Scholarship (public hub) → a **Scholarship** document
- Organization (public hub) → a **Professional Organization** document
- Internship, grant, classroom material, or anything sent to the teacher library → a **Hub Resource** document

**Teacher downloads tab**

- Shows which educators downloaded which classroom files.

The older addresses `/scholarship-submit` and `/scholarship-portal` still open these same pages.

---

## 3. How content is organized (this is the important part)

Think of the hub as **two kinds of content**, not one big list.

### 3.1 Content that already had its own home

These stay in their own Sanity folders. Do **not** recreate them as Hub Resources.

| Sanity folder | What it feeds on the website |
|---|---|
| **Scholarships** | Scholarships & Financial Aid (when that section is enabled) |
| **Professional Organizations** | Professional Organizations |
| **Educational Institutions** | Schools & Prerequisites (and school names on career pages) |

They keep their own fields (funding type for scholarships, membership type for organizations, map location for schools). Mixing them into Hub Resource would break those pages.

### 3.2 New “Hub Resource” listings

Internships, grants, and classroom materials share one document type: **Hub Resource**. What changes is the **Resource type** you attach.

| Sanity folder | Resource type | Where it appears |
|---|---|---|
| **Internships & Experiences** | Internships & Experiences | Public Resources page |
| **Grants & Opportunities** | Grants & Opportunities | Public Resources page |
| **Educational Resources** | Educational Resources | Educator library only |
| **Other hub resources** | Any other generic type you add later | Depends on that type’s audience setting |

When you create a document **from the matching folder**, Sanity pre-selects the type and shows only the fields for that type. Prefer that over creating a blank Hub Resource and picking the type by hand.

**Resource Types** (a separate list in Studio) are the “labels” for sections. They control the section title, description, color, icon, order, whether the type is public or teacher-only, and whether it appears on the submit form. You usually will not need to edit these after launch unless you add a new kind of listing.

### 3.3 Why this split exists

Scholarships, organizations, and schools were already in the CMS and on the site. Internships, grants, and classroom files are new. Putting the new items in one flexible Hub Resource type means you can add another category later (for example, mentorships) without inventing a whole new document type. The older three stay separate so existing career and school pages keep working.

---

## 4. Fields that matter for filters

The website filters only work if the matching fields are filled in Sanity. A listing with only a title and a link will still show, but it will be hard to find when someone uses the sidebar.

### Internships & Experiences

Complete these whenever you can:

- **Experience type** (required) — Internship, Shadowing, Volunteer, Clinical rotation, Research, Apprenticeship
- **Compensation** (required) — Paid, Stipend, Unpaid
- **Who it is for** — High school, Undergraduate, Graduate, Career changer
- **Setting** — Hospital, Clinic, Public health, Community, Lab / research, Other
- **Location & scope** — Virginia statewide, Regional, Local, Remote, National
- **Duration** — free text (for example, “Summer” or “8 weeks”)
- **Deadline** and **Eligibility** — used on the card and for “Deadline (soonest)” sort
- **Link** (required)
- **Career areas** — so the Career Area filter works
- **Title, Summary or Description, Host / sponsor** — what visitors read

### Grants & Opportunities

- **Opportunity type** (required) — Last-dollar / remaining tuition, Workforce grant, Credential funding, Employer-sponsored, Other
- **Who can apply** (required) — Student, Worker / incumbent, Adult learner, Employer, School / program
- **Location & scope**
- **Funding amount** — optional, free text (for example, “Up to $3,000”)
- **Deadline, Eligibility, Link, Career areas**

### Educational Resources (teacher library)

- **Material type** (required) — Lesson plan, Curriculum, Activity, Facilitator guide, Video, Slide deck, Career profile
- **Grade / audience** — Elementary, Middle school, High school, CTE, Counselor / advisor
- **Topic** — Career exploration, Workplace safety, Public health, Clinical skills, Pathway planning
- **Format** — PDF, Web page, Video, Slides
- **Downloadable file** and/or **External file URL** — teachers need one of these (or a regular **Link**)
- **File label** — optional, for example “Lesson plan PDF”
- **Host / sponsor, Career areas**

Deadline and eligibility are hidden for classroom materials. That is intentional.

### Shared Hub Resource fields

Every hub listing also has **Title** (English and Spanish), **Summary**, **Description**, **Host / sponsor**, **Region (free text)**, **Tags**, and **Published**.

Turn **Published** off to hide a listing without deleting it. Turn it back on when you want it live again.

### Scholarships, organizations, and schools

Keep using the fields already on those documents. Career area and similar filters on organizations come from those existing fields, not from Hub Resource.

---

## 5. Day-to-day work in Sanity

**Studio URL:** [https://careercatalog.sanity.studio/](https://careercatalog.sanity.studio/)

The public website address `/admin` is **not** the CMS. Always use the Studio link above.

### Add an internship or grant

1. Open **Internships & Experiences** or **Grants & Opportunities**.
2. Create a new document (the type is already set).
3. Fill the type-specific fields, title, host, link, and career areas.
4. Leave **Published** on, then publish the document.
5. Refresh [https://vahealthcareers.org/resources](https://vahealthcareers.org/resources) and open that section.

### Add a classroom material

1. Open **Educational Resources**.
2. Create a new document.
3. Set material type, audience, topic, and format.
4. Upload a **Downloadable file** or paste an **External file URL**.
5. Publish.
6. Confirm it on [https://vahealthcareers.org/teachers](https://vahealthcareers.org/teachers) (sign in or use the demo library if samples are on).

### Add a scholarship, organization, or school

Use the existing **Scholarships**, **Professional Organizations**, or **Educational Institutions** folders, the same way you already maintain careers and schools. Do not add these as Hub Resources.

Scholarships will not appear on the public hub until **Scholarships Enabled** is turned on (section 6).

### Approve a partner submission

1. Open the review portal and approve the item.
2. Open the new document in Studio (the portal shows the Sanity document ID after approval).
3. Fill any missing filter fields (experience type, material type, and so on).
4. Confirm **Published** is on.

### Hide or remove a listing

- **Hide for now:** turn **Published** off and publish.
- **Remove for good:** delete the document. Prefer unpublishing if you might need it again.

### Add a new kind of hub section later

If VHWDA wants a new public category (for example, “Mentorships”):

1. Create a **Resource Type** with a simple slug (letters, numbers, hyphens only — no periods).
2. Set **Content source** to generic hub resources.
3. Set **Audience** to public hub, teacher portal, or both.
4. Decide whether it should appear on the submit form.
5. Add listings under **Other hub resources**, choosing that new type.

The Resources page and submit form pick up new types from Sanity. If you want a dedicated left-nav folder for the new type (like Internships and Grants already have), ask the project team to add that folder in Studio.

### Language

Titles and descriptions support English and Spanish. Fill both when you can. If Spanish is empty, the site falls back to English.

---

## 6. Switches that change the live site

In Studio, open **Site Settings** → **Feature Flags**.

| Setting | What it does |
|---|---|
| **Scholarships Enabled** | Off: the scholarships section shows as coming soon. On: published scholarships appear with search. |
| **Demo sample resources** | On: if internships, grants, or the teacher library have **no** published CMS items, the site shows sample listings so you can demo the design. Off: empty sections stay empty. |
| **AI Chat Enabled** | Controls Ask AI. Separate from this hub. |

You can also preview samples in one browser tab without changing the flag for everyone:

- On: [https://vahealthcareers.org/resources?demo=1](https://vahealthcareers.org/resources?demo=1)
- Off: add `?demo=0`

Samples never invent fake scholarships, organizations, or schools. Those always come from real CMS documents (or the scholarships construction state).

---

## 7. Sample content to remove after the demo

The production CMS currently includes sample Hub Resources so the internships, grants, and educator sections look complete in a walkthrough. When real listings are ready, delete these documents (or unpublish them) and turn **Demo sample resources** off.

**Internships**

- VDH Summer Public Health Internship
- AHEC Health Careers Shadowing
- Hospital Volunteer & Pre-Health Experience
- UVA Health Undergraduate Research Internship
- VCU Health Nursing Student Internship
- Remote Health Communications Internship

**Grants**

- Get Skilled, Get a Job, Give Back (G3)
- New Economy Workforce Credential Grant
- Hospital Employer Tuition Support
- Rural Health Workforce Opportunity Grant
- Adult Career Switcher Health Training Award

**Educational resources**

- Youth@Work: Talking Safety (health settings)
- Exploring healthcare careers (BLS Occupational Outlook)
- Virginia school health resources
- Health career pathway planner (classroom activity)
- Intro to clinical skills slide deck

After they are gone, only listings you publish will appear.

---

## 8. Habits that keep the hub healthy

**Do**

- Create internships, grants, and classroom items from their own folders.
- Fill the filter fields, not only the title and link.
- Use **Published** to hide something temporarily.
- Keep English and Spanish in sync when you have both.
- Upload classroom files in Sanity (or store a stable file URL).
- Review partner submissions, then finish the Sanity record.
- Turn demo samples off when you are done showing the feature.

**Don’t**

- Recreate a scholarship, organization, or school as a Hub Resource.
- Put a classroom file on a public internship or grant (files are for the educator library).
- Change a Resource Type’s slug after it is in use (filters and the submit form depend on it). Ask the project team if a rename is needed.
- Put a period (`.`) in a document ID. Sanity treats dotted IDs as private, and the public site cannot read them.
- Expect `vahealthcareers.org/admin` to open the CMS.

---

## 9. What is intentionally not finished

These are known limits, not bugs to “fix in the CMS”:

1. **Scholarships** stay in a coming-soon state until you enable them. Sidebar filters and sort for scholarships are not on the live hub yet (keyword search only, once enabled).
2. **Google sign-in** for educators is built but hidden until VHWDA wants it and it is configured.
3. **No confirmation emails** on submit, approve, or decline.
4. **No school-email restriction** on educator accounts.
5. **No file picker** on the public submit form.
6. **Schools** are staff-maintained in Sanity only.
7. **Ask AI** is a separate feature and is not required for this hub.

---

## 10. Quick URL list

| Page | Address | Who it’s for |
|---|---|---|
| Resources hub | https://vahealthcareers.org/resources | Public |
| Demo samples (this tab only) | https://vahealthcareers.org/resources?demo=1 | Presenters |
| Educator library | https://vahealthcareers.org/teachers | Teachers and counselors |
| Submit a resource | https://vahealthcareers.org/resource-submit | Partners (share the link) |
| Review portal | https://vahealthcareers.org/resource-portal | VHWDA staff (password) |
| Sanity Studio | https://careercatalog.sanity.studio/ | Content editors |

---

## 11. How this pairs with the Loom

Use this document as the written record. Use the Loom as the visual tour. A useful recording order:

1. Open Studio and show the new folders next to Scholarships, Organizations, and Schools.
2. Publish a small edit on an internship or grant (title or filter field).
3. Refresh the Resources page and show the same change.
4. Open an Educational Resource, point out the file field, then show it in the educator library.
5. Walk through one submit → review → approve, then find the new document in Studio.
6. Show Site Settings flags: scholarships on/off and demo samples on/off.

If anything in the video disagrees with this document, treat **published Sanity content** as the source of truth for what appears on the site.
