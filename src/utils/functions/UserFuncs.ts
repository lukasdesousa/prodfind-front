import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/userSlice";
import { useCallback } from "react";

export default function useSetUserInfo() {
  const dispatch = useDispatch();

  return useCallback(
    (data: { name: string, email: string, id: string, userProducts: [] }) => {
      dispatch(setUserData({ id: data.id, name: data.name, email: data.email, userProducts: data.userProducts }));
    },
    [dispatch]
  );
}
