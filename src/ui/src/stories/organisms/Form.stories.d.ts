import HForm from '../../components/organisms/Form.vue';
import type { Meta, StoryObj } from "@storybook/vue3";
declare const _default: Meta<(<Fields extends import('../../components/organisms/Form').FormTypes.FieldMap<string>>(__VLS_props: {
    fields: Fields;
    state?: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined;
    disabled?: boolean | undefined;
} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, __VLS_ctx?: Pick<{
    props: {
        fields: Fields;
        state?: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined;
        disabled?: boolean | undefined;
    };
    expose(exposed: {
        getState: () => import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields>;
    }): void;
    attrs: any;
    slots: {};
    emit: {
        (event: "submit", params: import('../../components/organisms/Form').FormInternalTypes.SubmitParameters<Fields>): void;
        (event: "update:state", fields: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined): void;
    };
}, "emit" | "slots" | "attrs"> | undefined, __VLS_setup?: Promise<{
    props: {
        fields: Fields;
        state?: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined;
        disabled?: boolean | undefined;
    };
    expose(exposed: {
        getState: () => import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields>;
    }): void;
    attrs: any;
    slots: {};
    emit: {
        (event: "submit", params: import('../../components/organisms/Form').FormInternalTypes.SubmitParameters<Fields>): void;
        (event: "update:state", fields: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined): void;
    };
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            fields: Fields;
            state?: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined;
            disabled?: boolean | undefined;
        };
        expose(exposed: {
            getState: () => import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields>;
        }): void;
        attrs: any;
        slots: {};
        emit: {
            (event: "submit", params: import('../../components/organisms/Form').FormInternalTypes.SubmitParameters<Fields>): void;
            (event: "update:state", fields: import('../../components/organisms/Form').FormInternalTypes.SubmitResult<Fields> | undefined): void;
        };
    } | undefined;
})>;
export default _default;
export declare const Default: StoryObj<typeof HForm>;
