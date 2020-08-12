import logger from '../logger';
import Axios from 'axios';
import {
  urlGetProjects,
  urlGetResources,
  urlSearchProjects,
  urlSearchResources,
  urlGetProject,
  urlGetResource,
} from '../config/urls';

const handleError = (error) => {
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

async function getPathContent(url, path) {
  const serachPath = path ? '?path=' + path : '';
  const projects = await Axios.get(url + serachPath).catch(handleError);
  return projects.data;
}

export async function getProjects(path) {
  logger.info('Getting projects from server', { path });
  return await getPathContent(urlGetProjects, path);
}

export async function getResources(path) {
  logger.info('Getting resources from server', { path });
  return await getPathContent(urlGetResources, path);
}

async function getItem(rootPath, path, name, version = 0) {
  const query = version
    ? `?name=${name}&path=${path}&version=${version}`
    : `?name=${name}&path=${path}`;
  const results = await Axios.get(rootPath + query).catch(handleError);
  return results.data;
}

export async function getProject(path, name, version = 0) {
  logger.info('Getting project from server', {
    project_path: path,
    project_name: name,
  });
  return await getItem(urlGetProject, path, name, version);
}

export async function getResource(path, name, version = 0) {
  logger.info('Getting resource from server', {
    resource_path: path,
    resource_name: name,
  });
  return await getItem(urlGetResource, path, name, version);
}

async function search(rootPath, name) {
  const query = '?name=' + name;
  const results = await Axios.get(rootPath + query).catch(handleError);
  return results.data;
}

export async function searchProjects(name) {
  logger.info('Search request for project in server', {
    project_name: name,
  });
  return await search(urlSearchProjects, name);
}

export async function searchResources(name) {
  logger.info('Search request for resource in server', {
    resource_name: name,
  });
  return await search(urlSearchResources, name);
}
