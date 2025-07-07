import { Dispatch, SetStateAction } from "react";

export function useHandleStopResponse(
  abortController: AbortController | null,
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
) {
  const handleStopResponse = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  return { handleStopResponse };
}
