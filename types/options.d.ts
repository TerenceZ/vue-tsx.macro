import Vue from 'vue'
import {
  ComponentOptions as VueComponentOptions,
  DataDef,
  PropType,
  RenderContext,
} from 'vue/types/options'
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { STATE, SLOTS, INJECTIONS, EVENTS, TYPE } from './constants'
import { Type, UnionToIntersection, EventHandlers, JSXChildren } from './misc'

// Extend Vue's component options to accept more options.
export interface ComponentOptions<
  V extends Vue,
  Data,
  Methods,
  Computed,
  PropsDef,
  Props,
  StateDef,
  EventsDef,
  SlotArgsDef,
  InjectionsDef
> extends VueComponentOptions<V, Data, Methods, Computed, PropsDef, Props> {
  [STATE]?: StateDef
  [EVENTS]?: EventsDef
  [SLOTS]?: SlotArgsDef
  [INJECTIONS]?: InjectionsDef
}

export type ComponentOptionsThisType<
  V extends Vue,
  Attributes,
  Props,
  Events
> = Attributes & Readonly<Props> & V

export type ThisTypedInnerComponentOptions<
  V extends Vue,
  Data,
  Methods,
  Computed,
  Props,
  PropsForInstance,
  State,
  Events,
  SlotArgs,
  Injections
> = object &
  ComponentOptions<
    V,
    DataDef<Data, PropsForInstance, V>,
    Methods,
    Computed,
    PropsDefinition<Props>,
    Props,
    StateDefinition<State>,
    EventsDefinition<Events>,
    SlotArgsDefinition<SlotArgs>,
    InjectionsDefinition<Injections>
  > &
  ThisType<
    ComponentOptionsThisType<
      V,
      Data & Methods & Computed,
      PropsForInstance,
      Events
    >
  >

export type ThisTypedComponentOptions<
  V extends Vue,
  Data,
  Methods,
  Computed,
  Props,
  PropsRequiredNames extends keyof Props,
  State,
  Events,
  SlotArgs,
  SlotArgsRequiredNames extends keyof SlotArgs,
  Injections
> = ThisTypedInnerComponentOptions<
  State &
    Injections & {
      $scopedSlots: ScopedSlots<SlotArgs>
    } & V,
  Data,
  Methods,
  Computed,
  Props,
  PropsForInstance<Props, PropsRequiredNames>,
  State,
  Events,
  SlotArgs,
  Injections
>

export interface FunctionalComponentOptions<
  Props,
  PropsRequiredNames extends keyof Props,
  Events,
  SlotArgs,
  SlotArgsRequiredNames extends keyof SlotArgs,
  Injections
> {
  name?: string
  props?: PropsDefinition<Props>
  model?: {
    prop?: string
    event?: string
  }
  [INJECTIONS]?: InjectionsDefinition<Injections>
  [SLOTS]?: SlotArgsDefinition<SlotArgs>
  [EVENTS]?: EventsDefinition<Events>
  render: FunctionalRenderer<
    PropsForInstance<Props, PropsRequiredNames>,
    EventHandlers<Events>,
    ScopedSlots<SlotArgsForInstance<SlotArgs, SlotArgsRequiredNames>>,
    Injections
  >
}

export type FunctionalRenderContext<
  Props,
  Listeners,
  Slots,
  Injections
> = RenderContext<Props & Record<string, any>> & {
  readonly listeners: Listeners
  readonly scopedSlots: Slots
  readonly injections: Injections
}

export type FunctionalRenderer<Props, Listeners, Slots, Injections> = (
  context: FunctionalRenderContext<Props, Listeners, Slots, Injections>,
) => JSXChildren

// Type

export type ValueType<T> = Type<T> | PropType<T>

// State definition
export type StateDefinition<State> =
  | Type<State>
  | { [K in keyof State]: ValueType<State[K]> }

// Props definition
export type PropsDefinition<Props> = {
  [K in keyof Props]: PropValidator<Props[K]>
}

export type PropValidator<T> = PropOptions<T> | ValueType<T>

export type PropOptions<T> = {
  type?: ValueType<T>
  required?: boolean
  default?: T | null | undefined | (() => T | null | undefined)
  validator?(value: T): boolean
}

export type PropsForInstance<Props, RequiredNames extends keyof Props> = {
  [K in RequiredNames]: Props[K]
} &
  { [K in Exclude<keyof Props, RequiredNames>]?: Props[K] }

// Events definition
export type EventsDefinition<Events> =
  | Type<Events>
  | { [K in keyof Events]: ValueType<Events[K]> }

// Slot args definition
export type SlotArgsDefinition<Args> =
  | Type<Args>
  | { [K in keyof Args]: OneSlotArgDefinition<Args[K]> }

export type OneSlotArgDefinition<T> = ValueType<T> | SlotArgOptions<T>

export type SlotArgOptions<T> = {
  type?: ValueType<T>
  required?: boolean
}

// Injections definition
export type InjectionsDefinition<Injections> =
  // It's not easy to transform Type<Injections> to inject: Object.
  // | Type<Injections>
  { [K in keyof Injections]: OneInjectionDefinition<Injections[K]> }

export type OneInjectionDefinition<T> = ValueType<T> | InjectionOptions<T>

export type InjectionOptions<T> = {
  type?: ValueType<T>
  from?: string | symbol
  default?: T | null | undefined | (() => T | null | undefined)
}

// Scoped slots

export type NormalizedScopedSlotReturnType = ReturnType<NormalizedScopedSlot>

export type SlotArgsForInstance<
  Args,
  RequiredNames extends keyof Args
> = never extends RequiredNames
  ? { [K in keyof Args]: Args[K] }
  : { [K in RequiredNames]: Args[K] } &
      { [K in Exclude<keyof Args, RequiredNames>]?: Args[K] }

export type ScopedSlots<Args> = {
  [K in keyof Args]: OneScopedSlotForInstance<
    Args[K],
    NormalizedScopedSlotReturnType
  >
}

export type OneScopedSlotForInstance<Arg, Return> = unknown extends Arg // TS >= 3.5.0
  ? () => Return
  : {} extends Arg // TS < 3.5.0
  ? () => Return
  : (scope: Arg) => Return
