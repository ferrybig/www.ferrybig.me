---
date: "2024-02-29"
tags: ["tech", "curl"]
---
# Curl header file

Curl support creations of a header file when making requests, this is quite useful for shell scripting, as some services provide metadata only via the headers. An exampe of this is the GitHub API, which provides the rate limit and pagination information in the headers.

To create a header file, you can use the `-D` flag, which will write the headers to a file. An example of this is:

```bash
curl -D headers.txt https://api.github.com/users/username
```

This will create a file called `headers.txt` with the headers of the request. If you want to see the headers in the terminal, you can use the `-i` flag, which will include the headers in the output.

```text
HTTP/2 404 
server: GitHub.com
date: Wed, 08 May 2024 08:03:22 GMT
content-type: application/json; charset=utf-8
x-github-media-type: github.v3; format=json
x-github-api-version-selected: 2022-11-28
access-control-expose-headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset
access-control-allow-origin: *
strict-transport-security: max-age=31536000; includeSubdomains; preload
x-frame-options: deny
x-content-type-options: nosniff
x-xss-protection: 0
referrer-policy: origin-when-cross-origin, strict-origin-when-cross-origin
content-security-policy: default-src 'none'
vary: Accept-Encoding, Accept, X-Requested-With
x-ratelimit-limit: 60
x-ratelimit-remaining: 57
x-ratelimit-reset: 1715156237
x-ratelimit-resource: core
x-ratelimit-used: 3
content-length: 107
x-github-request-id: 94B0:30CE68:B58094:B656A9:663B31CA
```

