const messages = {
  200: {
    success: {
      message: "This is a successful response"
    },
    badRequest: {
      message: "This request has the required parameters"
    },
    unauthorized: {
      message: "You have successfully viewed the content"
    },
  },
  400: {
    id: "badRequest",
    message: "Missing valid query parameter set to true"
  },
  401: {
    id: "unauthorized",
    message: "Missing loggedIn query parameter set to yes"
  },
  403: {
    id: "forbidden",
    message: "You do not have access to this content."
  },
  404: {
    id: "notFound",
    message: "The page you are looking for was not found."
  },
  500: {
    id: "internalError",
    message: "Internal Server Error. Something went wrong."
  },
  501: {
    id: "notImplemented",
    message: "A get request for this page has not been implemented yet.  Check again later for updated content."
  }
};

const toXMLString = (messageId, url = null) => {
  let returnValue;

  if (messageId === 200) {
    returnValue = '<response>';
    returnValue = `${returnValue} <message>${messages[messageId][url].message}</message>`;
    returnValue = `${returnValue} </response>`;
  } else {
    returnValue = '<response>';
    returnValue = `${returnValue} <message>${messages[messageId].message}</message>`;
    returnValue = `${returnValue} <id>${messages[messageId].id}</id>`;
    returnValue = `${returnValue} </response>`;
  }

  return returnValue;
};

const respond = (request, response, status, params) => {

  let tempParams = params;
  let typedResponse;

  if (status === 200) {
    if (tempParams.acceptHeader === 'text/xml') {
      typedResponse = toXMLString(status, tempParams.url.substring(1));
    } else {
      typedResponse = JSON.stringify(messages[status][tempParams.url.substring(1)]);
      tempParams.acceptHeader = 'application/json';
    }
  } else {
    if (tempParams.acceptHeader === 'text/xml') {
      typedResponse = toXMLString(status);
    } else {
      typedResponse = JSON.stringify(messages[status]);
      tempParams.acceptHeader = 'application/json';
    }
  }

  response.writeHead(status, {'Content-Type': tempParams.acceptHeader});
  response.write(typedResponse);
  response.end();
};

const respondMeta = (request, response, status, params) => {
  const headers = {
    'Content-Type': params.acceptHeader
  };

  response.writeHead(status, headers);
  response.end();
};

const success = (request, response, params) => {
  respond(request, response, 200, params);
};

const successMeta = (request, response, params) => {
  return respondMeta(request, response, 200, params);
};

const badRequest = (request, response, params) => {
  let returnValue;

  if (!params.properties.valid || params.properties.valid !== 'true') {
    returnValue = respond(request, response, 400, params);
  } else {
    returnValue = respond(request, response, 200, params);
  }

  return returnValue;
};

const badRequestMeta = (request, response, params) => {
  return respondMeta(request, response, 400, params);
};

const unauthorized = (request, response, params) => {
  let returnValue;

  if (!params.properties.loggedIn || params.properties.loggedIn !== 'yes') {
    returnValue = respond(request, response, 401, params);
  } else {
    returnValue = respond(request, response, 200, params);
  }

  return returnValue;
};

function unauthorizedMeta (request, response, params) {
  return respondMeta(request, response, 401, params);
}

function forbidden (request, response, params) {
  return respond(request, response, 403, params);
}

function forbiddenMeta (request, response, params) {
  return respondMeta(request, response, 403, params);
}

function internal(request, response, params) {
  return respond(request, response, 500, params);
}

function internalMeta(request, response, params) {
  return respondMeta(request, response, 500, params);
}

function notImplemented(request, response, params) {
  return respond(request, response, 501, params);
}

function notImplementedMeta(request, response, params) {
  return respondMeta(request, response, 501, params);
}

function notFound(request, response, params) {
  return respond(request, response, 404, params);
}

function notFoundMeta(request, response, params) {
  return respondMeta(request, response, 404, params);
}

module.exports = {
  success,
  successMeta,
  badRequest,
  badRequestMeta,
  unauthorized,
  unauthorizedMeta,
  forbidden,
  forbiddenMeta,
  internal,
  internalMeta,
  notImplemented,
  notImplementedMeta,
  notFound,
  notFoundMeta,
};
