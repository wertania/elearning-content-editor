import { app } from "./../main";

/**
 * The standard lifetime of a toast message.
 */
const STD_LIFETIME = 3000;

/**
 * Add a users INFO message to the toast.
 */
export function info(
  body: string,
  title: string = "Info",
  duration: number = STD_LIFETIME,
): void {
  app.config.globalProperties.$toast.add({
    severity: "success",
    summary: title,
    detail: body,
    life: duration,
  });
}

/**
 * Add a users ERROR message to the toast.
 */
export function error(
  body: string,
  title: string = "Error",
  duration: number = STD_LIFETIME,
): void {
  app.config.globalProperties.$toast.add({
    severity: "error",
    summary: title,
    detail: body,
    life: duration,
  });
}
