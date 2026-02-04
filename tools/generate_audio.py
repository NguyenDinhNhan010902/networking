import os
import re
import sys
from pathlib import Path
from gtts import gTTS

# Force UTF-8 for Windows Console
sys.stdout.reconfigure(encoding='utf-8')

# Cấu hình
DOCS_DIR = Path('docs')
OUTPUT_DIR = Path('docs/public/audio')
LANG = 'vi'

def clean_markdown(text):
    """
    Làm sạch markdown để đọc trôi chảy hơn.
    """
    # Xóa Frontmatter (--- ... ---)
    text = re.sub(r'^---[\s\S]*?---\n', '', text)
    
    # Xóa code blocks (``` ... ```)
    text = re.sub(r'```[\s\S]*?```', ' (Đoạn mã code) ', text)
    
    # Xóa inline code (`...`)
    text = re.sub(r'`(.*?)`', r'\1', text)
    
    # Xóa hình ảnh (![...](...))
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    
    # Xóa link ([...](...)) -> giữ lại text
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
    
    # Xóa thẻ HTML
    text = re.sub(r'<[^>]+>', '', text)
    
    # Xóa ký tự đặc biệt markdown (*, #, >, -)
    text = re.sub(r'[#*>\-]', '', text)
    
    # Xóa nhiều dòng trống
    text = re.sub(r'\n\s*\n', '\n', text)
    
    return text.strip()

def generate_audio_for_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        clean_content = clean_markdown(content)
        
        if not clean_content:
            print(f"⏩ Skipped (Empty): {file_path}")
            return

        # Tạo tên file output: mang-may-tinh_nat-port-forwarding.mp3
        relative_path = file_path.relative_to(DOCS_DIR)
        safe_name = str(relative_path.with_suffix('')).replace(os.sep, '_').replace('.', '_')
        output_file = OUTPUT_DIR / f"{safe_name}.mp3"
        
        # Kiểm tra nếu file mp3 đã tồn tại và mới hơn file md thì bỏ qua
        if output_file.exists():
            if output_file.stat().st_mtime > file_path.stat().st_mtime:
                print(f"✅ Up-to-date: {output_file.name}")
                # return # Uncomment để skip file đã có (nhưng hiện tại muốn force run để test)

        print(f"🔄 Generating: {file_path.name} -> {output_file.name}...")
        
        tts = gTTS(text=clean_content, lang=LANG)
        tts.save(str(output_file))
        print(f"✨ Done: {output_file.name}")

    except Exception as e:
        print(f"❌ Error {file_path}: {e}")

def main():
    # Tạo thư mục output nếu chưa có
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Duyệt file .md
    print(f"📂 Scanning directoy: {DOCS_DIR}")
    for file_path in DOCS_DIR.rglob('*.md'):
        if 'node_modules' in str(file_path): continue
        if file_path.name == 'index.md': continue # Thường index ít nội dung, có thể skip hoặc xử lý tùy ý
        
        generate_audio_for_file(file_path)

if __name__ == '__main__':
    try:
        import gtts
        main()
    except ImportError:
        print("⚠ Cần cài đặt gTTS trước: pip install gTTS")
