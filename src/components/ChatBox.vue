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
        errorMessage.value === ''
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
        <div class="fixed bottom-0 left-0 px-5 h-20 right-0 flex flex-col justify-center bg-(--bg-primary)">
            <p v-if="errorMessage" class="font-bold text-red-800">{{ errorMessage }}</p>
            <div class="flex flex-row gap-2 items-center">
                <input :readonly="unable" placeholder="Escribe aqui tu mensaje" v-model="message" />
                <button :disabled="unable" type="submit">Enviar</button>
            </div>
        </div>
    </form>
</template>

<style lang="css" scoped></style>