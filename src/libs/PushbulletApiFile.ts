import type { PushbulletFile } from "../types"
import PushbulletApi from "./PushbulletApi"

type PushbulletApiFileConfig = {
    token: string
}

export default class PushbulletApiFile extends PushbulletApi {
    private static instance: PushbulletApiFile | null = null

    private constructor(config: PushbulletApiFileConfig) {
        super(config.token)
    }

    public static getInstance(config: PushbulletApiFileConfig): PushbulletApiFile {
        if (!PushbulletApiFile.instance) {
            PushbulletApiFile.instance = new PushbulletApiFile(config)
        }
        return PushbulletApiFile.instance
    }

    async uploadRequest(file_info: PushbulletFile, file: File) {
        const response = await this.request(`/upload-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            } as any,
            body: JSON.stringify(file_info) as any
        })

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        await this.uploadFile(file, data.upload_url)
        return data
    }

    async uploadFile(file: File, upload_url: string) {
        console.log('UPLOADING FILE')
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(upload_url, {
            method: 'POST',
            headers: {
                'Access-Token': this.token
                // 'Content-Type': 'multipart/form-data',
                // 'Authorization': 'Bearer token'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    }
}