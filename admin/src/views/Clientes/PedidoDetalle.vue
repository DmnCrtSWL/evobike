<template>
  <AdminLayout>
    <div v-if="loading" class="text-center py-20 text-gray-500">Cargando pedido...</div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{{ error }}</div>
    <div v-else-if="pedido">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <router-link to="/admin/clientes" class="text-gray-400 hover:text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7 7-7" />
               </svg>
            </router-link>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white/90">
              Pedido #{{ String(pedido.id).padStart(5, '0') }}
            </h2>
          </div>
          <p class="text-gray-500 text-sm pl-9">Realizado el {{ pedido.fecha_compra }}</p>
        </div>
        
        <div class="flex items-center gap-3">
           <span :class="[
            'px-4 py-1.5 rounded-full font-bold text-sm border shadow-sm',
            pedido.mp_status === 'approved' || pedido.mp_status === 'in_process'
              ? 'bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20'
              : 'bg-error-50 text-error-700 border-error-200 dark:bg-error-500/10 dark:text-error-400 dark:border-error-500/20'
          ]">
            {{ statusLabel(pedido.mp_status) }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna Izquierda: Productos e Info de Cliente -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Productos -->
          <div class="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 class="font-bold text-gray-800 dark:text-white/90">Productos del Pedido</h3>
              <span class="text-gray-500 text-sm">{{ pedido.carrito?.length || 0 }} artículos</span>
            </div>
            
            <div class="p-6">
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                <div v-for="item in pedido.carrito" :key="item.id" class="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
                  <div class="h-16 w-16 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                    <!-- Si tuviéramos imagen del producto se pondría aquí -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-800 dark:text-white/90 text-theme-sm">{{ item.name }}</h4>
                    <p class="text-gray-500 text-theme-xs">Cantidad: {{ item.quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-800 dark:text-white/90 text-sm">
                      ${{ (item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
                    </p>
                    <p v-if="item.quantity > 1" class="text-gray-400 text-theme-xs">${{ Number(item.price).toLocaleString('es-MX') }} c/u</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-900/50 p-6 space-y-3">
               <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                 <span>Subtotal</span>
                 <span>${{ (pedido.total_pedido - (pedido.envio_costo || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
               </div>
               <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                 <span>Envío</span>
                 <span>{{ pedido.envio_costo > 0 ? '$' + pedido.envio_costo.toLocaleString('es-MX') : 'Gratis' }}</span>
               </div>
               <div class="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-lg font-bold text-gray-800 dark:text-white">
                 <span>Total</span>
                 <span class="text-brand-500">${{ Number(pedido.total_pedido).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Datos del Cliente -->
        <div class="space-y-8">
          <div class="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 class="font-bold text-gray-800 dark:text-white/90 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Cliente
            </h3>
            
            <div class="space-y-4">
              <div>
                <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Nombre Completo</p>
                <p class="text-gray-800 dark:text-white/90 font-medium">{{ pedido.nombre }} {{ pedido.apellido }}</p>
              </div>
              <div>
                <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Correo Electrónico</p>
                <a :href="'mailto:' + pedido.email" class="text-brand-500 hover:underline">{{ pedido.email }}</a>
              </div>
              <div>
                <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Teléfono</p>
                <p class="text-gray-800 dark:text-white/90 border border-transparent">{{ pedido.telefono || 'No proporcionado' }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm font-medium">
            <h3 class="font-bold text-gray-800 dark:text-white/90 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Envío y Entrega
            </h3>
            
            <div class="space-y-4">
              <div>
                <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Dirección</p>
                <p class="text-gray-800 dark:text-white/90 leading-relaxed">{{ pedido.direccion }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Ciudad</p>
                  <p class="text-gray-800 dark:text-white/90">{{ pedido.ciudad }}</p>
                </div>
                <div>
                  <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">C.P.</p>
                  <p class="text-gray-800 dark:text-white/90">{{ pedido.codigo_postal }}</p>
                </div>
              </div>
              <div>
                <p class="text-theme-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Estado</p>
                <p class="text-gray-800 dark:text-white/90">{{ pedido.estado }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
             <h3 class="font-bold text-gray-800 dark:text-white/90 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pago
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Mercado Pago ID</span>
                <span class="font-mono text-gray-800 dark:text-white/90 text-theme-xs">{{ pedido.mp_payment_id || 'N/A' }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Estatus Interno</span>
                <span class="font-bold text-gray-800 dark:text-white/90">{{ pedido.mp_status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '../../components/layout/AdminLayout.vue'

interface PedidoItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface Pedido {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  estado: string
  codigo_postal: string
  total_pedido: number
  envio_costo: number
  mp_status: string
  mp_payment_id: string
  fecha_compra: string
  carrito: PedidoItem[]
}

const route = useRoute()
const pedido = ref<Pedido | null>(null)
const loading = ref(true)
const error = ref('')

const statusLabel = (status: string) => {
  if (status === 'approved' || status === 'in_process') return 'En proceso'
  return 'Fallido'
}

const fetchPedido = async () => {
  loading.value = true
  try {
    const res = await fetch(`http://localhost:3001/api/admin/clientes/${route.params.id}`)
    if (!res.ok) throw new Error('No se encontró el pedido')
    pedido.value = await res.json()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPedido)
</script>
