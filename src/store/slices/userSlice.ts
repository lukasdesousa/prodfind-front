'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Products } from "@/types/Products/ProductsTypes";

interface UserState {
  id: string | null;
  name: string | null;
  email?: string | null;
  longitude: number | null;
  latitude: number | null;
  productsNearBy: Products[];
  userProducts?: Products[] | null;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  longitude: null,
  latitude: null,
  productsNearBy: [],
  userProducts: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ id: string, name: string, email: string, userProducts: [] }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.userProducts = action.payload.userProducts;
    },
    setProductsNearBy: (state, action: PayloadAction<{ products: Products[] }>) => {
      state.productsNearBy = action.payload.products;
    }, 
    setLongAndLat: (state, action: PayloadAction<{ latitude: number, longitude: number }>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    clearName: (state) => {
      state.name = null;
    },
  },
});

export const { setLongAndLat, clearName, setProductsNearBy, setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
