import { defineStore } from "pinia";
import { nextTick, ref, watch } from "vue";
import PushbulletApiPusher from "../libs/PushbulletApiPusher";
import PushbulletApiUser from "../libs/PushbulletApiUser";
import type { User } from "../types";

type Message = {
    id: string;
    sender: string;
    text: string;
    timestamp: number;
    isMe: boolean;
    type: 'note' | 'url'
}

export const useMessagesStore = defineStore('counter', () => {
    const appToken = ref('')
    const user = ref<User | null>()
    const cursor = ref('')
    const firstScrolled = ref(false)
    const socket = ref<ReturnType<typeof listenUpdates>>()
    const messages = ref<Message[]>([])

    const loading = ref(true)

    async function retrieveMessages() {
        try {
            loading.value = true
            const data = await PushbulletApiPusher.getInstance({ token: appToken.value }).getPushes(cursor.value)
            cursor.value = data.cursor
            const _messages = (data.pushes.map((x) => ({
                id: x.iden,
                text: x.type === 'note' ? x.body : x.type === 'link' ? x.url : x.file_url,
                sender: x.sender_name,
                timestamp: x.created,
                isMe: x.iden === user.value?.iden,
                type: x.type
            })) as Message[]).sort((a, b) => a.timestamp - b.timestamp);
            messages.value = [..._messages, ...messages.value,]
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    watch(appToken, async (val) => {
        if (!val) return;
        const userPushbullet = await PushbulletApiUser.getInstance({ token: appToken.value }).me()
        user.value = userPushbullet
        retrieveMessages()
        loading.value = false
        socket.value = listenUpdates({
            accessToken: appToken.value,
            onMessage(message) {
                console.log('Nueva actualización', message)
            },
        })
        await nextTick()

    })

    watch(messages, async () => {
        if (messages.value.length == 0) return
        if (firstScrolled.value) return
        await nextTick()
        window.scrollTo({
            top: document.body.scrollHeight
        })
        firstScrolled.value = true
    })

    async function pushMessage(message: string) {
        if (!appToken.value) return

        const apiPusher = await PushbulletApiPusher.getInstance({ token: appToken.value })
        const data = await apiPusher.postPush({
            body: message,
            type: 'note',
        })
        return data
    }

    function logout() {
        if (socket.value) {
            socket.value.close()
            socket.value = undefined
        }
        appToken.value = ''
        user.value = null
        messages.value = []
        loading.value = true
    }

    return { messages, loading, appToken, firstScrolled, user, retrieveMessages, pushMessage, logout }
}, {
    persist: {
        key: 'pushbullet_secure_session', // Nombre de la clave en el almacenamiento
        pick: ['appToken'], // Especifica qué variables quieres conservar al recargar

        // storage: localStorage // Por defecto usa localStorage (puedes cambiar a sessionStorage si prefieres que se borre al cerrar la pestaña)
    }
})

function listenUpdates({ onMessage, accessToken }: {
    accessToken: string
    onMessage: (message: any) => void
}) {
    const wsUrl = `wss://stream.pushbullet.com/websocket/${accessToken}`;

    // Crear la conexión WebSocket nativa
    const socket = new WebSocket(wsUrl);

    // Evento: Conexión abierta con éxito
    socket.addEventListener("open", (event) => {
        console.log("Conectado a Pushbullet WebSocket correctamente.");
    });

    // Evento: Mensaje recibido desde Pushbullet
    socket.addEventListener("message", (event) => {
        try {
            console.log(event.type, JSON.stringify(event))
            onMessage(event)
        } catch (error) {
            console.error("Error al parsear el mensaje JSON:", error);
        }
    });

    socket.addEventListener('open', (event) => {
        console.log('Escuchando actualizaciones')
    })

    // Evento: Error en la conexión
    socket.addEventListener("error", (event) => {
        console.error("Error en el WebSocket:", event);
    });

    // Evento: Conexión cerrada
    socket.addEventListener("close", (event) => {
        console.log(`Conexión cerrada. Código: ${event.code}, Razón: ${event.reason}`);
    });
    return {
        close() {
            socket.close()
        }
    }
}