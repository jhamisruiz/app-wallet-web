<template>
  <div class="section-page">
    <MainMenu />
    <div class="content-wrapper">
      <h2>Gestión de Recargas de Productos</h2>
      <p>Selecciona un cliente para realizar una recarga.</p>

      <div class="client-search-section">
        <h3>Buscar Cliente</h3>
        <div class="form-group">
          <label for="searchClient">Buscar por Documento o Nombre:</label>
          <input
            type="text"
            id="searchClient"
            v-model="searchTerm"
            @input="filterClients"
            placeholder="Documento, Nombres o Apellidos"
          />
        </div>

        <p v-if="isLoadingClients">Cargando clientes...</p>
        <p v-if="errorLoadingClients" class="error-message">{{ errorLoadingClients }}</p>

        <div class="client-results">
          <ul v-if="filteredClients.length > 0">
            <li v-for="client in filteredClients" :key="client.id" @click="selectClient(client)" :class="{ 'selected': selectedClient && selectedClient.id === client.id }">
              {{ client.documento }} - {{ client.nombres }} {{ client.apellidos }}
            </li>
          </ul>
          <p v-else-if="searchTerm && !isLoadingClients">No se encontraron clientes.</p>
        </div>
      </div>

      <divs v-if="selectedClient">
        <div class="accordion accordion-flush" id="accordionFlushExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Realizar Recarga:
              </button>
            </h2>
            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body recharge-section">
                <p class="selected-client-info">
                  **Cliente Seleccionado:** {{ selectedClient.nombres }} {{ selectedClient.apellidos }} (Documento: {{ selectedClient.documento }})
                </p>
                <form @submit.prevent="performRecharge">
                  <div class="form-group">
                    <label for="rechargeValue">Valor de la Recarga:</label>
                    <input type="number" id="rechargeValue" v-model.number="rechargeValue" min="1" required />
                  </div>
                  <button type="submit" class="recharge-button">Realizar Recarga</button>
                </form>
                <p v-if="rechargeMessage" :class="rechargeMessageClass">{{ rechargeMessage }}</p>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                Realizar Pago:
              </button>
            </h2>
            <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body bg-success-light">
                <p class="text-danger">
                  **Cliente Seleccionado:** {{ selectedClient.nombres }} {{ selectedClient.apellidos }} (Documento: {{ selectedClient.documento }})
                </p>
                <form @submit.prevent="performPago">
                  <div class="form-group">
                    <label for="pagoValue">Valor a Pagar:</label>
                    <input type="number" id="pagoValue" v-model.number="pagoValue" min="1" required />
                  </div>
                  <button type="submit" class="btn btn-danger">Realizar Pago</button>
                </form>
                <p v-if="pagoMessage" :class="pagoMessageClass">{{ pagoMessage }}</p>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                Confirmar Pago:
              </button>
            </h2>
            <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">
                <p class="text-primary">
                  **Cliente Seleccionado:** {{ selectedClient.nombres }} {{ selectedClient.apellidos }} (Documento: {{ selectedClient.documento }})
                </p>
                <h3>Lista de pagos</h3>
                <p v-if="allPagos.length === 0 && !isLoadingPago">No hay pagos registrados.</p>
                <table class="table" v-if="allPagos.length > 0 && !isLoadingPago">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Valor</th>
                      <th>Estado</th>
                      <th>Token</th>
                      <th>Session ID</th>
                      <th>Confirmar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pago in allPagos" :key="pago.id">
                      <td>{{ pago.id }}</td>
                      <td>{{ pago.valor }}</td>
                      <td>{{ pago.estado }}</td>
                      <td>{{ pago.token }}</td>
                      <td>{{ pago.sessionId }}</td>
                      <td>
                        <button @click="realizarPago(pago)"  v-if="pago.estado ==='pendiente'" class="btn btn-sm btn-success">Confirmar Pago</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
      </divs>
      <p v-else class="select-client-prompt">Por favor, busca y selecciona un cliente para realizar una operación.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import MainMenu from '@/components/MainMenu.vue';
