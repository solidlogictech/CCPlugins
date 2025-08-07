# Troubleshooting Guide

## Common Issues and Solutions

### Session Management Issues

#### Issue: "Session files not found" or "Cannot resume session"

**Symptoms:**
- Commands report no existing session when you expect one
- Session resume fails with file not found errors
- Progress appears lost between command runs

**Causes:**
- Session files deleted or moved
- Running commands from different directory
- Corrupted session state files

**Solutions:**

1. **Check Current Directory**
   ```bash
   pwd  # Ensure you're in the correct project directory
   ls -la requirements/ plan/ validate-implementation/  # Check for session folders
   ```

2. **Verify Session File Structure**
   ```bash
   # Expected structure:
   project-root/
   ├── requirements/
   │   ├── plan.md
   │   └── state.json
   ├── plan/
   │   ├── plan.md
   │   └── state.json
   └── validate-implementation/
       ├── plan.md
       └── state.json
   ```

3. **Recover from Corrupted Session**
   ```bash
   # Commands will automatically attempt recovery
   claude "/requirements UserProfile"  # Will reconstruct from plan.md if state.json corrupted
   ```

4. **Start Fresh Session**
   ```bash
   claude "/requirements new UserProfile"  # Force new session
   claude "/plan new UserProfile"          # Force new planning session
   ```

#### Issue: "Multiple sessions detected" or session conflicts

**Symptoms:**
- Commands report conflicting sessions
- Unexpected session data or progress
- Commands refuse to start due to conflicts

**Solutions:**

1. **Check Active Sessions**
   ```bash
   ls -la */state.json  # List all active sessions
   ```

2. **Complete or Cancel Conflicting Sessions**
   ```bash
   claude "/plan resume"     # Complete the conflicting session
   # OR
   claude "/plan new"        # Start fresh (will archive existing)
   ```

3. **Manual Session Cleanup** (if needed)
   ```bash
   # Backup existing sessions
   mv requirements requirements.backup
   mv plan plan.backup
   
   # Start fresh
   claude "/requirements UserProfile"
   ```

### Requirements and Planning Issues

#### Issue: "No requirements found for planning"

**Symptoms:**
- `/plan` command cannot find requirements document
- Planning proceeds with limited context
- Missing requirements reference in plan

**Solutions:**

1. **Create Requirements First**
   ```bash
   claude "/requirements UserProfile"  # Create requirements document
   claude "/plan UserProfile"          # Then create plan
   ```

2. **Check Requirements File Location**
   ```bash
   ls -la requirements/plan.md  # Should exist
   cat requirements/plan.md     # Verify content
   ```

3. **Verify Requirements Completeness**
   ```bash
   claude "/requirements UserProfile"  # Will validate and complete existing requirements
   ```

#### Issue: "Requirements validation failed" or incomplete requirements

**Symptoms:**
- Requirements marked as incomplete
- Missing acceptance criteria or user stories
- Planning suggests requirements review

**Solutions:**

1. **Review and Refine Requirements**
   ```bash
   claude "/requirements UserProfile"  # Will identify and fix gaps
   ```

2. **Check EARS Format Compliance**
   - Ensure acceptance criteria use WHEN/THEN/IF format
   - Verify all user stories have acceptance criteria
   - Check for measurable success criteria

3. **Add Missing Technical Requirements**
   ```bash
   claude "/requirements UserProfile"  # Will analyze codebase and suggest technical requirements
   ```

### Implementation Validation Issues

#### Issue: "Implementation not found" or "Cannot validate implementation"

**Symptoms:**
- Validation reports no implementation found
- Coverage shows 0% or very low percentages
- Missing traceability between requirements and code

**Solutions:**

1. **Verify Implementation Exists**
   ```bash
   # Check for implemented files
   find . -name "*UserProfile*" -type f
   grep -r "UserProfile" src/
   ```

2. **Complete Implementation First**
   ```bash
   claude "/scaffold user-profile"  # Create basic structure
   claude "/implement"              # Complete implementation
   claude "/validate-implementation UserProfile"  # Then validate
   ```

