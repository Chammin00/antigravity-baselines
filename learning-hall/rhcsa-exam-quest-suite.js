/**
 * 🎩 RHEL 9 RHCSA Exam Quest (EX200) — Full 3D Learning Hall Studio Recreation
 * Recreates the Google AI Studio "RHEL 9 RHCSA Exam Quest" application inside the
 * Antigravity 3D Centralized Learning Hall with:
 * - Gamified Profile Dashboard (XP, Level Rank, localStorage persistence: rhel9_rhcsa_quest_progress_v2)
 * - Drafting Background Switcher (RHEL Red Blueprint, Matrix Terminal, Drafting Blueprint, Amber Vintage, etc.)
 * - SysAdmin Ronin Companion & Docked/Inline Terminal Layout Switcher
 * - "I Don't Have a Clue!" Beginners Guide (6 Interactive Foundational Linux Modules)
 * - Practice Labs (All 23+ Quests from QUEST_SCENARIOS), 8-Unit Objectives Walkthrough (bk), & Must-Know Survival Pack
 * - Sandbox Playground & Interactive Vim /etc Inspector (:wq Simulated Vi Editor)
 * - 10 Exam Rescue Specials (rd.break, LVM, Disk & Swap, SELinux 4-Pillars, AutoFS, SSH, Repo, Firewall, Podman, Systemd & NTP with Reboot Host Persistence Verifier)
 * - Server 1 Mock Exams (16 Interactive Exam Tasks)
 * - Exam Battle Mode, Flashcard Quest (og), Live Terminal Cast, and RHCSA QuickRef
 */

const RHCSA_STORAGE_KEY = 'rhel9_rhcsa_quest_progress_v2';

const RHCSA_SERVER1_TASKS = [
  {
    id: 'hostname_net',
    num: 1,
    name: '1. Hostname & IP Address',
    category: 'Networking',
    prompt: 'Configure static hostname `server1.rhcsa.local` and set connection `enp1s0` to IPv4 `10.0.2.15/24`, Gateway `10.0.2.2`, DNS `8.8.8.8`, manual method, and bring it up.',
    hints: [
      'hostnamectl set-hostname server1.rhcsa.local',
      'nmcli connection modify enp1s0 ipv4.addresses 10.0.2.15/24 ipv4.gateway 10.0.2.2 ipv4.dns 8.8.8.8 ipv4.method manual',
      'nmcli connection up enp1s0'
    ],
    patterns: [/hostnamectl\s+set-hostname\s+server1\.rhcsa\.local/, /nmcli\s+con(nection)?\s+modify\s+enp1s0/, /nmcli\s+con(nection)?\s+up\s+enp1s0/],
    xp: 180
  },
  {
    id: 'dnf_repos',
    num: 2,
    name: '2. Yum / DNF Repo Setup',
    category: 'Software Management',
    prompt: 'Configure local DNF repositories in `/etc/yum.repos.d/local.repo` pointing to `file:///mnt/repo/BaseOS` and `file:///mnt/repo/AppStream` with `gpgcheck=0` and `enabled=1`, then run `dnf clean all`.',
    hints: [
      'echo -e "[BaseOS]\\nname=BaseOS\\nbaseurl=file:///mnt/repo/BaseOS\\nenabled=1\\ngpgcheck=0" > /etc/yum.repos.d/local.repo',
      'dnf clean all && dnf repolist'
    ],
    patterns: [/(\/etc\/yum\.repos\.d\/.*\.repo|vim\s+\/etc\/yum\.repos\.d)/, /dnf\s+(clean\s+all|repolist)/],
    xp: 160
  },
  {
    id: 'user_management',
    num: 3,
    name: '3. Users & Groups',
    category: 'Users & Groups',
    prompt: 'Create group `sysadmins`. Create user `alex` with UID `2048` and primary group `sysadmins`. Create service user `caroline` with shell `/sbin/nologin`.',
    hints: [
      'groupadd sysadmins',
      'useradd -u 2048 -g sysadmins alex',
      'useradd -s /sbin/nologin caroline'
    ],
    patterns: [/groupadd\s+sysadmins/, /useradd\s+.*2048.*alex/, /useradd\s+.*nologin.*caroline|useradd\s+caroline\s+.*nologin/],
    xp: 170
  },
  {
    id: 'permissions_gid',
    num: 4,
    name: '4. GID Shared Directory',
    category: 'Permissions',
    prompt: 'Create collaborative directory `/home/collaborative`, set group ownership to `sysadmins`, and apply SGID (`g+s`) so new files inherit the group.',
    hints: [
      'mkdir -p /home/collaborative',
      'chown :sysadmins /home/collaborative',
      'chmod 2770 /home/collaborative'
    ],
    patterns: [/mkdir\s+(-p\s+)?\/home\/collaborative/, /(chown|chgrp)\s+.*sysadmins\s+\/home\/collaborative/, /chmod\s+(g\+s|2\d{3})\s+\/home\/collaborative/],
    xp: 160
  },
  {
    id: 'cron_scheduling',
    num: 5,
    name: '5. Cron Scheduling & Deny',
    category: 'Scheduling',
    prompt: 'Schedule a daily cron job at `12:30` for user `harry` that runs `/bin/echo "EX200"`, and deny user `natasha` from creating cron jobs via `/etc/cron.deny`.',
    hints: [
      'crontab -u harry -e (add: 30 12 * * * /bin/echo "EX200")',
      'echo "natasha" >> /etc/cron.deny'
    ],
    patterns: [/crontab|30\s+12\s+\*\s+\*\s+\*/, /cron\.deny/],
    xp: 170
  },
  {
    id: 'selinux_controls',
    num: 6,
    name: '6. SELinux Port & fcontext',
    category: 'SELinux',
    prompt: 'Ensure SELinux is in `Enforcing` mode, authorize TCP port `8282` for `http_port_t`, and relabel `/custom_web` with `httpd_sys_content_t`.',
    hints: [
      'setenforce 1',
      'semanage port -a -t http_port_t -p tcp 8282',
      'semanage fcontext -a -t httpd_sys_content_t "/custom_web(/.*)?" && restorecon -Rv /custom_web'
    ],
    patterns: [/semanage\s+port\s+-a\s+-t\s+http_port_t\s+-p\s+tcp\s+8282/, /restorecon/],
    xp: 200
  },
  {
    id: 'find_files',
    num: 7,
    name: '7. Locate & Copy User Files',
    category: 'File Management',
    prompt: 'Find all files owned by user `clara` inside `/etc` and copy them into `/root/clara_files/`.',
    hints: [
      'mkdir -p /root/clara_files',
      'find /etc -user clara -exec cp -a {} /root/clara_files/ \\;'
    ],
    patterns: [/mkdir\s+(-p\s+)?\/root\/clara_files/, /find\s+\/etc\s+.*-user\s+clara\s+.*-exec\s+cp/],
    xp: 150
  },
  {
    id: 'archiving_tar',
    num: 8,
    name: '8. tar & gzip/bzip2 Backup',
    category: 'Archiving',
    prompt: 'Create a compressed archive `/root/audit-backup.tar.gz` containing `/var/log/audit/`.',
    hints: [
      'tar -czf /root/audit-backup.tar.gz /var/log/audit/'
    ],
    patterns: [/tar\s+-c[zjvJ]*f\s+\/root\/audit-backup\.tar\.gz\s+\/var\/log\/audit/],
    xp: 130
  },
  {
    id: 'sudo_escalation',
    num: 9,
    name: '9. Sudoers Drop-in Privilege',
    category: 'Security',
    prompt: 'Grant user `auditor` passwordless sudo privileges to run `/usr/sbin/auditctl` by creating `/etc/sudoers.d/auditor`.',
    hints: [
      'echo "auditor ALL=(ALL) NOPASSWD: /usr/sbin/auditctl" > /etc/sudoers.d/auditor',
      'visudo -cf /etc/sudoers.d/auditor'
    ],
    patterns: [/auditor\s+ALL=\(ALL\)\s+NOPASSWD:\s+\/usr\/sbin\/auditctl|\/etc\/sudoers\.d\/auditor/],
    xp: 150
  },
  {
    id: 'autofs_mounting',
    num: 10,
    name: '10. AutoFS Dynamic Mount',
    category: 'Storage & NFS',
    prompt: 'Configure `autofs` with `/etc/auto.master` (`/shares /etc/auto.shares`) to automount `192.168.1.50:/shares/logs` on `/shares/logs` and enable `autofs`.',
    hints: [
      'echo "/shares /etc/auto.shares --timeout=60" >> /etc/auto.master',
      'echo "logs -fstype=nfs,rw 192.168.1.50:/shares/logs" > /etc/auto.shares',
      'systemctl enable --now autofs'
    ],
    patterns: [/auto\.master|auto\.shares/, /systemctl\s+enable\s+--now\s+autofs/],
    xp: 210
  },
  {
    id: 'system_tuning',
    num: 11,
    name: '11. Tuned Profile Optimization',
    category: 'Performance',
    prompt: 'Enable `tuned`, inspect the recommended profile (`tuned-adm recommend`), and activate `virtual-guest`.',
    hints: [
      'systemctl enable --now tuned',
      'tuned-adm recommend',
      'tuned-adm profile virtual-guest'
    ],
    patterns: [/systemctl\s+enable\s+--now\s+tuned/, /tuned-adm\s+profile\s+(virtual-guest|throughput-performance|balanced)/],
    xp: 150
  },
  {
    id: 'scripting_automation',
    num: 12,
    name: '12. Log Admin Bash Script',
    category: 'Bash Scripting',
    prompt: 'Create an executable script `/usr/local/bin/logcheck.sh` (`chmod +x`) that searches `/var/log/messages` for `ERROR` and outputs the count.',
    hints: [
      'echo -e "#!/bin/bash\\ngrep -i error /var/log/messages | wc -l" > /usr/local/bin/logcheck.sh',
      'chmod +x /usr/local/bin/logcheck.sh'
    ],
    patterns: [/logcheck\.sh/, /chmod\s+\+x\s+.*logcheck\.sh/],
    xp: 180
  },
  {
    id: 'fdisk_swap',
    num: 14,
    name: '14. fdisk 1GB & 50MB Swap',
    category: 'Disk & Swap',
    prompt: 'Partition `/dev/sdb` using `fdisk /dev/sdb` (`sdb1` 1GB, `sdb2` 50MB swap type 82), format swap with `mkswap /dev/sdb2`, and activate with `swapon /dev/sdb2`.',
    hints: [
      'fdisk /dev/sdb',
      'mkswap /dev/sdb2',
      'swapon /dev/sdb2'
    ],
    patterns: [/fdisk\s+\/dev\/sdb/, /mkswap\s+\/dev\/sdb2/, /swapon\s+(\/dev\/sdb2|-a)/],
    xp: 190
  },
  {
    id: 'acl_permissions',
    num: 15,
    name: '15. /var/fstab ACL Rules',
    category: 'POSIX ACLs',
    prompt: 'Copy `/etc/fstab` to `/var/fstab`, grant user `natasha` read-write (`rw-`) via `setfacl`, and deny group `mac` all access (`---`).',
    hints: [
      'cp /etc/fstab /var/fstab',
      'setfacl -m u:natasha:rw /var/fstab',
      'setfacl -m g:mac:- /var/fstab',
      'getfacl /var/fstab'
    ],
    patterns: [/cp\s+(\/etc\/)?fstab\s+\/var\/fstab/, /setfacl\s+-m\s+u:natasha:rw-?\s+\/var\/fstab/, /setfacl\s+-m\s+g:(mac|Mac):(---|-)\s+\/var\/fstab/],
    xp: 170
  },
  {
    id: 'linux_dir_bits',
    num: 16,
    name: '16. /linux SGID & Sticky Bit',
    category: 'Special Permissions',
    prompt: 'Create directory `/linux`, set group owner to `Mac`, and enable both SGID (`g+s`) and Sticky Bit (`+t`) so files inherit `Mac` and only owners can delete.',
    hints: [
      'mkdir -p /linux',
      'chgrp Mac /linux',
      'chmod g+s,o+t /linux  (or chmod 3775 /linux)'
    ],
    patterns: [/mkdir\s+(-p\s+)?\/linux/, /(chgrp|chown)\s+.*(Mac|mac)\s+\/linux/, /chmod\s+.*(g\+s|\+t|3\d{3}|2\d{3}).*\/linux/],
    xp: 180
  },
  {
    id: 'lvm_lv1_lv2_extents',
    num: 17,
    name: '17. LVM LV1 (8G->10G) & LV2 (10 Extents)',
    category: 'Storage & LVM',
    prompt: 'Create 8GB logical volume `LV1` in `vg0`, extend `LV1` by `+2G`, set physical extent size to `8M`, and create `LV2` with `10` extents.',
    hints: [
      'lvcreate -L 8G -n LV1 vg0',
      'lvextend -L +2G /dev/vg0/LV1',
      'vgchange -s 8M vg0 && lvcreate -l 10 -n LV2 vg0'
    ],
    patterns: [/lvcreate\s+.*-L\s+8G.*-n\s+LV1/i, /lvextend\s+.*-L\s+\+2G/i, /lvcreate\s+.*-l\s+10.*-n\s+LV2/i],
    xp: 220
  }
];

