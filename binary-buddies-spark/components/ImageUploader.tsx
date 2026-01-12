/**
 * ImageUploader Component
 * Drag-and-drop image upload with preview and base64 conversion
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    value?: string; // base64 string
    onChange: (base64: string | undefined) => void;
    label?: string;
    maxSizeMB?: number;
    className?: string;
}

export default function ImageUploader({
    value,
    onChange,
    label = 'Upload Image',
    maxSizeMB = 10,
    className,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(value ? `data:image/jpeg;base64,${value}` : null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndProcessFile = useCallback(
        async (file: File) => {
            setError(null);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }

            // Validate file size
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSizeMB) {
                setError(`Image too large (${sizeMB.toFixed(2)}MB). Maximum: ${maxSizeMB}MB`);
                return;
            }

            // Read file and convert to base64
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data URL prefix to get pure base64
                const base64 = result.split('base64,')[1];
                setPreview(result);
                onChange(base64);
            };
            reader.onerror = () => {
                setError('Failed to read file');
            };
            reader.readAsDataURL(file);
        },
        [maxSizeMB, onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                validateAndProcessFile(file);
            }
        },
        [validateAndProcessFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                validateAndProcessFile(file);
            }
        },
        [validateAndProcessFile]
    );

    const handleRemove = useCallback(() => {
        setPreview(null);
        setError(null);
        onChange(undefined);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onChange]);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    return (
        <div className={cn('space-y-2', className)}>
            <label className="text-sm font-medium text-foreground">{label}</label>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {preview ? (
                <div className="relative rounded-lg border overflow-hidden bg-muted/30">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        'flex flex-col items-center justify-center gap-2',
                        'h-48 rounded-lg border-2 border-dashed cursor-pointer',
                        'transition-colors duration-200',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                    )}
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {isDragging ? (
                            <ImageIcon className="h-10 w-10 text-primary" />
                        ) : (
                            <Upload className="h-10 w-10" />
                        )}
                        <div className="text-sm text-center">
                            <span className="font-medium text-primary">Click to upload</span>
                            <span> or drag and drop</span>
                        </div>
                        <p className="text-xs">PNG, JPG, WebP up to {maxSizeMB}MB</p>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
