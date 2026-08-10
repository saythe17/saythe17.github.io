// Without JavaScript, each magnifier remains a link to its original media.
const imageDialog = document.querySelector('.image-dialog');
if (imageDialog && typeof imageDialog.showModal === 'function') {
  const enlargedImage = imageDialog.querySelector('.enlarged-image');
  const enlargedVideo = imageDialog.querySelector('.enlarged-video');
  const closeButton = imageDialog.querySelector('.image-dialog-close');
  let returnFocus;

  document.querySelectorAll('[data-zoom]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = trigger;
      const isVideo = trigger.dataset.media === 'video';
      enlargedVideo.pause();
      enlargedImage.hidden = isVideo;
      enlargedVideo.hidden = !isVideo;
      imageDialog.setAttribute('data-size', trigger.dataset.zoomSize || 'wide');
      if (isVideo) {
        enlargedVideo.src = trigger.href;
        enlargedVideo.muted = true;
      } else {
        enlargedImage.src = trigger.href;
        enlargedImage.alt = trigger.parentElement.querySelector('img').alt;
      }
      imageDialog.showModal();
      closeButton.focus({ preventScroll: true });
      if (isVideo) {
        // Native controls remain available if automatic playback is blocked.
        enlargedVideo.play().catch(() => {});
      }
    });
  });

  closeButton.addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', (event) => {
    const rect = imageDialog.getBoundingClientRect();
    if (event.target === imageDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
      imageDialog.close();
    }
  });
  // Native dialog handles Escape; stop playback and restore keyboard focus.
  imageDialog.addEventListener('close', () => {
    enlargedVideo.pause();
    returnFocus?.focus({ preventScroll: true });
  });
}
