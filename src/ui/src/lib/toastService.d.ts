import type { ToastMessageOptions } from "primevue/toast";
import type { ToastServiceMethods } from "primevue/toastservice";
declare const _default: {
    addToast: (severity: ToastMessageOptions["severity"], summary: string, detail?: string, options?: ToastMessageOptions) => void;
    info(summary: string, detail?: string): void;
    success(summary: string, detail?: string): void;
    warn(summary: string, detail?: string): void;
    error(summary: string, detail?: string): void;
    /**
     * @internal
     */
    _setToast: (_toast: ToastServiceMethods) => void;
};
export default _default;
