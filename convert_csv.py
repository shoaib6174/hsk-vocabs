import csv
import json

csv_file_path = 'src/data/Chinese Word List for Google Sheets - Sheet2.csv'
ts_file_path = 'src/data/sampleData.ts'

words = []

try:
    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                level = int(row['Level']) if row['Level'] else 0
                lesson = int(row['Lesson']) if row['Lesson'] else 0
                
                # Split categories by '/' and strip whitespace
                categories_str = row['Category']
                categories = [c.strip() for c in categories_str.split('/') if c.strip()]
                
                word = {
                    'hanzi': row['Hanzi'],
                    'pinyin': row['Pinyin'],
                    'english': row['English'],
                    'categories': categories,
                    'level': level,
                    'lesson': lesson
                }
                words.append(word)
            except ValueError:
                continue

    ts_content = "import type { Word } from '../types';\n\n"
    ts_content += "export const sampleData: Word[] = [\n"
    
    for word in words:
        hanzi = word['hanzi'].replace("'", "\\'")
        pinyin = word['pinyin'].replace("'", "\\'")
        english = word['english'].replace("'", "\\'")
        
        # Serialize list of categories to string representation valid in JS
        categories_js = json.dumps(word['categories'])
        
        ts_content += f"  {{ hanzi: '{hanzi}', pinyin: '{pinyin}', english: '{english}', categories: {categories_js}, level: {word['level']}, lesson: {word['lesson']} }},\n"
    
    ts_content += "];\n"

    with open(ts_file_path, 'w', encoding='utf-8') as tsfile:
        tsfile.write(ts_content)
    
    print(f"Successfully converted {len(words)} words.")

except Exception as e:
    print(f"Error: {e}")
