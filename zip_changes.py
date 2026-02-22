import subprocess
import zipfile
import os
import sys

def get_git_files():
    try:
        # Get modified files compared to main
        modified = subprocess.check_output(['git', 'diff', '--name-only', 'main'], text=True).splitlines()
        
        # Get untracked files (added)
        added = subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard'], text=True).splitlines()
        
        # Return unique set of files
        return sorted(list(set(modified + added)))
    except subprocess.CalledProcessError as e:
        print(f"Error running git commands: {e}")
        return []

def create_zip(files, output_filename='changes.zip'):
    if not files:
        print("No changed or added files found.")
        return

    print(f"Adding {len(files)} files to {output_filename}...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files:
            if os.path.isfile(file):
                print(f"  Adding: {file}")
                zipf.write(file)
            else:
                print(f"  Skipping (not a file): {file}")

    print(f"\nSuccessfully created {output_filename}")

if __name__ == "__main__":
    changed_files = get_git_files()
    create_zip(changed_files)
