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

    useEffect(() => {
        setLoading(true);
        axios.get(API_ENDPOINTS.MUNICIPALIDADES)
            .then(response => {
                setMunicipalidades(response.data);
                // Solo establecer la primera por defecto si no hay ninguna en localStorage
                if (response.data.length > 0 && !localStorage.getItem('selectedMunicipalidadId')) {
                    setSelectedMunicipalidadId(response.data[0].id);
                }
                setError(null);
            })
            .catch(error => {
                setError("No se pudieron cargar las municipalidades.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <MunicipalidadContext.Provider value={{
            municipalidades,
            selectedMunicipalidadId,
            setSelectedMunicipalidadId,
            loading,
            error
        }}>
            {children}
        </MunicipalidadContext.Provider>
    );
};
