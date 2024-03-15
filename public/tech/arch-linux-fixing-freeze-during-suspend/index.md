---
date: "2024-03-06"
tags: ['linux', 'sleep', 'systemd']
---

# Arch Linux fixing freeze during suspend

One issue I encountered using Arch Linux, is that after some recent upgrade the system would freeze if it would go into sleep mode. This was quite annoying as it would mea you lost all your work.

With some detective work, I looked into the logs from the previous boot to see what was happening:

```text
$ journalctl --boot=-1
mrt 06 22:18:34 LAPTOP systemd-logind[2031]: The system will suspend now!
mrt 06 22:18:34 LAPTOP NetworkManager[2069]: <info>  [1709759914.0244] manager: sleep: sleep requested (sleeping: no  enabled: yes)
....
mrt 06 22:18:35 LAPTOP systemd[1]: Reached target Sleep.
mrt 06 22:18:35 LAPTOP wpa_supplicant[2147]: wlan0: CTRL-EVENT-DSCP-POLICY clear_all
mrt 06 22:18:35 LAPTOP systemd[1]: Starting System Suspend...
mrt 06 22:18:35 LAPTOP wpa_supplicant[2147]: wlan0: CTRL-EVENT-DSCP-POLICY clear_all
mrt 06 22:18:35 LAPTOP wpa_supplicant[2147]: nl80211: deinit ifname=wlan0 disabled_11b_rates=0
mrt 06 22:18:35 LAPTOP systemd-sleep[545933]: Performing sleep operation 'suspend'...
mrt 06 22:18:35 LAPTOP kernel: PM: suspend entry (s2idle)
```

Doing some research for the last line on the internet has resulted in a few reports of this: [example 1](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=783638), [example 2](https://askubuntu.com/questions/1215415/what-might-pm-trace-do-that-would-fix-a-suspend-resume-issue). [example 3](https://bbs.archlinux.org/viewtopic.php?id=290523)

To fix this bug, we need to make a new systemd unit that disables `pm_async` after startup, start by making a new systemd unit using `sudo systemctl edit --force --full disable_pm_async`, then pasting the following content:

```systemd
[Unit]
Description=Disable async PM

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=sh -c 'echo 0 > /sys/power/pm_async'

[Install]
WantedBy=multi-user.target
```

We now need to activate our new unit, we can do this using `sudo systemctl enable disable_pm_async`. If you want to apply the changes without needing to restart the current computer, we need to start the service: `sudo systemctl start disable_pm_async`.

You are now free to restart the computer and enjoy sleep mode.
