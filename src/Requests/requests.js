import Axios from 'axios';
import {
  urlGetProjects,
  urlGetResources,
  urlSearchProjects,
  urlSearchResources,
  urlGetProject,
  urlGetResource,
} from '../Config/urls';

async function getPathContent(url, path) {
  const serachPath = path ? '?path=' + path : '';
  const projects = await Axios.get(url + serachPath);
  return projects.data;
}

export async function getProjects(path) {
  return await getPathContent(urlGetProjects, path);
}

export async function getResources(path) {
  return await getPathContent(urlGetResources, path);
}

async function getItem(rootPath, path, name, version = 0) {
  const query = version ? `?name=${name}&path=${path}&version=${version}` : `?name=${name}&path=${path}`;
  const results = await Axios.get(rootPath + query);
  return results.data;
}

export async function getProject(path, name, version = 0) {
  return await getItem(urlGetProject, path, name, version);
}

export async function getResource(path, name, version = 0) {
  return await getItem(urlGetResource, path, name, version);
}

async function search(rootPath, name) {
  const query = '?name=' + name;
  const results = await Axios.get(rootPath + query);
  return results.data;
}

export async function searchProjects(name) {
  return await search(urlSearchProjects, name);
}

export async function searchResources(name) {
  return await search(urlSearchResources, name);
}
