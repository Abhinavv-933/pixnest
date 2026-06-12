import { useState, useRef } from 'react';
import api from '../api/axios';

export default function ImageUploadModal({ currentFolder, onClose, onUploaded }) {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Prefill name if empty
      if (!name) {
        const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
        setName(baseName);
      }
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image first.');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('folderId', currentFolder ? currentFolder._id : '');
      formData.append('image', file);
      
      await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploaded();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please check file size and formats.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={styles.modalCard}>
        <div style={styles.header}>
          <h3 style={styles.title}>Upload Asset</h3>
          <button style={styles.closeIconBtn} onClick={onClose}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* File Picker Zone */}
          <div 
            style={styles.dropzone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={e => handleFileChange(e.target.files?.[0])}
              disabled={loading}
            />
            
            {previewUrl ? (
              <div style={styles.previewContainer}>
                <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                <div style={styles.previewOverlay}>
                  <span style={styles.previewText}>Click to change image</span>
                </div>
              </div>
            ) : (
              <div style={styles.dropzoneContent}>
                <svg style={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style={styles.dropzoneText}>Drag & drop your image or <span style={styles.browseText}>browse</span></p>
                <p style={styles.dropzoneSub}>PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Asset Name</label>
            <input
              style={styles.input}
              placeholder="Give this creative asset a name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Uploading vault...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalCard: {
    maxWidth: '440px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '20px',
    fontWeight: '700',
    color: '#f0f0ff',
  },
  closeIconBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b6b8a',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  error: {
    background: 'rgba(255, 107, 157, 0.1)',
    border: '1px solid rgba(255, 107, 157, 0.2)',
    color: '#ff6b9d',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  dropzone: {
    border: '2px dashed #1e1e35',
    borderRadius: '12px',
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: 'rgba(8, 8, 16, 0.3)',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    position: 'relative',
  },
  dropzoneContent: {
    textAlign: 'center',
    padding: '20px',
  },
  uploadIcon: {
    width: '32px',
    height: '32px',
    color: '#6b6b8a',
    marginBottom: '8px',
  },
  dropzoneText: {
    fontSize: '14px',
    color: '#f0f0ff',
    fontWeight: '500',
    marginBottom: '4px',
  },
  browseText: {
    color: '#ff6b9d',
    textDecoration: 'underline',
  },
  dropzoneSub: {
    fontSize: '11px',
    color: '#6b6b8a',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(8, 8, 16, 0.6)',
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  previewText: {
    color: '#f0f0ff',
    fontSize: '13px',
    fontWeight: '600',
    background: '#12121f',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #1e1e35',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#6b6b8a',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #1e1e35',
    background: 'rgba(8, 8, 16, 0.5)',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
};
// Add custom hover styles for dropzone in stylesheet via DOM injection logic
if (typeof document !== 'undefined') {
  const dropzoneStyle = document.createElement('style');
  dropzoneStyle.innerHTML = `
    .modal-content .dropzone:hover {
      border-color: #ff6b9d !important;
      background: rgba(255, 107, 157, 0.03) !important;
    }
    .modal-content .previewContainer:hover .previewOverlay {
      opacity: 1;
    }
  `;
  document.head.appendChild(dropzoneStyle);
}