<script setup lang="ts">
import { ref } from 'vue';
import { useMessagesStore } from '../stores/useMessages';
const message = ref('')

const { pushMessage } = useMessagesStore()

function sendMessage() {
    pushMessage(message.value)
}

</script>

<template>
    <div class="fixed bottom-0 left-0 right-0 flex flex-row gap-2 px-5 h-20 items-center bg-(--bg-primary)">
        <input placeholder="Escribe aqui tu mensaje" v-model="message" />
        <button @click="sendMessage">Enviar</button>
    </div>
</template>

<style lang="css" scoped></style>