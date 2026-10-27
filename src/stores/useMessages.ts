import { defineStore } from "pinia";
import { ref, watch } from "vue";
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
    const socket = ref<ReturnType<typeof listenUpdates>>()
    const messages = ref<Message[]>([])

    const loading = ref(true)

    watch(appToken, async (val) => {
        if (!val) return;
        const userPushbullet = await PushbulletApiUser.getInstance({ token: appToken.value }).me()
        user.value = userPushbullet
        const data = await PushbulletApiPusher.getInstance({ token: appToken.value }).getPushes()
        const _messages = (data.pushes.map((x) => ({
            id: x.iden,
            text: x.type === 'note' ? x.body : x.type === 'link' ? x.url : x.file_url,
            sender: x.sender_name,
            timestamp: x.created,
            isMe: x.iden === user.value?.iden,
            type: x.type
        })) as Message[]).sort((a, b) => a.timestamp - b.timestamp);
        messages.value = _messages
        loading.value = false
        socket.value = listenUpdates({
            accessToken: appToken.value,
            onMessage(message) {
                console.log('Nueva actualización', message)
            },
        })
    })

    async function pushMessage(message: string) {
        if (!appToken.value) return

        const url = 'https://api.pushbullet.com/v2/pushes?active=true';
        const options = {
            method: 'POST',
            headers: {
                'Access-Token': appToken.value,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Notificación desde mi App',
                body: message,
                type: 'note'
                // Elimina completamente 'email' y 'receiver_iden' si quieres que llegue a tus dispositivos por defecto
            })
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        /*const apiPusher = await PushbulletApiPusher.getInstance({ token: appToken.value })
        const data = await apiPusher.postPush({
            body: message,
            type: 'note',
            source_device_iden: user.value?.iden
        })
        console.log(data)
        return data*/
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

    return { messages, loading, appToken, user, pushMessage, logout }
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