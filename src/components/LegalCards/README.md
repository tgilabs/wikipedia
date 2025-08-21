# LegalCards Component

A responsive cards component that displays all the legal sections available in the TeGriAi community documentation.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Cards**: Hover effects and smooth transitions
- **Availability Status**: Shows which sections are available and which are under development
- **Hebrew RTL Support**: Properly styled for Hebrew text direction
- **Dark Mode Support**: Adapts to light and dark themes

## Usage

```tsx
import LegalCards from '@site/src/components/LegalCards';

<LegalCards />
```

## Sections Included

1. **Discord** (💬) - Available
   - Community guidelines and safety policies for the Discord server
   
2. **Roblox** (🎮) - Available
   - Rules and safety guidelines for the Roblox platform
   
3. **Website** (🌐) - Available
   - Privacy policy and terms of use for the website
   
4. **Perfume** (🌸) - Under Development
   - Policies related to the Perfume platform
   
5. **Workway** (💼) - Under Development
   - Guidelines and regulations for the Workway platform

## Styling

The component uses CSS modules for styling and includes:
- Card hover effects
- Gradient text for titles
- Status badges (Available/Under Development)
- Responsive breakpoints
- Dark mode compatibility

## Accessibility

- Proper semantic HTML structure
- ARIA-compliant interactive elements
- Keyboard navigation support
- Screen reader friendly content
