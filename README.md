# Alius Team Client

跨平台 Agent 管理客户端，用于管理、观察和控制 Alius 平台中的 Agent 节点与任务运行状态。

## 支持平台

### Desktop
- macOS (DMG 安装包)
- Windows (MSI 安装包)

### Tablet
- iPadOS
- Android Tablet

### Phone
- iOS
- Android

## 技术栈

- **Tauri 2** - 应用壳，跨平台打包
- **React 19** - UI 框架
- **TypeScript** - 类型系统
- **Tailwind CSS 4** - 样式系统
- **Radix UI** - 无障碍组件库
- **TanStack Query** - 服务端状态管理
- **Zustand** - 客户端状态管理
- **React Router v7** - 路由管理

## 响应式布局

项目实现了完整的 Adaptive App 设计规范：

### 断点定义
- **Phone**: `width < 768px`
- **Tablet**: `768px <= width < 1200px`
- **Desktop**: `width >= 1200px`

### 布局模式

#### Desktop / Tablet (三栏布局)
```
┌──────────────────────────────────────────────────────────┐
│ Top Bar                                                  │
├───────────────┬───────────────────────────┬──────────────┤
│ Sidebar       │ Main Workspace             │ Inspector    │
│ (240px)       │ (flex)                     │ (320px)      │
│               │                           │              │
│ Dashboard     │ Agents / Tasks / Logs      │ Detail       │
│ Agents        │ Settings                   │ Token Usage  │
│ Tasks         │                           │ Node Info    │
│ Logs          │                           │ Soul Lock    │
│ Settings      │                           │              │
└───────────────┴───────────────────────────┴──────────────┘
```

**特性：**
- Sidebar 可折叠（240px → 64px 图标模式）
- Inspector 可折叠（320px → 隐藏）
- 折叠状态持久化

#### Phone (折叠布局)
```
┌──────────────────────────────┐
│ Top Bar                      │
├──────────────────────────────┤
│ Main Content                 │
│                              │
│ Agent List / Task List       │
│ Agent Detail / Task Detail   │
│                              │
├──────────────────────────────┤
│ Bottom Navigation            │
└──────────────────────────────┘
```

**特性：**
- Sidebar → Drawer (滑出式导航)
- Inspector → Bottom Sheet (底部弹窗)
- 支持手势交互

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动 Tauri 开发模式 (需要 Rust 环境)
npm run tauri:dev
```

### 构建应用

```bash
# 构建前端
npm run build

# 构建 Tauri 应用 (所有格式)
npm run tauri:build

# 仅构建 MSI (Windows)
npm run tauri:build:msi

# 仅构建 DMG (macOS)
npm run tauri:build:dmg
```

## 项目结构

```
alius-team/
├── src/
│   ├── app/                    # 应用核心
│   │   ├── app.tsx            # 应用入口
│   │   ├── router.tsx         # 路由配置
│   │   └── providers.tsx      # 全局 Provider
│   │
│   ├── layouts/               # 布局组件
│   │   ├── desktop-tablet-layout.tsx
│   │   ├── phone-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── inspector.tsx
│   │   ├── bottom-navigation.tsx
│   │   └── drawer-navigation.tsx
│   │
│   ├── features/              # 功能模块
│   │   ├── auth/             # 认证
│   │   ├── dashboard/        # 仪表盘
│   │   ├── agents/           # Agent 管理
│   │   ├── tasks/            # Task 管理
│   │   ├── logs/             # 日志查看
│   │   └── settings/         # 设置
│   │
│   ├── design-system/         # 设计系统
│   │   ├── tokens/           # 设计 Token
│   │   ├── primitives/       # 基础组件
│   │   ├── components/       # 业务组件
│   │   └── layouts/          # 布局组件
│   │
│   ├── stores/               # Zustand 状态管理
│   ├── shared/               # 共享工具
│   │   ├── hooks/            # 自定义 Hooks
│   │   ├── utils/            # 工具函数
│   │   ├── constants/        # 常量定义
│   │   └── types/            # 类型定义
│   │
│   ├── data/                 # 数据层
│   │   ├── api-client/       # API 客户端
│   │   ├── realtime/         # WebSocket 客户端
│   │   ├── query/            # Query 配置
│   │   ├── dto/              # 数据传输对象
│   │   └── mappers/          # 数据映射
│   │
│   └── platform/             # 平台能力封装
│
├── src-tauri/                # Tauri 配置
│   ├── src/                  # Rust 代码
│   ├── capabilities/         # Tauri 权限配置
│   └── tauri.conf.json       # Tauri 配置
│
└── package.json
```

## 核心功能

### 已实现
- ✅ 响应式布局系统
- ✅ 断点检测和自动切换
- ✅ Sidebar 折叠/展开
- ✅ Inspector 折叠/展开
- ✅ Phone 设备 Drawer 导航
- ✅ Phone 设备 Bottom Sheet
- ✅ 布局状态持久化
- ✅ 路由系统
- ✅ 全局状态管理

### 待开发
- ⏳ 认证系统
- ⏳ Agent 管理功能
- ⏳ Task 管理功能
- ⏳ 实时通信
- ⏳ 日志系统
- ⏳ 设置功能

## 设计规范

项目遵循 Alius 设计规范，详见 [Alius Design Docs](https://alius.tech/zh/docs/design/)

## 许可证

Private - Alius Tech