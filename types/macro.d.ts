/// <reference path='./jsx.d.ts' />

import Vue, { ComponentOptions } from 'vue'
import {
  DataDef,
  PropOptions,
  Constructor,
  RenderContext,
  InjectOptions,
} from 'vue/types/options'
import { CombinedVueInstance, VueConstructor } from 'vue/types/vue'
import {
  NormalizedScopedSlot,
  VNode,
  ScopedSlotChildren,
} from 'vue/types/vnode'

declare const STATES: unique symbol
declare const EVENTS: unique symbol
declare const INJECTIONS: unique symbol
declare const SCOPED_SLOTS: unique symbol

declare const TYPE_KEY: unique symbol
declare const NONE_KEY: unique symbol
declare const UNKNOWN_KEY: unique symbol

declare function component<
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  PropsDef,
  EventsDef,
  ScopedSlotsDef = None,
  StatesDef = {},
  InjectionsDef = {}
>(
  definition: ThisTypedComponentDefinitions<
    PropsDef,
    EventsDef,
    ScopedSlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StatesDef,
    InjectionsDef
  >,
): ComponentConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef
>

declare function functional<
  PropsDef,
  EventsDef,
  ScopedSlotsDef = None,
  InjectionsDef = {}
>(
  definition: FunctionalComponentDefinition<
    PropsDef,
    EventsDef,
    ScopedSlotsDef,
    InjectionsDef
  >,
): FunctionalComponentConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  InjectionsDef
>

declare function functional<Props = Record<string, any>>(
  render: FunctionalRender<
    Props,
    NormalizedListenerMap,
    NormalizedScopedSlotMap,
    Record<string, any>
  >,
): FunctionalComponentConstructor<Props, {}, {}, {}>

type MixedJSXVueInstance<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef,
  Props = ExtractProps<PropsDef>,
  V extends Vue = JSXVue<
    Data,
    Readonly<Props>,
    Readonly<ExtractListeners<EventsDef>>,
    Readonly<ExtractScopedSlots<ScopedSlotsDef>>,
    EventsDef,
    ExtractJSXProps<PropsDef>,
    ExtractJSXChildren<ScopedSlotsDef>
  >
> = CombinedVueInstance<V, Data, Methods, Computed, Props> &
  ExtractStates<StatesDef> &
  ExtractInjections<InjectionsDef> &
  ExtractInstance<Extends> &
  ExtractMixinsInstance<Mixins> & { [key: string]: any }

interface ComponentConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef
>
  extends JSXVueConstructor<
    PropsDef,
    EventsDef,
    ScopedSlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StatesDef,
    InjectionsDef
  > {}

type FunctionalComponentConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  InjectionsDef
> = ComponentConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  {},
  {},
  {},
  [],
  {},
  {},
  InjectionsDef
>

interface JSXVueConstructor<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef,
  Props = ExtractProps<PropsDef>,
  V extends Vue = JSXVue<
    Data,
    Readonly<Props>,
    Readonly<ExtractListeners<EventsDef>>,
    Readonly<ExtractScopedSlots<ScopedSlotsDef>>,
    EventsDef,
    ExtractJSXProps<PropsDef>,
    ExtractJSXChildren<ScopedSlotsDef>
  >
> extends VueConstructor<V> {
  new (): MixedJSXVueInstance<
    PropsDef,
    EventsDef,
    ScopedSlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StatesDef,
    InjectionsDef,
    Props,
    V
  >
}

interface JSXVue<
  Data,
  InstanceProps,
  Listeners extends NormalizedListenerMap,
  ScopedSlots extends NormalizedScopedSlotMap,
  EventsDef,
  JSXProps,
  JSXChildren
> extends Vue {
  $data: Data
  $props: InstanceProps
  $listeners: Optional<Listeners> & NormalizedListenerMap
  $scopedSlots: ScopedSlots
  $emit: ExtractEventEmitter<this, EventsDef> &
    ((type: string, ...args: any[]) => this)

  '#props': JSXProps &
    (JSXChildren extends None
      ? {}
      : OptionalIfMatch<undefined, JSXChildren, { '#children': JSXChildren }>)
}

interface JSXComponentOptions<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef,
  States = ExtractStates<StatesDef>,
  Props = ExtractProps<PropsDef>,
  MixedProps = Props &
    ExtractInstanceProps<ExtractMixinsInstance<Mixins>> &
    ExtractInstanceProps<ExtractInstance<Extends>>,
  Injections = ExtractInjections<InjectionsDef>
>
  extends ComponentOptions<
    Vue,
    DataDef<Data, MixedProps & States & Injections, Vue>,
    Methods,
    Computed,
    PropsDef,
    MixedProps
  > {
  [INJECTIONS]?: InjectionsDef
  [STATES]?: StatesDef
  [SCOPED_SLOTS]?: ScopedSlotsDef
  [EVENTS]?: EventsDef
  // due to ComponentOptions['mixins'] is restricted to array, we have to specify mixin inner type.
  mixins?: [Mixins]
  extends?: Extends
}

type JSXRenderContext<
  Props,
  Listeners,
  ScopedSlots,
  Injections
> = RenderContext<Props & Record<string, any>> & {
  readonly listeners: Optional<Listeners>
  readonly scopedSlots: ScopedSlots
  readonly injections: Injections
}

type FunctionalRender<Props, Listeners, ScopedSlots, Injections> = (
  this: undefined,
  context: JSXRenderContext<Props, Listeners, ScopedSlots, Injections>,
) => VNode | VNode[]

