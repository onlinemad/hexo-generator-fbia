# hexo-generator-fbia

[![Build Status](https://travis-ci.org/hexojs/hexo-generator-feed.svg?branch=master)](https://travis-ci.org/hexojs/hexo-generator-feed)  [![NPM version](https://badge.fury.io/js/hexo-generator-feed.svg)](http://badge.fury.io/js/hexo-generator-feed) [![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-feed.svg)](https://coveralls.io/r/hexojs/hexo-generator-feed?branch=master)

Generate Facebook Instant Articles Feed feed.

## Install

``` bash
$ npm install hexo-generator-fbia --save
```

- Hexo 3: 1.x
- Hexo 2: 0.x

## Options

You can configure this plugin in `_config.yml`.

``` yaml
fbia:
  limit: 20
  path: fbia.xml
```

- **limit** - Maximum number of posts in the feed (Use `0` or `false` to show all posts)
- **path** - Feed path. (Default: fbia.xml)

## Front-matter

You can use Front-matter to add more feature of Facebook Instant Articles.

``` yaml
fbia:
  og:
    title:
    description:
    image:
  header:
    subtitle:
    kicker:
    img:
    caption:
  footer:
    credits:
    related_articles:
    -
    -
    -
  ad: false
```
