# Internationalization Extract

I'll extract translatable strings from your codebase and set up comprehensive internationalization (i18n) management for multi-language applications.

Arguments: `$ARGUMENTS` - source paths, target languages, or extraction patterns

## Session Intelligence

I'll maintain i18n extraction progress across sessions:

**Session Files (in current project directory):**
- `i18n-extract/analysis.md` - Internationalization audit
- `i18n-extract/state.json` - Translation progress and coverage

**IMPORTANT:** Session files are stored in an `i18n-extract` folder in your current project root

**Auto-Detection:**
- If session exists: Resume i18n extraction
- If no session: Create new internationalization analysis
- Commands: `resume`, `extract`, `validate`

## Phase 1: Internationalization Strategy Analysis

**MANDATORY FIRST STEPS:**
1. Check if `i18n-extract` directory exists in current working directory
2. If directory exists, check for session files:
   - Look for `i18n-extract/state.json`
   - Look for `i18n-extract/analysis.md`
   - If found, resume from existing session
3. If no directory or session exists:
   - Analyze application structure and i18n requirements
   - Identify existing internationalization patterns
   - Create comprehensive i18n extraction plan
4. Show internationalization analysis preview before extraction

**Application Analysis:**
- Use **Glob** to find source files with translatable content
- Use **Read** to analyze existing i18n implementations and patterns
- Use **Grep** to identify hardcoded strings and translation keys
- Analyze framework-specific i18n libraries and configurations

## Phase 2: String Extraction and Analysis

### Extended Thinking for Complex Internationalization

For complex internationalization scenarios, I'll use extended thinking:

<think>
When implementing comprehensive internationalization:
- Right-to-left (RTL) language support and layout considerations
- Cultural adaptation beyond translation (dates, numbers, currencies, colors)
- Dynamic content localization and user-generated content handling
- SEO considerations for multi-language websites and URL structures
- Performance optimization for large translation files and lazy loading
- Translation workflow integration with professional translation services
- Pluralization rules and complex grammar handling across languages
</think>

**Triggers for Extended Analysis:**
- Applications targeting RTL languages (Arabic, Hebrew)
- E-commerce applications with currency and cultural considerations
- Content management systems with dynamic localization
- Applications requiring professional translation workflows

I'll extract translatable strings from multiple file types:

**String Extraction:**
- **JavaScript/TypeScript**: Template literals, JSX content, string constants
- **HTML/Templates**: Text content, attributes, and dynamic content
- **CSS**: Content properties and pseudo-element text
- **Configuration Files**: Error messages, labels, and descriptions

**Extraction Patterns:**
- Framework-specific patterns (React i18next, Vue i18n, Angular i18n)
- Custom extraction patterns for specific string formats
- Context-aware extraction with metadata and comments
- Pluralization and interpolation pattern recognition

## Phase 3: Translation File Management

I'll organize and manage translation files:

**File Organization:**
- **JSON Format**: Structured translation files with nested keys
- **YAML Format**: Human-readable translation files with comments
- **PO/POT Files**: GNU gettext format for professional translation
- **XLIFF Format**: Industry-standard translation exchange format

**Translation Structure:**
- Hierarchical key organization by feature and component
- Namespace separation for different application areas
- Metadata inclusion (context, comments, character limits)
- Version control and change tracking for translations

## Phase 4: Missing Translation Detection

I'll identify and report missing translations:

**Coverage Analysis:**
- Translation completeness across all supported languages
- Missing key identification and prioritization
- Unused translation key detection and cleanup
- Translation quality and consistency validation

**Validation Features:**
- Placeholder and interpolation validation
- HTML tag preservation in translated content
- Character limit validation for UI constraints
- Translation key naming convention enforcement

## Phase 5: Locale Validation and Formatting

I'll validate locale-specific formatting and cultural considerations:

**Locale-Specific Validation:**
- Date and time format validation for target locales
- Number and currency formatting verification
- Address format validation for different countries
- Phone number format validation by region

**Cultural Adaptation:**
- Color and imagery cultural appropriateness
- Reading direction (LTR/RTL) layout validation
- Cultural calendar and holiday considerations
- Local regulation and compliance requirements

## Phase 6: Translation Workflow Integration

I'll integrate with translation management platforms:

**Platform Integration:**
- **Crowdin**: Collaborative translation platform integration
- **Lokalise**: Translation management and automation
- **Phrase**: Professional translation workflow management
- **Weblate**: Open-source translation management

**Workflow Automation:**
- Automatic translation file synchronization
- Translation progress tracking and reporting
- Quality assurance and review workflow integration
- Automated translation updates and deployment

## Context Continuity

**Session Resume:**
When you return and run `/i18n-extract` or `/i18n-extract resume`:
- Load existing i18n analysis and extraction progress
- Show translation coverage and missing translations
- Continue extraction from last checkpoint
- Maintain all translation files and configuration

**Progress Example:**
```
RESUMING I18N EXTRACTION SESSION
├── Strings Extracted: 1,247
├── Languages: 5 (EN, ES, FR, DE, JA)
├── Translation Coverage: 78% average
├── Missing Translations: 156 keys
└── RTL Support: Arabic, Hebrew configured

Continuing internationalization setup...
```

## Practical Examples

**Start I18n Extraction:**
```
/i18n-extract                       # Complete i18n analysis
/i18n-extract src/components/       # Extract from specific directory
/i18n-extract --validate           # Validate existing translations
/i18n-extract --rtl                # Focus on RTL language support
```

**Session Management:**
```
/i18n-extract resume      # Continue existing extraction
/i18n-extract extract     # Extract translatable strings
/i18n-extract validate    # Validate translation coverage
```

## Integration with Development Workflow

**I18n Development Workflow:**
- Integrate string extraction with build processes
- Generate translation files automatically from code changes
- Validate translation completeness during CI/CD
- Monitor translation quality and consistency

**Command Suggestions:**
Based on i18n requirements, I may suggest:
- `/expand-components` - For component internationalization
- `/visual-regression` - For multi-language UI testing
- `/accessibility-scan` - For international accessibility compliance

## Safety Guarantees

**Protection Measures:**
- Non-destructive string extraction with backup preservation
- Safe translation file management and version control
- Comprehensive validation before translation updates
- Secure integration with translation platforms

**Important:** I will NEVER:
- Overwrite existing translations without backup
- Expose sensitive content in translation files
- Modify application logic during string extraction
- Add AI attribution to translation files

## What I'll Actually Do

1. **Extract comprehensively** - All translatable strings from multiple file types
2. **Organize systematically** - Translation files with proper structure and metadata
3. **Validate thoroughly** - Translation coverage and locale-specific formatting
4. **Integrate seamlessly** - Translation workflow and platform integration
5. **Support globally** - RTL languages and cultural adaptation
6. **Monitor continuously** - Translation quality and completeness

I'll maintain complete continuity between sessions, always resuming exactly where we left off with full context of internationalization analysis and extraction progress.