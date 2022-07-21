const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'express+swagger+mssql API接口文档',
    description:
      '详情接口数据'
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic'
    }
  },
  filesPattern: ['../controller/**/*.js'], // Glob pattern to find your jsdoc files
  swaggerUIPath: '/api-docs', // SwaggerUI will be render in this url. Default: '/api-docs'
  baseDir: __dirname
};

module.exports = function (app) {
  expressJSDocSwagger(app)(options);
};