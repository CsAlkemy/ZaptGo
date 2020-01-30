// Generated by dts-bundle v0.7.3-fork.1
// Dependencies for this module:
//   ../../../../../@fullcalendar/Core

declare module '@fullcalendar/interaction' {
    import FeaturefulElementDragging from '@fullcalendar/interaction/dnd/FeaturefulElementDragging';
    const _default: import("@fullcalendar/Core").PluginDef;
    export default _default;
    export { FeaturefulElementDragging };
    export { default as PointerDragging } from '@fullcalendar/interaction/dnd/PointerDragging';
    export { default as Draggable } from '@fullcalendar/interaction/interactions-external/ExternalDraggable';
    export { default as ThirdPartyDraggable } from '@fullcalendar/interaction/interactions-external/ThirdPartyDraggable';
}

declare module '@fullcalendar/interaction/dnd/FeaturefulElementDragging' {
    import { PointerDragEvent, ElementDragging } from '@fullcalendar/Core';
    import PointerDragging from '@fullcalendar/interaction/dnd/PointerDragging';
    import ElementMirror from '@fullcalendar/interaction/dnd/ElementMirror';
    import AutoScroller from '@fullcalendar/interaction/dnd/AutoScroller';
    export { FeaturefulElementDragging as default, FeaturefulElementDragging };
    class FeaturefulElementDragging extends ElementDragging {
        pointer: PointerDragging;
        mirror: ElementMirror;
        autoScroller: AutoScroller;
        delay: number | null;
        minDistance: number;
        touchScrollAllowed: boolean;
        mirrorNeedsRevert: boolean;
        isInteracting: boolean;
        isDragging: boolean;
        isDelayEnded: boolean;
        isDistanceSurpassed: boolean;
        delayTimeoutId: number | null;
        constructor(containerEl: HTMLElement);
        destroy(): void;
        onPointerDown: (ev: PointerDragEvent) => void;
        onPointerMove: (ev: PointerDragEvent) => void;
        onPointerUp: (ev: PointerDragEvent) => void;
        startDelay(ev: PointerDragEvent): void;
        handleDelayEnd(ev: PointerDragEvent): void;
        handleDistanceSurpassed(ev: PointerDragEvent): void;
        tryStartDrag(ev: PointerDragEvent): void;
        tryStopDrag(ev: PointerDragEvent): void;
        stopDrag(ev: PointerDragEvent): void;
        setIgnoreMove(bool: boolean): void;
        setMirrorIsVisible(bool: boolean): void;
        setMirrorNeedsRevert(bool: boolean): void;
        setAutoScrollEnabled(bool: boolean): void;
    }
}

declare module '@fullcalendar/interaction/dnd/PointerDragging' {
    import { EmitterMixin, PointerDragEvent } from '@fullcalendar/Core';
    export { PointerDragging as default, PointerDragging };
    class PointerDragging {
        containerEl: EventTarget;
        subjectEl: HTMLElement | null;
        downEl: HTMLElement | null;
        emitter: EmitterMixin;
        selector: string;
        handleSelector: string;
        shouldIgnoreMove: boolean;
        shouldWatchScroll: boolean;
        isDragging: boolean;
        isTouchDragging: boolean;
        wasTouchScroll: boolean;
        origPageX: number;
        origPageY: number;
        prevPageX: number;
        prevPageY: number;
        prevScrollX: number;
        prevScrollY: number;
        constructor(containerEl: EventTarget);
        destroy(): void;
        tryStart(ev: UIEvent): boolean;
        cleanup(): void;
        querySubjectEl(ev: UIEvent): HTMLElement;
        handleMouseDown: (ev: MouseEvent) => void;
        handleMouseMove: (ev: MouseEvent) => void;
        handleMouseUp: (ev: MouseEvent) => void;
        shouldIgnoreMouse(): number | boolean;
        handleTouchStart: (ev: TouchEvent) => void;
        handleTouchMove: (ev: TouchEvent) => void;
        handleTouchEnd: (ev: TouchEvent) => void;
        handleTouchScroll: () => void;
        cancelTouchScroll(): void;
        initScrollWatch(ev: PointerDragEvent): void;
        recordCoords(ev: PointerDragEvent): void;
        handleScroll: (ev: UIEvent) => void;
        destroyScrollWatch(): void;
        createEventFromMouse(ev: MouseEvent, isFirst?: boolean): PointerDragEvent;
        createEventFromTouch(ev: TouchEvent, isFirst?: boolean): PointerDragEvent;
    }
}

