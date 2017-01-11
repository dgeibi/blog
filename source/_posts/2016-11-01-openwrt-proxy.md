---
title: OpenWrt Proxy
date: 2016-11-01 00:35:00 +0800
lang: en
tags: [网络]
toc: true
---

## Install Packages

You may build your own firmware with following packages:

* dnsmasq-full
* ipset
* [shadowsocks-libev](https://github.com/shadowsocks/openwrt-shadowsocks)
* [pcap-dnsproxy](https://github.com/wongsyrone/openwrt-Pcap_DNSProxy)


Referring to two external packages' README, [OpenWrt build system – Installation [OpenWrt Wiki]](https://wiki.openwrt.org/doc/howto/buildroot.exigence) and [OpenWrt build system – Usage [OpenWrt Wiki]](https://wiki.openwrt.org/doc/howto/build), set up OpenWrt build system, and build your firmware.

`make menuconfig`:

```
Base System
            -> < > dnsmasq
            -> <*> dnsmasq-full -> <*> Build with IPset support.
Network
            -> <*> ipset
            -> <*> shadowsocks-libev
            -> <*> pcap-dnsproxy
```

## Shadowsocks Configuration

Create `/etc/init.d/shadowsocks`:

``` sh
#!/bin/sh /etc/rc.common

START=95
USE_PROCD=1

CONFIG="/etc/shadowsocks/ss.json"

start_service() {
    procd_open_instance
    procd_set_param command /usr/bin/ss-redir -a nobody -c $CONFIG -b 0.0.0.0 -l 10800
    procd_set_param file $CONFIG
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
    procd_open_instance
    procd_set_param command /usr/bin/ss-local -a nobody -c $CONFIG -b 127.0.0.1 -l 1079
    procd_set_param file $CONFIG
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}

# launched through hotplug
boot() {
    return 0
}
```

create a hotplug script for shadowsocks [60-shadowsocks](https://github.com/dgeibi/files-proxy/blob/master/etc/hotplug.d/iface/60-shadowsocks)

|program|ip|port|
|-------|--|----|
|ss-local|127.0.0.1|1079|
|ss-redir|0.0.0.0|10800|

Use ss-local for it can provide a proxy for pcap-dnsproxy. ss-redir provides a transparent proxy for router.

If your Shadowsocks server support UDP Redir, refer to [lede-1/shadowsocks.init](https://github.com/wongsyrone/lede-1/blob/master/package/external/shadowsocks-libev/files/shadowsocks.init).

## Pcap_DNSProxy Configuration

You should the official doucument before using pcap-dnsproxy.

- [chengr28/Pcap_DNSProxy](https://github.com/chengr28/Pcap_DNSProxy)
- [wongsyrone/openwrt-Pcap_DNSProxy](https://github.com/wongsyrone/openwrt-Pcap_DNSProxy)

Modify `etc/config/pcap-dnsproxy`:

```
config pcap-dnsproxy
    option enabled     '1'
```

Modify `/etc/pcap-dnsproxy/Config.conf`:

``` ini
Local Main = 1
Local Routing = 1

[Proxy]
SOCKS Proxy = 1
SOCKS IPv4 Address = 127.0.0.1:1079
SOCKS IPv6 Address = [::1]:1079
```

What have done above will make pcap-dnsproxy resolve domestic domains fast and get unpolluted DNS records.

## Dnsmasq Configuration

Edit `/etc/dnsmasq.conf`:

``` conf
# set dir placing other configurations
conf-dir=/etc/dnsmasq.d

# set DNS server for Shadowsocks server if needed
server=/ss.com/119.29.29.29

# set Pcap_DNSProxy as upstream resolver, replace 192.168.1.1 with your lan ip
server=192.168.1.1#1053

# only domain send requests
domain-needed

# ignore ISP DNS
no-resolv
no-poll

# no caching non-existent domain
no-negcache

# increase the number of caching items
cache-size=10000
```

Get `dnsmasq-blocklist.conf` from [dgeibi/blocked](https://github.com/dgeibi/blocked) and place it into `/etc/dnsmasq.d`. It contains domains which are blocked in China.

Run following command to apply the configuration:

``` sh
/etc/init.d/dnsmasq restart
/etc/init.d/shadowsocks start
/etc/init.d/shadowsocks enable
/etc/init.d/pcap-dnsproxy start
```

## Apply Firewall Rules

Finally, run following commands in OpenWrt's shell for testing.

``` sh
ipset -N gfwlist iphash
iptables -t nat -A PREROUTING -p tcp -m set --match-set gfwlist dst -j REDIRECT --to-port 10800
```

If it works, add the commands above to `/etc/firewall.user`.

Note: If pcap-dnsproxy and shadowsocks do not start after your router's system reboot, they may be trying to start before the network interface is fully up. Modifying hotplug scripts and init scripts may help, please refer to [dgeibi/files-proxy](https://github.com/dgeibi/files-proxy).

## Build into Firmware

``` sh
cd openwrt # cd OpenWrt build dir
git clone https://github.com/dgeibi/files-proxy.git files
```

Modify configurations in files and build again.

## Thanks

- [shadowsocks/shadowsocks-libev: libev port of shadowsocks](https://github.com/shadowsocks/shadowsocks-libev)
- [shadowsocks/openwrt-shadowsocks: Shadowsocks-libev for OpenWrt](https://github.com/shadowsocks/openwrt-shadowsocks)
- [chengr28/Pcap_DNSProxy: A local DNS server based on WinPcap and LibPcap](https://github.com/chengr28/Pcap_DNSProxy)
- [wongsyrone/openwrt-Pcap_DNSProxy: Pcap_DNSProxy for OpenWrt/LEDE](https://github.com/wongsyrone/openwrt-Pcap_DNSProxy)
- [wongsyrone/lede-1: LEDE Project with modifications](https://github.com/wongsyrone/lede-1)
