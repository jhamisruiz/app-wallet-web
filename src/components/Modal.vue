<template>
  <div class="clients-page">
    <MainMenu />

    <div class="content-wrapper">
      <h2>Gestión de Clientes</h2>

      <button @click="openCreateModal" class="add-new-button">
        Añadir Nuevo Cliente
      </button>

      <div class="clients-list">
        <h3>Listado de Clientes</h3>
        <p v-if="clients.length === 0 && !isLoading">
          No hay clientes registrados.
        </p>
        <p v-if="isLoading">Cargando clientes...</p>
        <p v-if="errorLoading" class="error-message">{{ errorLoading }}</p>

        <table v-if="clients.length > 0 && !isLoading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.id }}</td>
              <td>{{ client.documento }}</td>
              <td>{{ client.nombres }}</td>
              <td>{{ client.apellidos }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.celular }}</td>
              <td>
                <button @click="openEditModal(client)" class="edit-button">
                  Editar
                </button>
                <button @click="confirmDelete(client.id)" class="delete-button">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ClientModal
        :is-visible="showModal"
        :is-editing="isEditing"
        :client-to-edit="currentClient"
        @close-modal="showModal = false"
        @client-saved="handleClientSaved"
      />
    </div>
  </div>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";
import ClientModal from "@/components/ClientModal.vue"; // Importamos el nuevo componente modal
import { clientService } from "@/services/clientService";

export default {
  name: "ClientsView",
  components: {
    MainMenu,
    ClientModal, // Registramos el componente modal
  },
  data() {
    return {
      clients: [],
      currentClient: {
        id: null,
        documento: "",
        nombres: "",
        apellidos: "",
        email: "",
        celular: "",
      },
      showModal: false, // Controla la visibilidad del modal
      isEditing: false, // Controla si el modal es para edición o creación
      isLoading: false,
      errorLoading: null,
      // Los mensajes de formulario se manejan ahora dentro del modal
    };
  },
  async created() {
    await this.fetchClients();
  },
  methods: {
    async fetchClients() {
      this.isLoading = true;
      this.errorLoading = null;
      try {
        const data = await clientService.getAllClients();
        // Asume que la API devuelve los datos de los clientes en un objeto con una clave 'data'
        // Si tu API devuelve directamente el array, usa `this.clients = data;`
        this.clients = data.data;
      } catch (error) {
        this.errorLoading = "Error al cargar los clientes: " + error.message;
        console.error("Error fetching clients:", error);
      } finally {
        this.isLoading = false;
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.currentClient = {
        // Reinicia el formulario para crear uno nuevo
        id: null,
        documento: "",
        nombres: "",
        apellidos: "",
        email: "",
        celular: "",
      };
      this.showModal = true;
    },

    openEditModal(client) {
      this.isEditing = true;
      this.currentClient = { ...client }; // Pasa el cliente a editar al modal
      this.showModal = true;
    },

    async confirmDelete(id) {
      if (confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
        try {
          await clientService.deleteClient(id);
          alert("Cliente eliminado exitosamente."); // Podrías usar una notificación más sofisticada
          await this.fetchClients(); // Recargar la lista después de eliminar
        } catch (error) {
          alert("Error al eliminar el cliente: " + error.message);
          console.error("Error deleting client:", error);
        }
      }
    },

    // Maneja el evento emitido por el modal cuando un cliente se guarda/actualiza
    async handleClientSaved() {
      this.showModal = false; // Cierra el modal automáticamente
      await this.fetchClients(); // Recarga la lista de clientes para ver los cambios
      // Opcional: mostrar un mensaje de éxito global en ClientsView si lo deseas
    },
  },
};
</script>

<style scoped>
/* Elimina los estilos relacionados con el formulario de aquí, ya que están en ClientModal.vue */

.clients-page {
  text-align: center;
}

.content-wrapper {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 25px;
}

h3 {
  color: #36a474;
  margin-top: 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.add-new-button {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-bottom: 30px;
  transition: background-color 0.3s ease;
}

.add-new-button:hover {
  background-color: #0056b3;
}

.edit-button,
.delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
  color: white;
}

.edit-button {
  background-color: #007bff;
  margin-right: 5px;
}
.edit-button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
}
.delete-button:hover {
  background-color: #c82333;
}

.error-message {
  color: red;
  margin-top: 15px;
  font-weight: bold;
}

/* Tabla de Clientes (mismos estilos que antes) */
.clients-list {
  margin-top: 40px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

th,
td {
  border: 1px solid #e9ecef;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

tr:nth-child(even) {
  background-color: #f8f8f8;
}

tr:hover {
  background-color: #e6f7ff;
}

td button {
  margin-right: 5px;
}
</style>
