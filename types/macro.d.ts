/// <reference path='./jsx.d.ts' />

import Vue, { ComponentOptions } from 'vue'
import {
  ComputedOptions,
  RecordPropsDefinition,
  DataDef,
  PropOptions,
  Constructor,
  FunctionalComponentOptions,
  RenderContext,
  InjectOptions,
  PropsDefinition,
} from 'vue/types/options'
import { CombinedVueInstance, VueConstructor } from 'vue/types/vue'
import { NormalizedScopedSlot, VNode } from 'vue/types/vnode'

declare const EVENT_TYPES: '#eventTypes'

declare const SLOT_TYPES: '#slotTypes'

declare const STATE_TYPES: '#stateTypes'

declare function component<
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  PropsDef,
  EventsDef,
  SlotsDef = None,
  StateDef = {}
>(
  definition: ThisTypedComponentDefinitions<
    PropsDef,
    EventsDef,
    SlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StateDef
  >,
): ComponentConstructor<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef
>

declare function functional<PropsDef, EventsDef, SlotsDef = None>(
  definition: FunctionalComponentDefinition<PropsDef, EventsDef, SlotsDef>,
): FunctionalComponentConstructor<PropsDef, EventsDef, SlotsDef>

declare function functional<Props = Record<string, any>>(
  render: FunctionalRender<Props, NormalizedListenerMap, NormalizedSlotMap>,
): FunctionalComponentConstructor<Props, {}, SlotType>

type MixedJSXVueInstance<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef,
  Props = ExtractPropsFromDef<PropsDef>,
  V extends Vue = JSXVue<
    Data,
    Readonly<Props>,
    Readonly<ExtractListeners<EventsDef>>,
    Readonly<ExtractSlots<SlotsDef>>,
    EventsDef,
    ExtractJSXProps<PropsDef>,
    ExtractJSXChildren<SlotsDef>
  >
> = CombinedVueInstance<V, Data, Methods, Computed, Props> &
  ExtractState<StateDef> &
  ExtractInstance<Extends> &
  ExtractMixinsInstance<Mixins> & { [key: string]: any }

interface ComponentConstructor<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef
>
  extends JSXVueConstructor<
    PropsDef,
    EventsDef,
    SlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StateDef
  > {}

type FunctionalComponentConstructor<
  PropsDef,
  EventsDef,
  SlotsDef
> = ComponentConstructor<PropsDef, EventsDef, SlotsDef, {}, {}, {}, [], {}, {}>

interface JSXVueConstructor<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef,
  Props = ExtractPropsFromDef<PropsDef>,
  V extends Vue = JSXVue<
    Data,
    Readonly<Props>,
    Readonly<ExtractListeners<EventsDef>>,
    Readonly<ExtractSlots<SlotsDef>>,
    EventsDef,
    ExtractJSXProps<PropsDef>,
    ExtractJSXChildren<SlotsDef>
  >
> extends VueConstructor<V> {
  new (): MixedJSXVueInstance<
    PropsDef,
    EventsDef,
    SlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StateDef,
    Props,
    V
  >
}

interface JSXVue<
  Data,
  InstanceProps,
  Listeners extends NormalizedListenerMap,
  Slots extends NormalizedSlotMap,
  EventsDef,
  JSXProps,
  JSXChildren
> extends Vue {
  $data: Data
  $props: InstanceProps
  $listeners: Optional<Listeners> & NormalizedListenerMap
  $scopedSlots: Slots
  $emit: ExtractEventEmitter<this, EventsDef> & ((...args: any[]) => this)
  '#props': JSXProps &
    (JSXChildren extends None
      ? {}
      : OptionalIfMatch<undefined, JSXChildren, { '#children': JSXChildren }>)
}

interface JSXComponentOptions<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef,
  State = ExtractState<StateDef>,
  Props = ExtractPropsFromDef<PropsDef>,
  MixedProps = Props &
    ExtractInstanceProps<ExtractMixinsInstance<Mixins>> &
    ExtractInstanceProps<ExtractInstance<Extends>>
>
  extends ComponentOptions<
    Vue,
    DataDef<Data, MixedProps & State, Vue>,
    Methods,
    Computed,
    PropsDef,
    MixedProps
  > {
  [STATE_TYPES]?: StateDef
  [SLOT_TYPES]?: SlotsDef
  [EVENT_TYPES]?: EventsDef
  // due to ComponentOptions['mixins'] is restricted to array, we have to specify mixin inner type.
  mixins?: [Mixins]
  extends?: Extends
}