import { clientService } from '@/services/clientService';
import { rechargeService } from '@/services/rechargeService';
import { pagoService } from '@/services/pagoService';

export default {
  name: 'ProductsView',
  components: {
    MainMenu
  },
  data() {
    return {
      allClients: [], // Almacena todos los clientes cargados
      filteredClients: [], // Clientes que coinciden con el término de búsqueda
      searchTerm: '', // Término de búsqueda del cliente
      isLoadingClients: false,
      errorLoadingClients: null,
      selectedClient: null, // Cliente actualmente seleccionado
      rechargeValue: null, // Valor de la recarga a realizar
      rechargeMessage: '', // Mensaje de éxito/error de la recarga
      rechargeMessageClass: '',

      pagoValue: null,
      pagoMessage: '',
      pagoMessageClass: '',
      
      allPagos: [],
      isLoadingPago: false,
      errorLoadingPago: null,
    };
  },
  async created() {
    // Al cargar la vista, cargamos todos los clientes
    await this.fetchAllClients();
  },
  methods: {
    async fetchAllClients() {
      this.isLoadingClients = true;
      this.errorLoadingClients = null;
      try {
        const data = await clientService.getAllClients();

        this.allClients = data.data || data; 
        this.filterClients();
      } catch (error) {
        this.errorLoadingClients = 'Error al cargar la lista de clientes: ' + error.message;
        console.error('Error fetching all clients:', error);
      } finally {
        this.isLoadingClients = false;
      }
    },
    async fetchAllPagoClients() {
      this.isLoadingPago = true;
      this.errorLoadingPago = null;
      try {
        const data = await pagoService.getAllPagoCliente(this.selectedClient.id);
        console.log('data:', data.data);
        this.allPagos = data.data || data; 
        
      } catch (error) {
        this.errorLoadingPago = 'Error al cargar la lista de pagos: ' + error.message;
        console.error('Error fetching all pagos:', error);
      } finally {
        this.isLoadingPago = false;
      }
    },
    filterClients() {
      if (!this.searchTerm) {
        this.filteredClients = []; // No muestra nada si el campo de búsqueda está vacío
        return;
      }

      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredClients = this.allClients.filter(client => {
        return (
          client.documento.toLowerCase().includes(lowerCaseSearchTerm) ||
          client.nombres.toLowerCase().includes(lowerCaseSearchTerm) ||
          client.apellidos.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }).slice(0, 5); // Limita los resultados a 5 para no saturar la lista
    },

    async selectClient(client) {
      this.selectedClient = client;
      this.searchTerm = ''; 
      this.filteredClients = []; 
      this.rechargeMessage = ''; 
      this.rechargeValue = null; 

      this.pagoMessage = '';
      this.pagoMessageClass = '';

      await this.fetchAllPagoClients();
    },

    async performRecharge() {
      this.rechargeMessage = '';
      this.rechargeMessageClass = '';

      if (!this.selectedClient) {
        this.rechargeMessage = 'Por favor, selecciona un cliente primero.';
        this.rechargeMessageClass = 'error-message';
        return;
      }
      if (!this.rechargeValue || this.rechargeValue <= 0) {
        this.rechargeMessage = 'Por favor, ingresa un valor de recarga válido.';
        this.rechargeMessageClass = 'error-message';
        return;
      }

      try {
        const rechargeData = {
          id_cliente: this.selectedClient.id,
          valor: this.rechargeValue,
          // La fecha podría ser generada por el backend, o puedes enviarla desde aquí
          // fecha: new Date().toISOString().slice(0, 19).replace('T', ' ') // Formato 'YYYY-MM-DD HH:MM:SS'
        };

        const response = await rechargeService.createRecharge(rechargeData);
        this.rechargeMessage = `Recarga de ${this.rechargeValue} exitosa para ${this.selectedClient.nombres}. ID de recarga: ${response.data.id}`;
        this.rechargeMessageClass = 'success-message';

        // Opcional: Reiniciar la selección y el valor después de una recarga exitosa
        this.selectedClient = null;
        this.rechargeValue = null;
        Swal.fire({
              title: "Success!",
              text: 'Se realizo la recarga correctamente.',
              icon: "success"
            });
      } catch (error) {
        this.rechargeMessage = 'Error al realizar la recarga: ' + error.message;
        this.rechargeMessageClass = 'error-message';
        console.error('Error performing recharge:', error);
      }
    },
    async performPago() {
      this.pagoMessage = '';
      this.pagoMessageClass = '';

      if (!this.selectedClient) {
        this.pagoMessage = 'Por favor, selecciona un cliente primero.';
        this.pagoMessageClass = 'error-message';
        return;
      }
      if (!this.pagoValue || this.pagoValue <= 0) {
        this.pagoMessage = 'Por favor, ingresa un valor de recarga válido.';
        this.pagoMessageClass = 'error-message';
        return;
      }

      try {
        const pagoData = {
          id: null,
          id_cliente: this.selectedClient.id,
          valor: this.pagoValue,
          estado: 'pendiente',
          token: 'JT'+ this.selectedClient.id + Math.floor(Math.random() * (10 - 1)) + 10,
          sessionId: 'JQwd8CmeSgm_otL5CnHIcLPJFig',
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato 'YYYY-MM-DD HH:MM:SS'
          confirmed_at: null
        };

        const response = await pagoService.createPago(pagoData);
        this.pagoMessage = `Pago de ${this.pagoValue} exitoso para ${this.selectedClient.nombres}. ID de recarga: PG-${response.data.id}`;
        this.pagoMessageClass = 'success-message';

        // Opcional: Reiniciar la selección y el valor después de una recarga exitosa
        this.pagoClient = null;
        this.pagoValue = null;
        Swal.fire({
          title: "Success!",
          text: 'Se realizo el pago correctamente.',
          icon: "success"
        });
      } catch (error) {
        this.rechargeMessage = 'Error al realizar el pago: ' + error.message;
        this.rechargeMessageClass = 'error-message';
        console.error('Error performing recharge:', error);
      }
    },
    async realizarPago(pago) {
      Swal.fire({
        title: "Are you sure?",
        text: '¿Estás seguro de que quieres Pagar?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, purchase it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          /* this.formMessage = '';
          this.formMessageClass = ''; */
          try {
            const response = await pagoService.confirmarPago(pago.id,pago);
            /* this.formMessage = 'El Pago se realizo exitosamente.';
            this.formMessageClass = 'success-message'; */
            console.log('response:', response);
            Swal.fire({
              title: response.error ? 'Error!': "Pagado!",
              text: response.message,
              icon: response.error ? 'error': "success"
            });

            await this.fetchAllPagoClients();
          } catch (error) {
            /* this.formMessage = 'Error al confirmar pago: ' + error.message;
            this.formMessageClass = 'error-message'; */
            console.error('Error de pago:', error);
          }
        }
      });
    },
  }
};
</script>

<style scoped>
.products-page {
  text-align: center;
}

.content-wrapper {
  max-width: 800px;
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

/* Sección de Búsqueda de Clientes */
.client-search-section {
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
.form-group input[type="number"] {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.client-results ul {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
}

.client-results li {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  text-align: left;
  transition: background-color 0.2s ease;
}

.client-results li:last-child {
  border-bottom: none;
}

.client-results li:hover,
.client-results li.selected {
  background-color: #e6f7ff;
  font-weight: bold;
}

/* Sección de Recarga */
.recharge-section {
  background-color: #eaf7ed; /* Un color suave para indicar que es el formulario de acción */
  padding-top: 2px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-client-info {
  font-size: 1.1em;
  color: #28a745;
  margin-bottom: 20px;
  font-weight: 500;
}

.recharge-button {
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 4px;
  transition: background-color 0.3s ease;
}

.recharge-button:hover {
  background-color: #218838;
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

.select-client-prompt {
  margin-top: 30px;
  color: #666;
  font-style: italic;
}
</style>
