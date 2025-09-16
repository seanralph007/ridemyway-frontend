import Swal from "sweetalert2";
import "../pages/Dashboard.css";

/**
 * Success notification
 */
export const notifySuccess = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    color: "#252525",
    customClass: {
      popup: "swal-popup",
      icon: "swal-icon",
    },
  });
};

/**
 * Error notification
 */
export const notifyError = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    color: "#252525",
    customClass: {
      popup: "swal-popup",
    },
  });
};

/**
 * Info/neutral notification
 */
export const notifyInfo = (title, text = "") => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#292727",
    color: "#252525",
    customClass: {
      popup: "swal-popup",
    },
  });
};

/**
 * Confirmation dialog
 */
export const confirmAction = async (
  title,
  text,
  confirmButtonText = "Yes",
  confirmButtonColor = "#d33"
) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: "#292727",
    confirmButtonText,
    cancelButtonText: "No",
  });
};
