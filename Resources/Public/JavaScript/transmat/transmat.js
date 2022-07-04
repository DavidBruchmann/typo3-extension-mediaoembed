/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @see https://github.com/google/transmat
 * @see https://google.github.io/transmat/
 * @see https://web.dev/datatransfer/
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.transmat = factory());
}(this, (function () {
  'use strict';

  function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn) {
	var module = { exports: {} };
	  return fn(module, module.exports), module.exports;
  }

  var data_transfer = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.setMinimalDragImage = exports.normalizeType = exports.getDataTransfer = void 0;
	/** Returns the DataTransfer object from the event, or throws an error. */
	function getDataTransfer(event) {
	    var _a;
	    const dataTransfer = (_a = event.clipboardData) !== null && _a !== void 0 ? _a : event.dataTransfer;
	    if (!dataTransfer) {
	        throw new Error('No DataTransfer available at this event.');
	    }
	    return dataTransfer;
	}
	exports.getDataTransfer = getDataTransfer;
	/** Returns a normalize type to align browser implementations. */
	function normalizeType(input) {
	    // Browsers (at least Chrome) seem to lowercase the type. Enforce this to be
	    // consistent across browsers.
	    const result = input.toLowerCase();
	    switch (result) {
	        case 'text':
	            return 'text/plain';
	        case 'url':
	            return 'text/uri-list';
	        default:
	            return result;
	    }
	}
	exports.normalizeType = normalizeType;
	/**
	 * Sets a minimal drag image that will replace the default, but still give the
	 * user the feeling of dragging an object when moving beyond the boundaries of
	 * the browser.
	 * An use-case for the minimal image is when using Transmat in combination with
	 * existing drag-drop implementations.
	 */
	function setMinimalDragImage(transfer, width = 22, height = 18, square = 2, border = 4, colorA = 'rgba(255,255,255,.5)', colorB = 'rgba(0,0,0,.5)') {
	    // Render 2x size to optimize for HD screens, and scale down with CSS.
	    const canvas = document.createElement('canvas');
	    canvas.width = width;
	    canvas.height = height;
	    // Draw a checkered border.
	    const ctx = canvas.getContext('2d');
	    for (let x = 0; x < width / square; x++) {
	        for (let y = 0; y < height / square; y++) {
	            ctx.fillStyle = (x + y) % 2 ? colorA : colorB;
	            ctx.fillRect(x * square, y * square, square, square);
	        }
	    }
	    ctx.clearRect(border, border, width - border * 2, height - border * 2);
	    // Chrome needs the dragImages to be appended to the DOM. Add it to the DOM
	    // for short period and put it outside the viewport.
	    Object.assign(canvas.style, {
	        width: `${width}px`,
	        height: `${height}}px`,
	        position: 'absolute',
	        left: '-999px',
	    });
	    document.body.appendChild(canvas);
	    transfer.setDragImage(canvas, width / 2, height / 2);
	    setTimeout(() => {
	        canvas.remove();
	    });
	}
	exports.setMinimalDragImage = setMinimalDragImage;
	//# sourceMappingURL=data_transfer.js.map
  });

  var mime_type = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.match = exports.parse = void 0;
	/** Parses a mime type string into a destructed MimeType object. */
	function parse(input) {
	    const [essence, ...paramSets] = input.trim().toLowerCase().split(';');
	    const [type, subtype] = essence.split('/');
	    if (!type || !subtype) {
	        throw new Error('Invalid mime type. Missing type or subtype.');
	    }
	    const params = new Map();
	    for (const p of paramSets) {
	        const [key, ...value] = p.split('=');
	        params.set(key, value.join('='));
	    }
	    return {
	        type,
	        subtype,
	        params,
	    };
	}
	exports.parse = parse;
	/** Match two mime-types, with the first input as a base. */
	function match(src, compare) {
	    for (const key of [...src.params.keys()]) {
	        if (src.params.get(key) !== compare.params.get(key)) {
	            return false;
	        }
	    }
	    return src.type === compare.type && src.subtype === compare.subtype;
	}
	exports.match = match;
	//# sourceMappingURL=mime_type.js.map
  });

  var utils = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.removeEventListeners = exports.addEventListeners = void 0;
	function addEventListeners(target, types, listener, options) {
	    for (const type of types) {
	        target.addEventListener(type, listener, options);
	    }
	    return () => {
	        removeEventListeners(target, types, listener, options);
	    };
	}
	exports.addEventListeners = addEventListeners;
	function removeEventListeners(target, types, listener, options) {
	    for (const type of types) {
	        target.removeEventListener(type, listener, options);
	    }
	}
	exports.removeEventListeners = removeEventListeners;
	//# sourceMappingURL=utils.js.map
  });

  var transmat = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.addListeners = exports.Transmat = void 0;

	/**
	 * Transmat encapsulates the DataTransfer object and provides some helpers to
	 * ease the integration of the drag and copy interactions.
	 */
	class Transmat {
	    constructor(event) {
	        this.event = event;
	        this.dataTransfer = data_transfer.getDataTransfer(event);
	    }
	    /**
	     * Tell the browser to proceed with the data transfer. Returns whether the
	     * event is a receiving event, e.g. whether the data can be accessed.
	     */
	    accept(dropEffect) {
	        if (this.event.type === 'dragover') {
	            if (dropEffect) {
	                this.dataTransfer.dropEffect = dropEffect;
	            }
	            this.event.preventDefault();
	        }
	        if (this.event.type === 'drop') {
	            // Prevent some browsers from redirecting.
	            this.event.preventDefault();
	        }
	        return this.event.type === 'drop' || this.event.type === 'paste';
	    }
	    /** Whether the DataTransfer contains the provided key */
	    hasType(input) {
	        const normalizedInput = data_transfer.normalizeType(input);
	        return this.dataTransfer.types.some(type => {
	            const normalizedType = data_transfer.normalizeType(type);
	            try {
	                return mime_type.match(mime_type.parse(normalizedInput), mime_type.parse(normalizedType));
	            }
	            catch (_a) {
	                // Just in case the string inputs are the same.
	                return normalizedInput === normalizedType;
	            }
	        });
	    }
	    /** Get data by type. */
	    getData(type) {
	        return this.hasType(type)
	            ? this.dataTransfer.getData(data_transfer.normalizeType(type))
	            : undefined;
	    }
	    /** Set data for a single or multiple entries. */
	    setData(typeOrEntries, data) {
	        if (typeof typeOrEntries === 'string') {
	            this.setData({ [typeOrEntries]: data });
	        }
	        else {
	            for (const [type, data] of Object.entries(typeOrEntries)) {
	                const stringData = typeof data === 'object' ? JSON.stringify(data) : `${data}`;
	                this.dataTransfer.setData(data_transfer.normalizeType(type), stringData);
	            }
	        }
	    }
	}
	exports.Transmat = Transmat;
	/**
	 * Setup listeners. Returns a function to remove the event listeners.
	 * Optionally you can change the event types that will be listened to.
	 */
	function addListeners(target, type, listener, options = { dragDrop: true, copyPaste: true }) {
	    const isTransmitEvent = type === 'transmit';
	    let unlistenCopyPaste;
	    let unlistenDragDrop;
	    if (options.copyPaste) {
	        const events = isTransmitEvent ? ['cut', 'copy'] : ['paste'];
	        const parentElement = target.parentElement;
	        unlistenCopyPaste = utils.addEventListeners(parentElement, events, event => {
	            if (!target.contains(document.activeElement)) {
	                return;
	            }
	            listener(event, target);
	            // The default behavior of copy and cut needs to be prevented, otherwise
	            // DataTransfer won't work.
	            if (event.type === 'copy' || event.type === 'cut') {
	                event.preventDefault();
	            }
	        });
	    }
	    if (options.dragDrop) {
	        const events = isTransmitEvent ? ['dragstart'] : ['dragover', 'drop'];
	        unlistenDragDrop = utils.addEventListeners(target, events, event => {
	            listener(event, target);
	        });
	    }
	    return () => {
	        unlistenCopyPaste && unlistenCopyPaste();
	        unlistenDragDrop && unlistenDragDrop();
	    };
	}
	exports.addListeners = addListeners;
	//# sourceMappingURL=transmat.js.map
  });

  var transmat_observer = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TransmatObserver = void 0;

	/**
	 * TransmatObserver will help you respond to drag interactions and can be used
	 * for highlighting drop areas.
	 */
	class TransmatObserver {
	    constructor(callback) {
	        this.callback = callback;
	        this.targets = new Set();
	        this.prevRecords = [];
	        this.removeEventListeners = () => { };
	        this.onTransferEvent = (event) => {
	            const records = [];
	            for (const target of this.targets) {
	                // When the cursor leaves the browser it will be dispatched on the
	                // body or html node.
	                const isLeavingDrag = event.type === 'dragleave' &&
	                    (event.target === document.body ||
	                        event.target === document.body.parentElement);
	                // Whether there is a drag happening on the page.
	                const isActive = event.type !== 'drop' && event.type !== 'dragend' && !isLeavingDrag;
	                // Whether the target is being dragged over.
	                const isTargetNode = target.contains(event.target);
	                const isTarget = isActive && isTargetNode && event.type === 'dragover';
	                records.push({
	                    target,
	                    event,
	                    isActive,
	                    isTarget,
	                });
	            }
	            // Only emit when the records have changed.
	            if (!entryStatesEqual(records, this.prevRecords)) {
	                this.prevRecords = records;
	                this.callback(records, this);
	            }
	        };
	    }
	    addEventListeners() {
	        const listener = this.onTransferEvent;
	        this.removeEventListeners = utils.addEventListeners(document, ['dragover', 'dragend', 'dragleave', 'drop'], listener, true);
	    }
	    /** Returns the most recent emitted records. */
	    takeRecords() {
	        return this.prevRecords;
	    }
	    /** Observe the provided element. */
	    observe(target) {
	        this.targets.add(target);
	        if (this.targets.size === 1) {
	            this.addEventListeners();
	        }
	    }
	    /** Stop observing the provided element. */
	    unobserve(target) {
	        this.targets.delete(target);
	        if (this.targets.size === 0) {
	            this.removeEventListeners();
	        }
	    }
	    /** Clears all targets and listeners. */
	    disconnect() {
	        this.targets.clear();
	        this.removeEventListeners();
	    }
	}
	exports.TransmatObserver = TransmatObserver;
	/** Returns whether the entries are equal. */
	function entryStatesEqual(a, b) {
	    if (a.length !== b.length) {
	        return false;
	    }
	    return a.every((av, index) => {
	        const bv = b[index];
	        return av.isActive === bv.isActive && av.isTarget === bv.isTarget;
	    });
	}
	//# sourceMappingURL=transmat_observer.js.map
  });

  var lib = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TransmatObserver = exports.addListeners = exports.Transmat = void 0;

	Object.defineProperty(exports, "Transmat", { enumerable: true, get: function () { return transmat.Transmat; } });
	Object.defineProperty(exports, "addListeners", { enumerable: true, get: function () { return transmat.addListeners; } });

	Object.defineProperty(exports, "TransmatObserver", { enumerable: true, get: function () { return transmat_observer.TransmatObserver; } });
	//# sourceMappingURL=index.js.map
  });
  var index = /*@__PURE__*/getDefaultExportFromCjs(lib);
  return index;
})));
