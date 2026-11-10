import { createRouter, createWebHashHistory } from 'vue-router'

import ChatPage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import Authenticate from './pages/authenticate.vue'
import { useMessagesStore } from './stores/useMessages'

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean
        popup?: boolean
    }
}

const routes = [
    {
        path: '/',
        component: ChatPage,
        meta: { requiresAuth: true }
    },
    {
        // Mismo contenido que '/', pero limitado a la altura del popup (520px)
        path: '/popup',
        component: ChatPage,
        meta: { requiresAuth: true, popup: true }
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/authenticate',
        component: Authenticate
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to) => {
    const store = useMessagesStore()
    const isAuthenticated = !!store.appToken
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Recordamos la ruta de destino para volver a ella tras iniciar sesión
        return { path: '/login', query: { redirect: to.fullPath } }
    }

    if (to.path === '/login' && isAuthenticated) {
        return redirect === '/login' ? '/' : redirect
    }

    return true
})
