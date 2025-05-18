# Admin Module Documentation

## Overview

The Admin module is a comprehensive component of the ICAN Surulere application, designed to facilitate the management of administrative tasks, including user management, billing, event management, content management, and notifications. This module is built using React and Next.js, providing a responsive and user-friendly interface for administrators.

## Folder Structure

The `src/app/(admin)` directory contains the following key components:

- `admin/`: Contains subdirectories for managing administrators, billing, events, members, and content
- `layout.tsx`: Defines the layout for the admin pages, including global styles and components
- `page.jsx`: The main dashboard for administrators, providing an overview of various management tasks

## File Descriptions

### 1. admin/admins/page.tsx

Admin Management page for viewing and managing admin accounts:

- Data Fetching: Uses Axios to fetch administrator list
- User Interface: Displays administrators using UserTable component
- Action Buttons: Manages roles and adds new administrators

### 2. admin/admins/[id]/page.tsx

Handles individual administrator details and permissions:

- Permissions Management: Sets permissions for various actions
- Checkbox Handling: Toggles permissions for each action
- Save/Reset Functionality: Saves changes or resets to defaults

### 3. admin/billing/create/page.tsx

Creates new billing entries:

- Form Handling: Captures billing details (name, type, description, amount, due date)
- Recipient Selection: Targets all members or specific members
- Data Submission: Prepares data for server submission

### 4. admin/billing/page.tsx

Manages billing overview:

- Data Fetching: Retrieves billing data via Axios
- Billing Table: Displays all billing entries
- Create New Bill Button: Links to billing creation

### 5. admin/billing/[id]/page.tsx

Shows detailed billing information:

- Billing Details: Displays comprehensive billing information
- Payment Details: Shows associated payment data

### 6. admin/content/page.jsx

Main content management interface:

- Tab Navigation: Different content type tabs
- Dynamic Content Loading: Content loads based on selected tab
- New Content Creation: Adds new content items

### 7. admin/events/page.tsx

Event management interface:

- Data Fetching: Retrieves event information
- Event Table: Displays all events
- Event Creation: Creates new events

### 8. admin/members/page.tsx

Member account management:

- Data Fetching: Retrieves and filters member data
- User Table: Displays member information

### 9. admin/profile/page.jsx

Administrator profile management:

- Profile Data Management: Edit admin details
- Save/Cancel Options: Manages profile changes

### 10. admin/settings/page.tsx

Account settings management:

- Password Management: Changes admin passwords
- Notification Settings: Configures notifications

### 11. admin/notifications/page.tsx

Notification center:

- Notification List: Shows recent notifications
- Action Options: View/delete notifications

### 12. admin/page.jsx

Main admin dashboard:

- Analytics Tabs: User activity, payments, event attendance
- Dynamic Content: Tab-based content loading

## Usage Guide

1. **Access Admin Dashboard**

   - Navigate to dashboard for management overview

2. **Manage Administrators**

   - Access "Admin Management" section
   - View/add/edit administrator accounts

3. **Handle Billing**

   - Create new bills
   - View existing bills
   - Manage payments

4. **Manage Events**

   - Create and manage events

5. **Content Management**

   - Manage adverts, blogs, publications

6. **Member Management**

   - View and manage member accounts

7. **Profile and Settings**
   - Update profile information
   - Manage account settings

## Summary

The Admin module is a vital component providing comprehensive administrative tools for the ICAN Surulere application. Built with modern React practices, it emphasizes usability, efficiency, and maintainability while ensuring effective task management.
