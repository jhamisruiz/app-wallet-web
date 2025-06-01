const API_BASE_URL = 'http://localhost:3002/v1'; // Misma URL base de tu API

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const rechargeService = {
    async getAllRecharge() {
        try {
            const response = await fetch(`${API_BASE_URL}/recarga`); // Asumiendo que /clients es el endpoint para obtener todos
            return handleResponse(response);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    },

    async createRecharge(rechargeData) {
        try {
            const response = await fetch(`${API_BASE_URL}/recarga`, { // Endpoint para recargas
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí puedes añadir headers de autorización si los necesitas
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(rechargeData),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error al realizar la recarga:', error);
            throw error;
        }
    },
};