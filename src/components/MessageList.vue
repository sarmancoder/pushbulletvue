<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'

// Props opcionales, con un listado por defecto si no se le pasa nada desde el padre
const props = defineProps({
    messages: {
        type: Array,
        default: () => [
            { id: 1, sender: 'Carlos', text: '¡Hola! ¿Qué tal vas probando Tailwind CSS v4?', timestamp: '10:30 AM', isMe: false },
            { id: 2, sender: 'Tú', text: '¡Hola Carlos! Todo excelente, la sintaxis con el nuevo import global es súper limpia.', timestamp: '10:32 AM', isMe: true },
            { id: 3, sender: 'Carlos', text: 'Me alegra oír eso. ¿Y qué tal funcionan los componentes?', timestamp: '10:33 AM', isMe: false },
            { id: 4, sender: 'Tú', text: 'Genial, combinados con las variables CSS y @apply se adaptan solos al modo oscuro.', timestamp: '10:35 AM', isMe: true },
            { id: 5, sender: 'Carlos', text: '¿Ya configuraste las fuentes y los colores personalizados en el archivo CSS?', timestamp: '10:36 AM', isMe: false },
            { id: 6, sender: 'Tú', text: 'Sí, usé variables nativas :root y .dark para cambiar todo al vuelo.', timestamp: '10:38 AM', isMe: true },
            { id: 7, sender: 'Carlos', text: 'Eso es clave para mantener el diseño limpio. ¿Y qué tal el rendimiento?', timestamp: '10:39 AM', isMe: false },
            { id: 8, sender: 'Tú', text: 'Volando, compila rapidísimo con Vite.', timestamp: '10:40 AM', isMe: true },
            { id: 9, sender: 'Carlos', text: 'Excelente. Oye, ¿te acuerdas de la reunión de arquitectura de esta tarde?', timestamp: '10:42 AM', isMe: false },
            { id: 10, sender: 'Tú', text: 'Claro que sí, a las 4:00 PM, ¿verdad?', timestamp: '10:43 AM', isMe: true },
            { id: 11, sender: 'Carlos', text: 'Sí, justo esa. ¿Tienes listos los slides con la demo?', timestamp: '10:44 AM', isMe: false },
            { id: 12, sender: 'Tú', text: 'Casi terminados, solo me falta revisar los estilos de la tabla de datos.', timestamp: '10:45 AM', isMe: true },
            { id: 13, sender: 'Carlos', text: 'Perfecto, acuérdate de usar clases reutilizables con @apply para no repetir código.', timestamp: '10:47 AM', isMe: false },
            { id: 14, sender: 'Tú', text: 'Justo lo que hice. Creé un par de clases base para los inputs y botones.', timestamp: '10:48 AM', isMe: true },
            { id: 15, sender: 'Carlos', text: '¡Qué crack! Así el diseño se ve consistente en toda la plataforma.', timestamp: '10:50 AM', isMe: false },
            { id: 16, sender: 'Tú', text: 'Totalmente. ¿Viste el nuevo componente de chat que armamos?', timestamp: '10:51 AM', isMe: true },
            { id: 17, sender: 'Carlos', text: 'Sí, las burbujas con bordes redondeados y los avatares se ven muy profesionales.', timestamp: '10:53 AM', isMe: false },
            { id: 18, sender: 'Tú', text: 'Y lo mejor es que soporta auto-scroll automático cuando entran nuevos mensajes.', timestamp: '10:54 AM', isMe: true },
            { id: 19, sender: 'Carlos', text: 'Eso mejora la experiencia de usuario un montón.', timestamp: '10:55 AM', isMe: false },
            { id: 20, sender: 'Tú', text: 'Sin duda. ¿Quieres que hagamos una prueba de carga con más mensajes?', timestamp: '10:57 AM', isMe: true },
            { id: 21, sender: 'Carlos', text: 'Justo te iba a pedir eso, para probar el scrollbar personalizado.', timestamp: '10:58 AM', isMe: false },
            { id: 22, sender: 'Tú', text: 'Hecho, aquí tienes un listado largo para probar el desbordamiento.', timestamp: '11:00 AM', isMe: true },
            { id: 23, sender: 'Carlos', text: '¡Genial! Veo que la barra se ve fina y elegante en ambos modos.', timestamp: '11:02 AM', isMe: false },
            { id: 24, sender: 'Tú', text: 'Sí, los selectores de scrollbar en el CSS global hacen magia.', timestamp: '11:03 AM', isMe: true },
            { id: 25, sender: 'Carlos', text: 'Oye, hablando de otra cosa, ¿almorzamos juntos hoy?', timestamp: '11:05 AM', isMe: false },
            { id: 26, sender: 'Tú', text: 'Me parece perfecto. ¿A las 2:00 PM en la cafetería de la esquina?', timestamp: '11:06 AM', isMe: true },
            { id: 27, sender: 'Carlos', text: 'Hecho. Piden lasaña de nuevo que estaba buenísima la semana pasada.', timestamp: '11:08 AM', isMe: false },
            { id: 28, sender: 'Tú', text: 'Jajaja, ¡trato hecho! De solo pensarlo me dio hambre.', timestamp: '11:09 AM', isMe: true },
            { id: 29, sender: 'Carlos', text: 'Oye, volviendo al código, ¿tienes problemas con los selectores anidados en Tailwind v4?', timestamp: '11:12 AM', isMe: false },
            { id: 30, sender: 'Tú', text: 'Nop, nativamente soporta anidación CSS pura, lo cual es comodísimo.', timestamp: '11:13 AM', isMe: true },
            { id: 31, sender: 'Carlos', text: '¡Ah, es verdad! Ya no hace falta instalar PostCSS plugins extra.', timestamp: '11:15 AM', isMe: false },
            { id: 32, sender: 'Tú', text: 'Exacto, el motor nuevo Oxide vuela por sí solo.', timestamp: '11:16 AM', isMe: true },
            { id: 33, sender: 'Carlos', text: 'Qué gran avance para el ecosistema frontend.', timestamp: '11:18 AM', isMe: false },
            { id: 34, sender: 'Tú', text: 'Sí, cada vez las herramientas son más rápidas y menos pesadas.', timestamp: '11:19 AM', isMe: true },
            { id: 35, sender: 'Carlos', text: 'Bueno, te dejo un rato para que termines los slides de la demo.', timestamp: '11:21 AM', isMe: false },
            { id: 36, sender: 'Tú', text: 'Dale, cualquier cosa te aviso por aquí mismo.', timestamp: '11:22 AM', isMe: true },
            { id: 37, sender: 'Carlos', text: '¡Perfecto! Mucho éxito con eso.', timestamp: '11:23 AM', isMe: false },
            { id: 38, sender: 'Tú', text: '¡Gracias Carlos! Nos vemos al rato.', timestamp: '11:24 AM', isMe: true },
            { id: 39, sender: 'Carlos', text: 'Por cierto, ¿ya probaste el estado vacío del componente de lista?', timestamp: '11:25 AM', isMe: false },
            { id: 40, sender: 'Tú', text: 'Sí, si vaciamos el array de mensajes muestra un icono y un texto muy limpio.', timestamp: '11:27 AM', isMe: true },
            { id: 41, sender: 'Carlos', text: 'Excelente detalle de UI/UX.', timestamp: '11:28 AM', isMe: false },
            { id: 42, sender: 'Tú', text: 'Hay que cuidar cada rincón de la aplicación para que se vea premium.', timestamp: '11:30 AM', isMe: true },
            { id: 43, sender: 'Carlos', text: 'Totalmente de acuerdo. La primera impresión entra por los ojos.', timestamp: '11:31 AM', isMe: false },
            { id: 44, sender: 'Tú', text: 'Exacto. Bueno, me pongo a terminar esto de una vez.', timestamp: '11:33 AM', isMe: true },
            { id: 45, sender: 'Carlos', text: '¡Venga, a darle duro!', timestamp: '11:34 AM', isMe: false },
            { id: 46, sender: 'Tú', text: '¡Nos vemos pronto!', timestamp: '11:35 AM', isMe: true },
            { id: 47, sender: 'Carlos', text: '👍', timestamp: '11:36 AM', isMe: false },
            { id: 48, sender: 'Tú', text: '🚀', timestamp: '11:37 AM', isMe: true },
            { id: 49, sender: 'Carlos', text: '☕', timestamp: '11:38 AM', isMe: false },
            { id: 50, sender: 'Tú', text: 'Nos vemos en el almuerzo.', timestamp: '11:40 AM', isMe: true }
        ]
    },
    loading: {
        type: Boolean,
        default: false
    }
})

