export const useCustomToast = () => {
    const toast = useToast()

    type ToastOptions = Parameters<typeof toast.add>[0];
    type Options = ToastOptions | string;

    const success = (options: Options) => {
        const defaultOptions: ToastOptions = {
            color: 'green',
            icon: 'ion:checkmark',
        }
        if (typeof options === 'string') {
            defaultOptions.title = options
        } else {
            Object.assign(defaultOptions, options);
        }
        toast.add(defaultOptions)
    }

    const error = (options: Options) => {
        const defaultOptions: ToastOptions = {
            color: 'red',
            icon: 'ion:close-circle-outline',
        };

        if (typeof options === 'string') {
            defaultOptions.title = options;
        } else {
            Object.assign(defaultOptions, options);
        }

        toast.add(defaultOptions);
    }

    return {
        ...toast,
        success,
        error,
    }
}
