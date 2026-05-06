import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[App Crash]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff', padding: '20px', textAlign: 'center', gap: '16px' }}>
          <p style={{ fontSize: '18px' }}>应用加载异常</p>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>
            点击重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 清除加载超时检测
if ((window as any).__appLoadTimer) {
  clearTimeout((window as any).__appLoadTimer);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
