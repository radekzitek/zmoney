class Logger {
  constructor() {
    this.apiUrl = `${import.meta.env.VITE_API_URL}/system/logs`;
  }

  async log(level, message, meta = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          meta: {
            ...meta,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to send log to backend:', await response.text());
      }
    } catch (error) {
      console.error('Error sending log to backend:', error);
    }
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger(); 