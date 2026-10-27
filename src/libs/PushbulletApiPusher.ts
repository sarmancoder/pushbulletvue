import type { PusherType } from "../types"
import PushbulletApi from "./PushbulletApi"

type PushbulletApiPusherConfig = {
    token: string
}

export default class PushbulletApiPusher extends PushbulletApi {
    private static instance: PushbulletApiPusher | null = null

    private constructor(config: PushbulletApiPusherConfig) {
        super(config.token)
    }

    public static getInstance(config: PushbulletApiPusherConfig): PushbulletApiPusher {
        if (!PushbulletApiPusher.instance) {
            PushbulletApiPusher.instance = new PushbulletApiPusher(config)
        }
        return PushbulletApiPusher.instance
    }

    async getPushes(cursor: string) {
        const params = new URLSearchParams({
            cursor: cursor
        })
        const req = await this.request(`/pushes?${params.toString()}`, {
            method: 'GET',
        })
        const data = await req.json()
        return data as { cursor: string, pushes: PusherType[] }
    }

    async postPush(dataToSend: Partial<PusherType>) {
        console.log({ dataToSend })
        const query = new URLSearchParams({ active: 'true' })
        const req = await this.request(`/pushes?${query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            } as any,
            body: JSON.stringify(dataToSend) as any
        })
        const data = await req.json()
        return data as { push: PusherType[] }
    }
}