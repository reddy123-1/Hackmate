import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';
import type { FormField } from '../types';
import toast from 'react-hot-toast';

interface Props {
  fields: FormField[];
  onSubmit: (data: Record<string, unknown>, files: Record<string, File | File[]>) => Promise<void>;
  hackathonName: string;
}

export default function DynamicFormRenderer({ fields, onSubmit, hackathonName }: Props) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [files, setFiles] = useState<Record<string, File | File[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sorted = [...fields].sort((a, b) => a.order - b.order);

  const handleFileChange = (fieldId: string, fileList: FileList | null, multiple?: boolean) => {
    if (!fileList) return;
    if (multiple) {
      setFiles((prev) => ({ ...prev, [fieldId]: Array.from(fileList) }));
    } else {
      setFiles((prev) => ({ ...prev, [fieldId]: fileList[0] }));
    }
    setValue(fieldId, multiple ? Array.from(fileList).map(f => f.name) : fileList[0]?.name);
  };

  const removeFile = (fieldId: string, index?: number) => {
    if (index !== undefined) {
      setFiles((prev) => {
        const arr = prev[fieldId] as File[];
        return { ...prev, [fieldId]: arr.filter((_, i) => i !== index) };
      });
    } else {
      setFiles((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
      setValue(fieldId, undefined);
    }
  };

  const onFormSubmit = async (data: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      await onSubmit(data, files);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-bold dark:text-white text-surface-900 mb-2">Application Submitted!</h2>
        <p className="dark:text-surface-400 text-surface-600">
          Thank you for applying to <span className="text-brand-400 font-medium">{hackathonName}</span>.
          We'll review your application and get back to you soon.
        </p>
      </motion.div>
    );
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];
    const baseClass = 'input-field';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'url':
      case 'portfolio':
      case 'github':
      case 'linkedin':
        return (
          <input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type === 'url' || field.type === 'portfolio' || field.type === 'github' || field.type === 'linkedin' ? 'url' : 'text'}
            placeholder={field.placeholder}
            className={baseClass}
            {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={4}
            className={`${baseClass} resize-none`}
            {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={baseClass}
            {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
          />
        );

      case 'dropdown':
      case 'single-select':
        return (
          <select
            className={baseClass}
            {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-3 p-3 rounded-lg dark:bg-white/[0.02] bg-black/[0.02] dark:hover:bg-white/5 hover:bg-black/5 cursor-pointer transition-all">
                <input
                  type="radio"
                  value={opt}
                  className="accent-brand-500"
                  {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
                />
                <span className="text-sm dark:text-surface-300 text-surface-700">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
      case 'multi-select':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-3 p-3 rounded-lg dark:bg-white/[0.02] bg-black/[0.02] dark:hover:bg-white/5 hover:bg-black/5 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  value={opt}
                  className="accent-brand-500 rounded"
                  {...register(field.id)}
                />
                <span className="text-sm dark:text-surface-300 text-surface-700">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register(field.id)}
              />
              <div className="w-10 h-5 rounded-full bg-surface-600 peer-checked:bg-brand-500 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm dark:text-surface-300 text-surface-700">{field.placeholder || 'Yes'}</span>
          </label>
        );

      case 'resume':
      case 'file-multiple': {
        const isMultiple = field.type === 'file-multiple';
        const currentFiles = files[field.id];
        return (
          <div>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed dark:border-white/10 border-black/10 rounded-xl cursor-pointer dark:hover:border-brand-500/30 hover:border-brand-500/30 transition-colors">
              <Upload className="h-6 w-6 dark:text-surface-500 text-surface-400 mb-2" />
              <span className="text-sm dark:text-surface-400 text-surface-600">
                {isMultiple ? 'Drop files here or click to upload' : 'Drop file here or click to upload'}
              </span>
              <input
                type="file"
                className="hidden"
                multiple={isMultiple}
                accept={field.type === 'resume' ? '.pdf,.doc,.docx' : undefined}
                onChange={(e) => handleFileChange(field.id, e.target.files, isMultiple)}
              />
            </label>
            {currentFiles && (
              <div className="mt-2 space-y-1">
                {Array.isArray(currentFiles) ? currentFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs dark:text-surface-400 text-surface-600">
                    <span className="truncate">{f.name}</span>
                    <button type="button" onClick={() => removeFile(field.id, i)}>
                      <X className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                )) : (
                  <div className="flex items-center gap-2 text-xs dark:text-surface-400 text-surface-600">
                    <span className="truncate">{(currentFiles as File).name}</span>
                    <button type="button" onClick={() => removeFile(field.id)}>
                      <X className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className={baseClass}
            {...register(field.id, { required: field.required ? `${field.label} is required` : false })}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {sorted.map((field, i) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <label className="block mb-1.5">
            <span className="text-sm font-medium dark:text-surface-200 text-surface-800">
              {field.label}
              {field.required && <span className="text-red-400 ml-0.5">*</span>}
            </span>
          </label>
          {field.helpText && (
            <p className="text-xs dark:text-surface-500 text-surface-500 mb-2">{field.helpText}</p>
          )}
          {renderField(field)}
          {errors[field.id] && (
            <p className="text-xs text-red-400 mt-1">{errors[field.id]?.message as string}</p>
          )}
        </motion.div>
      ))}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="btn-primary w-full justify-center py-3 mt-6 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </motion.button>
    </form>
  );
}
