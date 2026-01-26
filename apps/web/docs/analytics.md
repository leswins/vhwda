## GA4 Analytics (VHWDA Careers Catalog)

### Setup
- Set `VITE_GA_MEASUREMENT_ID=G-ETDR168HK8` in production environment variables.
- Analytics are disabled by default in local/dev. To enable DebugView locally, set `VITE_GA_DEBUG_MODE=true`.
- GA4 is initialized in `apps/web/src/main.tsx` and route-based `page_view` is tracked in `apps/web/src/ui/AppShell.tsx`.

### Event taxonomy
All events include `language` when available.

| Event | When fired | Key params |
| --- | --- | --- |
| `page_view` | Route changes | `page_path`, `page_location`, `page_title`, `language` |
| `career_search` | Search in Browse or Global Search | `query`, `results_count`, `filters_active_count`, `source`, `language` |
| `career_filter_apply` | Browse filters change | `filter_keys`, `filters_active_count`, `results_count`, `language` |
| `career_sort_change` | Browse sort change | `sort_by`, `sort_direction`, `results_count`, `language` |
| `career_detail_view` | Career detail loaded | `career_id`, `career_slug`, `career_title`, `language` |
| `career_click` | Career card click | `source`, `career_id`, `career_slug`, `career_title`, `results_count`, `language` |
| `compare_start` | First career added | `compare_count`, `source`, `language` |
| `compare_view` | Compare view with 2+ careers | `compare_count`, `language` |
| `compare_add` | Add to compare | `career_id`, `career_slug`, `career_title`, `compare_count`, `source`, `language` |
| `compare_remove` | Remove from compare | `career_id`, `career_slug`, `career_title`, `compare_count`, `source`, `language` |
| `compare_search` | Search within compare | `query`, `results_count`, `language` |
| `quiz_start` | Quiz begins | `questions_count`, `language` |
| `quiz_complete` | Quiz submitted | `questions_count`, `answered_count`, `language` |
| `quiz_results_view` | Quiz results shown | `matched_count`, `language` |
| `quiz_recommendation_click` | Quiz recommendation clicked | `source`, `career_id`, `career_slug`, `career_title`, `match_percent`, `language` |
| `resource_section_jump` | Jump to Resources section | `section_id`, `resource_type`, `language` |
| `resource_search` | Search in resources | `resource_type`, `query`, `results_count`, `language` |
| `resource_filter_apply` | Resource filters change | `resource_type`, `filter_keys`, `results_count`, `language` |
| `resource_click` | Resource item clicked | `resource_type`, `resource_id`, `resource_title`, `language` |
| `outbound_click` | External link click | `outbound_url`, `outbound_domain`, `resource_type`, `resource_id`, `resource_title`, `career_id`, `career_slug`, `career_title`, `language` |
| `ai_chat_open` | AI Chat view loaded | `language` |
| `ai_chat_message_sent` | User sends message | `message_length`, `language` |
| `ai_chat_quick_prompt_click` | Quick prompt clicked | `prompt`, `language` |
| `ai_chat_career_click` | Career clicked from AI | `career_id`, `career_slug`, `career_title`, `language` |
| `language_change` | User toggles EN/ES | `language`, `previous_language` |

### Conversions (mark in GA4 UI)
- `career_click`
- `outbound_click`

### Where events are fired
- Page views: `apps/web/src/ui/AppShell.tsx`
- Browse/Search/Filters: `apps/web/src/views/SearchCareersPage.tsx`
- Career detail view + org outbound clicks: `apps/web/src/views/CareerDetailPage.tsx`
- Compare flows: `apps/web/src/views/ComparePage.tsx`
- Quiz lifecycle + recommendation clicks: `apps/web/src/ui/widgets/quiz/`
- Resources + scholarships + orgs: `apps/web/src/views/ResourcesPage.tsx`, `apps/web/src/ui/widgets/PlanYourNextStepsSection.tsx`, `ScholarshipCard.tsx`, `ProfessionalOrganizationCard.tsx`
- AI chat usage: `apps/web/src/views/ChatPage.tsx`, `apps/web/src/ui/widgets/chat/ChatCareerCard.tsx`
- Language toggle + global search: `apps/web/src/ui/widgets/NavHeader.tsx`

### Verify in GA4 DebugView
1. In local/dev, set `VITE_GA_DEBUG_MODE=true` and run the app.
2. Open GA4 → Admin → DebugView.
3. Navigate the app and confirm events appear with correct params.
4. Confirm `page_view` uses correct `page_path` and `page_location`.

### Reporting guidance
Funnels:
- Home → Quiz Start → Quiz Complete → Results → Career Click
- Browse → Filter/Search → Career Detail
- Career Detail → Outbound School/Program Click (use `outbound_click` on detail view)
- Compare Start → Compare View
- Resource List → Resource Click

Content performance:
- Top career detail views (`career_detail_view`)
- Top quiz-recommended careers clicked (`quiz_recommendation_click`)
- Most used filters (aggregate `career_filter_apply.filter_keys`)
- Top outbound domains (`outbound_click.outbound_domain`)

Segmentation:
- Language: use `language`
- Device category: GA4 device reports
- New vs returning: GA4 user reports
- Source/medium: GA4 acquisition reports
