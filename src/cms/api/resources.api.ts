export const resourceKinds = ['posts'] as const

export type ResourceKind = typeof resourceKinds[number]
