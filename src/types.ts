export type PusherType = {
    active: boolean;
    iden: string;
    created: number;
    modified: number;
    type: 'note' | 'link' | 'file';
    dismissed: boolean;
    guid: string;
    direction: string;
    sender_iden: string;
    sender_email: string;
    sender_email_normalized: string;
    sender_name: string;
    receiver_iden: string;
    receiver_email: string;
    receiver_email_normalized: string;
    source_device_iden: string;
    awake_app_guids: string[];
    body: string;
    url: string;
    file_url: string;
}

export type User = {
    created: number;
    email: string;
    email_normalized: string;
    iden: string;
    image_url: string;
    max_upload_size: number;
    modified: number;
    name: string;
}

export type PushbulletFile = { file_name: string, file_type: string }