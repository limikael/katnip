import fs from "node:fs";
import path from "node:path";

class FileWatcher {
    constructor(directories, debounceMs = 50) {
        this.directories = directories;
        this.changed = false;
        this.resolveQueue = [];
        this.debounceTimer = null;
        this.debounceMs = debounceMs;

        this.watchers = directories.map(dir => {
            return fs.watch(dir, { recursive: true }, (eventType, filename) => {
                //console.log(eventType+": "+filename);

                if (filename) {
                    this._triggerChangeDebounced();
                }
            });
        });
    }

    _triggerChangeDebounced() {
        if (this.debounceTimer) return;
        this.debounceTimer = setTimeout(() => {
            this.debounceTimer = null;
            this._triggerChange();
        }, this.debounceMs);
    }

    _triggerChange() {
        this.changed = true;
        if (this.resolveQueue.length > 0) {
            const resolve = this.resolveQueue.shift();
            resolve();
            this.changed = false;
        }
    }

    async wait() {
        if (this.changed) {
            this.changed = false;
            return;
        }

        return new Promise(resolve => {
            this.resolveQueue.push(resolve);
        });
    }

    close() {
        for (const watcher of this.watchers) {
            watcher.close();
        }
    }
}

export function startFileWatcher({directories, debounceMs}) {
    if (debounceMs===undefined)
        debounceMs=50;

    let watcher=new FileWatcher(directories, debounceMs);

    return watcher;
}