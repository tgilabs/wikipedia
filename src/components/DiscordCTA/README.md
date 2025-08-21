# Discord CTA Component

A beautiful, customizable Discord Call-to-Action component for your Docusaurus site.

## Features

- 🎨 Beautiful gradient design that matches your space theme
- 📱 Fully responsive with mobile optimization
- 🌙 Dark mode support
- 🔧 Multiple variants (default, compact, banner)
- 🌍 RTL support for Hebrew content
- ⚡ Smooth animations and hover effects
- 🎯 Customizable props for different use cases

## Installation

The component is already installed in your project at:
```
src/components/DiscordCTA/
```

## Usage

### Basic Usage

```jsx
import DiscordCTA from '@site/src/components/DiscordCTA';

<DiscordCTA />
```

### With Custom Props

```jsx
<DiscordCTA 
  title="הצטרפו לקהילת TeGriAi בדיסקורד!"
  description="המקום הכי ישראלי ברשת - קהילת גיימינג תוססת עם אירועים, חברים למשחק ותמיכה קהילתית"
  buttonText="הצטרפו עכשיו"
  inviteUrl="https://discord.gg/your-invite-link"
  image="/img/roblox-discord-background.png"
/>
```

### Different Variants

#### Compact Variant
```jsx
<DiscordCTA 
  variant="compact"
  title="דיסקורד מהיר"
  description="הצטרפו לשיחה"
  buttonText="בואו"
/>
```

#### Banner Variant
```jsx
<DiscordCTA 
  variant="banner"
  title="קהילת דיסקורד מיוחדת"
  description="מקום מרכזי לכל חברי הקהילה"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"הצטרף לקהילת הדיסקורד שלנו"` | The main title text |
| `description` | `string` | `"חבר אלינו בדיסקורד לדיונים, עדכונים ותמיכה מהקהילה"` | Description text |
| `buttonText` | `string` | `"הצטרף לדיסקורד"` | Text for the CTA button |
| `inviteUrl` | `string` | `"https://discord.gg/your-invite-link"` | Discord invite URL |
| `variant` | `'default' \| 'compact' \| 'banner'` | `'default'` | Component layout variant |
| `image` | `string` | `"/img/discord-background.png"` | Background image URL |

## Variants

### Default
The standard variant with icon on the left, content in the middle, and button on the right.

### Compact
A smaller version with reduced padding and smaller elements. Good for sidebars or inline use.

### Banner
A centered layout with all elements stacked vertically. Great for prominent placement.

## Styling

The component uses CSS modules and follows your existing design system:
- Matches the space theme gradient colors
- Responsive design with mobile-first approach
- RTL support for Hebrew text
- Dark mode compatibility
- Hover effects and animations

## Examples in Different Pages

### In Markdown Pages
```markdown
---
title: Your Page Title
---

import DiscordCTA from '@site/src/components/DiscordCTA';

# Your Content

Some content here...

<DiscordCTA />

More content...
```

### In React Components
```jsx
import DiscordCTA from '@site/src/components/DiscordCTA';

function MyPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <DiscordCTA 
        title="Join Our Community"
        inviteUrl="https://discord.gg/your-actual-invite"
      />
    </div>
  );
}
```

## Customization

### Custom Styling
You can override styles by targeting the CSS classes in your custom CSS:

```css
.discordCTA {
  /* Your custom styles */
}
```

### Environment-based URLs
For different environments, you can use environment variables:

```jsx
<DiscordCTA 
  inviteUrl={process.env.NODE_ENV === 'production' 
    ? 'https://discord.gg/your-prod-invite' 
    : 'https://discord.gg/your-dev-invite'
  }
/>
```

## Best Practices

1. **Use appropriate variants**: 
   - Default for main content areas
   - Compact for sidebars or repeated use
   - Banner for hero sections

2. **Customize the invite URL**: Always replace the default URL with your actual Discord invite link

3. **Localize content**: Adjust titles and descriptions based on your audience

4. **Test responsiveness**: The component is mobile-responsive, but test it in your specific layout

5. **Accessibility**: The component includes proper ARIA labels and keyboard navigation

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly
- Focus management

The component is designed to be accessible out of the box and follows WCAG guidelines.
