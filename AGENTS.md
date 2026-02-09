<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

## Global Rule Locations

- **Claude Rules**: `~/.claude/CLAUDE.md`
- **Gemini Rules**: `~/.gemini/GEMINI.md`

<!-- OPENSPEC:END -->

---

<!-- MEMORY-AUTOLOAD:START -->

# Session Memory Auto-Load

> **Skill**: conversation-accuracy-skill v2.0
> **Purpose**: Enable cross-session memory persistence and automatic project context loading

## Auto-Load Behavior

**At the start of EVERY new conversation window**, you MUST:

1. **Read project memory files in this order**:
   - `.agent/memory/context-index.md` - Quick overview and project stats
   - `.agent/memory/decisions.md` - All project decisions with rationale
   - `.agent/memory/session-summary.md` - Recent conversation summaries

2. **Synthesize context** (30 seconds max):
   - What is this project about?
   - What are the key architectural decisions?
   - What was discussed in the last session?
   - What are the pending action items?

3. **Acknowledge to user**:
   > "✅ 已加载项目记忆: [X] 条决策, [Y] 个待办事项"
   > "上次会话摘要: [一句话总结]"

## Auto-Save Behavior

**Automatically save to memory when**:

- User confirms a decision or action plan
- Completing a significant task milestone
- User explicitly says "记录这个" or "保存决策"
- Conversation exceeds 10 rounds

**Save format**: Append to `.agent/memory/decisions.md` using template in `.agent/memory/template.md`

## Quick Commands

| User says      | You do                                          |
| -------------- | ----------------------------------------------- |
| "加载项目记忆" | Re-read all memory files and summarize          |
| "生成决策文档" | Extract decisions from current context and save |
| "查看决策记录" | Display `.agent/memory/decisions.md` summary    |
| "更新会话摘要" | Update `.agent/memory/session-summary.md`       |

## Memory Files Location

```
.agent/memory/
├── decisions.md       # Persistent decision log (EDIT THIS)
├── session-summary.md # Session summaries (EDIT THIS)
├── context-index.md   # Quick index (EDIT THIS)
└── template.md        # Decision template (REFERENCE ONLY)
```

Keep this managed block so memory updates are preserved.

<!-- MEMORY-AUTOLOAD:END -->
