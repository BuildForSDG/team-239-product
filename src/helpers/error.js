/**
 * @module
 */
export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

/**
 * Handle thrown errors
 * @param {object} err
 * @param {object} res
 */
export const handleError = (err, res) => {
  const { statusCode, message } = err;
  return res.status(statusCode).send({
    error: message
  });
};