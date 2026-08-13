# Design Brief: CampusFlow

## 1. Design Principles

1.  **Clarity Over Cleverness:** The primary purpose of this tool is to communicate critical academic data (attendance, grades, risk status). Avoid hidden menus, complex hover states, or abstract icons. If a student is failing, they need to know instantly without deciphering a complex chart.
2.  **Frictionless Data Entry:** For Faculty and Admin, the system is an operational tool, not a leisure app. Workflows like taking attendance for 60 students must be optimized for speed, utilizing keyboard navigation, sensible defaults (e.g., all present by default), and bulk actions.
3.  **Proactive, Not Reactive:** The UI should guide users on what requires their attention *right now*. For students, this means highlighting the Academic Risk Detector. For faculty, it means bubbling up today's pending attendance lists to the top of the dashboard.

## 2. Visual Direction

*   **Mood:** Trustworthy, calm, structured, and modern. It should feel like a premium enterprise SaaS product (like Linear or Vercel), not a traditional, clunky university portal.
*   **References:** Clean lines, subtle borders, high-contrast typography, and purposeful use of whitespace to separate data rather than heavy bounding boxes.
*   **What to Avoid:** Academic cliches (no graduation caps, owls, or stacks of books). Avoid pure black (`#000000`) and pure white (`#FFFFFF`) for large background expanses; they cause eye strain. Avoid overly vibrant, distracting background colors.

## 3. Design Tokens

### Color Palette
We use a slate and indigo palette. Indigo feels academic yet modern, while slate provides softer contrast than stark black.

*   **Primary Brand:** Indigo-600 (`#4F46E5`) - Used for primary actions, active states, and brand highlights. Justification: Trustworthy, widely recognized as interactive in digital products.
*   **Background (App):** Slate-50 (`#F8FAFC`) - A very subtle cool gray to separate the background from white content cards.
*   **Surface (Cards/Modals):** White (`#FFFFFF`) - Provides a crisp canvas for data.
*   **Text Primary:** Slate-900 (`#0F172A`) - For headings and critical data.
*   **Text Secondary:** Slate-500 (`#64748B`) - For labels, table headers, and supporting text.
*   **Border:** Slate-200 (`#E2E8F0`) - For subtle separation between elements.

**Semantic/Risk Colors (Crucial for the Risk Detector):**
*   **🟢 Success / Good Standing:** Emerald-500 (`#10B981`) - Calming, universally understood as "good."
*   **🟡 Warning / Needs Improvement:** Amber-500 (`#F59E0B`) - Draws attention without inducing panic.
*   **🔴 Danger / At Risk:** Red-500 (`#EF4444`) - Urgent, demands immediate action.

### Typography
*   **Font Family:** `Inter` (sans-serif). Justification: Exceptionally readable at small sizes (crucial for data tables) and handles numbers beautifully.
*   **Scale:** Base 16px (1rem). 
    *   H1: 2.25rem (36px), Bold
    *   H2: 1.5rem (24px), Semibold
    *   Body: 1rem (16px), Regular
    *   Small Data/Labels: 0.875rem (14px), Medium

### Spacing & Geometry
*   **Scale:** Standard 4px-based scaling system (4px, 8px, 12px, 16px, 24px, 32px).
*   **Border Radius:** 
    *   Buttons & Inputs: `6px` (slightly softened).
    *   Cards & Modals: `12px` (approachable but professional).
*   **Shadows:** 
    *   Cards: Very subtle (`0 1px 3px rgba(0,0,0,0.1)`). 
    *   Modals/Dropdowns: Elevated (`0 10px 15px -3px rgba(0,0,0,0.1)`).

## 4. Screen Inventory

1.  **Login Screen:** Universal entry point. (Email, Password, Login Button).
2.  **Student Dashboard:** The core student view. Contains the Risk Detector hero card, mini-timetable for the day, and recent notices.
3.  **Student - Attendance Detail:** Subject-by-subject breakdown of present/absent counts.
4.  **Student - Marks Detail:** Transcript-style view of all assessment scores.
5.  **Faculty Dashboard:** Overview of assigned classes for the day. Quick links to "Take Attendance" and "Enter Marks".
6.  **Faculty - Take Attendance:** Roster view with Present/Absent toggles for a specific subject and date.
7.  **Faculty - Enter Marks:** Grid/spreadsheet view to input scores for a specific assessment.
8.  **Admin Dashboard:** High-level system stats. Links to user management and course management.
9.  **Admin - User Management:** Data table to view, add, or edit Students and Faculty.

## 5. User Flows

