import { readdir } from 'node:fs/promises'


readdir('files').then((result) => {console.log({result})}, (reject) => console.log({reject}))