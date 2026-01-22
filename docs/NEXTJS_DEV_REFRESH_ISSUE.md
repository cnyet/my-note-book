# Next.js 16 开发模式刷新问题

## 问题描述
在 Next.js 16 开发模式下，页面刷新时会出现大量 404 错误，导致页面卡在"加载中..."状态。

## 根本原因
- Next.js 16 (Turbopack/webpack) 每次编译都会生成新的文件哈希值
- 浏览器缓存了旧的 HTML 文件，其中包含旧的 JS 文件路径
- 刷新时浏览器请求不存在的旧文件，导致 404 错误

## 解决方案

### 方案 1：使用硬刷新（推荐）
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### 方案 2：禁用浏览器缓存（开发时）
1. 打开 Chrome DevTools (`F12` 或 `Cmd/Ctrl + Option/Alt + I`)
2. 进入 **Network** 标签
3. 勾选 **"Disable cache"**
4. 保持 DevTools 打开状态

### 方案 3：使用 webpack 模式
已配置在 `package.json` 中：
```bash
npm run dev        # 使用 webpack 模式
npm run dev:turbo  # 使用 Turbopack 模式
```

## 配置说明

### package.json
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "dev:turbo": "next dev"
  }
}
```

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

## 注意事项
- 这是 Next.js 16 的已知问题
- 生产环境不受影响
- 建议在开发时保持 DevTools 打开并禁用缓存
- 如果问题持续，可以考虑降级到 Next.js 15

## 相关链接
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)
