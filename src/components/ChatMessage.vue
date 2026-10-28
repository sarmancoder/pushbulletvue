<script setup lang="ts">
import { computed } from 'vue'

// 1. Asignamos defineProps a una constante (por convención se llama 'props')
const props = defineProps({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        default: 0
    },
    isMe: {
        type: Boolean,
        default: false
    }
})

// Arrays con las extensiones permitidas
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']

// Comprobamos si el mensaje termina con alguna de las extensiones del array
const isImage = computed(() => {
    const msg = props.message.toLowerCase()
    return imageExtensions.some(ext => msg.endsWith(ext))
})

const isVideo = computed(() => {
    const msg = props.message.toLowerCase()
    return videoExtensions.some(ext => msg.endsWith(ext))
})

const isUrl = computed(() => props.message.startsWith('http'))

</script>
<template>
    <!-- Contenedor general del mensaje: se alinea a la derecha si es propio, a la izquierda si es ajeno -->
    <div :class="['message-wrapper', isMe ? 'message-wrapper-me' : 'message-wrapper-other']">

        <!-- Avatar o indicador de usuario -->
        <div class="message-avatar">
            {{ sender.charAt(0).toUpperCase() }}
        </div>

        <!-- Burbuja del mensaje -->
        <div :class="['message-bubble', isMe ? 'message-bubble-me' : 'message-bubble-other']">
            <div class="message-header">
                <span class="message-sender">{{ isMe ? 'Tú' : sender }}</span>
                <span class="message-time">{{ new Date(timestamp * 1000).toLocaleString() }}</span>
            </div>

            <img v-if="isImage" :src="message" class="max-w-sm" />
            <video v-else-if="isVideo" :src="message" class="max-w-sm" controls />
            <a v-else-if="isUrl" target="_blank" class="text-blue-800" :href="message">
                {{ message }}
            </a>
            <p class="message-text" v-else>
                {{ message ?? timestamp }}
            </p>
        </div>
    </div>
</template>

<style scoped>
@import 'tailwindcss';

@layer components {

    /* Contenedor principal del mensaje */
    .message-wrapper {
        @apply flex items-end gap-3 my-3 w-full min-w-0;
    }

    .message-wrapper-me {
        @apply flex-row-reverse;
    }

    .message-wrapper-other {
        @apply flex-row;
    }

    /* Avatar del usuario */
    .message-avatar {
        background-color: var(--bg-tertiary, #f1f5f9);
        color: var(--text-secondary, #475569);
        border: 1px solid var(--border-color, #e2e8f0);
        @apply w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm;
    }

    /* Burbuja de texto base */
    .message-bubble {
        border: 1px solid var(--border-color, #e2e8f0);
        @apply max-w-[75%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 min-w-0 overflow-hidden;
    }

    /* Estilo si el mensaje es tuyo (destacado con color acento) */
    .message-bubble-me {
        background-color: var(--accent-primary, #6366f1);
        color: var(--accent-text, #ffffff);
        border-color: transparent;
        @apply rounded-br-none;
    }

    /* Estilo si el mensaje es de otra persona */
    .message-bubble-other {
        background-color: var(--bg-secondary, #ffffff);
        color: var(--text-primary, #0f172a);
        @apply rounded-bl-none;
    }

    /* Cabecera de la burbuja (remitente y hora) */
    .message-header {
        @apply flex items-center justify-between gap-4 mb-1 text-xs opacity-80 min-w-0;
    }

    .message-sender {
        @apply font-semibold truncate;
    }

    .message-time {
        @apply text-[10px] shrink-0;
    }

    /* Contenido del mensaje */
    .message-text {
        @apply text-sm leading-relaxed break-all overflow-hidden text-ellipsis whitespace-nowrap;
    }

    .message-bubble a {
        @apply block overflow-hidden text-ellipsis whitespace-nowrap max-w-full;
    }
}
</style>