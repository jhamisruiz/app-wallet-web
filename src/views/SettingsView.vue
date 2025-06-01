<template>
    <div class="section-page">
      <MainMenu />
      <h2>Configuración del Sistema</h2>
      <p>Aquí se gestionarán las opciones de configuración.</p>
      </div>
  </template>
  
  <script>
  import MainMenu from '@/components/MainMenu.vue';
  
  export default {
    name: 'SettingsView',
    components: {
      MainMenu
    }
  };
  </script>
  
  <style scoped>
  .section-page {
    text-align: center;
  }
  h2 {
    color: #2c3e50;
    margin-top: 30px;
  }
  </style>