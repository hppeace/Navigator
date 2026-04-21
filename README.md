# 领航工作站工作台

面向"一人一策"场景的成员档案工作台。整合基本信息、成长轨迹、思想动态与问题建议，支持多成员管理和登录认证。

## 功能

- 成员档案管理（新建、编辑、搜索）
- 基本信息、成长轨迹、思想动态、问题建议
- 用户登录认证（管理员/普通用户）
- 附件上传

## 技术栈

Next.js 16 + React 19 + Prisma 7 + SQLite + shadcn/ui + Tailwind CSS v4

## 快速开始

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

访问 `http://localhost:3000`

**初始账户：**
| 工号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 管理员 |
| LH2026001 | LH2026001 | 用户 |

## 常用脚本

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run lint       # ESLint
npm run db:generate  # 生成 Prisma Client
npm run db:push    # 同步数据库
npm run db:seed    # 写入演示数据
```

## 部署

### 环境变量

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="你的随机字符串"  # openssl rand -base64 32
```

### 注意事项

- 使用 `openssl rand -base64 32` 生成新的 `AUTH_SECRET`
- 正式部署建议换用 PostgreSQL/MySQL
- 文件上传默认保存在 `public/uploads`，多实例部署需换用对象存储
