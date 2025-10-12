export const getCookie = (name: string) => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");

    if (key === name) {
      return value;
    }
  }
  return null;
};

export const removeToken = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0;`;
  document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0;`;
  document.cookie = `${name}=; path=/; domain=.${window.location.hostname}; max-age=0;`;
};
