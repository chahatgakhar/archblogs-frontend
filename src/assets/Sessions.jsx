export const storeInSession = (key, value) => {
  return sessionStorage.setItem(key, value);
};

export const lookupInSession = (key) => {
  return sessionStorage.getItem(key);
};

export const removeFromSession = (key) => {
  return sessionStorage.removeItem(key);
};

export const logOutSession = () => {
  return sessionStorage.clear();
};
