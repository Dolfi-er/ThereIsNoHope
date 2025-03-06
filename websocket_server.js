const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

// Храним сообщения в памяти
let messages = [];

wss.on('connection', (ws) => {
    // Отправляем историю сообщений новому клиенту
    ws.send(JSON.stringify({ type: 'history', messages }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const newMessage = {
            text: data.text,
            sender: data.sender, // "client" или "admin"
        };

        // Добавляем новое сообщение в историю
        messages.push(newMessage);

        // Рассылаем новое сообщение всем подключенным клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', message: newMessage }));
            }
        });
    });
});

console.log('WebSocket сервер запущен на ws://localhost:8081');