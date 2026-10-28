<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMessagesStore } from '../stores/useMessages';
const errorMessage = ref('')
const message = ref('')
const unable = ref(false)
const isDragging = ref(false)
const filesLoaded = ref<File[]>([])
const imagesLoaded = ref<string[]>([])

const { pushMessage, pushFiles } = useMessagesStore()

const filesLabel = computed(() => {
    const total = filesLoaded.value.length
    return total === 1
        ? 'Se va a cargar 1 archivo'
        : `Se van a cargar ${total} archivos`
})

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    if (!e.dataTransfer) return
    const droppedFiles = Array.from(e.dataTransfer.files) as File[]
    processFiles(droppedFiles)
}

function readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr.result as string)
        fr.onerror = () => reject(fr.error)
        fr.readAsDataURL(file)
    })
}

async function processFiles(files: File[]) {
    filesLoaded.value = files
    const images = files.filter(file => file.type.startsWith('image/'))
    try {
        // Promise.all mantiene el mismo orden en que se soltaron los archivos
        imagesLoaded.value = await Promise.all(images.map(readAsDataURL))
    } catch (error: any) {
        errorMessage.value = 'No se pudo generar la vista previa de algunas imágenes'
    }
}

async function sendMessage() {
    try {
        if (message.value === '') {
            errorMessage.value = 'El mensaje no puede estar vacío'
            return
        }
        errorMessage.value = ''
        unable.value = true
        console.log(`cargando ${filesLoaded.value.length} archivos`)
        if (filesLoaded.value.length > 0) await pushFiles(message.value, filesLoaded.value)
        else await pushMessage(message.value)
        message.value = ""
        filesLoaded.value = []
        imagesLoaded.value = []
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
            <div class="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-6" @dragenter.prevent="isDragging = true"
                @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop">
                <div class="dropzone rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg overflow-hidden"
                    :class="{ 'is-dragging': isDragging }">
                    <p v-if="errorMessage" class="px-4 pt-2 text-xs font-medium text-red-500">{{ errorMessage }}</p>
                    <p v-if="filesLoaded.length" class="px-4 pt-2 text-xs font-medium text-[var(--text-secondary)]">
                        {{ filesLabel }}
                    </p>
                    <div v-if="imagesLoaded.length" class="flex flex-row flex-wrap gap-2 p-2">
                        <img v-for="(src, index) in imagesLoaded" :key="index" :src="src" width="200" />
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

<style lang="css" scoped>
.dropzone {
    position: relative;
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.dropzone.is-dragging {
    border-style: dashed;
    border-color: var(--border-focus);
    background-color: color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--border-focus) 30%, transparent);
    /* Evita el parpadeo de dragleave al pasar sobre los hijos */
    pointer-events: none;
}

/* Capa con el mensaje mientras se arrastra */
.dropzone.is-dragging::after {
    content: 'Suelta tus archivos aquí';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent-primary);
    background-color: color-mix(in srgb, var(--bg-secondary) 85%, transparent);
    backdrop-filter: blur(2px);
}
</style>