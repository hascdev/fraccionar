import { useCallback, useState } from "react";

export default function useCopyToClipboard() {

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>("");

  const copyTextToClipboard = useCallback(

    async (text: string) => {

      if ('clipboard' in navigator) {

        try {

          await navigator.clipboard.writeText(text);

          setCopiedText(text);
          setIsCopied(true);

          setTimeout(() => {
            setIsCopied(false);
          }, 1000);

        } catch (error) {
          console.error('Error copying to clipboard', error);
        }

      } else {
        console.warn('Clipboard not supported')
      }

    }, []
  );

  return { copyTextToClipboard, isCopied, copiedText };
}