import path from "node:path";
import fs, {promises as fsp} from "node:fs";
import mime from 'mime/lite';
import {readPackageUp} from 'read-package-up';
import { spawn } from 'node:child_process';
import {DeclaredError, objectifyArgs, ResolvablePromise} from "./js-util.js";
import findNodeModules from "find-node-modules";
import treeKill from "tree-kill";
import psTree from "ps-tree";
import net from 'net';

export async function getPackageVersion(cwd) {
    let pkgInfo=await readPackageUp({cwd});
    return pkgInfo.packageJson.version;
}

export async function getEffectiveCwd(cwd, {allowUninitialized}={}) {
    let packageInfo=await readPackageUp({cwd: cwd});
    if (!packageInfo) {
        if (!allowUninitialized)
            throw new DeclaredError("No package.json found.");

        return cwd;
    }

    return path.dirname(packageInfo.path);
}

export function serverListenPromise(server, port) {
    return new Promise((resolve, reject) => {
        const onError = (err) => {
            server.off('listening', onListening);
            reject(err);
        };

        const onListening = () => {
            server.off('error', onError);
            resolve();
        };

        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port);
    });
}

export function serverClosePromise(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });

        // Immediately destroy all connections
        if (typeof server.closeAllConnections === 'function') {
            server.closeAllConnections();
        }
    });
}

export async function createStaticResponse({request, cwd}) {
    let url=new URL(request.url);
    let assetAbs=path.join(cwd,url.pathname);
    if (fs.existsSync(assetAbs) &&
            fs.statSync(assetAbs).isFile()) {

        let stat=fs.statSync(assetAbs);        

        let headers=new Headers();
        headers.set("content-type",mime.getType(assetAbs.slice(assetAbs.lastIndexOf(".")+1)));
        headers.set("content-length",stat.size);

        let body=createStreamBody(fs.createReadStream(assetAbs));

        return new Response(body,{headers});
    }
}

export function createStreamBody(stream) {
    const body = new ReadableStream({
        start(controller) {
            stream.on('data', (chunk) => {
                controller.enqueue(chunk)
            })
            stream.on('end', () => {
                controller.close()
            })
        },

        cancel() {
            stream.destroy()
        },
    })
    return body
}

export function findNodeBin(...args) {
    let {cwd, name, includeProcessCwd}=objectifyArgs(args,["cwd","name","includeProcessCwd"]);

    if (includeProcessCwd===undefined)
        includeProcessCwd=true;

    let dirs=findNodeModules({cwd: cwd, relative: false});
    if (includeProcessCwd)
        dirs=[...dirs,...findNodeModules({cwd: process.cwd(), relative: false})];

    for (let dir of dirs) {
        let fn=path.join(dir,".bin",name);
        if (fs.existsSync(fn))
            return fn;
    }

    throw new DeclaredError("Can't find binary: "+name);
}

export function killTreeAndWait(pid, signal = 'SIGINT', timeout = 10000, checkInterval = 200) {
    return new Promise((resolve, reject) => {
        treeKill(pid, signal, (err) => {
            if (err) return reject(err);
        });

        const start = Date.now();

        const checkIfTreeIsGone = () => {
            psTree(pid, (err, children) => {
                if (err) return reject(err);

                // Collect all PIDs: the parent and its children
                const pids = [pid, ...children.map(p => parseInt(p.PID, 10))];

                //console.log("pids: ",pids);

                // Check if any are still alive
                const alive = pids.some(p => {
                    try {
                        process.kill(p, 0);
                        return true;
                    } catch {
                        return false;
                    }
                });

                if (!alive) {
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error('Timeout waiting for process tree to exit.'));
                } else {
                    setTimeout(checkIfTreeIsGone, checkInterval);
                }
            });
        };

        checkIfTreeIsGone();
    });
}

class CommandJob {
    constructor() {
        this.stdoutBuffer=""
        this.stderrBuffer="";
        this.exitPromise=new ResolvablePromise();
    }

    async wait() {
        return await this.exitPromise;
    }

