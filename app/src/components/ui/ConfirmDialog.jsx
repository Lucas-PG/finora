// src/components/ui/ConfirmDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import "../../css/ConfirmDialog.css";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="confirm-dialog">
        <DialogTitle>{title || "Tem certeza?"}</DialogTitle>
        <DialogContent>
          <Typography>
            {message || "Essa ação não poderá ser desfeita."}
          </Typography>
        </DialogContent>
        <DialogActions className="confirm-dialog-btns">
          <Button
            onClick={onClose}
            color="inherit"
            className="secondary-btn confirm-dialog-cancel-btn"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            className="confirm-dialog-delete-btn"
          >
            Confirmar
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
