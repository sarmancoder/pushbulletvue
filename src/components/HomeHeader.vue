<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMessagesStore } from '../stores/useMessages';
import Popover from './Popover.vue';

const messages = useMessagesStore()
const { user } = storeToRefs(messages)
function greet() {
    console.log('Holaaa')
}

</script>

<template>
    <div class="header">
        <div class="flex flex-row gap-2 items-center">
            <a href="https://pushbullet.com/" target="_blank">
                <img src="/logo.png" width="30" />
            </a>
            <span class="text-xl">
                Pushbullet
            </span>
        </div>
        <Popover placement="bottom" v-if="user">
            <template #trigger="{ toggle }">
                <div @click="toggle" class="text-right cursor-pointer">
                    <p>
                        {{ user.email }}
                    </p>
                    <p>
                        iden: {{ user.iden }}
                    </p>
                </div>
            </template>
            <div class="flex flex-col items-end">
                <h2 class="text-2xl">Panel de usuario</h2>
                <button class="bg-(--accent-primary) text-white px-5 py-2 rounded-md">
                    Cerrar sesión
                </button>
            </div>
        </Popover>
    </div>
</template>

<style lang="css" scoped>
@import 'tailwindcss';

.header {
    @apply fixed top-0 h-15 flex flex-row justify-between items-center bg-(--bg-primary) right-0 left-0 px-4;
}
</style>