import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/constants';

export const MunicipalidadContext = createContext();

export const MunicipalidadProvider = ({ children }) => {
    const [municipalidades, setMunicipalidades] = useState([]);
    const [selectedMunicipalidadId, setSelectedMunicipalidadIdState] = useState(() => {
        const saved = localStorage.getItem('selectedMunicipalidadId');
        return saved ? parseInt(saved) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const setSelectedMunicipalidadId = (id) => {
        setSelectedMunicipalidadIdState(id);
        if (id) {
            localStorage.setItem('selectedMunicipalidadId', id.toString());
        } else {
            localStorage.removeItem('selectedMunicipalidadId');
        }
    };

    const fetchMunicipalidades = () => {
        setLoading(true);
        axios.get(`${API_ENDPOINTS.MUNICIPALIDADES}?soloActivos=true`)
            .then(response => {
                setMunicipalidades(response.data);
                if (response.data.length > 0 && !localStorage.getItem('selectedMunicipalidadId')) {
                    setSelectedMunicipalidadId(response.data[0].id);
                } else if (response.data.length > 0) {
                    // Verificar si la municipalidad seleccionada sigue existiendo (activa)
                    const currentId = parseInt(localStorage.getItem('selectedMunicipalidadId'));
                    if (!response.data.find(m => m.id === currentId)) {
                        setSelectedMunicipalidadId(response.data[0].id);
                    }
                }
                setError(null);
            })
            .catch(error => setError("No se pudieron cargar las municipalidades."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMunicipalidades();
    }, []);

    return (
        <MunicipalidadContext.Provider value={{
            municipalidades,
            selectedMunicipalidadId,
            setSelectedMunicipalidadId,
            fetchMunicipalidades,
            loading,
            error
        }}>
            {children}
        </MunicipalidadContext.Provider>
    );
};
