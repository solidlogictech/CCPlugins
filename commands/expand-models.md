# Expand Data Models

I'll analyze existing data model patterns and create similar models following your established conventions, maintaining consistency in schema design, validation, relationships, and data access patterns.

Arguments: `$ARGUMENTS` - model pattern, model name, or data focus area

## Session Intelligence

I'll maintain model expansion progress across sessions:

**Session Files (in current project directory):**
- `expand-models/analysis.md` - Model pattern analysis and expansion plan
- `expand-models/state.json` - Expansion progress and generated models

**IMPORTANT:** Session files are stored in an `expand-models` folder in your current project root

**Auto-Detection:**
- If session exists: Resume model expansion
- If no session: Create new model analysis
- Commands: `resume`, `patterns`, `schema`

## Phase 1: Model Pattern Discovery & Analysis

**MANDATORY FIRST STEPS:**
1. Check if `expand-models` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `expand-models/state.json`
   - Look for `expand-models/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze existing model patterns and structure
   - Identify ORM/database framework and conventions
   - Create model expansion plan
4. Show model analysis summary before expansion

**Model Pattern Discovery:**
- Use **Glob** to find model files, schemas, and migrations
- Use **Read** to analyze existing model implementations
- Use **Grep** to identify model patterns, relationships, and validation
- Analyze database schema and migration files

## Phase 2: Framework & Convention Detection

I'll identify your data architecture and conventions:

**Framework Detection:**
- ORM/Database framework (Sequelize, TypeORM, Mongoose, Django ORM, etc.)
- Database type and schema patterns
- Migration and seeding approaches
- Model validation and constraint patterns

**Convention Analysis:**
- Model naming and file organization
- Field naming and data type conventions
- Relationship definition patterns
- Validation and constraint approaches
- Index and performance optimization patterns

## Phase 3: Model Pattern Analysis

I'll analyze existing models to understand patterns:

**Pattern Identification:**
- Schema design and field type patterns
- Relationship modeling (one-to-one, one-to-many, many-to-many)
- Validation rules and constraint patterns
- Index strategies and performance considerations
- Lifecycle hooks and business logic integration

**Model Expansion Planning:**
I'll create `expand-models/analysis.md` with:

```markdown
# Model Expansion Analysis

## Current Data Architecture
- **ORM**: TypeORM with PostgreSQL
- **Pattern**: Entity-based models with decorators
- **Validation**: class-validator with custom validators
- **Migrations**: Automatic migration generation with manual review

## Existing Model Patterns

### File Structure
```
src/models/
├── User.ts
├── Project.ts
├── Task.ts
├── index.ts
└── migrations/
    ├── 001-create-users.ts
    ├── 002-create-projects.ts
    └── 003-create-tasks.ts
```

### Model Structure Pattern
```typescript
// User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum
} from 'class-validator';
import { Project } from './Project';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['status', 'role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status: UserStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  avatarUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Project, project => project.owner)
  projects: Project[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Business logic methods
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  canManageProject(project: Project): boolean {
    return this.role === UserRole.ADMIN || project.ownerId === this.id;
  }
}
```

### Relationship Pattern
```typescript
// Project.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsUUID
} from 'class-validator';
import { User } from './User';
import { Task } from './Task';

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

@Entity('projects')
@Index(['ownerId', 'status'])
@Index(['status', 'createdAt'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT
  })
  @IsEnum(ProjectStatus, { message: 'Invalid project status' })
  status: ProjectStatus;

  @Column({ type: 'uuid' })
  @IsUUID(4, { message: 'Invalid owner ID format' })
  ownerId: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  dueDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, user => user.projects, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  // Business logic methods
  isActive(): boolean {
    return this.status === ProjectStatus.ACTIVE;
  }

  canBeDeleted(): boolean {
    return this.status === ProjectStatus.DRAFT || this.status === ProjectStatus.ARCHIVED;
  }

  getTaskCount(): Promise<number> {
    return Task.count({ where: { projectId: this.id } });
  }
}
```

### Migration Pattern
```typescript
// migrations/004-create-teams.ts
import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateTeams1642000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teams',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'ownerId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndex('teams', new Index({
      name: 'IDX_teams_owner_id',
      columnNames: ['ownerId']
    }));

    // Create foreign key
    await queryRunner.createForeignKey('teams', new ForeignKey({
      columnNames: ['ownerId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('teams');
  }
}
```

## Expansion Opportunities

### Missing Core Models
1. **Team Model** - Following User/Project pattern
   - **Fields**: id, name, description, ownerId, createdAt, updatedAt
   - **Relationships**: owner (User), members (many-to-many with User)
   - **Validation**: Name length, description limits
   - **Business Logic**: Member management, permission checks

2. **Category Model** - Following enum-based pattern
   - **Fields**: id, name, color, description, isActive
   - **Relationships**: projects (one-to-many)
   - **Validation**: Name uniqueness, color format
   - **Business Logic**: Active status management

3. **Comment Model** - Following content pattern
   - **Fields**: id, content, authorId, entityType, entityId
   - **Relationships**: author (User), polymorphic associations
   - **Validation**: Content length, entity validation
   - **Business Logic**: Mention parsing, notification triggers

