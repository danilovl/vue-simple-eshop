export type AlertItem = {
    id: number;
    type: string;
    text: string;
}

export type AlertState = {
    alerts: AlertItem[];
}
