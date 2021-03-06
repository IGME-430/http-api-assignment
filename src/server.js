const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  'GET': {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': responseHandler.success,
    '/badRequest': responseHandler.badRequest,
    '/unauthorized': responseHandler.unauthorized,
    '/forbidden': responseHandler.forbidden,
    '/internal': responseHandler.internal,
    '/notImplemented': responseHandler.notImplemented,
    notFound: responseHandler.notFound,
  },
  'HEAD': {
    '/success': responseHandler.successMeta,
    '/badRequest': responseHandler.badRequestMeta,
    '/unauthorized': responseHandler.unauthorizedMeta,
    '/forbidden': responseHandler.forbiddenMeta,
    '/internal': responseHandler.internalMeta,
    '/notImplemented': responseHandler.notImplementedMeta,
    notFound: responseHandler.notFoundMeta,
  }

};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const page = request.url.split('?');
  const params = {};

  console.dir(parsedUrl);
  console.dir(page);

  const acceptIndex = 0;
  params.acceptHeader = request.headers.accept.split(',')[acceptIndex];

  const urlIndex = 0;
  params.url = page[urlIndex];

  params.properties = query.parse(page[1]);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else {
    urlStruct[request.method].notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
