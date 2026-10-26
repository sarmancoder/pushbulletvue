import type { User } from "../types"
import PushbulletApi from "./PushbulletApi"

type PushbulletApiPusherConfig = {
    token: string
}

export default class PushbulletApiUser extends PushbulletApi {
    private static instance: PushbulletApiUser | null = null

    private constructor(config: PushbulletApiPusherConfig) {
        super(config.token)
    }

    public static getInstance(config: PushbulletApiPusherConfig): PushbulletApiUser {
        if (!PushbulletApiUser.instance) {
            PushbulletApiUser.instance = new PushbulletApiUser(config)
        }
        return PushbulletApiUser.instance
    }

    async me() {
        const req = await this.request('/users/me', {
            method: 'GET',
        })
        const data = await req.json()
        return data as User
    }
}