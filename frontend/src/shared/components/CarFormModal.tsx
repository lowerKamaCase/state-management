import {
  Alert,
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import {
  BODY_TYPES,
  type BodyType,
  type Car,
  type CreateCarInput,
  type UpdateCarInput,
} from '../types/car';

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: EMPTY_VALUES,
    validate: {
      brand: (v) => {
        return v.trim().length === 0
          ? 'Required'
          : v.length > 50
            ? 'Max 50 characters'
            : null;
      },
      model: (v) => {
        return v.trim().length === 0
          ? 'Required'
          : v.length > 50
            ? 'Max 50 characters'
            : null;
      },
      color: (v) => {
        return v.trim().length === 0
          ? 'Required'
          : v.length > 30
            ? 'Max 30 characters'
            : null;
      },
      year: (v) => {
        return v < 1900 || v > new Date().getFullYear() + 1
          ? `Must be between 1900 and ${new Date().getFullYear() + 1}`
          : null;
      },
      price: (v) => {
        return v < 0 ? 'Must be non-negative' : null;
      },
      mileage: (v) => {
        return v < 0 ? 'Must be non-negative' : null;
      },
      bodyType: (v) => {
        return v === '' ? 'Required' : null;
      },
    },
  });

  useEffect(() => {
    if (opened) {
      setSubmitError(null);
      form.setValues(
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

  const handleSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await onSubmit({ ...values, bodyType: values.bodyType as BodyType });
      onClose();
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Add car' : 'Edit car'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          {submitError && (
            <Alert color="red" title="Error">
              {submitError}
            </Alert>
          )}
          <TextInput label="Brand" required {...form.getInputProps('brand')} />
          <TextInput label="Model" required {...form.getInputProps('model')} />
          <NumberInput label="Year" required {...form.getInputProps('year')} />
          <NumberInput
            label="Price"
            required
            min={0}
            {...form.getInputProps('price')}
          />
          <NumberInput
            label="Mileage"
            min={0}
            {...form.getInputProps('mileage')}
          />
          <TextInput label="Color" required {...form.getInputProps('color')} />
          <Select
            label="Body type"
            required
            data={BODY_TYPES}
            {...form.getInputProps('bodyType')}
          />
          <Button type="submit" loading={isSubmitting} mt="sm">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
