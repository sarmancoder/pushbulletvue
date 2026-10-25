import type { PusherType } from "../types"
import { token } from "../vars"
import PushbulletApi from "./PushbulletApi"

type PushbulletApiPusherConfig = {
    token: string
}

class PushbulletApiPusher extends PushbulletApi {
    constructor(config: PushbulletApiPusherConfig) {
        super(config.token)
    }

    async getPushes() {
        const req = await this.request('/pushes', {
            method: 'GET',
        })
        const data = await req.json()
        return data as { pushes: PusherType[] }
    }
}

export const pusher = new PushbulletApiPusher({
    token: token
})

export default pusher