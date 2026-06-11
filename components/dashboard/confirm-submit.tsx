"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

/** Bouton de soumission avec confirmation native (pour les actions destructives). */
export function ConfirmSubmit({
  message = "Confirmer cette action ?",
  children,
  ...props
}: ButtonProps & { message?: string }) {
  return (
    <Button
      type="submit"
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
