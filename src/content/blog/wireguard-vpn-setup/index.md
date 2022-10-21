---
date: "2022-07-25"
tags: ["blog", "devops", "wireguard"]
extraTags: []
---
# Setting up Wireguard

It is time to learn something new again, his time it is the VPN solution Wireguard

## Internals

Wireguard is based around a TUN network interface. This network interface has
multiple properties:

```
#wg show wg0
interface: wg0
  public key: jyhyusgqxdzT732wlJa7nQCMqUvQnpC//SUjCBAsniI=
  private key: (hidden)
  listening port: 47761
  fwmark: 0xca6c

peer: WjzcgNo1uYO0KoThtCz6ecgA2a33HJ5Lu5ZBHpIXIDw=
  preshared key: (hidden)
  endpoint: server.example.com:65
  allowed ips: 0.0.0.0/0, ::/0
```

The public and private keys are used for encryption of the traffic. The
pre-shared key is a key that is the same between all sides.

An single node running wireguard can connect to 1 or multiple peers.

## Setting up

The simplest way to get started is using a config generator:
<https://www.wireguardconfig.com/>. The only thing you have to do on your own is
to fill in a proper endpoint address for your server. Note that this tool does
not support IPv6 at te moment.

After generating, you end up with the following configs:

Server:

```wireguard
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = uC3+UvH6E9bfnfBmp2/kp+7Cw5S65HqfctwEKu5LjGY=
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = /KvNJyC34ReG0SKRZQuN21A7EWTiu4Uq5BNGxXHZOg0=
PresharedKey = JdPhh6blQVCzTEmVqfN2VBSyslXnfO1EB3t2K0cHgC8=
AllowedIPs = 10.0.0.2/32

[Peer]
PublicKey = tP7VMs/BYyVx3IQ8AtGx44MrBzAoadC9ltpvv/EkshQ=
PresharedKey = ZaWUEq0+XVk+S1R5p29X2Jmi58y9FYkFkaQDRJwPal8=
AllowedIPs = 10.0.0.3/32

[Peer]
PublicKey = l441NK8Lvgmgmhp50XoLA2vaHNn3j38pPm/7RfnCKjM=
PresharedKey = yLxcmg7RfokZf4ofYJXj2U7qkqZRId7kbBimz455Hjs=
AllowedIPs = 10.0.0.4/32
```

Client 1:

```
[Interface]
Address = 10.0.0.2/24
ListenPort = 51820
PrivateKey = yNLWzSNZD5VcIvdVLwLLhUWJP2HfuQEhjYZE1b2SgEw=

[Peer]
PublicKey = i5TUI0LeU91ecc4sx188N9INKVnk8GRk5kbtDLRNzRo=
PresharedKey = JdPhh6blQVCzTEmVqfN2VBSyslXnfO1EB3t2K0cHgC8=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = myserver.dyndns.org:51820
```

Repeat for the other clients

As you can see, config files are straight forward.

Now becomes the slightly harder step, actually using them. For the server, place
the server file in the directory `/etc/wireguard/`. Then enable auto start for
the vpn using
`sudo systemctl enable wg-quick@<config file name excluding .conf>` followed by
starting the VPN via
`sudo systemctl start wg-quick@<config file name excluding .conf>`.