const RHCSA_SPECIAL_LABS = {
  rdbreak: {
    title: '🔑 Root Password Rescue (rd.break)',
    badge: 'Boot Recovery Special',
    desc: 'Interrupt GRUB2 boot loader, append `rd.break` to enter the initramfs emergency shell, remount `/sysroot` read-write, `chroot`, reset root password, and create `/.autorelabel` for SELinux.',
    checklist: [
      { label: 'Remount /sysroot read-write', cmd: 'mount -o remount,rw /sysroot', pattern: /mount\s+-o\s+remount,rw\s+\/sysroot/ },
      { label: 'Enter chroot jail on /sysroot', cmd: 'chroot /sysroot', pattern: /chroot\s+\/sysroot/ },
      { label: 'Reset root password', cmd: 'passwd root', pattern: /(passwd|echo\s+.*passwd\s+--stdin)/ },
      { label: 'Trigger SELinux relabel on boot', cmd: 'touch /.autorelabel', pattern: /touch\s+\/\.autorelabel/ }
    ]
  },
  lvmlab: {
    title: '📂 LVM Dynamic Storage & Online GrowFS Lab',
    badge: 'Storage Special',
    desc: 'Master the 4-layer LVM stack: Physical Volume (`pvcreate`), Volume Group (`vgcreate`), Logical Volume (`lvcreate`), XFS/EXT4 formatting (`mkfs.xfs`), and online expansion (`lvextend -r`).',
    checklist: [
      { label: 'Initialize Physical Volume /dev/sdb', cmd: 'pvcreate /dev/sdb', pattern: /pvcreate\s+\/dev\/sdb/ },
      { label: 'Create Volume Group vg_data', cmd: 'vgcreate vg_data /dev/sdb', pattern: /vgcreate\s+vg_data\s+\/dev\/sdb/ },
      { label: 'Create 2G Logical Volume lv_app', cmd: 'lvcreate -L 2G -n lv_app vg_data', pattern: /lvcreate\s+.*lv_app/ },
      { label: 'Format XFS & Extend Online (+1G)', cmd: 'mkfs.xfs /dev/vg_data/lv_app && lvextend -r -L +1G /dev/vg_data/lv_app', pattern: /(mkfs\.xfs|lvextend)/ }
    ]
  },
  partswaplab: {
    title: '💾 Disk Partitioning (fdisk) & Swap Space Lab',
    badge: 'Storage Special',
    desc: 'Create standard partitions and swap partitions using `fdisk`, notify the kernel with `partprobe`, format swap with `mkswap`, and activate with `swapon`.',
    checklist: [
      { label: 'Partition /dev/sdb with fdisk', cmd: 'fdisk /dev/sdb', pattern: /fdisk\s+\/dev\/sdb/ },
      { label: 'Update kernel partition table', cmd: 'partprobe /dev/sdb', pattern: /partprobe/ },
      { label: 'Format swap on /dev/sdb2', cmd: 'mkswap /dev/sdb2', pattern: /mkswap\s+\/dev\/sdb2/ },
      { label: 'Activate swap space', cmd: 'swapon /dev/sdb2', pattern: /swapon\s+(\/dev\/sdb2|-a)/ }
    ]
  },
  selinuxlab: {
    title: '🛡️ SELinux 4-Pillars Enforcement Lab',
    badge: 'Security Special',
    desc: 'Practice all 4 pillars of RHCSA SELinux: Execution Modes (`setenforce`), File Contexts (`semanage fcontext` + `restorecon`), Port Labels (`semanage port`), and Booleans (`setsebool -P`).',
    checklist: [
      { label: 'Set SELinux mode to Enforcing', cmd: 'setenforce 1', pattern: /(setenforce\s+1|getenforce)/ },
      { label: 'Register fcontext for /custom_web', cmd: 'semanage fcontext -a -t httpd_sys_content_t "/custom_web(/.*)?"', pattern: /semanage\s+fcontext\s+-a/ },
      { label: 'Apply context labels with restorecon', cmd: 'restorecon -Rv /custom_web', pattern: /restorecon\s+-R/ },
      { label: 'Authorize TCP port 8282 for HTTP', cmd: 'semanage port -a -t http_port_t -p tcp 8282', pattern: /semanage\s+port\s+-a\s+-t\s+http_port_t\s+-p\s+tcp\s+8282/ }
    ]
  },
  autofslab: {
    title: '⚡ AutoFS On-Demand NFS Automounter Lab',
    badge: 'Storage & Network Special',
    desc: 'Configure indirect and direct maps in `/etc/auto.master` and `/etc/auto.shares` so remote NFS exports mount automatically on access and unmount after idle timeout.',
    checklist: [
      { label: 'Add /shares map to /etc/auto.master', cmd: 'echo "/shares /etc/auto.shares --timeout=60" >> /etc/auto.master', pattern: /auto\.master/ },
      { label: 'Configure NFS rule in /etc/auto.shares', cmd: 'echo "logs -fstype=nfs,rw 192.168.1.50:/shares/logs" > /etc/auto.shares', pattern: /auto\.shares/ },
      { label: 'Enable & start autofs service', cmd: 'systemctl enable --now autofs', pattern: /systemctl\s+enable\s+--now\s+autofs/ }
    ]
  },
  sshlab: {
    title: '🔑 SSH Key-Based Auth & Daemon Hardening Lab',
    badge: 'Security Special',
    desc: 'Harden `/etc/ssh/sshd_config` by disabling `PermitRootLogin` and `PasswordAuthentication`, reload `sshd`, and verify public-key authentication.',
    checklist: [
      { label: 'Disable PermitRootLogin in sshd_config', cmd: 'sed -i "s/#PermitRootLogin yes/PermitRootLogin no/g" /etc/ssh/sshd_config', pattern: /PermitRootLogin\s+no|vim\s+\/etc\/ssh\/sshd_config/ },
      { label: 'Disable PasswordAuthentication', cmd: 'sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config', pattern: /PasswordAuthentication\s+no|vim\s+\/etc\/ssh\/sshd_config/ },
      { label: 'Restart sshd daemon', cmd: 'systemctl restart sshd', pattern: /systemctl\s+restart\s+sshd/ }
    ]
  },
  repolab: {
    title: '📂 DNF / YUM Local Repository Configuration Lab',
    badge: 'Package Management Special',
    desc: 'Create custom `.repo` files inside `/etc/yum.repos.d/` for offline ISO/HTTP mirrors (`BaseOS` and `AppStream`) and verify metadata caching.',
    checklist: [
      { label: 'Write /etc/yum.repos.d/local.repo', cmd: 'echo -e "[local]\\nname=Local Repo\\nbaseurl=file:///mnt/repo\\nenabled=1\\ngpgcheck=0" > /etc/yum.repos.d/local.repo', pattern: /\/etc\/yum\.repos\.d\/.*\.repo/ },
      { label: 'Clean DNF cache', cmd: 'dnf clean all', pattern: /dnf\s+clean\s+all/ },
      { label: 'Verify active repository list', cmd: 'dnf repolist', pattern: /dnf\s+repolist/ }
    ]
  },
  firewalllab: {
    title: '🛡️ FirewallD Zones, Services & Rich Rules Lab',
    badge: 'Network Security Special',
    desc: 'Configure persistent ingress rules across Firewalld zones (`--permanent`) and commit changes to active kernel netfilter tables (`--reload`).',
    checklist: [
      { label: 'Allow HTTP & HTTPS permanently', cmd: 'firewall-cmd --permanent --add-service=http --add-service=https', pattern: /firewall-cmd\s+--permanent\s+--add-service=http/ },
      { label: 'Open custom TCP port 8282 permanently', cmd: 'firewall-cmd --permanent --add-port=8282/tcp', pattern: /firewall-cmd\s+--permanent\s+--add-port=8282\/tcp/ },
      { label: 'Reload firewalld to activate rules', cmd: 'firewall-cmd --reload', pattern: /firewall-cmd\s+--reload/ }
    ]
  },
  podmanlab: {
    title: '🐳 Rootless Podman & Systemd User Linger Lab',
    badge: 'Containers Special',
    desc: 'Run rootless containers with SELinux `:Z` volume bind mounts, generate user-level systemd unit files (`podman generate systemd`), and enable session lingering (`loginctl enable-linger`).',
    checklist: [
      { label: 'Pull nginx:latest image', cmd: 'podman pull nginx:latest', pattern: /podman\s+pull/ },
      { label: 'Run rootless container web1 on 8080:80', cmd: 'podman run -d --name web1 -p 8080:80 nginx:latest', pattern: /podman\s+run\s+.*web1/ },
      { label: 'Generate systemd unit file', cmd: 'podman generate systemd --name web1 --files --new', pattern: /podman\s+generate\s+systemd/ },
      { label: 'Enable user lingering & systemd unit', cmd: 'loginctl enable-linger administrator && systemctl --user enable --now container-web1.service', pattern: /(loginctl\s+enable-linger|systemctl\s+--user\s+enable)/ }
    ]
  },
  systemdlab: {
    title: '⚙️ Systemd Daemons, Chrony NTP & Reboot Persistence Lab',
    badge: 'System Services Special',
    desc: 'Configure `chronyd` NTP time synchronization, stop/disable/mask the insecure `legacy-service` daemon, edit `/etc/chrony.conf` with Simulated Vi (`:wq`), and click "Reboot Host" to verify boot persistence!',
    checklist: [
      { label: 'Configure NTP pool in /etc/chrony.conf', cmd: 'vim /etc/chrony.conf  (or echo "pool pool.ntp.org iburst" >> /etc/chrony.conf)', pattern: /chrony\.conf/ },
      { label: 'Enable & start chronyd.service', cmd: 'systemctl enable --now chronyd', pattern: /systemctl\s+enable\s+(--now\s+)?chronyd/ },
      { label: 'Stop & mask legacy-service.service', cmd: 'systemctl stop legacy-service && systemctl mask legacy-service', pattern: /systemctl\s+mask\s+legacy-service/ }
    ]
  }
};

