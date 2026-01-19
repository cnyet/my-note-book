# Change: Refactor BaseSecretary and Core Cleanup

## Why
The current agent (Secretary) implementations have 40% code overlap in initialization, logging, and file I/O. This redundancy makes the system hard to maintain and prone to inconsistent behavior. Moving to a base class is critical for v2.0 features like shared memory.

## What Changes
- **Abstract BaseSecretary**: Create `backend/src/agents/base.py` to handle shared logic.
- **Environment Isolation**: Move secret management to a unified `src/core/config_loader.py`.
- **Logic Decoupling**: Separate data extraction (Regex) from agent workflow.

## Impact
- **Affected specs**: `specs/agents/spec.md`
- **Affected code**: `backend/src/agents/*.py`, `backend/src/core/config_loader.py`
