import { API_ADDRESS } from "../vars"

export default class PushbulletApi {
    private BASE_URL = API_ADDRESS
    protected token: string

    constructor(token: string) {
        this.token = token
    }

    async request(path: `/${string}`, input: Partial<Request>) {
        const reqHeaders = {
            ...input.headers,
            'Access-Token': this.token
        } as any

        console.log(path, {
            ...input,
            ...reqHeaders
        })

        return fetch(`${this.BASE_URL}${path}`, {
            method: input.method,
            headers: reqHeaders,
            body: input.body
        })
    }
}
