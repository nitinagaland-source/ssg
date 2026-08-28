import React, { useRef, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'misc', label = 'Image', className = '' }: ImageUploadProps) {
  const { token } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!token) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${BASE}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-4 text-center hover:border-[#0A0A0A] transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="relative">
            <img src={value} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg mx-auto" />
            <div className="mt-2 text-xs text-[#6B6B6B]">Click to change</div>
          </div>
        ) : (
          <div className="py-2">
            <div className="text-2xl mb-1">📁</div>
            <div className="text-xs font-medium text-[#0A0A0A]">
              {uploading ? 'Uploading...' : 'Click or drag image here'}
            </div>
            <div className="text-xs text-[#6B6B6B] mt-0.5">JPG, PNG, WebP up to 10MB</div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// Multi-image upload for products
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}

export function MultiImageUpload({ values, onChange, folder = 'products', label = 'Images' }: MultiImageUploadProps) {
  const { token } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList) => {
    if (!token || !files.length) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      formData.append('folder', folder);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/upload/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange([...values, ...data.map((d: any) => d.url)]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.filter(Boolean).map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-[#E0E0E0]" />
            <button
              onClick={() => removeImage(i)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >✕</button>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 border-2 border-dashed border-[#E0E0E0] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0A0A0A] transition-colors"
        >
          <span className="text-xl">{uploading ? '⏳' : '+'}</span>
          <span className="text-xs text-[#6B6B6B]">{uploading ? 'Uploading' : 'Add'}</span>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}
