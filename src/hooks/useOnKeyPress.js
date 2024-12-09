import { useEffect } from 'react'

export const useOnKeyPress = ({ action, triggerKey = 'Escape' } = {}) => {
  useEffect(() => {
    const handleEscapeKeyPress = ({ key }) => {
      if (key === triggerKey) action()
    }

    document.addEventListener('keydown', handleEscapeKeyPress)

    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress)
    }
  }, [])
}
