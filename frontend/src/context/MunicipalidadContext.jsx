import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../lib/constants';

export const MunicipalidadContext = createContext();

export const MunicipalidadProvider = ({ children }) => {
    const [municipalidades, setMunicipalidades] = useState([]);
    const [selectedMunicipalidadId, setSelectedMunicipalidadId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(API_ENDPOINTS.MUNICIPALIDADES)
            .then(response => {
                setMunicipalidades(response.data);
                if (response.data.length > 0) {
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
