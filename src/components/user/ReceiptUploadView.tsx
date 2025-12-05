import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import type { Locker } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, Button, FileUpload, Badge } from '@/components/ui';
import { getLockerStatusBadgeVariant, formatStatus } from '@/components/ui/Badge';

interface ReceiptUploadViewProps {
  locker: Locker;
  onUpload: (file: File) => Promise<void>;
  onBack: () => void;
  isUploading: boolean;
  uploadProgress: number;
  uploadError?: string;
}

export function ReceiptUploadView({
  locker,
  onUpload,
  onBack,
  isUploading,
  uploadProgress,
  uploadError,
}: ReceiptUploadViewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | undefined>(uploadError);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setLocalError(undefined);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile);
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle as="h2">Upload Payment Receipt</CardTitle>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Upload your official receipt to complete the reservation
        </p>
      </CardHeader>

      <CardContent>
        {/* Locker info summary */}
        <div className="p-4 mb-6 bg-[var(--color-bg-tertiary)] rounded-lg">
          <h3 className="text-sm font-medium text-[var(--color-text-tertiary)] mb-2">
            Selected Locker
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">
                Locker {locker.number}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] capitalize">
                Size: {locker.size}
              </p>
            </div>
            <Badge variant={getLockerStatusBadgeVariant(locker.status)}>
              {formatStatus(locker.status)}
            </Badge>
          </div>
        </div>

        {/* Payment instructions */}
        <div className="mb-6 p-4 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-lg">
          <h3 className="font-medium text-[var(--color-primary-800)] mb-2">
            Payment Instructions
          </h3>
          <ol className="text-sm text-[var(--color-primary-700)] space-y-1 list-decimal list-inside">
            <li>Pay the reservation fee at the Cashier's Office</li>
            <li>Keep your Official Receipt (OR)</li>
            <li>Take a clear photo or scan of your receipt</li>
            <li>Upload the image below</li>
          </ol>
        </div>

        {/* File upload */}
        <FileUpload
          label="Receipt Image"
          helperText="Upload a clear image of your official receipt"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSize={5}
          onFileSelect={handleFileSelect}
          onError={setLocalError}
          error={localError}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onRemove={() => {
            setSelectedFile(null);
            setLocalError(undefined);
          }}
        />

        {uploadError && (
          <div className="mt-4 p-3 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-[var(--color-error-600)] flex-shrink-0" />
            <p className="text-sm text-[var(--color-error-700)]">{uploadError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--color-border-primary)]">
          <Button variant="ghost" onClick={onBack} disabled={isUploading}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {isUploading ? 'Uploading...' : 'Submit Reservation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
