import { $global } from "./../main";

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
