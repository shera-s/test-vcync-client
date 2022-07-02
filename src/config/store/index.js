import reducer from './reducer';
import {createStore,applyMiddleware} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'


const persistConfig = {
    key: 'root',
    storage,
  }

  
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer,composeWithDevTools(applyMiddleware(thunk)))
let persistor = persistStore(store)

export  {store,persistor};