<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useMessagesStore } from '../stores/useMessages.ts'
import { storeToRefs } from 'pinia'
const messagesStore = useMessagesStore()
const { messages, loading } = storeToRefs(messagesStore)

// Referencia para el auto-scroll
const scrollContainer = ref(null)

const scrollToBottom = async () => {
    await nextTick()
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
}

// Hacer scroll al montar y cuando cambien los mensajes
watch(() => messages, () => {
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