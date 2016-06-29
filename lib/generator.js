'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');

var md = null;

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

env.addFilter('markdown_it_fbia', function(str) {
  return md.render(str);
});

env.addFilter('ad_enable', function(str) {
  if(typeof str === 'undefined') {
    return true;
  } else if (str === false){
    return false;
  } else {
    return true;
  }
});

var fbiaTmplSrc = pathFn.join(__dirname, '../fbia.xml');
var fbiaTmpl = nunjucks.compile(fs.readFileSync(fbiaTmplSrc, 'utf8'), env);

function render(locals, config, fbiaConfig, template, tag, path) {
  var posts = locals.tags.findOne({ name: tag }).posts.sort('-date');

  if (fbiaConfig.limit) posts = posts.limit(fbiaConfig.limit);

  var url = config.url;
  if (url[url.length - 1] !== '/') url += '/';

  return template.render({
    config: config,
    url: url,
    posts: posts,
    fbia_url: config.root + path
  });
}

module.exports = function(locals) {
  var config = this.config;
  var fbiaConfig = config.fbia;
  var template = fbiaTmpl;
  var obj = [];

  if(config.markdown && config.markdown.render) {
    md = require('markdown-it')(Object.assign(config.markdown.render, { fb_figure: true }));
  } else {
    md = require('markdown-it')({ fb_figure: true });
  }

  md.use(require('markdown-it-implicit-figures'), {
    figcaption: true
  }).use(require('markdown-it-fb-figure'));

  var xml = render(locals, config, fbiaConfig, template, 'fbia', fbiaConfig.path);
  obj.push({
    path: fbiaConfig.path,
    data: xml
  });
  if(fbiaConfig.dev) {
    var path_dev = fbiaConfig.path.replace('.xml', '-dev.xml');
    var xml_dev = render(locals, config, fbiaConfig, template, 'fbia-dev', path_dev);
    obj.push({
      path: path_dev,
      data: xml_dev
    });
  }

  return obj;
};
