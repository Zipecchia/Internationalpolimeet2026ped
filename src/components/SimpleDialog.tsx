import { useEffect, useRef } from 'react';

interface SimpleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function SimpleDialog({ open, onOpenChange, title, children }: SimpleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Only close if clicking directly on the dialog element (the backdrop area)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/50 bg-white rounded-lg p-0 max-w-lg w-full max-h-[90vh] shadow-lg flex flex-col"
      onClose={handleClose}
    >
      <div 
        className="relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2>{title}</h2>
          <button
            onClick={handleClose}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </dialog>
  );
}