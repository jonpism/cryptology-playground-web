export const ls = (args, fileSystem = {}) => {
  if (args[0] === '--help') {
    return { type: 'info', text: 
`Usage: ls

Description:
  Lists all files currently loaded in the virtual memory (dragged & dropped).` 
    };
  }

  // list files
  const files = Object.keys(fileSystem);

  if (files.length === 0) {
    return { type: 'info', text: '(No files loaded. Drag & drop files here)' };
  }

  return { type: 'response', text: files.join('\n') };
};