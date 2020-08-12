export const getPathSuffix = (path) => {
  return path.substring(path.lastIndexOf('/') + 1);
};
