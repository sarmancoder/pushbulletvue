import { defineStore } from "pinia"
import { onMounted, ref, watch } from "vue"
import PushbulletApiPusher from "../libs/PushbulletApiPusher";
import type { User } from "../types";
import PushbulletApiUser from "../libs/PushbulletApiUser";

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
    const messages = ref<Message[]>([
        /*{ id: 1, sender: 'Carlos', text: '¡Hola! ¿Qué tal vas probando Tailwind CSS v4?', timestamp: '10:30 AM', isMe: false },
        { id: 2, sender: 'Tú', text: '¡Hola Carlos! Todo excelente, la sintaxis con el nuevo import global es súper limpia.', timestamp: '10:32 AM', isMe: true },
        { id: 3, sender: 'Carlos', text: 'Me alegra oír eso. ¿Y qué tal funcionan los componentes?', timestamp: '10:33 AM', isMe: false },
        { id: 4, sender: 'Tú', text: 'Genial, combinados con las variables CSS y @apply se adaptan solos al modo oscuro.', timestamp: '10:35 AM', isMe: true },
        { id: 5, sender: 'Carlos', text: '¿Ya configuraste las fuentes y los colores personalizados en el archivo CSS?', timestamp: '10:36 AM', isMe: false },
        { id: 6, sender: 'Tú', text: 'Sí, usé variables nativas :root y .dark para cambiar todo al vuelo.', timestamp: '10:38 AM', isMe: true },
        { id: 7, sender: 'Carlos', text: 'Eso es clave para mantener el diseño limpio. ¿Y qué tal el rendimiento?', timestamp: '10:39 AM', isMe: false },
        { id: 8, sender: 'Tú', text: 'Volando, compila rapidísimo con Vite.', timestamp: '10:40 AM', isMe: true },
        { id: 9, sender: 'Carlos', text: 'Excelente. Oye, ¿te acuerdas de la reunión de arquitectura de esta tarde?', timestamp: '10:42 AM', isMe: false },
        { id: 10, sender: 'Tú', text: 'Claro que sí, a las 4:00 PM, ¿verdad?', timestamp: '10:43 AM', isMe: true },
        { id: 11, sender: 'Carlos', text: 'Sí, justo esa. ¿Tienes listos los slides con la demo?', timestamp: '10:44 AM', isMe: false },
        { id: 12, sender: 'Tú', text: 'Casi terminados, solo me falta revisar los estilos de la tabla de datos.', timestamp: '10:45 AM', isMe: true },
        { id: 13, sender: 'Carlos', text: 'Perfecto, acuérdate de usar clases reutilizables con @apply para no repetir código.', timestamp: '10:47 AM', isMe: false },
        { id: 14, sender: 'Tú', text: 'Justo lo que hice. Creé un par de clases base para los inputs y botones.', timestamp: '10:48 AM', isMe: true },
        { id: 15, sender: 'Carlos', text: '¡Qué crack! Así el diseño se ve consistente en toda la plataforma.', timestamp: '10:50 AM', isMe: false },
        { id: 16, sender: 'Tú', text: 'Totalmente. ¿Viste el nuevo componente de chat que armamos?', timestamp: '10:51 AM', isMe: true },
        { id: 17, sender: 'Carlos', text: 'Sí, las burbujas con bordes redondeados y los avatares se ven muy profesionales.', timestamp: '10:53 AM', isMe: false },
        { id: 18, sender: 'Tú', text: 'Y lo mejor es que soporta auto-scroll automático cuando entran nuevos mensajes.', timestamp: '10:54 AM', isMe: true },
        { id: 19, sender: 'Carlos', text: 'Eso mejora la experiencia de usuario un montón.', timestamp: '10:55 AM', isMe: false },
        { id: 20, sender: 'Tú', text: 'Sin duda. ¿Quieres que hagamos una prueba de carga con más mensajes?', timestamp: '10:57 AM', isMe: true },
        { id: 21, sender: 'Carlos', text: 'Justo te iba a pedir eso, para probar el scrollbar personalizado.', timestamp: '10:58 AM', isMe: false },
        { id: 22, sender: 'Tú', text: 'Hecho, aquí tienes un listado largo para probar el desbordamiento.', timestamp: '11:00 AM', isMe: true },
        { id: 23, sender: 'Carlos', text: '¡Genial! Veo que la barra se ve fina y elegante en ambos modos.', timestamp: '11:02 AM', isMe: false },
        { id: 24, sender: 'Tú', text: 'Sí, los selectores de scrollbar en el CSS global hacen magia.', timestamp: '11:03 AM', isMe: true },
        { id: 25, sender: 'Carlos', text: 'Oye, hablando de otra cosa, ¿almorzamos juntos hoy?', timestamp: '11:05 AM', isMe: false },
        { id: 26, sender: 'Tú', text: 'Me parece perfecto. ¿A las 2:00 PM en la cafetería de la esquina?', timestamp: '11:06 AM', isMe: true },
        { id: 27, sender: 'Carlos', text: 'Hecho. Piden lasaña de nuevo que estaba buenísima la semana pasada.', timestamp: '11:08 AM', isMe: false },
        { id: 28, sender: 'Tú', text: 'Jajaja, ¡trato hecho! De solo pensarlo me dio hambre.', timestamp: '11:09 AM', isMe: true },
        { id: 29, sender: 'Carlos', text: 'Oye, volviendo al código, ¿tienes problemas con los selectores anidados en Tailwind v4?', timestamp: '11:12 AM', isMe: false },
        { id: 30, sender: 'Tú', text: 'Nop, nativamente soporta anidación CSS pura, lo cual es comodísimo.', timestamp: '11:13 AM', isMe: true },
        { id: 31, sender: 'Carlos', text: '¡Ah, es verdad! Ya no hace falta instalar PostCSS plugins extra.', timestamp: '11:15 AM', isMe: false },
        { id: 32, sender: 'Tú', text: 'Exacto, el motor nuevo Oxide vuela por sí solo.', timestamp: '11:16 AM', isMe: true },
        { id: 33, sender: 'Carlos', text: 'Qué gran avance para el ecosistema frontend.', timestamp: '11:18 AM', isMe: false },
        { id: 34, sender: 'Tú', text: 'Sí, cada vez las herramientas son más rápidas y menos pesadas.', timestamp: '11:19 AM', isMe: true },
        { id: 35, sender: 'Carlos', text: 'Bueno, te dejo un rato para que termines los slides de la demo.', timestamp: '11:21 AM', isMe: false },
        { id: 36, sender: 'Tú', text: 'Dale, cualquier cosa te aviso por aquí mismo.', timestamp: '11:22 AM', isMe: true },
        { id: 37, sender: 'Carlos', text: '¡Perfecto! Mucho éxito con eso.', timestamp: '11:23 AM', isMe: false },
        { id: 38, sender: 'Tú', text: '¡Gracias Carlos! Nos vemos al rato.', timestamp: '11:24 AM', isMe: true },
        { id: 39, sender: 'Carlos', text: 'Por cierto, ¿ya probaste el estado vacío del componente de lista?', timestamp: '11:25 AM', isMe: false },
        { id: 40, sender: 'Tú', text: 'Sí, si vaciamos el array de mensajes muestra un icono y un texto muy limpio.', timestamp: '11:27 AM', isMe: true },
        { id: 41, sender: 'Carlos', text: 'Excelente detalle de UI/UX.', timestamp: '11:28 AM', isMe: false },
        { id: 42, sender: 'Tú', text: 'Hay que cuidar cada rincón de la aplicación para que se vea premium.', timestamp: '11:30 AM', isMe: true },
        { id: 43, sender: 'Carlos', text: 'Totalmente de acuerdo. La primera impresión entra por los ojos.', timestamp: '11:31 AM', isMe: false },
        { id: 44, sender: 'Tú', text: 'Exacto. Bueno, me pongo a terminar esto de una vez.', timestamp: '11:33 AM', isMe: true },
        { id: 45, sender: 'Carlos', text: '¡Venga, a darle duro!', timestamp: '11:34 AM', isMe: false },
        { id: 46, sender: 'Tú', text: '¡Nos vemos pronto!', timestamp: '11:35 AM', isMe: true },
        { id: 47, sender: 'Carlos', text: '👍', timestamp: '11:36 AM', isMe: false },
        { id: 48, sender: 'Tú', text: '🚀', timestamp: '11:37 AM', isMe: true },
        { id: 49, sender: 'Carlos', text: '☕', timestamp: '11:38 AM', isMe: false },
        { id: 50, sender: 'Tú', text: 'Nos vemos en el almuerzo.', timestamp: '11:40 AM', isMe: true }*/
    ])

    const loading = ref(true)

    watch(appToken, async (val) => {
        if (!val) return;
        const userPushbullet = await PushbulletApiUser.getInstance({ token: appToken.value }).me()
        user.value = userPushbullet
        const data = await PushbulletApiPusher.getInstance({ token: appToken.value }).getPushes()
        const _messages = data.pushes.map((x) => ({
            id: x.iden,
            text: x.body,
            sender: x.sender_name,
            timestamp: x.created,
            isMe: true,
            type: x.type
        })) as Message[]
        messages.value = _messages
        loading.value = false
    })

    return { messages, loading, appToken, user }
}, {
    persist: {
        key: 'pushbullet_secure_session', // Nombre de la clave en el almacenamiento
        pick: ['appToken'], // Especifica qué variables quieres conservar al recargar

        // storage: localStorage // Por defecto usa localStorage (puedes cambiar a sessionStorage si prefieres que se borre al cerrar la pestaña)
    }
})