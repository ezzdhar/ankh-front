import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

/**
 * Maps backend validation errors (e.g. Laravel 422 errors object) to React Hook Form field errors.
 */
export function handleFormServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const errors = axiosError?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    Object.entries(errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : (messages as string);
      if (message) {
        setError(field as Path<T>, {
          type: "server",
          message,
        });
      }
    });
  }
}
