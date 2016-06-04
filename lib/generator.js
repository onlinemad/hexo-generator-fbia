'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

var fbiaTmplSrc = pathFn.join(__dirname, '../fbia.xml');
var fbiaTmpl = nunjucks.compile(fs.readFileSync(fbiaTmplSrc, 'utf8'), env);

module.exports = function(locals) {
  var config = this.config;
  var fbiaConfig = config.fbia;
  var template = fbiaTmpl;

  var posts = locals.tags.findOne({ name: 'fbia' } ).posts.sort('-date');

  if (fbiaConfig.limit) posts = posts.limit(fbiaConfig.limit);

  var url = config.url;
  if (url[url.length - 1] !== '/') url += '/';

  var xml = template.render({
    config: config,
    url: url,
    posts: posts,
    fbia_url: config.root + fbiaConfig.path
  });

  return {
    path: fbiaConfig.path,
    data: xml
  };
};
