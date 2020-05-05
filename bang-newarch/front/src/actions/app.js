/** app.js
 *  client-side controller
 *
 *  logic to process most recent action and push correct route to window
 *  e.g. push not-logged, or push /batch if batch is starting.
 *
 *  called by:
 *     ???
 */

import { history } from "../app/history";
import openSocket from "socket.io-client";
import { getUrlParams } from "../utils";
const adr = process.env.API_HOST.substr(1, process.env.API_HOST.length - 2);
export let socket = openSocket(adr);
export const listener = function(ev) {
  return (ev.returnValue = `Are you sure you want to leave?`);
};
export const INIT_SUCCESS = "INIT_SUCCESS";
export const SET_USER = "SET_USER";
export const APP_READY = "APP_READY";
export const CLEAR_REG_ERRORS = "CLEAR_ERRORS";
export const SET_LOADING = "SET_LOADING";
export const ACCOUNT_LOGOUT = "ACCOUNT_LOGOUT";
export const SET_CHAT_INFO = "SET_CHAT_INFO";
export const SET_SNACKBAR = "SET_SNACKBAR";
export const CLEAR_SNACKBAR = "CLEAR_SNACKBAR";

const getUrlVars = (url) => {
  let myJson = {};
  url
    .slice(url.indexOf("?") + 1)
    .split("&")
    .forEach((varString) => {
      const varList = varString.split("=");
      myJson[varList[0]] = varList[1];
    });
  return myJson;
};

const decodeURL = (toDecode) => {
  return unescape(toDecode && toDecode.replace(/\+/g, " "));
};

export const whoami = () => {
  return function(dispatch) {
    const token = localStorage.getItem("bang-token");
    // admintoken has to be in lower case
    const adminToken =
      getUrlParams().admintoken || localStorage.getItem("bang-admin-token");
    let link = window.location.href;

    if (link.indexOf("unsubscribe") !== -1) {
      dispatch({
        type: APP_READY,
      });

      let unsubLink = link.slice(link.indexOf("unsubscribe"));
      history.push(`/${unsubLink}`);
    } else {
      const URLvars = getUrlVars(link);
      let initData = {
        mturkId: URLvars.workerId,
        assignmentId: URLvars.assignmentId,
        hitId: URLvars.hitId,
        turkSubmitTo: decodeURL(URLvars.turkSubmitTo),
      };
      if (adminToken) {
        initData.adminToken = adminToken;
      }
}; } }

export const setLoading = (value) => {
  return (dispatch, getState) => {
    dispatch({ type: SET_LOADING, data: value });
  };
};

export const errorCatcher = (err, dispatch, msg = "Something went wrong") => {
  console.log(err);
  dispatch(setSnackbar(msg));
  dispatch(setLoading(false));
};


export const setSnackbar = (message) => {
  return {
    type: SET_SNACKBAR,
    message,
  };
};

export const clearSnackbar = (message) => {
  return {
    type: CLEAR_SNACKBAR,
  };
};

