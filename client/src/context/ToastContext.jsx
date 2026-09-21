import { createContext, useContext, useMemo } from 'react'
import { ToastContainer, toast as toastify, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const value = useMemo(
    () => ({
      toast: (message, options) => toastify(message, options),
      success: (message, options) => toastify.success(message, options),
      error: (message, options) => toastify.error(message, options),
      info: (message, options) => toastify.info(message, options),
      warning: (message, options) => toastify.warning(message, options),
      dismiss: toastify.dismiss,
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3600}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        transition={Slide}
        limit={4}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export default ToastContext
