const API_BASE_URL = 'http://localhost:3002/v1'; // Misma URL base de tu API

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const pagoService = {
    async getAllPagoCliente(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/pago-cliente/${id}`); // Asumiendo que /clients es el endpoint para obtener todos
            return handleResponse(response);
        } catch (error) {
            console.error('Error al obtener los Pago:', error);
            throw error;
        }
    },

    async createPago(pagoData) {
        try {
            const response = await fetch(`${API_BASE_URL}/pago`, { // Endpoint para recargas
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí puedes añadir headers de autorización si los necesitas
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(pagoData),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error al realizar la recarga:', error);
            throw error;
        }
    },
    async confirmarPago(id, pago) {
        try {
            const response = await fetch(`${API_BASE_URL}/pago/${id}`, { // Endpoint para recargas
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: pago.id,
                    id_cliente: pago.id_cliente,
                    valor: pago.valor,
                    estado: 'confirmado',
                    token: pago.token,
                    sessionId: pago.sessionId,
                    created_at: pago.created_at,
                    confirmed_at: new Date().toISOString().slice(0, 19).replace('T', ' '), 
                }),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error al realizar la recarga:', error);
            throw error;
        }
    },
};