import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
  LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
  LOAD_MY_INFO_REQUEST, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE,
} from '../reducers/user_YG';

const API_BASE = 'http://localhost:8080';

// 로그인 API 호출
function loginAPI(data) {
  return axios.post(`${API_BASE}/auth/login`, data, { withCredentials: true });
}

// 로그인 사가
function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,  // 서버에서 받은 유저 정보가 들어있어야 합니다.
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

// 로그아웃 API 호출
function logoutAPI() {
  return axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
}

// 로그아웃 사가
function* logout() {
  try {
    yield call(logoutAPI);
    yield put({ type: LOG_OUT_SUCCESS });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

// 내 정보 불러오기 API 호출
function loadMyInfoAPI() {
  return axios.get(`${API_BASE}/user/me`, { withCredentials: true });
}

// 내 정보 불러오기 사가
function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data.account,  // 서버 응답 구조에 맞게 수정 필요
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response?.data || err.message,
    });
  }
}

// 각 액션을 감시하는 Watcher 함수들
function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}
function* watchLogout() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}
function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

// Root saga
export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchLoadMyInfo),
  ]);
}
