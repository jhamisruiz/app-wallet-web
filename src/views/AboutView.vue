<template>
    <div class="about">
      <MainMenu />
      <h1>This is an about page</h1>
      <p>You can put information about your application here.</p>
    </div>
  </template>
  
  <script>
  import MainMenu from '@/components/MainMenu.vue'; // Import the MainMenu component
  
  export default {
    name: 'AboutView',
    components: {
      MainMenu // Register the MainMenu component
    }
  };
  </script>
  
  <style scoped>
  .about {
    text-align: center;
    padding: 20px;
  }
  </style>