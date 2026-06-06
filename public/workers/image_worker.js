self.onmessage = async function(e) {
  const { base64Data } = e.data;
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/webp' });
    const url = URL.createObjectURL(blob);
    self.postMessage({ url });
  } catch (err) {
    self.postMessage({ error: err.message });
  }
};
