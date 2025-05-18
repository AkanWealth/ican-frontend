# Home Page Component Documentation

## Overview
The main landing page component for the Surulere & District Society (SDS) website that serves as the entry point for visitors and potential members.

## Key Features
- Hero section with messaging and CTAs
- Speech component for announcements 
- Image gallery (desktop/tablet only)
- Member stories section
- Advertisement section
- Call-to-action component

## Technical Implementation
- Next.js client-side rendering
- Responsive Tailwind CSS design
- Framer Motion animations
- Modular component architecture

## Navigation Links
- Sign-up page via "Become a Member" button
- About page via "Learn more" button

## Component Details
- **Type**: JSX.Element
- **Output**: Rendered Home page
- **Key Features**:
  - Responsive Tailwind CSS layout
  - Client-side rendering with Next.js
  - Modular component structure

## Page Directory

### About Us
- **Location**: `src/app/(home)/about-us/page.tsx`
- **Purpose**: Society information, vision and mission
- **Components**:
  - Heroimg (hero section)
  - Meminfo (membership info)
  - Infocard (member benefits)

### Blog
- **Location**: `src/app/(home)/blog/page.tsx` 
- **Purpose**: Blog post listing
- **Components**:
  - BlogList
  - Heroimg

### Contact
- **Location**: `src/app/(home)/contact-us/page.tsx`
- **Purpose**: Contact form and info
- **Components**:
  - Heroimg
  - Getin (contact form)
  - Cinfo (contact details)
  - Findus (location)

### Donate
- **Location**: `src/app/(home)/donate/page.tsx`
- **Purpose**: Donation portal
- **Components**:
  - Heroimg
  - Dontoday

### Events
- **Location**: `src/app/(home)/events/page.tsx`
- **Purpose**: Event listings
- **Components**: TBD

### FAQ
- **Location**: `src/app/(home)/faq/page.tsx`
- **Purpose**: FAQ section
- **Components**:
  - Heroimg
  - Faq

### Gallery
- **Location**: `src/app/(home)/gallery/page.tsx`
- **Purpose**: Event photo gallery
- **Components**:
  - Heroimg
  - GalleryCard

### Jobs
- **Location**: `src/app/(home)/jobs/page.tsx`
- **Purpose**: Job board
- **Components**: TBD

### Membership
- **Location**: `src/app/(home)/membership/page.tsx`
- **Purpose**: Membership info and signup
- **Components**:
  - Heroimg
  - Meminfo
  - PaymentInfo

### Publications
- **Location**: `src/app/(home)/publications/page.tsx`
- **Purpose**: Society publications
- **Components**: TBD

### Student Section
- **Location**: `src/app/(home)/student/page.tsx`
- **Purpose**: Student resources
- **Components**:
  - Heroimg
  - StudentStudy
  - Faq

### Team
- **Location**: `src/app/(home)/team-member/page.tsx`
- **Purpose**: Team member profiles
- **Components**: TBD

### Technical
- **Location**: `src/app/(home)/technical/page.tsx`
- **Purpose**: Technical session info
- **Components**:
  - Heroimg
  - TechnicalSect

### Test Ground
- **Location**: `src/app/(home)/testground/page.tsx`
- **Purpose**: Component testing
- **Components**:
  - FlutterModal
  - UploadS3

### Error Pages
- **Location**: `src/app/(home)/not-found.tsx`
- **Purpose**: 404 error page
- **Components**: Error message with home link

### Layout
- **Location**: `src/app/(home)/layout.tsx`
- **Purpose**: Main layout wrapper
- **Components**:
  - Mainheader
  - Mainfooter

## Technical Stack
- Next.js framework
- Tailwind CSS styling
- Framer Motion animations
- React functional components

## Summary
This documentation outlines the structure and functionality of the SDS website's Home section. The architecture focuses on modularity and user experience while providing comprehensive information and services.
