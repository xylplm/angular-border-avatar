import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {
  BorderAvatarComponent,
  BorderAvatarConfig,
} from 'angular-border-avatar';

// 预设配置常量类型
interface PresetConfig {
  key: string;
  name: string;
  avatarUrl: string;
  borderConfig: BorderAvatarConfig;
  size: string;
}

// 预设配置常量
const PRESET_CONFIGS: PresetConfig[] = [
  {
    key: 'preset1',
    name: 'preset.preset1',
    avatarUrl: 'assets/images/avatar/avatar1.jpg',
    borderConfig: {
      gifUrl: 'assets/images/gif/gif1.gif',
      avatarScale: 0.55,
      topOffsetRatio: 0.37,
      leftOffsetRatio: 0.21,
    },
    size: '150px',
  },
  {
    key: 'preset2',
    name: 'preset.preset2',
    avatarUrl: 'assets/images/avatar/avatar2.jpg',
    borderConfig: {
      gifUrl: 'assets/images/gif/gif2.gif',
      avatarScale: 0.60,
      topOffsetRatio: 0.20,
      leftOffsetRatio: 0.20,
      rotate: 0,
    },
    size: '150px',
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BorderAvatarComponent,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('borderFileInput') borderFileInput!: ElementRef;
  @ViewChild('avatarFileInput') avatarFileInput!: ElementRef;

  // 使用 Signal 管理状态
  currentLanguage = signal<'en' | 'zh'>(
    (localStorage.getItem('lang') as 'en' | 'zh') || 'en'
  );
  selectedPreset = signal<string>('preset1');
  debugMode = signal<boolean>(false);

  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private snackBar = inject(MatSnackBar);

  // 预设示例 - 从常量直接构建
  presetConfigs = Object.fromEntries(
    PRESET_CONFIGS.map((preset) => [
      preset.key,
      {
        name: preset.name,
        avatarUrl: preset.avatarUrl,
        borderConfig: preset.borderConfig,
        size: preset.size,
      },
    ])
  );

  // 调试参数
  avatarUrl = signal<string>(PRESET_CONFIGS[0].avatarUrl);
  borderGifUrl = signal<string>(PRESET_CONFIGS[0].borderConfig.gifUrl);
  avatarSize = signal<string>(PRESET_CONFIGS[0].size);

  borderConfig = signal<BorderAvatarConfig>(PRESET_CONFIGS[0].borderConfig);

  configJson = signal<string>(
    JSON.stringify(PRESET_CONFIGS[0].borderConfig, null, 2)
  );

  // 响应式表单
  quickParamsForm!: FormGroup;
  debugForm!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private translate = inject(TranslateService);

  constructor() {
    // 添加可用语言
    this.translate.addLangs(['en', 'zh']);
    // 设置默认语言
    this.translate.setDefaultLang('en');
    // 使用保存的语言
    this.translate.use(this.currentLanguage());
  }

  ngOnInit() {
    const config = this.borderConfig();

    // 初始化快速参数表单
    this.quickParamsForm = this.formBuilder.group({
      avatarScale: [config.avatarScale],
      topOffsetRatio: [config.topOffsetRatio],
      leftOffsetRatio: [config.leftOffsetRatio],
      rotate: [config.rotate || 0],
      borderRadius: [config.borderRadius || '50%'],
    });

    // 初始化调试表单
    this.debugForm = this.formBuilder.group({
      avatarUrl: [this.avatarUrl()],
      borderGifUrl: [this.borderGifUrl()],
      avatarSize: [this.avatarSize()],
      configJson: [this.configJson()],
    });

    // 订阅快速参数表单的值变化（添加防抖）
    this.quickParamsForm.valueChanges
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const newConfig: BorderAvatarConfig = {
          ...this.borderConfig(),
          avatarScale: parseFloat(value.avatarScale),
          topOffsetRatio: parseFloat(value.topOffsetRatio),
          leftOffsetRatio: parseFloat(value.leftOffsetRatio),
          rotate: parseFloat(value.rotate) || 0,
          borderRadius: value.borderRadius,
        };
        this.borderConfig.set(newConfig);
        this.updateConfigJson();
      });

    // 订阅调试表单的值变化（添加防抖）
    this.debugForm.valueChanges
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        // 忽略 configJson 的变化，防止循环更新
        if (value.configJson === this.configJson()) {
          return;
        }
        
        // 只更新实际改变的字段
        if (value.avatarUrl !== this.avatarUrl()) {
          this.avatarUrl.set(value.avatarUrl);
        }
        if (value.borderGifUrl !== this.borderGifUrl()) {
          this.borderGifUrl.set(value.borderGifUrl);
          // 同步 borderConfig 中的 gifUrl
          const newConfig = { ...this.borderConfig(), gifUrl: value.borderGifUrl };
          this.borderConfig.set(newConfig);
        }
        if (value.avatarSize !== this.avatarSize()) {
          this.avatarSize.set(value.avatarSize);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLanguage() {
    const newLang = this.currentLanguage() === 'en' ? 'zh' : 'en';
    this.currentLanguage.set(newLang);
    this.translate.use(newLang);
    localStorage.setItem('lang', newLang);
  }

  // 预设配置切换
  selectPreset(key: string) {
    this.selectedPreset.set(key);
    const preset = this.presetConfigs[key];
    if (preset) {
      // 只更新 borderConfig，表单会自动同步
      this.borderConfig.set({ ...preset.borderConfig });

      // 更新快速参数表单的值
      this.quickParamsForm.patchValue({
        avatarScale: preset.borderConfig.avatarScale,
        topOffsetRatio: preset.borderConfig.topOffsetRatio,
        leftOffsetRatio: preset.borderConfig.leftOffsetRatio,
        rotate: preset.borderConfig.rotate || 0,
        borderRadius: preset.borderConfig.borderRadius || '50%',
      });

      // 更新调试表单的值
      this.debugForm.patchValue({
        avatarUrl: preset.avatarUrl,
        borderGifUrl: preset.borderConfig.gifUrl,
        avatarSize: preset.size,
      });
      // updateConfigJson() 会被 quickParamsForm 变化触发，无需重复调用
    }
  }

  // 选择本地文件
  selectBorderFile() {
    this.borderFileInput.nativeElement.click();
  }

  selectAvatarFile() {
    this.avatarFileInput.nativeElement.click();
  }

  // 通用文件处理方法
  private handleFileSelected(file: File | null | undefined, formField: string) {
    if (!file) {
      return;
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      const msg = this.currentLanguage() === 'en' 
        ? 'Please select a valid image file' 
        : '请选择有效的图片文件';
      console.error(msg);
      return;
    }
    
    // 验证文件大小（限制为 5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const msg = this.currentLanguage() === 'en' 
        ? 'File size must be less than 5MB' 
        : '文件大小必须小于 5MB';
      console.error(msg);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.debugForm.patchValue({ [formField]: e.target.result });
      }
    };
    reader.onerror = () => {
      const msg = this.currentLanguage() === 'en' 
        ? 'Failed to read file' 
        : '读取文件失败';
      console.error(msg);
    };
    reader.readAsDataURL(file);
  }

  // 处理边框文件上传
  onBorderFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.handleFileSelected(file, 'borderGifUrl');
  }

  // 处理头像文件上传
  onAvatarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.handleFileSelected(file, 'avatarUrl');
  }

  // 更新配置JSON
  updateConfigJson() {
    const config = this.borderConfig();
    const jsonStr = JSON.stringify(config, null, 2);
    this.configJson.set(jsonStr);
    // 同步到表单
    this.debugForm.patchValue({ configJson: jsonStr }, { emitEvent: false });
  }

  // 从JSON导入配置
  importConfig() {
    try {
      const jsonValue = this.debugForm.get('configJson')?.value;
      if (!jsonValue || typeof jsonValue !== 'string') {
        throw new Error('JSON 内容为空或格式不正确');
      }
      
      const config = JSON.parse(jsonValue) as BorderAvatarConfig;
      
      // 验证必需字段
      if (!config.gifUrl || typeof config.avatarScale !== 'number' || 
          typeof config.topOffsetRatio !== 'number' || 
          typeof config.leftOffsetRatio !== 'number') {
        throw new Error('配置缺少必需字段');
      }
      
      this.borderConfig.set(config);

      // 同步快速参数表单
      this.quickParamsForm.patchValue({
        avatarScale: config.avatarScale,
        topOffsetRatio: config.topOffsetRatio,
        leftOffsetRatio: config.leftOffsetRatio,
        rotate: config.rotate || 0,
        borderRadius: config.borderRadius || '50%',
      }, { emitEvent: false });

      const message =
        this.currentLanguage() === 'en'
          ? 'Config imported successfully!'
          : '配置导入成功！';
      this.snackBar.open(message, 'OK', { duration: 3000 });
    } catch (e) {
      const message =
        this.currentLanguage() === 'en'
          ? `Import failed: ${e instanceof Error ? e.message : 'Unknown error'}`
          : `导入失败: ${e instanceof Error ? e.message : '未知错误'}`;
      this.snackBar.open(message, '关闭', { duration: 5000, panelClass: ['error-snackbar'] });
    }
  }

  // 复制配置到剪贴板
  copyConfig() {
    const configValue = this.debugForm.get('configJson')?.value;
    if (!configValue) {
      this.snackBar.open(
        this.currentLanguage() === 'en' ? 'No config to copy' : '没有配置要复制',
        '关闭',
        { duration: 3000, panelClass: ['warn-snackbar'] }
      );
      return;
    }
    navigator.clipboard.writeText(configValue).then(() => {
      const message =
        this.currentLanguage() === 'en'
          ? 'Config copied to clipboard!'
          : '已复制到剪贴板！';
      this.snackBar.open(message, 'OK', { duration: 3000, panelClass: ['success-snackbar'] });
    }).catch(() => {
      const message =
        this.currentLanguage() === 'en'
          ? 'Failed to copy config'
          : '复制失败';
      this.snackBar.open(message, '关闭', { duration: 3000, panelClass: ['error-snackbar'] });
    });
  }

  // 下载配置
  downloadConfig() {
    const configValue = this.debugForm.get('configJson')?.value;
    if (!configValue) {
      this.snackBar.open(
        this.currentLanguage() === 'en' ? 'No config to download' : '没有配置要下载',
        '关闭',
        { duration: 3000, panelClass: ['warn-snackbar'] }
      );
      return;
    }
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(configValue)
    );
    element.setAttribute('download', 'border-avatar-config.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    const message =
      this.currentLanguage() === 'en'
        ? 'Config download started!'
        : '配置下载已开始！';
    this.snackBar.open(message, 'OK', { duration: 3000, panelClass: ['success-snackbar'] });
  }
}
