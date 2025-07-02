import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper } from 'next-redux-wrapper';
import user_YG from '../reducers/user_YG'; // 네이밍 맞춰서!
import userSaga from '../sagas/user_YG';
import { all } from 'redux-saga/effects'

const rootReducer = combineReducers({
  user_YG,
  // ... 다른 리듀서도 추가
});

function* rootSaga() {
  yield all([
    userSaga(),
    // ... 다른 사가도 추가
  ]);
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(sagaMiddleware))
    : composeWithDevTools(applyMiddleware(sagaMiddleware));

  const store = createStore(rootReducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === 'development' });
export default wrapper;
