import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import rootReducer from './reducer/index';
import { persistReducer } from 'redux-persist'; // Import for persistReducer

const persistConfig = {
    key: 'root', // Key name for persisted state (customizable)
    storage, // Use localStorage by default
};
const persistedReducer = persistReducer(persistConfig, rootReducer); // Apply persistReducer
const store = configureStore({
    reducer: persistedReducer,
    devTools: true, // Enable Redux DevTools Extension for debugging
});


export default store;



