---
title: 编译自带 Drcom 的 OpenWrt 固件
date: 2016-10-12 14:03:19 +0800
tags: [OpenWrt, 网络]
toc: true
---

感谢：

- [Image Generator (Image Builder) - EN [OpenWrt Wiki]](https://wiki.openwrt.org/doc/howto/obtain.firmware.generate)
- [OpenWrt Downloads - 中科大镜像](http://openwrt.proxy.ustclug.org/)

本文假定使用的路由器：GL-iNet 6416A v1，使用的 CPU：ar71xx/generic；OpenWrt：15.05.1；Drcom：5.2.1(p)。

## 获取 Image Builder

```bash
cd ~
mkdir openwrt && cd openwrt
wget http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/OpenWrt-ImageBuilder-15.05.1-ar71xx-generic.Linux-x86_64.tar.bz2
```

## 修改 repositories.conf

修改 repositories.conf 如下

```
src/gz chaos_calmer_base http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/base
src/gz chaos_calmer_luci http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/luci
src/gz chaos_calmer_management http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/management
src/gz chaos_calmer_packages http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/packages
src/gz chaos_calmer_routing http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/routing
src/gz chaos_calmer_telephony http://openwrt.proxy.ustclug.org/chaos_calmer/15.05.1/ar71xx/generic/packages/telephony
src imagebuilder file:packages
```

## 安装 make 的依赖

Debian/Ubuntu

```bash
apt-get install subversion build-essential libncurses5-dev zlib1g-dev gawk git ccache gettext libssl-dev xsltproc wget
```

CentOS/RHEL

```bash
yum install subversion git gawk gettext ncurses-devel zlib-devel openssl-devel libxslt wget
yum group install "Development Tools"
```

## 修改 Makefile

``` Makefile
	$(OPKG) update || true; \
	fi
	$(MAKE) package_install
	# 添加以下 1 行，注意缩进，用 tab
	sed -i '/proto_run_command/i username=`echo -e "$$username"`' "$(TARGET_DIR)/lib/netifd/proto/ppp.sh"
ifneq ($(USER_FILES),)
	$(MAKE) copy_files
endif
```

不明白为什么要这样做的同学，请先看 [Drcom 折腾记录](/2016/10/08/drcom/)。

## 配置文件的准备

新建一个 `files` 目录，将所需的文件放在相应目录，以制作带有自定义文件的固件。

Drcom 认证需要的文件（可以从 [Drcom 折腾记录](/2016/10/08/drcom/) 获取）：

```
files/
├── etc/
│   ├── drcom.conf
│   └── hotplug.d/
│       └── iface/
│           └── 99-drcom
└── usr/
    └── bin/
        └── drcom
```

可以用 `scp` 备份其它配置文件：

``` bash
mkdir -p files/etc/config
scp root@192.168.1.1:"/etc/config/network /etc/config/luci /etc/config/wireless /etc/config/firewall" files/etc/config/
scp root@192.168.1.1:"/etc/sysupgrade.conf" files/etc/
```

也可以登录 luci，系统 -> 备份 / 升级 -> 生成备份，获得配置文件的压缩包。

## 编译固件

语法：

``` bash
make image PROFILE=XXX PACKAGES="pkg1 pkg2 pkg3 -pkg4 -pkg5 -pkg6" FILES=files/
```

- PROFILE：含有要编译的型号的配置；通过执行 `make info`，查看可用的选项。
- PACKAGES：要编译进固件的包
- FILES：包含要添加到固件的文件的文件夹

现在执行下面的命令的可以编译出自带 Drcom 的固件。

``` bash
make image PROFILE="GLINET" PACKAGES="luci luci-i18n-base-zh-cn python-light python-logging python-openssl python-codecs" FILES=files/
```

所得固件在 `bin/ar71xx`。
