/**
 * Logs messages to the console.
 */
export const log = {
  success(message: string): void {
    console.info('✅', message)
  },
  info(message: string): void {
    console.info('ℹ️', message)
  },
  warn(message: string): void {
    console.warn('⚠️', message)
  },
  error(message: string): void {
    console.error('⛔', message)
  },
}