3. **Check Implementation Patterns**
   ```bash
   claude "/understand"  # Analyze project structure
   claude "/validate-implementation UserProfile"  # Will adapt to your patterns
   ```

#### Issue: "High number of gaps found" or low coverage

**Symptoms:**
- Validation reports many missing features
- Low requirements coverage percentage
- Many critical gaps identified

**Solutions:**

1. **Review Gap Analysis Report**
   ```bash
   # Check validate-implementation/plan.md for specific gaps
   cat validate-implementation/plan.md
   ```

2. **Address Critical Gaps First**
   ```bash
   claude "/implement"  # Focus on critical gaps from validation report
   ```

3. **Update Requirements if Needed**
   ```bash
   claude "/requirements UserProfile"  # May need to adjust requirements based on implementation reality
   ```

### Pattern Expansion Issues

#### Issue: "No patterns found" or "Cannot identify existing patterns"

**Symptoms:**
- Pattern expansion commands report no patterns found
- Generated code doesn't match project style
- Inconsistent naming or structure in generated code

**Solutions:**

1. **Verify Project Has Established Patterns**
   ```bash
   claude "/understand"  # Analyze project architecture and patterns
   ```

2. **Check for Sufficient Examples**
   ```bash
   # Ensure you have enough existing code for pattern recognition
   find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | wc -l
   ```

3. **Start with Simpler Patterns**
   ```bash
   claude "/expand-tests"        # Start with test expansion (usually has clear patterns)
   claude "/expand-components Button"  # Use specific, well-established component
   ```

#### Issue: "Generated code doesn't match project style"

**Symptoms:**
- Generated code uses different naming conventions
- Styling or structure doesn't match existing code
- Integration issues with generated patterns

**Solutions:**

1. **Provide More Context**
   ```bash
   claude "/expand-api users"  # Use specific, well-established endpoint as example
   ```

2. **Check Pattern Consistency**
   ```bash
   claude "/review"  # Review generated code for consistency
   ```

3. **Refine Generated Code**
   ```bash
   claude "/format"  # Apply project formatting
   claude "/review"  # Additional quality check
   ```

### Performance Issues

#### Issue: Commands taking too long or timing out

**Symptoms:**
- Commands run for several minutes without completion
- Progress updates stop or become infrequent
- System becomes unresponsive during command execution

**Solutions:**

1. **Check Project Size**
   ```bash
   find . -type f | wc -l  # Count total files
   du -sh .                # Check directory size
   ```

2. **Use Focused Commands**
   ```bash
   claude "/requirements UserProfile"           # Instead of analyzing entire project
   claude "/expand-api users"                   # Focus on specific patterns
   claude "/validate-implementation UserProfile" # Validate specific features
   ```

3. **Monitor System Resources**
   ```bash
   top    # Check CPU and memory usage
   df -h  # Check disk space
   ```

4. **Break Down Large Operations**
   ```bash
   # Instead of validating entire project:
   claude "/validate-implementation UserAuth"
   claude "/validate-implementation UserProfile"
   claude "/validate-implementation PaymentSystem"
   ```

#### Issue: "Out of memory" or system resource errors

**Symptoms:**
- Commands fail with memory errors
- System becomes slow or unresponsive
- Disk space warnings during operations

**Solutions:**

1. **Free Up System Resources**
   ```bash
   # Close unnecessary applications
   # Clear temporary files
   rm -rf /tmp/claude-*
   ```

2. **Use Chunked Processing**
   ```bash
   # Commands automatically use chunked processing for large projects
   # Monitor progress and wait for completion
   ```

3. **Reduce Scope**
   ```bash
   claude "/requirements UserProfile"  # Focus on single feature
   # Instead of analyzing entire monorepo
   ```

### Integration Issues

#### Issue: Commands don't suggest appropriate next steps

**Symptoms:**
- Missing workflow suggestions
- Commands don't integrate well with each other
- Unclear what to do after command completion

**Solutions:**

