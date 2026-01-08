'use client';

import { useEffect, useRef, useState } from "react";
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

function distanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const R = 6371000; // raio da Terra em metros
    const toRad = (v: number) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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
    const lastBasePosition = useRef<{ lat: number; lng: number } | null>(null);

    function createProducts(baseLat: number, baseLng: number) {
        const baseProducts = [
            {
                id: 1,
                imageSrc: ['/images/ps5-testmode.png'],
                title: 'PlayStation 5 Seminovo',
                description: 'Console PlayStation 5 em ótimo estado.',
                price: 2500,
                storename: 'João Guedes',
                stock: 1,
            },
            {
                id: 2,
                imageSrc: ['/images/galaxy-testmode.webp'],
                title: 'Smartphone Samsung Galaxy',
                description: 'Smartphone Samsung Galaxy em ótimo estado.',
                price: 2100,
                storename: 'Paulo Silva',
                stock: 1,
            },
            {
                id: 3,
                imageSrc: ['/images/notebook-testmode.avif'],
                title: 'Notebook Dell Inspiron',
                description: 'Notebook Dell Inspiron em ótimo estado.',
                price: 3800,
                storename: 'Lukas de Souza',
                stock: 1,
            },
            {
                id: 4,
                imageSrc: ['/images/panela-testmode.png'],
                title: 'Panela de pressão',
                description: 'Panela de pressão em ótimo estado.',
                price: 240,
                storename: 'Joana Mendes',
                stock: 1,
            },
            {
                id: 5,
                imageSrc: ['/images/fone-testmode.avif'],
                title: 'Fones de ouvido',
                description: 'Fones de ouvido em ótimo estado.',
                price: 800,
                storename: 'Lojinha do Davi',
                stock: 1,
            },
            {
                id: 6,
                imageSrc: ['/images/camisa-testmode.webp'],
                title: 'Camiseta Polo',
                description: 'Camiseta Polo em ótimo estado.',
                price: 200,
                storename: 'Marcos Paulo',
                stock: 1,
            },
            {
                id: 7,
                imageSrc: ['/images/tvsamsung-testmode.webp'],
                title: 'TV Samsung 4K',
                description: 'TV Samsung 4K em ótimo estado.',
                price: 3850,
                storename: 'Ana Clara',
                stock: 1,
            },
            
        ];

        const productsWithLocation = baseProducts.map((product, index) => {
            const { latitude, longitude } = randomNearbyLocation(
                baseLat,
                baseLng,
                200 + index * 120
            );

            return {
                ...product,
                imageSrc: product.imageSrc[0],
                latitude,
                longitude,
            };
        });

        setProducts(productsWithLocation);
    }

    useEffect(() => {
        if (!latitude || !longitude) return;

        // primeira vez → sempre cria
        if (!lastBasePosition.current) {
            lastBasePosition.current = { lat: latitude, lng: longitude };
            createProducts(latitude, longitude);
            return;
        }

        const distance = distanceInMeters(
            lastBasePosition.current.lat,
            lastBasePosition.current.lng,
            latitude,
            longitude
        );

        // limiar: ajuste como quiser
        if (distance < 80) return;

        // movimento real detectado
        lastBasePosition.current = { lat: latitude, lng: longitude };
        createProducts(latitude, longitude);
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
                            key={index}
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
