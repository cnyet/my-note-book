# Tailwind CSS 动态类名问题

## 问题描述
在 `/Users/yet/ClaudeCode/sub-agents/frontend/src/app/(dashboard)/blog/[id]/page.tsx` 文件中，使用了模板字符串来动态生成 Tailwind CSS 类名，例如：

```typescript
className={`border-${colorName}-200/50`}
```

这种方法**不会工作**，因为 Tailwind CSS 在构建时需要静态分析所有类名。

## 为什么不工作？

Tailwind CSS 的工作原理：
1. 在构建时扫描所有源文件
2. 查找完整的类名字符串（如 `border-pink-200/50`）
3. 只为找到的类名生成 CSS

当你使用模板字符串时：
- Tailwind 看到的是 `border-${colorName}-200/50`
- 它不知道 `colorName` 的值是什么
- 因此不会生成对应的 CSS

## 正确的解决方案

### 方案 1：使用预定义的完整类名（推荐）

```typescript
const colorClasses = {
  pink: 'border-pink-200/50 dark:border-pink-800/30',
  blue: 'border-blue-200/50 dark:border-blue-800/30',
  green: 'border-green-200/50 dark:border-green-800/30',
  // ... 其他颜色
};

// 使用时
<h2 className={`flex items-center gap-4 ${colorClasses[colorName]}`}>
```

### 方案 2：使用内联样式

```typescript
<h2 
  className="flex items-center gap-4 border-b"
  style={{
    borderColor: `var(--${colorName}-200)`,
  }}
>
```

### 方案 3：使用 CSS 变量 + Tailwind

在全局 CSS 中定义：
```css
:root {
  --theme-primary: #ec4899; /* pink */
  --theme-secondary: #3b82f6; /* blue */
}
```

然后使用：
```typescript
<h2 className="border-[var(--theme-primary)]">
```

## 当前文件的问题

文件中有大量语法错误，因为模板字符串中的类名导致 JSX 解析器混淆。例如：

```typescript
// ❌ 错误
className={`group flex items-center gap-4 border-${colorName}-200/50`}

// ✅ 正确
className={`flex items-center gap-4 ${colors.border}`}
```

## 建议的修复步骤

1. **回退更改**（如果可能）
2. **使用方案 1**：创建完整的类名映射对象
3. **避免使用模板字符串动态生成类名**

## 参考资料

- [Tailwind CSS - Dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)
- [Tailwind CSS - Safelisting](https://tailwindcss.com/docs/content-configuration#safelisting-classes)
