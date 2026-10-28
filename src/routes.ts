import { createRouter, createWebHashHistory } from 'vue-router'

import ChatPage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import Authenticate from './pages/authenticate.vue'
import { useMessagesStore } from './stores/useMessages'

const routes = [
    {
        path: '/',
        component: ChatPage,
        meta: { requiresAuth: true }
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

router.beforeEach((to, _from, next) => {
    const store = useMessagesStore()
    const isAuthenticated = !!store.appToken

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})