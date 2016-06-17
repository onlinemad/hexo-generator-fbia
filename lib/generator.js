'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');
var md = require('markdown-it')();
var implicitFigures = require('markdown-it-implicit-figures');

md.use(implicitFigures, {
  figcaption: true
});

// var assign          = require('markdown-it/lib/common/utils').assign;
// var has             = require('markdown-it/lib/common/utils').has;
// var unescapeMd      = require('markdown-it/lib/common/utils').unescapeMd;
// var replaceEntities = require('markdown-it/lib/common/utils').replaceEntities;
// var escapeHtml      = require('markdown-it/lib/common/utils').escapeHtml;

// var defaultRender = md.renderer.rules.image;

// md.renderer.rules.image = function (tokens, idx, options, env, self) {
//   var token = tokens[idx];
//   var src = token.attrIndex('src');
//   var title = token.attrIndex('title');


//   var src = ' src="' + escapeHtml(token.attrs[src][1]) + '"';
//   var title = token.attrs[title] ? (' title="' + escapeHtml(token.attrs[title][1]) + '"') : '';
//   var caption = self.renderInlineAsText(tokens, options, env);
//   var suffix = options.xhtmlOut ? ' /' : '';

//   return '<figure><img' + src + title + suffix + '><figcaption>' + caption + '</figcaption></figure>';
// };

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

env.addFilter('markdown_it_fbia', function(str) {
  return md.render(str);
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