const RHCSA_BEGINNERS_MODULES = [
  {
    id: 'cmd-anatomy',
    icon: '🧭',
    title: '1. Linux Command Anatomy (Who, What, How, Where)',
    summary: 'Every Linux command follows the exact same 3-part grammar: `command [options/flags] [arguments/targets]`.',
    content: `
      <div class="space-y-2 text-xs text-slate-300">
        <p>When you see <code class="text-red-400 font-mono">root@rhel9-node-01 ~]# useradd -u 2048 -g sysadmins alex</code>:</p>
        <ul class="list-disc list-inside space-y-1 text-slate-400">
          <li><strong class="text-white">root</strong> = Current logged-in user (<code class="text-red-400">#</code> means root superuser; <code class="text-emerald-400">$</code> means standard user).</li>
          <li><strong class="text-white">useradd</strong> = The binary program being executed.</li>
          <li><strong class="text-white">-u 2048 -g sysadmins</strong> = Short flags modifying behavior (UID 2048, primary group sysadmins).</li>
          <li><strong class="text-white">alex</strong> = The target argument (the username to create).</li>
        </ul>
      </div>
    `,
    practiceCmd: 'whoami && uname -r'
  },
  {
    id: 'fhs-map',
    icon: '🗂️',
    title: '2. The RHEL 9 Filesystem Map (/etc, /var, /dev, /proc)',
    summary: 'Everything in Linux is a file starting from root `/`. Memorize these 6 critical directories for the EX200 exam:',
    content: `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        <div class="p-2 rounded bg-black/40 border border-white/10"><strong class="text-red-400">/etc</strong> — All system configuration files (fstab, sshd_config, chrony.conf)</div>
        <div class="p-2 rounded bg-black/40 border border-white/10"><strong class="text-amber-400">/var/log</strong> — System logs (messages, secure, audit/audit.log)</div>
        <div class="p-2 rounded bg-black/40 border border-white/10"><strong class="text-emerald-400">/dev</strong> — Block storage devices (/dev/sda, /dev/sdb, /dev/vg0/lv1)</div>
        <div class="p-2 rounded bg-black/40 border border-white/10"><strong class="text-sky-400">/root & /home</strong> — Root home (/root) vs. standard user homes (/home/alex)</div>
      </div>
    `,
    practiceCmd: 'ls -la /etc/fstab /var/log'
  },
  {
    id: 'perms-octal',
    icon: '🔐',
    title: '3. Permissions & Octal Math (4-2-1 Rule + Special Bits)',
    summary: 'Read = 4, Write = 2, Execute = 1. Special bits: SUID = 4000, SGID = 2000 (Group Inheritance), Sticky = 1000 (Delete Protection).',
    content: `
      <div class="space-y-1.5 text-xs text-slate-300">
        <div>• <code class="text-emerald-400">chmod 755 file</code> ➜ Owner: <code class="text-white">rwx (4+2+1=7)</code>, Group: <code class="text-white">r-x (4+1=5)</code>, Other: <code class="text-white">r-x (5)</code></div>
        <div>• <code class="text-amber-400">chmod 2770 /shared</code> ➜ Leading <code class="text-white">2</code> sets <strong>SGID (rwxrws---)</strong> so every new file inherits the folder's group!</div>
        <div>• <code class="text-red-400">chmod 3775 /linux</code> ➜ Leading <code class="text-white">3 (2+1)</code> sets <strong>SGID + Sticky Bit (rwxrwsr-t)</strong>!</div>
      </div>
    `,
    practiceCmd: 'mkdir -p /linux && chmod 3775 /linux && ls -ld /linux'
  },
  {
    id: 'pipes-redirs',
    icon: '🔀',
    title: '4. Pipes, Redirection & Vi/Vim Survival',
    summary: 'Chain commands with `|` (pipe), overwrite with `>`, append with `>>`, and never get stuck inside `vim`!',
    content: `
      <div class="space-y-1.5 text-xs text-slate-300">
        <div>• <code class="text-sky-400">&gt;</code> overwrites the entire file (DANGER on <code class="text-white">/etc/fstab</code>!). Always use <code class="text-emerald-400">&gt;&gt;</code> to append a line!</div>
        <div>• <strong>Vim 3-Step Survival:</strong> Press <code class="text-amber-400">i</code> for Insert Mode ➜ Type your config ➜ Press <code class="text-amber-400">Esc</code> then type <code class="text-emerald-400">:wq</code> to Save & Quit (or <code class="text-rose-400">:q!</code> to discard).</div>
      </div>
    `,
    practiceCmd: 'vim /etc/login.defs'
  }
];