1. **Follow Natural Workflow**
   ```bash
   claude "/requirements UserProfile"
   claude "/plan UserProfile"
   claude "/implement"
   claude "/validate-implementation UserProfile"
   ```

2. **Check Feature Status**
   ```bash
   claude "/feature-status UserProfile"  # Shows current phase and next steps
   ```

3. **Use Project Dashboard**
   ```bash
   claude "/feature-status"  # Overall project status and recommendations
   ```

#### Issue: "Command conflicts" or resource conflicts

**Symptoms:**
- Commands report conflicts with other operations
- File locking or access issues
- Inconsistent state between commands

**Solutions:**

1. **Complete Current Operations**
   ```bash
   # Finish any in-progress commands before starting new ones
   claude "/plan resume"  # Complete existing planning session
   ```

2. **Check for Multiple Sessions**
   ```bash
   ps aux | grep claude  # Check for multiple Claude processes
   ```

3. **Restart Clean**
   ```bash
   # If necessary, restart with clean state
   # Backup important session files first
   cp -r requirements requirements.backup
   ```

## Error Messages and Solutions

### "Permission denied" errors

**Solution:**
```bash
# Check file permissions
ls -la requirements/ plan/ validate-implementation/

# Fix permissions if needed
chmod 755 requirements/ plan/ validate-implementation/
chmod 644 requirements/*.md plan/*.md validate-implementation/*.md
```

### "Invalid JSON" in state files

**Solution:**
```bash
# Commands will automatically recover from corrupted JSON
# Or manually fix:
cp requirements/state.json requirements/state.json.backup
echo '{}' > requirements/state.json
claude "/requirements resume"  # Will reconstruct state
```

### "File not found" errors

**Solution:**
```bash
# Verify you're in the correct directory
pwd
ls -la

# Check for expected project structure
ls -la src/ server/ package.json

# If in wrong directory, navigate to project root
cd /path/to/your/project
```

### "No patterns detected" warnings

**Solution:**
```bash
# Ensure project has sufficient code for pattern detection
find . -name "*.js" -o -name "*.ts" | head -10

# If minimal project, start with basic patterns
claude "/scaffold basic-structure"
claude "/expand-tests"
```

## Getting Help

### Debug Information

When reporting issues, include:

1. **Command executed:**
   ```bash
   claude "/requirements UserProfile"
   ```

2. **Project structure:**
   ```bash
   ls -la
   find . -maxdepth 2 -type d
   ```

3. **Session state:**
   ```bash
   ls -la */state.json
   cat requirements/state.json  # If exists
   ```

4. **System information:**
   ```bash
   uname -a
   node --version  # If applicable
   python --version  # If applicable
   ```

### Recovery Procedures

#### Complete Session Reset
```bash
# Backup existing work
mkdir backup-$(date +%Y%m%d)
cp -r requirements plan validate-implementation adr feature-status retrospective backup-$(date +%Y%m%d)/ 2>/dev/null

# Start fresh
rm -rf requirements plan validate-implementation adr feature-status retrospective

# Begin new workflow
claude "/requirements UserProfile"
```

#### Partial Recovery
```bash
# Keep requirements, reset planning
cp requirements/plan.md requirements-backup.md
rm -rf plan
claude "/plan UserProfile"
```

### Best Practices for Avoiding Issues

1. **Always work from project root directory**
2. **Use specific feature names consistently**
3. **Complete one phase before starting the next**
4. **Regular status checks with `/feature-status`**
5. **Backup important session files before major changes**
6. **Use descriptive, consistent naming conventions**
7. **Monitor system resources for large projects**
8. **Follow the natural workflow progression**

### When to Start Over

Consider starting fresh when:
- Multiple session conflicts that can't be resolved
- Corrupted state files that can't be recovered
- Major changes to project structure or requirements
- Performance issues that persist despite troubleshooting
- Inconsistent state across multiple command sessions

Remember: Starting over is often faster than trying to fix complex session issues. The commands are designed to be fast and efficient, so recreating sessions is usually not a significant time investment.