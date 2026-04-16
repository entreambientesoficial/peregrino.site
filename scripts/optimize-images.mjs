/**
 * Otimização de imagens — Peregrino Landing
 * Converte PNG/JPG → WebP, redimensiona para máx 1600px de largura.
 * Os cards exibem no máx ~1024px, então 1600px é mais que suficiente com margem.
 *
 * Uso: node scripts/optimize-images.mjs
 * Saída: img-apoio/ (substitui os arquivos originais, mantém backup em img-apoio/originals/)
 */

import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR  = 'img-apoio';
const BACKUP_DIR = 'img-apoio/originals';
const MAX_WIDTH  = 1600;
const WEBP_QUALITY = 82; // 80-85 é o ponto ideal qualidade/tamanho

async function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });

  const files = await readdir(INPUT_DIR);
  const images = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`\n🖼️  ${images.length} imagens encontradas\n`);

  let totalBefore = 0;
  let totalAfter  = 0;

  for (const file of images) {
    const inputPath  = join(INPUT_DIR, file);
    const ext        = extname(file);
    const name       = basename(file, ext);
    const outputPath = join(INPUT_DIR, name + '.webp');
    const backupPath = join(BACKUP_DIR, file);

    const statBefore = await stat(inputPath);
    totalBefore += statBefore.size;

    // Backup do original
    await copyFile(inputPath, backupPath);

    // Converte e redimensiona
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const statAfter = await stat(outputPath);
    totalAfter += statAfter.size;

    const saved = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(0);
    console.log(`  ✅ ${file.padEnd(45)} ${await formatBytes(statBefore.size)} → ${await formatBytes(statAfter.size)} (-${saved}%)`);
  }

  console.log(`\n📊 Total antes:  ${await formatBytes(totalBefore)}`);
  console.log(`📊 Total depois: ${await formatBytes(totalAfter)}`);
  console.log(`💾 Economia:     ${await formatBytes(totalBefore - totalAfter)} (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`);
  console.log(`\n⚠️  Originais salvos em img-apoio/originals/`);
  console.log(`⚠️  Atualize as referências .png/.jpg → .webp em LandingPage.tsx\n`);
}

main().catch(console.error);
