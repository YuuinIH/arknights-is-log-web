export function GetStaticUrl(location: string) {
    if (import.meta.env.VITE_STATIC.length) {
        return new URL(location, import.meta.env.VITE_STATIC).href;
    }
    return location;
}
