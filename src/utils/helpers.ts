export const getNextId = () => String(Math.random()).slice(2);

export const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

export const resetHash = () => {
  document.location.hash = "";
};
