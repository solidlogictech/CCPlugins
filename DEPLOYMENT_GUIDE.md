# Deployment Guide

## Overview

This guide covers the deployment and installation of CCPlugins Planning Enhancement commands, including version compatibility, migration procedures, and rollback strategies.

## Installation Methods

### Method 1: Automated Installation (Recommended)

**Quick Install:**
```bash
# Download and install
curl -sSL https://raw.githubusercontent.com/brennercruvinel/CCPlugins/main/install-planning-enhancement.py | python3

# Or clone and install
git clone https://github.com/brennercruvinel/CCPlugins.git
cd CCPlugins
python3 install-planning-enhancement.py
```

**What it does:**
- Installs 10 new planning enhancement commands
- Verifies installation integrity
- Provides usage guidance
- Maintains compatibility with existing CCPlugins

### Method 2: Manual Installation

**Step-by-step:**
```bash
# 1. Ensure Claude Code CLI is installed
claude --version

# 2. Create commands directory if needed
mkdir -p ~/.claude/commands

# 3. Copy command files
cp commands/requirements.md ~/.claude/commands/
cp commands/plan.md ~/.claude/commands/
cp commands/validate-implementation.md ~/.claude/commands/
cp commands/adr.md ~/.claude/commands/
cp commands/feature-status.md ~/.claude/commands/
cp commands/retrospective.md ~/.claude/commands/
cp commands/expand-tests.md ~/.claude/commands/
cp commands/expand-api.md ~/.claude/commands/
cp commands/expand-components.md ~/.claude/commands/
cp commands/expand-models.md ~/.claude/commands/

# 4. Verify installation
ls -la ~/.claude/commands/
```

### Method 3: Development Installation

**For contributors and testers:**
```bash
# Clone repository
git clone https://github.com/brennercruvinel/CCPlugins.git
cd CCPlugins

# Create symlinks for development
ln -sf $(pwd)/commands/requirements.md ~/.claude/commands/
ln -sf $(pwd)/commands/plan.md ~/.claude/commands/
ln -sf $(pwd)/commands/validate-implementation.md ~/.claude/commands/
# ... repeat for all commands

# This allows editing commands and seeing changes immediately
```

## Version Compatibility

### CCPlugins Compatibility Matrix

| Planning Enhancement | CCPlugins Core | Claude Code CLI | Status |
|---------------------|----------------|-----------------|--------|
| v1.0.0 | v2.5.2+ | Latest | ✅ Supported |
| v1.0.0 | v2.4.x | Latest | ⚠️ Limited |
| v1.0.0 | v2.3.x | Latest | ❌ Not Supported |

### Compatibility Checks

**Pre-installation Check:**
```bash
# Check Claude Code CLI version
claude --version

# Check existing CCPlugins version
ls ~/.claude/commands/ | wc -l  # Should show 24+ commands for v2.5.2

# Check for conflicts
ls ~/.claude/commands/ | grep -E "(requirements|plan|validate|adr|feature|retrospective|expand)"
```

**Post-installation Verification:**
```bash
# Verify all commands are available
claude --help | grep -E "(requirements|plan|validate|adr|feature|retrospective|expand)"

# Test basic functionality
claude "/requirements --help"
claude "/plan --help"
```

## Migration Procedures

### Upgrading from Previous Versions

**From CCPlugins v2.4.x to v2.5.2 + Planning Enhancement:**

1. **Backup existing configuration:**
   ```bash
   cp -r ~/.claude ~/.claude.backup
   ```

2. **Update CCPlugins core:**
   ```bash
   # Follow CCPlugins update procedure
   curl -sSL https://raw.githubusercontent.com/brennercruvinel/CCPlugins/main/install.sh | bash
   ```

3. **Install planning enhancement:**
   ```bash
   python3 install-planning-enhancement.py
   ```

4. **Verify compatibility:**
   ```bash
   # Test existing commands still work
   claude "/test"
   claude "/review"
   
   # Test new commands
   claude "/requirements TestFeature"
   ```

### Migrating Existing Projects

**For projects with existing planning artifacts:**

