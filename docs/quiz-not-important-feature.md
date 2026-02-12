# Quiz "Not Important" Feature

## Overview

Added a "Not important" option as the last choice for all single-select quiz questions. When selected and the user navigates to the next question, this option behaves like skip - it doesn't impact the vector matrix used for career matching.

## Implementation Details

### 1. Type Definitions (`questions.ts`)

Added `isNotImportant?: boolean` flag to `QuestionOption` type:

```typescript
export type QuestionOption = {
    id: string
    label: string
    weights: Partial<QuizVector>
    hardFilter?: HardFilter
    isNotImportant?: boolean // Special flag for "Not important" option
}
```

### 2. i18n Strings (`i18n.ts`)

Added translations for the "Not important" option:

```typescript
"quiz.notImportant": { en: "Not important", es: "No importante" }
```

### 3. Quiz Data Transformation (`quiz.ts`)

Modified `transformQuiz()` function to automatically append "Not important" option to all single_select questions:

```typescript
// Add "Not important" option for single_select questions
if (q.type === "single_select") {
  options.push({
    id: `${q._key || `q${index + 1}`}_not_important`,
    label: language === "es" ? "No importante" : "Not important",
    weights: {}, // No weights - treated like skip
    isNotImportant: true
  })
}
```

### 4. Behavior

**How it works:**

1. **Selection**: When user selects "Not important", it's treated like any other option - stored in `selectedAnswers`
2. **Vector Impact**: Since the option has `weights: {}` (empty object), no weights are added to the user vector when selected
3. **Navigation**: When user clicks "Next Question", they can proceed normally (because a selection exists)
4. **Skip Equivalent**: The empty weights mean this selection has the same effect on the vector as if the user had clicked "Skip"

**Key difference from Skip:**
- **Skip button**: Removes the question from `selectedAnswers` entirely and removes any previously selected weights
- **"Not important"**: Keeps the selection in `selectedAnswers` (question shows as answered in UI) but contributes zero weight to the vector

### 5. UI Behavior

- "Not important" appears as the last option in the SelectList for single_select questions
- User can select it like any other radio button option
- Once selected, the "Next Question" button becomes enabled (because the question is technically "answered")
- The Skip button remains available as an alternative
- In the sidebar/progress indicators, questions answered with "Not important" show as answered

## Files Modified

1. `/apps/web/src/ui/widgets/quiz/questions.ts` - Added `isNotImportant` flag to type
2. `/apps/web/src/utils/i18n.ts` - Added translation strings
3. `/apps/web/src/sanity/queries/quiz.ts` - Auto-append "Not important" to single_select questions

## Testing Scenarios

1. ✅ "Not important" appears as last option in single_select questions
2. ✅ Selecting "Not important" enables the "Next Question" button
3. ✅ Selecting "Not important" and navigating does not affect the user vector
4. ✅ User can still use Skip button instead of selecting "Not important"
5. ✅ Questions answered with "Not important" show as answered in the sidebar
6. ✅ Multi-select questions do not show "Not important" option
7. ✅ Likert and rating scale questions do not show "Not important" option
8. ✅ Boolean questions do not show "Not important" option

## Future Considerations

- If we want to track analytics differently for "Not important" vs "Skip", we can use the `isNotImportant` flag
- If we need to show "Not important" selections differently in the UI, we can check for `isNotImportant` flag
- Could add similar functionality to multi_select questions if needed (would require different UX approach)
