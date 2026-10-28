<script setup lang="ts">
import { ref } from 'vue';
import { useMessagesStore } from '../stores/useMessages';
import PushbulletApiFile from '../libs/PushbulletApiFile';
const errorMessage = ref('')
const message = ref('')
const unable = ref(false)

const { pushMessage, appToken } = useMessagesStore()

async function sendMessage(e: SubmitEvent) {
    try {
        const files = (e.target as HTMLFormElement)['fileAttached'].files as FileList
        const listFiles = []
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            listFiles.push({
                file_name: element.name,
                file_type: element.type
            })
        }
        console.log(listFiles)
        const result = await PushbulletApiFile.getInstance({ token: appToken }).uploadRequest(listFiles[0], files[0])
        if (message.value === '') {
            errorMessage.value = 'El mensaje no puede estar vacío'
            return
        }
        errorMessage.value = ''
        unable.value = true
        console.log(result)
        await pushMessage(message.value, {
            ...listFiles[0],
            file_url: result.file_url
        })
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
                    <div class="p-2">
                        <label for="fileAttach">Archivo a enviar</label>
                        <input type="file" name="fileAttached" id="fileAttach" />
                    </div>
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