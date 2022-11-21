import { readdir, writeFile, readFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'



const getLast = <T>(array: Array<T>) => array[array.length-1]

const sortByIndex = (files: Array<string>): Array<{index: number, path: string}> => {
  const index = (aString: string) => Number(aString.split('.')[0].split('_')[1])

  return files.map(file => ({path: file, index: index(file)})).sort((x, y) => x.index - y.index)
}


export class AuditManager {

  constructor(private readonly _maxEntriesPerFile: number, private readonly _directoryName: string) {}

  public async addRecord(visitorName: string, timeOfVisit: Date) {
    const filePaths = await readdir(join(resolve(dirname('')), this._directoryName))
    const sorted = sortByIndex(filePaths)

    const newRecord = visitorName + ';' + timeOfVisit + '\r\n'

    if(sorted.length == 0) {
      const newFile = await writeFile(join(this._directoryName, 'audit_1.txt'), newRecord, {flag: 'a+'})
      return
    }

    const {path: currentFilePath, index: currentFileIndex} = getLast(sorted)

    const lines = await readFile(join(resolve(dirname('')), this._directoryName, currentFilePath), 'utf8').then(result => result.split('\r\n'))

    if(lines.length < this._maxEntriesPerFile) {
      lines.push(newRecord)
      const newContent = lines.join('\r\n')
      await writeFile(join(resolve(dirname('')), this._directoryName, currentFilePath), newContent)
    } else {
      const newIndex = currentFileIndex + 1
      const newName = `audit_${newIndex}.txt`
      await writeFile(join(resolve(dirname('')), this._directoryName, newName), newRecord)
    }
  }
}


const manager = new AuditManager(5, 'files')

;(async() => await manager.addRecord('Alex', new Date()))()
