import { VNode } from 'vue/types/vnode'
import { TYPE } from './constants'

// Type
export declare function type<T = any>(): Type<T>

type Type<T> = { [TYPE]: T }

type RequiredNames<T> = T extends Type<any>
  ? never
  : { [K in keyof T]: T[K] extends { required: boolean } ? K : never }[keyof T]

// JSX
export type JSXChildren =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXNestedChildren

export interface JSXNestedChildren extends Array<JSXChildren> {}

export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

export type EventHandlers<Events> = {
  [K in keyof Events]?: Events[K] extends Function
    ? Events[K] | Events[K][]
    : ((event: Events[K]) => void) | ((event: Events[K]) => void)[]
}
