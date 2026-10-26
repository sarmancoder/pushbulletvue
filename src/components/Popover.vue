<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: undefined,
    },
    placement: {
        type: String,
        default: 'bottom',
    },
    closeOnClick: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    offset: {
        type: String,
        default: 'mt-2',
    },
    panelClass: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue', 'open', 'close'])

const root = ref(null)
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() =>
    isControlled.value ? props.modelValue : internalOpen.value
)

function setOpen(value) {
    if (props.disabled && value) return
    if (isOpen.value === value) return

    if (isControlled.value) {
        emit('update:modelValue', value)
    } else {
        internalOpen.value = value
    }

    emit(value ? 'open' : 'close')
}

function toggle() {
    setOpen(!isOpen.value)
}

const positionClass = computed(() => ({
    bottom: 'top-full left-0',
    top: 'bottom-full left-0',
    left: 'right-full top-0',
    right: 'left-full top-0',
}[props.placement]))

const offsetClass = computed(() => ({
    bottom: props.offset,
    top: props.offset.startsWith('mt-')
        ? props.offset.replace('mt-', 'mb-')
        : 'mb-2',
    left: 'mr-2',
    right: 'ml-2',
}[props.placement]))

function handleOutsideClick(event) {
    if (root.value && !root.value.contains(event.target)) {
        setOpen(false)
    }
}

function handleKeydown(event) {
    if (event.key === 'Escape') setOpen(false)
}

watch(() => props.disabled, (disabled) => {
    if (disabled) setOpen(false)
})

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div ref="root" class="popover">
        <!-- Trigger -->
        <div class="popover__trigger">
            <slot name="trigger" :open="isOpen" :toggle="toggle" :close="() => setOpen(false)">
                <button type="button" class="popover__button" :disabled="disabled" :aria-expanded="isOpen"
                    @click="toggle">
                    Abrir popover
                </button>
            </slot>
        </div>

        <!-- Panel -->
        <Transition name="popover">
            <div v-if="isOpen" class="popover__panel" :class="[positionClass, offsetClass, panelClass]"
                @click="handleContentClick">
                <slot :open="isOpen" :close="() => setOpen(false)" :toggle="toggle" />
            </div>
        </Transition>
    </div>
</template>


<style scoped>
@import 'tailwindcss';

.popover {
    @apply relative inline-block;
}

.popover__trigger {
    @apply inline-flex;
}

.popover__button {
    @apply inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.popover__panel {
    @apply absolute z-50 min-w-56 rounded-lg border border-gray-200 bg-white p-4 text-gray-800 shadow-lg;
}

.popover-enter-active,
.popover-leave-active {
    @apply transition duration-150 ease-out;
}

.popover-enter-from,
.popover-leave-to {
    @apply translate-y-1 opacity-0;
}

.popover__button {
    background-color: var(--accent-primary);
    color: var(--accent-text);

    @apply font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer border border-transparent;
}

.popover__button:hover {
    background-color: var(--accent-hover);
    @apply shadow-md;
}

.popover__button:active {
    @apply scale-[0.98];
}

.popover__button:focus-visible {
    @apply outline-none ring-2 ring-offset-2 ring-[var(--border-focus)];
}
</style>