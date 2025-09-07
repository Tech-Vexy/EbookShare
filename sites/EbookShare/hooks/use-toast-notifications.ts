import { toast } from "sonner"

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

export const useToastNotifications = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    })
  }

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
    })
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    })
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    })
  }

  const showLoading = (message: string) => {
    return toast.loading(message)
  }

  const dismiss = (toastId: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  }
}

// Pre-configured toast messages for common actions
export const toastMessages = {
  auth: {
    loginSuccess: "Welcome back! You've been successfully logged in.",
    loginError: "Login failed. Please check your credentials.",
    logoutSuccess: "You've been successfully logged out.",
    registerSuccess: "Account created successfully! Welcome to EbookShare.",
    registerError: "Registration failed. Please try again.",
  },
  ebook: {
    uploadSuccess: "Your ebook has been uploaded successfully!",
    uploadError: "Failed to upload ebook. Please try again.",
    downloadSuccess: "Ebook download started successfully.",
    downloadError: "Failed to download ebook. Please try again.",
    deleteSuccess: "Ebook deleted successfully.",
    deleteError: "Failed to delete ebook.",
    favoriteAdded: "Book added to your favorites!",
    favoriteRemoved: "Book removed from your favorites.",
  },
  general: {
    networkError: "Network error. Please check your connection.",
    serverError: "Server error. Please try again later.",
    copySuccess: "Copied to clipboard!",
    saveSuccess: "Changes saved successfully!",
    saveError: "Failed to save changes.",
  },
}
