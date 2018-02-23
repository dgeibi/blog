---
title: 解决 Hash Sum mismatch 错误
tags: [Linux]
date: 2015-12-02 14:00:40 +0800
---

清除缓存 `sudo apt-get clean`

使用 HTTPS 的软件源：修改 `/etc/apt/sources.list` 中的网址成

`https://mirrors.ustc.edu.cn/ubuntu`，执行 `sudo apt-get update`

也可以使用代理

```bash
sudo apt-get -o Acquire::http::proxy='http://yourproxyaddress:proxyport/' update
```

或者

```bash
sudo vim /etc/apt/apt.conf
-----
Acquire::http::Proxy "http://yourproxyaddress:proxyport";
-----
sudo apt-get update
```
