import HButton from '../../components/atoms/Button.vue';
import type { Meta, StoryObj } from "@storybook/vue3";
declare const _default: Meta<import("vue").DefineComponent<{
    icon: {
        type: import("vue").PropType<"info" | "align-center" | "align-justify" | "align-left" | "align-right" | "amazon" | "android" | "angle-double-down" | "angle-double-left" | "angle-double-right" | "angle-double-up" | "angle-down" | "angle-left" | "angle-right" | "angle-up" | "apple" | "arrow-circle-down" | "arrow-circle-left" | "arrow-circle-right" | "arrow-circle-up" | "arrow-down" | "arrow-down-left" | "arrow-down-right" | "arrow-left" | "arrow-right" | "arrow-right-arrow-left" | "arrow-up" | "arrow-up-left" | "arrow-up-right" | "arrows-alt" | "arrows-h" | "arrows-v" | "at" | "backward" | "ban" | "bars" | "bell" | "bitcoin" | "bolt" | "book" | "bookmark" | "bookmark-fill" | "box" | "briefcase" | "building" | "calculator" | "calendar" | "calendar-minus" | "calendar-plus" | "calendar-times" | "camera" | "car" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "cart-plus" | "chart-bar" | "chart-line" | "chart-pie" | "check" | "check-circle" | "check-square" | "chevron-circle-down" | "chevron-circle-left" | "chevron-circle-right" | "chevron-circle-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up" | "circle" | "circle-fill" | "clock" | "clone" | "cloud" | "cloud-download" | "cloud-upload" | "code" | "cog" | "comment" | "comments" | "compass" | "copy" | "credit-card" | "database" | "delete-left" | "desktop" | "directions" | "directions-alt" | "discord" | "dollar" | "download" | "eject" | "ellipsis-h" | "ellipsis-v" | "envelope" | "eraser" | "euro" | "exclamation-circle" | "exclamation-triangle" | "external-link" | "eye" | "eye-slash" | "facebook" | "fast-backward" | "fast-forward" | "file" | "file-edit" | "file-excel" | "file-export" | "file-file-pdf" | "file-word" | "filter" | "filter-fill" | "filter-slash" | "flag" | "flag-fill" | "folder" | "folder-open" | "forward" | "gift" | "github" | "globe" | "google" | "hashtag" | "heart" | "heart-fill" | "history" | "home" | "hourglass" | "id-card" | "image" | "images" | "inbox" | "info-circle" | "instagram" | "key" | "language" | "link" | "linkedin" | "list" | "lock" | "lock-open" | "map" | "map-marker" | "megaphone" | "microphone" | "microsoft" | "minus" | "minus-circle" | "mobile" | "money-bill" | "moon" | "palette" | "paperclip" | "pause" | "paypal" | "pencil" | "percentage" | "phone" | "play" | "plus" | "plus-circle" | "pound" | "power-off" | "prime" | "print" | "qrcode" | "question" | "question-circle" | "reddit" | "refresh" | "replay" | "reply" | "save" | "search" | "search-minus" | "search-plus" | "send" | "server" | "share-alt" | "shield" | "shopping-bag" | "shopping-cart" | "sign-in" | "sign-out" | "sitemap" | "slack" | "sliders-h" | "sliders-v" | "sort" | "sort-alpha-down" | "sort-alpha-down-alt" | "sort-alpha-up" | "sort-alpha-up-alt" | "sort-alt" | "sort-alt-slash" | "sort-amount-down" | "sort-amount-down-alt" | "sort-amount-up" | "sort-amount-up-alt" | "sort-down" | "sort-numeric-down" | "sort-numeric-down-alt" | "sort-numeric-up" | "sort-numeric-up-alt" | "sort-up" | "spinner" | "star" | "star-fill" | "step-backward" | "step-backward-alt" | "step-forward" | "step-forward-alt" | "stop" | "stop-circle" | "stopwatch" | "sun" | "sync" | "table" | "tablet" | "tag" | "tags" | "telegram" | "th-large" | "thumbs-down" | "thumbs-down-fill" | "thumbs-up" | "thumbs-up-fill" | "ticket" | "times" | "times-circle" | "trash" | "truck" | "twitter" | "undo" | "unlock" | "upload" | "user" | "user-edit" | "user-minus" | "user-plus" | "users" | "verified" | "video" | "vimeo" | "volume-down" | "volume-off" | "volume-up" | "wallet" | "whatsapp" | "wifi" | "window-maximize" | "window-minimize" | "wrench" | "youtube">;
    };
    type: {
        type: import("vue").PropType<"button" | "submit" | "reset">;
    };
    label: {
        type: import("vue").PropType<string>;
    };
    href: {
        type: import("vue").PropType<string>;
    };
    variant: {
        type: import("vue").PropType<"success" | "info" | "primary" | "secondary" | "warning" | "help" | "danger">;
        default: string;
    };
    size: {
        type: import("vue").PropType<"s" | "m" | "l">;
        default: string;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    loading: {
        type: import("vue").PropType<boolean>;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (e: MouseEvent) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    icon: {
        type: import("vue").PropType<"info" | "align-center" | "align-justify" | "align-left" | "align-right" | "amazon" | "android" | "angle-double-down" | "angle-double-left" | "angle-double-right" | "angle-double-up" | "angle-down" | "angle-left" | "angle-right" | "angle-up" | "apple" | "arrow-circle-down" | "arrow-circle-left" | "arrow-circle-right" | "arrow-circle-up" | "arrow-down" | "arrow-down-left" | "arrow-down-right" | "arrow-left" | "arrow-right" | "arrow-right-arrow-left" | "arrow-up" | "arrow-up-left" | "arrow-up-right" | "arrows-alt" | "arrows-h" | "arrows-v" | "at" | "backward" | "ban" | "bars" | "bell" | "bitcoin" | "bolt" | "book" | "bookmark" | "bookmark-fill" | "box" | "briefcase" | "building" | "calculator" | "calendar" | "calendar-minus" | "calendar-plus" | "calendar-times" | "camera" | "car" | "caret-down" | "caret-left" | "caret-right" | "caret-up" | "cart-plus" | "chart-bar" | "chart-line" | "chart-pie" | "check" | "check-circle" | "check-square" | "chevron-circle-down" | "chevron-circle-left" | "chevron-circle-right" | "chevron-circle-up" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up" | "circle" | "circle-fill" | "clock" | "clone" | "cloud" | "cloud-download" | "cloud-upload" | "code" | "cog" | "comment" | "comments" | "compass" | "copy" | "credit-card" | "database" | "delete-left" | "desktop" | "directions" | "directions-alt" | "discord" | "dollar" | "download" | "eject" | "ellipsis-h" | "ellipsis-v" | "envelope" | "eraser" | "euro" | "exclamation-circle" | "exclamation-triangle" | "external-link" | "eye" | "eye-slash" | "facebook" | "fast-backward" | "fast-forward" | "file" | "file-edit" | "file-excel" | "file-export" | "file-file-pdf" | "file-word" | "filter" | "filter-fill" | "filter-slash" | "flag" | "flag-fill" | "folder" | "folder-open" | "forward" | "gift" | "github" | "globe" | "google" | "hashtag" | "heart" | "heart-fill" | "history" | "home" | "hourglass" | "id-card" | "image" | "images" | "inbox" | "info-circle" | "instagram" | "key" | "language" | "link" | "linkedin" | "list" | "lock" | "lock-open" | "map" | "map-marker" | "megaphone" | "microphone" | "microsoft" | "minus" | "minus-circle" | "mobile" | "money-bill" | "moon" | "palette" | "paperclip" | "pause" | "paypal" | "pencil" | "percentage" | "phone" | "play" | "plus" | "plus-circle" | "pound" | "power-off" | "prime" | "print" | "qrcode" | "question" | "question-circle" | "reddit" | "refresh" | "replay" | "reply" | "save" | "search" | "search-minus" | "search-plus" | "send" | "server" | "share-alt" | "shield" | "shopping-bag" | "shopping-cart" | "sign-in" | "sign-out" | "sitemap" | "slack" | "sliders-h" | "sliders-v" | "sort" | "sort-alpha-down" | "sort-alpha-down-alt" | "sort-alpha-up" | "sort-alpha-up-alt" | "sort-alt" | "sort-alt-slash" | "sort-amount-down" | "sort-amount-down-alt" | "sort-amount-up" | "sort-amount-up-alt" | "sort-down" | "sort-numeric-down" | "sort-numeric-down-alt" | "sort-numeric-up" | "sort-numeric-up-alt" | "sort-up" | "spinner" | "star" | "star-fill" | "step-backward" | "step-backward-alt" | "step-forward" | "step-forward-alt" | "stop" | "stop-circle" | "stopwatch" | "sun" | "sync" | "table" | "tablet" | "tag" | "tags" | "telegram" | "th-large" | "thumbs-down" | "thumbs-down-fill" | "thumbs-up" | "thumbs-up-fill" | "ticket" | "times" | "times-circle" | "trash" | "truck" | "twitter" | "undo" | "unlock" | "upload" | "user" | "user-edit" | "user-minus" | "user-plus" | "users" | "verified" | "video" | "vimeo" | "volume-down" | "volume-off" | "volume-up" | "wallet" | "whatsapp" | "wifi" | "window-maximize" | "window-minimize" | "wrench" | "youtube">;
    };
    type: {
        type: import("vue").PropType<"button" | "submit" | "reset">;
    };
    label: {
        type: import("vue").PropType<string>;
    };
    href: {
        type: import("vue").PropType<string>;
    };
    variant: {
        type: import("vue").PropType<"success" | "info" | "primary" | "secondary" | "warning" | "help" | "danger">;
        default: string;
    };
    size: {
        type: import("vue").PropType<"s" | "m" | "l">;
        default: string;
    };
    disabled: {
        type: import("vue").PropType<boolean>;
        default: boolean;
    };
    loading: {
        type: import("vue").PropType<boolean>;
    };
}>> & {
    onClick?: ((e: MouseEvent) => any) | undefined;
}, {
    variant: "success" | "info" | "primary" | "secondary" | "warning" | "help" | "danger";
    size: "s" | "m" | "l";
    disabled: boolean;
}, {}>>;
export default _default;
type Story = StoryObj<typeof HButton>;
export declare const Default: Story;
export declare const Types: Story;
export declare const Icon: Story;
export declare const Sizes: Story;
export declare const Set: Story;
