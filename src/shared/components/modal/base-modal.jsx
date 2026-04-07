import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />

        <Dialog.Content className="modal-content">
          <div className="modal-header">
            <div>
              <Dialog.Title className="modal-title">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="modal-description">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="icon-button"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="modal-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
