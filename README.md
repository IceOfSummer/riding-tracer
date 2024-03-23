# Ride-Tracer

## 注意事项

### 部分浏览器无法正常获取定位

目前已发现 Edge 浏览器在 `红米手机` 上无法获取定位，使用默认浏览器可以正常使用。

### 需要使用 https 才能获取精准定位

除了 `localhost(127.0.0.1)` 外，其它域名访问时都必须使用 https 访问，否则无法获取定位。

## 生产部署

[Remix build-and-run](https://remix.run/docs/en/main/start/quickstart#build-and-run)

首先打包：`npx remix vite:build`，打包完成后会产生一个`build`目录。

将至少如下文件复制到服务器上(除了`node_modules`)：

```text
riding-tracer
├── build
│   └── ...
├── package.json
└── node_modules
```

之后将 [docker-compose(/deploy/app-prod/docker-compose.yaml)](/deploy/app-prod/docker-compose.yaml) 上传到服务器中。

修改如下内容/属性：
- `volume`: 文件挂载路径
- `APP_KEY`: 环境变量，高德地图 `APP_KEY`
- `APP_SECRET`: 环境变量，高德地图 `APP_SECRET`

修改完成后保存，使用如下指令启动:

```bash
docker-compose up -d
```