    async stop() {
        await killTreeAndWait(this.child.pid);
        return await this.exitPromise;
    }
}

export async function startCommand(cmd, args, options = {}) {
    let commandJob=new CommandJob();

    if (options.nodeCwd)
        cmd=findNodeBin({cwd: options.nodeCwd, name: cmd});

    if (options.waitForPort &&
            await isPortListening(options.waitForPort))
        throw new DeclaredError("Port is already listening: "+options.waitForPort);

    return new Promise((resolve, reject) => {
        let stdio="inherit";
        if (options.waitForOutput)
            stdio=['inherit', 'pipe', 'pipe'];

        const child = spawn(cmd, args, {
            stdio: stdio,
            env: { ...process.env, FORCE_COLOR: '1' },
            ...options
        });

        commandJob.child=child;

        let buffer = '';

        if (child.stdout) {
            child.stdout.on('data', (data) => {
                process.stdout.write(data);   // show live in terminal
                commandJob.stdoutBuffer += data.toString();
                if (options.waitForOutput && commandJob.stdoutBuffer.includes(options.waitForOutput)) {
                    resolve(commandJob);
                }
            });
        }

        if (child.stderr) {
            child.stderr.on('data', (data) => {
                process.stderr.write(data); // show errors live in terminal
                commandJob.stderrBuffer += data.toString();
                if (options.waitForOutput && commandJob.stderrBuffer.includes(options.waitForOutput)) {
                    resolve(commandJob);
                }
            });
        }

        child.on('exit', (code, signal) => {
            if (signal=="SIGTERM" || signal=="SIGINT")
                commandJob.exitPromise.resolve();

            else if (options.hasOwnProperty("expect") &&
                    code!=options.expect)
                commandJob.exitPromise.reject(new DeclaredError("Expected return code "+options.expect+", but got "+code+" signal="+signal));

            else
                commandJob.exitPromise.resolve(code);

            resolve(commandJob);
        });

        child.on('error', (err) => {
            commandJob.exitPromise.reject(err);
            resolve(commandJob);
        });

        if (options.waitForPort) {
            waitForPort(options.waitForPort)
                .then(()=>resolve(commandJob))
                .catch(reject);
        }
    });
}

export async function isPortListening(port, timeout = 500) {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        const onError = () => {
            socket.destroy();
            resolve(false);
        };

        socket.setTimeout(timeout);
        socket.once('error', onError);
        socket.once('timeout', onError);

        socket.connect(port, '127.0.0.1', () => {
            socket.end();
            resolve(true);
        });
    });
}

export async function waitForPort(port, options = {}) {
    const {
        timeout = 5*60000, // 5 minutes
        checkInterval = 250
    } = options;

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const check = async () => {
            const isOpen = await isPortListening(port);
            if (isOpen) {
                clearInterval(interval);
                resolve();
            } else if (Date.now() - startTime >= timeout) {
                clearInterval(interval);
                reject(new Error(`Timed out waiting for port ${port} to open.`));
            }
            // else continue checking
        };

        const interval = setInterval(check, checkInterval);
        check(); // immediate first check
    });
}

export async function runCommand(command, args = [], options = {}) {
    if (options.nodeCwd)
        command=findNodeBin({cwd: options.nodeCwd, name: command});

    const {
        captureOutput = false,
        spawnOptions = {}
    } = options;

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : 'inherit',
            ...spawnOptions
        });

        let output="";

        if (captureOutput) {
            if (child.stdout) {
                child.stdout.on('data', (data) => {
                    output += data.toString();
                });
            }
            if (child.stderr) {
                child.stderr.on('data', (data) => {
                    output += data.toString();
                });
            }
        }

        child.on('error', (err) => {
            //reject(new DeclaredError("blbbllb"));
            reject(err);
        });

        child.on('close', (code, signal) => {
            if (options.hasOwnProperty("expect") &&
                    code!=options.expect)
                reject(new DeclaredError(`Command failed (${code}).`));

            if (captureOutput)
                resolve(output);

            else
                resolve();
        });
    });
}