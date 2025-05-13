# Admin Authentication Module Documentation

## Overview
The Admin Authentication module handles user authentication for administrators in the ICAN Surulere application. Built using React and Next.js, it leverages hooks for state management and Axios for API requests. Key functionalities include login, signup, password reset, and session management.

## Folder Structure
The `src/app/(adminauth)` directory contains:
- `admin-login/page.tsx`: Login functionality
- `admin-signup/page.tsx`: Signup process
- `admin-pass-reset/page.tsx`: Password reset requests 
- `admin-reset/page.tsx`: Password reset flow
- `admin-reset/steps/New.tsx`: New password form
- `admin-reset/steps/Success.tsx`: Reset success message
- `layout.tsx`: Global layout and styles

## Component Details

### 1. admin-login/page.tsx
- **Purpose**: Implements administrator login
- **Features**:
  - State management with useState
  - Form validation and handling
  - Error message display
  - Dashboard redirection on success

### 2. admin-signup/page.tsx  
- **Purpose**: Manages new administrator signup
- **Features**:
  - Form validation for all fields
  - State management
  - API integration
  - Success/error feedback

### 3. admin-pass-reset/page.tsx
- **Purpose**: Handles password reset requests
- **Features**:
  - Email validation
  - Reset request API integration
  - User feedback display

### 4. admin-reset/page.tsx
- **Purpose**: Manages password reset flow
- **Features**:
  - Step management
  - Conditional component rendering

### 5. admin-reset/steps/New.tsx
- **Purpose**: New password entry form
- **Features**:
  - Password validation
  - Form state management
  - Success step transition

### 6. admin-reset/steps/Success.tsx
- **Purpose**: Reset success message
- **Features**:
  - Success confirmation
  - Login link provision

### 7. layout.tsx
- **Purpose**: Global layout wrapper
- **Features**:
  - Global styles
  - Page metadata
  - Responsive design

## Usage Guide

### Login
1. Navigate to login page
2. Enter credentials
3. Click "Log In"
4. Redirects to admin dashboard on success

### Signup
1. Click "Sign Up" link
2. Complete registration form
3. Submit for new account creation

### Password Reset
1. Click "Forgot Password"
2. Enter email address
3. Follow emailed instructions
4. Set new password

## Technical Implementation
- Built with React and Next.js
- Uses React hooks for state
- Axios for API requests
- Responsive design with Flexbox
- Modern React best practices

## Summary
The Admin Authentication module provides secure administrator access with a focus on user experience and maintainability. Its modular design allows for easy updates and extensions while ensuring robust authentication processes.