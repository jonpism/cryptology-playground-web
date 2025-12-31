export const base64 = (args) => {
  if (!args.length) {
    return { type: 'error', text: 'Usage: base64 [text] OR base64 -d [encoded_text]' };
  }

  const mode = args[0];
  const input = args.slice(1).join(' ');

  if (mode === '-d' || mode === '--decode') {
    try {
      const decoded = atob(input || args[1]);
      return { type: 'response', text: decoded };
    } catch (e) {
      return { type: 'error', text: 'Invalid Base64 string.' };
    }
  } else {
    // treat all args as input
    try {
      const textToEncode = args.join(' ');
      const encoded = btoa(textToEncode);
      return { type: 'response', text: encoded };
    } catch (e) {
      return { type: 'error', text: 'Encoding error.' };
    }
  }
};