# Roblox Commands Component

A comprehensive React component for displaying VIP Roblox admin commands in a searchable, categorized interface.

## Features

- **Searchable Interface**: Search through all commands by name, description, or aliases
- **Category Filtering**: Filter commands by category (Appearance, Effects, Player Control, Camera & UI, Utility, Fun Commands)
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Command Information**: Each command shows:
  - Command syntax
  - Description
  - Example usage
  - Aliases (if any)
  - Undo command (if applicable)
  - Category icon

## Usage

```tsx
import RobloxCommands from '@site/src/components/RobloxCommands';

export default function CommandsPage() {
  return (
    <div>
      <RobloxCommands />
    </div>
  );
}
```

## Component Structure

- **Main Container**: Full-width section with gradient background
- **Header**: Title, subtitle, and admin plugin selection
- **Help Section**: Instructions on how to use HD Admin commands
- **Controls**: Search bar and category filters
- **Commands Grid**: Responsive grid layout of command cards
- **VIP Badge**: Indicates the required rank for all commands

## Styling

The component uses CSS modules for styling and follows the design patterns of other components in the project:

- Gradient backgrounds and borders
- Smooth hover animations
- Consistent color scheme using CSS custom properties
- Glass-morphism effects for modern UI
- FontAwesome icons for visual enhancement

## Categories

Commands are organized into the following categories:

1. **Utility**: Basic commands like cmdbar, refresh, respawn
2. **Appearance**: Commands that modify player appearance (clothes, body modifications, etc.)
3. **Effects**: Visual effects like fire, sparkles, materials
4. **Player Control**: Commands that control player actions (freeze, jail, invisible)
5. **Camera & UI**: Commands affecting camera and UI elements
6. **Fun Commands**: Entertainment commands like spin, icecream, rainbowFart

## Data Structure

Each command follows this interface:

```typescript
type RobloxCommand = {
  command: string;           // Command name and parameters
  description: string;       // What the command does
  example: string;          // Usage example
  aliases?: string[];       // Alternative command names
  category: string;         // Command category
  icon: IconDefinition;     // FontAwesome icon
  undo?: string;           // Undo command if applicable
};
```
