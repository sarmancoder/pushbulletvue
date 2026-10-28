<script setup lang="ts">
import { ref } from 'vue';
import { useMessagesStore } from '../stores/useMessages';
const errorMessage = ref('')
const message = ref('')
const unable = ref(false)

const { pushMessage } = useMessagesStore()

async function sendMessage() {
    try {
        if (message.value === '') {
            errorMessage.value = 'El mensaje no puede estar vacío'
            return
        }
        errorMessage.value = ''
        unable.value = true
        await pushMessage(message.value)
        message.value = ""
    } catch (error: any) {
        errorMessage.value = error.message
    } finally {
        unable.value = false
    }
}
</script>

<template>
    <form @submit.prevent="sendMessage">
        <div class="fixed bottom-0 left-0 right-0 pb-3 sm:pb-4">
            <div class="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-6">
                <div
                    class="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg overflow-hidden">
                    <p v-if="errorMessage" class="px-4 pt-2 text-xs font-medium text-red-500">{{ errorMessage }}</p>
                    <div class="flex flex-row items-center gap-2 p-2 sm:p-2.5">
                        <input :readonly="unable" placeholder="Escribe aquí tu mensaje..." v-model="message"
                            class="flex-1" />
                        <button :disabled="unable" type="submit" class="shrink-0 px-5">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style lang="css" scoped></style>