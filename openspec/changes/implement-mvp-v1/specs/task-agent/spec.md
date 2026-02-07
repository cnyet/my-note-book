# Specification: Task Agent

## 1. Overview

The Task Agent helps users manage their daily tasks by generating them from a Q&A form and providing standard CRUD capabilities.

## ADDED Requirements

### Requirement: Task Generation

The Task Agent SHALL generate a structured task list from user form input.

#### Scenario: Generate Tasks

Given a filled "Daily Goals" form
When the user submits the form
Then the Task Agent calls the LLM to analyze the input
And returns a JSON list of tasks with titles, priorities, and estimated times.

### Requirement: Task Management

The Task Agent SHALL provide endpoints to Create, Read, Update, and Delete tasks.

#### Scenario: Mark as Done

Given a pending task
When the user clicks "Complete"
Then the task status updates to "Done" in the database.

### Requirement: Daily Reset

The Task Agent SHALL NOT automatically carry over unfinished tasks to the next day.

#### Scenario: New Day

Given tasks from yesterday that are unfinished
When the user views today's list
Then the list is empty (or only shows today's generated tasks)
And yesterday's tasks remain in history as "Unfinished".

## 3. Data Model

- `tasks` table:
  - `id`: PK
  - `user_id`: FK
  - `title`: String
  - `status`: Enum(todo, done)
  - `priority`: Enum(low, medium, high)
  - `created_at`: Datetime