type JSXRenderContext<Props, Listeners, Slots> = RenderContext<
  Props & Record<string, any>
> & {
  readonly listeners: Optional<Listeners>
  readonly scopedSlots: Slots
}

type FunctionalRender<Props, Listeners, Slots> = (
  this: undefined,
  context: JSXRenderContext<Props, Listeners, Slots>,
) => VNode | VNode[]

type FunctionalComponentDefinition<
  PropsDef,
  EventsDef,
  SlotsDef,
  Props = ExtractPropsFromDef<PropsDef>,
  Listeners extends NormalizedListenerMap = ExtractListeners<EventsDef>,
  Slots extends NormalizedSlotMap = ExtractSlots<SlotsDef>
> = {
  name?: string
  props?: PropsDef
  model?: {
    prop?: string
    event?: string
  }
  inject?: InjectOptions
  [SLOT_TYPES]?: SlotsDef
  [EVENT_TYPES]?: EventsDef
  render: FunctionalRender<Props, Listeners, Slots>
}

type ThisTypedComponentDefinitions<
  PropsDef,
  EventsDef,
  SlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StateDef,
  Props = ExtractPropsFromDef<PropsDef>,
  Listeners extends NormalizedListenerMap = ExtractListeners<EventsDef>,
  Slots extends NormalizedSlotMap = ExtractSlots<SlotsDef>
> = object &
  JSXComponentOptions<
    PropsDef,
    EventsDef,
    SlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StateDef
  > &
  ThisType<
    MixedJSXVueInstance<
      PropsDef,
      EventsDef,
      SlotsDef,
      Data,
      Methods,
      Computed,
      Mixins,
      Extends,
      StateDef
    >
  >

type ExtractInstance<T> = T extends Constructor ? InstanceType<T> : T

type ExtractMixinsInstance<Mixins> = UnionToIntersection<
  ExtractInstance<Mixins>
>

type ExtractInstanceProps<T> = ExtractInstance<T> extends { $props: infer P }
  ? P
  : {}

// State

type CheckOneStateMapOptional<T> = undefined extends T[keyof T]
  ? Optional<T>
  : T

type ExtractOneState<T> = { [K in keyof T]: InferredOrSelfType<T[K]> }

type ExtractState<T> = T extends Type<infer R>
  ? R
  : UnionToIntersection<
      {
        [K in keyof T]: CheckOneStateMapOptional<
          ExtractOneState<Pick<T, Extract<K, keyof T>>>
        >
      }[keyof T]
    >

/// Type

type Type<T> = { '#type': T }

declare function type<T>(): Type<T>

/// Props

type InferredOrSelfType<T, I = InferredType<T>> = I extends Unknown<T> ? T : I

interface None {
  __none__: true
}

interface Unknown<T = any> {
  __unknown__: true
}

type InferredType<T> = T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T extends symbol
  ? symbol
  : T extends Type<infer R>
  ? R
  : T extends { (): infer R }
  ? R
  : T extends { new (...args: any[]): infer R }
  ? R
  : Unknown<T>

type ExtractOneProp<T> = {
  [K in keyof T]: InferredType<T[K]> extends Unknown
    ? T[K] extends { type: Function; default: infer R } // function type
      ? R
      : T[K] extends { default: () => infer R }
      ? R
      : T[K] extends { type: infer R }
      ? InferredOrSelfType<R>
      : T[K] extends PropOptions<infer R>
      ? R
      : T[K]
    : InferredType<T[K]>
}

type ExtractPropsFromDef<T> = UnionToIntersection<
  {
    [K in keyof T]: OptionalIfNotMatch<
      T[K],
      { required: boolean } | { default: any }, // we assume the required exists only if it's true.
      ExtractOneProp<Pick<T, Extract<K, keyof T>>>
    >
  }[keyof T]
>

type ExtractJSXProps<T> = UnionToIntersection<
  {
    [K in keyof T]: OptionalIfNotMatch<
      T[K],
      { required: boolean }, // we assume the required exists only if it's true.
      ExtractOneProp<Pick<T, Extract<K, keyof T>>>
    >
  }[keyof T]
>

/// Listeners

type NormalizedListenerMap = Record<string, Function | Function[]>

type ExtractListeners<E> = {
  [K in keyof E]:
    | ((event: InferredOrSelfType<E[K]>) => void)
    | ((event: InferredOrSelfType<E[K]>) => void)[]
}

type ExtractEventEmitter<V, E> = UnionToIntersection<
  {
    [K in keyof E]: (event: K & string, payload: InferredOrSelfType<E[K]>) => V
  }[keyof E]
