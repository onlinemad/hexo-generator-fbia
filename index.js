/* global hexo */
'use strict';

var assign = require('object-assign');
var pathFn = require('path');

var config = hexo.config.fbia = assign({
  limit: 20
}, hexo.config.fbia);

// Set default feed path
if (!config.path) {
  config.path = 'fbia.xml';
}

// Add extension name if don't have
if (!pathFn.extname(config.path)) {
  config.path += '.xml';
}

hexo.extend.generator.register('fbia', require('./lib/generator'));
