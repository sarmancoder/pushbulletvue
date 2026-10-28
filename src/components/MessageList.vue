<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useMessagesStore } from '../stores/useMessages.ts'
import { storeToRefs } from 'pinia'
import { useIntersectionObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const messagesStore = useMessagesStore()
const { messages, firstScrolled, loading } = storeToRefs(messagesStore)

const loaderDiv = ref()

const target = useTemplateRef('target')
const targetIsVisible = shallowRef(false)

const { stop } = useIntersectionObserver(
    target,
    ([entry], observerElement) => {
        if (!firstScrolled.value) return
        const isVisible = entry?.isIntersecting || false
        targetIsVisible.value = isVisible
        if (isVisible) {
            console.log('retrieving')
            messagesStore.retrieveMessages()
        }
    },
)
</script>

<template>
    <div class="messages-container">

        <!-- Estado de carga -->
        <div v-if="loading" class="messages-loading">
            <div class="loading-spinner"></div>
            <span>Cargando conversación...</span>
        </div>
        <div class="h-4" ref="target"></div>

        <!-- Estado vacío -->
        <div v-if="!loading && messages.length === 0" class="messages-empty">
            <div class="empty-icon">💬</div>
            <p class="empty-title">No hay mensajes aún</p>
            <p class="empty-subtitle">Escribe el primer mensaje para empezar la conversación.</p>
        </div>
        <!-- Lista de mensajes -->
        <div v-else class="messages-list">
            <ChatMessage v-for="msg in messages" :key="msg.id" :sender="msg.sender" :message="msg.text"
                :timestamp="msg.timestamp" :is-me="msg.isMe" />
        </div>

    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer components {

    /* Contenedor principal de la lista */
    .messages-container {
        background-color: transparent;
        @apply flex-1 overflow-y-auto px-4 sm:px-6 py-6 h-full;
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
        @apply flex flex-col gap-1;
    }

    /* Estado vacío */
    .messages-empty {
        @apply flex flex-col items-center justify-center h-full text-center p-6;
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
        @apply text-sm mt-1;
    }

    /* Estado de carga */
    .messages-loading {
        color: var(--text-secondary, #475569);
        @apply flex flex-col items-center justify-center h-full gap-3 text-xs font-medium;
    }

    .loading-spinner {
        border-color: var(--border-color, #e2e8f0);
        border-top-color: var(--accent-primary, #6366f1);
        @apply w-6 h-6 border-2 rounded-full animate-spin;
    }
}
</style>