export const grep = (args, fileSystem, stdin) => {

    if (args[0] === '--help') {
    return { type: 'info', text: 
`Usage: grep [pattern] [filename?]

Description:
  Searches for a pattern in a file or input text (stdin).
  Can be used with pipes (|).

Examples:
  grep "password" myfile.txt
  strings image.png | grep "flag{"` 
    };
  }

  // grep "pattern" [optional_file]
  // stdin: the text output from the previous command if piped

  if (!args.length) return { type: 'error', text: 'Usage: grep [pattern] [file?]' };

  // handle quotes
  let pattern = args[0];
  // remove quotes if present
  if ((pattern.startsWith('"') && pattern.endsWith('"')) || 
      (pattern.startsWith("'") && pattern.endsWith("'"))) {
    pattern = pattern.slice(1, -1);
  }

  let contentToSearch = "";

  // search input from pipe
  if (stdin) {
    contentToSearch = stdin;
  } 
  // or look for a filename in args[1]
  else if (args[1]) {
    const filename = args[1];
    if (fileSystem[filename]) {
        // decode binary to text
        if (fileSystem[filename] instanceof Uint8Array) {
            contentToSearch = new TextDecoder().decode(fileSystem[filename]);
        } else {
            contentToSearch = fileSystem[filename];
        }
    } else {
        return { type: 'error', text: `grep: ${filename}: No such file` };
    }
  } else {
    return { type: 'error', text: 'Usage: command | grep "pattern" OR grep "pattern" filename' };
  }

  // search
  const lines = contentToSearch.split('\n');
  const matches = lines.filter(line => line.includes(pattern));

  if (matches.length === 0) return null; // no matches found

  return { type: 'code', text: matches.join('\n') };
};