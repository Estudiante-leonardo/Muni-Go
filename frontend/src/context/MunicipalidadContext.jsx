import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MunicipalidadContext = createContext();

export const MunicipalidadProvider = ({ children }) => {
    const [municipalidades, setMunicipalidades] = useState([]);
    const [selectedMunicipalidadId, setSelectedMunicipalidadId] = useState(null);

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
        axios.get(`${API_BASE_URL}/municipalidades`)
            .then(response => {
                setMunicipalidades(response.data);
                if (response.data.length > 0) {
                    // Set default to first municipality
                    setSelectedMunicipalidadId(response.data[0].id);
                }
            })
            .catch(error => {
                console.error("Error fetching municipalidades:", error);
            });
    }, []);

    return (
        <MunicipalidadContext.Provider value={{
            municipalidades,
            selectedMunicipalidadId,
            setSelectedMunicipalidadId
        }}>
            {children}
        </MunicipalidadContext.Provider>
    );
};
