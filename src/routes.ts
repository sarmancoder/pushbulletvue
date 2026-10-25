import { createRouter, createWebHistory } from 'vue-router'

import ChatPage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'

const routes = [
    {
        path: '/',
        component: ChatPage
    },
    {
        path: '/login',
        component: LoginPage
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})