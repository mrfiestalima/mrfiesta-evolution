import { createContext, useContext } from "react";
export const ContactContext = createContext("51977783926");
export function useWhatsAppUrl() {
  const phone = useContext(ContactContext);
  return (message: string) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
