export const useModalConfirm = () => {
  const isOpen = useState('modalConfirm.isOpen', () => false)
  const message = useState('modalConfirm.message', () => '')
  const onConfirm = useState<(() => void | Promise<void>) | undefined>('modalConfirm.onConfirm', () => undefined)
  const onCancel = useState<(() => void | Promise<void>) | undefined>('modalConfirm.onCancel', () => undefined)
  const isConfirmLoading = useState<boolean>('modalConfirm.isConfirmLoading', () => false)
  const isCancelLoading = useState<boolean>('modalConfirm.isCancelLoading', () => false)

  const showModal = ({
    message: _message = 'Are you absolutely sure to do this?',
    onConfirm: _onConfirm,
    onCancel: _onCancel,
  }: {
    message: string
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void | Promise<void>
  }) => {
    message.value = _message
    onConfirm.value = _onConfirm
    onCancel.value = _onCancel
    isOpen.value = true
    isConfirmLoading.value = false
    isCancelLoading.value = false
  }

  const handleAction = async (action: (() => void | Promise<void>) | undefined, isLoading: Ref<boolean>) => {
    try {
      isLoading.value = true
      if (action) {
        await action()
      }
    } catch (err) {
      console.error(`Error during action:`, err)
    } finally {
      isLoading.value = false
      isOpen.value = false
    }
  }

  const confirm = () => handleAction(onConfirm.value, isConfirmLoading)
  const cancel = () => handleAction(onCancel.value, isCancelLoading)

  return {
    showModal,
    isOpen,
    message,
    confirm,
    cancel,
    isConfirmLoading,
    isCancelLoading,
  }
}
