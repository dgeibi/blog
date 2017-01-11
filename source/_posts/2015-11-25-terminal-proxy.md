---
title: 设置终端下的代理
date: 2015-11-25 13:33:40 +0800
tags: [Linux, 网络]
toc: true
---

## 参考

* [如何为 Git 设置代理？](http://segmentfault.com/q/1010000000118837/a-1020000000132541)
* [Proxy settings - ArchWiki](https://wiki.archlinux.org/index.php/Proxy_settings)
* [connect-proxy manpages](http://manpages.ubuntu.com/manpages/natty/man1/connect-proxy.1.html)
* [HTTP tunneling - ArchWiki](https://wiki.archlinux.org/index.php/HTTP_tunneling)

## 安装 [Connect](https://bitbucket.org/gotoh/connect/wiki/Home)

``` sh
#ubuntu
sudo apt-get install connect-proxy
#archlinux
yaourt -S connect # https://aur.archlinux.org/packages/connect
```

## HTTP 的配置

``` sh
vi ~/.bashrc
#添加以下内容
export http_proxy=http://127.0.0.1:7070/
export https_proxy=$http_proxy
export ftp_proxy=$http_proxy
```

## git 协议的配置

``` sh
sudo vi /usr/bin/gitproxy.sh
-----
#!/bin/bash
connect -H 127.0.0.1:7070 $*
```

`-H` 表示 HTTP，将 `-H` 改成 `-S` 可以用 SOCKS5 协议

``` sh
sudo chmod +x /usr/bin/gitproxy.sh
git config --global core.gitproxy 'gitproxy.sh for kernel.org'
```

`for kernel.org` 表示只有那个域名需要代理，当然可以不加 `for *`

## SSH 的配置

``` sh
vi ~/.ssh/config
-----
##not using proxy on lan
#Host 192.*
#    ProxyCommand connect-proxy %h %p
Host github.com
    User git
    ProxyCommand connect -H 127.0.0.1:7070 %h %p
```

除了 Connect 还有很多其他的选择，如 corscrew (仅支持 HTTP 代理)

将下列命令替换到上述相应位置即可

``` sh
#git
corkscrew 127.0.0.1 7070 $*
#SSH
ProxyCommand corkscrew 127.0.0.1 7070 %h %p
```
