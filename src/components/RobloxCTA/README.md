# Roblox CTA Component

A customizable React component for creating Call-to-Action buttons that launch Roblox experiences. This component provides multiple variants with different animations and handles the complex logic of deep linking to Roblox apps with fallbacks.

## Features

- **Smart Deep Linking**: Tries native app first, falls back to web launcher, then to store downloads
- **Multiple Variants**: Default, compact, banner, and animated versions
- **Animations**: Pulse, glow, bounce effects
- **Mobile Responsive**: Optimized for all screen sizes
- **RTL Support**: Built with Hebrew/Arabic text direction in mind
- **Customizable**: All text, styling, and behavior can be customized

## Usage

### Basic Usage

```tsx
import RobloxCTA from '@site/src/components/RobloxCTA';

<RobloxCTA />
```

### With Custom Place ID

```tsx
<RobloxCTA 
  placeId="your-place-id-here"
  title="הצטרפו אלינו ברובלוקס"
  description="משחק מדהים מחכה לכם!"
/>
```

### Variants

#### Default Variant (with secondary button)
```tsx
<RobloxCTA 
  variant="default"
  animation="pulse"
/>
```

#### Compact Variant
```tsx
<RobloxCTA 
  variant="compact"
  title="שחקו עכשיו"
  description="הצטרפו למשחק"
/>
```

#### Banner Variant
```tsx
<RobloxCTA 
  variant="banner"
  animation="glow"
/>
```

#### Animated Variant
```tsx
<RobloxCTA 
  variant="animated"
  animation="bounce"
/>
```

### Animation Options

- `pulse`: Gentle scaling animation
- `glow`: Glowing shadow effect
- `bounce`: Bouncing button animation
- `none`: No animation

### Private Server Support

```tsx
<RobloxCTA 
  placeId="84552319997646"
  linkCode="ABC123"
  launchData='{"entry":"website","campaign":"vip"}'
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "הצטרפו אלינו ברובלוקס" | Main heading text |
| `description` | string | "חוויה ייחודית במשחק הכי פופולרי בעולם" | Description text |
| `buttonText` | string | "שחקו עכשיו" | Primary button text |
| `placeId` | string | "84552319997646" | Roblox place ID |
| `linkCode` | string | "" | Private server link code |
| `launchData` | string | '{"entry":"website","campaign":"landing"}' | Launch metadata |
| `variant` | string | "default" | Component layout variant |
| `image` | string | "/img/roblox-discord-background.jpg" | Background image |
| `animation` | string | "pulse" | Animation type |

## Deep Link Behavior

The component implements a sophisticated deep linking strategy:

1. **Native Deep Link** (0-1.2s): Tries `roblox://experiences/start?placeId=...`
2. **Web Launcher** (1.2-2.6s): Falls back to `https://www.roblox.com/games/start?placeId=...`
3. **Store Download** (2.6s+): Redirects to appropriate app store or download page

This ensures users get the best possible experience regardless of their device or whether they have Roblox installed.

## Styling

The component uses CSS modules with Roblox brand colors:
- Primary: `#00b06f` (Roblox green)
- Secondary: `#393b3d` (Dark gray)
- Background overlays and gradients for readability

## Examples

### Gaming Page CTA
```tsx
<RobloxCTA 
  title="הצטרפו למשחק שלנו"
  description="חוויית גיימינג ייחודית מחכה לכם"
  variant="banner"
  animation="glow"
  placeId="your-place-id"
/>
```

### Embedded in Content
```tsx
<RobloxCTA 
  variant="compact"
  title="משחק עכשיו"
  buttonText="בואו נשחק"
  animation="pulse"
/>
```

### VIP Server Access
```tsx
<RobloxCTA 
  variant="animated"
  title="שרת VIP בלעדי"
  description="גישה מיוחדת לחברי הקהילה"
  linkCode="VIP123"
  launchData='{"entry":"website","campaign":"vip","tier":"premium"}'
/>
```
