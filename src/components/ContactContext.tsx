import { whatsappUrl } from "../lib/whatsapp";
import { createContext, useContext } from "react";
export const ContactContext = createContext("51977783926");
export function useWhatsAppUrl() {
  const phone = useContext(ContactContext);
  return (message: string) => whatsappUrl(message, phone);
}
