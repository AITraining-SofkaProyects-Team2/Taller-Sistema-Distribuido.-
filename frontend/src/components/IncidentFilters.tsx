import React from 'react';

interface IncidentFiltersProps {
    onFilterChange?: (filters: { incidentType: string }) => void;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({ onFilterChange }) => {
    const incidentTypes = [
        'NO_SERVICE',
        'INTERMITTENT_SERVICE',
        'SLOW_CONNECTION',
        'ROUTER_ISSUE',
        'BILLING_QUESTION',
        'OTHER'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onFilterChange) {
            onFilterChange({ incidentType: e.target.value });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="incident-type-select" className="text-sm font-medium">
                Tipo de incidente
            </label>
            <select
                id="incident-type-select"
                onChange={handleChange}
                className="p-2 border rounded-md"
            >
                <option value="">Seleccionar tipo...</option>
                {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
};
