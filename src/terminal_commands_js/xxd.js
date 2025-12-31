export const xxd = (args, fileSystem = {}) => {

  if (args[0] === '--help') {
    return { type: 'info', text: 
    `Usage: xxd [filename]
        
    Description:
      Creates a hexdump of a binary or text file.
        
    Options:
      filename    The name of the file (must be loaded via drag & drop).` 
    };
  }

  if (!args.length) return { type: 'error', text: 'Usage: xxd [filename]' };

  const filename = args[0];
  const data = fileSystem[filename]; // Uint8Array

  if (!data) {
    return { type: 'error', text: `xxd: ${filename}: No such file.` };
  }

  let output = [];
  
  for (let i = 0; i < data.length; i += 16) {
    const chunk = data.slice(i, i + 16);
    const offset = i.toString(16).padStart(8, '0');

    let hexPart = '';
    for (let j = 0; j < 16; j++) {
      if (j < chunk.length) {
        hexPart += chunk[j].toString(16).padStart(2, '0');
      } else {
        hexPart += '  ';
      }
      if (j % 2 === 1) hexPart += ' ';
    }

    let asciiPart = '';
    for (let j = 0; j < chunk.length; j++) {
      const charCode = chunk[j];
      // printable ASCII check
      asciiPart += (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : '.';
    }

    output.push(`${offset}: ${hexPart}  ${asciiPart}`);
  }

  return { type: 'code', text: output.join('\n') };
};