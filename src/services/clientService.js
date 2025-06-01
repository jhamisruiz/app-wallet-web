const API_BASE_URL = 'http://localhost:3002/v1'; // Ajusta la URL base de tu API si es diferente

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const clientService = {
    // Obtener todos los clientes
    async getAllClients() {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`); // Asumiendo que /clients es el endpoint para obtener todos
            return handleResponse(response);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            throw error;
        }
    },

    // Obtener un cliente por ID
    async getClientById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clients/${id}`); // Asumiendo que /clients/:id es el endpoint
            return handleResponse(response);
        } catch (error) {
            console.error(`Error al obtener cliente con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo cliente
    async createClient(clientData) {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Aquí puedes añadir headers de autorización si los necesitas, ej:
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(clientData),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    },

    // Actualizar un cliente existente
    async updateClient(id, clientData) {
        try {
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'PUT', // O 'PATCH' dependiendo de tu API
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(clientData),
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error al actualizar cliente con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar un cliente
    async deleteClient(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return { message: 'Cliente eliminado exitosamente' }; // Las eliminaciones a menudo no devuelven body
        } catch (error) {
            console.error(`Error al eliminar cliente con ID ${id}:`, error);
            throw error;
        }
    },
};