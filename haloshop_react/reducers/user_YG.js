// reducers/user_YG.js
import { produce } from 'immer';

// 액션 타입 (세션 로그인용)
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';       // 세션 로그인 요청
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';       // 세션 로그인 성공
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';       // 세션 로그인 실패

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';     // 로그아웃 요청
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';     // 로그아웃 성공
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';     // 로그아웃 실패

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';   // 내 정보 요청 (세션 유저 확인용)
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';   // 내 정보 요청 성공
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';   // 내 정보 요청 실패

// 초기 상태
export const initialState = {
  user: null,                 // 로그인된 유저 정보 (세션 로그인 유저)
  isLogin: false,             // 세션 로그인 상태 (JWT 로그인과 분리)

  logInLoading: false,
  logInError: null,
  logInDone: false,

  logOutLoading: false,
  logOutError: null,
  logOutDone: false,

  loadMyInfoLoading: false,
  loadMyInfoError: null,
  loadMyInfoDone: false,
};

// 리듀서 함수
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    // 로그인 요청
    case LOG_IN_REQUEST:
      draft.logInLoading = true;
      draft.logInError = null;
      draft.logInDone = false;
      break;

    // 로그인 성공
    case LOG_IN_SUCCESS:
      draft.logInLoading = false;
      draft.logInDone = true;
      draft.isLogin = true;
      draft.user = action.data;
      break;

    // 로그인 실패
    case LOG_IN_FAILURE:
      draft.logInLoading = false;
      draft.logInError = action.error;
      draft.isLogin = false;
      draft.user = null;
      break;

    // 로그아웃 요청
    case LOG_OUT_REQUEST:
      draft.logOutLoading = true;
      draft.logOutError = null;
      draft.logOutDone = false;
      break;

    // 로그아웃 성공
    case LOG_OUT_SUCCESS:
      draft.logOutLoading = false;
      draft.logOutDone = true;
      draft.isLogin = false;
      draft.user = null;
      draft.logInDone = false;
      break;

    // 로그아웃 실패
    case LOG_OUT_FAILURE:
      draft.logOutLoading = false;
      draft.logOutError = action.error;
      break;

    // 내 정보 요청
    case LOAD_MY_INFO_REQUEST:
      draft.loadMyInfoLoading = true;
      draft.loadMyInfoError = null;
      draft.loadMyInfoDone = false;
      break;

    // 내 정보 요청 성공
    case LOAD_MY_INFO_SUCCESS:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoDone = true;
      draft.isLogin = true;
      draft.user = action.data;
      break;

    // 내 정보 요청 실패
    case LOAD_MY_INFO_FAILURE:
      draft.loadMyInfoLoading = false;
      draft.loadMyInfoError = action.error;
      draft.isLogin = false;
      draft.user = null;
      break;

    default:
      break;
  }
});

export default reducer;
