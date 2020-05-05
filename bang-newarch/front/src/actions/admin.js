import { errorCatcher, setLoading, setSnackbar } from "./app";
import { history } from "../app/history";
import {axios, axiosP } from "./axiosConfig";
export const USERS_FETCHED = "USERS_FETCHED";
export const SWITCH_EMPTY_BATCHES_VISIBILITY =
  "SWITCH_EMPTY_BATCHES_VISIBILITY";

export function addBatch(batch) {
    return (dispatch) => {
        dispatch(setLoading(true));
        return axiosP({
            method: "post",
            url: "lesson/",
            data: batch,
        })
            .then((response) => {
                console.log('response', response)
                dispatch(setLoading(false));
                let BATCH_ADDED = "BATCH_ADDED";
                dispatch({
                    type: BATCH_ADDED,
                    data: response.data.batch,
                });
                dispatch(setSnackbar("Lesson was added"));
                history.push("/lessons");
            })
            .catch((err) => {
                errorCatcher(err, dispatch);
            });
    };
}

export function loadUserList(params) {
  return (dispatch) => {
    dispatch(setLoading(true));

    return axiosP({
      method: "get",
      url: "student/",
    })
      .then((response) => {
          console.log('response: ', response);
        dispatch(setLoading(false));
        dispatch({
          type: USERS_FETCHED,
          data: response.data,
        });
      })
      .catch((err) => {
        errorCatcher(err, dispatch);
      });
  };
}

export function snackbar(message) {
    console.log()
    return (dispatch) => {
        console.log('dispatching snack')
        dispatch(setSnackbar(message));
    }
}