>

/// Slot

type NormalizedSlotMap = Record<string, NormalizedScopedSlot | undefined>

type SimpleSlotType = string | boolean | number | VNode

type SlotType = SimpleSlotType | VNode[] | undefined

type Slot = (props: any) => SlotType

type ExtractOneSlotMap<T> = { [K in keyof T]: ExtractOneSlot<T[K]> }

type CheckOneSlotMapOptional<T, O> = O extends { required: boolean }
  ? T
  : undefined extends T[keyof T]
  ? Optional<T>
  : T

type ExtractSlotsFromMap<T> = UnionToIntersection<
  {
    [K in keyof T]: CheckOneSlotMapOptional<
      ExtractOneSlotMap<Pick<T, Extract<K, keyof T>>>,
      T[K]
    >
  }[keyof T]
> &
  NormalizedSlotMap

type ExtractSlotType<T> = T extends { type: infer R }
  ? InferredOrSelfType<R>
  : SlotType

type ExtractSlotArg<T> = T extends { arg: infer A }
  ? InferredOrSelfType<A>
  : Unknown

type ConstructSlot<A, R> = A extends Unknown ? () => R : (props: A) => R

type ExtractOneSlot<
  T,
  I = InferredType<T>,
  R = ExtractSlotType<T>,
  A = ExtractSlotArg<T>
> = I extends Unknown
  ? T extends ({ type: infer R_ } | { arg: infer A_ })
    ? T extends { required: boolean }
      ? ConstructSlot<A, R>
      : ConstructSlot<A, R> | undefined
    : Unknown
  : T extends { required: boolean }
  ? () => SlotType
  : undefined extends I
  ? (() => I) | undefined
  : () => I

type ExtractDefaultSlotFromType<D> = D extends (Function | undefined)
  ? D
  : () => D

type ExtractDefaultSlotMap<
  T,
  S = ExtractOneSlot<T>,
  D = T extends Type<infer R> ? R : Unknown
> = T extends Function
  ? { default: T }
  : D extends Unknown
  ? S extends Unknown
    ? S
    : OptionalIfMatch<undefined, S, { default: S }>
  : OptionalIfMatch<undefined, D, { default: ExtractDefaultSlotFromType<D> }>

type ExtractSlots<T, D = ExtractDefaultSlotMap<T>> = D extends Unknown
  ? ExtractSlotsFromMap<T>
  : D & NormalizedSlotMap

type ExtractJSXChildType<T, I = InferredType<T>> = I extends Unknown
  ? T extends { type: infer R }
    ? InferredOrSelfType<R>
    : T
  : I

type ExtractJSXUnionChildrenFromMap<T> = [
  {
    [K in keyof T]: T[K] extends { required: boolean }
      ? ExtractJSXOneChild<T[K]>
      : (ExtractJSXOneChild<T[K]> | undefined)
  }[keyof T]
]

type ExtractJSXChildrenFromMap<
  T,
  K = ExtractJSXUnionChildrenFromMap<T>
> = K extends [infer I] ? I | I[] : never

type ExtractJSXOneChild<
  T,
  S = ExtractOneSlot<T>,
  F = S extends (...args: any[]) => infer R ? R : Unknown
> = undefined extends S ? F | undefined : F

type ExtractJSXSingleChild<
  T,
  I = InferredType<T>,
  R = ExtractSlotType<T>
> = T extends Function
  ? T
  : I extends Unknown
  ? T extends { type: infer R_ }
    ? T extends { required: boolean }
      ? R
      : R | undefined
    : T extends ({ arg: infer A_ } | { required: boolean })
    ? T extends { required: boolean }
      ? NonNullable<SlotType>
      : SlotType
    : T
  : I

type ExtractJSXChildren<T, C = ExtractJSXSingleChild<T>> = T extends None
  ? None
  : C extends Unknown
  ? ExtractJSXChildrenFromMap<T>
  : C

type P = ExtractJSXChildren<(() => number) | number | undefined>

/// Utils

type Optional<T> = { [K in keyof T]?: T[K] }

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

type OptionalIfMatch<T, C, R> = T extends C ? Optional<R> : R

type OptionalIfNotMatch<T, C, R> = T extends C ? R : Optional<R>

type ExtractArgs<T> = T extends (...args: infer A) => any ? A : never

export {
  component,
  functional,
  type,
  SlotType,
  SLOT_TYPES,
  EVENT_TYPES,
  STATE_TYPES,
}
