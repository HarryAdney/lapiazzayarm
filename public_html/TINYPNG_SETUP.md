# TinyPNG Setup Guide for Visual Studio Code

This guide explains how to set up and use TinyPNG image compression in your VS Code project.

## Prerequisites

- TinyPNG API key from [tinypng.com](https://tinypng.com/developers)
- Node.js installed on your system
- Visual Studio Code

## Setup Methods

### Method 1: VS Code Extension (Recommended for Manual Compression)

1. **Install the Extension**
   - Open VS Code Extensions (Ctrl+Shift+X)
   - Search for "TinyPNG" by Andi Dittrich
   - Click Install

2. **Configure API Key**
   - Go to Settings (Ctrl+,)
   - Search for "tinypng"
   - Enter your API key in "Tinypng: Api Key" field
   - Or use environment variable: `${TINYPNG_API_KEY}`

3. **Usage**
   - Right-click any image file (.jpg, .png, .webp)
   - Select "TinyPNG: Compress Image"
   - The compressed image will replace the original

### Method 2: Automated Script (Recommended for Batch Processing)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   - Add your API key to the `.env` file:
   ```
   TINYPNG_API_KEY=your_api_key_here
   ```

3. **Run Compression**
   ```bash
   # Compress all images in assets/img/
   npm run compress-images

   # Or run the build process (includes compression)
   npm run build
   ```

## Configuration Options

### Script Configuration
Edit `scripts/compress-images.js` to customize:

```javascript
const config = {
  inputDir: './assets/img',           // Source directory
  outputDir: './assets/img/compressed', // Output directory
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  preserveOriginals: true,            // Keep original files
  skipExisting: true                  // Skip already compressed files
};
```

### VS Code Settings
The `.vscode/settings.json` file includes:

- File nesting for compressed images
- TinyPNG extension configuration
- Image file associations

## Usage Examples

### Compress Single Image (Extension)
1. Right-click on `hero.webp`
2. Select "TinyPNG: Compress Image"
3. Image is compressed in place

### Compress All Images (Script)
```bash
npm run compress-images
```

### Compress Specific Directory
Modify the script's `inputDir` configuration or create a custom script:

```javascript
// Custom compression for gallery images only
const config = {
  inputDir: './assets/img/gallery',
  outputDir: './assets/img/gallery/compressed',
  // ... other options
};
```

## File Structure

```
project/
├── .env                          # API key storage
├── .vscode/settings.json         # VS Code configuration
├── scripts/compress-images.js    # Compression script
├── package.json                  # Dependencies and scripts
└── assets/img/                   # Your images
    ├── gallery/
    ├── carousel/
    └── compressed/               # Output directory
```

## Security Notes

- ✅ API key stored in `.env` file
- ✅ `.env` added to `.gitignore`
- ✅ Never commit API keys to version control
- ✅ Use environment variables in production

## Troubleshooting

### API Key Issues
```bash
# Test API key validation
node -e "
const tinify = require('tinify');
require('dotenv').config();
tinify.key = process.env.TINYPNG_API_KEY;
tinify.validate().then(() => console.log('✓ API key valid')).catch(err => console.error('✗ API key invalid:', err.message));
"
```

### Common Errors

1. **"API key not found"**
   - Check `.env` file exists and contains `TINYPNG_API_KEY=your_key`
   - Ensure no spaces around the `=` sign

2. **"Unauthorized"**
   - Verify your API key is correct
   - Check you haven't exceeded monthly limit (500 free compressions)

3. **"File not found"**
   - Verify input directory path in script configuration
   - Check file permissions

### Monitoring Usage

The script displays your monthly compression count:
```
📈 API usage this month: 45 compressions
```

Free accounts get 500 compressions per month.

## Advanced Usage

### Custom Resize Options
```javascript
// Add to compress-images.js
const source = tinify.fromFile(inputPath);
const resized = source.resize({
  method: "fit",
  width: 800,
  height: 600
});
await resized.toFile(outputPath);
```

### Integration with Build Process
The `npm run build` command now includes image compression. Customize in `package.json`:

```json
{
  "scripts": {
    "build": "sass assets/scss/style.scss assets/css/style.css && npm run compress-images"
  }
}
```

## Support

- [TinyPNG API Documentation](https://tinypng.com/developers/reference)
- [VS Code Extension Documentation](https://marketplace.visualstudio.com/items?itemName=andi1984.tinypng)
- Check compression count at [tinypng.com](https://tinypng.com/dashboard)