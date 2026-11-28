import { useId, useState, type FormEvent } from 'react';
import {
  usePreparationTasks,
  type PreparationTask,
} from '../../../entities/preparation-task';
import { useAddPreparationTask } from '../../../features/add-preparation-task';
import { useSetPreparationTaskStatus } from '../../../features/set-preparation-task-status';

interface PreparationDialogProps {
  carId: string;
  carName: string;
  onClose: () => void;
  onChanged: () => void;
}

export function PreparationDialog({
  carId,
  carName,
  onClose,
  onChanged,
}: PreparationDialogProps) {
  const titleId = useId();
  const inputId = useId();
  const list = usePreparationTasks(carId);
  const [title, setTitle] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const refresh = () => {
    void list.refetch();
    onChanged();
  };

  const add = useAddPreparationTask({
    onSuccess: () => {
      setTitle('');
      refresh();
    },
  });
  const status = useSetPreparationTaskStatus({ onSuccess: refresh });
  const isMutating = add.isPending || status.isPending;

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 100) {
      setValidationError('Task title must contain 1–100 characters.');
      return;
    }
    setValidationError(null);
    add.addTask({ carId, title: trimmed });
  };

  const toggleStatus = (task: PreparationTask) => {
    status.setStatus({
      carId,
      taskId: task.id,
      status: task.status === 'DONE' ? 'OPEN' : 'DONE',
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isMutating) {
          onClose();
        }
      }}
    >
      <div
        className="modal fsd-preparation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="group-between">
          <h4 className="modal-title" id={titleId}>
            Preparation: {carName}
          </h4>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            disabled={isMutating}
            aria-label="Close preparation tasks"
          >
            ✕
          </button>
        </div>
        {list.error && <div className="alert alert-mb">{list.error}</div>}
        {validationError && (
          <div className="alert alert-mb" role="alert">
            {validationError}
          </div>
        )}
        {add.error && (
          <div className="alert alert-mb" role="alert">
            {add.error}
          </div>
        )}
        {status.error && (
          <div className="alert alert-mb" role="alert">
            {status.error}
          </div>
        )}
        {list.isLoading ? (
          <p>Loading tasks…</p>
        ) : (
          <ul className="fsd-task-list">
            {list.tasks.map((task) => {
              return (
                <li key={task.id}>
                  <label
                    className={
                      task.status === 'DONE' ? 'fsd-task-done' : undefined
                    }
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'DONE'}
                      disabled={status.isPending}
                      onChange={() => {
                        toggleStatus(task);
                      }}
                    />
                    <span>{task.title}</span>
                  </label>
                </li>
              );
            })}
            {list.tasks.length === 0 && (
              <li className="text-dim">No preparation tasks yet.</li>
            )}
          </ul>
        )}
        <form className="group fsd-task-form" onSubmit={handleAdd}>
          <div className="field fsd-task-field">
            <label htmlFor={inputId}>New task</label>
            <input
              id={inputId}
              value={title}
              maxLength={100}
              onChange={(event) => {
                setTitle(event.currentTarget.value);
              }}
              placeholder="Take photos"
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={add.isPending || !title.trim()}
          >
            {add.isPending ? 'Adding…' : 'Add task'}
          </button>
        </form>
      </div>
    </div>
  );
}
