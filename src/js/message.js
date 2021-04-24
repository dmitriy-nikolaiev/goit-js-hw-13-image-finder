import { error, defaultStack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css'; // default styles
import '@pnotify/core/dist/BrightTheme.css'; // default theme

const message = {
  show(text) {
    error({
      text,
      delay: 5000,
      animateSpeed: 'fast',
      sticker: false,
    });
  },

  close() {
    defaultStack.close(true);
  },
};

export default message;
