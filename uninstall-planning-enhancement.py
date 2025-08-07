#!/usr/bin/env python3
"""
CCPlugins Planning Enhancement Uninstaller
Removes the planning enhancement commands from Claude Code CLI
"""

import os
import sys
from pathlib import Path

def get_claude_commands_dir():
    """Get the Claude Code CLI commands directory"""
    home = Path.home()
    claude_dir = home / '.claude' / 'commands'
    return claude_dir

def uninstall_commands():
    """Uninstall planning enhancement commands"""
    commands_dir = get_claude_commands_dir()
    
    if not commands_dir.exists():
        print("Claude commands directory not found. Nothing to uninstall.")
        return 0
    
    # List of planning enhancement commands to uninstall
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
    
    removed_count = 0
    
    print("Uninstalling CCPlugins Planning Enhancement commands...")
    print(f"Commands directory: {commands_dir}")
    
    for command_file in planning_commands:
        command_path = commands_dir / command_file
        
        if command_path.exists():
            try:
                command_path.unlink()
                print(f"✓ Removed {command_file}")
                removed_count += 1
            except Exception as e:
                print(f"✗ Failed to remove {command_file}: {e}")
        else:
            print(f"- {command_file} (not found)")
    
    return removed_count

def cleanup_session_files():
    """Ask user if they want to clean up session files"""
    print("\n" + "="*60)
    print("Session File Cleanup")
    print("="*60)
    
    print("\nPlanning enhancement commands create session files in your projects:")
    print("  - requirements/")
    print("  - plan/")
    print("  - validate-implementation/")
    print("  - adr/")
    print("  - feature-status/")
    print("  - retrospective/")
    print("  - expand-tests/")
    print("  - expand-api/")
    print("  - expand-components/")
    print("  - expand-models/")
    
    print("\nThese files contain your work and should generally be kept.")
    print("You can manually remove them from individual projects if needed.")
    
    response = input("\nWould you like guidance on cleaning up session files? (y/N): ").lower()
    
    if response in ['y', 'yes']:
        show_cleanup_guidance()

def show_cleanup_guidance():
    """Show guidance for cleaning up session files"""
    print("\n📋 Session File Cleanup Guidance:")
    print("="*40)
    
    print("\n🔍 To find session files in your projects:")
    print("  find ~/your-projects -name 'requirements' -type d")
    print("  find ~/your-projects -name 'plan' -type d")
    print("  find ~/your-projects -name 'validate-implementation' -type d")
    
    print("\n🗑️  To remove session files from a specific project:")
    print("  cd /path/to/your/project")
    print("  rm -rf requirements/ plan/ validate-implementation/")
    print("  rm -rf adr/ feature-status/ retrospective/")
    print("  rm -rf expand-tests/ expand-api/ expand-components/ expand-models/")
    
    print("\n💾 To backup session files before removal:")
    print("  cd /path/to/your/project")
    print("  tar -czf planning-sessions-backup.tar.gz requirements/ plan/ validate-implementation/ adr/ feature-status/ retrospective/ expand-*/")
    print("  # Then remove the directories")
    
    print("\n⚠️  Important Notes:")
    print("  - Session files contain your requirements, plans, and analysis")
    print("  - Only remove them if you're sure you don't need them")
    print("  - Consider backing up important session files first")
    print("  - Session files are project-specific and safe to keep")

def verify_uninstallation():
    """Verify that commands were uninstalled correctly"""
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
    
    print("\nVerifying uninstallation...")
    
    all_removed = True
    for command_file in planning_commands:
        command_path = commands_dir / command_file
        if not command_path.exists():
            print(f"✓ {command_file} - REMOVED")
        else:
            print(f"✗ {command_file} - STILL EXISTS")
            all_removed = False
    
    return all_removed

def main():
    """Main uninstallation function"""
    print("CCPlugins Planning Enhancement Uninstaller")
    print("==========================================")
    
    # Confirm uninstallation
    print("\nThis will remove the following commands from Claude Code CLI:")
    print("  /requirements, /plan, /validate-implementation, /adr")
    print("  /feature-status, /retrospective")
    print("  /expand-tests, /expand-api, /expand-components, /expand-models")
    
    response = input("\nAre you sure you want to uninstall? (y/N): ").lower()
    
    if response not in ['y', 'yes']:
        print("Uninstallation cancelled.")
        sys.exit(0)
    
    try:
        # Uninstall commands
        removed_count = uninstall_commands()
        
        # Verify uninstallation
        if verify_uninstallation():
            print(f"\n✅ Successfully removed {removed_count} planning enhancement commands!")
        else:
            print("\n⚠️  Uninstallation completed with some issues. Please check the verification output above.")
        
        # Offer session file cleanup guidance
        cleanup_session_files()
        
        print("\n" + "="*60)
        print("Uninstallation Complete")
        print("="*60)
        print("\nThe planning enhancement commands have been removed from Claude Code CLI.")
        print("Your existing CCPlugins commands remain unchanged.")
        print("\nTo reinstall: python install-planning-enhancement.py")
        print("="*60)
            
    except Exception as e:
        print(f"\n❌ Uninstallation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()