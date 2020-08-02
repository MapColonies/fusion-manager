const baseUrl = 'http://localhost:8000'; // 'https://gee.covid-97.com';
const urlGetProject = baseUrl + '/imagery/project/';
const urlGetResource = baseUrl + '/imagery/resource/';
const urlThumbnail = baseUrl + '/imagery/resource/image/?';
const urlGetProjects = baseUrl + '/imagery/projects/';
const urlGetResources = baseUrl + '/imagery/resources/';
const urlSearchProjects = baseUrl + '/imagery/project/search/';
const urlSearchResources = baseUrl + '/imagery/resource/search/';

module.exports = {
  urlGetProject,
  urlGetResource,
  urlThumbnail,
  urlGetProjects,
  urlGetResources,
  urlSearchProjects,
  urlSearchResources,
};
