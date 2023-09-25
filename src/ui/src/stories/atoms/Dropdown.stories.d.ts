import HDropdown from '../../components/atoms/Dropdown.vue';
import type { Meta, StoryObj } from "@storybook/vue3";
declare const _default: Meta<import("vue").DefineComponent<{
    options: {
        type: import("vue").PropType<{
            label: string;
            value: any;
            disabled?: boolean | undefined;
        }[]>;
        required: true;
    };
    modelValue: {
        type: import("vue").PropType<any>;
    };
    showClear: {
        type: import("vue").PropType<boolean>;
    };
    error: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: any) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    options: {
        type: import("vue").PropType<{
            label: string;
            value: any;
            disabled?: boolean | undefined;
        }[]>;
        required: true;
    };
    modelValue: {
        type: import("vue").PropType<any>;
    };
    showClear: {
        type: import("vue").PropType<boolean>;
    };
    error: {
        type: import("vue").PropType<boolean>;
    };
    placeholder: {
        type: import("vue").PropType<string>;
    };
}>> & {
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {}, {}>>;
export default _default;
export declare const Default: StoryObj<typeof HDropdown>;
