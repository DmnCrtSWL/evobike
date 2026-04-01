import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      redirect: '/admin/usuarios',
    },
    {
      path: '/admin/usuarios',
      name: 'Usuarios',
      component: () => import('../views/Usuarios/Usuarios.vue'),
      meta: {
        title: 'Usuarios',
      },
    },
    {
      path: '/admin/usuarios/nuevo',
      name: 'NuevoUsuario',
      component: () => import('../views/Usuarios/NuevoUsuario.vue'),
      meta: { title: 'Agregar Usuario' },
    },
    {
      path: '/admin/usuarios/editar/:id',
      name: 'EditarUsuario',
      component: () => import('../views/Usuarios/NuevoUsuario.vue'),
      meta: { title: 'Editar Usuario' },
    },
    {
      path: '/admin/productos',
      name: 'Productos',
      component: () => import('../views/Productos/Productos.vue'),
      meta: { title: 'Productos' },
    },
    {
      path: '/admin/productos/nuevo',
      name: 'NuevoProducto',
      component: () => import('../views/Productos/NuevoProducto.vue'),
      meta: { title: 'Agregar Producto' },
    },
    {
      path: '/admin/productos/editar/:id',
      name: 'EditarProducto',
      component: () => import('../views/Productos/NuevoProducto.vue'),
      meta: { title: 'Editar Producto' },
    },
    {
      path: '/admin/clientes',
      name: 'Clientes',
      component: () => import('../views/Clientes/Clientes.vue'),
      meta: {
        title: 'Clientes',
      },
    },
    {
      path: '/admin/clientes/:id',
      name: 'PedidoDetalle',
      component: () => import('../views/Clientes/PedidoDetalle.vue'),
      meta: { title: 'Detalle de Pedido' },
    },
    {
      path: '/admin/pedidos',
      name: 'Pedidos',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Pedidos',
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
