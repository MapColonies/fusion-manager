import logger from '../logger';
import Axios from 'axios';
import handleError from './errorHandler';
import {
  urlCleanResource,
  urlAddImageryResource,
} from '../config/url/proxyUrls';

export async function cleanResource(path, version = 'current') {
  logger.info(`Requesting cleaning of ${path} version ${version}`);
  const queryString = `?assetName=${path}&version=${version}`;
  const res = await Axios.get(urlCleanResource + queryString).catch(handleError);
}
