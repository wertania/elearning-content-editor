import type { FormInternalTypes, FormTypes } from "./Form";
declare const _default: <Fields extends FormTypes.FieldMap<string>>(__VLS_props: {
    fields: Fields;
    state?: FormInternalTypes.SubmitResult<Fields> | undefined;
    disabled?: boolean | undefined;
} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, __VLS_ctx?: Pick<{
    props: {
        fields: Fields;
        state?: FormInternalTypes.SubmitResult<Fields> | undefined;
        disabled?: boolean | undefined;
    };
    expose(exposed: {
        getState: () => FormInternalTypes.SubmitResult<Fields>;
    }): void;
    attrs: any;
    slots: {};
    emit: {
        (event: "submit", params: FormInternalTypes.SubmitParameters<Fields>): void;
        (event: "update:state", fields: FormInternalTypes.SubmitResult<Fields> | undefined): void;
    };
}, "emit" | "slots" | "attrs"> | undefined, __VLS_setup?: Promise<{
    props: {
        fields: Fields;
        state?: FormInternalTypes.SubmitResult<Fields> | undefined;
        disabled?: boolean | undefined;
    };
    expose(exposed: {
        getState: () => FormInternalTypes.SubmitResult<Fields>;
    }): void;
    attrs: any;
    slots: {};
    emit: {
        (event: "submit", params: FormInternalTypes.SubmitParameters<Fields>): void;
        (event: "update:state", fields: FormInternalTypes.SubmitResult<Fields> | undefined): void;
    };
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            fields: Fields;
            state?: FormInternalTypes.SubmitResult<Fields> | undefined;
            disabled?: boolean | undefined;
        };
        expose(exposed: {
            getState: () => FormInternalTypes.SubmitResult<Fields>;
        }): void;
        attrs: any;
        slots: {};
        emit: {
            (event: "submit", params: FormInternalTypes.SubmitParameters<Fields>): void;
            (event: "update:state", fields: FormInternalTypes.SubmitResult<Fields> | undefined): void;
        };
    } | undefined;
};
export default _default;
