import { useState, useEffect } from 'react';
import api from '../api/axios';
import ImageUploadModal from './ImageUploadModal';
import CreateFolderModal from './CreateFolderModal';

export default function FolderView({ currentFolder, onNavigate }) {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [folderSizes, setFolderSizes] = useState({});
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const foldersRes = await api.get('/folders', {
        params: { parentId: currentFolder?._id || '' }
      });
      setFolders(foldersRes.data);

      const imagesRes = await api.get('/images', {
        params: { folderId: currentFolder?._id || '' }
      });
      setImages(imagesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderSizes = async (folderList) => {
    const sizes = {};
    await Promise.all(folderList.map(async (f) => {
      try {
        const res = await api.get(`/folders/${f._id}/size`);
        sizes[f._id] = res.data.size;
      } catch (e) {
        sizes[f._id] = 0;
      }
    }));
    setFolderSizes(prev => ({ ...prev, ...sizes }));
  };

  useEffect(() => {
    fetchData();
  }, [currentFolder]);

  useEffect(() => {
    if (folders.length > 0) {
      fetchFolderSizes(folders);
    }
  }, [folders]);

  const handleDeleteFolder = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this folder? Nested items will remain intact in other scopes.')) {
      try {
        await api.delete(`/folders/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete folder');
      }
    }
  };

  const handleDeleteImage = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/images/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete image');
      }
    }
  };

  const formatSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'Calculating...';
    if (bytes === 0) return '0 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={styles.container}>
      {/* Top Bar with actions */}
      <div style={styles.topBar}>
        <div style={styles.infoCol}>
          <h2 style={styles.title}>{currentFolder ? currentFolder.name : 'All Assets'}</h2>
          <p style={styles.subtitle}>
            {folders.length} {folders.length === 1 ? 'folder' : 'folders'} • {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
        
        <div style={styles.actions}>
          <button style={styles.newFolderBtn} onClick={() => setShowCreateFolder(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            New Folder
          </button>
          
          <button style={styles.uploadImageBtn} onClick={() => setShowUploadImage(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Upload Image
          </button>
        </div>
      </div>

      {loading && folders.length === 0 && images.length === 0 ? (
        <div style={styles.loaderContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loaderText}>Loading vault contents...</p>
        </div>
      ) : (
        <>
          {/* Folders Section */}
          {folders.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Folders</h3>
              <div style={styles.grid}>
                {folders.map(folder => (
                  <div key={folder._id} className="folder-card" style={styles.folderCard} onClick={() => onNavigate(folder)}>
                    <div style={styles.folderHeader}>
                      <div style={styles.folderIconContainer}>
                        <svg style={styles.folderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <button className="delete-btn" style={styles.deleteBtn} onClick={(e) => handleDeleteFolder(e, folder._id)} title="Delete folder">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p style={styles.folderName}>{folder.name}</p>
                    <p style={styles.folderSize}>{formatSize(folderSizes[folder._id])}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Images</h3>
              <div style={styles.imageGrid}>
                {images.map(image => (
                  <div key={image._id} className="image-card" style={styles.imageCard}>
                    <div style={styles.imageWrapper}>
                      <img src={image.url} alt={image.name} className="image" style={styles.image} />
                      <div className="image-overlay" style={styles.imageOverlay}>
                        <button className="image-delete-btn" style={styles.imageDeleteBtn} onClick={(e) => handleDeleteImage(e, image._id)} title="Delete image">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={styles.imageDetails}>
                      <p style={styles.imageName} title={image.name}>{image.name}</p>
                      <p style={styles.imageSize}>{formatSize(image.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {folders.length === 0 && images.length === 0 && (
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>This vault is empty</h3>
              <p style={styles.emptyDesc}>Get started by creating a folder or uploading assets directly here.</p>
              <div style={styles.emptyActions}>
                <button style={styles.newFolderBtn} onClick={() => setShowCreateFolder(true)}>
                  Create Folder
                </button>
                <button style={styles.uploadImageBtn} onClick={() => setShowUploadImage(true)}>
                  Upload Image
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showCreateFolder && (
        <CreateFolderModal
          currentFolder={currentFolder}
          onClose={() => setShowCreateFolder(false)}
          onCreated={() => { setShowCreateFolder(false); fetchData(); }}
        />
      )}

      {showUploadImage && (
        <ImageUploadModal
          currentFolder={currentFolder}
          onClose={() => setShowUploadImage(false)}
          onUploaded={() => { setShowUploadImage(false); fetchData(); }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 32px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '20px',
    flexWrap: 'wrap',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '28px',
    fontWeight: '700',
    color: '#f0f0ff',
  },
  subtitle: {
    color: '#6b6b8a',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  newFolderBtn: {
    background: '#7c6bff',
    color: '#f0f0ff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(124, 107, 255, 0.25)',
  },
  uploadImageBtn: {
    background: 'transparent',
    color: '#f0f0ff',
    border: '1px solid #1e1e35',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
    gap: '16px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(124, 107, 255, 0.1)',
    borderTop: '3px solid #7c6bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loaderText: {
    color: '#6b6b8a',
    fontSize: '14px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#6b6b8a',
    letterSpacing: '0.1em',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  folderCard: {
    background: '#12121f',
    border: '1px solid #1e1e35',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  folderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(124, 107, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7c6bff',
  },
  folderIcon: {
    width: '22px',
    height: '22px',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b6b8a',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  folderName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#f0f0ff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  folderSize: {
    fontSize: '12px',
    color: '#6b6b8a',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
  imageCard: {
    background: '#12121f',
    border: '1px solid #1e1e35',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  imageWrapper: {
    height: '180px',
    position: 'relative',
    overflow: 'hidden',
    background: '#080810',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(8, 8, 16, 0.4) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px',
    pointerEvents: 'none',
  },
  imageDeleteBtn: {
    background: 'rgba(18, 18, 31, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: '#ff6b9d',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'auto',
  },
  imageDetails: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  imageName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#f0f0ff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  imageSize: {
    fontSize: '12px',
    color: '#6b6b8a',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
    background: '#12121f',
    border: '1px dashed #1e1e35',
    borderRadius: '16px',
  },
  emptyIcon: {
    color: '#6b6b8a',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '20px',
    fontWeight: '700',
    color: '#f0f0ff',
    marginBottom: '8px',
  },
  emptyDesc: {
    color: '#6b6b8a',
    fontSize: '14px',
    maxWidth: '380px',
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  emptyActions: {
    display: 'flex',
    gap: '12px',
  },
};

// end of FolderView