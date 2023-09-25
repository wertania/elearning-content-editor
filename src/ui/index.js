import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createBlock, createCommentVNode, toDisplayString, unref, createElementVNode, renderSlot, createVNode, withCtx, pushScopeId, popScopeId, useSlots, ref, createSlots, createTextVNode, Fragment, watch, resolveDirective, renderList, withDirectives, resolveDynamicComponent, mergeProps } from "vue";
import PButton from "primevue/button";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import Sidebar from "primevue/sidebar";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
const theme = "";
const setup = (app) => {
  app.use(PrimeVue);
  app.use(ToastService);
  app.directive("tooltip", Tooltip);
};
let toast = void 0;
const toastService = {
  addToast: (severity, summary, detail, options) => {
    if (!toast) {
      console.warn(
        'Toast instance is not set! Have you included the "NotificationManager.vue" component in your app?'
      );
    }
    toast == null ? void 0 : toast.add({
      severity,
      summary,
      detail,
      closable: true,
      life: severity === "error" ? void 0 : 5e3,
      ...options
    });
  },
  info(summary, detail) {
    this.addToast("info", summary, detail);
  },
  success(summary, detail) {
    this.addToast("success", summary, detail);
  },
  warn(summary, detail) {
    this.addToast("warn", summary, detail);
  },
  error(summary, detail) {
    this.addToast("error", summary, detail);
  },
  /**
   * @internal
   */
  _setToast: (_toast) => {
    toast = _toast;
  }
};
const buttonSizes = ["s", "m", "l"];
const buttonVariants = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "help",
  "danger"
];
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  props: {
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const className = computed(() => "pi pi-" + props.icon);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("i", {
        class: normalizeClass(className.value)
      }, null, 2);
    };
  }
});
const _hoisted_1$3 = ["href"];
const _hoisted_2$3 = { key: 1 };
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Button",
  props: {
    label: {},
    href: {},
    icon: {},
    type: {},
    variant: { default: "secondary" },
    size: { default: "m" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean }
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const className = computed(
      () => [
        `p-button-${props.variant}`,
        "p-button" + (props.size === "s" ? "-sm" : props.size === "l" ? "-lg" : ""),
        props.disabled ? "p-disabled" : ""
      ].join(" ")
    );
    return (_ctx, _cache) => {
      return _ctx.href ? (openBlock(), createElementBlock("a", {
        key: 0,
        class: normalizeClass("button-link p-button p-component " + className.value),
        href: _ctx.href
      }, [
        _ctx.icon ? (openBlock(), createBlock(_sfc_main$8, {
          key: 0,
          icon: _ctx.icon
        }, null, 8, ["icon"])) : createCommentVNode("", true),
        _ctx.label ? (openBlock(), createElementBlock("span", _hoisted_2$3, toDisplayString(_ctx.label), 1)) : createCommentVNode("", true)
      ], 10, _hoisted_1$3)) : (openBlock(), createBlock(unref(PButton), {
        key: 1,
        label: _ctx.label,
        icon: _ctx.icon ? `pi pi-${_ctx.icon}` : void 0,
        class: normalizeClass(className.value),
        type: _ctx.type,
        loading: _ctx.loading,
        onClick: _cache[0] || (_cache[0] = (e) => _ctx.$emit("click", e))
      }, null, 8, ["label", "icon", "class", "type", "loading"]));
    };
  }
});
const Button_vue_vue_type_style_index_0_lang = "";
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Dropdown",
  props: {
    options: {},
    modelValue: {},
    showClear: { type: Boolean },
    error: { type: Boolean },
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const className = computed(() => ({
      "p-invalid": props.error
    }));
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Dropdown), {
        "option-label": "label",
        "option-value": "value",
        "option-disabled": "disabled",
        class: normalizeClass(className.value),
        options: _ctx.options,
        "show-clear": _ctx.showClear,
        placeholder: _ctx.placeholder,
        "model-value": _ctx.modelValue,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => emit("update:modelValue", $event))
      }, null, 8, ["class", "options", "show-clear", "placeholder", "model-value"]);
    };
  }
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "NotificationManager",
  setup(__props) {
    toastService._setToast(useToast());
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Toast));
    };
  }
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  props: {
    title: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("header", null, [
        createElementVNode("h1", null, toDisplayString(_ctx.title), 1),
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]);
    };
  }
});
const AppHeader_vue_vue_type_style_index_0_scoped_1da65b2a_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const AppHeader = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1da65b2a"]]);
const _withScopeId$1 = (n) => (pushScopeId("data-v-072613f3"), n = n(), popScopeId(), n);
const _hoisted_1$2 = { class: "app" };
const _hoisted_2$2 = { class: "toolbar-container" };
const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("div", { class: "placeholder" }, "TOOLBAR", -1));
const _hoisted_4$2 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("div", { class: "placeholder" }, "MAIN", -1));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "App",
  props: {
    title: { default: "My Application" }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createVNode(AppHeader, { title: _ctx.title }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "header", {}, void 0, true)
          ]),
          _: 3
        }, 8, ["title"]),
        createElementVNode("div", _hoisted_2$2, [
          renderSlot(_ctx.$slots, "toolbar", {}, () => [
            _hoisted_3$2
          ], true)
        ]),
        createElementVNode("main", null, [
          renderSlot(_ctx.$slots, "main", {}, () => [
            _hoisted_4$2
          ], true)
        ])
      ]);
    };
  }
});
const App_vue_vue_type_style_index_0_scoped_072613f3_lang = "";
const App = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-072613f3"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  props: {
    open: { type: Boolean },
    position: {}
  },
  emits: ["update:open"],
  setup(__props, { emit }) {
    const props = __props;
    const slots = useSlots();
    const hasHeader = computed(() => typeof slots["header"] !== "undefined");
    const isOpen = ref(props.open);
    const handleUpdate = (value) => {
      emit("update:open", value);
      isOpen.value = false;
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Sidebar), {
        class: normalizeClass({ sidebar: true, "has-header": hasHeader.value }),
        visible: _ctx.open,
        "onUpdate:visible": handleUpdate,
        position: _ctx.position
      }, createSlots({
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode("test")
          ])
        ]),
        _: 2
      }, [
        hasHeader.value ? {
          name: "header",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "header")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["class", "visible", "position"]);
    };
  }
});
const Sidebar_vue_vue_type_style_index_0_lang = "";
const defineFormFields = (options) => {
  return options;
};
const _hoisted_1$1 = ["disabled"];
const _hoisted_2$1 = /* @__PURE__ */ createElementVNode("i", { class: "pi pi-check" }, null, -1);
const _hoisted_3$1 = /* @__PURE__ */ createElementVNode("i", { class: "pi pi-upload" }, null, -1);
const _hoisted_4$1 = ["accept"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FileSelect",
  props: {
    modelValue: {},
    accept: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const element = ref();
    const handleChange = () => {
      var _a;
      if (!element.value)
        return;
      const item = (_a = element.value.files) == null ? void 0 : _a.item(0);
      emit("update:modelValue", item ?? null);
      element.value.value = "";
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: normalizeClass(["p-inputtext file-select", { empty: !_ctx.modelValue, disabled: _ctx.disabled }]),
        onClick: _cache[0] || (_cache[0] = ($event) => {
          var _a;
          return (_a = element.value) == null ? void 0 : _a.click();
        }),
        disabled: _ctx.disabled
      }, [
        _ctx.modelValue ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          _hoisted_2$1,
          createTextVNode(" " + toDisplayString(_ctx.modelValue.name), 1)
        ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          _hoisted_3$1,
          createTextVNode(" Upload file... ")
        ], 64)),
        createElementVNode("input", {
          ref_key: "element",
          ref: element,
          type: "file",
          multiple: false,
          accept: _ctx.accept,
          onChange: handleChange
        }, null, 40, _hoisted_4$1)
      ], 10, _hoisted_1$1);
    };
  }
});
const FileSelect_vue_vue_type_style_index_0_lang = "";
const typedKeys = (o) => Object.keys(o);
const typedValues = (o) => Object.values(o);
const _withScopeId = (n) => (pushScopeId("data-v-fd251fb4"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "form-container" };
const _hoisted_2 = { class: "field-title" };
const _hoisted_3 = {
  key: 0,
  style: { "color": "grey" }
};
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("i", { class: "pi pi-info-circle" }, null, -1));
const _hoisted_5 = [
  _hoisted_4
];
const _hoisted_6 = { class: "field-value" };
const _hoisted_7 = {
  key: 7,
  class: "error"
};
const _hoisted_8 = { class: "footer" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Form",
  props: {
    fields: {},
    state: {},
    disabled: { type: Boolean }
  },
  emits: ["submit", "update:state"],
  setup(__props, { expose: __expose, emit }) {
    const props = __props;
    const fieldsArray = computed(() => typedValues(props.fields));
    const values = typedValues(props.fields).map(
      (field) => ref(field.default ?? null)
    );
    const errors = typedValues(props.fields).map(
      () => ref(false)
    );
    values.forEach((valueRef, i) => {
      const validate = () => {
        var _a;
        const value = values[i].value;
        const field = fieldsArray.value[i];
        if (field.required && (typeof value === "undefined" || value === null || value === "")) {
          errors[i].value = "Field is required";
          return;
        }
        if (field.type === "number" && typeof field.value === "number") {
          if (typeof field.min === "number" && field.value < field.min) {
            errors[i].value = `Has to be greater or equal to ${field.min}`;
            return;
          } else if (typeof field.max === "number" && field.value > field.max) {
            errors[i].value = `Has to be less than or equal to ${field.max}`;
            return;
          }
        }
        const error = (_a = field.validator) == null ? void 0 : _a.call(field, value);
        errors[i].value = error ?? false;
      };
      validate();
      watch(valueRef, validate);
    });
    const waitingForSubmitEvent = ref(false);
    const disableSubmit = computed(
      () => props.disabled || waitingForSubmitEvent.value || errors.some(({ value }) => value)
    );
    const getState = () => {
      const finalFields = {};
      for (let i = 0; i < values.length; i++) {
        const field = typedValues(props.fields)[i];
        const key = typedKeys(props.fields)[i];
        finalFields[key] = {
          ...field,
          error: errors[i].value,
          value: values[i].value
        };
      }
      return finalFields;
    };
    const handleSubmit = async () => {
      if (disableSubmit.value)
        return;
      emit("submit", {
        finalFields: getState(),
        start: () => waitingForSubmitEvent.value = true,
        finish: () => waitingForSubmitEvent.value = false
      });
    };
    __expose({
      getState
    });
    watch(values, () => emit("update:state", getState()), { immediate: true });
    watch(
      () => props.state,
      () => {
        if (!props.state)
          return;
        typedValues(props.state).forEach((value, index) => {
          values[index].value = value.value;
        });
      },
      { deep: true }
    );
    return (_ctx, _cache) => {
      const _directive_tooltip = resolveDirective("tooltip");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(fieldsArray.value, (field, i) => {
          return openBlock(), createElementBlock(Fragment, {
            key: field.title
          }, [
            createElementVNode("div", _hoisted_2, [
              createElementVNode("span", null, toDisplayString(field.label + (field.required ? "*" : "")), 1),
              field.info ? withDirectives((openBlock(), createElementBlock("div", _hoisted_3, _hoisted_5)), [
                [_directive_tooltip, field.info]
              ]) : createCommentVNode("", true)
            ]),
            createElementVNode("div", _hoisted_6, [
              field.type === "number" ? (openBlock(), createBlock(unref(InputNumber), {
                key: 0,
                class: normalizeClass({ "p-invalid": unref(errors)[i].value }),
                placeholder: field.placeholder,
                maxFractionDigits: field.decimals ?? 0,
                disabled: field.disabled,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event
              }, null, 8, ["class", "placeholder", "maxFractionDigits", "disabled", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
              field.type === "text-short" ? (openBlock(), createBlock(unref(InputText), {
                key: 1,
                class: normalizeClass({ "p-invalid": unref(errors)[i].value }),
                disabled: field.disabled,
                placeholder: field.placeholder,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event
              }, null, 8, ["class", "disabled", "placeholder", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
              field.type === "text-long" ? (openBlock(), createBlock(unref(Textarea), {
                key: 2,
                class: normalizeClass({ "p-invalid": unref(errors)[i].value }),
                placeholder: field.placeholder,
                rows: 3,
                disabled: field.disabled,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event
              }, null, 8, ["class", "placeholder", "disabled", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
              field.type === "dropdown" ? (openBlock(), createBlock(_sfc_main$6, {
                key: 3,
                showClear: !field.required,
                options: field.options,
                error: !!unref(errors)[i].value,
                placeholder: field.placeholder,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event,
                disabled: field.disabled
              }, null, 8, ["showClear", "options", "error", "placeholder", "modelValue", "onUpdate:modelValue", "disabled"])) : createCommentVNode("", true),
              field.type === "checkbox" ? (openBlock(), createBlock(unref(Checkbox), {
                key: 4,
                class: normalizeClass({ "p-invalid": unref(errors)[i].value }),
                disabled: field.disabled,
                binary: "",
                "true-value": true,
                "false-value": false,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event
              }, null, 8, ["class", "disabled", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
              field.type === "file" ? (openBlock(), createBlock(_sfc_main$1, {
                key: 5,
                class: normalizeClass({ "p-invalid": unref(errors)[i].value }),
                disabled: field.disabled,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": [($event) => unref(values)[i].value = $event, ($event) => {
                  var _a;
                  return (_a = field.onSelect) == null ? void 0 : _a.call(field, $event);
                }],
                accept: field.accept
              }, null, 8, ["class", "disabled", "modelValue", "onUpdate:modelValue", "accept"])) : createCommentVNode("", true),
              field.type === "custom" ? (openBlock(), createBlock(resolveDynamicComponent(field.component), mergeProps({ key: 6 }, field.props ?? {}, {
                field,
                modelValue: unref(values)[i].value,
                "onUpdate:modelValue": ($event) => unref(values)[i].value = $event,
                error: unref(errors)[i].value,
                "onUpdate:error": ($event) => unref(errors)[i].value = $event
              }), null, 16, ["field", "modelValue", "onUpdate:modelValue", "error", "onUpdate:error"])) : createCommentVNode("", true),
              unref(errors)[i].value ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString(unref(errors)[i].value), 1)) : createCommentVNode("", true)
            ])
          ], 64);
        }), 128)),
        createElementVNode("div", _hoisted_8, [
          createVNode(_sfc_main$7, {
            variant: "primary",
            onClick: handleSubmit,
            label: "Submit",
            disabled: disableSubmit.value,
            loading: waitingForSubmitEvent.value
          }, null, 8, ["disabled", "loading"])
        ])
      ]);
    };
  }
});
const Form_vue_vue_type_style_index_0_scoped_fd251fb4_lang = "";
const Form = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fd251fb4"]]);
export {
  App,
  AppHeader,
  _sfc_main$7 as Button,
  _sfc_main$6 as Dropdown,
  Form,
  _sfc_main$8 as Icon,
  _sfc_main$5 as NotificationManager,
  _sfc_main$2 as Sidebar,
  buttonSizes,
  buttonVariants,
  defineFormFields,
  setup,
  toastService
};
