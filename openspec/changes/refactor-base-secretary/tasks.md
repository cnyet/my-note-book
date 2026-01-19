## 1. Core Refactoring
- [ ] 1.1 Create `backend/src/agents/base.py` with `BaseSecretary` class.
- [ ] 1.2 Implement common `__init__`, `_get_llm_client`, and `_save_log` in `BaseSecretary`.
- [ ] 1.3 Refactor `WorkSecretary` to inherit from `BaseSecretary` (Proof of Concept).
- [ ] 1.4 Migrate all other secretaries to the new base class.

## 2. Environment & Config
- [ ] 2.1 Centralize all API keys in `.env`.
- [ ] 2.2 Update `config_loader.py` to prioritize environment variables.

## 3. Verification
- [ ] 3.1 Run `pytest` to ensure no regression in agent execution.
- [ ] 3.2 Run `lsp_diagnostics` to clean up type hints.