declare module '@fullcalendar/interaction/interactions-external/ExternalDraggable' {
    import { PointerDragEvent } from '@fullcalendar/Core';
    import FeaturefulElementDragging from '@fullcalendar/interaction/dnd/FeaturefulElementDragging';
    import { DragMetaGenerator } from '@fullcalendar/interaction/interactions-external/ExternalElementDragging';
    export interface ExternalDraggableSettings {
        eventData?: DragMetaGenerator;
        itemSelector?: string;
        minDistance?: number;
        longPressDelay?: number;
        appendTo?: HTMLElement;
    }
    export { ExternalDraggable as default, ExternalDraggable };
    class ExternalDraggable {
        dragging: FeaturefulElementDragging;
        settings: ExternalDraggableSettings;
        constructor(el: HTMLElement, settings?: ExternalDraggableSettings);
        handlePointerDown: (ev: PointerDragEvent) => void;
        handleDragStart: (ev: PointerDragEvent) => void;
        destroy(): void;
    }
}

declare module '@fullcalendar/interaction/interactions-external/ThirdPartyDraggable' {
    import { DragMetaGenerator } from '@fullcalendar/interaction/interactions-external/ExternalElementDragging';
    import InferredElementDragging from '@fullcalendar/interaction/interactions-external/InferredElementDragging';
    export interface ThirdPartyDraggableSettings {
        eventData?: DragMetaGenerator;
        itemSelector?: string;
        mirrorSelector?: string;
    }
    export { ThirdPartyDraggable as default, ThirdPartyDraggable };
    class ThirdPartyDraggable {
        dragging: InferredElementDragging;
        constructor(containerOrSettings?: EventTarget | ThirdPartyDraggableSettings, settings?: ThirdPartyDraggableSettings);
        destroy(): void;
    }
}

declare module '@fullcalendar/interaction/dnd/ElementMirror' {
    import { Rect } from '@fullcalendar/Core';
    export { ElementMirror as default, ElementMirror };
    class ElementMirror {
        isVisible: boolean;
        origScreenX?: number;
        origScreenY?: number;
        deltaX?: number;
        deltaY?: number;
        sourceEl: HTMLElement | null;
        mirrorEl: HTMLElement | null;
        sourceElRect: Rect | null;
        parentNode: HTMLElement;
        zIndex: number;
        revertDuration: number;
        start(sourceEl: HTMLElement, pageX: number, pageY: number): void;
        handleMove(pageX: number, pageY: number): void;
        setIsVisible(bool: boolean): void;
        stop(needsRevertAnimation: boolean, callback: () => void): void;
        doRevertAnimation(callback: () => void, revertDuration: number): void;
        cleanup(): void;
        updateElPosition(): void;
        getMirrorEl(): HTMLElement;
    }
}

declare module '@fullcalendar/interaction/dnd/AutoScroller' {
    import { ScrollGeomCache } from '@fullcalendar/interaction/scroll-geom-cache';
    export { AutoScroller as default, AutoScroller };
    class AutoScroller {
        isEnabled: boolean;
        scrollQuery: (Window | string)[];
        edgeThreshold: number;
        maxVelocity: number;
        pointerScreenX: number | null;
        pointerScreenY: number | null;
        isAnimating: boolean;
        scrollCaches: ScrollGeomCache[] | null;
        msSinceRequest?: number;
        everMovedUp: boolean;
        everMovedDown: boolean;
        everMovedLeft: boolean;
        everMovedRight: boolean;
        start(pageX: number, pageY: number): void;
        handleMove(pageX: number, pageY: number): void;
        stop(): void;
        requestAnimation(now: number): void;
    }
}

declare module '@fullcalendar/interaction/interactions-external/ExternalElementDragging' {
    import { Hit, PointerDragEvent, EventTuple, DatePointApi, Calendar, EventInteractionState, DragMetaInput, DragMeta, View, ElementDragging } from '@fullcalendar/Core';
    import HitDragging from '@fullcalendar/interaction/interactions/HitDragging';
    export type DragMetaGenerator = DragMetaInput | ((el: HTMLElement) => DragMetaInput);
    export interface ExternalDropApi extends DatePointApi {
        draggedEl: HTMLElement;
        jsEvent: UIEvent;
        view: View;
    }
    export { ExternalElementDragging as default, ExternalElementDragging };
    class ExternalElementDragging {
        hitDragging: HitDragging;
        receivingCalendar: Calendar | null;
        droppableEvent: EventTuple | null;
        suppliedDragMeta: DragMetaGenerator | null;
        dragMeta: DragMeta | null;
        constructor(dragging: ElementDragging, suppliedDragMeta?: DragMetaGenerator);
        handleDragStart: (ev: PointerDragEvent) => void;
        buildDragMeta(subjectEl: HTMLElement): DragMeta;
        handleHitUpdate: (hit: Hit, isFinal: boolean, ev: PointerDragEvent) => void;
        handleDragEnd: (pev: PointerDragEvent) => void;
        displayDrag(nextCalendar: Calendar | null, state: EventInteractionState): void;
        clearDrag(): void;
        canDropElOnCalendar(el: HTMLElement, receivingCalendar: Calendar): boolean;
    }
}

