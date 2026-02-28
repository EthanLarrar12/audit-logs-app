import subprocess
import zipfile
import os
import sys
import fnmatch

def load_ignore_patterns(ignore_file='.changesignore'):
    patterns = []
    if os.path.exists(ignore_file):
        with open(ignore_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    patterns.append(line)
    return patterns

def is_ignored(file_path, patterns):
    ignored = False
    for pattern in patterns:
        is_negation = pattern.startswith('!')
        if is_negation:
            pattern = pattern[1:]
            
        if pattern.startswith('/'):
            pattern = pattern[1:]
            
        match = False
        if fnmatch.fnmatch(file_path, pattern):
            match = True
        elif fnmatch.fnmatch(file_path, f"{pattern}/*"):
            match = True
        elif '/' not in pattern.rstrip('/'):
            p = pattern.rstrip('/')
            if fnmatch.fnmatch(file_path, f"*/{p}/*") or fnmatch.fnmatch(file_path, f"*/{p}"):
                match = True
                
        if match:
            ignored = not is_negation
            
    return ignored

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

    ignore_patterns = load_ignore_patterns()
    files_to_zip = []
    
    for file in files:
        if is_ignored(file, ignore_patterns):
            print(f"  Ignoring: {file}")
        else:
            files_to_zip.append(file)
            
    if not files_to_zip:
        print("All changed files are ignored. No zip created.")
        return

    print(f"Adding {len(files_to_zip)} files to {output_filename}...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            if os.path.isfile(file):
                print(f"  Adding: {file}")
                zipf.write(file)
            else:
                print(f"  Skipping (not a file): {file}")

    print(f"\nSuccessfully created {output_filename}")

if __name__ == "__main__":
    changed_files = get_git_files()
    create_zip(changed_files)

