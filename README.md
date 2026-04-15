# Online Courses Platform

A desktop-first online learning platform built for the Redberry Bootcamp XI assignment.

## Overview

This application allows users to:

- browse educational courses
- search, filter, sort, and paginate the catalog
- open public course detail pages
- register and log in through modals
- complete their profile
- choose a schedule and enroll in a course
- view enrolled courses in a sidebar
- track progress
- complete a course
- rate a completed course
- reset an enrollment and re-enroll through the retake flow

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Context API + useReducer
- CSS Modules + global styles
- Radix Dialog
- react-hot-toast

## Main Features

### Authentication

- registration modal
- login modal
- auth persistence after refresh
- canonical user hydration from `GET /me`

### Profile

- read-only email
- editable full name, mobile number, age
- optional avatar
- profile-complete gating for enrollment

### Dashboard

- featured courses
- continue learning section
- locked state for guests
- real in-progress cards for authenticated users

### Catalog

- search
- categories filter
- topics filter
- instructors filter
- sort
- pagination
- filter options loaded from dedicated metadata endpoints:
  - `/categories`
  - `/topics`
  - `/instructors`

### Course Detail

- public course detail page
- real schedule browsing:
  - weekly schedule
  - time slot
  - session type
- dynamic total price
- conflict handling for enrollment
- enrolled vs not-enrolled branching
- course completion
- rating for completed courses
- retake through delete-and-reenroll flow

### Enrolled Sidebar

- authenticated-only access
- real enrolled course list
- quantity-aware summary
- total price summary
- progress display

## Local Setup

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Deployment

This project includes `vercel.json` so client-side routing works correctly on Vercel for routes like:

- `/`
- `/courses`
- `/courses/:courseId`

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

## Live Demo

- Live URL: `[add-your-live-link-here]`
- Repository URL: `[add-your-public-repo-link-here]`

These placeholders must be replaced with real values after deployment and before final submission.

## Scope Notes / Trade-offs

The core assignment scope is implemented first and prioritized over visual extras.

Main trade-offs:

- focus stayed on the happy path and stable API integration
- no unnecessary architecture expansion beyond assignment needs
- no extra animation-heavy polish
- dedicated metadata endpoints are used for categories, topics, and instructors, while `/courses` remains the source of filtered course results

## Bonus / Stretch Handling

The following flows were completed because the API behavior was confirmed:

- complete course
- rate course
- retake course via `DELETE /enrollments/{id}` + re-enroll flow

## Final Notes

This project was built as a desktop-first implementation aligned with:

- GitBook requirements
- provided Figma design direction
- confirmed API behavior
