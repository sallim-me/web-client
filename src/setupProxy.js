const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/member",
    createProxyMiddleware({
      target: "https://dev-back.sallim.me",
      changeOrigin: true,
    })
  );

  app.use(
    "/auth",
    createProxyMiddleware({
      target: "https://dev-back.sallim.me",
      changeOrigin: true,
    })
  );

  app.use(
    "/scrap",
    createProxyMiddleware({
      target: "https://dev-back.sallim.me",
      changeOrigin: true,
    })
  );

  app.use(
    "/product/buying",
    createProxyMiddleware({
      target: "https://dev-back.sallim.me",
      changeOrigin: true,
    })
  );
};
