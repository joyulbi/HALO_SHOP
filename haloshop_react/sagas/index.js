import { all } from 'redux-saga/effects';
import userSaga from './user_YG';
// 필요하면 다른 사가들도 import

export default function* rootSaga() {
  yield all([
    userSaga(),
    // postSaga(),
    // adminSaga(),
    // 기타 다른 사가들
  ]);
}
