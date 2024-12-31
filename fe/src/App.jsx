import { useEffect } from 'react';
import { logger } from './services/logger';

function App() {
  useEffect(() => {
    // Test logging on component mount
    logger.info('App component mounted', { component: 'App' });
  }, []);

  const testLogging = () => {
    logger.info('Info message from frontend');
    logger.warn('Warning message from frontend');
    logger.error('Error message from frontend', { 
      additionalInfo: 'This is a test error'
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Application</h1>
        <button 
          onClick={testLogging}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Test Logging
        </button>
      </header>
    </div>
  );
}

export default App;
