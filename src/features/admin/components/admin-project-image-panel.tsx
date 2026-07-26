import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ImagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { cn } from '@/lib/utils';
import { AdminFormField } from './admin-form-field';

interface AdminProjectImagePanelProps {
  copy: PortfolioDictionary['admin']['projectEditor'];
  publishedLabel: string;
  draftLabel: string;
  featuredLabel: string;
  previewImageUrl: string | null;
  previewImageAlt: string;
  selectedFile: File | null;
  fileError: string | null;
  published: boolean;
  featured: boolean;
  liveUrl: string;
  isEditing: boolean;
  uploading: boolean;
  usesUploadedImage: boolean;
  onSelectedFileChange: (file: File | null) => void;
  onUploadImage: () => void;
  onRemoveUploadedImage: () => void;
}

export function AdminProjectImagePanel({
  copy,
  publishedLabel,
  draftLabel,
  featuredLabel,
  previewImageUrl,
  previewImageAlt,
  selectedFile,
  fileError,
  published,
  featured,
  liveUrl,
  isEditing,
  uploading,
  usesUploadedImage,
  onSelectedFileChange,
  onUploadImage,
  onRemoveUploadedImage,
}: AdminProjectImagePanelProps) {
  return (
    <div className="page-enter grid gap-6">
      <Card variant="solid" className="overflow-hidden">
        <CardHeader>
          <CardTitle>{copy.imageTitle}</CardTitle>
          <CardDescription>{copy.imageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={previewImageAlt}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                {copy.noImageUploaded}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {published ? (
              <Badge variant="success">{publishedLabel}</Badge>
            ) : (
              <Badge variant="warning">{draftLabel}</Badge>
            )}
            {featured ? <Badge variant="featured">{featuredLabel}</Badge> : null}
            {selectedFile ? (
              <Badge variant="outline">{copy.pendingUploadBadge}</Badge>
            ) : usesUploadedImage ? (
              <Badge variant="outline">{copy.uploadedImageBadge}</Badge>
            ) : null}
          </div>

          <AdminFormField
            label={copy.uploadFieldLabel}
            error={fileError ?? undefined}
            description={copy.uploadFieldDescription}
          >
            <label
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-4 text-sm font-medium transition-colors',
                isEditing
                  ? 'cursor-pointer bg-secondary text-foreground hover:bg-muted'
                  : 'cursor-not-allowed bg-secondary/70 text-muted-foreground'
              )}
            >
              <ImagePlus className="size-4" />
              {selectedFile ? selectedFile.name : copy.chooseImageAction}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="sr-only"
                disabled={!isEditing || uploading}
                onChange={(event) => onSelectedFileChange(event.target.files?.[0] ?? null)}
              />
            </label>
          </AdminFormField>

          {isEditing ? (
            <div className="grid gap-2">
              <Button type="button" disabled={!selectedFile || uploading} onClick={onUploadImage}>
                {uploading ? copy.uploadingImageAction : copy.uploadImageAction}
              </Button>
              {selectedFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={uploading}
                  onClick={() => onSelectedFileChange(null)}
                >
                  {copy.clearSelectionAction}
                </Button>
              ) : null}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{copy.createFirstHint}</p>
          )}

          {usesUploadedImage ? (
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={onRemoveUploadedImage}
            >
              {copy.removeUploadedImageAction}
            </Button>
          ) : null}

          {liveUrl ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                {copy.openLiveUrlAction}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
