const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = {
    target: 'https://lablib-api.herokuapp.com',
    changeOrigin: true
}
module.exports = function(app) {
    app.use(
        '/category',
        createProxyMiddleware(proxy)
    );
};