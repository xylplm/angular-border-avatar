# Angular Border Avatar

<div align="center">
  <img src="https://raw.githubusercontent.com/xylplm/angular-border-avatar/master/src/assets/logo.png" alt="Angular Border Avatar" width="200">
</div>

**[🎨 Live Demo](https://xylplm.github.io/angular-border-avatar/)**

A lightweight Angular component for creating beautiful animated avatar borders with GIF support.

[![npm version](https://img.shields.io/npm/v/@luoxiao123/angular-border-avatar.svg?style=flat-square)](https://www.npmjs.com/package/@luoxiao123/angular-border-avatar)
[![license](https://img.shields.io/npm/l/@luoxiao123/angular-border-avatar.svg?style=flat-square)]()
[![downloads](https://img.shields.io/npm/dm/@luoxiao123/angular-border-avatar?style=flat-square)]()
[![GitHub stars](https://img.shields.io/github/stars/xylplm/angular-border-avatar.svg?style=flat-square)](https://github.com/xylplm/angular-border-avatar)
[![demo](https://img.shields.io/badge/demo-online-brightgreen?style=flat-square)](https://xylplm.github.io/angular-border-avatar/)

English | [中文](README.zh.md)

## ✨ Features

- 🎨 **GIF Border Support** - Support any GIF as avatar border
- 🎯 **Highly Customizable** - Full control over size, position, and rotation
- 📱 **Responsive Design** - Adapts to any screen size
- ⚡ **Lightweight** - Minimal dependencies, fast loading
- ♿ **Accessible** - Full ARIA support
- 🔄 **Standalone** - Angular Standalone component support

## 📦 Installation

```bash
npm install @luoxiao123/angular-border-avatar
```

## 🚀 Quick Start

```typescript
import { Component } from '@angular/core';
import { BorderAvatarComponent, BorderAvatarConfig } from '@luoxiao123/angular-border-avatar';

@Component({
  selector: 'app-root',
  template: `
    <angular-border-avatar
      [avatarUrl]="avatarUrl"
      [borderConfig]="borderConfig"
      size="120px"
    ></angular-border-avatar>
  `,
  imports: [BorderAvatarComponent],
  standalone: true,
})
export class AppComponent {
  avatarUrl = 'https://api.dicebear.com/9.x/avataaars/svg?seed=user1';
  
  borderConfig: BorderAvatarConfig = {
    gifUrl: 'https://example.com/border.gif',
    avatarScale: 0.7,              // Avatar occupies 70% of container
    topOffsetRatio: 0.15,          // 15% of container height from top
    leftOffsetRatio: 0.15,         // 15% of container width from left
    borderRadius: '50%',            // Circle shape
    rotate: 0,                      // Rotation angle in degrees
  };
}
```

## 📋 Component API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `avatarUrl` | `string` | `''` | **Required** - Avatar image URL |
| `borderConfig` | `BorderAvatarConfig` | - | **Required** - Border configuration |
| `size` | `string` | `'120px'` | Container size (px, rem, %, vw, etc.) |
| `altText` | `string` | `'Avatar'` | Image alt text |
| `clickable` | `boolean` | `false` | Whether avatar is clickable |
| `lazyLoad` | `boolean` | `true` | Enable lazy loading |
| `defaultImageUrl` | `string` | SVG placeholder | Default image when loading fails |

### BorderAvatarConfig

```typescript
interface BorderAvatarConfig {
  gifUrl: string;           // Border GIF URL (required)
  avatarScale: number;      // Avatar scale ratio (0.3-0.9)
  topOffsetRatio: number;   // Vertical offset ratio (-0.2~0.2)
  leftOffsetRatio: number;  // Horizontal offset ratio (-0.2~0.2)
  borderRadius?: string;    // Border radius (default: '50%')
  rotate?: number;          // Rotation angle (default: 0)
}
```

### Events

| Event | Type | Description |
|-------|------|-------------|
| `imageLoad` | `EventEmitter<void>` | Emitted when avatar image loads |
| `imageError` | `EventEmitter<string>` | Emitted when image fails to load |
| `avatarClick` | `EventEmitter<MouseEvent>` | Emitted when avatar is clicked |

### Methods

| Method | Description |
|--------|-------------|
| `recalculate()` | Recalculate dimensions when container size changes |

## 💡 Usage Examples

### Basic Usage

```html
<angular-border-avatar
  [avatarUrl]="'https://example.com/avatar.jpg'"
  [borderConfig]="borderConfig"
  size="120px"
></angular-border-avatar>
```

### Clickable Avatar

```html
<angular-border-avatar
  [avatarUrl]="avatarUrl"
  [borderConfig]="borderConfig"
  [clickable]="true"
  (avatarClick)="onAvatarClick($event)"
  (imageError)="onImageError($event)"
></angular-border-avatar>
```

```typescript
onAvatarClick(event: MouseEvent) {
  console.log('Avatar clicked!', event);
}

onImageError(error: string) {
  console.error('Failed to load image:', error);
}
```

### Responsive Sizing

```html
<div [style.width]="containerWidth + 'px'">
  <angular-border-avatar
    #avatar
    [avatarUrl]="avatarUrl"
    [borderConfig]="borderConfig"
    [size]="'100%'"
  ></angular-border-avatar>
</div>
```

```typescript
import { ViewChild } from '@angular/core';
import { BorderAvatarComponent } from '@luoxiao123/angular-border-avatar';

export class MyComponent {
  @ViewChild(BorderAvatarComponent) avatar!: BorderAvatarComponent;

  changeDimensions() {
    // When container size changes, call recalculate method
    this.avatar.recalculate();
  }
}
```

### Configuration Presets

#### Circle Avatar (Recommended)

```typescript
const circleConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/border.gif',
  avatarScale: 0.7,
  topOffsetRatio: 0.15,
  leftOffsetRatio: 0.15,
  borderRadius: '50%',
};
```

#### Square Avatar

```typescript
const squareConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/border.gif',
  avatarScale: 0.75,
  topOffsetRatio: 0.125,
  leftOffsetRatio: 0.125,
  borderRadius: '10px',
};
```

#### Rotating Border

```typescript
const rotatingConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/border.gif',
  avatarScale: 0.65,
  topOffsetRatio: 0.175,
  leftOffsetRatio: 0.175,
  borderRadius: '50%',
  rotate: 45,
};
```

## 🎨 Configuration Tips

### Size Calculation Formula

```
Avatar Size = Container Size × avatarScale
Top Offset = Container Height × topOffsetRatio
Left Offset = Container Width × leftOffsetRatio
```

### Best Practices

1. **avatarScale**: Set between 0.6-0.8 for optimal appearance
2. **Offset Ratios**: Keep within ±0.2 range to control avatar position
3. **borderRadius**: Match the avatar shape (50% for circle, other values for rectangle)
4. **GIF Size**: Keep GIF file size under 1MB for better performance

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

If you have any questions, please open an issue on [GitHub Issues](https://github.com/xylplm/angular-border-avatar/issues).

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[English](README.md) | [中文](README.zh.md)