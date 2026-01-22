# Changelog

All notable changes to the AI Life Assistant project will be documented in this file.

## [v2.0.0-alpha] - 2026-01-21

### 🚀 Engineering Excellence (Phase 1)
- **Standardized BaseAgent (ABC)**: Refactored all secretary agents to inherit from a unified Abstract Base Class. Enforced a consistent `Collect -> Process -> Save -> Sync` lifecycle.
- **Environment Parity**: Upgraded `ConfigLoader` to prioritize environment variables (e.g., `LLM_API_KEY`) over `config.ini`, enabling safer and more flexible deployments.
- **Global Error Boundaries**: Implemented centralized exception handling in the base execution pipeline to ensure system resilience.

### 🧠 Data Intelligence & Memory (Phase 2)
- **Structured Data Sync**: Added `DataSynchronizer` to automatically sync non-structured Markdown logs into SQLite tables (e.g., `work_tasks`, `content_index`).
- **Lightweight RAG (Semantic Memory)**: Implemented `VectorMemory` using a keyword-based retrieval system on SQLite, allowing agents to access historical context during execution.
- **User Preference Extraction**: Integrated a new extraction engine that analyzes daily logs to identify and track evolving user interests and habits.

### 🔄 Refactored Modules
- `NewsAgent`: Migration to v2.0 pipeline with integrated historical news context support.
- `WorkAgent`: Migration to v2.0 pipeline with automatic task synchronization to DB.
- `ReviewAgent`: Integrated with the new `PreferenceExtractor` for deeper analytical insights.

---

## [v1.0.0] - 2026-01-15
- Initial release with 5 core AI Secretaries (News, Work, Outfit, Life, Review).
- Basic CLI and Web interface (Next.js 16).
- File-based logging system.
- Initial LLM integrations (Claude & GLM).
