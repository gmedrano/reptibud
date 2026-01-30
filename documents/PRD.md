# Product Requirements Document (PRD)

**Product:** ReptiBud

**Version:** v0.1 – Logbook Mode

**Purpose:** Internal dogfooding MVP

**Audience:** Founders / Engineers

**Status:** Build-ready

---

## **1. Product Overview**

ReptiBud v0.1 is a **mobile-first web application** that allows reptile owners to **log basic care information** for their pets.

The goal is to replace notes, reminders, and memory with a simple, consistent logbook.

This version is built **for internal use first** and optimized for speed of development and iteration.

---

## **2. Goals & Non-Goals**

### **Goals**

- Log feeding and basic care events quickly
- Maintain a simple historical timeline per pet
- Support multiple pets (CRUD)
- Be usable daily on phone and desktop
- Establish a clean foundation for future features

### **Non-Goals (Explicitly Out of Scope)**

- AI features
- Analytics or charts
- Advanced health scoring
- Species intelligence
- Notifications beyond basic placeholders
- Social or sharing features

---

## **3. Target Platforms**

- **Primary:** Mobile browsers (iOS Safari, Android Chrome)
- **Secondary:** Desktop browsers
- Responsive design is required from day one.

---

## **4. Tech Stack (Locked)**

### **Frontend**

- **Framework:** Next.js (App Router)
- **Styling:**
    - CSS Components (component-scoped CSS files)
    - BEM naming convention
- **State:** React state + minimal local state
- **Responsiveness:** CSS Grid + Flexbox

### **Backend / Services**

- **Authentication:** Supabase Auth (email + password)
- **Data Storage:**
    - JSON files per pet (temporary approach)
    - Stored per authenticated user
- **Database:** Not used yet (Supabase DB deferred)

---

## **5. Authentication Requirements (Basic)**

### **Auth Scope**

- Email + password login
- Signup
- Logout
- No password reset flows required initially
- No roles or permissions

### **Behavior**

- User must be authenticated to access app
- Each user sees **only their own pets**
- Auth state persists across sessions

---

## **6. Data Model (Initial)**

### **Pet (stored as JSON)**

```
{
  "id": "uuid",
  "name": "Kophii",
  "species": "Ball Python",
  "photoUrl": "/uploads/kophii.jpg",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE"
}
```

### **Log Entry**

```
{
  "id": "uuid",
  "type": "feeding | shedding | note",
  "content": "Ate one mouse",
  "timestamp": "ISO_DATE"
}
```

### **File Structure (Example)**

```
/user-data/
  /user-id/
    /pets/
      pet-1.json
      pet-2.json
```

Each pet JSON contains:

- Pet metadata
- Array of log entries

---

## **7. Core Features (MVP Scope)**

### **7.1 Pet Management (CRUD)**

**Users can:**

- Create a pet
- View pet details
- Edit pet info
- Delete a pet

**Fields:**

- Name (required)
- Species (required, free text)
- Photo (optional)

---

### **7.2 Feeding Tracker**

**Primary action in the app.**

**User can:**

- Log a feeding with one tap
- Add optional note (food type, size, behavior)

**Auto-generated data:**

- Timestamp
- Log type = feeding

**UX rule:**

Logging a feeding should take **under 5 seconds**.

---

### **7.3 Health / Care Log (Timeline)**

**Supported log types:**

- Feeding (auto-generated)
- Shedding (manual)
- General note (manual)

**Timeline:**

- Chronological (newest first)
- Simple list
- No charts
- No grouping

---

## **8. Screens & Navigation**

### **Required Screens**

1. **Login / Signup**
2. **Pet List**
3. **Pet Detail**
4. **Add / Edit Pet**
5. **Add Log Entry**

### **Navigation**

- Mobile-first bottom or top navigation
- Desktop uses same components with responsive layout
- Breadcrumbs not required

---

## **9. UI Components (Must Be Reusable)**

Each UI element should be built as a component.

### **Required Components**

- Button
- Input
- Textarea
- Modal
- Card
- Timeline Item
- Pet Card
- Header / Navigation
- Empty State

### **Styling Rules**

- BEM naming enforced
- No inline styles
- Component-scoped CSS files only
- Design should feel neutral and calm

---

## **10. Responsiveness Requirements**

- Mobile-first layout
- Breakpoints:
    - Mobile (default)
    - Tablet
    - Desktop
- Touch-friendly interactions
- No hover-only interactions

---

## **11. Error Handling & Edge Cases**

- Graceful empty states:
    - No pets
    - No logs
- Form validation:
    - Required fields only
- JSON read/write failures should fail silently with user-friendly messaging

---

## **12. Security & Privacy**

- Supabase handles auth securely
- Pet data is private per user
- No public access
- No analytics or tracking scripts

---

## **13. Future-Proofing (Notes, Not Requirements)**

- JSON storage will later migrate to Supabase DB
- Logs are structured for future AI use
- Component architecture should support expansion

---

## **14. Success Criteria (Internal)**

- App is used daily for at least one pet
- Feeding logs are consistently added
- No friction logging basic events
- Codebase feels easy to extend

---

## **15. Out of Scope for v0.1 (Reconfirmed)**

- Notifications
- AI
- AR
- Analytics
- Sharing
- Vet reports
- Growth charts

---

## **Final Notes**

This PRD intentionally prioritizes:

- **Speed over polish**
- **Usage over impressiveness**
- **Clarity over flexibility**

If this version doesn’t get used daily by you, **nothing else matters**.