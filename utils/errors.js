const httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVICE_UNAVAILABLE: 503,
};

class BaseError extends Error {
  constructor(name, statusCode, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

class Api400Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = 'Bad request.'
  ) {
    super(name, statusCode, description);
  }
}

class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = 'Not found.'
  ) {
    super(name, statusCode, description);
  }
}

class Api503Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.SERVICE_UNAVAILABLE,
    description = 'Service unavailable'
  ) {
    super(name, statusCode, description);
  }
}

module.exports = {
  Api400Error,
  Api404Error,
  Api503Error,
};
