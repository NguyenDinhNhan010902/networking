import os
import re
import sys
from pathlib import Path
from gtts import gTTS

sys.stdout.reconfigure(encoding='utf-8')

FILE_PATH = Path('docs/mang-may-tinh/nat-port-forwarding.md')
OUTPUT_DIR = Path('docs/public/audio')
LANG = 'vi'

def clean_markdown(text):
    text = re.sub(r'^---[\s\S]*?---\n', '', text)
    text = re.sub(r'```[\s\S]*?```', ' (Đoạn mã code) ', text)
    text = re.sub(r'`(.*?)`', r'\1', text)
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[#*>\-]', '', text)
    text = re.sub(r'\n\s*\n', '\n', text)
    return text.strip()

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    clean_content = clean_markdown(content)
    
    # Logic name matching script generate_audio.py
    relative_path = FILE_PATH.relative_to('docs')
    safe_name = str(relative_path.with_suffix('')).replace(os.sep, '_').replace('.', '_')
    output_file = OUTPUT_DIR / f"{safe_name}.mp3"
    
    print(f"🔄 Processing single file: {output_file.name}...")
    tts = gTTS(text=clean_content, lang=LANG)
    tts.save(str(output_file))
    print(f"✨ Done!")

if __name__ == '__main__':
    main()
