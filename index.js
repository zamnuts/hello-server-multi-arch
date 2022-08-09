const Koa = require('koa');
const pEvent = require('p-event');
const { v4: uuidv4 } = require('uuid');

const listenIp = process.env.HTTP_IP_ADDRESS || '0.0.0.0';
const listenPort = Number(process.env.HTTP_PORT) || 3000;
const httpTimeout = Number(process.env.HTTP_TIMEOUT) || 1000 * 60;

console.log(JSON.stringify({
  message: 'server starting',
  ts: new Date(),
  listenIp,
  listenPort,
  httpTimeout,
}));

const koa = new Koa({
  maxIpsCount: 10,
  proxy: true,
});

koa.use(ctx => {
  const id = uuidv4();
  const ts = new Date();
  const {href: uri, ip, ips: xff, method} = ctx.request;
  const meta = {
    message: 'incoming request',
    ts,
    id,
    method,
    uri,
  };

  console.log(JSON.stringify({...meta, ip, xff}));
  ctx.body = meta;
});

(async () => {
  const server = koa.listen(listenPort, listenIp);
  server.setTimeout(httpTimeout);

  await pEvent(server, 'listening', {
    rejectionEvents: ['error', 'close'],
  });
  console.log(JSON.stringify({
    message: 'server listening',
    ts: new Date(),
    listenIp,
    listenPort,
    httpTimeout,
  }));
})();
