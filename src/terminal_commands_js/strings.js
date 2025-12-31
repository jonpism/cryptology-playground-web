export const strings = (args, fileSystem = {}) => {

    if (args[0] === '--help') {
    return { type: 'info', text: 
`Usage: strings [options] [filename]

Description:
  Print the sequences of printable characters in files.
  Useful for finding hidden text in binary files.

Options:
  -n [number]   Specify the minimum string length (default: 4).
  filename      The file to analyze.` 
    };
  }
  
  if (!args.length) {
    return { type: 'error', text: 'Usage: strings [filename] (optional: -n [min_length])' };
  }

  // parse arguments
  let filename = args[0];
  let minLength = 4; // default behavior of Linux strings command

  if (args[0] === '-n' && args.length >= 3) {
    // strings -n 10 myfile.bin
    minLength = parseInt(args[1], 10) || 4;
    filename = args[2];
  }

  // get file data
  const data = fileSystem[filename]; // Uint8Array

  if (!data) {
    return { type: 'error', text: `strings: '${filename}': No such file` };
  }

  // extraction
  let output = [];
  let currentString = "";
  
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];

    // check for printable ASCII (32-126) or tab (9)
    if ((byte >= 32 && byte <= 126) || byte === 9) {
      currentString += String.fromCharCode(byte);
    } else {
      if (currentString.length >= minLength) {
        output.push(currentString);
      }
      currentString = "";
    }
  }

  // check valid string at the very end of file
  if (currentString.length >= minLength) {
    output.push(currentString);
  }

  if (output.length === 0) {
    return { type: 'info', text: '(No strings found)' };
  }

  // return as 'code' type to preserve formatting
  return { type: 'code', text: output.join('\n') };
};