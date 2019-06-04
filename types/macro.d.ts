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
  JSX_COMPONENT,
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
  Extra = JSXComponentMixin<Extends> &
    UnionToIntersection<JSXComponentMixin<Mixins>>
>(
  options: ThisTypedComponentOptions<
    Vue & Extra,
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
  Vue & InstanceType<Extends> & UnionToIntersection<InstanceType<Mixins>>,
  PropsForInstance<Props, PropsRequiredNames>,
  Events,
  SlotArgsForInstance<SlotArgs, SlotArgsRequiredNames>,
  Data & Methods & Computed & State & Injections & Extra
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
  [JSX_COMPONENT]: MixinAttributes
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
