// scripts/autoTag.js
// Auto-tag tabooList items with a `category` field based on detectCategory()
// Usage: node scripts/autoTag.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tabooList as originalList } from '../public/scripts/data/tabooList.js';
import { detectCategory } from '../public/scripts/lib/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.resolve(__dirname, '../public/scripts/data/tabooList.js');

function withCategories(list) {
  return list.map((item) => ({
    ...item,
    category: item.category || detectCategory(item.word),
  }));
}

function sortByCategory(list) {
  return list
    .map(item => ({
      ...item,
      category: item.category === 'Software Enginerring' ? 'Software Engineering' : item.category
    }))
    .sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.word.localeCompare(b.word);
    });
}

function serialize(list) {
  // Pretty-print JS module with export
  const entries = list.map((it) => {
    const taboo = `[${it.taboo.map((t) => JSON.stringify(t)).join(', ')}]`;
    return `  { word: ${JSON.stringify(it.word)}, category: ${JSON.stringify(it.category)}, taboo: ${taboo} }`;
  }).join(',\n');
  return `// public/scripts/data/tabooList.js\nexport const tabooList = [\n${entries}\n];\n`;
}

const updated = withCategories(originalList);
const sorted = sortByCategory(updated);
const content = serialize(sorted);
fs.writeFileSync(targetPath, content, { encoding: 'utf8' });

console.log(`✓ Sorted ${sorted.length} items by category`);
const categoryCount = {};
sorted.forEach(item => {
  categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
});
console.log('\nCategory breakdown:');
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`  - ${category}: ${count} items`);
});