1. **Identify existing planning files:**
   ```bash
   find . -name "*requirements*" -o -name "*plan*" -o -name "*design*"
   ```

2. **Convert to new format (if needed):**
   ```bash
   # Create requirements from existing documentation
   claude "/requirements ExistingFeature"
   # Review and merge with existing content
   ```

3. **Establish session continuity:**
   ```bash
   # Initialize sessions for existing features
   claude "/feature-status"  # Will detect existing work
   ```

### Data Migration

**Session File Migration:**
```bash
# If upgrading from beta versions, migrate session files
for dir in requirements plan validate-implementation adr feature-status retrospective; do
    if [ -d "$dir.old" ]; then
        echo "Migrating $dir..."
        mv "$dir.old/plan.md" "$dir/plan.md" 2>/dev/null || true
        mv "$dir.old/state.json" "$dir/state.json" 2>/dev/null || true
    fi
done
```

## Rollback Procedures

### Complete Rollback

**Remove planning enhancement commands:**
```bash
python3 uninstall-planning-enhancement.py
```

**Manual rollback:**
```bash
# Remove command files
rm ~/.claude/commands/requirements.md
rm ~/.claude/commands/plan.md
rm ~/.claude/commands/validate-implementation.md
rm ~/.claude/commands/adr.md
rm ~/.claude/commands/feature-status.md
rm ~/.claude/commands/retrospective.md
rm ~/.claude/commands/expand-tests.md
rm ~/.claude/commands/expand-api.md
rm ~/.claude/commands/expand-components.md
rm ~/.claude/commands/expand-models.md

# Verify rollback
claude --help | grep -E "(requirements|plan|validate|adr|feature|retrospective|expand)"
```

### Partial Rollback

**Remove specific commands only:**
```bash
# Remove only pattern expansion commands
rm ~/.claude/commands/expand-*.md

# Remove only planning commands
rm ~/.claude/commands/requirements.md
rm ~/.claude/commands/plan.md
rm ~/.claude/commands/validate-implementation.md
```

### Session Data Handling

**Preserve session data during rollback:**
```bash
# Backup session files before rollback
find . -name "requirements" -o -name "plan" -o -name "validate-implementation" | \
    xargs tar -czf planning-sessions-backup-$(date +%Y%m%d).tar.gz

# Session files remain in projects and can be used if commands are reinstalled
```

## Deployment Validation

### Installation Testing

**Basic Functionality Test:**
```bash
#!/bin/bash
# test-installation.sh

echo "Testing CCPlugins Planning Enhancement Installation..."

# Test each command exists
commands=("requirements" "plan" "validate-implementation" "adr" "feature-status" "retrospective" "expand-tests" "expand-api" "expand-components" "expand-models")

for cmd in "${commands[@]}"; do
    if claude "/$cmd --help" >/dev/null 2>&1; then
        echo "✓ /$cmd - OK"
    else
        echo "✗ /$cmd - FAILED"
        exit 1
    fi
done

echo "✅ All commands installed successfully!"
```

**Integration Test:**
```bash
#!/bin/bash
# test-integration.sh

echo "Testing command integration..."

# Create test project
mkdir -p test-project
cd test-project

# Test workflow
claude "/requirements TestFeature" && \
claude "/plan TestFeature" && \
claude "/feature-status TestFeature" && \
echo "✅ Integration test passed!" || \
echo "✗ Integration test failed!"

# Cleanup
cd ..
rm -rf test-project
```

### Performance Validation

**Performance Benchmark:**
```bash
#!/bin/bash
# benchmark-commands.sh

echo "Benchmarking command performance..."

commands=("requirements TestFeature" "plan TestFeature" "feature-status")

for cmd in "${commands[@]}"; do
    echo "Testing: claude \"/$cmd\""
    time claude "/$cmd" >/dev/null 2>&1
done
```

## Monitoring and Maintenance

### Health Checks

