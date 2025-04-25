import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
      <DialogContent className="bg-background/90 backdrop-blur-lg border border-primary/30 shadow-[0_0_25px_rgba(0,229,255,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">{title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          {/* Animated scanning line */}
          <div className="w-full h-px bg-primary/40 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"
            ></div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 mt-4">
          <Button 
            variant="outline"
            onClick={onClose}
            className="border-primary/30 hover:bg-primary/10 hover:text-white"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NeonDialog;
