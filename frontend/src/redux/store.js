import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice.js";
import authReducer from "./features/auth/authSlice.js";
import favoritesReducer from "../redux/features/favorites/favoriteSlice.js";
import cartSliceReducer from "../redux/features/cart/cartSlice.js";
import shopReducer from "../redux/features/shop/shopSlice.js";
import { getFavoritesFromLocalStorage } from "../Utils/localStorage.js";

const initialFavorites = getFavoritesFromLocalStorage() || [];

console.log('Configuring Redux store');

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavorites,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

console.log('Redux store configured');

setupListeners(store.dispatch);
console.log('Redux listeners set up');

export default store;
