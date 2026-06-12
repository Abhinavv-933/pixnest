export default function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.card} onClick={e => e.stopPropagation()}>
        {/* Icon */}
        <div style={styles.iconContainer}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={styles.title}>Log out of Pixnest?</h2>
        <p style={styles.subtitle}>You'll need to sign in again to access your vault.</p>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(8, 8, 16, 0.80)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.15s ease',
  },
  card: {
    background: '#12121f',
    border: '1px solid #1e1e35',
    borderRadius: '16px',
    padding: '36px 32px 28px',
    width: '100%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
    animation: 'slideUp 0.2s ease',
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'rgba(255, 77, 77, 0.1)',
    border: '1px solid rgba(255, 77, 77, 0.2)',
    color: '#ff4d4d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '20px',
    fontWeight: '700',
    color: '#f0f0ff',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: '#6b6b8a',
    textAlign: 'center',
    lineHeight: '1.6',
    marginBottom: '8px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: 'transparent',
    border: '1px solid #1e1e35',
    borderRadius: '8px',
    color: '#6b6b8a',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255, 77, 77, 0.12)',
    border: '1px solid rgba(255, 77, 77, 0.4)',
    borderRadius: '8px',
    color: '#ff4d4d',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 12px rgba(255, 77, 77, 0.2)',
  },
};