// Referencia para el auto-scroll
const scrollContainer = ref(null)

const scrollToBottom = async () => {
    await nextTick()
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
}

// Hacer scroll al montar y cuando cambien los mensajes
watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true, immediate: true })
</script>

<template>
    <div class="messages-container" ref="scrollContainer">

        <!-- Estado de carga -->
        <div v-if="loading" class="messages-loading">
            <div class="loading-spinner"></div>
            <span>Cargando conversación...</span>
        </div>

        <!-- Estado vacío -->
        <div v-else-if="messages.length === 0" class="messages-empty">
            <div class="empty-icon">💬</div>
            <p class="empty-title">No hay mensajes aún</p>
            <p class="empty-subtitle">Sé el primero en iniciar la conversación.</p>
        </div>

        <!-- Lista de mensajes con datos por defecto -->
        <div v-else class="messages-list">
            <ChatMessage v-for="msg in messages" :key="msg.id" :sender="msg.sender" :message="msg.text"
                :timestamp="msg.timestamp" :is-me="msg.isMe" />
        </div>

    </div>
</template>

<style scoped>
/* Tailwind CSS v4 usa @import en lugar de las directivas antiguas */
@import "tailwindcss";

@layer components {

    /* Contenedor principal de la lista */
    .messages-container {
        background-color: var(--bg-primary, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        @apply pb-40 px-10 pt-10;
    }

    /* Scrollbar fina */
    .messages-container::-webkit-scrollbar {
        width: 6px;
    }

    .messages-container::-webkit-scrollbar-track {
        background: transparent;
    }

    .messages-container::-webkit-scrollbar-thumb {
        background: var(--border-color, #e2e8f0);
        @apply rounded-full;
    }

    /* Wrapper del listado */
    .messages-list {
        @apply flex flex-col justify-end min-h-full space-y-1;
    }

    /* Estado vacío */
    .messages-empty {
        @apply flex flex-col items-center justify-center h-full text-center p-6 my-auto;
    }

    .empty-icon {
        @apply text-4xl mb-2 opacity-80;
    }

    .empty-title {
        color: var(--text-primary, #0f172a);
        @apply text-base font-semibold;
    }

    .empty-subtitle {
        color: var(--text-muted, #94a3b8);
        @apply text-xs mt-1;
    }

    /* Estado de carga */
    .messages-loading {
        color: var(--text-secondary, #475569);
        @apply flex flex-col items-center justify-center h-full gap-3 text-xs font-medium my-auto;
    }

    .loading-spinner {
        border-color: var(--border-color, #e2e8f0);
        border-top-color: var(--accent-primary, #6366f1);
        @apply w-6 h-6 border-2 rounded-full animate-spin;
    }
}
</style>