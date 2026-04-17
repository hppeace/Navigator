# 领航工作站工作台

面向“ 一人一策 ”场景的成员档案工作台。项目将基本信息、成长轨迹、思想动态、问题与建议整合到一个可录入、可追踪、可归档的统一界面中，适合本地演示、原型验证和单机部署。

## 功能概览

- 成员档案库：支持搜索、切换、新建和保存成员档案
- 基本信息：维护身份信息、联系方式、家庭情况和头像
- 成长轨迹：记录活动参与、关键表现和职业发展
- 思想动态：维护三级联系人、思想培养进展和谈心谈话
- 问题与建议：统一收集问题、建议、附件和跟进状态
- 附件上传：上传后的文件保存在 `public/uploads`

## 技术栈

- Next.js 16 App Router
- React 19
- shadcn/ui + Tailwind CSS v4
- Prisma 7 + SQLite
- 本地文件上传 API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

项目默认使用 SQLite，本地 `.env` 至少需要包含：

```bash
DATABASE_URL="file:./dev.db"
```

### 3. 初始化数据库

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

说明：

- `db:generate` 生成 Prisma Client 到 `src/generated/prisma`
- `db:push` 根据 schema 创建或更新本地 SQLite 数据库
- `db:seed` 写入两条演示成员数据

### 4. 启动开发环境

```bash
npm run dev
```

默认访问 `http://localhost:3000`。如果 3000 端口被占用，Next.js 会自动切换到其他端口。

## 常用脚本

- `npm run dev`：启动开发服务器
- `npm run lint`：运行 ESLint
- `npm run build`：构建生产版本
- `npm run db:generate`：生成 Prisma Client
- `npm run db:push`：同步 Prisma schema 到 SQLite
- `npm run db:seed`：写入演示数据

## 目录结构

- `src/app`：页面、布局和 API 路由
- `src/components/navigator`：工作台业务组件
- `src/lib/navigator-data.ts`：表单校验、数据转换和保存逻辑
- `prisma/schema.prisma`：数据库模型定义
- `prisma/seed.ts`：演示数据脚本
- `public/uploads`：演示附件和本地上传文件目录

## 数据与部署说明

- 数据库文件默认是项目根目录下的 `dev.db`
- 上传文件直接写入 `public/uploads`
- 当前实现更适合本地运行或单机部署
- 如果要部署到多实例或云环境，建议把 SQLite 和本地上传替换为独立数据库与对象存储
