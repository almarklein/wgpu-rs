
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) wasm.__wbindgen_export_0.get(dtor)(a, state.b);
            else state.a = a;
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_18(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4025d1eea4e79a21(arg0, arg1, addHeapObject(arg2));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Window_f66ee047e567d37e = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_navigator_b80bd847152695db = function(arg0) {
        var ret = getObject(arg0).navigator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_requestDevice_0514d722aad71d9a = function(arg0, arg1) {
        var ret = getObject(arg0).requestDevice(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_submit_d3dafc60d65c9e9f = function(arg0, arg1) {
        getObject(arg0).submit(getObject(arg1));
    };
    imports.wbg.__wbg_label_5cefbeffe165f731 = function(arg0, arg1) {
        var ret = getObject(arg1).label;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_beginRenderPass_ae0022d3a5b6a858 = function(arg0, arg1) {
        var ret = getObject(arg0).beginRenderPass(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_copyTextureToBuffer_972fffef316cb8c5 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).copyTextureToBuffer(getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_finish_8de0f6c997a2c9ef = function(arg0, arg1) {
        var ret = getObject(arg0).finish(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_gpu_71b70cf3e0b75fb4 = function(arg0) {
        var ret = getObject(arg0).gpu;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_debug_b3d0960b57b514d2 = function(arg0) {
        console.debug(getObject(arg0));
    };
    imports.wbg.__wbg_error_f6e7c99a067a129b = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_info_ff30be0f201e8de9 = function(arg0) {
        console.info(getObject(arg0));
    };
    imports.wbg.__wbg_log_a9bc1e2e2787c261 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_warn_6b67f0556178974d = function(arg0) {
        console.warn(getObject(arg0));
    };
    imports.wbg.__wbg_endPass_54d8f1f911354506 = function(arg0) {
        getObject(arg0).endPass();
    };
    imports.wbg.__wbg_requestAdapter_ac08af01e4475849 = function(arg0, arg1) {
        var ret = getObject(arg0).requestAdapter(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_mapReadAsync_0dface1d9e7d94fe = function(arg0) {
        var ret = getObject(arg0).mapReadAsync();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_unmap_68a876b9310f4bd7 = function(arg0) {
        getObject(arg0).unmap();
    };
    imports.wbg.__wbg_createView_36e5bff6bceb66fd = function(arg0) {
        var ret = getObject(arg0).createView();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_defaultQueue_13aff2b16459b3d5 = function(arg0) {
        var ret = getObject(arg0).defaultQueue;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createBuffer_b248b860b1c84af1 = function(arg0, arg1) {
        var ret = getObject(arg0).createBuffer(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createCommandEncoder_382e8599bc374f54 = function(arg0, arg1) {
        var ret = getObject(arg0).createCommandEncoder(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createTexture_b5e4244afe9d701d = function(arg0, arg1) {
        var ret = getObject(arg0).createTexture(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_ae0789b871c5d57f = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_new_0963458889a0503f = function() {
        var ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_0275cbb800adbafa = function(arg0, arg1) {
        var ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_newnoargs_e710e627874fc912 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_596ccf1285f3df7a = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_7895160c6ad0821f = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_e285b4df095d5f6c = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_bfb9caca861cee11 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_0f608b57f60a1319 = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_b7fda4753d5a6f96 = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_globalThis_f2ab166b2dad2691 = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_5a16f080534aa1b3 = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_buffer_101f4727ece1f09d = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_02235985c023f889 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_b2bf1dd9dfdd6548 = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_51269e44b132569a = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_set_ff55d9de83e847d0 = handleError(function(arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    });
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper137 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 45, __wbg_adapter_18);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

