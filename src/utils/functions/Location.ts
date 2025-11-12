"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "@/store/slices/locationSlice";

export function useUserLocation() {
  const dispatch = useDispatch();
  const watcherId = useRef<number | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocalização não é suportada neste navegador.");
      return;
    }

    watcherId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        dispatch(setLocation({ latitude, longitude, accuracy }));
      },
      (error) => {
        console.error("Erro ao obter localização:", error.message);
      },
      {
        enableHighAccuracy: true, // Usa GPS se disponível
        maximumAge: 5000,         // Cache de 5 segundos
        timeout: 15000,           // Timeout de 15 segundos
      }
    );

    // Limpa o watcher ao desmontar o componente
    return () => {
      if (watcherId.current !== null) {
        navigator.geolocation.clearWatch(watcherId.current);
      }
    };
  }, [dispatch]);
}
