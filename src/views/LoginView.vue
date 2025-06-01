<template>
    <div class="login-page">
      <LoginForm @login-success="handleLoginSuccess" />
    </div>
  </template>
  
  <script>
  import LoginForm from '@/components/LoginForm.vue';
  
  export default {
    name: 'LoginView',
    components: {
      LoginForm
    },
    methods: {
      handleLoginSuccess() {
        // Redirigir a la pantalla de inicio después del login exitoso
        this.$router.push('/home');
      }
    }
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  </style>