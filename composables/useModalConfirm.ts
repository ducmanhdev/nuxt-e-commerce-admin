export const useModalConfirm = () => {
  const isOpen = useState(() => false)
  const message = useState(() => '')
  const callbackFn = useState<(args?: any) => any | undefined>()

  const handleShow = ({
    message: _message,
    callbackFn: _callbackFn,
  }: {
    message: string
    callbackFn: (args?: any) => any
  }) => {
    message.value = _message || 'Are you absolutely sure?'
    callbackFn.value = _callbackFn
    isOpen.value = true
  }

  const handleHide = () => {
    isOpen.value = false
  }

  const handleConfirm = async () => {
    callbackFn.value?.()
    handleHide()
  }

  return {
    isOpen,
    message,
    handleShow,
    handleHide,
    handleConfirm,
  }
}
