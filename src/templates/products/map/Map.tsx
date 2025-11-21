'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { setLongAndLat } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function UserLocation({ range }: { range: number }) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [initialized, setInitialized] = useState(false);
    const map = useMap();
    const dispatch = useDispatch();

     useEffect(() => {
        if (!navigator.geolocation) return;

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setPosition(coords);

                dispatch(setLongAndLat({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));

                // Só centraliza a primeira vez
                if (!initialized) {
                    map.setView(coords, 15);
                    setInitialized(true);
                }
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, [map, dispatch, initialized]);

    return position ? (
        <>
            {/* Marcador da localização */}
            <Marker position={position}>
                <Popup>
                    <p>Você está aqui.</p>
                </Popup>
            </Marker>

            <Circle
                center={position}
                radius={range * 1000}
                pathOptions={{ color: "white", fillColor: "lightgrey", fillOpacity: 0.2 }}
            />
        </>
    ) : null;
}

export default function Map({ range }: { range: number }) {
    const { productsNearBy } = useAppSelector((state) => state.user);

    return (
        <MapContainer
            center={[-23.5505, -46.6333]}
            zoom={13}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <UserLocation range={range} />

            {productsNearBy && productsNearBy.length > 0 && productsNearBy.map((item, index) => (
                <Marker icon={new L.Icon({
                    iconUrl: item.imagesUrl[0],
                    iconSize: [50, 50], // tamanho do ícone
                    iconAnchor: [20, 40], // ponto que “marca” a posição no mapa
                    popupAnchor: [0, -40], // posição do popup relativo ao ícone
                })} title="Produto" key={index} position={[item.latitude, item.longitude]}>
                    <Popup interactive>
                        <Card
                            product_id={item.id}
                            sellerId={item.sellerId}
                            title={item.name}
                            description={item.description}
                            imagesUrl={item.imagesUrl[0]}
                            item_price={item.price}
                            seller_storename={item.storename}
                        />
                    </Popup>
                </Marker>
            ))
            }

        </MapContainer>
    );
}
