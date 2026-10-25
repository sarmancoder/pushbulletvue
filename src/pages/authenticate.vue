<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMessagesStore } from '../stores/useMessages';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useMessagesStore()
const router = useRouter()
const route = useRoute()

const { appToken } = storeToRefs(store)

onMounted(() => {

    if (route.hash) {
        // Quitamos el primer carácter ('#') para poder procesarlo
        const hashClean = route.hash.substring(1)
        const params = new URLSearchParams(hashClean)

        const accessToken = params.get('access_token')

        if (accessToken) {
            appToken.value = accessToken
            router.push('/')
        }
    }
})
</script>

<template>
    <div>
        autenticar
    </div>
</template>

<style lang="css" scoped></style>