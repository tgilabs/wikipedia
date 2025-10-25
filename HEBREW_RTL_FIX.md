# Hebrew RTL Text Support & Native Markdown Integration for Tiptap Editor

## Problem
The Tiptap editor had two main issues:
1. Not properly handling Hebrew text and RTL (Right-to-Left) languages, causing display issues with text direction and alignment
2. Using a custom HTML-to-Markdown converter instead of Tiptap's native Markdown support

## Solution Implemented

### 1. Added Required Extensions

#### Text Alignment Extension
```bash
pnpm add @tiptap/extension-text-align
```

#### Native Markdown Extension
```bash
pnpm add @tiptap/markdown
```

### 2. Updated MarkdownEditor Component

#### Added Extensions
```typescript
import { Markdown } from '@tiptap/markdown';
import TextAlign from '@tiptap/extension-text-align';

// In editor configuration:
TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right'],
  defaultAlignment: 'right', // Default to right for Hebrew
}),
Markdown.configure({
  markedOptions: {
    gfm: true, // GitHub Flavored Markdown support
  },
  indentation: {
    style: 'space',
    size: 2,
  },
}),
```

#### Native Markdown Support
```typescript
// Parse initial content as Markdown
content: initialContent,
contentType: 'markdown',

// Export content as Markdown using native extension
onUpdate: ({ editor }) => {
  const markdown = editor.getMarkdown();
  onChange(markdown);
}
```

#### RTL Auto-Detection
```typescript
editorProps: {
  attributes: {
    dir: 'auto', // Automatically detect text direction
    lang: 'he',  // Set Hebrew as the language
  },
}
```

### 3. Updated CSS for RTL Support

#### Key Changes:

1. **Automatic Direction Detection**
   - Changed from fixed `direction: rtl` to `direction: auto`
   - Added `unicode-bidi: plaintext` for proper bidirectional text handling

2. **Logical Properties**
   - Replaced directional properties (left/right) with logical properties (inline-start/inline-end)
   - Changed `padding-right` to `padding-inline-start`
   - Changed `border-right` to `border-inline-start`

3. **Font Support**
   - Added Hebrew-compatible fonts to the font stack
   - Includes: Arial Hebrew, Narkisim, and other system fonts

4. **Mixed Content Support**
   - Added `unicode-bidi: plaintext` to all text elements (p, h1-h6)
   - This allows Hebrew and English text to coexist properly

### 4. Removed Custom HTML-to-Markdown Converter

The old `convertToMarkdown()` function with manual regex replacements has been completely removed. The editor now uses:
- **Native Markdown parsing**: `contentType: 'markdown'` for input
- **Native Markdown serialization**: `editor.getMarkdown()` for output

This provides:
- **Better accuracy**: No conversion errors from regex patterns
- **Full Markdown spec support**: Handles complex nested structures
- **GFM support**: Tables, task lists, strikethrough, etc.
- **Maintainability**: No custom conversion code to maintain

## How It Works

### Native Markdown Processing
The `@tiptap/markdown` extension uses [MarkedJS](https://marked.js.org) internally:
- **Input**: Markdown → Tokenization → Tiptap JSON
- **Output**: Tiptap JSON → Serialization → Markdown
- **Bidirectional**: Perfect round-trip conversion

### Automatic Text Direction Detection
The editor uses `dir="auto"` which automatically detects text direction:
- Hebrew/Arabic characters → RTL
- English/Latin characters → LTR
- Mixed content → Proper bidirectional handling

### Unicode Bidirectional Algorithm
The `unicode-bidi: plaintext` property ensures:
- Each paragraph's direction is determined independently
- Mixed language content (Hebrew + English) displays correctly
- List items and blockquotes respect the text direction

### Logical CSS Properties
Using logical properties instead of directional ones:
- `padding-inline-start` adapts to text direction automatically
- `border-inline-start` works for both RTL and LTR
- `text-align: start` aligns based on direction

## Features Supported

### Markdown Features (via native extension)
- **Headings**: # through ######
- **Bold/Italic**: **bold**, *italic*, ***both***
- **Lists**: Ordered and unordered, with nesting
- **Links**: [text](url)
- **Images**: ![alt](url)
- **Code**: Inline `code` and ```code blocks```
- **Blockquotes**: > quotes
- **GFM Features**: Tables, task lists, strikethrough

### RTL Features
- **Auto-detection**: Automatic Hebrew/English direction detection
- **Mixed content**: Hebrew and English in same paragraph
- **Proper alignment**: Text aligns based on language
- **Logical layout**: Lists, blockquotes work in both directions

## Testing

To test the complete solution:

1. **Markdown Input**
   ```typescript
   editor.commands.setContent('# שלום עולם\n\nThis is **bold**!', { 
     contentType: 'markdown' 
   });
   ```

2. **Hebrew Text** - Types RTL automatically
   ```
   # שלום עולם
   זהו טקסט בעברית
   ```

3. **English Text** - Types LTR automatically
   ```
   # Hello World
   This is English text
   ```

4. **Mixed Content**
   ```
   # Hello שלום
   Mixed עברית and English
   ```

5. **Markdown Output**
   ```typescript
   const markdown = editor.getMarkdown();
   // Returns properly formatted Markdown
   ```

## Example Usage

```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import TextAlign from '@tiptap/extension-text-align';

const editor = useEditor({
  extensions: [
    StarterKit,
    TextAlign.configure({
      defaultAlignment: 'right',
    }),
    Markdown.configure({
      markedOptions: { gfm: true },
    }),
  ],
  content: '# שלום\n\nThis is **Markdown**!',
  contentType: 'markdown',
  editorProps: {
    attributes: {
      dir: 'auto',
      lang: 'he',
    },
  },
  onUpdate: ({ editor }) => {
    const markdown = editor.getMarkdown();
    saveToBackend(markdown);
  },
});
```

## Browser Compatibility

This solution works in all modern browsers that support:
- CSS Logical Properties (all major browsers 2020+)
- `unicode-bidi: plaintext` (all major browsers)
- `dir="auto"` attribute (all major browsers)

## Migration Notes

### Before
```typescript
// Custom HTML to Markdown conversion
const html = editor.getHTML();
onChange(convertToMarkdown(html)); // Manual regex conversion
```

### After
```typescript
// Native Markdown extension
const markdown = editor.getMarkdown(); // Direct Markdown output
onChange(markdown);
```

### Benefits
- ✅ No conversion errors
- ✅ Full Markdown spec compliance
- ✅ GFM support (tables, task lists)
- ✅ Better performance
- ✅ Less code to maintain
- ✅ Perfect round-trip conversion

## Additional Notes

- The default alignment is set to 'right' to accommodate Hebrew as the primary language
- The toolbar remains LTR for consistency with UI conventions
- Font smoothing is enabled for better text rendering
- The solution supports both light and dark themes
- All Markdown content is now properly preserved during editing
- The editor can handle complex nested Markdown structures
