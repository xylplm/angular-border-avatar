import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BorderAvatarConfig {
  gifUrl: string; // 边框GIF地址
  avatarScale: number; // 头像缩放比例 0.3-0.9
  topOffsetRatio: number; // 垂直偏移比例 -0.2~0.2
  leftOffsetRatio: number; // 水平偏移比例 -0.2~0.2
  borderRadius?: string; // 圆角
  rotate?: number; // 旋转角度
}

@Component({
  selector: 'angular-border-avatar',
  templateUrl: './border-avatar.component.html',
  styleUrls: ['./border-avatar.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BorderAvatarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('avatarContainer') containerRef!: ElementRef<HTMLDivElement>;

  // 使用 input() 函数来定义 borderConfig
  borderConfig = input<BorderAvatarConfig>({
    gifUrl: '',
    avatarScale: 1,
    topOffsetRatio: 0,
    leftOffsetRatio: 0,
  });

  // 其他输入属性使用 input() 函数
  avatarUrl = input<string>('');
  defaultImageUrl = input<string>('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E');
  size = input<string>('120px');
  altText = input<string>('Avatar');
  clickable = input<boolean>(false);
  lazyLoad = input<boolean>(true);

  // 事件
  @Output() avatarClick = new EventEmitter<MouseEvent>();
  @Output() imageLoad = new EventEmitter<void>();
  @Output() imageError = new EventEmitter<string>();

  // 使用 Signal 管理计算值
  avatarSize = signal<number>(0);
  topOffset = signal<number>(0);
  leftOffset = signal<number>(0);
  containerWidth = signal<number>(0);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);

  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: number;

  constructor(private cdr: ChangeDetectorRef) {
    // 监听 borderConfig 变化并重新计算尺寸
    effect(() => {
      this.borderConfig();
      this.calculateDimensions();
    });
  }

  ngAfterViewInit() {
    // 使用 ResizeObserver 监听容器变化
    if (this.containerRef) {
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => {
          this.calculateDimensions();
        }, 150);
      });
      this.resizeObserver.observe(this.containerRef.nativeElement);
      // 触发初始计算
      this.calculateDimensions();
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  // 核心：按比例计算所有尺寸
  calculateDimensions() {
    const container = this.containerRef?.nativeElement;
    if (!container || !this.borderConfig()) {
      return;
    }

    const config = this.borderConfig();
    const width = container.clientWidth || parseInt(this.size());
    
    if (width <= 0) {
      return;
    }

    this.containerWidth.set(width);

    // 按比例计算
    const newAvatarSize = Math.round(width * config.avatarScale);
    const newTopOffset = Math.round(width * config.topOffsetRatio);
    const newLeftOffset = Math.round(width * config.leftOffsetRatio);

    this.avatarSize.set(newAvatarSize);
    this.topOffset.set(newTopOffset);
    this.leftOffset.set(newLeftOffset);
  }

  // 获取头像样式
  getAvatarStyle() {
    const config = this.borderConfig();
    const transform = config?.rotate ? `rotate(${config.rotate}deg)` : 'none';

    const style = {
      width: `${this.avatarSize()}px`,
      height: `${this.avatarSize()}px`,
      top: `${this.topOffset()}px`,
      left: `${this.leftOffset()}px`,
      transform: transform,
      borderRadius: config?.borderRadius || '50%',
      display: 'block',
    };
    return style;
  }

  // 获取边框样式
  getBorderStyle() {
    const config = this.borderConfig();
    return {
      backgroundImage: config ? `url('${config.gifUrl}')` : 'none',
    };
  }

  // 点击事件
  onClick(event: Event) {
    if (this.clickable()) {
      // 允许键盘点击
      if (event instanceof KeyboardEvent) {
        event.preventDefault();
      }
      this.avatarClick.emit(event as MouseEvent);
    }
  }

  // 图片加载完成
  onImageLoad() {
    this.isLoading.set(false);
    this.imageLoad.emit();
    this.cdr.markForCheck();
  }

  // 图片加载失败
  onImageError() {
    this.isLoading.set(false);
    this.hasError.set(true);
    this.cdr.markForCheck();
  }

  // 重新计算（供父组件调用）
  recalculate() {
    this.calculateDimensions();
  }
}
