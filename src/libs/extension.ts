/**
 * Utilidades para abrir la propia extensión en una pestaña del navegador.
 *
 * La extensión se sirve desde dos sitios distintos:
 *  - En desarrollo:  http://localhost:5173/index.html#/popup
 *  - Empaquetada:    chrome-extension://<id>/index.html#/popup
 *
 * Por eso la URL se construye a partir de la ubicación actual, quitando el hash
 * (la ruta de vue-router) y añadiendo la ruta deseada.
 */

type ChromeTabsLike = {
    tabs?: {
        create?: (options: { url: string; active?: boolean }) => unknown
    }
}

/** URL base de la extensión tal y como está cargada, sin la ruta (hash). */
export function getExtensionBaseUrl(): string {
    return window.location.href.split('#')[0]
}

/** URL completa de la extensión para una ruta interna (por ejemplo '/' o '/popup'). */
export function getExtensionUrl(route = '/'): string {
    const path = route.startsWith('/') ? route : `/${route}`
    return `${getExtensionBaseUrl()}#${path}`
}

/**
 * Abre la extensión en una pestaña nueva del navegador.
 * Si la API de extensiones no está disponible, cae a window.open.
 */
export function openExtensionInTab(route = '/'): void {
    const url = getExtensionUrl(route)
    const chromeApi = (window as any).chrome as ChromeTabsLike | undefined

    if (chromeApi?.tabs?.create) {
        try {
            const result = chromeApi.tabs.create({ url, active: true }) as Promise<unknown> | undefined
            // En Chrome/Firefox moderno devuelve una promesa: si falla, usamos window.open
            if (result && typeof result.catch === 'function') {
                result.catch(() => window.open(url, '_blank'))
            }
            return
        } catch (error) {
            console.error('No se pudo abrir la extensión en una pestaña', error)
            window.open(url, '_blank')
            return
        }
    }

    window.open(url, '_blank')
}