type FunctionalComponentDefinition<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  InjectionsDef,
  Props = ExtractProps<PropsDef>,
  Listeners extends NormalizedListenerMap = ExtractListeners<EventsDef>,
  ScopedSlots extends NormalizedScopedSlotMap = ExtractScopedSlots<
    ScopedSlotsDef
  >,
  Injections = ExtractInjections<InjectionsDef>
> = {
  name?: string
  props?: PropsDef
  model?: {
    prop?: string
    event?: string
  }
  inject?: InjectOptions
  [INJECTIONS]?: InjectionsDef
  [SCOPED_SLOTS]?: ScopedSlotsDef
  [EVENTS]?: EventsDef
  render: FunctionalRender<Props, Listeners, ScopedSlots, Injections>
}

type ThisTypedComponentDefinitions<
  PropsDef,
  EventsDef,
  ScopedSlotsDef,
  Data,
  Methods,
  Computed,
  Mixins,
  Extends,
  StatesDef,
  InjectionsDef,
  Props = ExtractProps<PropsDef>,
  Listeners extends NormalizedListenerMap = ExtractListeners<EventsDef>,
  ScopedSlots extends NormalizedScopedSlotMap = ExtractScopedSlots<
    ScopedSlotsDef
  >
> = object &
  JSXComponentOptions<
    PropsDef,
    EventsDef,
    ScopedSlotsDef,
    Data,
    Methods,
    Computed,
    Mixins,
    Extends,
    StatesDef,
    InjectionsDef
  > &
  ThisType<
    MixedJSXVueInstance<
      PropsDef,
      EventsDef,
      ScopedSlotsDef,
      Data,
      Methods,
      Computed,
      Mixins,
      Extends,
      StatesDef,
      InjectionsDef
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

type ExtractStates<T> = T extends Type<infer R>
  ? R
  : UnionToIntersection<
      {
        [K in keyof T]: CheckOneStateMapOptional<
          ExtractOneState<Pick<T, Extract<K, keyof T>>>
        >
      }[keyof T]
    >

/// Type

type Type<T> = { [TYPE_KEY]: T }

declare function type<T>(): Type<T>

/// Props

type InferredOrSelfType<T, I = InferredType<T>> = I extends Unknown<T> ? T : I

interface None {
  [NONE_KEY]: true
}

interface Unknown<T = any> {
  [UNKNOWN_KEY]: true
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
  : T extends void
  ? void
  : T extends Type<infer R>
  ? R
  : T extends { (): infer R }
  ? R
  : T extends { new (...args: any[]): infer R }
  ? R
  : Unknown<T>

type ExtractOnePropDef<T, V = InferredType<T>> = V extends Unknown
  ? T extends { type: FunctionConstructor; default: infer R } // function type
    ? R
    : T extends { default: () => infer R }
    ? R
    : T extends { type: infer R }
    ? InferredOrSelfType<R>
    : T extends PropOptions<infer R>
    ? {} extends R
      ? any
      : R
    : T
  : V

type ExtractOneProp<T> = { [K in keyof T]: ExtractOnePropDef<T[K]> }

type ExtractProps<T> = UnionToIntersection<
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

// Injections

type ExtractOneInjectionDef<T, V = InferredType<T>> = V extends Unknown
  ? T extends { type: FunctionConstructor; default: infer R } // function type
    ? R
    : T extends { default: () => infer R }
    ? R
    : T extends { type: infer R }
    ? InferredOrSelfType<R>
    : T extends { from?: string | symbol; default?: infer R }
    ? {} extends R
      ? any
      : InferredOrSelfType<R>
    : T
  : V

type ExtractOneInjection<T> = { [K in keyof T]: ExtractOneInjectionDef<T[K]> }

type ExtractInjections<T> = UnionToIntersection<
  {
    [K in keyof T]: OptionalIfNotMatch<
      T[K],
      { default: any },
      ExtractOneInjection<Pick<T, Extract<K, keyof T>>>
    >
  }[keyof T]
>

/// Slot

type NormalizedScopedSlotMap = Record<string, NormalizedScopedSlot | undefined>

type ConstructScopedSlot<P> = void extends P
  ? () => ScopedSlotChildren
  : P extends undefined
  ? (props?: P) => ScopedSlotChildren
  : (props: P) => ScopedSlotChildren

type ExtractScopedSlotScopeType<T, V = InferredType<T>> = V extends Unknown
  ? T extends { scope: infer R }
    ? InferredOrSelfType<R>
    : {} extends T
    ? any
    : T
  : V

type ExtractOneScopedSlot<T> = {
  [K in keyof T]: ConstructScopedSlot<ExtractScopedSlotScopeType<T[K]>>
}

type ExtractScopedSlots<T> = UnionToIntersection<
  {
    [K in keyof T]: OptionalIfNotMatch<
      T[K],
      { required: boolean }, // we assume the required exists only if it's true.
      ExtractOneScopedSlot<Pick<T, Extract<K, keyof T>>>
    >
  }[keyof T]
> &
  NormalizedScopedSlotMap

type ExtractJSXChildren<T> = T extends None
  ? None
  : { default: any } extends T // only one child.
  ? ExtractScopedSlots<T>['default'] | ScopedSlotChildren
  : ScopedSlotChildren

/// Utils

type Optional<T> = { [K in keyof T]?: T[K] }

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

type OptionalIfMatch<T, C, R> = T extends C ? Optional<R> : R

type OptionalIfNotMatch<T, C, R> = T extends C ? R : Optional<R>

export { component, functional, type, INJECTIONS, SCOPED_SLOTS, EVENTS, STATES }
