import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cache = new Map();

export function usePersonalizacion(idUsuario) {
    const [personalizacion, setPersonalizacion] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!idUsuario) {
            setPersonalizacion({});
            setCargando(false);
            return;
        }
        if (cache.has(idUsuario)) {
            setPersonalizacion(cache.get(idUsuario));
            setCargando(false);
            return;
        }
        fetch(`${API_URL}/usuario/personalizacion/${idUsuario}`)
            .then(res => res.json())
            .then(data => {
                cache.set(idUsuario, data);
                setPersonalizacion(data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando personalización:", err);
                setPersonalizacion({});
                setCargando(false);
            });
    }, [idUsuario]);

    return { personalizacion, cargando };
}