<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

type Placement = 'bottom' | 'top' | 'left' | 'right'

const props = withDefaults(defineProps<{
    modelValue?: boolean
    placement?: Placement
    closeOnClick?: boolean
    disabled?: boolean
    offset?: string
    panelClass?: string
}>(), {
    modelValue: undefined,
    placement: 'bottom',
    closeOnClick: true,
    disabled: false,
    offset: 'mt-2',
    panelClass: '',
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    open: []
    close: []
}>()

const root = ref<HTMLElement | null>(null)
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() =>
    isControlled.value ? !!props.modelValue : internalOpen.value
)

function setOpen(value: boolean) {
    if (props.disabled && value) return
    if (isOpen.value === value) return

    if (isControlled.value) {
        emit('update:modelValue', value)
    } else {
        internalOpen.value = value
    }

    if (value) emit('open')
    else emit('close')
}

function toggle() {
    setOpen(!isOpen.value)
}

const positionClasses: Record<Placement, string> = {
    bottom: 'top-full left-0',
    top: 'bottom-full left-0',
    left: 'right-full top-0',
    right: 'left-full top-0',
}

const positionClass = computed(() => positionClasses[props.placement])

const offsetClass = computed(() => ({
    bottom: props.offset,
    top: props.offset.startsWith('mt-')
        ? props.offset.replace('mt-', 'mb-')
        : 'mb-2',
    left: 'mr-2',
    right: 'ml-2',
} satisfies Record<Placement, string>)[props.placement])

function handleOutsideClick(event: MouseEvent) {
    if (root.value && !root.value.contains(event.target as Node)) {
        setOpen(false)
    }
}

function handleContentClick() {
    if (props.closeOnClick) setOpen(false)
}

function handleKeydown(event: KeyboardEvent) {
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
            <div v-if="isOpen" class="popover__panel relative" :class="[positionClass, offsetClass, panelClass]"
                @click="handleContentClick">
                <span class="popover__arrow"></span>
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
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);
    @apply absolute z-50 min-w-64 rounded-xl border p-4 shadow-xl right-0 origin-top-right;
}

.popover__arrow {
    border-color: var(--border-color);
    background-color: var(--bg-secondary);
    @apply absolute -top-1.5 right-4 w-3 h-3 rotate-45 border-t border-l;
}

.popover-enter-active,
.popover-leave-active {
    @apply transition duration-150 ease-out;
}

.popover-enter-from,
.popover-leave-to {
    @apply translate-y-1 opacity-0 scale-95;
}

.popover-enter-to,
.popover-leave-from {
    @apply translate-y-0 opacity-100 scale-100;
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