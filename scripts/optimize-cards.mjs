import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const dir = 'public/img-apoio';
const files = readdirSync(dir).filter(f => f.startsWith('card') && f.endsWith('.webp'));

for (const file of files) {
  const input = join(dir, file);
  const output = join(dir, file + '.tmp.webp');
  const before = statSync(input).size;

  await sharp(input)
    .resize(900, null, { withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(output);

  const after = statSync(output).size;
  const saved = Math.round((1 - after / before) * 100);

  // replace original
  const { renameSync } = await import('fs');
  renameSync(output, input);

  console.log(`${file}: ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB (-${saved}%)`);
}
console.log('\nOtimização concluída.');
