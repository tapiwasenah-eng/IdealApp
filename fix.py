import os

def unescape_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace \` with `
    content = content.replace('\\`', '`')
    # Replace \$ with $
    content = content.replace('\\$', '$')
    
    with open(filepath, 'w') as f:
        f.write(content)

src_dir = 'src'
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            unescape_file(os.path.join(root, file))

print("Fixed syntax errors")
