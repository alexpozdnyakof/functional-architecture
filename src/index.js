"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditManager = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const getLast = (array) => array[array.length - 1];
const sortByIndex = (files) => {
    const index = (aString) => Number(aString.split('.')[0].split('_')[1]);
    return files.map(file => ({ path: file, index: index(file) })).sort((x, y) => x.index - y.index);
};
class AuditManager {
    constructor(_maxEntriesPerFile, _directoryName) {
        this._maxEntriesPerFile = _maxEntriesPerFile;
        this._directoryName = _directoryName;
    }
    addRecord(visitorName, timeOfVisit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((0, node_path_1.join)((0, node_path_1.resolve)((0, node_path_1.dirname)('')), this._directoryName));
            const filePaths = yield (0, promises_1.readdir)((0, node_path_1.join)((0, node_path_1.resolve)((0, node_path_1.dirname)('')), this._directoryName));
            const sorted = sortByIndex(filePaths);
            const newRecord = visitorName + ';' + timeOfVisit + '\r\n';
            if (sorted.length == 0) {
                const newFile = yield (0, promises_1.writeFile)((0, node_path_1.join)(this._directoryName, 'audit_1.txt'), newRecord, { flag: 'a+' });
                return;
            }
            const { path: currentFilePath, index: currentFileIndex } = getLast(sorted);
            const lines = yield (0, promises_1.readFile)((0, node_path_1.join)((0, node_path_1.resolve)((0, node_path_1.dirname)('')), this._directoryName, currentFilePath), 'utf8').then(result => result.split('\r\n'));
            if (lines.length < this._maxEntriesPerFile) {
                lines.push(newRecord);
                const newContent = lines.join('\r\n');
                yield (0, promises_1.writeFile)((0, node_path_1.join)((0, node_path_1.resolve)((0, node_path_1.dirname)('')), this._directoryName, currentFilePath), newContent);
            }
            else {
                const newIndex = currentFileIndex + 1;
                const newName = `audit_${newIndex}.txt`;
                yield (0, promises_1.writeFile)((0, node_path_1.join)((0, node_path_1.resolve)((0, node_path_1.dirname)('')), this._directoryName, newName), newRecord);
            }
        });
    }
}
exports.AuditManager = AuditManager;
const manager = new AuditManager(5, 'files');
(() => __awaiter(void 0, void 0, void 0, function* () { return yield manager.addRecord('Alex', new Date()); }))();
