import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface NeonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const NeonDialog: React.FC<NeonDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="neon-dialog-container">
        <DialogHeader className="neon-dialog-header">
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="neon-dialog-content">
          <p className="text-sm text-muted-foreground">
            Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah memeriksa semua detail.
          </p>
        </div>
        
        <DialogFooter className="neon-dialog-footer">
          <button className="neon-button-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="neon-button-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NeonDialog;
