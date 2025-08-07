# Architecture Decision Records

I'll help you document architectural decisions with context and rationale, maintaining a searchable knowledge base of design choices with full session continuity.

Arguments: `$ARGUMENTS` - decision title or architectural focus area

## Session Intelligence

I'll maintain ADR creation and management across sessions:

**Session Files (in current project directory):**
- `adr/decisions/` - Individual ADR files following standard format
- `adr/state.json` - Decision tracking and relationships

**IMPORTANT:** Session files are stored in an `adr` folder in your current project root

**Auto-Detection:**
- If session exists: Resume ADR management
- If no session: Create new ADR system
- Commands: `resume`, `status`, `new`, `list`

## Phase 1: Initial Setup & Context Analysis

**MANDATORY FIRST STEPS:**
1. Check if `adr` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `adr/state.json`
   - Look for `adr/decisions/` directory
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze current architecture for context
   - Create ADR directory structure
   - Initialize decision tracking
4. Show ADR preview before creation

**Architecture Context Analysis:**
- Use **Glob** to understand project structure and patterns
- Use **Read** to examine existing architectural decisions
- Use **Grep** to identify current technology choices and patterns
- Analyze dependencies and integration points

## Phase 2: ADR Creation & Documentation

I'll create properly formatted Architecture Decision Records:

**Standard ADR Format:**
Following the widely-accepted ADR template:

```markdown
# ADR-[NUMBER]: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Describe the architectural challenge or decision point]
[Include relevant background information]
[Explain why this decision is needed]

## Decision
[State the architectural decision clearly]
[Explain the chosen approach]
[Include key implementation details]

## Consequences
### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Neutral impact 1]
- [Neutral impact 2]

## Related Decisions
- [Link to ADR-X: Related Decision]
- [Link to ADR-Y: Superseded Decision]

## Notes
[Additional context, references, or implementation notes]

---
**Created**: [Date]
**Last Updated**: [Date]
**Decision Maker(s)**: [Team/Individual]
```

## Phase 3: Contextual Analysis & Decision Support

I'll analyze your codebase to provide relevant context:

**Context Generation:**
- Current architectural patterns and their rationale
- Technology stack analysis and constraints
- Integration points and dependencies
- Performance and scalability considerations
- Security and compliance requirements

**Decision Support:**
- Alternative approaches and trade-offs
- Industry best practices and patterns
- Technology-specific considerations
- Long-term maintenance implications

## Phase 4: Decision Linking & Relationship Mapping

I'll maintain relationships between decisions:

**Relationship Types:**
- **Supersedes**: This decision replaces a previous one
- **Relates to**: This decision is connected to another
- **Depends on**: This decision requires another decision
- **Influences**: This decision affects future decisions

**Decision Tracking:**
I'll maintain `adr/state.json` with:
```json
{
  "decisions": [
    {
      "number": 1,
      "title": "Use React for Frontend",
      "status": "accepted",
      "created": "2025-01-15",
      "file": "adr/decisions/0001-use-react-frontend.md",
      "related": [],
      "tags": ["frontend", "framework"]
    }
  ],
  "next_number": 2,
  "last_updated": "2025-01-15"
}
```

## Phase 5: Integration with Project Documentation

I'll integrate ADRs with your project documentation:

**Documentation Integration:**
- Update README.md with ADR references where relevant
- Link to ADRs from technical documentation
- Reference ADRs in code comments for complex decisions
- Update architecture diagrams and documentation

**Knowledge Base Maintenance:**
- Create searchable index of decisions
- Maintain decision timeline and evolution
- Track decision outcomes and lessons learned

## Context Continuity

**Session Resume:**
When you return and run `/adr` or `/adr resume`:
- Load existing ADR system and decisions
- Show recent decisions and their status
- Continue ADR management from last point
- Maintain all decision relationships

**Progress Example:**
```
RESUMING ADR SESSION
├── Total ADRs: 12
├── Recent: ADR-12 Database Migration Strategy
├── Status: 10 Accepted, 1 Proposed, 1 Deprecated
└── Next: ADR-13 API Versioning Strategy

Continuing architecture documentation...
```

## Practical Examples

**Create New ADR:**
```
/adr "Database Migration Strategy"     # Create new ADR
/adr "API Versioning Approach"        # Create API decision ADR
/adr "Microservices Architecture"     # Create architecture ADR
```

**ADR Management:**
```
/adr list       # List all existing ADRs
/adr status     # Show ADR system status
/adr resume     # Continue ADR session
```

**Update Existing ADR:**
```
/adr update 5   # Update ADR-5 status or content
/adr supersede 3 "New Database Choice"  # Supersede old decision
```

## ADR Workflow Integration

**Decision Lifecycle:**
1. **Proposed**: Initial decision documentation
2. **Under Review**: Team review and discussion
3. **Accepted**: Decision approved and implemented
4. **Deprecated**: Decision no longer relevant
5. **Superseded**: Replaced by newer decision

**Integration Points:**
- Reference ADRs in `/plan` for implementation decisions
- Link ADRs in `/validate-implementation` for compliance checking
- Update ADRs during `/retrospective` with lessons learned

## Safety Guarantees

**Protection Measures:**
- Immutable decision history
- Clear decision evolution tracking
- Relationship integrity maintenance
- Backup and recovery of decision records

**Important:** I will NEVER:
- Delete historical decisions without proper deprecation
- Modify decisions without tracking changes
- Create decisions without proper context
- Add AI attribution to decision records

## Command Integration

After ADR creation, I may suggest:
- `/plan` - To implement architectural decisions
- `/implement` - To execute architectural changes
- `/review` - To validate architectural compliance
- `/retrospective` - To evaluate decision outcomes

## What I'll Actually Do

1. **Analyze context** - Understand current architecture and constraints
2. **Document systematically** - Create properly formatted ADRs
3. **Link relationships** - Maintain decision dependencies and evolution
4. **Integrate seamlessly** - Connect with project documentation
5. **Track continuously** - Maintain decision history and outcomes
6. **Support decisions** - Provide context and alternative analysis

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of architectural decisions and their relationships.