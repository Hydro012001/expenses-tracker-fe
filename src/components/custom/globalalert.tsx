import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAlertStore } from "@/store/alertStore";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

export function GlobalAlert() {
  const { message, title, type, visible, hideAlert } = useAlertStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, hideAlert]);

  if (!visible) return null;

  const icons = {
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <div
      className={`fixed bottom-4 right-4 w-[320px] z-[60] transition-all duration-300 ease-in-out transform 
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
    >
      <Alert
        className="shadow-lg relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800"
        variant={type === "error" ? "destructive" : "default"}
      >
        {icons[type]}
        {title && (
          <AlertTitle className="text-gray-900 dark:text-gray-100">
            {title}
          </AlertTitle>
        )}
        <AlertDescription className="text-gray-700 dark:text-gray-300">
          {message.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </AlertDescription>
        <button
          className="absolute top-2 right-2 text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
          onClick={hideAlert}
        >
          ✕
        </button>
      </Alert>
    </div>
  );
}
