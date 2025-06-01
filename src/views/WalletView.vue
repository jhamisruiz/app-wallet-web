<template>
  <div class="section-page">
    <MainMenu />
    <div class="welcome-section">
      <h1>Bienvenido al Sistema</h1>
      <p>Navega a través de las opciones del menú.</p>

      <div class="wallet-info">
        <h3>Información de tu Wallet</h3>
        <p v-if="isLoadingWallet">Cargando datos del wallet...</p>
        <p v-if="errorWallet" class="error-message">{{ errorWallet }}</p>
        <div v-if="walletData && !isLoadingWallet" class="wallet-details">
          <p><strong>Documento:</strong> {{ walletData.documento }}</p>
          <p><strong>Nombres:</strong> {{ walletData.nombres }}</p>
          <p><strong>Apellidos:</strong> {{ walletData.apellidos }}</p>
          <p><strong>Email:</strong> {{ walletData.email }}</p>
          <p><strong>Celular:</strong> {{ walletData.celular }}</p>
          <p class="saldo"><strong>Saldo Actual:</strong> S/ {{ parseFloat(walletData.saldo).toFixed(2) }}</p>
          <p class="last-update">Última actualización: {{ formatDateTime(walletData.created_at) }}</p>
        </div>
        <p v-if="!walletData && !isLoadingWallet && !errorWallet">No se encontraron datos del wallet para el cliente.</p>
        <button data-bs-toggle="collapse" href="#collapseExample" type="button" class="btn btn-link">Ver mis movimientos ></button>
        <div class="collapse" id="collapseExample">
          <div class="card card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">valor</th>
                  <th scope="col">fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movimiento in movimientos" :key="movimiento.id">
                  <th scope="row">{{ movimiento.id }}</th>
                  <td>S/ {{ movimiento.valor }}</td>
                  <td>{{ movimiento.fecha }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import MainMenu from '@/components/MainMenu.vue';
import { walletService } from '@/services/walletService'; // Importa el nuevo servicio
import { rechargeService } from '@/services/rechargeService'; // Importamos el nuevo servicio de recargas

export default {
  name: 'HomeView',
  components: {
    MainMenu
  },
  data() {
    return {
      walletData: null,
      isLoadingWallet: false,
      errorWallet: null,
      clientId: 1
    };
  },
  async created() {
    await this.fetchRecharge();
    if (this.clientId) {
      await this.fetchWalletData();
    } else {
      this.errorWallet = "No se ha proporcionado un ID de cliente para el wallet.";
    }
  },
  methods: {
    async fetchRecharge() {
      this.isLoading = true;
      this.errorLoading = null;
      try {
        const data = await rechargeService.getAllRecharge();
        this.movimientos = data.data;
        console.log(this.movimientos);
      } catch (error) {
        this.errorLoading = 'Error al cargar los los movimientos de recarga: ' + error.message;
        console.error('Error fetching Recharge:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchWalletData() {
      this.isLoadingWallet = true;
      this.errorWallet = null;
      try {
        const response = await walletService.getWalletByClientId(this.clientId);
        // Tu API devuelve los datos dentro de una clave 'data'
        if (response && response.data) {
          this.walletData = response.data;
        } else {
          this.walletData = null;
          this.errorWallet = "La respuesta de la API no contiene los datos esperados.";
        }
      } catch (error) {
        this.errorWallet = 'Error al cargar los datos del wallet: ' + error.message;
        console.error('Error fetching wallet data:', error);
      } finally {
        this.isLoadingWallet = false;
      }
    },
    formatDateTime(datetimeString) {
      if (!datetimeString) return '';
      const date = new Date(datetimeString);
      return date.toLocaleString(); // Formatea la fecha y hora a la configuración regional
    }
  }
};
</script>

<style scoped>
.home-page {
  text-align: center;
}

.welcome-section {
  padding: 50px 20px;
  background-color: #eaf7ed;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  color: #555;
  font-size: 1.1em;
}

.wallet-info {
  margin-top: 40px;
  padding: 25px;
  background-color: #f0f8ff; /* Un color de fondo diferente para el wallet */
  border-radius: 8px;
  border: 1px solid #d0e8f8;
  text-align: left; /* Alineamos el texto a la izquierda dentro de esta sección */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.wallet-info h3 {
  color: #007bff; /* Un color azul para el título del wallet */
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 1px solid #cceeff;
  padding-bottom: 10px;
}

.wallet-details p {
  margin-bottom: 8px;
  color: #333;
  font-size: 1em;
}

.wallet-details strong {
  color: #2c3e50;
}

.wallet-details .saldo {
  font-size: 1.8em;
  font-weight: bold;
  color: #28a745; /* Verde para el saldo */
  margin-top: 20px;
  text-align: center;
  border-top: 1px dashed #cceeff;
  padding-top: 15px;
}

.wallet-details .last-update {
  font-size: 0.85em;
  color: #777;
  text-align: right;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
}

.section-page {
  text-align: center;
}
h2 {
  color: #2c3e50;
  margin-top: 30px;
}
</style>
