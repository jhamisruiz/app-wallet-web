const API_BASE_URL = 'http://localhost:3002/v1'; // Asegúrate de que esta sea la URL base correcta

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const walletService = {
    // Obtener datos del wallet de un cliente por su ID de cliente
    async getWalletByClientId(clientId) {
        try {
            const response = await fetch(`${API_BASE_URL}/wallet-cliente/${clientId}`);
            return handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener datos del wallet para el cliente ID ${clientId}:`, error);
            throw error;
        }
    },
};
