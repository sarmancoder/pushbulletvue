<template>
    <div
        class="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <div
            class="w-full max-w-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl p-6 sm:p-8">

            <!-- Cabecera -->
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Configuración de Pushbullet
                </h1>
                <p class="text-sm text-[var(--text-secondary)] font-medium mt-1">Elige cómo deseas conectar tu cuenta de
                    forma segura.</p>
            </div>

            <!-- Pestañas (Tabs) -->
            <div
                class="flex rounded-xl bg-[var(--bg-tertiary)] p-1.5 mb-6 relative border border-[var(--border-color)] gap-1.5">
                <!-- Pestaña 1: Token Manual (Recomendada) -->
                <button @click="activeTab = 'manual'"
                    class="flex-1 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all relative flex items-center justify-center gap-2 shadow-xs"
                    :class="activeTab === 'manual'
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-md'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]'">
                    <span>Token Manual</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                        :class="activeTab === 'manual' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'">
                        Recomendado
                    </span>
                </button>

                <!-- Pestaña 2: OAuth2 -->
                <button @click="activeTab = 'oauth'"
                    class="flex-1 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center shadow-xs"
                    :class="activeTab === 'oauth'
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow-md'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]'">
                    OAuth2 App
                </button>
            </div>

            <!-- CONTENIDO PESTAÑA 1: TOKEN MANUAL -->
            <div v-if="activeTab === 'manual'" class="space-y-5 animate-fadeIn">
                <!-- Bloque Explicativo -->
                <div
                    class="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] space-y-2">
                    <p class="font-bold text-[var(--text-primary)]">💡 ¿Por qué recomendamos el Token Personal?</p>
                    <p class="text-[var(--text-secondary)] leading-relaxed">
                        Al generar un Access Token directamente desde la web de Pushbullet, obtienes control maestro e
                        inmediato de tus dispositivos personales y notificaciones directas, sin que la API trate a tu
                        app como un canal de difusión externo.
                    </p>
                </div>

                <!-- Formulario Manual -->
                <div class="space-y-3">
                    <label class="block text-xs font-semibold text-[var(--text-primary)]">Token de acceso
                        personal</label>
                    <input v-model="manualToken" type="password" placeholder="o.xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--border-focus)] transition-colors placeholder:text-[var(--text-muted)]" />
                    <button @click="saveManualToken"
                        class="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] text-sm font-semibold transition-colors shadow-sm">
                        Guardar y Conectar
                    </button>
                </div>
            </div>

            <!-- CONTENIDO PESTAÑA 2: OAUTH2 -->
            <div v-else class="space-y-5 animate-fadeIn">
                <!-- Bloque Explicativo -->
                <div
                    class="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] space-y-2">
                    <p class="font-bold text-[var(--text-primary)]">⚠️ Comportamiento de OAuth2 en Pushbullet</p>
                    <p class="text-[var(--text-secondary)] leading-relaxed">
                        Cuando te autenticas mediante OAuth2, la API registra las peticiones bajo la identidad de una
                        aplicación externa (Cliente). Por esta razón, los mensajes de prueba pueden aparecer
                        inicialmente agrupados bajo la pestaña <em>Following</em> como un canal, en lugar de una
                        notificación directa tradicional.
                    </p>
                    <p class="text-[var(--text-secondary)] font-medium">
                        No te preocupes: al compartir tu app, cada usuario se autenticará con sus propias credenciales
                        de forma totalmente privada y aislada.
                    </p>
                </div>

                <!-- Botón OAuth2 -->
                <div class="space-y-3">
                    <button @click="startOAuth"
                        class="w-full py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 text-[var(--text-primary)]" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 7h2a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6">
                            </path>
                        </svg>
                        Conectar con Pushbullet (OAuth2)
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessagesStore } from '../stores/useMessages';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter()
const { appToken } = storeToRefs(useMessagesStore())

// Estado para controlar la pestaña activa ('manual' por defecto al estar recomendado)
const activeTab = ref('manual')
const manualToken = ref('')

// Lógica de guardado del token manual
const saveManualToken = () => {
    if (!manualToken.value.trim()) {
        alert('Por favor, introduce un token válido.')
        return
    }
    appToken.value = manualToken.value.trim()
    router.push('/')
}

// Lógica de redirección a OAuth2 de Pushbullet
const startOAuth = () => {
    const params = new URLSearchParams({
        client_id: '2XB7HT0nMjXPzNea96sVsRlU108Mi5VL', // 👈 Corregido a client_id
        redirect_uri: 'http://localhost:5173/authenticate', // 👈 Asegúrate de que en Pushbullet esté exactamente igual
        response_type: 'token'
    })

    const authUrl = `https://www.pushbullet.com/authorize?${params.toString()}`

    console.log(authUrl)

    window.location.href = authUrl // Ya puedes descomentarlo cuando quieras probarlo
}
</script>

<style scoped>
/* Animación suave al alternar pestañas */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.25s ease-out forwards;
}
</style>