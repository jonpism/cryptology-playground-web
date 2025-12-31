import { base64 } from './base64';
import { xxd } from './xxd';
import { strings } from './strings';
import { grep } from './grep';
import { ls } from './ls';

const help = () => ({
  type: 'response',
  text: `
  *Drag & Drop utility: You can drag and drop any file you want in the terminal.
  The files are stored in the virtual memory of the browser and you can use any
  command you want to process them, like xxd [filename], objdump [filename], etc.
  Once you refresh the page or quit the webapp, all the files are vanished.

  Note: Type [command name] --help for more information on a command.

            AVAILABLE COMMANDS 

  whoami              : Username of the current user
  date                : View current date - mm/dd/yy, h/m/s
  ls                  : List current uploaded files
  clear               : Clear screen
  base64 [txt]        : Encode Base64 string
  base64 -d [txt]     : Decode base64 string
  xxd [filename]      : Hexdump
  strings [filename]  : See text inside a binary or data file
  grep [filename]     : Search for specific words, phrases or patterns inside files
  
  `
});

// master registry
export const commands = {
  base64,
  xxd,
  help,
  whoami: () => ({ type: 'success', text: 'root@crypto-playground' }),
  date: () => ({ type: 'response', text: new Date().toLocaleString() }),
  strings,
  grep,
  ls
};