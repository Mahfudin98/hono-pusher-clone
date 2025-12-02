import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('Connected to WebSocket');
});

ws.on('message', (data: any) => {
  console.log('Received:', data.toString());
  if (data.toString().includes('Hello from server')) {
      console.log('Initial handshake successful');
  } else {
      const parsed = JSON.parse(data.toString());
      if (parsed.event === 'test-event') {
          console.log('Event received successfully');
          process.exit(0);
      }
  }
});

setTimeout(async () => {
    console.log('Triggering event...');
    await fetch('http://localhost:3000/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            channel: 'test-channel',
            event: 'test-event',
            data: 'test-data'
        })
    });
}, 2000);
