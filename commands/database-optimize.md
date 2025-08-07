# Database Optimize

I'll analyze your database queries, schema, and performance to provide optimization recommendations and safe migration strategies.

Arguments: `$ARGUMENTS` - database type, query files, or optimization focus areas

## Session Intelligence

I'll maintain database optimization progress across sessions:

**Session Files (in current project directory):**
- `database-optimize/analysis.md` - Query analysis and optimization plan
- `database-optimize/state.json` - Optimization progress and metrics

**IMPORTANT:** Session files are stored in a `database-optimize` folder in your current project root

**Auto-Detection:**
- If session exists: Resume database optimization
- If no session: Create new database analysis
- Commands: `resume`, `explain`, `migrate`

## Phase 1: Database Context Analysis

**MANDATORY FIRST STEPS:**
1. Check if `database-optimize` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `database-optimize/state.json`
   - Look for `database-optimize/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze database configuration and connection strings
   - Identify database type and ORM framework
   - Create optimization analysis plan
4. Show database analysis preview before execution

**Database Detection:**
- Use **Glob** to find database configuration files
- Use **Read** to analyze connection strings and schema files
- Use **Grep** to identify query patterns and ORM usage
- Analyze migration files and database schema evolution

## Phase 2: Query Performance Analysis

### Extended Thinking for Complex Database Scenarios

For complex database optimization scenarios, I'll use extended thinking:

<think>
When analyzing complex database performance:
- Multi-table join optimization strategies and index selection
- Query plan analysis across different database engines
- Scaling considerations for high-traffic applications
- Data partitioning and sharding strategies
- Transaction isolation level implications
- Connection pooling and resource management optimization
- Database-specific optimization techniques and best practices
</think>

**Triggers for Extended Analysis:**
- Complex multi-table queries with performance issues
- Large-scale data migration requirements
- High-traffic applications with scaling needs
- Cross-database compatibility requirements

I'll analyze your database queries using EXPLAIN plans:

**Query Analysis:**
- Identify slow queries and performance bottlenecks
- Analyze query execution plans and optimization opportunities
- Detect missing indexes and suggest optimal index strategies
- Evaluate join patterns and query structure efficiency

**Database-Specific Optimization:**
- **PostgreSQL**: EXPLAIN ANALYZE, index usage, query planner optimization
- **MySQL**: Query execution plans, index optimization, storage engine selection
- **MongoDB**: Aggregation pipeline optimization, index strategies, query performance
- **SQLite**: Query optimization for embedded database scenarios

## Phase 3: Index Optimization

I'll analyze and recommend index improvements:

**Index Analysis:**
- Identify missing indexes for frequently queried columns
- Detect unused indexes that impact write performance
- Suggest composite indexes for multi-column queries
- Analyze index selectivity and effectiveness

**Index Recommendations:**
- Specific CREATE INDEX statements with rationale
- Index maintenance and monitoring strategies
- Impact analysis for proposed index changes
- Performance improvement estimates

## Phase 4: Migration Safety Validation

I'll ensure database migrations are safe and reversible:

**Migration Analysis:**
- Validate migration scripts for data integrity
- Check for potential data loss scenarios
- Ensure proper rollback procedures exist
- Analyze migration performance impact

**Safety Checks:**
- Backup verification before migrations
- Transaction safety and atomicity validation
- Constraint and foreign key impact analysis
- Data type compatibility verification

## Phase 5: Schema Optimization

I'll analyze database schema design and suggest improvements:

**Schema Analysis:**
- Normalize/denormalize recommendations based on usage patterns
- Identify redundant data and storage optimization opportunities
- Analyze relationship efficiency and foreign key usage
- Suggest partitioning strategies for large tables

**Performance Recommendations:**
- Table structure optimization for query patterns
- Data type optimization for storage efficiency
- Archival strategies for historical data
- Caching layer integration recommendations

## Context Continuity

**Session Resume:**
When you return and run `/database-optimize` or `/database-optimize resume`:
- Load existing database analysis and optimization progress
- Show query performance improvements and remaining issues
- Continue optimization from last checkpoint
- Maintain all optimization metrics and recommendations

**Progress Example:**
```
RESUMING DATABASE OPTIMIZATION SESSION
├── Queries Analyzed: 45
├── Slow Queries Found: 8 (↓3 from last scan)
├── Index Recommendations: 12
└── Migration Scripts: 3 validated

Continuing database optimization...
```

## Practical Examples

**Start Database Optimization:**
```
/database-optimize                    # Complete database analysis
/database-optimize queries/           # Focus on specific query directory
/database-optimize --explain          # Show EXPLAIN plans for slow queries
/database-optimize --migrate          # Validate pending migrations
```

**Session Management:**
```
/database-optimize resume     # Continue existing optimization
/database-optimize explain    # Show query execution plans
/database-optimize migrate    # Generate safe migration scripts
```

## Integration with Development Workflow

**Database Development Workflow:**
- Integrate with ORM frameworks and query builders
- Provide migration script generation and validation
- Monitor query performance in development and staging
- Generate database documentation and schema diagrams

**Command Suggestions:**
Based on findings, I may suggest:
- `/monitoring-setup` - For database performance monitoring
- `/architecture-analysis` - For data architecture review
- `/security-scan` - For database security analysis

## Safety Guarantees

**Protection Measures:**
- Non-destructive analysis with optional migration generation
- Comprehensive backup verification before changes
- Rollback script generation for all migrations
- Safe integration with existing database workflows

**Important:** I will NEVER:
- Execute database changes without explicit approval
- Generate migrations without proper rollback procedures
- Modify production databases without safety checks
- Add AI attribution to database scripts or migrations

## What I'll Actually Do

1. **Analyze comprehensively** - Query performance, schema design, and index usage
2. **Optimize intelligently** - Database-specific optimization strategies
3. **Validate safely** - Migration safety and rollback procedures
4. **Recommend specifically** - Actionable optimization improvements
5. **Monitor continuously** - Performance metrics and query analysis
6. **Integrate seamlessly** - Work with existing database workflows

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of database analysis and optimization progress.