**Regular Health Check Script:**
```bash
#!/bin/bash
# health-check.sh

echo "CCPlugins Planning Enhancement Health Check"
echo "=========================================="

# Check command availability
echo "Command Availability:"
for cmd in requirements plan validate-implementation adr feature-status retrospective expand-tests expand-api expand-components expand-models; do
    if [ -f ~/.claude/commands/$cmd.md ]; then
        echo "✓ $cmd"
    else
        echo "✗ $cmd - MISSING"
    fi
done

# Check disk usage
echo -e "\nDisk Usage:"
du -sh ~/.claude/commands/

# Check for session files in current directory
echo -e "\nSession Files in Current Directory:"
ls -la */state.json 2>/dev/null | wc -l | xargs echo "Active sessions:"

echo -e "\n✅ Health check complete"
```

### Update Procedures

**Checking for Updates:**
```bash
# Check current version
grep -r "version" ~/.claude/commands/requirements.md | head -1

# Check for updates (manual process)
curl -s https://api.github.com/repos/brennercruvinel/CCPlugins/releases/latest | \
    grep '"tag_name"' | cut -d'"' -f4
```

**Update Process:**
```bash
# Backup current installation
cp -r ~/.claude/commands ~/.claude/commands.backup

# Download and install updates
curl -sSL https://raw.githubusercontent.com/brennercruvinel/CCPlugins/main/install-planning-enhancement.py | python3

# Verify update
python3 -c "
import os
from pathlib import Path
commands_dir = Path.home() / '.claude' / 'commands'
planning_commands = ['requirements.md', 'plan.md', 'validate-implementation.md']
for cmd in planning_commands:
    if (commands_dir / cmd).exists():
        print(f'✓ {cmd} updated')
    else:
        print(f'✗ {cmd} missing')
"
```

## Troubleshooting Deployment Issues

### Common Installation Problems

**Problem: "Permission denied" during installation**
```bash
# Solution: Check permissions
ls -la ~/.claude/
chmod 755 ~/.claude/
chmod 755 ~/.claude/commands/

# Or install with proper permissions
sudo python3 install-planning-enhancement.py
```

**Problem: "Commands not found after installation"**
```bash
# Solution: Verify installation path
echo $HOME
ls -la ~/.claude/commands/

# Check Claude Code CLI configuration
claude --help | head -10
```

**Problem: "Conflicts with existing commands"**
```bash
# Solution: Check for naming conflicts
ls ~/.claude/commands/ | grep -E "(requirements|plan|validate)"

# Backup conflicting commands
mkdir ~/.claude/commands/backup
mv ~/.claude/commands/requirements.md ~/.claude/commands/backup/ 2>/dev/null || true
```

### Recovery Procedures

**Complete Recovery:**
```bash
# Remove all planning enhancement commands
python3 uninstall-planning-enhancement.py

# Restore from backup
cp -r ~/.claude.backup/* ~/.claude/

# Reinstall fresh
python3 install-planning-enhancement.py
```

**Selective Recovery:**
```bash
# Restore specific commands
cp ~/.claude.backup/commands/requirements.md ~/.claude/commands/
cp ~/.claude.backup/commands/plan.md ~/.claude/commands/
```

## Security Considerations

### Installation Security

**Verify Installation Source:**
```bash
# Verify checksums (when available)
sha256sum install-planning-enhancement.py
# Compare with published checksums

# Review installation script before running
curl -s https://raw.githubusercontent.com/brennercruvinel/CCPlugins/main/install-planning-enhancement.py | less
```

**Secure Installation:**
```bash
# Install from verified source
git clone https://github.com/brennercruvinel/CCPlugins.git
cd CCPlugins
# Review code
git log --oneline -10
# Install
python3 install-planning-enhancement.py
```

### Runtime Security

**File Permissions:**
```bash
# Ensure proper permissions
chmod 644 ~/.claude/commands/*.md
chmod 755 ~/.claude/commands/

# Verify no executable permissions on command files
ls -la ~/.claude/commands/ | grep -v "^-rw-"
```

**Session File Security:**
```bash
# Session files should be readable only by user
find . -name "state.json" -exec chmod 600 {} \;
find . -name "plan.md" -exec chmod 600 {} \;
```

This deployment guide ensures safe, reliable installation and maintenance of CCPlugins Planning Enhancement commands across different environments and use cases.