### Missing Relationship Models
1. **TeamMember Model** - Many-to-many with additional fields
   - **Fields**: teamId, userId, role, joinedAt
   - **Relationships**: team (Team), user (User)
   - **Validation**: Role enum, unique constraints
   - **Business Logic**: Permission levels, invitation management

2. **ProjectCollaborator Model** - Project access management
   - **Fields**: projectId, userId, permission, invitedAt, acceptedAt
   - **Relationships**: project (Project), user (User)
   - **Validation**: Permission enum, status validation
   - **Business Logic**: Access control, invitation workflow

## Generated Model Examples

### Team Model
```typescript
// Team.ts - Following User/Project pattern
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index
} from 'typeorm';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID
} from 'class-validator';
import { User } from './User';

@Entity('teams')
@Index(['ownerId'])
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @Column({ type: 'uuid' })
  @IsUUID(4, { message: 'Invalid owner ID format' })
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'team_members',
    joinColumn: { name: 'teamId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  members: User[];

  // Business logic methods
  async getMemberCount(): Promise<number> {
    return this.members ? this.members.length : 0;
  }

  isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  hasMember(userId: string): boolean {
    return this.members?.some(member => member.id === userId) || false;
  }
}
```

## Expansion Plan

### Phase 1: Core Models
- [ ] Generate Team model following User/Project pattern
- [ ] Create Category model with enum-based status
- [ ] Add Comment model with polymorphic relationships
- [ ] Generate corresponding migrations

### Phase 2: Relationship Models
- [ ] Create TeamMember junction model with additional fields
- [ ] Add ProjectCollaborator model for access management
- [ ] Implement UserPreferences model for user settings
- [ ] Generate audit/history models for change tracking

### Phase 3: Advanced Models
- [ ] Add File/Attachment models with storage integration
- [ ] Create Notification model with delivery tracking
- [ ] Implement Tag model with many-to-many relationships
- [ ] Add Analytics/Metrics models for reporting

### Phase 4: Integration & Testing
- [ ] Generate model tests following existing patterns
- [ ] Create seed data for new models
- [ ] Update repository patterns and services
- [ ] Add model documentation and examples
```

## Phase 4: Model Generation Following Patterns

I'll generate new models matching your established patterns:

**Pattern Matching:**
- Follow existing entity structure and decorator usage
- Use same validation patterns and constraint approaches
- Match relationship definition and foreign key patterns
- Maintain consistent naming and field type conventions

**Code Generation:**
- Generate model files following existing structure
- Create migrations using same migration patterns
- Add validation decorators consistent with existing models
- Include business logic methods following established patterns

## Phase 5: Integration & Migration

I'll ensure new models integrate with existing data architecture:

**Integration Verification:**
- Verify models work with existing ORM configuration
- Ensure proper TypeScript integration and type checking
- Check relationship integrity and foreign key constraints
- Validate migration compatibility and rollback procedures

**Database Updates:**
- Generate migrations following existing migration patterns
- Create seed data for new models if needed
- Update database indexes and performance optimizations
- Add model documentation and relationship diagrams

## Context Continuity

**Session Resume:**
When you return and run `/expand-models` or `/expand-models resume`:
- Load existing model analysis and expansion progress
- Show generated models and remaining work
- Continue expansion from last point
- Maintain all pattern analysis and decisions

**Progress Example:**
```
RESUMING MODEL EXPANSION SESSION
├── Pattern: TypeORM + PostgreSQL + class-validator
├── Generated: 4 of 7 planned models
├── Current: TeamMember junction model
└── Next: Comment polymorphic model

Continuing model expansion...
```

## Practical Examples

**Expand Models:**
```
/expand-models Team              # Create team model
/expand-models "user preferences" # Generate user settings model
/expand-models Category          # Create category model
```

**Analysis Commands:**
```
/expand-models patterns    # Analyze existing model patterns
/expand-models schema      # Show database schema expansion
/expand-models relationships # Focus on relationship modeling
```

## Integration with Development Workflow

**Model Development:**
- Follow existing development and testing patterns
- Maintain database schema consistency and migrations
- Ensure proper validation and constraint enforcement
- Include comprehensive testing and documentation

**Quality Assurance:**
- Generate tests following existing model test patterns
- Validate model relationships and data integrity
- Check migration safety and rollback procedures
- Ensure proper TypeScript integration and type safety

## Safety Guarantees

**Protection Measures:**
- Generate models following existing patterns exactly
- Ensure new models don't break existing database schema
- Validate migration safety and rollback procedures
- Maintain data integrity and relationship constraints

**Important:** I will NEVER:
- Modify existing models without explicit request
- Generate models that don't follow project patterns
- Create migrations that could cause data loss
- Add AI attribution to model code or migrations

## Command Integration

After model expansion, I may suggest:
- `/test` - To run model and integration tests
- `/review` - To validate model design and relationships
- `/implement` - To create services using new models
- `/commit` - To save model improvements

## What I'll Actually Do

1. **Analyze patterns** - Understand existing model structure and conventions
2. **Identify opportunities** - Find missing models and data relationships
3. **Generate systematically** - Create models following established patterns
4. **Integrate seamlessly** - Ensure compatibility with existing data architecture
5. **Document thoroughly** - Update model documentation and relationship diagrams
6. **Track progress** - Monitor expansion progress and data integrity

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of model analysis and expansion progress.