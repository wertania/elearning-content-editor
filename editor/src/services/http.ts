import { $global } from "./../main";

/**
 * a simple wrapper around fetch´s GET
 * will add the jwt token from dataprovider if sendJwt is true
 */
export const get = async (url: string, sendJwt = false) => {
  const r = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(sendJwt && { Authorization: `${$global.jwtToken}` }),
    },
  });
  return r.json();
};

/**
 * a simple wrapper around fetch´s POST
 * will add the jwt token from dataprovider if sendJwt is true
 */
export const post = async (url: string, data: any, sendJwt = false) => {
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sendJwt && { Authorization: `${$global.jwtToken}` }),
    },
    body: JSON.stringify(data),
  });
  return r.json();
};

/**
 * a simple wrapper around fetch´s PUT
 * will add the jwt token from dataprovider if sendJwt is true
 */
export const put = async (url: string, data: any, sendJwt = false) => {
  const r = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(sendJwt && { Authorization: `${$global.jwtToken}` }),
    },
    body: JSON.stringify(data),
  });
  return r.json();
};

/**
 * a simple wrapper around fetch´s DELETE
 * will add the jwt token from dataprovider if sendJwt is true
 */
export const del = async (url: string, sendJwt = false) => {
  const r = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(sendJwt && { Authorization: `${$global.jwtToken}` }),
    },
  });
  return r.json();
};
