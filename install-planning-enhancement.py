#!/usr/bin/env python3
"""
CCPlugins Planning Enhancement Installer
Installs the planning enhancement commands to Claude Code CLI
"""

import os
import shutil
import sys
from pathlib import Path

def get_claude_commands_dir():
    """Get the Claude Code CLI commands directory"""
    home = Path.home()
    claude_dir = home / '.claude' / 'commands'
    
    if not claude_dir.exists():
        print("Creating Claude commands directory...")
        claude_dir.mkdir(parents=True, exist_ok=True)
    
    return claude_dir

def install_commands():
    """Install planning enhancement commands"""
    commands_dir = get_claude_commands_dir()
    current_dir = Path(__file__).parent
    
    # List of planning enhancement commands to install
    planning_commands = [
        'requirements.md',
        'plan.md',
        'validate-implementation.md',
        'adr.md',
        'feature-status.md',
        'retrospective.md',
        'expand-tests.md',
        'expand-api.md',
        'expand-components.md',
        'expand-models.md'
    ]
    
    installed_count = 0
    
    print("Installing CCPlugins Planning Enhancement commands...")
    print(f"Target directory: {commands_dir}")
    
    for command_file in planning_commands:
        source_path = current_dir / 'commands' / command_file
        target_path = commands_dir / command_file
        
        if source_path.exists():
            try:
                shutil.copy2(source_path, target_path)
                print(f"✓ Installed {command_file}")
                installed_count += 1
            except Exception as e:
                print(f"✗ Failed to install {command_file}: {e}")
        else:
            print(f"✗ Source file not found: {source_path}")
    
    return installed_count

def verify_installation():
    """Verify that commands were installed correctly"""
    commands_dir = get_claude_commands_dir()
    
    planning_commands = [
        'requirements.md',
        'plan.md',
        'validate-implementation.md',
        'adr.md',
        'feature-status.md',
        'retrospective.md',
        'expand-tests.md',
        'expand-api.md',
        'expand-components.md',
        'expand-models.md'
    ]
    
    print("\nVerifying installation...")
    
    all_installed = True
    for command_file in planning_commands:
        command_path = commands_dir / command_file
        if command_path.exists():
            print(f"✓ {command_file} - OK")
        else:
            print(f"✗ {command_file} - MISSING")
            all_installed = False
    
    return all_installed

def show_usage_info():
    """Show usage information for the new commands"""
    print("\n" + "="*60)
    print("CCPlugins Planning Enhancement - Installation Complete!")
    print("="*60)
    
    print("\n🎯 Strategic Planning & Requirements:")
    print("  /requirements          - Gather and document feature requirements")
    print("  /plan                  - Transform requirements into implementation plans")
    print("  /validate-implementation - Ensure implementations match requirements")
    print("  /adr                   - Document architectural decisions")
    print("  /feature-status        - Track complete feature lifecycle")
    print("  /retrospective         - Conduct post-completion analysis")
    
    print("\n🔄 Pattern Expansion & Scaling:")
    print("  /expand-tests          - Expand test coverage following patterns")
    print("  /expand-api            - Create similar API endpoints")
    print("  /expand-components     - Generate UI components following patterns")
    print("  /expand-models         - Create data models following schema patterns")
    
    print("\n📖 Complete Development Workflow:")
    print("  1. claude \"/requirements UserProfile\"")
    print("  2. claude \"/plan UserProfile\"")
    print("  3. claude \"/scaffold user-profile\"")
    print("  4. claude \"/implement\"")
    print("  5. claude \"/expand-tests UserProfile\"")
    print("  6. claude \"/test\"")
    print("  7. claude \"/validate-implementation UserProfile\"")
    print("  8. claude \"/review\"")
    print("  9. claude \"/commit\"")
    print("  10. claude \"/retrospective UserProfile\"")
    
    print("\n📚 Documentation:")
    print("  - USAGE_EXAMPLES.md - Comprehensive usage examples")
    print("  - TROUBLESHOOTING_GUIDE.md - Common issues and solutions")
    print("  - PERFORMANCE_OPTIMIZATION_GUIDE.md - Performance tips")
    print("  - WORKFLOW_INTEGRATION.md - Command integration details")
    
    print("\n🚀 Quick Start:")
    print("  Try: claude \"/requirements MyFeature\"")
    print("  Then: claude \"/plan MyFeature\"")
    
    print("\n" + "="*60)

def main():
    """Main installation function"""
    print("CCPlugins Planning Enhancement Installer")
    print("========================================")
    
    try:
        # Install commands
        installed_count = install_commands()
        
        if installed_count == 0:
            print("\n❌ No commands were installed. Please check the installation.")
            sys.exit(1)
        
        # Verify installation
        if verify_installation():
            print(f"\n✅ Successfully installed {installed_count} planning enhancement commands!")
            show_usage_info()
        else:
            print("\n⚠️  Installation completed with some issues. Please check the verification output above.")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n❌ Installation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()