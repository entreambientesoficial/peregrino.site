/**
 * Otimização de vídeos — Peregrino Landing
 * Recomprime MP4 com H.264/AAC, reduz bitrate mantendo qualidade visual.
 * CRF 28 = boa qualidade, ~60-70% menor que o original.
 *
 * Uso: node scripts/optimize-videos.mjs
 * Saída: substitui os vídeos originais (backup em video-backups/)
 */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { mkdir, copyFile, stat, rename } from 'fs/promises';
import { join } from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const VIDEOS = [
  { input: 'public/video-apoio/2.mp4',         label: 'Hero video' },
  { input: 'img-apoio/video-site-peregrino.mp4', label: 'BookSection video' },
];

const BACKUP_DIR = 'video-backups';

async function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function compress(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-crf 28',          // qualidade (18=lossless, 28=bom, 32=baixo)
        '-preset slow',     // melhor compressão (mais lento)
        '-movflags +faststart', // streaming começa mais rápido
        '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2', // garante dimensões pares
      ])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });

  console.log('\n🎬 Otimizando vídeos...\n');

  let totalBefore = 0;
  let totalAfter  = 0;

  for (const { input, label } of VIDEOS) {
    const tmpOutput = input.replace('.mp4', '_compressed.mp4');
    const backupPath = join(BACKUP_DIR, input.split('/').pop());

    const before = await stat(input);
    totalBefore += before.size;
    console.log(`⏳ ${label} (${await formatMB(before.size)})...`);

    try {
      await compress(input, tmpOutput);

      const after = await stat(tmpOutput);
      totalAfter += after.size;

      const saved = (((before.size - after.size) / before.size) * 100).toFixed(0);
      console.log(`  ✅ ${label.padEnd(25)} ${await formatMB(before.size)} → ${await formatMB(after.size)} (-${saved}%)`);

      // Backup e substituição
      await copyFile(input, backupPath);
      await rename(tmpOutput, input);
    } catch (err) {
      console.error(`  ❌ Erro em ${label}:`, err.message);
      // Remove arquivo temporário se existir
      try { await import('fs/promises').then(fs => fs.unlink(tmpOutput)); } catch {}
    }
  }

  console.log(`\n📊 Total antes:  ${await formatMB(totalBefore)}`);
  console.log(`📊 Total depois: ${await formatMB(totalAfter)}`);
  console.log(`💾 Economia:     ${await formatMB(totalBefore - totalAfter)} (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`);
  console.log(`\n⚠️  Originais salvos em ${BACKUP_DIR}/\n`);
}

main().catch(console.error);
