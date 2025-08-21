const tinify = require('tinify');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Set your API key from environment variable
tinify.key = process.env.TINYPNG_API_KEY;

// Configuration
const config = {
  inputDir: './assets/img',
  outputDir: './assets/img/compressed',
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  preserveOriginals: true,
  skipExisting: true
};

async function compressImage(inputPath, outputPath) {
  try {
    console.log(`Compressing: ${inputPath}`);

    const source = tinify.fromFile(inputPath);
    await source.toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    console.log(`✓ Saved ${savings}% (${originalSize} → ${compressedSize} bytes)`);

    return { success: true, savings, originalSize, compressedSize };
  } catch (error) {
    console.error(`✗ Failed to compress ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function processDirectory(dir, outputDir) {
  const items = fs.readdirSync(dir);
  const results = [];

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subOutputDir = path.join(outputDir, item);
      const subResults = await processDirectory(itemPath, subOutputDir);
      results.push(...subResults);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();

      if (config.supportedFormats.includes(ext)) {
        const outputPath = path.join(outputDir, item);

        // Skip if output file already exists and skipExisting is true
        if (config.skipExisting && fs.existsSync(outputPath)) {
          console.log(`⏭ Skipping existing: ${outputPath}`);
          continue;
        }

        const result = await compressImage(itemPath, outputPath);
        results.push({ file: item, ...result });
      }
    }
  }

  return results;
}

async function main() {
  console.log('🖼️  TinyPNG Image Compression Started');
  console.log(`Input directory: ${config.inputDir}`);
  console.log(`Output directory: ${config.outputDir}`);
  console.log('─'.repeat(50));

  if (!tinify.key) {
    console.error('❌ TINYPNG_API_KEY not found in environment variables');
    console.log('Please add your API key to the .env file:');
    console.log('TINYPNG_API_KEY=your_api_key_here');
    process.exit(1);
  }

  try {
    // Validate API key
    await tinify.validate();
    console.log('✓ API key validated');

    const results = await processDirectory(config.inputDir, config.outputDir);

    // Summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('─'.repeat(50));
    console.log(`📊 Compression Summary:`);
    console.log(`✓ Successfully compressed: ${successful.length} images`);
    console.log(`✗ Failed: ${failed.length} images`);

    if (successful.length > 0) {
      const totalOriginal = successful.reduce((sum, r) => sum + r.originalSize, 0);
      const totalCompressed = successful.reduce((sum, r) => sum + r.compressedSize, 0);
      const totalSavings = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);

      console.log(`💾 Total space saved: ${totalSavings}% (${(totalOriginal - totalCompressed)} bytes)`);
    }

    console.log(`📈 API usage this month: ${tinify.compressionCount} compressions`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();