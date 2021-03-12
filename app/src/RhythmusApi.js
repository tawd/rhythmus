import Config from "./config.js";

export const rhythmus_api = (endpoint, params = {}, post = {}) => {
  params.k = Config.myApiKey;

  let get_params = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
  let url = `${Config.baseURL}/wp-json/rhythmus/v1/${endpoint}?${get_params}`;

  if (objectIsEmpty(post)) {
      return fetch(url, { method: "GET", cache: "no-cache" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      });
  } else {
      return fetch(url, { method: "POST", cache: "no-cache", body : JSON.stringify(post) })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      });
  }

  function objectIsEmpty(object) {
      return Object.keys(object).length === 0 && object.constructor === Object
  }
}
