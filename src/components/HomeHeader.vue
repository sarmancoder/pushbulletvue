<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMessagesStore } from '../stores/useMessages';
import Popover from './Popover.vue';
import { useRouter } from 'vue-router';

const messages = useMessagesStore()
const { user } = storeToRefs(messages)
const router = useRouter()

function logout() {
    messages.logout()
    router.push('/login')
}
</script>

<template>
    <header class="header">
        <div class="flex flex-row gap-2 items-center">
            <a href="https://pushbullet.com/" target="_blank">
                <img src="/logo.png" width="28" alt="Pushbullet logo" />
            </a>
            <span class="text-lg sm:text-xl font-semibold tracking-tight">
                Pushbullet
            </span>
        </div>
        <Popover placement="bottom" v-if="user">
            <template #trigger="{ toggle }">
                <div @click="toggle" class="text-right cursor-pointer">
                    <p class="text-sm font-medium">
                        {{ user.email }}
                    </p>
                    <p class="text-xs text-[var(--text-muted)]">
                        iden: {{ user.iden }}
                    </p>
                </div>
            </template>
            <div class="flex flex-col items-end gap-2">
                <h2 class="text-lg font-semibold">Panel de usuario</h2>
                <button @click="logout" class="bg-[var(--accent-primary)] text-white px-4 py-2 rounded-lg">
                    Cerrar sesión
                </button>
            </div>
        </Popover>
    </header>
</template>

<style lang="css" scoped>
@import 'tailwindcss';

.header {
    @apply fixed top-0 h-16 flex flex-row justify-between z-50 items-center bg-[var(--bg-primary)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-primary)]/80 right-0 left-0 px-4 sm:px-6 border-b border-[var(--border-color)];
}
</style>