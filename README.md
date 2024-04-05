# Ride-Tracer

## 注意事项

### 部分浏览器无法正常获取定位

目前已发现 Edge 浏览器在 `红米手机` 上无法获取定位，使用默认浏览器可以正常使用。

### 需要使用 https 才能获取精准定位

除了 `localhost(127.0.0.1)` 外，其它域名访问时都必须使用 https 访问，否则无法获取定位。

## 生产部署

[Remix build-and-run](https://remix.run/docs/en/main/start/quickstart#build-and-run)

由于本人实在太菜，没找到优雅的打包部署方式，使用的是非常笨比的部署方式。

首先把项目克隆到服务器。

之后将 [docker-compose(/deploy/app-prod/docker-compose.yaml)](/deploy/app-prod/docker-compose.yaml) 上传到服务器中。

提供环境变量[env-template.properties](deploy/env-template.properties).

之后手动生成数据库文件:

```bash
npx prisma db generate
# 可选
npx prisma db seed
```

修改完成后保存，使用如下指令启动:

```bash
docker-compose up -d
```