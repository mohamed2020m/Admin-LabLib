const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = {
    target: 'https://lablib-api.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
        [`^/categories`]: '/api/v1/category',
    }, 
}
module.exports = function(app) {
    app.use(
        '/categories',
        createProxyMiddleware(proxy)
    );
};