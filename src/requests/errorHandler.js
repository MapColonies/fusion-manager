import logger from '../logger';

export default (error) => {
  if (error.response) {
    logger.error('Error', {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });
  } else if (error.request) {
    logger.error(`No respone from server after request ${error.request}`);
  } else {
    logger.error(
      `Error while trying to contact server. Message: ${error.message}`
    );
  }
  throw error;
};
