import { MCLogger } from '@map-colonies/mc-logger';
import service from '../package.json';
import config from './config/logger.json';

const logger = new MCLogger(config, service);

export default logger;
