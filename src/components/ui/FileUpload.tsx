import React, { useCallback, useState, useRef } from 'react';
import clsx from 'clsx';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  previewUrl?: string;
  onRemove?: () => void;
  disabled?: boolean;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_PDF_TYPES = ['application/pdf'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_PDF_TYPES];

export function FileUpload({
  accept = '.jpg,.jpeg,.png,.gif,.webp,.pdf',
  maxSize = 5, // 5MB default
  onFileSelect,
  onError,
  label,
  helperText,
  error,
  isUploading = false,
  uploadProgress = 0,
  previewUrl,
  onRemove,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'Invalid file type. Please upload an image (JPG, PNG, GIF, WebP) or PDF.';
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return `File size must be less than ${maxSize}MB.`;
      }

      return null;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      // Set preview for images
      if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFileType('image');
      } else {
        setPreview(null);
        setFileType('pdf');
      }

      setFileName(file.name);
      onFileSelect(file);
    },
    [validateFile, onFileSelect, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile, disabled]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setFileName(null);
    setFileType(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  }, [onRemove]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          {label}
        </label>
      )}

      {/* Upload area or preview */}
      {preview || fileName ? (
        <div
          className={clsx(
            'relative rounded-xl border-2 border-dashed p-4',
            'bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)]'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Preview thumbnail */}
            {fileType === 'image' && preview ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--color-bg-primary)] flex-shrink-0">
                <img
                  src={preview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-[var(--color-primary-600)]" />
              </div>
            )}

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {fileName}
              </p>
              {isUploading ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-bg-hover)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary-600)] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 text-sm text-[var(--color-success-600)]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ready to upload</span>
                </div>
              )}
            </div>

            {/* Remove button */}
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className={clsx(
                  'p-1.5 rounded-lg',
                  'text-[var(--color-text-tertiary)]',
                  'hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-error-600)]',
                  'transition-colors duration-150'
                )}
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            'relative rounded-xl border-2 border-dashed p-8',
            'transition-all duration-200 cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]',
            isDragging
              ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
              : error
              ? 'border-[var(--color-error-400)] bg-[var(--color-error-50)]'
              : 'border-[var(--color-border-secondary)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary-400)] hover:bg-[var(--color-bg-hover)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Upload file"
          aria-describedby={error ? 'upload-error' : 'upload-helper'}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center mb-3',
                isDragging
                  ? 'bg-[var(--color-primary-100)]'
                  : 'bg-[var(--color-bg-hover)]'
              )}
            >
              <Upload
                className={clsx(
                  'w-6 h-6',
                  isDragging
                    ? 'text-[var(--color-primary-600)]'
                    : 'text-[var(--color-text-tertiary)]'
                )}
              />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              or{' '}
              <span className="text-[var(--color-primary-600)] font-medium">
                browse files
              </span>
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
              Supports: JPG, PNG, GIF, WebP, PDF (max {maxSize}MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
        disabled={disabled}
        aria-hidden="true"
      />

      {error && (
        <div
          id="upload-error"
          className="flex items-center gap-1.5 mt-2 text-sm text-[var(--color-error-600)]"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p id="upload-helper" className="mt-2 text-sm text-[var(--color-text-tertiary)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
