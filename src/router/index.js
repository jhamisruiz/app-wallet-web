import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import ClientsView from '../views/ClientsView.vue';
import ProductsView from '../views/ProductsView.vue';
import WalletView from '../views/WalletView.vue';
import SettingsView from '../views/SettingsView.vue';
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true } // Marca esta ruta como protegida
    },
    {
        path: '/clients',
        name: 'Clients',
        component: ClientsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/products',
        name: 'Products',
        component: ProductsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/wallet',
        name: 'Wallet',
        component: WalletView,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// Guardia de navegación global (Global Navigation Guard)
router.beforeEach((to, from, next) => {
    // Simulación de si el usuario está autenticado.
    // En un caso real, esto provendría de un estado global (Vuex)
    // o de un token en localStorage/cookies.
    const isAuthenticated = localStorage.getItem('isAuthenticated'); // Usamos localStorage para simular

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Si la ruta requiere autenticación y no estás autenticado, redirige al login
    } else if (to.path === '/login' && isAuthenticated) {
        next('/home'); // Si ya estás autenticado e intentas ir al login, redirige a home
    } else {
        next(); // Continúa con la navegación
    }
});

export default router;