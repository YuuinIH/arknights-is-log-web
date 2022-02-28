export function getImageUrl(location: string) {
    return new URL(`./${location}`, import.meta.url).href;
}
