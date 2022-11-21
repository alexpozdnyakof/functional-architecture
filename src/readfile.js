import { readdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

async function read(){
  const result = await readFile('files/audit_1.txt', 'utf8').then(result => result.split('\n'))
  console.log({result})
  return result
}

async function write(){
  await writeFile(path.join(path.resolve(path.dirname('')), 'files','audit_1.txt'), 'value 123\n', {flag: 'a+'})

}

(async() => await read())()