import type {FormSubmitEvent} from "#ui/types";
import type {Store} from "~/types";
import type {z} from "zod";
import schema from "~/schemas/store.schema";

export const useModalStore = () => {
    const isOpen = useState(() => false);
    const modalTitle = computed(() => true ? 'Create store' : 'Update store');
    const submitButtonLabel = computed(() => true ? 'Create store' : 'Update store');
    const successToastMessage = computed(() => true ? 'Create store successfully' : 'Update store successfully');

    type Schema = z.output<typeof schema>

    const DEFAULT_STATE = {
        name: undefined,
    };
    const state = useState(() => ({...DEFAULT_STATE}));

    const handleShow = () => {
        state.value = {...DEFAULT_STATE};
        isOpen.value = true;
    }

    const handleHide = () => {
        isOpen.value = false
    }

    const isSubmitLoading = useState(() => false);
    const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
        try {
            isSubmitLoading.value = true;
            await $fetch<Store>('/api/stores', {
                method: 'POST',
                body: {
                    name: event.data.name,
                }
            });
            await refreshNuxtData('stores');
            push.success(successToastMessage.value);
            handleHide();
        } catch (error: any) {
            console.log(error);
            push.error(error.statusMessage || 'Something went wrong');
        } finally {
            isSubmitLoading.value = false;
        }
    };

    return {
        isOpen,
        handleShow,
        handleHide,
        state,
        schema,
        isSubmitLoading,
        handleSubmit,

        modalTitle,
        submitButtonLabel,
    }
}
