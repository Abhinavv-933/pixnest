import { useState } from 'react';
import { useAuth } from '../context/authContext';
import FolderView from '../components/FolderView';
import LogoutModal from '../components/LogoutModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => { setShowLogoutModal(false); logout(); };
  const cancelLogout = () => setShowLogoutModal(false);

  const navigateToFolder = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumb(prev => [...prev, folder]);
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      setCurrentFolder(null);
      setBreadcrumb([]);
    } else {
      setCurrentFolder(breadcrumb[index]);
      setBreadcrumb(prev => prev.slice(0, index + 1));
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        {/* Signature Element: Animated Gradient Mesh Blob */}
        <div style={styles.meshContainer}>
          <div style={styles.meshBlob}></div>
        </div>

        <div style={styles.headerContent}>
          <div style={styles.logoContainer} onClick={() => navigateToBreadcrumb(-1)}>
            <span style={styles.logoText}>Pixnest</span>
            <span style={styles.logoDot}>.</span>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userProfile}>
              <div style={styles.avatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={styles.userName}>{user?.name}</span>
            </div>
            <button className="logout-btn" style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav style={styles.navigation}>
        <div style={styles.navContent}>
          {breadcrumb.length > 0 && (
            <button 
              className="back-btn"
              style={styles.backBtn} 
              onClick={() => navigateToBreadcrumb(breadcrumb.length - 2)}
              title="Go to parent folder"
            >
              <span style={styles.backArrow}>←</span> Back
            </button>
          )}
          
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbItem} onClick={() => navigateToBreadcrumb(-1)}>Home</span>
            {breadcrumb.map((f, i) => (
              <span key={f._id} style={styles.breadcrumbWrapper}>
                <span style={styles.separator}>/</span>
                <span 
                  style={i === breadcrumb.length - 1 ? styles.breadcrumbActive : styles.breadcrumbItem} 
                  onClick={() => i !== breadcrumb.length - 1 && navigateToBreadcrumb(i)}
                >
                  {f.name}
                </span>
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main style={styles.main}>
        <FolderView
          currentFolder={currentFolder}
          onNavigate={navigateToFolder}
        />
      </main>

      {showLogoutModal && (
        <LogoutModal onCancel={cancelLogout} onConfirm={confirmLogout} />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#080810',
    color: '#f0f0ff',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  header: {
    background: '#12121f',
    borderBottom: '1px solid #1e1e35',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
  },
  meshContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '400px',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: 0.5,
    zIndex: 1,
  },
  meshBlob: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '240px',
    height: '240px',
    background: 'radial-gradient(circle, rgba(124, 107, 255, 0.4) 0%, rgba(255, 107, 157, 0.4) 60%, transparent 100%)',
    filter: 'blur(30px)',
    animation: 'mesh-shift 12s infinite alternate ease-in-out',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'baseline',
    cursor: 'pointer',
  },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.04em',
    color: '#f0f0ff',
  },
  logoDot: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ff6b9d',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c6bff 0%, #ff6b9d 100%)',
    color: '#080810',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  userName: {
    color: '#f0f0ff',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #1e1e35',
    color: '#6b6b8a',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  navigation: {
    background: 'rgba(8, 8, 16, 0.4)',
    borderBottom: '1px solid rgba(30, 30, 53, 0.5)',
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid #1e1e35',
    color: '#6b6b8a',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  backArrow: {
    fontSize: '14px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '500',
  },
  breadcrumbWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbItem: {
    color: '#6b6b8a',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  breadcrumbActive: {
    color: '#f0f0ff',
    cursor: 'default',
  },
  separator: {
    color: '#1e1e35',
    margin: '0 8px',
  },
  main: {
    flexGrow: 1,
    width: '100%',
  },
};