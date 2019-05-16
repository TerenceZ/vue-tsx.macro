// based on @types/react

import * as CSS from 'csstype'
import Vue, { VNode } from 'vue'
import { ScopedSlotReturnValue } from 'vue/types/vnode'
import { JSX_PROPS_KEY, JSX_CHILDREN_KEY } from './constant'

declare module 'vue/types/vue' {
  interface Vue {
    [JSX_PROPS_KEY]: Record<string, any>
  }
}

declare global {
  // see https://github.com/Microsoft/TypeScript/issues/29966
  interface SVGFEDropShadowElement extends SVGElement {}

  namespace VueJSX {
    //
    // Vue Attributes
    //

    interface Attributes {
      key?: string | number
      ref?: string
      slot?: string
      refInFor?: boolean
      is?: string
      nativeOn?: {
        [K in keyof NativeEventHandlerMap]:
          | NativeEventHandlerMap[K]
          | NativeEventHandlerMap[K][]
      }
    }

    type ReplaceWithScopedSlotReturnValue<T> = T extends (
      ...args: infer A
    ) => any
      ? (...args: A) => ScopedSlotReturnValue
      : T

    type TransformToScopedSlotMap<T> = {
      [K in keyof T]: ReplaceWithScopedSlotReturnValue<T[K]>
    }

    interface ClassAttributes<T> extends Attributes {
      class?: ClassNames
      staticClass?: string
      style?: CSSProperties

      // data
      on?: T extends { $listeners: infer L } ? L : {}
      scopedSlots?: T extends { $scopedSlots: infer S }
        ? TransformToScopedSlotMap<S>
        : {}
      attrs?: Record<string, string | number | boolean>
      props?: T extends { [JSX_PROPS_KEY]: infer P } ? P : {}
      domProps?: Record<string, string | number | boolean>
      hook?: Record<string, Function>
    }

    interface BuiltinAttributes extends Attributes {
      class?: ClassNames
      staticClass?: string
      style?: CSSProperties
      attrs?: Record<string, string | number | boolean>
      domProps?: Record<string, string | number | boolean>
      hook?: Record<string, Function>
    }

    //
    // Builtin Attributes
    // ----------------------------------------------------------------------

    interface KeepAliveProps {
      include?: string | RegExp | string[]
      exclude?: string | RegExp | string[]
      max?: string | number
    }

    interface KeepAliveAttributes extends BuiltinAttributes, KeepAliveProps {
      [JSX_CHILDREN_KEY]?: VNode | (() => VNode | null | undefined) | undefined
      on?: {}
      props?: KeepAliveAttributes
      scopedSlots?: { default?: (() => VNode | null | undefined) | undefined }
    }

    interface TransitionPropsBase {
      name?: string
      appear?: boolean
      css?: boolean
      type?: 'transition' | 'animation'
      duration?: number | string | { enter?: number; leave?: number }
      enterClass?: string
      leaveClass?: string
      enterToClass?: string
      leaveToClass?: string
      enterActiveClass?: string
      leaveActiveClass?: string
      appearClass?: string
      appearActiveClass?: string
      appearToClass?: string

      onBeforeEnter?: (el: HTMLElement) => void
      onEnter?: (el: HTMLElement, done: () => void) => void
      onAfterEnter?: (el: HTMLElement) => void
      onEnterCancelled?: (el: HTMLElement) => void

      onBeforeLeave?: (el: HTMLElement) => void
      onLeave?: (el: HTMLElement, done: () => void) => void
      onAfterLeave?: (el: HTMLElement) => void
      onLeaveCancelled?: (el: HTMLElement) => void
    }

    interface TransitionHookEvents {
      beforeEnter?: (el: HTMLElement) => void
      enter?: (el: HTMLElement, done: () => void) => void
      afterEnter?: (el: HTMLElement) => void
      enterCancelled?: (el: HTMLElement) => void

      beforeLeave?: (el: HTMLElement) => void
      leave?: (el: HTMLElement, done: () => void) => void
      afterLeave?: (el: HTMLElement) => void
      leaveCancelled?: (el: HTMLElement) => void
    }

    interface TransitionProps extends TransitionPropsBase {
      mode?: 'in-out' | 'out-in'
    }

    interface TransitionGroupProps extends TransitionPropsBase {
      tag?: string
      moveClass?: string
    }

    interface TransitionAttributes extends BuiltinAttributes, TransitionProps {
      [JSX_CHILDREN_KEY]?: VNode | (() => VNode | null | undefined) | undefined
      on?: TransitionHookEvents
      props?: TransitionProps
      scopedSlots?: { default?: (() => VNode | null | undefined) | undefined }
    }

    interface TransitionGroupAttributes
      extends BuiltinAttributes,
        TransitionGroupProps {
      [JSX_CHILDREN_KEY]?: ScopedSlotReturnValue
      on?: TransitionHookEvents
      props?: TransitionGroupProps
      scopedSlots?: Record<string, (() => ScopedSlotReturnValue) | undefined>
    }

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends Event> = {
      bivarianceHack(event: E): void
    }['bivarianceHack']

    type NativeEventHandler = EventHandler<Event>
    type ClipboardEventHandler = EventHandler<ClipboardEvent>
    type CompositionEventHandler = EventHandler<CompositionEvent>
    type DragEventHandler = EventHandler<DragEvent>
    type FocusEventHandler = EventHandler<FocusEvent>
    type FormEventHandler = EventHandler<Event>
    type ChangeEventHandler = EventHandler<Event>
    type KeyboardEventHandler = EventHandler<KeyboardEvent>
    type MouseEventHandler = EventHandler<MouseEvent>
    type TouchEventHandler = EventHandler<TouchEvent>
    type PointerEventHandler = EventHandler<PointerEvent>
    type UIEventHandler = EventHandler<UIEvent>
    type WheelEventHandler = EventHandler<WheelEvent>
    type AnimationEventHandler = EventHandler<AnimationEvent>
    type TransitionEventHandler = EventHandler<TransitionEvent>

    //
    // Props / DOM Attributes
    // ----------------------------------------------------------------------

    interface CSSProperties extends CSS.Properties<string | number> {
      /**
       * The index signature was removed to enable closed typing for style
       * using CSSType. You're able to use type assertion or module augmentation
       * to add properties or an index signature of your own.
       *
       * For examples and more information, visit:
       * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
       */
    }

    type ClassNames =
      | string
      | { [key: string]: boolean }
      | (string | { [key: string]: boolean })[]

    interface NativeEventHandlerMap {
      // Clipboard Events
      copy?: ClipboardEventHandler
      copyCapture?: ClipboardEventHandler
      cut?: ClipboardEventHandler
      cutCapture?: ClipboardEventHandler
      paste?: ClipboardEventHandler
      pasteCapture?: ClipboardEventHandler

      // Composition Events
      compositionEnd?: CompositionEventHandler
      compositionEndCapture?: CompositionEventHandler
      compositionStart?: CompositionEventHandler
      compositionStartCapture?: CompositionEventHandler
      compositionUpdate?: CompositionEventHandler
      compositionUpdateCapture?: CompositionEventHandler

      // Focus Events
      focus?: FocusEventHandler
      focusCapture?: FocusEventHandler
      blur?: FocusEventHandler
      blurCapture?: FocusEventHandler

      // Form Events
      change?: FormEventHandler
      changeCapture?: FormEventHandler
      beforeInput?: FormEventHandler
      beforeInputCapture?: FormEventHandler
      input?: FormEventHandler
      inputCapture?: FormEventHandler
      reset?: FormEventHandler
      resetCapture?: FormEventHandler
      submit?: FormEventHandler
      submitCapture?: FormEventHandler
      invalid?: FormEventHandler
      invalidCapture?: FormEventHandler

      // Image Events
      load?: NativeEventHandler
      loadCapture?: NativeEventHandler
      error?: NativeEventHandler // also a Media Event
      errorCapture?: NativeEventHandler // also a Media Event

      // Keyboard Events
      keyDown?: KeyboardEventHandler
      keyDownCapture?: KeyboardEventHandler
      keyPress?: KeyboardEventHandler
      keyPressCapture?: KeyboardEventHandler
      keyUp?: KeyboardEventHandler
      keyUpCapture?: KeyboardEventHandler

      // Media Events
      abort?: NativeEventHandler
      abortCapture?: NativeEventHandler
      canPlay?: NativeEventHandler
      canPlayCapture?: NativeEventHandler
      canPlayThrough?: NativeEventHandler
      canPlayThroughCapture?: NativeEventHandler
      durationChange?: NativeEventHandler
      durationChangeCapture?: NativeEventHandler
      emptied?: NativeEventHandler
      emptiedCapture?: NativeEventHandler
      encrypted?: NativeEventHandler
      encryptedCapture?: NativeEventHandler
      ended?: NativeEventHandler
      endedCapture?: NativeEventHandler
      loadedData?: NativeEventHandler
      loadedDataCapture?: NativeEventHandler
      loadedMetadata?: NativeEventHandler
      loadedMetadataCapture?: NativeEventHandler
      loadStart?: NativeEventHandler
      loadStartCapture?: NativeEventHandler
      pause?: NativeEventHandler
      pauseCapture?: NativeEventHandler
      play?: NativeEventHandler
      playCapture?: NativeEventHandler
      playing?: NativeEventHandler
      playingCapture?: NativeEventHandler
      progress?: NativeEventHandler
      progressCapture?: NativeEventHandler
      rateChange?: NativeEventHandler
      rateChangeCapture?: NativeEventHandler
      seeked?: NativeEventHandler
      seekedCapture?: NativeEventHandler
      seeking?: NativeEventHandler
      seekingCapture?: NativeEventHandler
      stalled?: NativeEventHandler
      stalledCapture?: NativeEventHandler
      suspend?: NativeEventHandler
      suspendCapture?: NativeEventHandler
      timeUpdate?: NativeEventHandler
      timeUpdateCapture?: NativeEventHandler
      volumeChange?: NativeEventHandler
      volumeChangeCapture?: NativeEventHandler
      waiting?: NativeEventHandler
      waitingCapture?: NativeEventHandler

      // MouseEvents
      auxClick?: MouseEventHandler
      auxClickCapture?: MouseEventHandler
      click?: MouseEventHandler
      clickCapture?: MouseEventHandler
      contextMenu?: MouseEventHandler
      contextMenuCapture?: MouseEventHandler
      doubleClick?: MouseEventHandler
      doubleClickCapture?: MouseEventHandler
      drag?: DragEventHandler
      dragCapture?: DragEventHandler
      dragEnd?: DragEventHandler
      dragEndCapture?: DragEventHandler
      dragEnter?: DragEventHandler
      dragEnterCapture?: DragEventHandler
      dragExit?: DragEventHandler
      dragExitCapture?: DragEventHandler
      dragLeave?: DragEventHandler
      dragLeaveCapture?: DragEventHandler
      dragOver?: DragEventHandler
      dragOverCapture?: DragEventHandler
      dragStart?: DragEventHandler
      dragStartCapture?: DragEventHandler
      drop?: DragEventHandler
      dropCapture?: DragEventHandler
      mouseDown?: MouseEventHandler
      mouseDownCapture?: MouseEventHandler
      mouseEnter?: MouseEventHandler
      mouseLeave?: MouseEventHandler
      mouseMove?: MouseEventHandler
      mouseMoveCapture?: MouseEventHandler
      mouseOut?: MouseEventHandler
      mouseOutCapture?: MouseEventHandler
      mouseOver?: MouseEventHandler
      mouseOverCapture?: MouseEventHandler
      mouseUp?: MouseEventHandler
      mouseUpCapture?: MouseEventHandler

      // Selection Events
      select?: NativeEventHandler
      selectCapture?: NativeEventHandler

      // Touch Events
      touchCancel?: TouchEventHandler
      touchCancelCapture?: TouchEventHandler
      touchEnd?: TouchEventHandler
      touchEndCapture?: TouchEventHandler
      touchMove?: TouchEventHandler
      touchMoveCapture?: TouchEventHandler
      touchStart?: TouchEventHandler
      touchStartCapture?: TouchEventHandler

      // Pointer Events
      pointerDown?: PointerEventHandler
      pointerDownCapture?: PointerEventHandler
      pointerMove?: PointerEventHandler
      pointerMoveCapture?: PointerEventHandler
      pointerUp?: PointerEventHandler
      pointerUpCapture?: PointerEventHandler
      pointerCancel?: PointerEventHandler
      pointerCancelCapture?: PointerEventHandler
      pointerEnter?: PointerEventHandler
      pointerEnterCapture?: PointerEventHandler
      pointerLeave?: PointerEventHandler
      pointerLeaveCapture?: PointerEventHandler
      pointerOver?: PointerEventHandler
      pointerOverCapture?: PointerEventHandler
      pointerOut?: PointerEventHandler
      pointerOutCapture?: PointerEventHandler
      gotPointerCapture?: PointerEventHandler
      gotPointerCaptureCapture?: PointerEventHandler
      lostPointerCapture?: PointerEventHandler
      lostPointerCaptureCapture?: PointerEventHandler

      // UI Events
      scroll?: UIEventHandler
      scrollCapture?: UIEventHandler

      // Wheel Events
      wheel?: WheelEventHandler
      wheelCapture?: WheelEventHandler

      // Animation Events
      animationStart?: AnimationEventHandler
      animationStartCapture?: AnimationEventHandler
      animationEnd?: AnimationEventHandler
      animationEndCapture?: AnimationEventHandler
      animationIteration?: AnimationEventHandler
      animationIterationCapture?: AnimationEventHandler

      // Transition Events
      transitionEnd?: TransitionEventHandler
      transitionEndCapture?: TransitionEventHandler
    }

    interface DOMAttributes {
      [JSX_CHILDREN_KEY]?: ScopedSlotReturnValue
      on?: {
        [K in keyof NativeEventHandlerMap]:
          | NativeEventHandlerMap[K]
          | NativeEventHandlerMap[K][]
      }

      // Clipboard Events
      onCopy?: ClipboardEventHandler
      onCopyCapture?: ClipboardEventHandler
      onCut?: ClipboardEventHandler
      onCutCapture?: ClipboardEventHandler
      onPaste?: ClipboardEventHandler
      onPasteCapture?: ClipboardEventHandler

      // Composition Events
      onCompositionEnd?: CompositionEventHandler
      onCompositionEndCapture?: CompositionEventHandler
      onCompositionStart?: CompositionEventHandler
      onCompositionStartCapture?: CompositionEventHandler
      onCompositionUpdate?: CompositionEventHandler
      onCompositionUpdateCapture?: CompositionEventHandler

      // Focus Events
      onFocus?: FocusEventHandler
      onFocusCapture?: FocusEventHandler
      onBlur?: FocusEventHandler
      onBlurCapture?: FocusEventHandler

      // Form Events
      onChange?: FormEventHandler
      onChangeCapture?: FormEventHandler
      onBeforeInput?: FormEventHandler
      onBeforeInputCapture?: FormEventHandler
      onInput?: FormEventHandler
      onInputCapture?: FormEventHandler
      onReset?: FormEventHandler
      onResetCapture?: FormEventHandler
      onSubmit?: FormEventHandler
      onSubmitCapture?: FormEventHandler
      onInvalid?: FormEventHandler
      onInvalidCapture?: FormEventHandler

      // Image Events
      onLoad?: NativeEventHandler
      onLoadCapture?: NativeEventHandler
      onError?: NativeEventHandler // also a Media Event
      onErrorCapture?: NativeEventHandler // also a Media Event

      // Keyboard Events
      onKeyDown?: KeyboardEventHandler
      onKeyDownCapture?: KeyboardEventHandler
      onKeyPress?: KeyboardEventHandler
      onKeyPressCapture?: KeyboardEventHandler
      onKeyUp?: KeyboardEventHandler
      onKeyUpCapture?: KeyboardEventHandler

      // Media Events
      onAbort?: NativeEventHandler
      onAbortCapture?: NativeEventHandler
      onCanPlay?: NativeEventHandler
      onCanPlayCapture?: NativeEventHandler
      onCanPlayThrough?: NativeEventHandler
      onCanPlayThroughCapture?: NativeEventHandler
      onDurationChange?: NativeEventHandler
      onDurationChangeCapture?: NativeEventHandler
      onEmptied?: NativeEventHandler
      onEmptiedCapture?: NativeEventHandler
      onEncrypted?: NativeEventHandler
      onEncryptedCapture?: NativeEventHandler
      onEnded?: NativeEventHandler
      onEndedCapture?: NativeEventHandler
      onLoadedData?: NativeEventHandler
      onLoadedDataCapture?: NativeEventHandler
      onLoadedMetadata?: NativeEventHandler
      onLoadedMetadataCapture?: NativeEventHandler
      onLoadStart?: NativeEventHandler
      onLoadStartCapture?: NativeEventHandler
      onPause?: NativeEventHandler
      onPauseCapture?: NativeEventHandler
      onPlay?: NativeEventHandler
      onPlayCapture?: NativeEventHandler
      onPlaying?: NativeEventHandler
      onPlayingCapture?: NativeEventHandler
      onProgress?: NativeEventHandler
      onProgressCapture?: NativeEventHandler
      onRateChange?: NativeEventHandler
      onRateChangeCapture?: NativeEventHandler
      onSeeked?: NativeEventHandler
      onSeekedCapture?: NativeEventHandler
      onSeeking?: NativeEventHandler
      onSeekingCapture?: NativeEventHandler
      onStalled?: NativeEventHandler
      onStalledCapture?: NativeEventHandler
      onSuspend?: NativeEventHandler
      onSuspendCapture?: NativeEventHandler
      onTimeUpdate?: NativeEventHandler
      onTimeUpdateCapture?: NativeEventHandler
      onVolumeChange?: NativeEventHandler
      onVolumeChangeCapture?: NativeEventHandler
      onWaiting?: NativeEventHandler
      onWaitingCapture?: NativeEventHandler

      // MouseEvents
      onAuxClick?: MouseEventHandler
      onAuxClickCapture?: MouseEventHandler
      onClick?: MouseEventHandler
      onClickCapture?: MouseEventHandler
      onContextMenu?: MouseEventHandler
      onContextMenuCapture?: MouseEventHandler
      onDoubleClick?: MouseEventHandler
      onDoubleClickCapture?: MouseEventHandler
      onDrag?: DragEventHandler
      onDragCapture?: DragEventHandler
      onDragEnd?: DragEventHandler
      onDragEndCapture?: DragEventHandler
      onDragEnter?: DragEventHandler
      onDragEnterCapture?: DragEventHandler
      onDragExit?: DragEventHandler
      onDragExitCapture?: DragEventHandler
      onDragLeave?: DragEventHandler
      onDragLeaveCapture?: DragEventHandler
      onDragOver?: DragEventHandler
      onDragOverCapture?: DragEventHandler
      onDragStart?: DragEventHandler
      onDragStartCapture?: DragEventHandler
      onDrop?: DragEventHandler
      onDropCapture?: DragEventHandler
      onMouseDown?: MouseEventHandler
      onMouseDownCapture?: MouseEventHandler
      onMouseEnter?: MouseEventHandler
      onMouseLeave?: MouseEventHandler
      onMouseMove?: MouseEventHandler
      onMouseMoveCapture?: MouseEventHandler
      onMouseOut?: MouseEventHandler
      onMouseOutCapture?: MouseEventHandler
      onMouseOver?: MouseEventHandler
      onMouseOverCapture?: MouseEventHandler
      onMouseUp?: MouseEventHandler
      onMouseUpCapture?: MouseEventHandler

      // Selection Events
      onSelect?: NativeEventHandler
      onSelectCapture?: NativeEventHandler

      // Touch Events
      onTouchCancel?: TouchEventHandler
      onTouchCancelCapture?: TouchEventHandler
      onTouchEnd?: TouchEventHandler
      onTouchEndCapture?: TouchEventHandler
      onTouchMove?: TouchEventHandler
      onTouchMoveCapture?: TouchEventHandler
      onTouchStart?: TouchEventHandler
      onTouchStartCapture?: TouchEventHandler

      // Pointer Events
      onPointerDown?: PointerEventHandler
      onPointerDownCapture?: PointerEventHandler
      onPointerMove?: PointerEventHandler
      onPointerMoveCapture?: PointerEventHandler
      onPointerUp?: PointerEventHandler
      onPointerUpCapture?: PointerEventHandler
      onPointerCancel?: PointerEventHandler
      onPointerCancelCapture?: PointerEventHandler
      onPointerEnter?: PointerEventHandler
      onPointerEnterCapture?: PointerEventHandler
      onPointerLeave?: PointerEventHandler
      onPointerLeaveCapture?: PointerEventHandler
      onPointerOver?: PointerEventHandler
      onPointerOverCapture?: PointerEventHandler
      onPointerOut?: PointerEventHandler
      onPointerOutCapture?: PointerEventHandler
      onGotPointerCapture?: PointerEventHandler
      onGotPointerCaptureCapture?: PointerEventHandler
      onLostPointerCapture?: PointerEventHandler
      onLostPointerCaptureCapture?: PointerEventHandler

      // UI Events
      onScroll?: UIEventHandler
      onScrollCapture?: UIEventHandler

      // Wheel Events
      onWheel?: WheelEventHandler
      onWheelCapture?: WheelEventHandler

      // Animation Events
      onAnimationStart?: AnimationEventHandler
      onAnimationStartCapture?: AnimationEventHandler
      onAnimationEnd?: AnimationEventHandler
      onAnimationEndCapture?: AnimationEventHandler
      onAnimationIteration?: AnimationEventHandler
      onAnimationIterationCapture?: AnimationEventHandler

      // Transition Events
      onTransitionEnd?: TransitionEventHandler
      onTransitionEndCapture?: TransitionEventHandler
    }

    interface ARIAAttributes {
      // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/

      /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
      'aria-activedescendant'?: string
      /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
      'aria-atomic'?: boolean | 'false' | 'true'
      /**
       * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
       * presented if they are made.
       */
      'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
      /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
      'aria-busy'?: boolean | 'false' | 'true'
      /**
       * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
       * @see aria-pressed @see aria-selected.
       */
      'aria-checked'?: boolean | 'false' | 'mixed' | 'true'
      /**
       * Defines the total number of columns in a table, grid, or treegrid.
       * @see aria-colindex.
       */
      'aria-colcount'?: number
      /**
       * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
       * @see aria-colcount @see aria-colspan.
       */
      'aria-colindex'?: number
      /**
       * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
       * @see aria-colindex @see aria-rowspan.
       */
      'aria-colspan'?: number
      /**
       * Identifies the element (or elements) whose contents or presence are controlled by the current element.
       * @see aria-owns.
       */
      'aria-controls'?: string
      /** Indicates the element that represents the current item within a container or set of related elements. */
      'aria-current'?:
        | boolean
        | 'false'
        | 'true'
        | 'page'
        | 'step'
        | 'location'
        | 'date'
        | 'time'
      /**
       * Identifies the element (or elements) that describes the object.
       * @see aria-labelledby
       */
      'aria-describedby'?: string
      /**
       * Identifies the element that provides a detailed, extended description for the object.
       * @see aria-describedby.
       */
      'aria-details'?: string
      /**
       * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
       * @see aria-hidden @see aria-readonly.
       */
      'aria-disabled'?: boolean | 'false' | 'true'
      /**
       * Indicates what functions can be performed when a dragged object is released on the drop target.
       * @deprecated in ARIA 1.1
       */
      'aria-dropeffect'?:
        | 'none'
        | 'copy'
        | 'execute'
        | 'link'
        | 'move'
        | 'popup'
      /**
       * Identifies the element that provides an error message for the object.
       * @see aria-invalid @see aria-describedby.
       */
      'aria-errormessage'?: string
      /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
      'aria-expanded'?: boolean | 'false' | 'true'
      /**
       * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
       * allows assistive technology to override the general default of reading in document source order.
       */
      'aria-flowto'?: string
      /**
       * Indicates an element's "grabbed" state in a drag-and-drop operation.
       * @deprecated in ARIA 1.1
       */
      'aria-grabbed'?: boolean | 'false' | 'true'
      /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
      'aria-haspopup'?:
        | boolean
        | 'false'
        | 'true'
        | 'menu'
        | 'listbox'
        | 'tree'
        | 'grid'
        | 'dialog'
      /**
       * Indicates whether the element is exposed to an accessibility API.
       * @see aria-disabled.
       */
      'aria-hidden'?: boolean | 'false' | 'true'
      /**
       * Indicates the entered value does not conform to the format expected by the application.
       * @see aria-errormessage.
       */
      'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
      /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
      'aria-keyshortcuts'?: string
      /**
       * Defines a string value that labels the current element.
       * @see aria-labelledby.
       */
      'aria-label'?: string
      /**
       * Identifies the element (or elements) that labels the current element.
       * @see aria-describedby.
       */
      'aria-labelledby'?: string
      /** Defines the hierarchical level of an element within a structure. */
      'aria-level'?: number
      /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
      'aria-live'?: 'off' | 'assertive' | 'polite'
      /** Indicates whether an element is modal when displayed. */
      'aria-modal'?: boolean | 'false' | 'true'
      /** Indicates whether a text box accepts multiple lines of input or only a single line. */
      'aria-multiline'?: boolean | 'false' | 'true'
      /** Indicates that the user may select more than one item from the current selectable descendants. */
      'aria-multiselectable'?: boolean | 'false' | 'true'
      /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
      'aria-orientation'?: 'horizontal' | 'vertical'
      /**
       * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
       * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
       * @see aria-controls.
       */
      'aria-owns'?: string
      /**
       * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
       * A hint could be a sample value or a brief description of the expected format.
       */
      'aria-placeholder'?: string
      /**
       * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
       * @see aria-setsize.
       */
      'aria-posinset'?: number
      /**
       * Indicates the current "pressed" state of toggle buttons.
       * @see aria-checked @see aria-selected.
       */
      'aria-pressed'?: boolean | 'false' | 'mixed' | 'true'
      /**
       * Indicates that the element is not editable, but is otherwise operable.
       * @see aria-disabled.
       */
      'aria-readonly'?: boolean | 'false' | 'true'
      /**
       * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
       * @see aria-atomic.
       */
      'aria-relevant'?:
        | 'additions'
        | 'additions text'
        | 'all'
        | 'removals'
        | 'text'
      /** Indicates that user input is required on the element before a form may be submitted. */
      'aria-required'?: boolean | 'false' | 'true'
      /** Defines a human-readable, author-localized description for the role of an element. */
      'aria-roledescription'?: string
      /**
       * Defines the total number of rows in a table, grid, or treegrid.
       * @see aria-rowindex.
       */
      'aria-rowcount'?: number
      /**
       * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
       * @see aria-rowcount @see aria-rowspan.
       */
      'aria-rowindex'?: number
      /**
       * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
       * @see aria-rowindex @see aria-colspan.
       */
      'aria-rowspan'?: number
      /**
       * Indicates the current "selected" state of various widgets.
       * @see aria-checked @see aria-pressed.
       */
      'aria-selected'?: boolean | 'false' | 'true'
      /**
       * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
       * @see aria-posinset.
       */
      'aria-setsize'?: number
      /** Indicates if items in a table or grid are sorted in ascending or descending order. */
      'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
      /** Defines the maximum allowed value for a range widget. */
      'aria-valuemax'?: number
      /** Defines the minimum allowed value for a range widget. */
      'aria-valuemin'?: number
      /**
       * Defines the current value for a range widget.
       * @see aria-valuetext.
       */
      'aria-valuenow'?: number
      /** Defines the human readable text alternative of aria-valuenow for a range widget. */
      'aria-valuetext'?: string
    }

    interface HTMLAttributes extends DOMAttributes, ARIAAttributes {
      // Standard HTML Attributes
      accessKey?: string
      class?: ClassNames
      staticClass?: string
      contentEditable?: boolean
      contextMenu?: string
      dir?: string
      draggable?: boolean
      hidden?: boolean
      id?: string
      lang?: string
      placeholder?: string
      slot?: string
      spellCheck?: boolean
      style?: CSSProperties
      tabIndex?: number
      title?: string

      // Unknown
      inputMode?: string
      is?: string
      radioGroup?: string // <command>, <menuitem>

      // WAI-ARIA
      role?: string

      // RDFa Attributes
      about?: string
      datatype?: string
      inlist?: any
      prefix?: string
      property?: string
      resource?: string
      typeof?: string
      vocab?: string

      // Non-standard Attributes
      autoCapitalize?: string
      autoCorrect?: string
      autoSave?: string
      color?: string
      itemProp?: string
      itemScope?: boolean
      itemType?: string
      itemID?: string
      itemRef?: string
      results?: number
      security?: string
      unselectable?: 'on' | 'off'
    }

    interface AllHTMLAttributes extends HTMLAttributes {
      // Standard HTML Attributes
      accept?: string
      acceptCharset?: string
      action?: string
      allowFullScreen?: boolean
      allowTransparency?: boolean
      alt?: string
      as?: string
      async?: boolean
      autoComplete?: string
      autoFocus?: boolean
      autoPlay?: boolean
      capture?: boolean | string
      cellPadding?: number | string
      cellSpacing?: number | string
      charSet?: string
      challenge?: string
      checked?: boolean
      cite?: string
      classID?: string
      cols?: number
      colSpan?: number
      content?: string
      controls?: boolean
      coords?: string
      crossOrigin?: string
      data?: string
      dateTime?: string
      default?: boolean
      defer?: boolean
      disabled?: boolean
      download?: any
      encType?: string
      form?: string
      formAction?: string
      formEncType?: string
      formMethod?: string
      formNoValidate?: boolean
      formTarget?: string
      frameBorder?: number | string
      headers?: string
      height?: number | string
      high?: number
      href?: string
      hrefLang?: string
      for?: string
      httpEquiv?: string
      integrity?: string
      keyParams?: string
      keyType?: string
      kind?: string
      label?: string
      list?: string
      loop?: boolean
      low?: number
      manifest?: string
      marginHeight?: number
      marginWidth?: number
      max?: number | string
      maxLength?: number
      media?: string
      mediaGroup?: string
      method?: string
      min?: number | string
      minLength?: number
      multiple?: boolean
      muted?: boolean
      name?: string
      nonce?: string
      noValidate?: boolean
      open?: boolean
      optimum?: number
      pattern?: string
      placeholder?: string
      playsInline?: boolean
      poster?: string
      preload?: string
      readOnly?: boolean
      rel?: string
      required?: boolean
      reversed?: boolean
      rows?: number
      rowSpan?: number
      sandbox?: string
      scope?: string
      scoped?: boolean
      scrolling?: string
      seamless?: boolean
      selected?: boolean
      shape?: string
      size?: number
      sizes?: string
      span?: number
      src?: string
      srcDoc?: string
      srcLang?: string
      srcSet?: string
      start?: number
      step?: number | string
      summary?: string
      target?: string
      type?: string
      useMap?: string
      value?: string | string[] | number
      width?: number | string
      wmode?: string
      wrap?: string
    }

    // this list is "complete" in that it contains every SVG attribute
    // that React supports, but the types can be improved.
    // Full list here: https://facebook.github.io/react/docs/dom-elements.html
    //
    // The three broad type categories are (in order of restrictiveness):
    //   - "number | string"
    //   - "string"
    //   - union of string literals
    interface SVGAttributes extends DOMAttributes {
      // Attributes which also defined in HTMLAttributes
      // See comment in SVGDOMPropertyConfig.js
      class?: ClassNames
      staticClass?: string
      color?: string
      height?: number | string
      id?: string
      lang?: string
      max?: number | string
      media?: string
      method?: string
      min?: number | string
      name?: string
      style?: CSSProperties
      target?: string
      type?: string
      width?: number | string

      // Other HTML properties supported by SVG elements in browsers
      role?: string
      tabIndex?: number

      // SVG Specific attributes
      accentHeight?: number | string
      accumulate?: 'none' | 'sum'
      additive?: 'replace' | 'sum'
      alignmentBaseline?:
        | 'auto'
        | 'baseline'
        | 'before-edge'
        | 'text-before-edge'
        | 'middle'
        | 'central'
        | 'after-edge'
        | 'text-after-edge'
        | 'ideographic'
        | 'alphabetic'
        | 'hanging'
        | 'mathematical'
        | 'inherit'
      allowReorder?: 'no' | 'yes'
      alphabetic?: number | string
      amplitude?: number | string
      arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated'
      ascent?: number | string
      attributeName?: string
      attributeType?: string
      autoReverse?: number | string
      azimuth?: number | string
      baseFrequency?: number | string
      baselineShift?: number | string
      baseProfile?: number | string
      bbox?: number | string
      begin?: number | string
      bias?: number | string
      by?: number | string
      calcMode?: number | string
      capHeight?: number | string
      clip?: number | string
      clipPath?: string
      clipPathUnits?: number | string
      clipRule?: number | string
      colorInterpolation?: number | string
      colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit'
      colorProfile?: number | string
      colorRendering?: number | string
      contentScriptType?: number | string
      contentStyleType?: number | string
      cursor?: number | string
      cx?: number | string
      cy?: number | string
      d?: string
      decelerate?: number | string
      descent?: number | string
      diffuseConstant?: number | string
      direction?: number | string
      display?: number | string
      divisor?: number | string
      dominantBaseline?: number | string
      dur?: number | string
      dx?: number | string
      dy?: number | string
      edgeMode?: number | string
      elevation?: number | string
      enableBackground?: number | string
      end?: number | string
      exponent?: number | string
      externalResourcesRequired?: number | string
      fill?: string
      fillOpacity?: number | string
      fillRule?: 'nonzero' | 'evenodd' | 'inherit'
      filter?: string
      filterRes?: number | string
      filterUnits?: number | string
      floodColor?: number | string
      floodOpacity?: number | string
      focusable?: number | string
      fontFamily?: string
      fontSize?: number | string
      fontSizeAdjust?: number | string
      fontStretch?: number | string
      fontStyle?: number | string
      fontVariant?: number | string
      fontWeight?: number | string
      format?: number | string
      from?: number | string
      fx?: number | string
      fy?: number | string
      g1?: number | string
      g2?: number | string
      glyphName?: number | string
      glyphOrientationHorizontal?: number | string
      glyphOrientationVertical?: number | string
      glyphRef?: number | string
      gradientTransform?: string
      gradientUnits?: string
      hanging?: number | string
      horizAdvX?: number | string
      horizOriginX?: number | string
      href?: string
      ideographic?: number | string
      imageRendering?: number | string
      in2?: number | string
      in?: string
      intercept?: number | string
      k1?: number | string
      k2?: number | string
      k3?: number | string
      k4?: number | string
      k?: number | string
      kernelMatrix?: number | string
      kernelUnitLength?: number | string
      kerning?: number | string
      keyPoints?: number | string
      keySplines?: number | string
      keyTimes?: number | string
      lengthAdjust?: number | string
      letterSpacing?: number | string
      lightingColor?: number | string
      limitingConeAngle?: number | string
      local?: number | string
      markerEnd?: string
      markerHeight?: number | string
      markerMid?: string
      markerStart?: string
      markerUnits?: number | string
      markerWidth?: number | string
      mask?: string
      maskContentUnits?: number | string
      maskUnits?: number | string
      mathematical?: number | string
      mode?: number | string
      numOctaves?: number | string
      offset?: number | string
      opacity?: number | string
      operator?: number | string
      order?: number | string
      orient?: number | string
      orientation?: number | string
      origin?: number | string
      overflow?: number | string
      overlinePosition?: number | string
      overlineThickness?: number | string
      paintOrder?: number | string
      panose1?: number | string
      pathLength?: number | string
      patternContentUnits?: string
      patternTransform?: number | string
      patternUnits?: string
      pointerEvents?: number | string
      points?: string
      pointsAtX?: number | string
      pointsAtY?: number | string
      pointsAtZ?: number | string
      preserveAlpha?: number | string
      preserveAspectRatio?: string
      primitiveUnits?: number | string
      r?: number | string
      radius?: number | string
      refX?: number | string
      refY?: number | string
      renderingIntent?: number | string
      repeatCount?: number | string
      repeatDur?: number | string
      requiredExtensions?: number | string
      requiredFeatures?: number | string
      restart?: number | string
      result?: string
      rotate?: number | string
      rx?: number | string
      ry?: number | string
      scale?: number | string
      seed?: number | string
      shapeRendering?: number | string
      slope?: number | string
      spacing?: number | string
      specularConstant?: number | string
      specularExponent?: number | string
      speed?: number | string
      spreadMethod?: string
      startOffset?: number | string
      stdDeviation?: number | string
      stemh?: number | string
      stemv?: number | string
      stitchTiles?: number | string
      stopColor?: string
      stopOpacity?: number | string
      strikethroughPosition?: number | string
      strikethroughThickness?: number | string
      string?: number | string
      stroke?: string
      strokeDasharray?: string | number
      strokeDashoffset?: string | number
      strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit'
      strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit'
      strokeMiterlimit?: number | string
      strokeOpacity?: number | string
      strokeWidth?: number | string
      surfaceScale?: number | string
      systemLanguage?: number | string
      tableValues?: number | string
      targetX?: number | string
      targetY?: number | string
      textAnchor?: string
      textDecoration?: number | string
      textLength?: number | string
      textRendering?: number | string
      to?: number | string
      transform?: string
      u1?: number | string
      u2?: number | string
      underlinePosition?: number | string
      underlineThickness?: number | string
      unicode?: number | string
      unicodeBidi?: number | string
      unicodeRange?: number | string
      unitsPerEm?: number | string
      vAlphabetic?: number | string
      values?: string
      vectorEffect?: number | string
      version?: string
      vertAdvY?: number | string
      vertOriginX?: number | string
      vertOriginY?: number | string
      vHanging?: number | string
      vIdeographic?: number | string
      viewBox?: string
      viewTarget?: number | string
      visibility?: number | string
      vMathematical?: number | string
      widths?: number | string
      wordSpacing?: number | string
      writingMode?: number | string
      x1?: number | string
      x2?: number | string
      x?: number | string
      xChannelSelector?: string
      xHeight?: number | string
      xlinkActuate?: string
      xlinkArcrole?: string
      xlinkHref?: string
      xlinkRole?: string
      xlinkShow?: string
      xlinkTitle?: string
      xlinkType?: string
      xmlBase?: string
      xmlLang?: string
      xmlns?: string
      xmlnsXlink?: string
      xmlSpace?: string
      y1?: number | string
      y2?: number | string
      y?: number | string
      yChannelSelector?: string
      z?: number | string
      zoomAndPan?: string
    }

    type DetailedHTMLProps<E extends HTMLAttributes, T> = Attributes & E

    interface SVGProps<T> extends SVGAttributes, Attributes {}

    interface AnchorHTMLAttributes extends HTMLAttributes {
      download?: any
      href?: string
      hrefLang?: string
      media?: string
      rel?: string
      target?: string
      type?: string
      referrerPolicy?: string
    }

    // tslint:disable-next-line:no-empty-interface
    interface AudioHTMLAttributes extends MediaHTMLAttributes {}

    interface AreaHTMLAttributes extends HTMLAttributes {
      alt?: string
      coords?: string
      download?: any
      href?: string
      hrefLang?: string
      media?: string
      rel?: string
      shape?: string
      target?: string
    }

    interface BaseHTMLAttributes extends HTMLAttributes {
      href?: string
      target?: string
    }

    interface BlockquoteHTMLAttributes extends HTMLAttributes {
      cite?: string
    }

    interface ButtonHTMLAttributes extends HTMLAttributes {
      autoFocus?: boolean
      disabled?: boolean
      form?: string
      formAction?: string
      formEncType?: string
      formMethod?: string
      formNoValidate?: boolean
      formTarget?: string
      name?: string
      type?: 'submit' | 'reset' | 'button'
      value?: string | string[] | number
    }

    interface CanvasHTMLAttributes extends HTMLAttributes {
      height?: number | string
      width?: number | string
    }

    interface ColHTMLAttributes extends HTMLAttributes {
      span?: number
      width?: number | string
    }

    interface ColgroupHTMLAttributes extends HTMLAttributes {
      span?: number
    }

    interface DetailsHTMLAttributes extends HTMLAttributes {
      open?: boolean
    }

    interface DelHTMLAttributes extends HTMLAttributes {
      cite?: string
      dateTime?: string
    }

    interface DialogHTMLAttributes extends HTMLAttributes {
      open?: boolean
    }

    interface EmbedHTMLAttributes extends HTMLAttributes {
      height?: number | string
      src?: string
      type?: string
      width?: number | string
    }

    interface FieldsetHTMLAttributes extends HTMLAttributes {
      disabled?: boolean
      form?: string
      name?: string
    }

    interface FormHTMLAttributes extends HTMLAttributes {
      acceptCharset?: string
      action?: string
      autoComplete?: string
      encType?: string
      method?: string
      name?: string
      noValidate?: boolean
      target?: string
    }

    interface HtmlHTMLAttributes extends HTMLAttributes {
      manifest?: string
    }

    interface IframeHTMLAttributes extends HTMLAttributes {
      allow?: string
      allowFullScreen?: boolean
      allowTransparency?: boolean
      frameBorder?: number | string
      height?: number | string
      marginHeight?: number
      marginWidth?: number
      name?: string
      sandbox?: string
      scrolling?: string
      seamless?: boolean
      src?: string
      srcDoc?: string
      width?: number | string
    }

    interface ImgHTMLAttributes extends HTMLAttributes {
      alt?: string
      crossOrigin?: 'anonymous' | 'use-credentials' | ''
      decoding?: 'async' | 'auto' | 'sync'
      height?: number | string
      sizes?: string
      src?: string
      srcSet?: string
      useMap?: string
      width?: number | string
    }

    interface InsHTMLAttributes extends HTMLAttributes {
      cite?: string
      dateTime?: string
    }

    interface InputHTMLAttributes extends HTMLAttributes {
      accept?: string
      alt?: string
      autoComplete?: string
      autoFocus?: boolean
      capture?: boolean | string // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
      checked?: boolean
      crossOrigin?: string
      disabled?: boolean
      form?: string
      formAction?: string
      formEncType?: string
      formMethod?: string
      formNoValidate?: boolean
      formTarget?: string
      height?: number | string
      list?: string
      max?: number | string
      maxLength?: number
      min?: number | string
      minLength?: number
      multiple?: boolean
      name?: string
      pattern?: string
      placeholder?: string
      readOnly?: boolean
      required?: boolean
      size?: number
      src?: string
      step?: number | string
      type?: string
      value?: string | string[] | number
      width?: number | string

      onChange?: ChangeEventHandler
    }

    interface KeygenHTMLAttributes extends HTMLAttributes {
      autoFocus?: boolean
      challenge?: string
      disabled?: boolean
      form?: string
      keyType?: string
      keyParams?: string
      name?: string
    }

    interface LabelHTMLAttributes extends HTMLAttributes {
      form?: string
      htmlFor?: string
    }

    interface LiHTMLAttributes extends HTMLAttributes {
      value?: string | string[] | number
    }

    interface LinkHTMLAttributes extends HTMLAttributes {
      as?: string
      crossOrigin?: string
      href?: string
      hrefLang?: string
      integrity?: string
      media?: string
      rel?: string
      sizes?: string
      type?: string
    }

    interface MapHTMLAttributes extends HTMLAttributes {
      name?: string
    }

    interface MenuHTMLAttributes extends HTMLAttributes {
      type?: string
    }

    interface MediaHTMLAttributes extends HTMLAttributes {
      autoPlay?: boolean
      controls?: boolean
      controlsList?: string
      crossOrigin?: string
      loop?: boolean
      mediaGroup?: string
      muted?: boolean
      playsinline?: boolean
      preload?: string
      src?: string
    }

    interface MetaHTMLAttributes extends HTMLAttributes {
      charSet?: string
      content?: string
      httpEquiv?: string
      name?: string
    }

    interface MeterHTMLAttributes extends HTMLAttributes {
      form?: string
      high?: number
      low?: number
      max?: number | string
      min?: number | string
      optimum?: number
      value?: string | string[] | number
    }

    interface QuoteHTMLAttributes extends HTMLAttributes {
      cite?: string
    }

    interface ObjectHTMLAttributes extends HTMLAttributes {
      classID?: string
      data?: string
      form?: string
      height?: number | string
      name?: string
      type?: string
      useMap?: string
      width?: number | string
      wmode?: string
    }

    interface OlHTMLAttributes extends HTMLAttributes {
      reversed?: boolean
      start?: number
      type?: '1' | 'a' | 'A' | 'i' | 'I'
    }

    interface OptgroupHTMLAttributes extends HTMLAttributes {
      disabled?: boolean
      label?: string
    }

    interface OptionHTMLAttributes extends HTMLAttributes {
      disabled?: boolean
      label?: string
      selected?: boolean
      value?: string | string[] | number
    }

    interface OutputHTMLAttributes extends HTMLAttributes {
      form?: string
      htmlFor?: string
      name?: string
    }

    interface ParamHTMLAttributes extends HTMLAttributes {
      name?: string
      value?: string | string[] | number
    }

    interface ProgressHTMLAttributes extends HTMLAttributes {
      max?: number | string
      value?: string | string[] | number
    }

    interface ScriptHTMLAttributes extends HTMLAttributes {
      async?: boolean
      charSet?: string
      crossOrigin?: string
      defer?: boolean
      integrity?: string
      noModule?: boolean
      nonce?: string
      src?: string
      type?: string
    }

    interface SelectHTMLAttributes extends HTMLAttributes {
      autoComplete?: string
      autoFocus?: boolean
      disabled?: boolean
      form?: string
      multiple?: boolean
      name?: string
      required?: boolean
      size?: number
      value?: string | string[] | number
      onChange?: ChangeEventHandler
    }

    interface SourceHTMLAttributes extends HTMLAttributes {
      media?: string
      sizes?: string
      src?: string
      srcSet?: string
      type?: string
    }

    interface StyleHTMLAttributes extends HTMLAttributes {
      media?: string
      nonce?: string
      scoped?: boolean
      type?: string
    }

    interface TableHTMLAttributes extends HTMLAttributes {
      cellPadding?: number | string
      cellSpacing?: number | string
      summary?: string
    }

    interface TextareaHTMLAttributes extends HTMLAttributes {
      autoComplete?: string
      autoFocus?: boolean
      cols?: number
      dirName?: string
      disabled?: boolean
      form?: string
      maxLength?: number
      minLength?: number
      name?: string
      placeholder?: string
      readOnly?: boolean
      required?: boolean
      rows?: number
      value?: string | string[] | number
      wrap?: string

      onChange?: ChangeEventHandler
    }

    interface TdHTMLAttributes extends HTMLAttributes {
      align?: 'left' | 'center' | 'right' | 'justify' | 'char'
      colSpan?: number
      headers?: string
      rowSpan?: number
      scope?: string
    }

    interface ThHTMLAttributes extends HTMLAttributes {
      align?: 'left' | 'center' | 'right' | 'justify' | 'char'
      colSpan?: number
      headers?: string
      rowSpan?: number
      scope?: string
    }

    interface TimeHTMLAttributes extends HTMLAttributes {
      dateTime?: string
    }

    interface TrackHTMLAttributes extends HTMLAttributes {
      default?: boolean
      kind?: string
      label?: string
      src?: string
      srcLang?: string
    }

    interface VideoHTMLAttributes extends MediaHTMLAttributes {
      height?: number | string
      playsInline?: boolean
      poster?: string
      width?: number | string
    }

    interface WebViewHTMLAttributes extends HTMLAttributes {
      allowFullScreen?: boolean
      allowpopups?: boolean
      autoFocus?: boolean
      autosize?: boolean
      blinkfeatures?: string
      disableblinkfeatures?: string
      disableguestresize?: boolean
      disablewebsecurity?: boolean
      guestinstance?: string
      httpreferrer?: string
      nodeintegration?: boolean
      partition?: string
      plugins?: boolean
      preload?: string
      src?: string
      useragent?: string
      webpreferences?: string
    }
  }

  namespace JSX {
    // tslint:disable-next-line:no-empty-interface
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      [JSX_PROPS_KEY]: {}
    }
    interface ElementChildrenAttribute {
      [JSX_CHILDREN_KEY]: {}
    }

    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicAttributes extends VueJSX.Attributes {}
    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicClassAttributes<T> extends VueJSX.ClassAttributes<T> {}

    interface IntrinsicElements {
      // HTML
      a: VueJSX.DetailedHTMLProps<
        VueJSX.AnchorHTMLAttributes,
        HTMLAnchorElement
      >
      abbr: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      address: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      area: VueJSX.DetailedHTMLProps<VueJSX.AreaHTMLAttributes, HTMLAreaElement>
      article: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      aside: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      audio: VueJSX.DetailedHTMLProps<
        VueJSX.AudioHTMLAttributes,
        HTMLAudioElement
      >
      b: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      base: VueJSX.DetailedHTMLProps<VueJSX.BaseHTMLAttributes, HTMLBaseElement>
      bdi: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      bdo: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      big: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      blockquote: VueJSX.DetailedHTMLProps<
        VueJSX.BlockquoteHTMLAttributes,
        HTMLElement
      >
      body: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLBodyElement>
      br: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLBRElement>
      button: VueJSX.DetailedHTMLProps<
        VueJSX.ButtonHTMLAttributes,
        HTMLButtonElement
      >
      canvas: VueJSX.DetailedHTMLProps<
        VueJSX.CanvasHTMLAttributes,
        HTMLCanvasElement
      >
      caption: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      cite: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      code: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      col: VueJSX.DetailedHTMLProps<
        VueJSX.ColHTMLAttributes,
        HTMLTableColElement
      >
      colgroup: VueJSX.DetailedHTMLProps<
        VueJSX.ColgroupHTMLAttributes,
        HTMLTableColElement
      >
      data: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      datalist: VueJSX.DetailedHTMLProps<
        VueJSX.HTMLAttributes,
        HTMLDataListElement
      >
      dd: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      del: VueJSX.DetailedHTMLProps<VueJSX.DelHTMLAttributes, HTMLElement>
      details: VueJSX.DetailedHTMLProps<
        VueJSX.DetailsHTMLAttributes,
        HTMLElement
      >
      dfn: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      dialog: VueJSX.DetailedHTMLProps<
        VueJSX.DialogHTMLAttributes,
        HTMLDialogElement
      >
      div: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLDivElement>
      dl: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLDListElement>
      dt: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      em: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      embed: VueJSX.DetailedHTMLProps<
        VueJSX.EmbedHTMLAttributes,
        HTMLEmbedElement
      >
      fieldset: VueJSX.DetailedHTMLProps<
        VueJSX.FieldsetHTMLAttributes,
        HTMLFieldSetElement
      >
      figcaption: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      figure: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      footer: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      form: VueJSX.DetailedHTMLProps<VueJSX.FormHTMLAttributes, HTMLFormElement>
      h1: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      h2: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      h3: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      h4: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      h5: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      h6: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadingElement>
      head: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHeadElement>
      header: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      hgroup: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      hr: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLHRElement>
      html: VueJSX.DetailedHTMLProps<VueJSX.HtmlHTMLAttributes, HTMLHtmlElement>
      i: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      iframe: VueJSX.DetailedHTMLProps<
        VueJSX.IframeHTMLAttributes,
        HTMLIFrameElement
      >
      img: VueJSX.DetailedHTMLProps<VueJSX.ImgHTMLAttributes, HTMLImageElement>
      input: VueJSX.DetailedHTMLProps<
        VueJSX.InputHTMLAttributes,
        HTMLInputElement
      >
      ins: VueJSX.DetailedHTMLProps<VueJSX.InsHTMLAttributes, HTMLModElement>
      kbd: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      keygen: VueJSX.DetailedHTMLProps<VueJSX.KeygenHTMLAttributes, HTMLElement>
      label: VueJSX.DetailedHTMLProps<
        VueJSX.LabelHTMLAttributes,
        HTMLLabelElement
      >
      legend: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLLegendElement>
      li: VueJSX.DetailedHTMLProps<VueJSX.LiHTMLAttributes, HTMLLIElement>
      link: VueJSX.DetailedHTMLProps<VueJSX.LinkHTMLAttributes, HTMLLinkElement>
      main: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      map: VueJSX.DetailedHTMLProps<VueJSX.MapHTMLAttributes, HTMLMapElement>
      mark: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      menu: VueJSX.DetailedHTMLProps<VueJSX.MenuHTMLAttributes, HTMLElement>
      menuitem: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      meta: VueJSX.DetailedHTMLProps<VueJSX.MetaHTMLAttributes, HTMLMetaElement>
      meter: VueJSX.DetailedHTMLProps<VueJSX.MeterHTMLAttributes, HTMLElement>
      nav: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      noindex: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      noscript: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      object: VueJSX.DetailedHTMLProps<
        VueJSX.ObjectHTMLAttributes,
        HTMLObjectElement
      >
      ol: VueJSX.DetailedHTMLProps<VueJSX.OlHTMLAttributes, HTMLOListElement>
      optgroup: VueJSX.DetailedHTMLProps<
        VueJSX.OptgroupHTMLAttributes,
        HTMLOptGroupElement
      >
      option: VueJSX.DetailedHTMLProps<
        VueJSX.OptionHTMLAttributes,
        HTMLOptionElement
      >
      output: VueJSX.DetailedHTMLProps<VueJSX.OutputHTMLAttributes, HTMLElement>
      p: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLParagraphElement>
      param: VueJSX.DetailedHTMLProps<
        VueJSX.ParamHTMLAttributes,
        HTMLParamElement
      >
      picture: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      pre: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLPreElement>
      progress: VueJSX.DetailedHTMLProps<
        VueJSX.ProgressHTMLAttributes,
        HTMLProgressElement
      >
      q: VueJSX.DetailedHTMLProps<VueJSX.QuoteHTMLAttributes, HTMLQuoteElement>
      rp: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      rt: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      ruby: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      s: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      samp: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      script: VueJSX.DetailedHTMLProps<
        VueJSX.ScriptHTMLAttributes,
        HTMLScriptElement
      >
      section: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      select: VueJSX.DetailedHTMLProps<
        VueJSX.SelectHTMLAttributes,
        HTMLSelectElement
      >
      small: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      source: VueJSX.DetailedHTMLProps<
        VueJSX.SourceHTMLAttributes,
        HTMLSourceElement
      >
      span: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLSpanElement>
      strong: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      style: VueJSX.DetailedHTMLProps<
        VueJSX.StyleHTMLAttributes,
        HTMLStyleElement
      >
      sub: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      summary: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      sup: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      table: VueJSX.DetailedHTMLProps<
        VueJSX.TableHTMLAttributes,
        HTMLTableElement
      >
      tbody: VueJSX.DetailedHTMLProps<
        VueJSX.HTMLAttributes,
        HTMLTableSectionElement
      >
      td: VueJSX.DetailedHTMLProps<
        VueJSX.TdHTMLAttributes,
        HTMLTableDataCellElement
      >
      textarea: VueJSX.DetailedHTMLProps<
        VueJSX.TextareaHTMLAttributes,
        HTMLTextAreaElement
      >
      tfoot: VueJSX.DetailedHTMLProps<
        VueJSX.HTMLAttributes,
        HTMLTableSectionElement
      >
      th: VueJSX.DetailedHTMLProps<
        VueJSX.ThHTMLAttributes,
        HTMLTableHeaderCellElement
      >
      thead: VueJSX.DetailedHTMLProps<
        VueJSX.HTMLAttributes,
        HTMLTableSectionElement
      >
      time: VueJSX.DetailedHTMLProps<VueJSX.TimeHTMLAttributes, HTMLElement>
      title: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLTitleElement>
      tr: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLTableRowElement>
      track: VueJSX.DetailedHTMLProps<
        VueJSX.TrackHTMLAttributes,
        HTMLTrackElement
      >
      u: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      ul: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLUListElement>
      var: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>
      video: VueJSX.DetailedHTMLProps<
        VueJSX.VideoHTMLAttributes,
        HTMLVideoElement
      >
      wbr: VueJSX.DetailedHTMLProps<VueJSX.HTMLAttributes, HTMLElement>

      // SVG
      svg: VueJSX.SVGProps<SVGSVGElement>

      animate: VueJSX.SVGProps<SVGElement> // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
      'animate-motion': VueJSX.SVGProps<SVGElement>
      'animate-transform': VueJSX.SVGProps<SVGElement> // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
      circle: VueJSX.SVGProps<SVGCircleElement>
      'clip-path': VueJSX.SVGProps<SVGClipPathElement>
      defs: VueJSX.SVGProps<SVGDefsElement>
      desc: VueJSX.SVGProps<SVGDescElement>
      ellipse: VueJSX.SVGProps<SVGEllipseElement>
      'fe-blend': VueJSX.SVGProps<SVGFEBlendElement>
      'fe-color-matrix': VueJSX.SVGProps<SVGFEColorMatrixElement>
      'fe-component-transfer': VueJSX.SVGProps<SVGFEComponentTransferElement>
      'fe-composite': VueJSX.SVGProps<SVGFECompositeElement>
      'fe-convolve-matrix': VueJSX.SVGProps<SVGFEConvolveMatrixElement>
      'fe-diffuse-lighting': VueJSX.SVGProps<SVGFEDiffuseLightingElement>
      'fe-displacement-map': VueJSX.SVGProps<SVGFEDisplacementMapElement>
      'fe-distant-light': VueJSX.SVGProps<SVGFEDistantLightElement>
      'fe-drop-shadow': VueJSX.SVGProps<SVGFEDropShadowElement>
      'fe-flood': VueJSX.SVGProps<SVGFEFloodElement>
      'fe-func-a': VueJSX.SVGProps<SVGFEFuncAElement>
      'fe-func-b': VueJSX.SVGProps<SVGFEFuncBElement>
      'fe-func-g': VueJSX.SVGProps<SVGFEFuncGElement>
      'fe-func-r': VueJSX.SVGProps<SVGFEFuncRElement>
      'fe-gaussian-blur': VueJSX.SVGProps<SVGFEGaussianBlurElement>
      'fe-image': VueJSX.SVGProps<SVGFEImageElement>
      'fe-merge': VueJSX.SVGProps<SVGFEMergeElement>
      'fe-merge-node': VueJSX.SVGProps<SVGFEMergeNodeElement>
      'fe-morphology': VueJSX.SVGProps<SVGFEMorphologyElement>
      'fe-offset': VueJSX.SVGProps<SVGFEOffsetElement>
      'fe-point-light': VueJSX.SVGProps<SVGFEPointLightElement>
      'fe-specular-lighting': VueJSX.SVGProps<SVGFESpecularLightingElement>
      'fe-spot-light': VueJSX.SVGProps<SVGFESpotLightElement>
      'fe-tile': VueJSX.SVGProps<SVGFETileElement>
      'fe-turbulence': VueJSX.SVGProps<SVGFETurbulenceElement>
      filter: VueJSX.SVGProps<SVGFilterElement>
      'foreign-object': VueJSX.SVGProps<SVGForeignObjectElement>
      g: VueJSX.SVGProps<SVGGElement>
      image: VueJSX.SVGProps<SVGImageElement>
      line: VueJSX.SVGProps<SVGLineElement>
      'linear-gradient': VueJSX.SVGProps<SVGLinearGradientElement>
      marker: VueJSX.SVGProps<SVGMarkerElement>
      mask: VueJSX.SVGProps<SVGMaskElement>
      metadata: VueJSX.SVGProps<SVGMetadataElement>
      mpath: VueJSX.SVGProps<SVGElement>
      path: VueJSX.SVGProps<SVGPathElement>
      pattern: VueJSX.SVGProps<SVGPatternElement>
      polygon: VueJSX.SVGProps<SVGPolygonElement>
      polyline: VueJSX.SVGProps<SVGPolylineElement>
      'radial-gradient': VueJSX.SVGProps<SVGRadialGradientElement>
      rect: VueJSX.SVGProps<SVGRectElement>
      stop: VueJSX.SVGProps<SVGStopElement>
      switch: VueJSX.SVGProps<SVGSwitchElement>
      symbol: VueJSX.SVGProps<SVGSymbolElement>
      text: VueJSX.SVGProps<SVGTextElement>
      'text-path': VueJSX.SVGProps<SVGTextPathElement>
      tspan: VueJSX.SVGProps<SVGTSpanElement>
      use: VueJSX.SVGProps<SVGUseElement>
      view: VueJSX.SVGProps<SVGViewElement>

      // Builtin
      'keep-alive': VueJSX.KeepAliveAttributes
      transition: VueJSX.TransitionAttributes
      'transition-group': VueJSX.TransitionGroupAttributes
    }
  }
}
