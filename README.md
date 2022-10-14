# create-rollup-pkg

[![npm](https://img.shields.io/npm/v/create-rollup-pkg.svg)](https://www.npmjs.com/package/create-rollup-pkg)

![](https://limy-1309594960.cos.ap-beijing.myqcloud.com/202210141843279.gif)

基于 rollup 的组件打包模版

## Usage

#### npx

```bash
npx create-rollup-pkg <pkg-name>
```

#### npm

```bash
npm init rollup-pkg <pkg-name>
```

####

```bash
yarn create rollup-pkg <pkg-name>
```

## npm scripts

```bash
# 执行 rollup 打包，并监听文件变化，动态同步
yarn dev

# 清除 dist 文件夹，并重新打包
yarn build

# 版本号自增 (例如：1.0.0 => 1.0.1-0), 并发布到 beta 分支
yarn pub:beta

# 版本号自增并发布到 leastest 分支
yarn pub
```
