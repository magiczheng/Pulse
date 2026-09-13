# Pulse 中文快速入门

本页是 Pulse 的中文快速入门，涵盖安装、首次登录和套餐选择。完整且权威的文档
仍以英文文档为准，见 [docs/README.md](../../README.md)。命令、镜像名称、配置键、
激活密钥和 UI 路径都刻意保持不变。

## Pulse 是什么？

Pulse 是一个自托管的监控工作台，面向 Proxmox、Docker、Kubernetes、TrueNAS
以及相关基础设施。Community 免费提供核心监控能力。Relay 增加对 Pulse Web
界面的安全远程访问、Pulse Mobile 配对、推送通知和 14 天历史记录。Pro 增加
根因分析、安全的修复工作流、运维工具、治理能力和 90 天历史记录。

## 已付费的 Relay、Pro 和旧版用户

GitHub 发布产物和公共 Docker 镜像 `rcourtman/pulse` 都是 Community 构建。
请在 **Settings → Plans → Existing purchases** 中激活许可证密钥，以解锁 Pro 功能。

这些 Community 构建不包含 Pulse Pro 私有的运行时钩子，例如审计日志、
审计 Webhook、RBAC 和受管控的修复流程。如需这些运行时能力，请使用
<https://pulserelay.pro/download.html> 并配合 **v6 activation key**。
v6 activation key 以 `ppk_live_` 开头。v5 或旧版许可证密钥不是
`ppk_live_` activation key，在该下载页面上无法使用。

## 快速开始：Proxmox LXC

如果你使用 Proxmox VE，官方 LXC 安装脚本就是 Pulse 原生的入口，它会安装
Pulse 服务器。请把 `vX.Y.Z` 替换为你想要安装的确切发布标签，校验签名后的
安装文件，然后在你的 Proxmox 主机上运行安装脚本：

```bash
export PULSE_VERSION=vX.Y.Z
curl -fsSLO "https://github.com/rcourtman/Pulse/releases/download/${PULSE_VERSION}/install.sh"
curl -fsSLO "https://github.com/rcourtman/Pulse/releases/download/${PULSE_VERSION}/install.sh.sshsig"
ssh-keygen -Y verify \
  -f <(printf '%s\n' 'pulse-installer namespaces="pulse-install" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMZd/DaH+BldzOkq1A8KVTcFk73nAyrE8aJOyf7i00jm pulse-installer') \
  -I pulse-installer \
  -n pulse-install \
  -s install.sh.sshsig < install.sh
bash install.sh --version "${PULSE_VERSION}"
rm -f install.sh install.sh.sshsig
```

Agent 安装以及 v5 到 v6 的 Agent 升级，使用 Pulse 在
**Settings → Infrastructure → Install on a host** 中生成的命令。该命令由你的
Pulse 服务器通过 `/install.sh` 提供。

## 快速开始：Docker

对于容器环境或测试用途，可以直接用 Docker 启动 Pulse：

```bash
docker run -d \
  --name pulse \
  -p 7655:7655 \
  -v pulse_data:/data \
  --restart unless-stopped \
  rcourtman/pulse:vX.Y.Z
```

随后在 `http://<your-ip>:7655` 打开 Pulse。

对于 Docker Compose，只要使用 `PULSE_IMAGE` 变量，同一份 Compose 文件就能同时
用于 Community 和私有的 Pro 镜像：

```yaml
services:
  pulse:
    image: ${PULSE_IMAGE:-rcourtman/pulse:vX.Y.Z}
    container_name: pulse
    restart: unless-stopped
    ports:
      - "7655:7655"
    volumes:
      - pulse_data:/data
    environment:
      - PULSE_AUTH_USER=admin
      - PULSE_AUTH_PASS=secret123

volumes:
  pulse_data:
```

## 首次登录

首次启动时，你需要获取 **Bootstrap Token**，并用它创建管理员账户。

| 平台 | 命令 |
|---|---|
| Docker | `docker exec pulse /app/pulse bootstrap-token` |
| Kubernetes | `kubectl exec -it <pod> -- /app/pulse bootstrap-token` |
| Systemd | `sudo pulse bootstrap-token` |

请粘贴命令输出的令牌字符串。不要直接粘贴 `.bootstrap_token` 文件的内容。
在 v6 中，该文件可能包含加密的 JSON 快照，而不是可用的初始化设置令牌。

1. 打开 `http://<your-ip>:7655`。
2. 粘贴 **Bootstrap Token**。
3. 完成 **Quick Security Setup** 向导。
4. 如果你想在主机上安装统一 Agent，请打开
   **Settings → Infrastructure → Install on a host**。

对于 Proxmox，如果资产清单、节点状态、虚拟机/容器状态和存储指标已经够用，
建议从 API-only 监控开始。当你需要 guest 内部的 Docker/Podman 可见性、
主机 SMART/温度数据、本地 ZFS/Ceph/mdadm 明细，或其他需要本地主机访问权限的
遥测时，才需要安装 Agent。

## 接下来看什么

- [Installation Guide](../../INSTALL.md)：完整的安装方式说明。
- [Configuration](../../CONFIGURATION.md)：身份验证、通知和系统设置。
- [Troubleshooting](../../TROUBLESHOOTING.md)：日志和常见问题。
- [Agent Security](../../AGENT_SECURITY.md)：Agent 权限、Proxmox API-only 选项
  和签名校验。
- [Plans and entitlements](../../PULSE_PRO.md)：Community、Relay、Pro 和 Cloud。
