export default function getApi() {
  return process.env['NODE_ENV'] === 'development'
    ? 'http://10.0.0.93:3333'
    : 'https://api.myjumpdata.fediv.me';
}
