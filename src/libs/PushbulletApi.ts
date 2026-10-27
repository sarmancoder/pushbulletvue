export default class PushbulletApi {
    private BASE_URL = "https://api.pushbullet.com/v2"
    private token: string

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
        })
    }
}
