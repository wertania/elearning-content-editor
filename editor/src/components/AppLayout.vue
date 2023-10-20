<template>
    <div class="card" :class="{ 'lightmode': mode === 'light', 'darkmode': mode !== 'light' }">
        <div class="flex overflow-hidden w-full h-6rem"
            :class="{ 'lightmode': mode === 'light', 'darkmode': mode !== 'light' }">
            <!-- Logo -->
            <div class="flex-none flex align-items-center justify-content-center ml-4 m-1 w-3rem">
                <slot name="logo"></slot>
            </div>
            <!-- AppName. Only visible if Desktop -->
            <div v-if="!mobile" class="flex-none flex align-items-center justify-content-center m-1">
                <slot name="appname"></slot>
            </div>
            <!-- First Items -->
            <div class="flex-none flex align-items-center justify-content-center m-1">
                <slot name="start"></slot>
            </div>
            <!-- Center Items. Only visible if Desktop -->
            <div v-if="!mobile" class="flex-grow-1 flex align-items-center align-items-center justify-content-center m-1">
                <slot name="center"></slot>
            </div>
            <!-- Last Items. Only visible if Desktop -->
            <div class="flex-none flex align-items-center align-items-center justify-content-center m-1">
                <slot name="before-end"></slot>
            </div>
            <!-- Menu Items. Will be behind a menu if not Desktop -->
            <div class="flex-none flex align-items-center align-items-center justify-content-center m-1">
                <!-- Desktop Menu -->
                <ul v-if="!mobile" class="list-none desktop-submenu-list">
                    <slot name="end"></slot>
                    <li>
                        <div class="flex justify-content-end align-content-center">
                            <InputSwitch v-model="darkMode" class="mr-2" />
                            <i v-if="mode === 'dark'" class="fa-solid fa-moon text-xl"></i>
                            <i v-if="mode === 'light'" class="fa-solid fa-sun text-xl"></i>
                        </div>
                    </li>
                </ul>

                <!-- Mobile Menu -->
                <div v-if="mobile" class="w-3rem cursor-pointer" @click="showEndMenu = !showEndMenu">
                    <i class="fa-solid fa-bars text-3xl"></i>
                </div>
                <div v-if="mobile && showEndMenu"
                    class="absolute right-0 surface-10 border-round-xl rounded-md shadow-lg z-10 w-full p-3 shadow-3"
                    style="top: 5rem;">
                    <ul class="m-0 list-none mobile-submenu-list">
                        <li>
                            <div class="flex justify-content-end">
                                <i v-if="mode === 'dark'" class="fa-solid fa-moon"></i>
                                <i v-if="mode === 'light'" class="fa-solid fa-sun"></i>
                                <InputSwitch v-model="darkMode" class="ml-3" />
                            </div>
                        </li>
                        <slot name="end">
                        </slot>
                    </ul>
                    <slot name="submenu"></slot>
                </div>
            </div>
        </div>
    </div>
    <div class="grid w-full" :class="{ 'lightmode': mode === 'light', 'darkmode': mode !== 'light' }">
        <slot v-if="!mobile && showSidebar" name="sidebar" class="col-3" />
        <slot name="content" :class="{ 'col-12': mobile || showSidebar, 'col-9': !mobile && showSidebar }" />
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed } from 'vue';
import { usePrimeVue } from 'primevue/config';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps({
    hideSidebase: {
        type: Boolean,
        default: false
    },
});

const emits = defineEmits(['update:mode']);

// mobile mode depends on window size
const mobile = computed(() => {
    return window.innerWidth < 768;
});

// sidemenu
const showSidebar = ref(props.hideSidebase ? false : true);

const showEndMenu = ref(false);
const darkMode: Ref<boolean> = ref(false);
const mode: Ref<string> = ref('light');
emits('update:mode', mode.value);

const PrimeVue = usePrimeVue();
const toggleToDark = () => {
    PrimeVue.changeTheme('md-light-indigo', 'md-dark-indigo', 'theme-toggle', () => { });
};
const toggleToLight = () => {
    PrimeVue.changeTheme('md-dark-indigo', 'md-light-indigo', 'theme-toggle', () => { });
};

watch(() => darkMode.value, (newVal: boolean) => {
    console.log('mode changed', newVal);
    if (!newVal) {
        toggleToLight();
        mode.value = 'light';
        emits('update:mode', 'light');
    } else {
        toggleToDark();
        mode.value = 'dark';
        emits('update:mode', 'dark');
    }
});
</script>

<style>
body {
    margin: 0px !important;
}

#toolbar-desktop {
    background-color: #afafaf;
}

div .darkmode,
.darkmode div {
    background-color: #252525;
    color: rgb(210, 210, 210);
}

div .lightmode,
.lightmode div {
    background-color: white;
    color: rgb(87 87 87);
}

ul.desktop-submenu-list>li {
    float: left;
    font-size: 0.9rem;
    padding-left: 5px;
}

ul.mobile-submenu-list {
    padding-left: 0px !important;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 10px;
}

ul.mobile-submenu-list>li {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>