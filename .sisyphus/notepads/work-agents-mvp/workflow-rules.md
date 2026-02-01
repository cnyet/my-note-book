# Work-Agents Development Workflow Rules

## 执行确认规则 (Execution Confirmation Rule)

在开发计划经过审查和批准后，AI agents **必须** 等待明确的 "确认/开始" 执行指令才能继续推进。AI agents **不得** 擅自行动或在没有确认的情况下开始执行。

> **English Version**: After a development plan is reviewed and approved, AI agents **MUST** wait for an explicit "confirm/start" execution command before proceeding. AI agents **MUST NOT** act unilaterally or start execution without confirmation.

## 阶段完成后的验证流程 (Post-Phase Completion Workflow)

在每个开发阶段完成后，必须执行以下步骤：

1. **@oracle**: 代码审查 (Code review)
2. **@momus**: 需求与实现验证 (Requirements and implementation verification)
3. **@librarian**: 更新相关文档 (Update relevant documentation - progress and status)
4. **@general**: 总结执行任务结果 (Summarize execution results)
5. 等待下一个任务指令 (Wait for next task command)

> **English Version**: After each development phase is completed, the following steps **MUST** be executed:
> 
> 1. **@oracle**: Code review
> 2. **@momus**: Requirements and implementation verification
> 3. **@librarian**: Update relevant documentation (progress and status)
> 4. **@general**: Summarize execution results
> 5. Wait for next task command

## AI Agent 行为准则 (AI Agent Conduct Guidelines)

所有 AI agents 在执行任务时必须遵守以下准则：

- 等待明确的执行指令
- 遵循验证流程
- 在没有确认的情况下不开始新阶段
- 更新文档以反映当前状态

> **English Version**: All AI agents **MUST** follow these guidelines when executing tasks:
> 
> - Wait for explicit execution commands
> - Follow the verification workflow
> - Do not start new phases without confirmation
> - Update documentation to reflect current status

---

**文档状态**: 已制定 (Established)  
**生效日期**: 2026-02-01  
**适用范围**: 所有 Work-Agents 项目 AI agents