# Specification: LobeChat Integration

## 1. Overview

LobeChat is integrated as a standalone AI chat interface, embedded within the Work Agents platform via Iframe for seamless user experience.

## ADDED Requirements

### Requirement: UI Integration

The LobeChat interface SHALL be embedded in the application via an Iframe on the `/agents/lobe` route.

#### Scenario: Navigation

Given the user is on the Dashboard
When they click "LobeChat" in the sidebar
Then the main content area renders the LobeChat Iframe.

### Requirement: Isolation & Persistence

LobeChat SHALL operate as an independent service with its own persistence layer.

#### Scenario: Data Independence

Given the user chats in LobeChat
When they switch to another Agent
Then the chat history remains in LobeChat's local storage/database
And is NOT directly accessible by other internal Agents (in MVP).

### Requirement: Styling

The Iframe container SHALL be styled to blend with the Genesis Design System (dark mode).

#### Scenario: Visual Consistency

Given the application is in Dark Mode
When the Iframe loads
Then the LobeChat interface should default to Dark Mode (via URL param or user setting).

## 3. Implementation Details

- **Route**: `/app/(dashboard)/agents/lobe/page.tsx`
- **Component**: `<iframe src="http://localhost:3210" ... />`
- **Docker**: `lobehub/lobe-chat` container running on port 3210.