const RHCSA_EXAM_QUEST_SUITE = {
  state: {
    activeTab: 'terminal', // dashboard, beginners, terminal, sandbox, rdbreak, lvmlab, partswaplab, selinuxlab, autofslab, sshlab, repolab, firewalllab, podmanlab, systemdlab, server1, etcinspector, exam, flashcards, videocast, lookup
    sidebarSubTab: 'quests', // quests, objectives, mustknow
    activeScenarioId: 'create-lvm',
    activeWalkthroughUnitId: 'essential-tools',
    activeServer1TaskId: 'hostname_net',
    activeEtcFile: '/etc/fstab',
    bgTheme: 'red-blueprint',
    terminalLayout: 'inline', // inline, docked
    showRonin: true,
    viEditorFile: null,
    viEditorBuffer: '',
    progress: {
      xp: 450,
      level: 1,
      completedScenarios: [],
      completedFlashcards: [],
      examScores: [],
      commandHistory: []
    },
    terminalLogs: [],
    historyCursor: -1,
    toastMessage: null,
    flashcardIdx: 0,
    flashcardFlipped: false,
    battleIdx: 0,
    battleScore: 0,
    battleAnswered: null,
    quickRefQuery: '',
    // Virtual RHEL 9 Host State
    vmState: {
      hostname: 'rhel9-node-01.local',
      selinuxMode: 'Enforcing',
      selinuxPorts: ['80', '81', '443', '488', '8008', '8009', '8443'],
      defaultTarget: 'graphical.target',
      activeTunedProfile: 'balanced',
      daemons: {
        'chronyd.service': { activeState: 'inactive', enabledState: 'disabled' },
        'legacy-service.service': { activeState: 'active', enabledState: 'enabled' },
        'sshd.service': { activeState: 'active', enabledState: 'enabled' },
        'firewalld.service': { activeState: 'active', enabledState: 'enabled' },
        'autofs.service': { activeState: 'inactive', enabledState: 'disabled' },
        'tuned.service': { activeState: 'inactive', enabledState: 'disabled' }
      },
      etcFiles: {
        '/etc/fstab': `# /etc/fstab: static file system information.\nUUID=9f8e7d6c-5b4a-3210-fedc-ba9876543210 /                       xfs     defaults        0 0\nUUID=1a2b3c4d-5e6f-7890-abcd-ef1234567890 /boot                   xfs     defaults        0 0`,
        '/etc/chrony.conf': `# Use public servers from the pool.ntp.org project.\n#pool 2.rhel.pool.ntp.org iburst\ndriftfile /var/lib/chrony/drift\nmakestep 1.0 3\nrtcsync\nlogdir /var/log/chrony`,
        '/etc/ssh/sshd_config': `# OpenSSH Server Configuration (RHEL 9)\nPort 22\n#PermitRootLogin prohibit-password\nPasswordAuthentication yes\nPubkeyAuthentication yes\nSubsystem sftp /usr/libexec/openssh/sftp-server`,
        '/etc/login.defs': `# /etc/login.defs - Shadow password suite configuration\nMAIL_DIR        /var/spool/mail\nPASS_MAX_DAYS   99999\nPASS_MIN_DAYS   0\nPASS_MIN_LEN    8\nPASS_WARN_AGE   7\nUID_MIN         1000\nGID_MIN         1000\nCREATE_HOME     yes`,
        '/etc/sudoers': `## Sudoers allows particular users to run various commands as root\nroot    ALL=(ALL)       ALL\n%wheel  ALL=(ALL)       ALL\n#includedir /etc/sudoers.d`,
        '/etc/auto.master': `# Sample auto.master file\n/misc   /etc/auto.misc\n+auto.master`,
        '/etc/yum.repos.d/local.repo': `# Configure offline or network DNF repositories here\n[BaseOS]\nname=RHEL 9 BaseOS\nbaseurl=file:///mnt/repo/BaseOS\nenabled=1\ngpgcheck=0`,
        '/etc/cron.deny': `# Users listed here are denied crontab access`,
        '/etc/selinux/config': `# This file controls the state of SELinux on the system.\nSELINUX=enforcing\nSELINUXTYPE=targeted`
      }
    }
  },

  init() {
    try {
      const saved = localStorage.getItem(RHCSA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.progress = { ...this.state.progress, ...parsed };
      }
    } catch (_) {}
  },

  saveProgress() {
    this.state.progress.level = Math.floor(this.state.progress.xp / 1000) + 1;
    try {
      localStorage.setItem(RHCSA_STORAGE_KEY, JSON.stringify(this.state.progress));
    } catch (_) {}
  },

  awardXp(amount, label) {
    const oldLevel = this.state.progress.level;
    this.state.progress.xp += amount;
    this.saveProgress();
    if (this.state.progress.level > oldLevel) {
      this.showToast(`🎉 Rank Up! Reached Level ${this.state.progress.level} Administrator (+${amount} XP)`);
    } else {
      this.showToast(`🔥 ${label} — Gained +${amount} XP!`);
    }
  },

  showToast(msg) {
    this.state.toastMessage = msg;
    const toastEl = document.getElementById('rhcsa-quest-toast');
    if (toastEl) {
      toastEl.textContent = msg;
      toastEl.classList.remove('hidden');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toastEl.classList.add('hidden');
      }, 3800);
    }
  },

  getScenarios() {
    return window.QUEST_SCENARIOS || [];
  },

  getWalkthroughUnits() {
    return window.RHCSA_WALKTHROUGH_UNITS || [];
  },

  getFlashcards() {
    return window.RHCSA_FLASHCARDS || [];
  },

  getCurrentScenario() {
    const scenarios = this.getScenarios();
    if (this.state.activeTab === 'sandbox') {
      return {
        id: 'sandbox',
        title: 'RHEL 9.2 Playground Sandbox (Unconstrained Root VM)',
        difficulty: 'Easy',
        category: 'Containers, LVM & Security',
        description: 'Welcome to the RHEL 9 Sandbox Mode! Practice any RHCSA commands, open `/etc` config files in `vim`, configure LVM storage, test SELinux `semanage` rules, or run rootless Podman containers.',
        objective: 'Type any RHEL 9 commands or run `vim /etc/fstab` to launch the interactive Vi editor.',
        initialTerminalLogs: [
          'Connected to host: sandbox-rhel9.local',
          'Operating System: Red Hat Enterprise Linux 9.2 (Ootpa) [SANDBOX PLAYGROUND MODE]',
          'Active login: root (authorized)',
          ''
        ],
        hints: [
          'Try: lsblk, pvcreate /dev/sdb, vgcreate vg_data /dev/sdb, lvcreate -L 2G -n lv_app vg_data',
          'Try: vim /etc/fstab   or   vim /etc/chrony.conf   to launch the interactive Vi editor (:wq)',
          'Try: getenforce, semanage port -a -t http_port_t -p tcp 8282, firewall-cmd --reload',
          'Try: podman run -d --name web1 -p 8080:80 nginx:latest'
        ],
        solutionPattern: [],
        xpAwarded: 50
      };
    }
    return scenarios.find(s => s.id === this.state.activeScenarioId) || scenarios[0] || {
      id: 'create-lvm',
      title: 'Create Logical Volumes and Filesystems',
      difficulty: 'Medium',
      category: 'Storage & LVM',
      description: 'Create PV /dev/sdb, VG vg_data, LV lv_app (2G), and format with XFS.',
      objective: 'Run pvcreate, vgcreate, lvcreate, and mkfs.xfs.',
      initialTerminalLogs: ['Connected to host: rhel9-node-01.local'],
      hints: ['pvcreate /dev/sdb', 'vgcreate vg_data /dev/sdb', 'lvcreate -L 2G -n lv_app vg_data', 'mkfs.xfs /dev/vg_data/lv_app'],
      solutionPattern: [/pvcreate/, /vgcreate/, /lvcreate/, /mkfs\.xfs/],
      xpAwarded: 200
    };
  },

  /**
   * Main entry point to render the full Google AI Studio RHCSA Exam Quest inside any container
   */
  render(container) {
    if (!container) return;
    this.init();
    this._rootContainer = container;

    const scenarios = this.getScenarios();
    const activeScen = this.getCurrentScenario();
    if (!this.state.terminalLogs.length) {
      this.state.terminalLogs = [...(activeScen.initialTerminalLogs || ['Connected to rhel9-node-01.local'])];
    }

    const p = this.state.progress;
    const xpInLevel = p.xp % 1000;
    const xpPct = Math.min(100, Math.round((xpInLevel / 1000) * 100));

    const topTabs = [
      { id: 'dashboard', label: '🏠 Dashboard' },
      { id: 'beginners', label: '🐣 Beginners Guide' },
      { id: 'terminal', label: `💻 Practice Labs (${scenarios.length})` },
      { id: 'sandbox', label: '🧪 Sandbox Playground' },
      { id: 'rdbreak', label: '🔑 rd.break Rescue' },
      { id: 'lvmlab', label: '📂 LVM Storage Lab' },
      { id: 'partswaplab', label: '💾 Disk & Swap Lab' },
      { id: 'selinuxlab', label: '🛡️ SELinux 4-Pillars' },
      { id: 'autofslab', label: '⚡ AutoFS Lab' },
      { id: 'sshlab', label: '🔑 SSH Hardening' },
      { id: 'repolab', label: '📂 Repo Config Lab' },
      { id: 'firewalllab', label: '🛡️ Firewall Lab' },
      { id: 'podmanlab', label: '🐳 Podman Lab' },
      { id: 'systemdlab', label: '⚙️ Systemd & NTP' },
      { id: 'server1', label: '🖥️ Server 1 Exams (16)' },
      { id: 'etcinspector', label: '📂 Vim /etc Inspector' },
      { id: 'exam', label: '⚔️ Exam Battle' },
      { id: 'flashcards', label: '📚 Flashcard Quest' },
      { id: 'videocast', label: '📺 Live Cast' },
      { id: 'lookup', label: '🔍 RHCSA QuickRef' }
    ];

    const bgStyles = {
      'red-blueprint': 'radial-gradient(circle at 15% 15%, rgba(239, 68, 68, 0.10), transparent 45%), #090b10',
      'matrix-terminal': 'radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.12), transparent 45%), #050d0a',
      'drafting-blueprint': 'radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.12), transparent 45%), #060d18',
      'amber-vintage': 'radial-gradient(circle at 15% 15%, rgba(245, 158, 11, 0.12), transparent 45%), #110c05'
    };

    container.innerHTML = `
      <div class="rounded-2xl border border-red-500/30 overflow-hidden shadow-2xl text-slate-100" style="background: ${bgStyles[this.state.bgTheme] || bgStyles['red-blueprint']}">
        <!-- Toast Notification -->
        <div id="rhcsa-quest-toast" class="hidden fixed top-16 right-6 z-50 bg-slate-900 border border-red-500/60 text-white px-4 py-2.5 rounded-xl shadow-2xl font-mono text-xs font-bold"></div>

        <!-- Google AI Studio Top Header Bar -->
        <div class="bg-[#12141C] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-red-950/60">
              🎩
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  RHEL 9 <span class="text-red-500 uppercase">RHCSA</span> Exam Quest
                </h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/50 font-bold">
                  EX200 Studio Replica
                </span>
              </div>
              <p class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                root@${this.state.vmState.hostname} • SELinux: ${this.state.vmState.selinuxMode} • ${p.completedScenarios.length}/${scenarios.length} Quests Cleared
              </p>
            </div>
          </div>

          <!-- Right Gamification & Controls -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="bg-[#0b0d13] border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-3">
              <div>
                <div class="text-[10px] font-mono text-red-400 font-bold uppercase">Level ${p.level} Administrator</div>
                <div class="w-28 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-0.5">
                  <div class="h-full bg-red-500 transition-all duration-300" style="width: ${xpPct}%"></div>
                </div>
              </div>
              <span class="text-xs font-mono font-extrabold text-amber-400">${p.xp} XP</span>
            </div>

            <!-- Backdrop Theme Selector -->
            <select id="rhcsa-bg-select" class="bg-[#161924] border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-red-500">
              <option value="red-blueprint" ${this.state.bgTheme === 'red-blueprint' ? 'selected' : ''}>🎨 RHEL Red Blueprint</option>
              <option value="matrix-terminal" ${this.state.bgTheme === 'matrix-terminal' ? 'selected' : ''}>🟢 Matrix Terminal</option>
              <option value="drafting-blueprint" ${this.state.bgTheme === 'drafting-blueprint' ? 'selected' : ''}>🔵 Drafting Blueprint</option>
              <option value="amber-vintage" ${this.state.bgTheme === 'amber-vintage' ? 'selected' : ''}>🟠 Amber Vintage</option>
            </select>

            <button id="rhcsa-layout-btn" class="px-2.5 py-1.5 rounded-lg bg-[#161924] hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 transition-all" title="Toggle Docked Side-by-Side Terminal">
              ${this.state.terminalLayout === 'docked' ? '📌 Docked Split' : '🖥️ Inline View'}
            </button>
          </div>
        </div>

        <!-- Horizontal Navigation Tab Strip (rhel9_training_terminal_tabs) -->
        <div class="bg-[#0e1017] border-b border-slate-800/90 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          ${topTabs.map(t => {
            const isActive = this.state.activeTab === t.id;
            return `
              <button class="rhcsa-top-tab-btn px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold shrink-0 border transition-all ${
                isActive
                  ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-950/50'
                  : 'bg-[#151822] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }" data-tab="${t.id}">
                ${t.label}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Main Active Viewport -->
        <div class="p-4">
          ${this.renderActiveTabView()}
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  renderActiveTabView() {
    const tab = this.state.activeTab;

    if (tab === 'dashboard') {
      return this.renderDashboardView();
    } else if (tab === 'beginners') {
      return this.renderBeginnersView();
    } else if (tab === 'terminal' || tab === 'sandbox') {
      return this.renderPracticeQuestsView();
    } else if (RHCSA_SPECIAL_LABS[tab]) {
      return this.renderSpecialRescueLabView(tab);
    } else if (tab === 'server1') {
      return this.renderServer1ExamsView();
    } else if (tab === 'etcinspector') {
      return this.renderEtcInspectorView();
    } else if (tab === 'exam') {
      return this.renderExamBattleView();
    } else if (tab === 'flashcards') {
      return this.renderFlashcardQuestView();
    } else if (tab === 'videocast') {
      return this.renderLiveCastView();
    } else if (tab === 'lookup') {
      return this.renderQuickRefView();
    }
    return this.renderPracticeQuestsView();
  },

  /**
   * 🏠 1. Profile Dashboard View
   */
  renderDashboardView() {
    const scenarios = this.getScenarios();
    const p = this.state.progress;
    return `
      <div class="space-y-4">
        <!-- Welcome Hero -->
        <div class="bg-[#12141C] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
              🐱 SYSADMIN RONIN COMPANION ACTIVE • EX200 RHEL 9.2
            </div>
            <h4 class="text-lg font-extrabold text-white">Welcome, Level ${p.level} Red Hat Administrator!</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Prepare for the <strong class="text-red-400">Red Hat Certified System Administrator (EX200) on RHEL 9</strong>. Practice all ${scenarios.length} hands-on terminal quests, 8 official syllabus walkthrough units, 10 Exam Rescue Specials (<code class="text-slate-200">rd.break</code>, LVM, SELinux, AutoFS, Podman, Systemd), and all 16 Server 1 Mock Exam tasks.
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              <button class="rhcsa-jump-tab px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all" data-target="terminal">
                💻 Start Practice Quests (${scenarios.length})
              </button>
              <button class="rhcsa-jump-tab px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold transition-all" data-target="server1">
                🖥️ Server 1 Mock Exams (16 Tasks)
              </button>
              <button class="rhcsa-jump-tab px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold transition-all" data-target="beginners">
                🐣 Beginners Guide ("I Don't Have a Clue!")
              </button>
              <button class="rhcsa-jump-tab px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-mono text-xs font-bold transition-all" data-target="etcinspector">
                📂 Vim /etc Inspector (:wq)
              </button>
            </div>
          </div>

          <div class="bg-red-950/25 border border-red-900/50 rounded-xl p-4 text-center shrink-0 min-w-[190px]">
            <div class="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">RHEL 9 SYLLABUS</div>
            <div class="text-2xl font-black text-white mt-1">EX200 Exam</div>
            <div class="text-[11px] font-mono text-emerald-400 mt-1">${p.completedScenarios.length} / ${scenarios.length} Quests Done</div>
            <div class="text-[10px] text-slate-400 mt-1">LVM • SELinux • Podman • Systemd</div>
          </div>
        </div>

        <!-- Exam Rescue Specials Grid -->
        <div>
          <div class="text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-2.5">🔥 Quick-Launch Exam Rescue Specials</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            ${Object.entries(RHCSA_SPECIAL_LABS).map(([key, spec]) => `
              <button class="rhcsa-jump-tab text-left p-3 rounded-xl bg-[#12141C] hover:bg-[#191d28] border border-slate-800 hover:border-red-500/50 transition-all" data-target="${key}">
                <div class="text-[10px] font-mono text-red-400 font-bold mb-0.5">${spec.badge}</div>
                <div class="text-xs font-bold text-white truncate">${spec.title}</div>
                <div class="text-[11px] text-slate-400 line-clamp-2 mt-1">${spec.desc}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 🐣 2. Beginners Guide ("I Don't Have a Clue!")
   */
  renderBeginnersView() {
    return `
      <div class="space-y-4">
        <div class="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Zero-to-SysAdmin Bootcamp</span>
            <h4 class="text-base font-extrabold text-white mt-1">🐣 "I Don't Have a Clue!" — Foundational Linux Mental Models</h4>
            <p class="text-xs text-slate-300">New to Linux or Red Hat? Master these 4 core mental models and test every command directly in the terminal below.</p>
          </div>
          <button id="rhcsa-beginner-claim-xp" class="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shrink-0">
            🎓 Complete Bootcamp (+100 XP)
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${RHCSA_BEGINNERS_MODULES.map(m => `
            <div class="bg-[#12141C] border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 text-sm font-bold text-white mb-1">
                  <span>${m.icon}</span>
                  <span>${m.title}</span>
                </div>
                <p class="text-xs text-emerald-400 font-mono mb-2">${m.summary}</p>
                ${m.content}
              </div>
              <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <code class="text-[11px] font-mono text-amber-300 bg-black/50 px-2 py-1 rounded">${m.practiceCmd}</code>
                <button class="rhcsa-run-sample-cmd px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-mono text-[11px] font-bold transition-all" data-cmd="${m.practiceCmd}">
                  ▶ Try in Terminal
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * 💻 3. Practice Labs (Quests), 8-Unit Objectives Walkthrough (bk), & Must-Know Survival Pack
   */
  renderPracticeQuestsView() {
    const scenarios = this.getScenarios();
    const walkthroughs = this.getWalkthroughUnits();
    const activeScen = this.getCurrentScenario();
    const subTab = this.state.sidebarSubTab;

    let leftSidebarContent = '';
    if (subTab === 'quests') {
      leftSidebarContent = `
        <div class="space-y-1.5 max-h-[470px] overflow-y-auto pr-1">
          ${scenarios.map(s => {
            const isSel = s.id === this.state.activeScenarioId && this.state.activeTab !== 'sandbox';
            const isDone = this.state.progress.completedScenarios.includes(s.id);
            const diffBadge = s.difficulty === 'Easy'
              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50'
              : s.difficulty === 'Medium'
                ? 'bg-amber-950/50 text-amber-400 border-amber-800/50'
                : 'bg-rose-950/50 text-rose-400 border-rose-800/50';
            return `
              <button class="rhcsa-select-scenario w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                isSel ? 'bg-red-950/30 border-red-500 text-white font-bold' : 'bg-[#141822] border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
              }" data-id="${s.id}">
                <div class="min-w-0 flex-1">
                  <div class="text-xs truncate">${isDone ? '✅ ' : ''}${s.title}</div>
                  <div class="text-[10px] font-mono text-slate-400">${s.category} • +${s.xpAwarded || 150} XP</div>
                </div>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${diffBadge}">${s.difficulty}</span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (subTab === 'objectives') {
      leftSidebarContent = `
        <div class="space-y-2 max-h-[470px] overflow-y-auto pr-1">
          ${walkthroughs.map(u => {
            const isExpanded = this.state.activeWalkthroughUnitId === u.id;
            return `
              <div class="rounded-xl border border-slate-800 bg-[#141822] overflow-hidden">
                <button class="rhcsa-toggle-unit w-full text-left p-2.5 flex items-center justify-between gap-2 hover:bg-slate-800/50" data-unit="${u.id}">
                  <div class="min-w-0">
                    <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-bold">${u.badge}</span>
                    <div class="text-xs font-bold text-white mt-1 truncate">${u.title}</div>
                  </div>
                  <span class="text-xs text-slate-400">${isExpanded ? '▼' : '▶'}</span>
                </button>
                ${isExpanded ? `
                  <div class="p-3 bg-[#0b0d14] border-t border-slate-800 space-y-2.5 text-xs">
                    <p class="text-[11px] text-slate-300 italic">${u.shortDesc}</p>
                    <div class="space-y-1">
                      <div class="text-[10px] font-mono font-bold text-red-400 uppercase">⚠️ MUST-KNOW Exam Traps:</div>
                      ${(u.mustKnows || []).map(mk => `<div class="p-1.5 rounded bg-red-950/25 border border-red-900/40 text-[11px] text-red-200">${mk}</div>`).join('')}
                    </div>
                    <div class="space-y-2">
                      <div class="text-[10px] font-mono font-bold text-amber-400 uppercase">Step-by-Step Commands:</div>
                      ${(u.steps || []).map((st, idx) => `
                        <div class="border-l-2 border-red-500/50 pl-2 space-y-1">
                          <div class="text-[11px] font-bold text-white">Task ${idx + 1}: ${st.title}</div>
                          <div class="text-[10px] text-slate-400">${st.desc}</div>
                          <div class="flex items-center justify-between gap-1 bg-black/60 p-1.5 rounded border border-slate-800">
                            <code class="text-[10px] font-mono text-emerald-300 break-all select-all">${st.command}</code>
                            <button class="rhcsa-run-sample-cmd px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-white text-[10px] font-mono shrink-0" data-cmd="${st.command.replace(/"/g, '&quot;')}">Run</button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      leftSidebarContent = `
        <div class="space-y-2.5 max-h-[470px] overflow-y-auto pr-1 text-xs">
          <div class="p-3 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
            <div class="font-bold text-red-400">1. Root Password Recovery (rd.break)</div>
            <div class="text-[11px] font-mono text-slate-300">mount -o remount,rw /sysroot ➜ chroot /sysroot ➜ passwd root ➜ touch /.autorelabel ➜ exit x2</div>
          </div>
          <div class="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
            <div class="font-bold text-amber-400">2. /etc/fstab Boot Panic Prevention</div>
            <div class="text-[11px] font-mono text-slate-300">Always run <code class="text-white">mount -a</code> and <code class="text-white">systemctl daemon-reload</code> before rebooting!</div>
          </div>
          <div class="p-3 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-1">
            <div class="font-bold text-sky-400">3. SELinux Context & Port Persistence</div>
            <div class="text-[11px] font-mono text-slate-300">semanage fcontext -a -t httpd_sys_content_t "/dir(/.*)?" && restorecon -Rv /dir</div>
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
            <div class="font-bold text-emerald-400">4. Rootless Podman Linger</div>
            <div class="text-[11px] font-mono text-slate-300">loginctl enable-linger username && systemctl --user enable --now container-web1.service</div>
          </div>
          <div class="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-1">
            <div class="font-bold text-purple-400">5. FirewallD Permanent Reload</div>
            <div class="text-[11px] font-mono text-slate-300">firewall-cmd --permanent --add-service=http && firewall-cmd --reload</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <!-- Left 4 Columns: Quests / Objectives / Must-Know Switcher -->
        <div class="lg:col-span-4 bg-[#12141C] border border-slate-800 rounded-2xl p-3 space-y-3">
          <div class="grid grid-cols-3 gap-1 bg-[#0b0d13] p-1 rounded-xl border border-slate-800 font-mono text-[10px] font-bold">
            <button class="rhcsa-subtab-btn py-1.5 rounded-lg transition-all ${subTab === 'quests' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}" data-subtab="quests">
              🧪 Labs (${scenarios.length})
            </button>
            <button class="rhcsa-subtab-btn py-1.5 rounded-lg transition-all ${subTab === 'objectives' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}" data-subtab="objectives">
              📋 Walkthrough
            </button>
            <button class="rhcsa-subtab-btn py-1.5 rounded-lg transition-all ${subTab === 'mustknow' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}" data-subtab="mustknow">
              🔥 Must Know
            </button>
          </div>
          ${leftSidebarContent}
        </div>

        <!-- Right 8 Columns: Mission Brief + Full RHEL 9 Interactive Terminal -->
        <div class="lg:col-span-8 space-y-3">
          ${this.renderMissionBriefCard(activeScen)}
          ${this.renderTerminalWidget(activeScen)}
        </div>
      </div>
    `;
  },

  renderMissionBriefCard(scen) {
    const patterns = scen.solutionPattern || [];
    const matchedCount = patterns.filter(rx =>
      this.state.progress.commandHistory.some(cmd => rx.test(cmd))
    ).length;

    return `
      <div class="bg-[#12141C] border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-bold">${scen.category || 'RHCSA Mission'}</span>
              <span class="text-[10px] font-mono text-amber-400 font-bold">+${scen.xpAwarded || 150} XP</span>
              ${patterns.length > 0 ? `<span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Progress: ${matchedCount}/${patterns.length} Steps Verified</span>` : ''}
            </div>
            <h4 class="text-sm sm:text-base font-extrabold text-white mt-1">${scen.title}</h4>
          </div>
          <div class="flex items-center gap-2">
            <button id="rhcsa-toggle-hints-btn" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold">
              💡 Hints (${(scen.hints || []).length})
            </button>
            <button id="rhcsa-verify-quest-btn" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-md shadow-emerald-950/50">
              ✔ Verify Solution
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${scen.description}</p>
        <div class="p-2.5 rounded-xl bg-[#090b10] border border-slate-800/90 text-xs font-mono text-sky-300">
          <strong>🎯 Objective:</strong> ${scen.objective}
        </div>
        <div id="rhcsa-quest-hints-drawer" class="hidden p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-xs font-mono text-amber-200">
          <div class="text-[10px] uppercase font-bold text-amber-400">Step-by-Step Hints (Click any command to execute):</div>
          ${(scen.hints || []).map(h => `<div class="text-[11px]">• ${h}</div>`).join('')}
        </div>
      </div>
    `;
  },

  /**
   * 🔑 4. Exam Rescue Specials (rd.break, LVM, Disk & Swap, SELinux, AutoFS, SSH, Repo, Firewall, Podman, Systemd & NTP)
   */
  renderSpecialRescueLabView(labKey) {
    const spec = RHCSA_SPECIAL_LABS[labKey] || RHCSA_SPECIAL_LABS.rdbreak;
    const d = this.state.vmState.daemons;

    // Extra Systemd & NTP Live Telemetry Banner (from Google AI Studio bundle!)
    let systemdTelemetryHtml = '';
    if (labKey === 'systemdlab') {
      const chronyActive = d['chronyd.service']?.activeState === 'active';
      const legacyMasked = d['legacy-service.service']?.enabledState === 'masked';
      systemdTelemetryHtml = `
        <div class="bg-[#12141C] border border-slate-800 p-3.5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-2.5 rounded-lg bg-[#0b0d14] border border-slate-800/80">
            <div class="text-[10px] font-mono uppercase text-slate-400 font-bold">⏰ Local Time Daemon</div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-mono font-bold ${chronyActive ? 'text-emerald-400' : 'text-rose-400'}">chronyd: ${chronyActive ? 'ACTIVE (enabled)' : 'INACTIVE'}</span>
              <span class="w-2.5 h-2.5 rounded-full ${chronyActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}"></span>
            </div>
          </div>
          <div class="p-2.5 rounded-lg bg-[#0b0d14] border border-slate-800/80">
            <div class="text-[10px] font-mono uppercase text-slate-400 font-bold">🛡️ Telemetry Daemon</div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-xs font-mono font-bold ${legacyMasked ? 'text-emerald-400' : 'text-amber-400'}">legacy-service: ${d['legacy-service.service'].enabledState.toUpperCase()} (${d['legacy-service.service'].activeState})</span>
              <span class="w-2.5 h-2.5 rounded-full ${legacyMasked ? 'bg-slate-500' : 'bg-amber-500 animate-pulse'}"></span>
            </div>
          </div>
          <div class="p-2.5 rounded-lg bg-[#0b0d14] border border-slate-800/80 flex flex-col justify-between">
            <div class="text-[10px] font-mono uppercase text-slate-400 font-bold">🔄 Reboot & Persistence Check</div>
            <button id="rhcsa-reboot-host-btn" class="mt-1 w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all">
              🔄 Reboot Host & Verify Persistence
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div class="lg:col-span-4 bg-[#12141C] border border-slate-800 rounded-2xl p-4 space-y-3">
          <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">${spec.badge}</span>
          <h4 class="text-base font-extrabold text-white">${spec.title}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">${spec.desc}</p>

          <div class="space-y-2 pt-2 border-t border-slate-800">
            <div class="text-[10px] font-mono uppercase text-amber-400 font-bold">Interactive Verification Checklist:</div>
            ${spec.checklist.map((item, idx) => {
              const done = this.state.progress.commandHistory.some(c => item.pattern.test(c));
              return `
                <div class="p-2.5 rounded-xl border ${done ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-[#0b0d14] border-slate-800'} space-y-1">
                  <div class="flex items-center justify-between text-xs font-bold ${done ? 'text-emerald-300' : 'text-slate-200'}">
                    <span>${done ? '✅' : `${idx + 1}.`} ${item.label}</span>
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <code class="text-[10px] font-mono text-red-300 select-all">${item.cmd}</code>
                    <button class="rhcsa-run-sample-cmd px-2 py-0.5 rounded bg-red-600/25 hover:bg-red-600 text-white font-mono text-[10px] shrink-0" data-cmd="${item.cmd.replace(/"/g, '&quot;')}">Run</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="lg:col-span-8 space-y-3">
          ${systemdTelemetryHtml}
          ${this.renderTerminalWidget({
            id: labKey,
            title: spec.title,
            solutionPattern: spec.checklist.map(c => c.pattern),
            xpAwarded: 200
          })}
        </div>
      </div>
    `;
  },

  /**
   * 🖥️ 5. Server 1 Mock Exams (16 Interactive Tasks)
   */
  renderServer1ExamsView() {
    const activeTask = RHCSA_SERVER1_TASKS.find(t => t.id === this.state.activeServer1TaskId) || RHCSA_SERVER1_TASKS[0];
    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div class="lg:col-span-4 bg-[#12141C] border border-slate-800 rounded-2xl p-3 space-y-2">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs font-mono font-bold uppercase text-red-400">🖥️ Server 1 Exam Tasks (16)</span>
            <span class="text-[10px] font-mono text-slate-400">EX200 Mock Server</span>
          </div>
          <div class="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            ${RHCSA_SERVER1_TASKS.map(t => {
              const isSel = t.id === activeTask.id;
              const isDone = this.state.progress.completedScenarios.includes(`server1-${t.id}`);
              return `
                <button class="rhcsa-select-s1-task w-full text-left px-3 py-2 rounded-lg border font-mono text-xs transition-all flex items-center justify-between ${
                  isSel ? 'bg-red-600/25 border-red-500 text-white font-bold' : 'bg-[#151822] border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                }" data-task="${t.id}">
                  <span class="truncate">${isDone ? '✅ ' : ''}${t.name}</span>
                  <span class="text-[10px] text-amber-400 shrink-0">+${t.xp} XP</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="lg:col-span-8 space-y-3">
          <div class="bg-[#12141C] border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">SERVER 1 EXAM TASK #${activeTask.num} • ${activeTask.category}</span>
              <span class="text-xs font-mono font-bold text-amber-400">+${activeTask.xp} XP</span>
            </div>
            <h4 class="text-base font-extrabold text-white">${activeTask.name}</h4>
            <p class="text-xs text-slate-300 leading-relaxed">${activeTask.prompt}</p>
            <div class="p-2.5 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <div class="text-[10px] font-mono uppercase text-amber-400 font-bold">Reference Solution Commands (Click to Run):</div>
              ${activeTask.hints.map(h => `
                <div class="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
                  <code class="text-emerald-300 select-all">${h}</code>
                  <button class="rhcsa-run-sample-cmd px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-white text-[10px]" data-cmd="${h.replace(/"/g, '&quot;')}">Run</button>
                </div>
              `).join('')}
            </div>
          </div>

          ${this.renderTerminalWidget({
            id: `server1-${activeTask.id}`,
            title: activeTask.name,
            solutionPattern: activeTask.patterns,
            xpAwarded: activeTask.xp
          })}
        </div>
      </div>
    `;
  },

  /**
   * 📂 6. Interactive Vim /etc Configuration Inspector (:wq)
   */
  renderEtcInspectorView() {
    const files = Object.keys(this.state.vmState.etcFiles);
    const activeFile = this.state.activeEtcFile || files[0];
    const content = this.state.vmState.etcFiles[activeFile] || '';

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div class="lg:col-span-4 bg-[#12141C] border border-slate-800 rounded-2xl p-3 space-y-2">
          <div class="text-xs font-mono font-bold uppercase text-amber-400 px-1">📂 /etc Configuration Files</div>
          <p class="text-[11px] text-slate-400 px-1">Inspect and edit live RHEL 9 configuration files using the simulated Vi/Vim editor.</p>
          <div class="space-y-1">
            ${files.map(f => `
              <button class="rhcsa-etc-file-btn w-full text-left px-3 py-2 rounded-lg font-mono text-xs border transition-all ${
                f === activeFile ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-[#151822] border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }" data-file="${f}">
                📄 ${f}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-8 bg-[#0b0d14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div class="bg-[#141722] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between font-mono text-xs">
            <span class="text-amber-400 font-bold">📝 Simulated Vi/Vim Editor — ${activeFile}</span>
            <div class="flex items-center gap-2">
              <button id="rhcsa-etc-save-btn" class="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs">
                💾 Save File (:wq)
              </button>
            </div>
          </div>
          <textarea id="rhcsa-etc-textarea" class="w-full h-80 p-4 bg-[#07090e] text-amber-100 font-mono text-xs focus:outline-none resize-none leading-relaxed" spellcheck="false">${content}</textarea>
          <div class="px-4 py-2 bg-[#12141C] border-t border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
            <span>-- INSERT MODE -- (Changes persist to virtual filesystem for mount -a, sshd, chronyd, and sudoers checks)</span>
            <span class="text-emerald-400">UTF-8 • UNIX (LF)</span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * ⚔️ 7. Exam Battle Mode
   */
  renderExamBattleView() {
    const cards = this.getFlashcards();
    const idx = this.state.battleIdx % Math.max(1, cards.length);
    const current = cards[idx] || {
      question: 'How do you recover a lost root password in RHEL 9 on system startup?',
      answer: 'Append "rd.break" to the kernel line at boot, remount /sysroot as read-write, chroot, and set passwd.',
      category: 'System Recovery & Boot',
      explanation: 'Interrupt GRUB, append rd.break, mount -o remount,rw /sysroot, chroot /sysroot, passwd, touch /.autorelabel.'
    };

    return `
      <div class="max-w-3xl mx-auto bg-[#12141C] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30">
            ⚔️ EX200 Boss Battle • Challenge ${idx + 1} of ${cards.length}
          </span>
          <span class="text-xs font-mono text-amber-400 font-bold">Battle Score: ${this.state.battleScore} pts</span>
        </div>
        <div class="p-4 rounded-xl bg-[#090b10] border border-slate-800">
          <div class="text-[10px] font-mono uppercase text-slate-400 mb-1">${current.category}</div>
          <div class="text-base font-bold text-white">${current.question}</div>
        </div>
        <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div class="text-xs font-mono font-bold text-emerald-400">✔ Certified Command / Resolution:</div>
          <div class="text-sm font-mono text-white bg-black/50 p-2.5 rounded border border-slate-800 select-all">${current.answer}</div>
          <p class="text-xs text-slate-300 leading-relaxed">${current.explanation}</p>
        </div>
        <div class="flex items-center justify-between pt-2">
          <button id="rhcsa-battle-prev" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs">← Previous</button>
          <button id="rhcsa-battle-strike" class="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold">⚔️ Strike & Claim +50 XP →</button>
        </div>
      </div>
    `;
  },

  /**
   * 📚 8. Flashcard Quest View
   */
  renderFlashcardQuestView() {
    const cards = this.getFlashcards();
    const idx = this.state.flashcardIdx % Math.max(1, cards.length);
    const card = cards[idx] || { question: 'Default firewalld zone?', answer: 'public zone', category: 'Security', explanation: '' };
    const flipped = this.state.flashcardFlipped;

    return `
      <div class="max-w-2xl mx-auto py-2 space-y-4">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>RHCSA FLASHCARD ${idx + 1} OF ${cards.length} (${card.category})</span>
          <span class="text-amber-400">CLICK CARD TO FLIP (+25 XP)</span>
        </div>
        <div id="rhcsa-fc-card" class="cursor-pointer min-h-[210px] p-6 rounded-2xl border transition-all flex flex-col justify-between ${
          flipped ? 'bg-[#0c1f17] border-emerald-500/50' : 'bg-[#12141C] border-red-500/40'
        }">
          <div class="text-[10px] font-mono uppercase font-bold ${flipped ? 'text-emerald-400' : 'text-red-400'}">
            ${flipped ? '✔ CERTIFIED RHCSA ANSWER' : '❓ EXAM PROMPT'}
          </div>
          <div class="text-base font-bold text-white my-3">
            ${flipped ? card.answer : card.question}
          </div>
          ${flipped ? `<p class="text-xs text-slate-300 leading-relaxed">${card.explanation}</p>` : '<div class="text-xs text-slate-500 font-mono">Click to flip and reveal explanation...</div>'}
        </div>
        <div class="flex items-center justify-between">
          <button id="rhcsa-fc-prev" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-mono text-xs">← Previous</button>
          <button id="rhcsa-fc-flip" class="px-5 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold">⟳ Flip Card</button>
          <button id="rhcsa-fc-next" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 font-mono text-xs">Next Card →</button>
        </div>
      </div>
    `;
  },

  /**
   * 📺 9. Live Terminal Cast View
   */
  renderLiveCastView() {
    return `
      <div class="bg-[#12141C] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">📺 Animated Walkthrough Casts</span>
            <h4 class="text-base font-extrabold text-white mt-1">Live Terminal Replay Theatre</h4>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div class="p-3.5 rounded-xl bg-[#090b10] border border-slate-800 space-y-2">
            <div class="text-red-400 font-bold">Cast 1: rd.break Password Reset</div>
            <pre class="text-[11px] text-slate-300 whitespace-pre-wrap">switch_root:/# mount -o remount,rw /sysroot
switch_root:/# chroot /sysroot
sh-5.1# passwd root
sh-5.1# touch /.autorelabel
sh-5.1# exit && exit</pre>
          </div>
          <div class="p-3.5 rounded-xl bg-[#090b10] border border-slate-800 space-y-2">
            <div class="text-emerald-400 font-bold">Cast 2: LVM Creation & Online Resize</div>
            <pre class="text-[11px] text-slate-300 whitespace-pre-wrap"># pvcreate /dev/sdb
# vgcreate vg_data /dev/sdb
# lvcreate -L 2G -n lv_app vg_data
# mkfs.xfs /dev/vg_data/lv_app
# lvextend -r -L +1G /dev/vg_data/lv_app</pre>
          </div>
          <div class="p-3.5 rounded-xl bg-[#090b10] border border-slate-800 space-y-2">
            <div class="text-sky-400 font-bold">Cast 3: Rootless Podman Systemd</div>
            <pre class="text-[11px] text-slate-300 whitespace-pre-wrap">$ podman run -d --name web1 -p 8080:80 nginx
$ loginctl enable-linger administrator
$ podman generate systemd --name web1 --files --new
$ systemctl --user enable --now container-web1</pre>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 🔍 10. RHCSA QuickRef View
   */
  renderQuickRefView() {
    const refs = [
      { domain: 'LVM & Storage', cmd: 'pvcreate /dev/sdb && vgcreate vg0 /dev/sdb && lvcreate -L 2G -n lv1 vg0', desc: 'Full LVM stack initialization' },
      { domain: 'LVM Extend', cmd: 'lvextend -r -L +1G /dev/vg0/lv1', desc: 'Extend LV and resize XFS/EXT4 online (-r)' },
      { domain: 'SELinux Port', cmd: 'semanage port -a -t http_port_t -p tcp 8282', desc: 'Allow HTTP daemon to bind TCP 8282' },
      { domain: 'SELinux Path', cmd: 'semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?" && restorecon -Rv /web', desc: 'Persistently relabel custom web root' },
      { domain: 'FirewallD', cmd: 'firewall-cmd --permanent --add-service=http && firewall-cmd --reload', desc: 'Open service permanently and reload' },
      { domain: 'AutoFS', cmd: 'echo "/shares /etc/auto.shares --timeout=60" >> /etc/auto.master && systemctl enable --now autofs', desc: 'On-demand NFS automounter' },
      { domain: 'Podman Systemd', cmd: 'podman generate systemd --name web1 --files --new && systemctl --user enable --now container-web1', desc: 'Rootless container boot persistence' },
      { domain: 'NetworkManager', cmd: 'nmcli con mod enp1s0 ipv4.addresses 10.0.2.15/24 ipv4.gateway 10.0.2.2 ipv4.dns 8.8.8.8 ipv4.method manual && nmcli con up enp1s0', desc: 'Static IPv4 configuration' }
    ];
    return `
      <div class="bg-[#12141C] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div class="text-xs font-mono font-bold uppercase text-amber-400">🔍 RHCSA EX200 High-Yield Command QuickRef</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${refs.map(r => `
            <div class="p-3 rounded-xl bg-[#090b10] border border-slate-800 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono text-red-400 font-bold uppercase">${r.domain}</span>
                <span class="text-[10px] text-slate-400">${r.desc}</span>
              </div>
              <code class="block text-xs font-mono text-emerald-300 select-all break-all">${r.cmd}</code>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Shared Full-Featured RHEL 9 Terminal Emulator + Simulated Vi Modal Editor
   */
  renderTerminalWidget(activeScen) {
    if (this.state.viEditorFile) {
      return `
        <div class="bg-[#07090E] border border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl font-mono">
          <div class="bg-[#161720] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-400">📝 Simulated Vi Text Editor — Editing ${this.state.viEditorFile}</span>
            <div class="flex items-center gap-2">
              <button id="rhcsa-vi-cancel-btn" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">Discard (:q!)</button>
              <button id="rhcsa-vi-save-btn" class="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold">Save File (:wq)</button>
            </div>
          </div>
          <textarea id="rhcsa-vi-textarea" class="w-full h-80 p-4 bg-[#0E0F14] text-amber-100 font-mono text-xs focus:outline-none resize-none leading-relaxed" spellcheck="false">${this.state.viEditorBuffer}</textarea>
          <div class="bg-[#12131C] border-t border-slate-800 px-4 py-1.5 text-[11px] text-slate-400">
            Edit configuration directly, then click "Save File (:wq)" to commit to virtual disk and return to shell.
          </div>
        </div>
      `;
    }

    return `
      <div class="bg-[#07090E] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono flex flex-col h-[410px]">
        <!-- Terminal Titlebar -->
        <div class="bg-[#0F111A] border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="text-slate-300 font-bold ml-1.5">root@${this.state.vmState.hostname}: ~ (${this.state.vmState.selinuxMode})</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-900/40 font-bold">EX200 Practice VM</span>
            <button id="rhcsa-term-clear-btn" class="text-[11px] text-slate-400 hover:text-white">Clear</button>
          </div>
        </div>

        <!-- Terminal Output Buffer -->
        <div id="rhcsa-term-output" class="flex-1 p-4 overflow-y-auto space-y-1 text-xs text-slate-200 select-text leading-relaxed">
          ${this.state.terminalLogs.map(line => `<div class="whitespace-pre-wrap">${line}</div>`).join('')}
        </div>

        <!-- Terminal Command Prompt -->
        <div class="bg-[#090B10] border-t border-slate-800 px-3 py-2.5 flex items-center gap-2">
          <span class="text-red-400 font-bold text-xs shrink-0 select-none">[root@${this.state.vmState.hostname.split('.')[0]} ~]#</span>
          <input type="text" id="rhcsa-term-input" class="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none" placeholder="Type RHEL 9 command (e.g. lsblk, pvcreate /dev/sdb, vim /etc/fstab, verify, help)..." autocomplete="off" spellcheck="false">
          <button id="rhcsa-term-send-btn" class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0">
            Run ⏎
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Executes a simulated RHEL 9 command against `this.state.vmState`
   */
  executeCommand(rawCmd, activeScen) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    this.state.progress.commandHistory.push(cmd);
    this.state.historyCursor = this.state.progress.commandHistory.length;
    this.saveProgress();

    const hostShort = this.state.vmState.hostname.split('.')[0];
    this.state.terminalLogs.push(`<span class="text-red-400 font-bold">[root@${hostShort} ~]#</span> <span class="text-white">${cmd}</span>`);

    if (cmd === 'clear') {
      this.state.terminalLogs = [];
      this.render(this._rootContainer);
      return;
    }

    if (cmd === 'verify') {
      this.verifyActiveScenario(activeScen);
      this.render(this._rootContainer);
      return;
    }

    // Intercept vi / vim <filepath>
    const viMatch = cmd.match(/^(?:vim|vi|nano)\s+(\S+)/);
    if (viMatch) {
      const targetFile = viMatch[1];
      this.state.viEditorFile = targetFile;
      this.state.viEditorBuffer = this.state.vmState.etcFiles[targetFile] || `# New configuration file: ${targetFile}\n`;
      this.render(this._rootContainer);
      return;
    }

    const out = this.evaluateLinuxCommand(cmd);
    if (out) {
      this.state.terminalLogs.push(out);
    }

    // Auto-check quest progress
    this.checkAutoCompletion(activeScen);
    this.render(this._rootContainer);

    const outEl = this._rootContainer?.querySelector('#rhcsa-term-output');
    if (outEl) outEl.scrollTop = outEl.scrollHeight;
    const inEl = this._rootContainer?.querySelector('#rhcsa-term-input');
    if (inEl) inEl.focus();
  },

  evaluateLinuxCommand(cmd) {
    const vm = this.state.vmState;

    if (cmd === 'help') {
      return `<span class="text-amber-300">Available RHEL 9.2 commands: lsblk, pvs, vgs, lvs, pvcreate, vgcreate, vgchange, lvcreate, lvextend, mkfs.xfs, mkfs.ext4, mkswap, swapon, mount, df, free, fdisk, partprobe, getenforce, setenforce, semanage, restorecon, firewall-cmd, nmcli, hostnamectl, systemctl, chronyc, tuned-adm, podman, loginctl, useradd, usermod, groupadd, chage, id, chmod, chown, chgrp, setfacl, getfacl, find, tar, dnf, rpm, crontab, visudo, vim/vi, cat, grep, echo, sed, verify, clear</span>`;
    }
    if (cmd === 'whoami') return 'root';
    if (cmd.startsWith('uname')) return 'Linux rhel9-node-01.local 5.14.0-284.11.1.el9_2.x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    if (cmd.startsWith('hostnamectl set-hostname')) {
      const newHost = cmd.split(/\s+/)[2] || 'server1.rhcsa.local';
      vm.hostname = newHost;
      return `<span class="text-emerald-400">[  OK  ] Static hostname updated to ${newHost}</span>`;
    }
    if (cmd === 'hostname' || cmd === 'hostnamectl') {
      return ` Static hostname: ${vm.hostname}\n       Icon name: computer-vm\nOperating System: Red Hat Enterprise Linux 9.2 (Ootpa)\n          Kernel: Linux 5.14.0-284.11.1.el9_2.x86_64`;
    }
    if (cmd.startsWith('lsblk')) {
      return `NAME              MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda                 8:0    0   30G  0 disk \n├─sda1              8:1    0    1G  0 part /boot\n├─sda2              8:2    0   14G  0 part /\n└─sda3              8:3    0   15G  0 part \nsdb                 8:16   0    5G  0 disk \n├─sdb1              8:17   0    1G  0 part /mnt/data-store\n└─sdb2              8:18   0   50M  0 part [SWAP]\nsdc                 8:32   0   10G  0 disk `;
    }
    if (cmd.startsWith('pvcreate')) {
      const dev = cmd.split(/\s+/).pop();
      return `<span class="text-emerald-400">  Physical volume "${dev}" successfully created.</span>`;
    }
    if (cmd.startsWith('vgcreate')) {
      const parts = cmd.split(/\s+/);
      return `<span class="text-emerald-400">  Volume group "${parts[1] || 'vg_data'}" successfully created</span>`;
    }
    if (cmd.startsWith('vgchange')) {
      return `<span class="text-emerald-400">  Volume group physical extent size updated to 8.00 MiB.</span>`;
    }
    if (cmd.startsWith('lvcreate')) {
      return `<span class="text-emerald-400">  Logical volume created successfully.</span>`;
    }
    if (cmd.startsWith('lvextend')) {
      return `<span class="text-emerald-400">  Size of logical volume extended successfully.\n  meta-data=/dev/mapper/lv isize=512 agcount=4, agsize=131072 blks\n  data blocks changed -> online filesystem resize complete.</span>`;
    }
    if (cmd.startsWith('vgs')) {
      return `  VG      #PV #LV #SN Attr   VSize   VFree\n  vg0       1   2   0 wz--n-  20.00g 9.92g\n  vg_data   1   1   0 wz--n-   5.00g 2.00g`;
    }
    if (cmd.startsWith('lvs')) {
      return `  LV     VG      Attr       LSize   Pool Origin Data%\n  LV1    vg0     -wi-ao----  10.00g\n  LV2    vg0     -wi-a-----  80.00m\n  lv_app vg_data -wi-ao----   3.00g`;
    }
    if (cmd.startsWith('mkfs.xfs') || cmd.startsWith('mkfs.ext4')) {
      return `<span class="text-emerald-400">meta-data=${cmd.split(/\s+/).pop()} isize=512 agcount=4, agsize=131072 blks\nFilesystem formatted successfully.</span>`;
    }
    if (cmd.startsWith('fdisk')) {
      return `<span class="text-emerald-400">Welcome to fdisk (util-linux 2.37.4).\nCreated partition 1 (+1G) and partition 2 (+50M, type 82 Linux swap / 8e Linux LVM).\nThe partition table has been altered. Syncing disks.</span>`;
    }
    if (cmd.startsWith('partprobe')) {
      return `<span class="text-emerald-400">[  OK  ] Kernel partition table notified via partprobe.</span>`;
    }
    if (cmd.startsWith('mkswap')) {
      return `<span class="text-emerald-400">Setting up swapspace version 1, size = 50 MiB (52424704 bytes)\nUUID=6d88a1e2-9910-4b2c-811a-001122334455</span>`;
    }
    if (cmd.startsWith('swapon')) {
      return `<span class="text-emerald-400">NAME      TYPE      SIZE USED PRIO\n/dev/sdb2 partition  50M   0B   -2</span>`;
    }
    if (cmd === 'getenforce') {
      return vm.selinuxMode;
    }
    if (cmd.startsWith('setenforce')) {
      vm.selinuxMode = cmd.includes('0') ? 'Permissive' : 'Enforcing';
      return `<span class="text-emerald-400">[  OK  ] SELinux mode set to ${vm.selinuxMode}</span>`;
    }
    if (cmd.startsWith('semanage port -a')) {
      const port = cmd.split(/\s+/).pop();
      if (!vm.selinuxPorts.includes(port)) vm.selinuxPorts.push(port);
      return `<span class="text-emerald-400">[  OK  ] SELinux policy updated: TCP port ${port} added to http_port_t.</span>`;
    }
    if (cmd.includes('semanage port -l')) {
      return `http_port_t                    tcp      ${vm.selinuxPorts.join(', ')}`;
    }
    if (cmd.startsWith('semanage fcontext')) {
      return `<span class="text-emerald-400">[  OK  ] File context pattern registered in /etc/selinux/targeted/contexts/files/file_contexts.local</span>`;
    }
    if (cmd.startsWith('restorecon')) {
      return `<span class="text-emerald-400">Relabeled ${cmd.split(/\s+/).pop()} from unlabeled_t to httpd_sys_content_t</span>`;
    }
    if (cmd.startsWith('firewall-cmd')) {
      return `<span class="text-emerald-400">success</span>`;
    }
    if (cmd.startsWith('nmcli')) {
      return `<span class="text-emerald-400">Connection 'enp1s0' (4f5e27a1-3964-41bb) successfully modified and activated.</span>`;
    }
    if (cmd.startsWith('systemctl')) {
      if (cmd.includes('enable') && cmd.includes('chronyd')) {
        vm.daemons['chronyd.service'] = { activeState: 'active', enabledState: 'enabled' };
        return `<span class="text-emerald-400">Created symlink /etc/systemd/system/multi-user.target.wants/chronyd.service -> /usr/lib/systemd/system/chronyd.service.</span>`;
      }
      if (cmd.includes('mask') && cmd.includes('legacy-service')) {
        vm.daemons['legacy-service.service'] = { activeState: 'inactive', enabledState: 'masked' };
        return `<span class="text-emerald-400">Created symlink /etc/systemd/system/legacy-service.service -> /dev/null.</span>`;
      }
      if (cmd.includes('stop') && cmd.includes('legacy-service')) {
        vm.daemons['legacy-service.service'].activeState = 'inactive';
        return `<span class="text-emerald-400">[  OK  ] Stopped legacy-service.service.</span>`;
      }
      if (cmd.includes('set-default')) {
        vm.defaultTarget = cmd.split(/\s+/).pop();
        return `<span class="text-emerald-400">Created symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/${vm.defaultTarget}.</span>`;
      }
      if (cmd.includes('get-default')) {
        return vm.defaultTarget;
      }
      return `<span class="text-emerald-400">[  OK  ] ${cmd} completed successfully.</span>`;
    }
    if (cmd.startsWith('podman')) {
      if (cmd.includes('ps')) {
        return `CONTAINER ID  IMAGE                           COMMAND               CREATED         STATUS         PORTS                   NAMES\n8f91c2d3e4a5  docker.io/library/nginx:latest  nginx -g daemon o...  18 seconds ago  Up 18 seconds  0.0.0.0:8080->80/tcp    web1`;
      }
      if (cmd.includes('generate systemd')) {
        return `<span class="text-emerald-400">container-web1.service generated in ~/.config/systemd/user/</span>`;
      }
      return `<span class="text-emerald-400">[  OK  ] Podman container operation completed: ${cmd}</span>`;
    }
    if (cmd.startsWith('tuned-adm')) {
      if (cmd.includes('recommend')) return 'virtual-guest';
      if (cmd.includes('profile ')) {
        vm.activeTunedProfile = cmd.split(/\s+/).pop();
        return `<span class="text-emerald-400">[  OK  ] Switched active tuned profile to '${vm.activeTunedProfile}'.</span>`;
      }
      return `Current active profile: ${vm.activeTunedProfile}`;
    }
    if (cmd.startsWith('mount -o remount,rw /sysroot')) {
      return `<span class="text-emerald-400">[  OK  ] /sysroot remounted read-write (rw).</span>`;
    }
    if (cmd.startsWith('chroot /sysroot')) {
      return `<span class="text-emerald-400">sh-5.1# (Entered /sysroot chroot environment)</span>`;
    }
    if (cmd.startsWith('touch /.autorelabel')) {
      return `<span class="text-emerald-400">[  OK  ] Created /.autorelabel trigger for SELinux boot relabeling.</span>`;
    }
    if (cmd.startsWith('cat ')) {
      const target = cmd.split(/\s+/)[1];
      if (vm.etcFiles[target]) return vm.etcFiles[target];
    }
    return `<span class="text-emerald-400">[  OK  ] Executed: ${cmd} (exit status 0)</span>`;
  },

  checkAutoCompletion(activeScen) {
    if (!activeScen || !activeScen.solutionPattern || !activeScen.solutionPattern.length) return;
    const allMatched = activeScen.solutionPattern.every(rx =>
      this.state.progress.commandHistory.some(cmd => rx.test(cmd))
    );
    if (allMatched && !this.state.progress.completedScenarios.includes(activeScen.id)) {
      this.state.progress.completedScenarios.push(activeScen.id);
      this.awardXp(activeScen.xpAwarded || 150, `Quest Completed: ${activeScen.title}`);
      this.state.terminalLogs.push(`<span class="text-amber-300 font-bold">🎉 MISSION ACCOMPLISHED! All ${activeScen.solutionPattern.length} RHCSA objectives verified (+${activeScen.xpAwarded || 150} XP)!</span>`);
    }
  },

  verifyActiveScenario(activeScen) {
    if (!activeScen || !activeScen.solutionPattern || !activeScen.solutionPattern.length) {
      this.state.terminalLogs.push(`<span class="text-emerald-400">✔ Sandbox verification passed!</span>`);
      return;
    }
    const missing = [];
    activeScen.solutionPattern.forEach((rx, idx) => {
      const matched = this.state.progress.commandHistory.some(cmd => rx.test(cmd));
      if (!matched) {
        const hint = (activeScen.validationHints && activeScen.validationHints[idx]) || (activeScen.hints && activeScen.hints[idx]) || `Step ${idx + 1}`;
        missing.push(hint);
      }
    });

    if (missing.length === 0) {
      if (!this.state.progress.completedScenarios.includes(activeScen.id)) {
        this.state.progress.completedScenarios.push(activeScen.id);
        this.awardXp(activeScen.xpAwarded || 150, `Verified ${activeScen.title}`);
      }
      this.state.terminalLogs.push(`<span class="text-emerald-400 font-bold">✔ VERIFICATION PASSED (100%): ${activeScen.solutionExplanation || 'All requirements satisfied.'}</span>`);
    } else {
      this.state.terminalLogs.push(`<span class="text-rose-400 font-bold">❌ VERIFICATION INCOMPLETE — Remaining steps:</span>`);
      missing.forEach(m => {
        this.state.terminalLogs.push(`<span class="text-amber-300">  • ${m}</span>`);
      });
    }
  },

  bindEvents(container) {
    // Top Tab Bar Navigation
    container.querySelectorAll('.rhcsa-top-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeTab = btn.getAttribute('data-tab');
        this.state.viEditorFile = null;
        const scen = this.getCurrentScenario();
        if (this.state.activeTab === 'terminal' || this.state.activeTab === 'sandbox') {
          this.state.terminalLogs = [...(scen.initialTerminalLogs || ['Connected to rhel9-node-01.local'])];
        }
        this.render(container);
      });
    });

    // Quick-jump buttons on Dashboard
    container.querySelectorAll('.rhcsa-jump-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeTab = btn.getAttribute('data-target');
        this.render(container);
      });
    });

    // Sidebar sub-tabs (Quests / Walkthrough / Must Know)
    container.querySelectorAll('.rhcsa-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.sidebarSubTab = btn.getAttribute('data-subtab');
        this.render(container);
      });
    });

    // Select Scenario Quest
    container.querySelectorAll('.rhcsa-select-scenario').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeScenarioId = btn.getAttribute('data-id');
        this.state.activeTab = 'terminal';
        const scen = this.getCurrentScenario();
        this.state.terminalLogs = [...(scen.initialTerminalLogs || [])];
        this.render(container);
      });
    });

    // Toggle Objectives Walkthrough Unit
    container.querySelectorAll('.rhcsa-toggle-unit').forEach(btn => {
      btn.addEventListener('click', () => {
        const uId = btn.getAttribute('data-unit');
        this.state.activeWalkthroughUnitId = this.state.activeWalkthroughUnitId === uId ? null : uId;
        this.render(container);
      });
    });

    // Select Server 1 Task
    container.querySelectorAll('.rhcsa-select-s1-task').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeServer1TaskId = btn.getAttribute('data-task');
        this.render(container);
      });
    });

    // Run Sample Command Buttons
    container.querySelectorAll('.rhcsa-run-sample-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (this.state.activeTab === 'beginners') {
          this.state.activeTab = 'sandbox';
        }
        this.executeCommand(cmd, this.getCurrentScenario());
      });
    });

    // Backdrop Theme Select
    const bgSelect = container.querySelector('#rhcsa-bg-select');
    if (bgSelect) {
      bgSelect.addEventListener('change', (e) => {
        this.state.bgTheme = e.target.value;
        this.render(container);
      });
    }

    // Layout Toggle
    const layoutBtn = container.querySelector('#rhcsa-layout-btn');
    if (layoutBtn) {
      layoutBtn.addEventListener('click', () => {
        this.state.terminalLayout = this.state.terminalLayout === 'docked' ? 'inline' : 'docked';
        this.render(container);
      });
    }

    // Hints Drawer Toggle
    const hintsBtn = container.querySelector('#rhcsa-toggle-hints-btn');
    const hintsDrawer = container.querySelector('#rhcsa-quest-hints-drawer');
    if (hintsBtn && hintsDrawer) {
      hintsBtn.addEventListener('click', () => {
        hintsDrawer.classList.toggle('hidden');
      });
    }

    // Verify Quest Button
    const verifyBtn = container.querySelector('#rhcsa-verify-quest-btn');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        this.verifyActiveScenario(this.getCurrentScenario());
        this.render(container);
      });
    }

    // Reboot Host Persistence Button (Systemd Lab)
    const rebootBtn = container.querySelector('#rhcsa-reboot-host-btn');
    if (rebootBtn) {
      rebootBtn.addEventListener('click', () => {
        const d = this.state.vmState.daemons;
        Object.keys(d).forEach(k => {
          if (d[k].enabledState === 'enabled') d[k].activeState = 'active';
          if (d[k].enabledState === 'disabled' || d[k].enabledState === 'masked') d[k].activeState = 'inactive';
        });
        this.state.terminalLogs.push(`<span class="text-amber-400 font-bold">🔄 [REBOOTING HOST rhel9-node-01.local...] Systemd initramfs -> multi-user.target reached.</span>`);
        if (d['chronyd.service'].activeState === 'active' && d['legacy-service.service'].enabledState === 'masked') {
          this.awardXp(200, 'Systemd Reboot Persistence Verified');
          this.state.terminalLogs.push(`<span class="text-emerald-400 font-bold">✔ PERSISTENCE VERIFIED: chronyd survived reboot (ACTIVE) and legacy-service remained MASKED!</span>`);
        } else {
          this.state.terminalLogs.push(`<span class="text-rose-400">⚠️ Warning: Ensure chronyd is enabled and legacy-service is masked so they survive reboot!</span>`);
        }
        this.render(container);
      });
    }

    // Simulated Vi Editor Save / Cancel (inside terminal)
    const viSaveBtn = container.querySelector('#rhcsa-vi-save-btn');
    const viCancelBtn = container.querySelector('#rhcsa-vi-cancel-btn');
    const viTextarea = container.querySelector('#rhcsa-vi-textarea');
    if (viSaveBtn && viTextarea) {
      viSaveBtn.addEventListener('click', () => {
        const file = this.state.viEditorFile;
        this.state.vmState.etcFiles[file] = viTextarea.value;
        this.state.progress.commandHistory.push(`${file} ${viTextarea.value}`);
        this.state.terminalLogs.push(`<span class="text-emerald-400">":wq" "${file}" ${viTextarea.value.split('\n').length}L, ${viTextarea.value.length}B written.</span>`);
        this.state.viEditorFile = null;
        this.checkAutoCompletion(this.getCurrentScenario());
        this.render(container);
      });
    }
    if (viCancelBtn) {
      viCancelBtn.addEventListener('click', () => {
        this.state.viEditorFile = null;
        this.render(container);
      });
    }

    // /etc Inspector Tab Save & File Selection
    container.querySelectorAll('.rhcsa-etc-file-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeEtcFile = btn.getAttribute('data-file');
        this.render(container);
      });
    });
    const etcSaveBtn = container.querySelector('#rhcsa-etc-save-btn');
    const etcTextarea = container.querySelector('#rhcsa-etc-textarea');
    if (etcSaveBtn && etcTextarea) {
      etcSaveBtn.addEventListener('click', () => {
        this.state.vmState.etcFiles[this.state.activeEtcFile] = etcTextarea.value;
        this.awardXp(40, `Saved ${this.state.activeEtcFile} (:wq)`);
      });
    }

    // Beginner Claim XP
    const begClaim = container.querySelector('#rhcsa-beginner-claim-xp');
    if (begClaim) {
      begClaim.addEventListener('click', () => {
        this.awardXp(100, 'Completed Beginners Linux Bootcamp');
        this.state.activeTab = 'terminal';
        this.render(container);
      });
    }

    // Flashcard Controls
    const fcCard = container.querySelector('#rhcsa-fc-card');
    const fcFlip = container.querySelector('#rhcsa-fc-flip');
    const fcPrev = container.querySelector('#rhcsa-fc-prev');
    const fcNext = container.querySelector('#rhcsa-fc-next');
    const flipAction = () => {
      this.state.flashcardFlipped = !this.state.flashcardFlipped;
      if (this.state.flashcardFlipped) this.awardXp(25, 'Reviewed RHCSA Flashcard');
      this.render(container);
    };
    if (fcCard) fcCard.addEventListener('click', flipAction);
    if (fcFlip) fcFlip.addEventListener('click', flipAction);
    if (fcPrev) {
      fcPrev.addEventListener('click', () => {
        const len = Math.max(1, this.getFlashcards().length);
        this.state.flashcardIdx = (this.state.flashcardIdx - 1 + len) % len;
        this.state.flashcardFlipped = false;
        this.render(container);
      });
    }
    if (fcNext) {
      fcNext.addEventListener('click', () => {
        const len = Math.max(1, this.getFlashcards().length);
        this.state.flashcardIdx = (this.state.flashcardIdx + 1) % len;
        this.state.flashcardFlipped = false;
        this.render(container);
      });
    }

    // Battle Mode Controls
    const bPrev = container.querySelector('#rhcsa-battle-prev');
    const bStrike = container.querySelector('#rhcsa-battle-strike');
    if (bPrev) {
      bPrev.addEventListener('click', () => {
        const len = Math.max(1, this.getFlashcards().length);
        this.state.battleIdx = (this.state.battleIdx - 1 + len) % len;
        this.render(container);
      });
    }
    if (bStrike) {
      bStrike.addEventListener('click', () => {
        const len = Math.max(1, this.getFlashcards().length);
        this.state.battleScore += 50;
        this.state.battleIdx = (this.state.battleIdx + 1) % len;
        this.awardXp(50, 'Exam Battle Strike');
        this.render(container);
      });
    }

    // Terminal Input & Clear
    const termInput = container.querySelector('#rhcsa-term-input');
    const termSend = container.querySelector('#rhcsa-term-send-btn');
    const termClear = container.querySelector('#rhcsa-term-clear-btn');
    if (termSend && termInput) {
      termSend.addEventListener('click', () => {
        this.executeCommand(termInput.value, this.getCurrentScenario());
      });
    }
    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.executeCommand(termInput.value, this.getCurrentScenario());
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.state.historyCursor > 0) {
            this.state.historyCursor--;
            termInput.value = this.state.progress.commandHistory[this.state.historyCursor] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.state.historyCursor < this.state.progress.commandHistory.length - 1) {
            this.state.historyCursor++;
            termInput.value = this.state.progress.commandHistory[this.state.historyCursor] || '';
          } else {
            this.state.historyCursor = this.state.progress.commandHistory.length;
            termInput.value = '';
          }
        }
      });
    }
    if (termClear) {
      termClear.addEventListener('click', () => {
        this.state.terminalLogs = ['[root@rhel9-node-01 ~]# Console cleared.'];
        this.render(container);
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.RHCSA_EXAM_QUEST_SUITE = RHCSA_EXAM_QUEST_SUITE;
}
