import type { InjectionKey } from 'vue'

export const sliceNavigationKey: InjectionKey<(path: string) => Promise<void>> = Symbol('slice-navigation')
