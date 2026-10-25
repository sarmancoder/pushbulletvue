import { createRouter, createWebHistory } from 'vue-router'

import ChatPage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import Authenticate from './pages/authenticate.vue'

const routes = [
    {
        path: '/',
        component: ChatPage
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
    history: createWebHistory(),
    routes,
})