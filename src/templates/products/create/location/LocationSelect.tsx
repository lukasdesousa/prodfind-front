'use client';

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige erro do ícone padrão do Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// -----------------------------------------------------
// Componente que capta o clique do usuário no mapa
// -----------------------------------------------------
function SelectLocation({
    onSelect,
}: {
    onSelect: (coords: [number, number]) => void;
}) {
    useMapEvents({
        click(e) {
            const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
            onSelect(coords);
        },
    });

    return null;
}

// -----------------------------------------------------
// Mapa completo que retorna latitude, longitude e cidade
// -----------------------------------------------------
export default function SelectLocationMap() {
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [city, setCity] = useState("");

    useEffect(() => {
        localStorage.setItem("product_lat", coords ? JSON.stringify(coords[0]) : "");
        localStorage.setItem("product_lon", coords ? JSON.stringify(coords[1]) : "");
    }, [coords, setCoords])

    useEffect(() => {
        const product_lat = localStorage.getItem("product_lat");
        const product_lon = localStorage.getItem("product_lon");

        if(product_lat && product_lon) {
            setCoords([JSON.parse(product_lat), JSON.parse(product_lon)]);
        }
    }, []);

    // Busca o nome da cidade usando reverse geocoding (Nominatim)
    async function fetchCity(lat: number, lon: number) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );

            const data = await res.json();
            const cidade =
                data?.address?.city ||
                data?.address?.town ||
                data?.address?.village ||
                data?.address?.municipality ||
                "Cidade não encontrada";

            setCity(cidade);
        } catch (err) {
            console.error(err);
            setCity("Erro ao obter cidade");
        }
    }

    // Sempre que o usuário clicar no mapa
    useEffect(() => {
        if (coords) {
            fetchCity(coords[0], coords[1]);
        }
    }, [coords]);

    return (
        <div>
            <MapContainer
                center={[-23.5505, -46.6333]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <SelectLocation onSelect={setCoords} />

                {coords && (
                    <Marker position={coords}>
                        <Popup>
                            <p><strong>Latitude:</strong> {coords[0]}</p>
                            <p><strong>Longitude:</strong> {coords[1]}</p>
                            <p><strong>Cidade:</strong> {city}</p>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div style={{ marginTop: 20 }}>
                {coords && (
                    <>
                        <p><strong>Latitude:</strong> {coords[0]}</p>
                        <p><strong>Longitude:</strong> {coords[1]}</p>
                        <p><strong>Cidade:</strong> {city}</p>
                    </>
                )}
            </div>
        </div>
    );
}
