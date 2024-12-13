import Pusher from 'pusher-js';

const pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
  cluster: 'YOUR_PUSHER_CLUSTER',
});

export default pusher;