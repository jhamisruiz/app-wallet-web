<template>
  <div class="clients-page">
    <MainMenu />

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="client-form-container">
              <h3>{{ isEditing ? 'Editar Cliente' : 'Añadir Nuevo Cliente' }}</h3>
              <form @submit.prevent="saveClient">
                <div class="form-group">
                  <label for="documento">Documento:</label>
                  <input type="text" id="documento" v-model="currentClient.documento" required />
                </div>
                <div class="form-group">
                  <label for="nombres">Nombres:</label>
                  <input type="text" id="nombres" v-model="currentClient.nombres" required />
                </div>
                <div class="form-group">
                  <label for="apellidos">Apellidos:</label>
                  <input type="text" id="apellidos" v-model="currentClient.apellidos" required />
                </div>
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" v-model="currentClient.email" />
                </div>
                <div class="form-group">
                  <label for="celular">Celular:</label>
                  <input type="tel" id="celular" v-model="currentClient.celular" />
                </div>
                <div class="form-actions">
                  <button type="submit" class="save-button">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
                  <button type="button" data-bs-dismiss="modal" @click="cancelEdit" class="cancel-button" v-if="isEditing">Cancelar</button>
                </div>
              </form>
              <p v-if="formMessage" :class="formMessageClass">{{ formMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <h2>Gestión de Clientes</h2>
      <button type="button" @click="cancelEdit"  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Add
      </button>
      <div class="clients-list">
        <h3>Listado de Clientes</h3>
        <p v-if="clients.length === 0 && !isLoading">No hay clientes registrados.</p>
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
                <button @click="editClient(client)" class="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button>
                <button @click="confirmDelete(client.id)" class="delete-button">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import MainMenu from '@/components/MainMenu.vue';
import { clientService } from '@/services/clientService'; // Importamos el servicio

export default {
  name: 'ClientsView',
  components: {
    MainMenu
  },
  data() {
    return {
      clients: [],
      currentClient: {
        id: null,
        documento: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: ''
      },
      isEditing: false,
      isLoading: false,
      errorLoading: null,
      formMessage: '',
      formMessageClass: ''
    };
  },
  async created() {
    // Al cargar el componente, cargamos los clientes
    await this.fetchClients();
  },
  methods: {
    async fetchClients() {
      this.isLoading = true;
      this.errorLoading = null;
      try {
        const data = await clientService.getAllClients();
        this.clients = data.data; // Asume que la API devuelve directamente el array de clientes
      } catch (error) {
        this.errorLoading = 'Error al cargar los clientes: ' + error.message;
        console.error('Error fetching clients:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async saveClient() {
      this.formMessage = '';
      this.formMessageClass = '';
      try {
        if (this.isEditing) {
          // Si estamos editando, llamamos al método de actualización
          await clientService.updateClient(this.currentClient.id, {
            documento: this.currentClient.documento,
            nombres: this.currentClient.nombres,
            apellidos: this.currentClient.apellidos,
            email: this.currentClient.email,
            celular: this.currentClient.celular,
          });
          this.formMessage = 'Cliente actualizado exitosamente.';
          this.formMessageClass = 'success-message';
        } else {
          // Si no estamos editando, llamamos al método de creación
          await clientService.createClient(this.currentClient);
          this.formMessage = 'Cliente creado exitosamente.';
          this.formMessageClass = 'success-message';
        }
        this.resetForm();
        await this.fetchClients(); // Recargar la lista después de guardar/actualizar
      } catch (error) {
        this.formMessage = 'Error al guardar el cliente: ' + error.message;
        this.formMessageClass = 'error-message';
        console.error('Error saving client:', error);
      }
    },

    editClient(client) {
      this.currentClient = { ...client }; // Copia el cliente para evitar modificar el original directamente
      this.isEditing = true;
      this.formMessage = ''; // Limpiar mensaje al iniciar edición
    },

    cancelEdit() {
      this.resetForm();
    },

    async confirmDelete(id) {
      Swal.fire({
        title: "Are you sure?",
        text: '¿Estás seguro de que quieres eliminar este cliente?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.formMessage = '';
          this.formMessageClass = '';
          try {
            await clientService.deleteClient(id);
            this.formMessage = 'Cliente eliminado exitosamente.';
            this.formMessageClass = 'success-message';
              Swal.fire({
              title: "Deleted!",
              text: this.formMessage,
              icon: "success"
            });

            await this.fetchClients();
          } catch (error) {
            this.formMessage = 'Error al eliminar el cliente: ' + error.message;
            this.formMessageClass = 'error-message';
            console.error('Error deleting client:', error);
          }
        }
      });
    },

    resetForm() {
      this.currentClient = {
        id: null,
        documento: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: ''
      };
      this.isEditing = false;
    }
  }
};
</script>

<style scoped>
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

/* Formulario */
.client-form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  width: calc(100% - 22px); /* Ajuste para padding y borde */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box; /* Incluye padding y border en el width */
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.save-button,
.cancel-button,
.edit-button,
.delete-button {
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background-color 0.3s ease;
  color: white;
}

.save-button {
  background-color: #42b983;
}
.save-button:hover {
  background-color: #36a474;
}

.cancel-button {
  background-color: #6c757d;
}
.cancel-button:hover {
  background-color: #5a6268;
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

.success-message {
  color: green;
  margin-top: 15px;
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 15px;
  font-weight: bold;
}

/* Tabla de Clientes */
.clients-list {
  margin-top: 40px;
  overflow-x: auto; /* Para tablas que pueden desbordar */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

th, td {
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
