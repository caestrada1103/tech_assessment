# Defect Report

---

## DEF-001 — Mobile Number Field Accepts Fewer Than 10 Digits

### Summary
The Practice Form allows users to submit with a mobile number shorter than 10 digits (e.g. 5 or less digits) without showing any validation error. The form submits successfully and the truncated number appears in the confirmation modal as if it were valid.

---

### Environment

| Field       | Value                                  |
| ----------- | -------------------------------------- |
| Application | DEMOQA Practice Form                   |
| URL         | https://demoqa.com/automation-practice-form |
| Browser     | Electron 138 (headless) / Chrome       |
| Cypress     | v15.15.0                               |
| Date Found  | May 20, 2026                           |

---

### Steps to Reproduce

1. Navigate to **https://demoqa.com/automation-practice-form**
2. Fill in all required fields:
   - **First Name:** `Short`
   - **Last Name:** `Number`
   - **Email:** `short.mobile@example.com`
   - **Gender:** Select any option (e.g. `Female`)
   - **Mobile:** `12345` ← only 5 digits
3. Click the **Submit** button

---

### Expected Result

The form should **reject** the submission and display a validation message indicating that the mobile number must be exactly 10 digits long. The input field should be marked as invalid (e.g. highlighted in red or trigger an error message).

---

### Actual Result

The form **submits successfullly**. The confirmation modal appears with the title _"Thanks for submitting the form"_ and displays `12345` as the accepted mobile number — no error or warning is shown to the user.

---

### Supporting Evidence

This behavior is covered and confirmed by the following automated test:

```
cypress/e2e/formsAccordion.cy.js
  ✓ should submit when mobile number has less than 10 digits
```

The test was written specifically to document this defect. It passes because the form does **not** block the submission — which is the bug itself.

---

### Severity & Priority

| Attribute    | Rating    | Rationale |
| ------------ | --------- | --------- |
| **Severity** | `Medium`  | The missing validation does not crash the application, but it allows corrupt data (malformed phone numbers) to be stored or processed, which can break downstream systems like SMS notifications or user contact flows. |
| **Priority** | `High`    | Mobile number is a required field and users expect it to be properly validated. This kind of silent acceptance erodes trust in the form and the product. It is a quick fix (client-side `maxLength`/`pattern` or server-side check) with high value. |

---

### Root Cause Hypothesis

The `Mobile` input field (`#userNumber`) likely sets `type="number"` or `type="text"` with a `maxLength` attribute but **no minimum length constraint** (`minLength` or a pattern like `\d{10}`). Browser-native validation only enforces `required` and `maxLength`, not minimum length, so a 5-digit entry slips through undetected.

---

### Suggested Fix

Add a `minlength="10"` and `pattern="\d{10}"` attribute to the mobile input field, or add explicit server-side validation that rejects mobile numbers with fewer than 10 digits. A user-friendly inline error message such as _"Please enter a valid 10-digit mobile number"_ should be shown on invalid submission.

---
