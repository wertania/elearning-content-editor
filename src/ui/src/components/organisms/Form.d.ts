import type { DropdownProps } from '../../components/atoms/Dropdown.vue';
import type { Form } from '../../index';
import { type Component, type ComponentCustomProps } from "vue";
export declare const defineFormFields: <T extends FormTypes.FieldMap<string>>(options: {
    fields: T;
    handleSubmit: FormInternalTypes.HandleSubmit<T>;
}) => FormInternalTypes.DefinitionResult<T>;
export declare module FormTypes {
    /**
     * This is a helper to be able to type component refs for `Form`.
     * This turned out more difficult because `Form` is a generic component.
     * A fix for this is an open issue on GitHub (see https://github.com/vuejs/core/issues/8373).
     *
     * @example
     * import { FormTypes } from 'hh-components'
     * const form = ref<FormTypes.Ref>()
     */
    type Ref = Parameters<Required<ReturnType<typeof Form>>["__ctx"]["expose"]>[0];
    interface FieldBase<T extends string, V> {
        label: string;
        required?: boolean;
        disabled?: boolean;
        type: T;
        value?: V;
        default?: V;
        info?: string;
        validator?: (value: V | null) => string | undefined;
    }
    type Field = FieldNumber | FieldTextShort | FieldTextLong | FieldCheckbox | FieldDropdown | FieldFile | FieldCustom;
    type FieldMap<FieldID extends string = string> = Record<FieldID, Field>;
    type State<Fields extends FieldMap> = FormInternalTypes.SubmitResult<Fields>;
    interface FieldNumber extends FieldBase<"number", number> {
        min?: number;
        max?: number;
        decimals?: number;
        placeholder?: string;
    }
    interface FieldTextShort extends FieldBase<"text-short", string> {
        placeholder?: string;
    }
    interface FieldTextLong extends FieldBase<"text-long", string> {
        placeholder?: string;
    }
    interface FieldDropdown<T = any> extends FieldBase<"dropdown", T> {
        options: DropdownProps["options"];
        placeholder?: string;
    }
    interface FieldCheckbox extends FieldBase<"checkbox", boolean> {
    }
    interface FieldFile extends FieldBase<"file", File> {
        accept?: string;
        onSelect?: (file: File | null) => void;
    }
    interface FieldCustom extends FieldBase<"custom", any> {
        component: Component;
        props?: ComponentCustomProps;
    }
}
export declare module FormInternalTypes {
    /**
     * A map from form field IDs to form fields.
     * This type is only used internally.
     * Constructs a type for a form submission result.
     * Makes `value` required if the `required` property of the field extends true.
     *
     * @example
     * const formFields = defineFields({
     *   name: {
     *     type: 'text-short',
     *     required: true,
     *   },
     *   comment: {
     *     type: 'text-long',
     *     required: false,
     *   },
     * })
     *
     * SubmitResult<typeof formFields> === {
     *   name: {
     *     value: string,
     *     ...
     *   },
     *   comment: {
     *     value?: string,
     *     ...
     *   },
     * }
     */
    type SubmitResult<Map extends FormTypes.FieldMap<string>> = {
        [K in keyof Map]: FormTypes.Field & {
            type: Map[K]["type"];
            error: string | false;
        } & (Map[K]["required"] extends true ? {
            value: Exclude<Map[K]["value"], undefined | null>;
        } : {
            value?: Map[K]["value"];
        });
    };
    interface SubmitParameters<Map extends FormTypes.FieldMap> {
        finalFields: SubmitResult<Map>;
        /**
         * The user has the option to tell the form when the submit handling starts and finishes.
         * This information is used to disable the submit button and display a loading icon.
         */
        start: () => void;
        /**
         * See `start` above.
         */
        finish: () => void;
    }
    type HandleSubmit<Map extends FormTypes.FieldMap> = (params: SubmitParameters<Map>) => any;
    interface DefinitionResult<Map extends FormTypes.FieldMap> {
        fields: Map;
        handleSubmit: HandleSubmit<Map>;
    }
}
