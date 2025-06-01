<template>
  <div class="home-page">
    <MainMenu />
    <div class="welcome-section">
      <h1>Bienvenido al Sistema</h1>
      <p>Navega a través de las opciones del menú.</p>
      <div class="row">
        <div class="col-md-12 d-flex justify-content-center">
          <div class="card w-50">
            <div class="card-body">
              <img
                :src="require('@/assets/image.png')"
                alt="Descripción de la imagen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainMenu from "@/components/MainMenu.vue";

export default {
  name: "HomeView",
  components: {
    MainMenu,
  },
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
</style>