### Core Journey 1: Student Checking Risk Status
1.  **Step 1:** Student lands on Login screen, enters credentials.
2.  **Step 2:** System routes to Student Dashboard.
3.  **Step 3:** The top-most component is the **Academic Risk Card**. It immediately displays a large Green/Yellow/Red badge with the aggregated attendance and marks percentages.
4.  **Step 4:** Student clicks the "View Details" button on the Risk Card, transitioning to the Attendance/Marks detail screen to see exactly which subject is dragging down their score.

### Core Journey 2: Faculty Taking Daily Attendance
1.  **Step 1:** Faculty logs in, lands on Faculty Dashboard.
2.  **Step 2:** Dashboard shows "Today's Schedule". Faculty clicks "Take Attendance" on the 10:00 AM "Data Structures" card.
3.  **Step 3:** System loads the Take Attendance screen with the roster. **Crucial:** All students are marked "Present" by default to save time.
4.  **Step 4:** Faculty quickly scans the room, clicks the "Absent" toggle next to the 3 missing students.
5.  **Step 5:** Faculty clicks a fixed "Save Attendance" button at the bottom of the screen. System shows a success toast and redirects back to the dashboard.

## 6. Per-Screen Layout (Desktop & Mobile)

*   **Global Navigation:** 
    *   *Desktop:* Persistent left sidebar (250px wide) containing navigation links. Allows maximum vertical space for data tables.
    *   *Mobile:* Bottom navigation bar (for Students, focusing on core views) or a hamburger menu.
*   **Dashboard Layout:** Masonry or grid-based layout. 
    *   *Top Section:* Contextual actions or the most critical data (Risk Detector for students).
    *   *Middle Section:* Secondary data (Timetable, recent marks).
    *   *Bottom/Side Section:* Notice feed.

## 7. Component Library

1.  **Button:**
    *   *Primary:* Indigo background, white text. (e.g., "Save Attendance").
    *   *Secondary:* White background, Slate border, Slate text. (e.g., "Cancel").
    *   *Ghost:* No background, Indigo text on hover. (e.g., "View Details").
2.  **Form Inputs:**
    *   Clean inputs with a 1px Slate-200 border. Focus state must have a 2px Indigo ring (`ring-indigo-500`) for accessibility.
3.  **Status Badge:**
    *   Pill-shaped, bold text. (e.g., Green background/Dark Green text for "Good Standing").
4.  **Data Table:**
    *   Sticky header.
    *   Subtle hover state on rows (`bg-slate-50`) to help the eye track across wide screens.
5.  **Risk Detector Hero Card:**
    *   A large, prominent component. Left side contains the status icon (Check, Warning Triangle, Alert Octagon) and text ("Needs Improvement"). Right side shows two large progress rings for overall Attendance and Marks.

## 8. States

*   **Empty States:** Never show a blank screen or a raw "0 results" table. If a student has no marks yet, show an illustration (e.g., a simple SVG of a document) and text: "No marks uploaded yet for this semester."
*   **Loading:** Use skeleton loaders instead of spinning wheels. Skeletons (pulsing gray blocks matching the shape of the content) reduce perceived wait times and prevent the page layout from jumping around when data loads.
*   **Error:** Inline error messages for forms (red text below the input). Global errors (e.g., failed to fetch data) use a subtle toast notification at the bottom right, not a jarring alert box.
*   **Success:** Temporary toast notifications (green border, check icon) that auto-dismiss after 3 seconds.

## 9. Responsive Behaviour

*   **Student Interface (Mobile-First):** Students will predominantly use CampusFlow on their phones while walking between classes. Data tables must collapse into stacked cards on mobile screens (e.g., Attendance detail row becomes a card with Subject Name on top, and Present/Absent count below).
*   **Faculty/Admin Interface (Desktop-First):** Complex tasks like grading 60 students or managing system data require a large screen. While responsive, the primary design effort for these roles focuses on tablet (iPad) and desktop (laptop) resolutions. Data tables will require horizontal scrolling on narrow screens to preserve data integrity.

## 10. Accessibility (A11y)

*   **Contrast Ratios:** All text must meet WCAG AA standards (4.5:1 contrast ratio against the background). The Slate-500 secondary text on a White background passes this requirement.
*   **Focus Management:** Keyboard navigation is critical, especially for Faculty doing repetitive data entry. Every interactive element (button, input, link) must have a distinct, visible focus ring. We will not remove default focus styles without replacing them with something equally visible (e.g., `focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`).
*   **Color as Information:** The Risk Detector cannot rely *only* on color (Red/Yellow/Green) because of color blindness. It must be paired with clear text labels ("At Risk", "Good Standing") and distinct iconography (an "X" vs a "Checkmark").
*   **ARIA Labels:** Ensure screen readers can interpret icon-only buttons (e.g., a trash can icon must have `aria-label="Delete user"`).
