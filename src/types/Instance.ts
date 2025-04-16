export type ConnectionState = 'close' | 'connecting' | 'open' | 'pairing';

export interface Instance {
    id: string;
    name: string;
    connectionStatus: ConnectionState;
    status: string;
    owner: string | null;
    profileName: string | null;
    profilePicUrl: string | null;
    qrcode?: string;
}
