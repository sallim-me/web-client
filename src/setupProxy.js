import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/member", {
      target: "https://dev-back.sallim.me",
      changeOrigin: true,
      secure: false,
    })
  );
};
