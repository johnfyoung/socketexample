if (document.querySelector('#channels-list')) {
  const handleJoinChat = (event) => {
    if (event.target.matches('.join-channel-button')) {
      window.location.href = `/chat/${event.target.dataset.channel}`;
    }
  };

  document
    .querySelector('#channels-list')
    .addEventListener('click', handleJoinChat);
}

// eslint-disable-next-line
function connect(channelID, updaterCB) {
  if (io) {
    let messages = [];
    const socket = io(
      window.env === 'production'
        ? window.location.href
        : 'ws://localhost:3001',
      { transports: ['websocket', 'polling'] },
    );

    socket.on('connect', (msg) => {
      console.log(`socket connected: ${msg}`);
    });

    socket.on('disconnect', (msg) => {
      console.log(`socket disconnected (${socket.id}): ${msg}`);
    });

    socket.on(channelID, function (msg) {
      console.log(`Got a message from ${channelID}: ${msg}`);

      // this avoids an infinite loop of watching messages as a dependency yet
      // needing to set messages within the socket
      messages = [...messages, { ...msg, isMe: false }];
      updaterCB(messages);
    });

    return (msg, username) => {
      socket.emit(channelID, { msg, username }, (data) =>
        console.log('Server response: ', data),
      );

      messages = [...messages, { msg, username, isMe: true }];
      updaterCB(messages);
    };
  }

  return null;
}

// eslint-disable-next-line
function createUpdateHandler(containerEl) {
  return (messages) => {
    console.log(messages);
    containerEl.innerHTML = '';
    messages.forEach((message) => {
      const msgEl = document.createElement('div');
      msgEl.innerHTML = `${message.isMe ? 'me' : message.username}: ${
        message.msg
      }`;
      containerEl.append(msgEl);
    });
  };
}

// function handleEmit(socket, channelID, msg, username) {
//   socket.emit(channelID, { msg, username }, (data) =>
//     console.log('Server response: ', data),
//   );
// }
