import { useEffect, useId, useState } from 'react';
import {
  BODY_TYPES,
  type BodyType,
  type Car,
  type CreateCarInput,
  type UpdateCarInput,
} from '../model/types';

interface FormValues {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  bodyType: BodyType | '';
}

const EMPTY_VALUES: FormValues = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  color: '',
  bodyType: '',
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.brand.trim().length === 0) {
    errors.brand = 'Required';
  } else if (values.brand.length > 50) {
    errors.brand = 'Max 50 characters';
  }
  if (values.model.trim().length === 0) {
    errors.model = 'Required';
  } else if (values.model.length > 50) {
    errors.model = 'Max 50 characters';
  }
  if (values.color.trim().length === 0) {
    errors.color = 'Required';
  } else if (values.color.length > 30) {
    errors.color = 'Max 30 characters';
  }
  const maxYear = new Date().getFullYear() + 1;
  if (values.year < 1900 || values.year > maxYear) {
    errors.year = `Must be between 1900 and ${maxYear}`;
  }
  if (values.price < 0) {
    errors.price = 'Must be non-negative';
  }
  if (values.mileage < 0) {
    errors.mileage = 'Must be non-negative';
  }
  if (values.bodyType === '') {
    errors.bodyType = 'Required';
  }
  return errors;
}

interface CarFormModalProps {
  opened: boolean;
  mode: 'create' | 'edit';
  initialValues?: Car;
  onClose: () => void;
  onSubmit: (values: CreateCarInput | UpdateCarInput) => Promise<void>;
  isSubmitting: boolean;
}

export function CarFormModal({
  opened,
  mode,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
}: CarFormModalProps) {
  const uid = useId();
  const fieldId = (name: string) => {
    return `${uid}-${name}`;
  };
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (opened) {
      setSubmitError(null);
      setErrors({});
      setValues(
        mode === 'edit' && initialValues
          ? {
              brand: initialValues.brand,
              model: initialValues.model,
              year: initialValues.year,
              price: initialValues.price,
              mileage: initialValues.mileage,
              color: initialValues.color,
              bodyType: initialValues.bodyType,
            }
          : EMPTY_VALUES,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, mode, initialValues]);

  if (!opened) {
    return null;
  }

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setSubmitError(null);
    try {
      await onSubmit({ ...values, bodyType: values.bodyType as BodyType });
      onClose();
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={fieldId('title')}
      >
        <h4 className="modal-title" id={fieldId('title')}>
          {mode === 'create' ? 'Add car' : 'Edit car'}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="stack">
            {submitError && (
              <div className="alert">
                <div className="alert-title">Error</div>
                {submitError}
              </div>
            )}
            <div className="field">
              <label htmlFor={fieldId('brand')}>Brand *</label>
              <input
                id={fieldId('brand')}
                value={values.brand}
                onChange={(e) => {
                  setField('brand', e.currentTarget.value);
                }}
              />
              {errors.brand && <span className="error">{errors.brand}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('model')}>Model *</label>
              <input
                id={fieldId('model')}
                value={values.model}
                onChange={(e) => {
                  setField('model', e.currentTarget.value);
                }}
              />
              {errors.model && <span className="error">{errors.model}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('year')}>Year *</label>
              <input
                id={fieldId('year')}
                type="number"
                value={values.year}
                onChange={(e) => {
                  setField('year', Number(e.currentTarget.value));
                }}
              />
              {errors.year && <span className="error">{errors.year}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('price')}>Price *</label>
              <input
                id={fieldId('price')}
                type="number"
                min={0}
                value={values.price}
                onChange={(e) => {
                  setField('price', Number(e.currentTarget.value));
                }}
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('mileage')}>Mileage</label>
              <input
                id={fieldId('mileage')}
                type="number"
                min={0}
                value={values.mileage}
                onChange={(e) => {
                  setField('mileage', Number(e.currentTarget.value));
                }}
              />
              {errors.mileage && (
                <span className="error">{errors.mileage}</span>
              )}
            </div>
            <div className="field">
              <label htmlFor={fieldId('color')}>Color *</label>
              <input
                id={fieldId('color')}
                value={values.color}
                onChange={(e) => {
                  setField('color', e.currentTarget.value);
                }}
              />
              {errors.color && <span className="error">{errors.color}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('bodyType')}>Body type *</label>
              <select
                id={fieldId('bodyType')}
                value={values.bodyType}
                onChange={(e) => {
                  setField('bodyType', e.currentTarget.value as BodyType | '');
                }}
              >
                <option value="">Select…</option>
                {BODY_TYPES.map((t) => {
                  return (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  );
                })}
              </select>
              {errors.bodyType && (
                <span className="error">{errors.bodyType}</span>
              )}
            </div>
            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              style={{ marginTop: 8 }}
            >
              {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
