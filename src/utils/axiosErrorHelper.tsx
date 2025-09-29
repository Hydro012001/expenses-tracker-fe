import axios from "axios";
import { useAlertStore } from "@/store/alertStore"; // adjust path

export function handleAxiosError(error: unknown) {
  const { showAlert } = useAlertStore.getState();

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.response?.statusText;

    switch (status) {
      case 400:
      case 404:
      case 409:
        showAlert(message, "error", "Failed");
        break;
      default:
        showAlert("Something went wrong!", "error", "Error");
        break;
    }
  } else {
    console.error("Unexpected error:", error);
    showAlert("Unexpected error occurred!", "error", "Error");
  }
}
