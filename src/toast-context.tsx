import { Toast } from "primereact/toast";
import { createContext, ReactNode, useContext, useRef } from "react";

interface ToastContextType {
  showErrorToast: (msg: string) => void;
  showInfoToast: (msg: string) => void;
  showSuccessToast: (msg: string) => void;
  showWarningToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ToastContextProvider = ({ children }: Props) => {
  const msgs = useRef<Toast>(null);

  const showToast = (severity: "success" | "info" | "warn" | "error", summary: string, msg: string) => {
    msgs.current?.show({
      severity,
      summary,
      detail: msg,
    });
  };

  return (
    <ToastContext.Provider
      value={{
        showErrorToast: (msg) => showToast("error", "Error", msg),
        showInfoToast: (msg) => showToast("info", "Info", msg),
        showSuccessToast: (msg) => showToast("success", "Success", msg),
        showWarningToast: (msg) => showToast("warn", "Warning", msg),
      }}
    >
      <Toast ref={msgs} />
      <div>{children}</div>
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToastContext have to be used within ToastContextProvider"
    );
  }

  return context;
};

