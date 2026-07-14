import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import type { FormField, FormFieldType } from '../types';

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'portfolio', label: 'Portfolio Link' },
  { value: 'github', label: 'GitHub Link' },
  { value: 'linkedin', label: 'LinkedIn Link' },
  { value: 'resume', label: 'Resume Upload' },
  { value: 'file-multiple', label: 'Multiple File Upload' },
  { value: 'single-select', label: 'Single Select' },
  { value: 'multi-select', label: 'Multi Select' },
  { value: 'boolean', label: 'Boolean Switch' },
];

const HAS_OPTIONS: FormFieldType[] = ['dropdown', 'radio', 'checkbox', 'single-select', 'multi-select'];

interface Props {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export default function FormBuilder({ fields, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      helpText: '',
      options: [],
      order: fields.length,
    };
    onChange([...fields, newField]);
    setExpanded(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })));
  };

  const addOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      updateField(fieldId, { options: [...(field.options || []), ''] });
    }
  };

  const updateOption = (fieldId: string, index: number, value: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const opts = [...(field.options || [])];
      opts[index] = value;
      updateField(fieldId, { options: opts });
    }
  };

  const removeOption = (fieldId: string, index: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      updateField(fieldId, { options: (field.options || []).filter((_, i) => i !== index) });
    }
  };

  const handleReorder = (newOrder: FormField[]) => {
    onChange(newOrder.map((f, i) => ({ ...f, order: i })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold dark:text-white text-surface-900">Application Form Fields</h3>
        <button type="button" onClick={addField} className="btn-secondary !py-1.5 !px-3 !text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Field
        </button>
      </div>

      <Reorder.Group axis="y" values={fields} onReorder={handleReorder} className="space-y-2">
        <AnimatePresence>
          {fields.map((field) => (
            <Reorder.Item
              key={field.id}
              value={field}
              className="glass-card rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="h-4 w-4 dark:text-surface-600 text-surface-400 cursor-grab shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium dark:text-surface-200 text-surface-800 truncate">
                    {field.label || 'Untitled Field'}
                  </span>
                  <span className="ml-2 text-[10px] dark:text-surface-500 text-surface-500 uppercase">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {field.required && (
                    <span className="text-[10px] text-red-400 font-medium">Required</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === field.id ? null : field.id)}
                    className="p-1 rounded dark:hover:bg-white/5 hover:bg-black/5"
                  >
                    {expanded === field.id ? (
                      <ChevronUp className="h-4 w-4 dark:text-surface-400 text-surface-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 dark:text-surface-400 text-surface-600" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="p-1 rounded hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {expanded === field.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 space-y-3 border-t dark:border-white/5 border-black/5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs dark:text-surface-400 text-surface-600 mb-1 block">Label</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="input-field !text-sm"
                            placeholder="Field label"
                          />
                        </div>
                        <div>
                          <label className="text-xs dark:text-surface-400 text-surface-600 mb-1 block">Type</label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as FormFieldType })}
                            className="input-field !text-sm"
                          >
                            {FIELD_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs dark:text-surface-400 text-surface-600 mb-1 block">Placeholder</label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            className="input-field !text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs dark:text-surface-400 text-surface-600 mb-1 block">Help Text</label>
                          <input
                            type="text"
                            value={field.helpText || ''}
                            onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                            className="input-field !text-sm"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="accent-brand-500 rounded"
                        />
                        <span className="text-sm dark:text-surface-300 text-surface-700">Required field</span>
                      </label>

                      {/* Options */}
                      {HAS_OPTIONS.includes(field.type) && (
                        <div>
                          <label className="text-xs dark:text-surface-400 text-surface-600 mb-2 block">Options</label>
                          <div className="space-y-2">
                            {(field.options || []).map((opt, i) => (
                              <div key={i} className="flex gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => updateOption(field.id, i, e.target.value)}
                                  className="input-field !text-sm flex-1"
                                  placeholder={`Option ${i + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(field.id, i)}
                                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(field.id)}
                              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                            >
                              + Add Option
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {fields.length === 0 && (
        <div className="text-center py-8 dark:text-surface-500 text-surface-500 text-sm">
          No fields added yet. Click "Add Field" to start building your form.
        </div>
      )}
    </div>
  );
}
