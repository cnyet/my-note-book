# Duralux UI 升级改造计划

> 创建日期：2026-02-25
> 分支：`feature/duralux-ui-upgrade`
> 参考网站：https://themewagon.github.io/Duralux-admin/analytics.html

---

## 已完成工作

### Phase 1: 设计令牌系统 (100% ✅)

**完成内容：**
- [x] 更新 `tailwind.config.js` 添加完整的 Duralux 颜色系统
  - Primary: `#696cff` (紫色主题)
  - Success: `#71dd37` (绿色)
  - Warning: `#ffab00` (橙色)
  - Danger: `#ff3e1d` (红色)
  - Info: `#03c3ec` (青色)
- [x] 添加 Duralux 阴影系统
  - `sneat-card-shadow`: 0 2px 6px rgba(67, 89, 113, 0.12)
  - `sneat-hover-shadow`: 0 4px 10px rgba(67, 89, 113, 0.15)
  - `sneat-dropdown-shadow`: 0 6px 12px rgba(67, 89, 113, 0.15)
- [x] 创建 `src/lib/constants/duralux-theme.ts`
  - 完整的 TypeScript 设计令牌定义
  - 包含颜色、阴影、圆角、间距、排版

**提交：** `c1b3ad2`

---

### Phase 2: 共享组件 (100% ✅)

**完成内容：**
- [x] `Breadcrumb.tsx` - 面包屑导航组件
  - 首页图标链接
  - Chevron 分隔符
  - 当前页面不可点击
  - 响应式文本截断
- [x] `DateRangePicker.tsx` - 日期范围选择器
  - 预设范围（今日、昨天、最近 7 天、最近 30 天等）
  - 日历面板
  - 月份导航
  - 暗色模式支持
- [x] 更新 `Header.tsx` 集成新组件
  - 面包屑导航行
  - 日期范围选择器
- [x] 安装 Shadcn Popover 组件

**提交：** `c1b3ad2`

---

### Phase 3: Dashboard 页面重制 (100% ✅)

**完成内容：**
- [x] 安装 Recharts 图表库
- [x] `EmailReports.tsx` - 邮件报告组件
  - 双柱状图（发送/打开）
  - 打开率统计
  - 使用 Recharts BarChart
- [x] `BrowserStates.tsx` - 浏览器状态组件
  - 5 种浏览器类型（Chrome、Safari、Firefox、Mobile、Tablet）
  - 进度条显示使用率
  - 图标 + 用户数显示
- [x] `GoalProgress.tsx` - 目标进度组件
  - 4 个目标类别
  - 圆形进度条（SVG）
  - 百分比显示
- [x] `ProjectReminders.tsx` - 项目提醒表格
  - Ant Design Table
  - 项目负责人头像
  - 团队标签
  - 状态标签（Completed/Pending/In Progress）
- [x] 更新 `/admin/page.tsx`
  - 集成所有新 Dashboard 组件
  - 响应式布局（Row/Col）

**提交：** `6b60761`

---

### Phase 4: 表格功能增强 (100% ✅)

**完成内容：**
- [x] `table-utils.ts` - 表格工具函数
  - `exportToCSV()` - 导出 CSV
  - `exportToExcel()` - 导出 Excel（带 BOM）
  - `createColumnToggleState()` - 列切换状态
  - `DENSITY_CONFIG` - 密度配置
- [x] `TableToolbar.tsx` - 表格工具栏组件
  - 密度控制（Compact/Normal/Spacious）
  - 列可见性切换
  - 导出为 CSV/Excel
  - Duralux 风格图标按钮

**提交：** `251bc95`

---

## 设计规范

### 颜色系统

```typescript
// 主色调
PRIMARY: '#696cff'      // 紫色
PRIMARY_DARK: '#5f61e6'
PRIMARY_LIGHT: '#7d80ff'

// 功能色
SUCCESS: '#71dd37'      // 绿色
WARNING: '#ffab00'      // 橙色
DANGER: '#ff3e1d'       // 红色
INFO: '#03c3ec'         // 青色

// 文本色
TEXT_PRIMARY: '#566a7f'
TEXT_SECONDARY: '#697a8d'
TEXT_MUTED: '#a1acb8'

// 背景色
BG_PAGE: '#f5f5f9'
BG_CARD: '#ffffff'
BG_HOVER: '#f8f7fa'
```

### 阴影系统

```typescript
CARD: '0 2px 6px 0 rgba(67, 89, 113, 0.12)'
HOVER: '0 4px 10px 0 rgba(67, 89, 113, 0.15)'
DROPDOWN: '0 6px 12px 0 rgba(67, 89, 113, 0.15)'
ACTIVE: '0 2px 4px rgba(105, 108, 255, 0.4)'
```

### 悬停效果

```css
.duralux-card-hover {
  transition: all 0.2s ease-in-out;
}
.duralux-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px 0 rgba(67, 89, 113, 0.15);
}
```

---

## 组件清单

### 已创建组件

| 组件 | 路径 | 状态 |
|------|------|------|
| Breadcrumb | `components/admin/shared/Breadcrumb.tsx` | ✅ |
| DateRangePicker | `components/admin/shared/DateRangePicker.tsx` | ✅ |
| TableToolbar | `components/admin/shared/TableToolbar.tsx` | ✅ |
| EmailReports | `components/admin/dashboard/EmailReports.tsx` | ✅ |
| BrowserStates | `components/admin/dashboard/BrowserStates.tsx` | ✅ |
| GoalProgress | `components/admin/dashboard/GoalProgress.tsx` | ✅ |
| ProjectReminders | `components/admin/dashboard/ProjectReminders.tsx` | ✅ |

### 已更新组件

| 组件 | 变更 |
|------|------|
| Header | 集成 Breadcrumb + DateRangePicker |
| Admin Dashboard Page | 添加 4 个新 Dashboard 组件 |
| tailwind.config.js | 添加 Duralux 颜色和阴影 |
| globals.css | 添加 Duralux 工具类 |

---

## 下一步建议

### 可选增强

1. **图表组件增强**
   - 创建 `StatCardChart.tsx` 使用 Recharts
   - 替换现有的 SVG 迷你图表
   - 添加更多图表类型（折线图、饼图）

2. **主题切换优化**
   - 添加主题切换动画
   - 保存用户主题偏好到 localStorage
   - 系统主题自动检测

3. **响应式优化**
   - Dashboard 卡片在小屏幕下的堆叠
   - 移动端菜单优化
   - 表格横向滚动

4. **性能优化**
   - Dashboard 数据懒加载
   - 图表数据缓存
   - 虚拟滚动大表格

---

## 测试清单

- [x] 构建验证 (`npm run build`)
- [ ] Dashboard 页面视觉测试
- [ ] 暗色模式测试
- [ ] 响应式布局测试
- [ ] 表格导出功能测试
- [ ] 日期选择器功能测试

---

## 分支信息

- **分支名称**: `feature/duralux-ui-upgrade`
- **当前提交**: `251bc95`
- **提交数量**: 3 (Phase 1-2, Phase 3, Phase 4)
- **状态**: 已完成 Phase 1-4，等待合并

---

## 参考资源

- [Duralux Admin Demo](https://themewagon.github.io/Duralux-admin/analytics.html)
- [Sneat Design System](https://themewagon.com/theme/sneat-free-bootstrap-5-admin-template/)
- [Recharts Documentation](https://recharts.org/)
- [Ant Design Table](https://ant.design/components/table)
- [Shadcn UI](https://ui.shadcn.com/)
