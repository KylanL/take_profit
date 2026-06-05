# Deno Deploy 免费部署步骤

如果 Render 要求绑定信用卡，改用 Deno Deploy。

Deno Deploy 官方提供免费计划，可从 GitHub 部署项目。

## 1. 上传到 GitHub

把这些文件上传到 GitHub 仓库：

- `.gitignore`
- `README.md`
- `index.html`
- `server.js`
- `deno_server.js`
- `deno.json`
- `package.json`
- `render.yaml`
- `DEPLOY_DENO.md`
- `DEPLOY_RENDER.md`

## 2. 创建 Deno Deploy 项目

1. 打开 `https://dash.deno.com`
2. 用 GitHub 登录
3. 点击创建新项目
4. 选择你的 GitHub 仓库
5. Entrypoint 填：

```text
main.ts
```

6. 部署

## 3. 访问

部署完成后访问：

```text
https://你的项目名.deno.dev/index.html
```

## 说明

这个项目必须用 `main.ts` 部署，因为它需要 `/api/quote`、`/api/contracts`、`/api/best` 等服务端接口。
