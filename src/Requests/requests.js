import Axios from 'axios';
import {
  urlGetProjects,
  urlGetResources,
  urlSearchProjects,
  urlSearchResources,
  urlGetProject,
  urlGetResource,
} from '../Config/urls';

async function GetFromServer(url, path) {
  const serachPath = path ? '?path=' + path : '';
  const projects = await Axios.get(url + serachPath);
  return projects.data;
}

export async function GetProjects(path) {
  return await GetFromServer(urlGetProjects, path);
}

export async function GetResources(path) {
  return await GetFromServer(urlGetResources, path);
}

export async function Fetch(rootPath, path, name, version = 0) {
  const query = version ? `?name=${name}&path=${path}&version=${version}` : `?name=${name}&path=${path}`;
  const results = await Axios.get(rootPath + query);
  return results.data;
}

export async function GetProject(path, name, version = 0) {
  return await Fetch(urlGetProject, path, name, version);
}

export async function GetResource(path, name, version = 0) {
  return await Fetch(urlGetResource, path, name, version);
}

async function Search(rootPath, name) {
  const query = '?name=' + name;
  const results = await Axios.get(rootPath + query);
  return results.data;
}

export async function SearchProjects(name) {
  return await Search(urlSearchProjects, name);
}

export async function SearchResources(name) {
  return await Search(urlSearchResources, name);
}
