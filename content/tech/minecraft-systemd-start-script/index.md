---
date: "2024-12-19"
tags:
- tech
- minecraft
- systemd
---
# Simple Minecraft systemd startup script

Sometimes you just want to run a Minecraft server on your server, but you don't want to run it in a screen session, or you want to run it as a different user. This is where systemd comes in.

## Goals

* Run the Minecraft server as a different user
* Be able to stop the server
* Be able to start the server
* Be able to see the server logs
* Enable the server to start on boot
* Properly shutdown the server on system shutdown without corruption

Bash itself is not flexible enough to create a safe wrapper script. You can do things with unconnected pipes, but minecraft does not like unconnected pipes. If you try to connect a pipe, you either will be unable to capture the exit code, or make the script needlessly complicated

I came up with the following solution using a python wrapper script instead (my server is stored in `/home/minecraft/server` and the server jar is `server.jar`)

## Files

`/etc/systemd/system/minecraft.service`

```ini
[Unit]
Description=Run minecraft server
After=network.target

[Service]
Restart=always
RestartSec=5
KillMode=mixed
ExecStart=/root/server/minecraft-via-systemd
WorkingDirectory=/home/minecraft/server
User=minecraft

[Install]
WantedBy=multi-user.target
```

`/root/server/minecraft-via-systemd`

```python
#!/usr/bin/env python3
import signal
import subprocess

java_process = subprocess.Popen(["./start.sh"], stdin=subprocess.PIPE)
# java_process.stdin.write(b"op <your user name>\n")

def handle_signal(signum, frame):
  java_process.stdin.write(b"stop\n")
  java_process.stdin.flush()

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

status_code = java_process.wait()
exit(status_code)
```

We now need to define the start script for the server, in this case, I am using a simple shell script that starts the server with 1GB of memory

`/home/minecraft/server/start.sh`

```sh
#!/bin/sh -ex
exec java -Xmx1024M -Xms1024M -jar server.jar
```
After we created all these files, the last step is to enable the service, do not forge tto place your server jar in the server directory, together with a file to accept the EULA

```sh
systemctl daemon-reload # This is needed to load the new service file
systemctl enable minecraft # This will enable the service to start on boot
systemctl start minecraft # This will start the service now
journalctl -fu minecraft # This will show the logs of the server in real time, so we can see the server starting
```

## Commands

Since you might not been familiar with systemd, here are some commands to help you manage the server:

* Check the status of the server: `systemctl status minecraft`
* Start the server: `systemctl start minecraft`
* Stop the server: `systemctl stop minecraft`
* Restart the server: `systemctl restart minecraft`
* See the logs: `journalctl -u minecraft`
* See a live view of the logs: `journalctl -fu minecraft`
* Enable the server to start on boot: `systemctl enable minecraft`
* Disable the server to start on boot: `systemctl disable minecraft`
