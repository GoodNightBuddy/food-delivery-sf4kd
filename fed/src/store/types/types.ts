import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { store } from '../store';
import { useDispatch } from 'react-redux';

export interface IShop {
  id: number;
  name: string;
  shop_image_url: string;
  lat: number;
  lng: number;
}

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const useAppDispatch: () => AppDispatch = useDispatch
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppSelector, useAppDispatch };
export type {
  RootState,
  AppDispatch,
};