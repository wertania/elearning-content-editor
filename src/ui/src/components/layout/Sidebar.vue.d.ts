declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    open: {
        type: import("vue").PropType<boolean>;
        required: true;
    };
    position: {
        type: import("vue").PropType<"left" | "right">;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    open: {
        type: import("vue").PropType<boolean>;
        required: true;
    };
    position: {
        type: import("vue").PropType<"left" | "right">;
    };
}>> & {
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}, {}, {}>, {
    header?(_: {}): any;
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
