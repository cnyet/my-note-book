---
name: conversation-accuracy-skill
description: Optimize long-form conversation accuracy using a four-layer memory architecture with automatic project-level decision document generation.
license: MIT
metadata:
  author: work-agents-kimi
  version: "2.0.0"
---

# Conversation Accuracy Skill with Auto-Persistence

Enhanced conversation accuracy optimization with **automatic project-level decision documentation**. Maintains 90%+ accuracy in long conversations through four-layer memory architecture while persisting decisions across sessions.

## When to Apply

Automatically trigger when:
- Conversation exceeds 10 rounds
- User mentions "之前说过"、"记忆"、"总结"、"太长了"
- Executing complex tasks or multi-file modifications
- **Auto-trigger**: After each major decision or task completion

## Memory Architecture

### Layer 1: Short-term Context (Sliding Window)
- Retains last 3-5 rounds (~10 messages) of raw dialogue
- Ensures current task logic chain remains complete
- **Storage**: In-context only

### Layer 2: Mid-term Summary (Dynamic Compression)
- Summarizes key points within 24 hours
- **Extracts**: User requests, AI decisions, consensus, next actions
- **Storage**: `.claude/memory/session-summary.md`

### Layer 3: Long-term Memory (Persistent Records)
- Semantic retrieval of historical context
- **Categories**: User preferences, important decisions, task history
- **Storage**: `.claude/memory/decisions.md`

### Layer 4: System Orchestration
- Dynamic weight allocation based on token budget
- Smart assembly of all layers

## Auto-Persistence Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     Conversation Flow                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Major Decision │  (User confirms action)
                    │  or Task Done   │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │ Update   │ │ Update   │ │ Update   │
         | Session  │ │ Decision │ │ Context  │
         │ Summary  │ │ Log      │ │ Index    │
         └──────────┘ └──────────┘ └──────────┘
                │            │            │
                ▼            ▼            ▼
         .claude/memory/*.md
```

## File Structure

```
.claude/
├── skills/
│   └── conversation-accuracy-skill/
│       ├── SKILL.md
│       └── USAGE.md
└── memory/
    ├── .gitkeep
    ├── template.md           # Decision document template
    ├── session-summary.md    # Session summaries
    ├── decisions.md          # Persistent decision log
    └── context-index.md      # Quick reference index
```

## Document Formats

### Decision Log Entry Format
```markdown
## [YYYY-MM-DD HH:MM UTC] Decision: <Title>

**Context**: User request / Problem description
**Options Considered**:
- Option A: Description → Pros/Cons
- Option B: Description → Pros/Cons

**Decision**: Option A
**Rationale**: Why this choice
**Files Affected**: List of files

**Next Actions**:
- [ ] Action 1
- [ ] Action 2

**Tags**: #architecture #performance #security
```

### Session Summary Format
```markdown
## Session: [YYYY-MM-DD HH:MM - HH:MM UTC]

### User Requests
1. Request 1
2. Request 2

### Key Decisions
1. Decision 1 → Reference: decisions.md#decision-id
2. Decision 2 → Reference: decisions.md#decision-id

### Next Actions
- [ ] Pending action 1
- [ ] Pending action 2

### Summary
<200-word summary of key accomplishments>
```

## Token Allocation Strategy (8K Limit)

| Component | Tokens | Percentage |
|-----------|--------|------------|
| System Instructions | 500 | 6% |
| Long-term Memory | 1500 | 19% |
| Mid-term Summary | 1000 | 12% |
| Short-term Context | 4000 | 50% |
| Current Input + Buffer | 1000 | 12% |

## Importance Scoring

Messages are weighted by:
1. **Keywords**: "决定" (decision), "重要" (important), "共识" (consensus) = **10x**
2. **Action Items**: Next steps, action points = **5x**
3. **Time Decay**: Recent messages = **2x**
4. **Default**: Regular conversation = **1x**

## Usage

### Auto-Mode (Default)
Simply mention:
> "应用 conversation-accuracy 治理规范"

The skill will:
1. Maintain context throughout conversation
2. Auto-generate decision documents on major milestones
3. Update memory files in `.claude/memory/`

### Manual Mode
Explicit commands:
- `生成决策文档` - Generate decision document from current context
- `更新会话摘要` - Update session summary
- `加载历史记忆` - Load historical memory from files
- `查看决策记录` - Show all decisions made in this project

## Best Practices

1. **Always specify timezone**: Use UTC for all timestamps
2. **Extractive summarization**: For task-oriented dialogue (avoid hallucination)
3. **Abstractive summarization**: For creative dialogue (save tokens)
4. **Auto-persist**: Enable by default for project work
5. **Cross-session reference**: New sessions should load `.claude/memory/decisions.md`

## Integration with Other Skills

- **prompt-optimization**: Use for crafting clear prompts before decision
- **react-best-practices**: Reference for React-related decisions
- **openspec**: Integrate with proposal workflow

## Metadata Tags

Standardized tags for decision categorization:
- `#architecture` - Architecture decisions
- `#performance` - Performance optimizations
- `#security` - Security implementations
- `#ui-ux` - UI/UX choices
- `#api` - API design decisions
- `#database` - Database schema/queries
- `#devops` - CI/CD, deployment
- `#bugfix` - Bug fixes
- `#refactor` - Code refactoring
- `#feature` - New features
