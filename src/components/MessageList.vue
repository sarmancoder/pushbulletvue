<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useMessagesStore } from '../stores/useMessages.ts'
import { storeToRefs } from 'pinia'
import { useIntersectionObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const messagesStore = useMessagesStore()
const { messages, firstScrolled, loading, loadingMore } = storeToRefs(messagesStore)

const messagesContainer = useTemplateRef('messagesContainer')
const target = useTemplateRef('target')
const targetIsVisible = shallowRef(false)

const { stop } = useIntersectionObserver(
    target,
    async ([entry], observerElement) => {
        if (!firstScrolled.value) return
        if (loadingMore.value) return
        if (loading.value && messages.value.length === 0) return
        const isVisible = entry?.isIntersecting || false
        targetIsVisible.value = isVisible
        if (isVisible) {
            console.log('retrieving')
            const container = messagesContainer.value
            if (container) {
                const previousScrollHeight = container.scrollHeight
                const previousScrollTop = container.scrollTop
                await messagesStore.retrieveMessages()
                await nextTick()
                // Double RAF to ensure DOM updated
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (!container) return
                        const newScrollHeight = container.scrollHeight
                        const diff = newScrollHeight - previousScrollHeight
                        if (diff > 0) {
                            container.scrollTop = previousScrollTop + diff
                        }
                    })
                })
            } else {
                await messagesStore.retrieveMessages()
            }
        }
    },
)
</script>

<template>
    <div ref="messagesContainer" class="messages-container">

        <!-- Estado de carga inicial -->
        <div v-if="loading && messages.length === 0" class="messages-loading">
            <div class="loading-spinner"></div>
            <span>Cargando conversación...</span>
        </div>

        <!-- Indicador de carga al paginar (más visible) -->
        <div v-if="loadingMore" class="messages-loading-top">
            <div class="loading-spinner"></div>
            <span>Cargando mensajes anteriores...</span>
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

    /* Estado de carga inicial */
    .messages-loading {
        color: var(--text-secondary, #475569);
        @apply flex flex-col items-center justify-center h-full gap-3 text-sm font-medium;
    }

    /* Indicador de carga al paginar (más visible) */
    .messages-loading-top {
        color: var(--text-primary, #0f172a);
        @apply flex flex-row items-center justify-center gap-2 py-4 mb-2 text-sm font-semibold bg-[var(--bg-secondary)]/60 rounded-lg;
    }

    .loading-spinner {
        border-color: var(--border-color, #e2e8f0);
        border-top-color: var(--accent-primary, #6366f1);
        @apply w-6 h-6 border-2 rounded-full animate-spin;
    }
}
</style>