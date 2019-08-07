[![npm version](https://img.shields.io/npm/v/clipbrd-share.svg)](https://www.npmjs.org/package/clipbrd-share)
[![downloads](https://img.shields.io/npm/dm/clipbrd-share.svg)](https://www.npmjs.org/package/clipbrd-share)
[![Build Status](https://travis-ci.org/harttle/clipbrd-share.svg?branch=master)](https://travis-ci.org/harttle/clipbrd-share)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/harttle/clipbrd-share)

## Features

* Multiple platforms: OSX, Linux
* Multiple MIMEs: text/plain, image/png
* Desktop notifycation integrated

![image](./doc/image-received-osx.png)

![image](./doc/image-received.png)

## Dependencies

**OSX**: all dependencies are bundled into this repo, no additional dependencies.

**Linux**：[xclip](https://www.archlinux.org/packages/extra/x86_64/xclip/)

```bash
pacman -S xclip
```

## Usage

Install:

```bash
npm i -g clipbrd-share
```

Start the server:

```bash
PORT=3000 clipbrd-share-server
```

Start the client on another machine:

```bash
URL=http://example.com:3000 clipbrd-share-client
```

## Thanks

* Image copy/paste binaries are built from: https://github.com/moicci/pngpaste
* Desktop notifications are provided by: https://www.npmjs.com/package/node-notifier
