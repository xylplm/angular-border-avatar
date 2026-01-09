# Angular 边框头像

<div align="center">
  <img src="https://raw.githubusercontent.com/xylplm/angular-border-avatar/main/src/assets/logo.png" alt="Angular Border Avatar" width="200">
</div>

一个轻量级的 Angular 组件，用于创建带有动画 GIF 边框的头像。

[![npm version](https://img.shields.io/npm/v/@luoxiao123/angular-border-avatar.svg?style=flat-square)](https://www.npmjs.com/package/@luoxiao123/angular-border-avatar)
[![license](https://img.shields.io/npm/l/@luoxiao123/angular-border-avatar.svg?style=flat-square)]()
[![downloads](https://img.shields.io/npm/dm/@luoxiao123/angular-border-avatar?style=flat-square)]()
[![GitHub stars](https://img.shields.io/github/stars/xylplm/angular-border-avatar.svg?style=flat-square)](https://github.com/xylplm/angular-border-avatar)

[English](README.md) | 中文

## ✨ 功能特性

- 🎨 **GIF 边框支持** - 支持任何 GIF 作为头像边框
- 🎯 **高度可定制** - 完全控制大小、位置和旋转
- 📱 **响应式设计** - 自适应各种屏幕尺寸
- ⚡ **轻量级** - 最小化依赖，快速加载
- ♿ **无障碍** - 完全支持 ARIA 标签
- 🔄 **Standalone** - 支持 Angular Standalone 组件

## 📦 安装

```bash
npm install @luoxiao123/angular-border-avatar
```

## 🚀 快速开始

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
    avatarScale: 0.7,           // 头像占容器的 70%
    topOffsetRatio: 0.15,       // 距顶部 15% 的容器高度
    leftOffsetRatio: 0.15,      // 距左边 15% 的容器宽度
    borderRadius: '50%',         // 圆形
  };
}
```

## 📋 组件 API

### 输入属性 (Inputs)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `avatarUrl` | `string` | - | **必需** - 头像图片 URL |
| `borderConfig` | `BorderAvatarConfig` | - | **必需** - 边框配置 |
| `size` | `string` | `'120px'` | 容器大小（支持 px, rem, %, vw 等） |
| `altText` | `string` | `'Avatar'` | 图片 alt 文本 |
| `clickable` | `boolean` | `false` | 是否可点击 |
| `showDebug` | `boolean` | `false` | 是否显示调试信息 |
| `lazyLoad` | `boolean` | `true` | 是否启用懒加载 |

### 边框配置 (BorderAvatarConfig)

```typescript
interface BorderAvatarConfig {
  gifUrl: string;           // 边框 GIF 地址
  avatarScale: number;      // 头像缩放比例 (0.3-0.9)
  topOffsetRatio: number;   // 垂直偏移比例 (-0.2~0.2)
  leftOffsetRatio: number;  // 水平偏移比例 (-0.2~0.2)
  borderRadius?: string;    // 圆角 (默认: '50%')
  rotate?: number;          // 旋转角度 (默认: 0)
}
```

### 输出事件 (Outputs)

| 事件 | 类型 | 说明 |
|------|------|------|
| `imageLoad` | `EventEmitter<void>` | 头像图片加载完成 |
| `imageError` | `EventEmitter<string>` | 头像图片加载失败 |
| `avatarClick` | `EventEmitter<MouseEvent>` | 头像被点击（需要 `clickable: true`） |

### 方法 (Methods)

| 方法 | 说明 |
|------|------|
| `recalculate()` | 重新计算尺寸和位置（动态改变大小时使用） |

## 💡 使用示例

### 基础使用

```typescript
<angular-border-avatar
  [avatarUrl]="'https://example.com/avatar.jpg'"
  [borderConfig]="borderConfig"
  size="120px"
></angular-border-avatar>
```

### 可点击的头像

```typescript
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
  console.log('头像被点击!', event);
}

onImageError(error: string) {
  console.log('图片加载失败:', error);
}
```

### 动态大小调整

```typescript
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
    // 当容器大小改变时，调用 recalculate 方法
    this.avatar.recalculate();
  }
}
```

### 多种样式示例

```typescript
// 圆形头像
const circleConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/circle-border.gif',
  avatarScale: 0.7,
  topOffsetRatio: 0.15,
  leftOffsetRatio: 0.15,
  borderRadius: '50%',
};

// 方形头像
const squareConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/square-border.gif',
  avatarScale: 0.75,
  topOffsetRatio: 0.125,
  leftOffsetRatio: 0.125,
  borderRadius: '10%',
};

// 旋转边框
const rotatingConfig: BorderAvatarConfig = {
  gifUrl: 'https://example.com/rotating-border.gif',
  avatarScale: 0.65,
  topOffsetRatio: 0.175,
  leftOffsetRatio: 0.175,
  borderRadius: '50%',
  rotate: 45,
};
```

## 🎯 配置建议

### 尺寸计算公式

```
头像实际大小 = 容器大小 × avatarScale
垂直偏移 = 容器高度 × topOffsetRatio
水平偏移 = 容器宽度 × leftOffsetRatio
```

### 最佳实践

1. **avatarScale**: 建议 0.6-0.8 之间，太小会显示不全，太大会被边框遮挡
2. **偏移比例**: 建议在 ±0.2 之间，控制头像在边框中的位置
3. **borderRadius**: 与头像形状保持一致（圆形用 50%，方形用其他值）
4. **GIF 性能**: 使用较小的 GIF 文件以优化加载性能

## 🌐 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 获得帮助

如有问题，请在 [GitHub Issues](https://github.com/xylplm/angular-border-avatar/issues) 中提出。

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[English](https://github.com/xylplm/angular-tabler-icons) | [中文](https://github.com/xylplm/angular-tabler-icons/blob/master/README.zh.md)

## 📚 目录

- [简介](#简介)
- [安装](#安装)
