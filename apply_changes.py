import zipfile
import os
import sys

def apply_zip(zip_filename='zip_changes.zip'):
    if not os.path.exists(zip_filename):
        print(f"Error: {zip_filename} not found.")
        return

    print(f"Applying changes from {zip_filename}...")
    
    with zipfile.ZipFile(zip_filename, 'r') as zipf:
        for file_info in zipf.infolist():
            # Skip directories in the zip (they end with /)
            if file_info.is_dir():
                continue
                
            target_path = file_info.filename
            
            # Safety check: if the target_path exists and is a directory, skip it
            # This handles the "don't ever replace a folder" requirement
            if os.path.isdir(target_path):
                print(f"  Skipping: {target_path} (exists as a directory)")
                continue
            
            # Ensure the parent directory exists
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            
            # Extract the file
            print(f"  Applying: {target_path}")
            # Manual write to ensure we don't accidentally mess up file permissions or types
            with zipf.open(file_info) as source, open(target_path, 'wb') as target:
                target.write(source.read())

    print(f"\nSuccessfully applied changes from {zip_filename}")

if __name__ == "__main__":
    zip_to_apply = 'changes.zip'
    if len(sys.argv) > 1:
        zip_to_apply = sys.argv[1]
        
    apply_zip(zip_to_apply)
