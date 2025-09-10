'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "./Card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const testArray = [
    { id: 1, title: "Bicicleta", description: "Bicicleta em ótimo estado, usada por 1 ano e...", image_url: "https://example.com/bike.jpg", item_price: 980, seller_name: "Paulo Souza", latitude: -4.96764000, longitude: -40.06725000 },
    { id: 2, title: "Notebook", description: "Notebook gamer, usado por 6 meses.", image_url: "https://example.com/laptop.jpg", item_price: 3500, seller_name: "Ana Lima", latitude: -23.551, longitude: -46.635 },
    { id: 3, title: "Smartphone", description: "Smartphone com câmera excelente, usado por 1 ano.", image_url: "https://example.com/phone.jpg", item_price: 1200, seller_name: "Carlos Pereira", latitude: -23.552, longitude: -46.632 },
]

const productIcon = new L.Icon({
    iconUrl: "/images/bike.webp", // caminho da imagem (pode ser PNG, SVG)
    iconSize: [50, 50], // tamanho do ícone
    iconAnchor: [20, 40], // ponto que “marca” a posição no mapa
    popupAnchor: [0, -40], // posição do popup relativo ao ícone
});

function UserLocation({ range }: { range: number }) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const map = useMap();

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setPosition(coords);
                map.setView(coords, 15);
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, [map]);

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

            {testArray.map(product => (
                <Marker title="Produto" key={product.id} position={[product.latitude, product.longitude]} icon={productIcon}>
                    <Popup interactive>
                        <Card
                            title={product.title}
                            description={product.description}
                            image_url={product.image_url}
                            item_price={product.item_price}
                            seller_name={product.seller_name}
                        />
                    </Popup>
                </Marker>
            ))
            }

        </MapContainer>
    );
}
