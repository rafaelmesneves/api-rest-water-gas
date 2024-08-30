export function validateBase64(str: string): boolean {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str
    } catch (error) {
        return false
    }
}
