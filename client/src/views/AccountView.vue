<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const pedidos = ref([])
const loadingPedidos = ref(true)
const tab = ref('pedidos') // 'pedidos' | 'perfil'

// Estado del mapa de estados WooCommerce
const estadoLabel = {
  pending: 'Pendiente',
  processing: 'En proceso',
  'on-hold': 'En espera',
  completed: 'Completado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
  failed: 'Fallido',
}

const estadoColor = {
  completed: '#16a34a',
  processing: '#2563eb',
  pending: '#d97706',
  cancelled: '#dc2626',
  refunded: '#7c3aed',
  'on-hold': '#6b7280',
  failed: '#dc2626',
}

onMounted(async () => {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  try {
    pedidos.value = await auth.fetchPedidos()
  } finally {
    loadingPedidos.value = false
  }
})

function handleLogout() {
  auth.logout()
  router.push('/')
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="account-wrapper">
    <div class="container">
      <!-- Header de cuenta -->
      <div class="account-header">
        <div class="account-avatar">
          {{ auth.cliente?.nombre?.charAt(0)?.toUpperCase() }}
        </div>
        <div class="account-info">
          <h1>{{ auth.cliente?.nombre }} {{ auth.cliente?.apellido }}</h1>
          <p>{{ auth.cliente?.email }}</p>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      <!-- Tabs -->
      <div class="account-tabs">
        <button :class="['tab-btn', { active: tab === 'pedidos' }]" @click="tab = 'pedidos'">
          Mis pedidos
        </button>
        <button :class="['tab-btn', { active: tab === 'perfil' }]" @click="tab = 'perfil'">
          Mi perfil
        </button>
      </div>

      <!-- Pedidos -->
      <div v-if="tab === 'pedidos'" class="tab-content">
        <div v-if="loadingPedidos" class="loading-state">Cargando tus pedidos...</div>

        <div v-else-if="pedidos.length === 0" class="empty-orders">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>Aún no tienes pedidos</p>
          <RouterLink to="/shop" class="shop-link">Explorar tienda</RouterLink>
        </div>

        <div v-else class="orders-list">
          <div v-for="pedido in pedidos" :key="pedido.id" class="order-card">
            <div class="order-header">
              <div>
                <span class="order-number">#{{ pedido.numero }}</span>
                <span class="order-date">{{ formatFecha(pedido.fecha) }}</span>
              </div>
              <span class="order-status" :style="{ color: estadoColor[pedido.estado] || '#6b7280', background: (estadoColor[pedido.estado] || '#6b7280') + '18' }">
                {{ estadoLabel[pedido.estado] || pedido.estado }}
              </span>
            </div>

            <div class="order-items">
              <div v-for="item in pedido.productos" :key="item.nombre" class="order-item">
                <span class="item-name">{{ item.nombre }}</span>
                <span class="item-qty">× {{ item.cantidad }}</span>
              </div>
            </div>

            <div class="order-footer">
              <span class="order-total">Total: <strong>{{ pedido.total }}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Perfil -->
      <div v-if="tab === 'perfil'" class="tab-content profile-section">
        <div class="profile-grid">
          <div class="profile-item">
            <label>Nombre</label>
            <p>{{ auth.cliente?.nombre }}</p>
          </div>
          <div class="profile-item">
            <label>Apellido</label>
            <p>{{ auth.cliente?.apellido || '—' }}</p>
          </div>
          <div class="profile-item">
            <label>Correo electrónico</label>
            <p>{{ auth.cliente?.email }}</p>
          </div>
          <div class="profile-item">
            <label>Teléfono</label>
            <p>{{ auth.cliente?.telefono || '—' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-wrapper {
  min-height: 100vh;
  background: #f9fafb;
  padding: 3rem 0 5rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.account-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.account-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0a6837, #16a34a);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-info {
  flex: 1;
}

.account-info h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.account-info p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.logout-btn:hover { background: #fee2e2; }

/* Tabs */
.account-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.6rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-brand, #0a6837);
  border-color: var(--color-brand, #0a6837);
  color: white;
}

/* Tab content */
.tab-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* Empty */
.empty-orders {
  text-align: center;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-orders p { color: #9ca3af; font-size: 1.1rem; }

.shop-link {
  background: var(--color-brand, #0a6837);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Orders */
.orders-list { display: flex; flex-direction: column; gap: 1rem; }

.order-card {
  border: 1.5px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.order-number {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #111827;
  margin-right: 0.75rem;
}

.order-date { color: #6b7280; font-size: 0.875rem; }

.order-status {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-items { padding: 0.75rem 1.25rem; }

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  color: #374151;
}

.item-qty { color: #9ca3af; }

.order-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #f3f4f6;
  text-align: right;
  font-size: 0.95rem;
  color: #374151;
}

/* Perfil */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.profile-item label {
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  display: block;
  margin-bottom: 0.3rem;
}

.profile-item p {
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 600px) {
  .account-header { flex-wrap: wrap; }
  .profile-grid { grid-template-columns: 1fr; }
}
</style>
