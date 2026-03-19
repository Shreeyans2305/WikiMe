import React, { useState, useRef } from 'react';
import './ImageUploader.css';

/**
 * ImageUploader
 * Props:
 *   value       — current imageUrl (URL string or base64 data URI)
 *   caption     — current imageCaption string
 *   onChange    — ({ imageUrl, imageCaption }) => void
 */
export default function ImageUploader({ value, caption, onChange }) {
  const [tab, setTab] = useState(value?.startsWith('data:') ? 'upload' : 'url');
  const [urlInput, setUrlInput] = useState(value?.startsWith('data:') ? '' : (value || ''));
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const emit = (imageUrl, imageCaption = caption) => onChange({ imageUrl, imageCaption });

  // ── URL tab ──────────────────────────────────────────────────────────────────
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    setError('');
    emit(val);
  };

  // ── Upload tab ───────────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5 MB.'); return; }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => emit(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setUrlInput('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
    emit('');
  };

  // Current preview source
  const preview = value || null;

  return (
    <div className="iu-root">
      <label className="cw-label">Photo</label>

      {/* Tab switcher */}
      <div className="iu-tabs">
        <button
          className={`iu-tab ${tab === 'url' ? 'iu-tab-active' : ''}`}
          onClick={() => setTab('url')}
          type="button"
        >
          Link (URL)
        </button>
        <button
          className={`iu-tab ${tab === 'upload' ? 'iu-tab-active' : ''}`}
          onClick={() => setTab('upload')}
          type="button"
        >
          Upload file
        </button>
      </div>

      {/* URL input */}
      {tab === 'url' && (
        <input
          className="cw-input"
          type="url"
          placeholder="https://upload.wikimedia.org/…"
          value={urlInput}
          onChange={handleUrlChange}
        />
      )}

      {/* File upload / drop zone */}
      {tab === 'upload' && (
        <div
          className={`iu-dropzone ${dragOver ? 'iu-dropzone-over' : ''} ${preview && preview.startsWith('data:') ? 'iu-dropzone-has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {preview && preview.startsWith('data:') ? (
            <span className="iu-dropzone-filename">✓ Image uploaded</span>
          ) : (
            <>
              <span className="iu-dropzone-icon">↑</span>
              <span className="iu-dropzone-label">Drop image here or <u>browse</u></span>
              <span className="iu-dropzone-hint">JPG, PNG, GIF, WebP · max 5 MB</span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      )}

      {error && <p className="cw-error">{error}</p>}

      {/* Preview + caption */}
      {preview && (
        <div className="iu-preview-row">
          <img src={preview} alt="Preview" className="iu-preview-img" />
          <div className="iu-preview-right">
            <input
              className="cw-input iu-caption-input"
              type="text"
              placeholder="Caption (optional)"
              value={caption || ''}
              onChange={(e) => onChange({ imageUrl: value, imageCaption: e.target.value })}
            />
            <button className="iu-clear-btn" onClick={handleClear} type="button">
              Remove photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}