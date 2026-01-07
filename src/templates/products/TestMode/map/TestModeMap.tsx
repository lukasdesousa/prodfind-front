'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "./TestModeCard";
import { useDispatch } from "react-redux";
import { setLongAndLat } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";
import { TestModeProduct } from "@/types/TestMode/Map";

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

function randomNearbyLocation(
    lat: number,
    lng: number,
    radiusInMeters = 300
) {
    const radiusInDegrees = radiusInMeters / 111_320;

    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;

    const deltaLat = w * Math.cos(t);
    const deltaLng = w * Math.sin(t) / Math.cos(lat * Math.PI / 180);

    return {
        latitude: lat + deltaLat,
        longitude: lng + deltaLng,
    };
}

export default function Map({ range }: { range: number }) {
    const [products, setProducts] = useState<TestModeProduct[]>([]);
    const { latitude, longitude } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!latitude || !longitude) return;

        const baseProducts = [
            {
                id: 1,
                imageSrc: ['/images/bike.webp'],
                title: 'PlayStation 5 Seminkovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                price: 2500,
                storename: 'João Guedes',
                stock: 1,
            },
            {
                id: 2,
                imageSrc: ['/images/bike.webp'],
                title: 'PlayStation 5 Seminovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                storename: 'Lukas de Souza',
                price: 2500,
                stock: 1,
            },
            {
                id: 3,
                imageSrc: ['/images/bike.webp'],
                title: 'PlayStation 5 Seminovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                storename: 'Maria Silva',
                price: 2500,
                stock: 1,
            },
            {
                id: 4,
                imageSrc: ['/images/bike.webp'],
                title: 'PlayStation 5 Seminovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                storename: 'Carlos Pereira',
                price: 2500,
                stock: 1,
            },
            {
                id: 5,
                imageSrc: ['/images/bike.webp'],
                title: 'PlayStation 5 Seminovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                storename: 'Ana Costa',
                price: 2500,
                stock: 1,
            },
        ];

        const productsWithLocation = baseProducts.map((product, index) => {
            const { latitude: lat, longitude: lng } = randomNearbyLocation(
                latitude,
                longitude,
                200 + index * 120 // espalha naturalmente
            );

            return {
                ...product,
                imageSrc: product.imageSrc[0],
                latitude: lat,
                longitude: lng,
            };
        });

        setProducts(productsWithLocation);
    }, [latitude, longitude]);

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

            {products && products.length > 0 && products.map((item, index) => (
                <Marker icon={new L.Icon({
                    iconUrl: item.imageSrc!,
                    iconSize: [50, 50], // tamanho do ícone
                    iconAnchor: [20, 40], // ponto que “marca” a posição no mapa
                    popupAnchor: [0, -40], // posição do popup relativo ao ícone
                })} title="Produto" key={index} position={[item.latitude!, item.longitude!]}>
                    <Popup interactive>
                        <Card
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            imageSrc={item.imageSrc!}
                            price={item.price}
                            storename={item.storename!}
                        />
                    </Popup>
                </Marker>
            ))
            }

        </MapContainer>
    );
}
