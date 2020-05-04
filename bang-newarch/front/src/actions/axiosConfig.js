import {default as axiosBase} from 'axios';
export const API_BASE = process.env.API_HOST.toString().replace(/"/g, ``) + 'api/';
export const API_NEW = 'http://localhost:8000'
export const axios = axiosBase.create({
  baseURL: API_BASE,
  // baseURL: API_NEW,
  timeout: 20000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "admintoken": localStorage.getItem('bang-admin-token')
  },
});

export const axiosP = axiosBase.create({
  // baseURL: API_BASE,
  baseURL: API_NEW,
  timeout: 20000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    // "admintoken": localStorage.getItem('bang-admin-token')
  },
});


