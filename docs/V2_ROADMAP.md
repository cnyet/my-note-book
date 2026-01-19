# AI Life Assistant v2.0 Roadmap

## 📅 Timeline: Q1 2026

## 🎯 Vision
Transform from a collection of siloed scripts into a unified, proactive, and memory-persistent AI "Chief of Staff".

---

## 🟢 Phase 1: Engineering Excellence (Refactoring)
**Focus**: Stability, maintainability, and code reuse.
- [ ] **Task 1.1: Abstract BaseSecretary** - Move common logic (LLM init, logging, file I/O) to a parent class.
- [ ] **Task 1.2: Environment Parity** - Remove hardcoded credentials; enforce strict `.env` usage.
- [ ] **Task 1.3: Error Boundaries** - Implement global exception handling in both backend (FastAPI) and frontend (React).

## 🟡 Phase 2: Data Intelligence (Memory & RAG)
**Focus**: Context awareness and long-term memory.
- [ ] **Task 2.1: Structured Data Synchronization** - Sync Markdown logs to SQLite tables automatically.
- [ ] **Task 2.2: Local Vector Memory** - Integrate ChromaDB or `sqlite-vss` for semantic search across years of logs.
- [ ] **Task 2.3: Preference Extraction** - Automatically update user profile based on daily reflections.

## 🟠 Phase 3: Proactive Orchestration (Chief of Staff)
**Focus**: Cross-agent collaboration.
- [ ] **Task 3.1: Coordinator Agent** - Create a "Chief of Staff" to orchestrate secretary execution order and context sharing.
- [ ] **Task 3.2: Context Bus** - Implement a shared state object for daily runs.
- [ ] **Task 3.3: Automation Hooks** - Trigger tasks based on external events (e.g., specific weather alerts).

## 🔵 Phase 4: Modern Interaction (Next-Gen UX)
**Focus**: Multi-modal and real-time.
- [ ] **Task 4.1: SSE Notifications** - Real-time push for task completions and alerts.
- [ ] **Task 4.2: Multimodal Input** - Image-to-Task (OCR) and Voice-to-Action.
- [ ] **Task 4.3: PWA Completion** - Offline mode and mobile "App-like" experience.
