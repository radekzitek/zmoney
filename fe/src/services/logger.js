const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class Logger {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async processQueue() {
    while (this.isOnline && this.queue.length > 0) {
      const data = this.queue.shift();
      await this.sendToServer(data);
    }
  }

  async sendToServer(data) {
    if (!this.isOnline) {
      this.queue.push(data);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error('Error sending log to server:', error);
      this.queue.push(data);
    }
  }

  info(message, meta) {
    this.sendToServer({ level: 'info', message, meta });
  }

  warn(message, meta) {
    this.sendToServer({ level: 'warn', message, meta });
  }

  error(message, meta) {
    this.sendToServer({ level: 'error', message, meta });
  }
}

export const logger = new Logger(); 