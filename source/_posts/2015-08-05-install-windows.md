---
title: 硬盘干净安装 Windows
date: 2015-08-05 16:38:38 +0800
tags: Windows
toc: true
---

## 备份 C 盘的重要文件

重要文件：文档、代码等舍不得删的东西。

`Program Files` 里的文件不用备份啊，最多备份安装程序或者绿色软件及可以确定的程序数据。

## 确定系统的启动方式

按 Win+R 打开运行，输入 `msinfo32`，回车查看系统信息。在 “BIOS 模式” 中如果显示 “传统”，表示系统启动方式为 Legacy BIOS；如果显示 “UEFI”，则系统启动方式为 UEFI。

注：此方法适用于 Win8 及更高版本系统。

其它方法见 [UEFI 还是 Legacy BIOS？如何确定 Windows 启动类型](http://wap.ithome.com/html/146588.htm)

## 下载

已通过微软官方渠道升级到 Win10 并确保激活的用户，可以免密钥安装相同版本的 Win10，联网可自动激活，所以要下载相同版本的 Win10 镜像。

> 查看已安装 Win10 的版本
>
1. 鼠标右键点击 “开始按钮” 或者按 Win+X 快捷键。
2. 点击 “系统”。
3. Windows 版本处即为当前 Win10 的版本。

Win10 主要有家庭版、专业版、家庭中文版，“Windows 10 家庭中文版” 和 “Windows 10 家庭版” 是不同版本。

下载 Windows 10 光盘映像：[https://www.microsoft.com/zh-cn/software-download/windows10ISO/](https://www.microsoft.com/zh-cn/software-download/windows10ISO/)

也可以在 [MSDN，我告诉你](http://msdn.itellyou.cn/) 获取其它系统的下载地址。

如果系统启动方式为 Legacy BIOS，就需要下载、安装 [EasyBCD](https://pan.baidu.com/s/1hsmEhSS)。

## 解压镜像文件

### 启动方式为 Legacy BIOS

将准备好的系统镜像解压至一非系统分区 (非 C 盘) 的 **[根目录](http://baike.sogou.com/v305005.htm?fromTitle=%E6%A0%B9%E7%9B%AE%E5%BD%95)**

1. 打开 EasyBCD。
2. 点击 “添加新条目”。
3. 点击 “WinPE”
    * 类型：WIM 映像
    * 名称：随意
    * 路径： 选择之前解压得到的目录的 `sources\boot.win`
4. 点击 “添加条目”。
5. 重启电脑，开机阶段，选择刚刚随意填的条目。

![](/assets/images/install-windows/easybcd.png)

### 启动方式为 UEFI

1. 用鼠标右键点击 “开始按钮” 或者按 Win+X 快捷键。
2. 点击 “磁盘管理”。
3. 用鼠标右键点击可用空间较大的卷，点击压缩卷。 ![](/assets/images/install-windows/1.png)
4. 输入压缩空间：5000，一般够用，点击压缩。 ![](/assets/images/install-windows/2.png)
5. 压缩完成后，可看到未分配的空间，用鼠标右键点击 “未分配的空间”，点击 “新建简单卷”。 ![](/assets/images/install-windows/3.png)
6. 接连三次点击 “下一步”。
7. 将文件系统选为 “FAT32”，卷标设为空，点击 “下一步”。 ![](/assets/images/install-windows/4.png)
8. 点击 “完成”。
9. 将系统镜像解压至刚刚创建的 FAT32 卷的 **[根目录](http://baike.sogou.com/v305005.htm?fromTitle=%E6%A0%B9%E7%9B%AE%E5%BD%95)**。
10. 重启电脑，在开机阶段前进 BIOS 或者启动项管理，可能需要连续按 ESC 或者 F12 键，具体品牌的具体操作请自行搜索。
11. 用方向键和回车键选择新增的启动项（名字可能为硬盘的型号）。

## 安装阶段

开始安装

![](/assets/images/install-windows/05.jpg)

![](/assets/images/install-windows/06.jpg)

▲语言、区域和输入法设置，中国用户使用默认即可，点击 “下一步” 继续。

![](/assets/images/install-windows/07.jpg)

▲点击 “现在安装”。

![](/assets/images/install-windows/08.jpg)

▲安装密钥：

WIN10：点击 “没有安装密钥”；之后有可能需要选择要安装的版本。

WIN8.1：XHQ8N-C3MCJ-RQXB6-WCHYG-C9WKB (专业版)

![](/assets/images/install-windows/09.jpg)

▲勾选 “我接受许可条款” 后，点击 “下一步” 继续。

![](/assets/images/install-windows/10.jpg)

▲由于我们目前执行纯净安装，因此要选择第二项 “自定义” 安装方式。

![](/assets/images/install-windows/11.jpg)

▲将当前系统卷（根据大小判断）格式化，并选择这个分区，然后点击 “下一步” 即可。

![](/assets/images/install-windows/12.jpg)

▲此后，Windows 安装程序要至少重启两次，耐心等待 30 分钟左右将进入后续设置。后续设置很简单，这里就跳过了。

## 激活

注：激活过程保持联网

鼠标右键点击 “开始按钮” 或者按 Win+X 快捷键，选择 “命令提示符（管理员）”

输入如下命令

``` batch
slmgr /upk
slmgr /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
```

注：XXXXX-XXXXX-XXXXX-XXXXX-XXXXX 是你购买的正版密钥。

稍等片刻，你可以在 “系统”(按 Win+X 快捷键，选择 “系统”）中发现 “Windows 已激活”。

## 更新驱动

刚装完系统，Windows 一般会自动更新驱动等。

系统更新完并重启之后，按 Win+X 快捷键，选择 “设备管理器”，如果没有感叹号，说明驱动都正常工作了，若有就右键有黄色感叹号的项目，进行联网更新。

感叹号没消失，一般可以去找设备的官网按型号、系统下驱动。

再不行就装“驱动精灵”，“鲁大师”等，有开机黑屏的风险哦！
