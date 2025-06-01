<template>
    <nav class="main-menu">
      <ul>
        <li><router-link to="/home">Inicio</router-link></li>
        <li><router-link to="/clients">Clientes</router-link></li>
        <li><router-link to="/wallet">Wallet</router-link></li>
        <li><router-link to="/products">Productos</router-link></li>
        <li><router-link to="/settings">Configuración</router-link></li>
        <li><button @click="logout" class="logout-button">Cerrar Sesión</button></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'MainMenu',
    methods: {
      logout() {

        localStorage.removeItem('isAuthenticated');
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .main-menu {
    background-color: #1e104b;
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  .main-menu ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .main-menu li {
    margin: 0 15px;
  }
  
  .main-menu a {
    color: white;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .main-menu a:hover,
  .main-menu a.router-link-exact-active {
    background-color: #fa681c;
  }
  
  .logout-button {
    background-color: #333; /* Rojo para cerrar sesión */
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
  }
  
  .logout-button:hover {
    background-color: #585858;
  }
  </style>