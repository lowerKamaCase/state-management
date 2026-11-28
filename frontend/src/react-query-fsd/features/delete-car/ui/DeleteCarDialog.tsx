import { useId } from 'react';
import { useDeleteCar } from '../model/useDeleteCar';
import './delete-car-dialog.css';

interface DeleteCarDialogProps {
  carId: string;
  carName: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCarDialog({
  carId,
  carName,
  onClose,
  onDeleted,
}: DeleteCarDialogProps) {
  const titleId = useId();
  const deletion = useDeleteCar({ onSuccess: onDeleted });

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget && !deletion.isPending) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !deletion.isPending) {
            onClose();
          }
        }}
      >
        <h4 className="modal-title" id={titleId}>
          Delete car?
        </h4>
        <p>Delete {carName}? This action cannot be undone.</p>
        {deletion.error && (
          <div className="alert alert-mb" role="alert">
            {deletion.error}
          </div>
        )}
        <div className="group fsd-delete-actions">
          <button
            type="button"
            className="btn btn-default"
            onClick={onClose}
            disabled={deletion.isPending}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn fsd-delete-button"
            onClick={() => {
              deletion.deleteCar(carId);
            }}
            disabled={deletion.isPending}
          >
            {deletion.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