declare module '@fullcalendar/interaction/interactions-external/InferredElementDragging' {
    import { PointerDragEvent, ElementDragging } from '@fullcalendar/Core';
    import PointerDragging from '@fullcalendar/interaction/dnd/PointerDragging';
    export { InferredElementDragging as default, InferredElementDragging };
    class InferredElementDragging extends ElementDragging {
        pointer: PointerDragging;
        shouldIgnoreMove: boolean;
        mirrorSelector: string;
        currentMirrorEl: HTMLElement | null;
        constructor(containerEl: HTMLElement);
        destroy(): void;
        handlePointerDown: (ev: PointerDragEvent) => void;
        handlePointerMove: (ev: PointerDragEvent) => void;
        handlePointerUp: (ev: PointerDragEvent) => void;
        setIgnoreMove(bool: boolean): void;
        setMirrorIsVisible(bool: boolean): void;
    }
}

declare module '@fullcalendar/interaction/scroll-geom-cache' {
    import { Rect, ScrollController } from '@fullcalendar/Core';
    export abstract class ScrollGeomCache extends ScrollController {
        clientRect: Rect;
        origScrollTop: number;
        origScrollLeft: number;
        protected scrollController: ScrollController;
        protected doesListening: boolean;
        protected scrollTop: number;
        protected scrollLeft: number;
        protected scrollWidth: number;
        protected scrollHeight: number;
        protected clientWidth: number;
        protected clientHeight: number;
        constructor(scrollController: ScrollController, doesListening: boolean);
        abstract getEventTarget(): EventTarget;
        abstract computeClientRect(): Rect;
        destroy(): void;
        handleScroll: () => void;
        getScrollTop(): number;
        getScrollLeft(): number;
        setScrollTop(top: number): void;
        setScrollLeft(top: number): void;
        getClientWidth(): number;
        getClientHeight(): number;
        getScrollWidth(): number;
        getScrollHeight(): number;
        handleScrollChange(): void;
    }
    export class ElementScrollGeomCache extends ScrollGeomCache {
        constructor(el: HTMLElement, doesListening: boolean);
        getEventTarget(): EventTarget;
        computeClientRect(): {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
    }
    export class WindowScrollGeomCache extends ScrollGeomCache {
        constructor(doesListening: boolean);
        getEventTarget(): EventTarget;
        computeClientRect(): Rect;
        handleScrollChange(): void;
    }
}

declare module '@fullcalendar/interaction/interactions/HitDragging' {
    import { EmitterMixin, PointerDragEvent, Point, Hit, InteractionSettingsStore, ElementDragging } from '@fullcalendar/Core';
    import OffsetTracker from '@fullcalendar/interaction/OffsetTracker';
    export { HitDragging as default, HitDragging };
    class HitDragging {
        droppableStore: InteractionSettingsStore;
        dragging: ElementDragging;
        emitter: EmitterMixin;
        useSubjectCenter: boolean;
        requireInitial: boolean;
        offsetTrackers: {
            [componentUid: string]: OffsetTracker;
        };
        initialHit: Hit | null;
        movingHit: Hit | null;
        finalHit: Hit | null;
        coordAdjust?: Point;
        constructor(dragging: ElementDragging, droppableStore: InteractionSettingsStore);
        handlePointerDown: (ev: PointerDragEvent) => void;
        processFirstCoord(ev: PointerDragEvent): void;
        handleDragStart: (ev: PointerDragEvent) => void;
        handleDragMove: (ev: PointerDragEvent) => void;
        handlePointerUp: (ev: PointerDragEvent) => void;
        handleDragEnd: (ev: PointerDragEvent) => void;
        handleMove(ev: PointerDragEvent, forceHandle?: boolean): void;
        prepareHits(): void;
        releaseHits(): void;
        queryHitForOffset(offsetLeft: number, offsetTop: number): Hit | null;
    }
    export function isHitsEqual(hit0: Hit | null, hit1: Hit | null): boolean;
}

declare module '@fullcalendar/interaction/OffsetTracker' {
    import { Rect } from '@fullcalendar/Core';
    import { ElementScrollGeomCache } from '@fullcalendar/interaction/scroll-geom-cache';
    export { OffsetTracker as default, OffsetTracker };
    class OffsetTracker {
        scrollCaches: ElementScrollGeomCache[];
        origRect: Rect;
        constructor(el: HTMLElement);
        destroy(): void;
        computeLeft(): number;
        computeTop(): number;
        isWithinClipping(pageX: number, pageY: number): boolean;
    }
}

