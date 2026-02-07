# Specification: News Agent

## 1. Overview

The News Agent aggregates daily AI news from multiple sources, summarizes them using an LLM, and stores them for user consumption.

## ADDED Requirements

### Requirement: Daily Crawling

The News Agent SHALL run a scheduled crawling job daily at 8:00 AM.

#### Scenario: Scheduled Execution

Given the system time is 8:00 AM
When the scheduler triggers
Then the News Agent starts the crawling process for configured sources (Google News, Hacker News).

### Requirement: Summarization

The News Agent SHALL summary raw news content into concise titles and abstracts using an LLM.

#### Scenario: Summarization

Given a list of raw HTML/RSS items
When passed to the LLM Summarizer
Then a structured list of 10 news items with Chinese titles and abstracts is returned.

### Requirement: Storage & Retention

The News Agent SHALL store generated news items in the database. The system SHALL retain news items for 15 days.

#### Scenario: Storage

Given a list of summarized news items
When the crawling process finishes
Then the items are saved to the `news_items` table with the current date.

### Requirement: Error Handling

The News Agent SHALL retry crawling up to 3 times on failure.

#### Scenario: Retry Logic

Given the primary source is unreachable
When the crawl fails
Then the agent retries after a backoff period.
And if all retries fail, it attempts to crawl the backup source (`aibase.com`).

## 3. Data Model

- `news_items` table:
  - `id`: PK
  - `title`: String
  - `summary`: Text
  - `url`: String
  - `source`: String
  - `published_at`: Datetime
