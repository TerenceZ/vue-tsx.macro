import {
  type,
  JSXChildren,
  RequiredNames,
  UnionToIntersection,
  EventHandlers,
} from './misc'
import {
  SLOTS,
  EVENTS,
  INJECTIONS,
  STATE,
  JSX_PROPS,
  JSX_CHILDREN,
  JSX_MIXINS,
  JSX_EVENTS,
  JSX_SLOT_ARGS,
} from './constants'
import {
  OneScopedSlotForInstance,
  ThisTypedComponentOptions,
  FunctionalComponentOptions,
  FunctionalRenderer,
  PropsForInstance,
  SlotArgsForInstance,
  ComponentOptionsThisType,
  ScopedSlots,
} from './options'
import Vue, { VueConstructor } from 'vue'
import { NormalizedScopedSlot } from 'vue/types/vnode'

export declare function component<
  Data,
  Methods,
  Computed,
  Props,
  PropsDef,
  State,
  Events,
  SlotArgs,
  SlotArgsDef,
  Injections,
  Extends extends typeof Vue,
  Mixins extends typeof Vue,
  PropsRequiredNames extends keyof Props = RequiredNames<PropsDef> &
    keyof Props,
  SlotArgsRequiredNames extends keyof SlotArgs = RequiredNames<SlotArgs> &
    keyof SlotArgs,
  MixinThisType = JSXComponentMixin<Extends> &
    UnionToIntersection<JSXComponentMixin<Mixins>>,
  MixinInstance = InstanceType<Extends> &
    UnionToIntersection<InstanceType<Mixins>>
>(
  options: ThisTypedComponentOptions<
    Vue & MixinThisType,
    Data,
    Methods,
    Computed,
    Props,
    PropsRequiredNames,
    State,
    Events,
    SlotArgs,
    SlotArgsRequiredNames,
    Injections
  > & {
    extends?: Extends
    mixins?: Mixins[]
    props?: PropsDef
    [SLOTS]?: SlotArgsDef
  },
): JSXComponent<
  Vue & MixinInstance,
  PropsForInstance<Props, PropsRequiredNames> &
    UnionToIntersection<JSXComponentProps<Extends | Mixins>>,
  Events & UnionToIntersection<JSXComponentEvents<Extends | Mixins>>,
  SlotArgsForInstance<SlotArgs, SlotArgsRequiredNames> &
    UnionToIntersection<JSXComponentSlotArgs<Extends | Mixins>>,
  Data & Methods & Computed & State & Injections & MixinThisType
>

export function functional<Props = Record<string, any>>(
  renderer: FunctionalRenderer<
    Props,
    Record<string, Function | Function[]>,
    Record<string, NormalizedScopedSlot>,
    Record<string, any>
  >,
): JSXComponent<Vue, Props, {}, {}>

export function functional<
  Props,
  PropsDef,
  Events,
  SlotArgs,
  SlotArgsDef,
  Injections
>(
  options: FunctionalComponentOptions<
    Props,
    RequiredNames<PropsDef> & keyof Props,
    Events,
    SlotArgs,
    RequiredNames<SlotArgsDef> & keyof SlotArgs,
    Injections
  > & { props?: PropsDef; [SLOTS]?: SlotArgsDef },
): JSXComponent<Vue, Props, Events, SlotArgs>

export type JSXComponentInstance<V extends Vue, Props, Events, SlotArgs> = V & {
  [JSX_PROPS]: Props &
    JSXComponentChildren<SlotArgs> &
    EventHandlers<Events> & {
      scopedSlots?: JSXScopedSlotsOptions<SlotArgs>
    }
}

export type JSXComponent<
  V extends Vue,
  Props,
  Events,
  SlotArgs,
  MixinAttributes = {}
> = VueConstructor<JSXComponentInstance<V, Props, Events, SlotArgs>> & {
  [JSX_PROPS]: Props
  [JSX_EVENTS]: Events
  [JSX_SLOT_ARGS]: SlotArgs
  [JSX_MIXINS]: MixinAttributes
}

export type JSXComponentChildren<Args> = unknown extends Args // TS >= 3.5
  ? {}
  : {} extends Args // TS < 3.5
  ? {}
  : {
      [JSX_CHILDREN]?: { default: any } extends Args
        ?
            | OneScopedSlotForInstance<
                Args extends { default: infer A } ? A : never,
                JSXChildren
              >
            | JSXChildren
        : JSXChildren
    }

export type JSXScopedSlotsOptions<Args> = {
  [K in keyof Args]: OneScopedSlotForInstance<Args[K], JSXChildren>
}

export type JSXComponentMixin<
  Component extends typeof Vue
> = Component extends JSXComponent<
  infer V,
  infer Props,
  infer Events,
  infer SlotArgs,
  infer Attributes
>
  ? ComponentOptionsThisType<
      V & { $scopedSlots: ScopedSlots<SlotArgs> },
      Attributes,
      Props,
      Events
    >
  : InstanceType<Component>

export type JSXComponentProps<C> = C extends JSXComponent<
  any,
  infer P,
  any,
  any
>
  ? P
  : {}

export type JSXComponentEvents<C> = C extends JSXComponent<
  any,
  any,
  infer E,
  any
>
  ? E
  : {}

export type JSXComponentSlotArgs<C> = C extends JSXComponent<
  any,
  any,
  any,
  infer S
>
  ? S
  : {}
