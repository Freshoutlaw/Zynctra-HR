import { a as __toESM, t as __commonJSMin } from "./rolldown-runtime-_TIqcEvS.js";
import { d as require_react } from "./react-vendor-CvsQKb8k.js";
//#region node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const destroy = () => {
		listeners.clear();
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe,
		destroy
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
//#endregion
//#region node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_production();
}));
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
/**
* @license React
* use-sync-external-store-shim/with-selector.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_with_selector_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react(), shim = require_shim();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
	exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
		var instRef = useRef(null);
		if (null === instRef.current) {
			var inst = {
				hasValue: !1,
				value: null
			};
			instRef.current = inst;
		} else inst = instRef.current;
		instRef = useMemo(function() {
			function memoizedSelector(nextSnapshot) {
				if (!hasMemo) {
					hasMemo = !0;
					memoizedSnapshot = nextSnapshot;
					nextSnapshot = selector(nextSnapshot);
					if (void 0 !== isEqual && inst.hasValue) {
						var currentSelection = inst.value;
						if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
					}
					return memoizedSelection = nextSnapshot;
				}
				currentSelection = memoizedSelection;
				if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
				var nextSelection = selector(nextSnapshot);
				if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
				memoizedSnapshot = nextSnapshot;
				return memoizedSelection = nextSelection;
			}
			var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
			return [function() {
				return memoizedSelector(getSnapshot());
			}, null === maybeGetServerSnapshot ? void 0 : function() {
				return memoizedSelector(maybeGetServerSnapshot());
			}];
		}, [
			getSnapshot,
			getServerSnapshot,
			selector,
			isEqual
		]);
		var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
		useEffect(function() {
			inst.hasValue = !0;
			inst.value = value;
		}, [value]);
		useDebugValue(value);
		return value;
	};
}));
//#endregion
//#region node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_with_selector_production();
}));
//#endregion
//#region node_modules/zustand/esm/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_with_selector = /* @__PURE__ */ __toESM(require_with_selector(), 1);
var { useDebugValue } = import_react.default;
var { useSyncExternalStoreWithSelector } = import_with_selector.default;
var identity = (arg) => arg;
function useStore(api, selector = identity, equalityFn) {
	const slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getInitialState, selector, equalityFn);
	useDebugValue(slice);
	return slice;
}
var createImpl = (createState) => {
	const api = typeof createState === "function" ? createStore(createState) : createState;
	const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
	Object.assign(useBoundStore, api);
	return useBoundStore;
};
var create = (createState) => createState ? createImpl(createState) : createImpl;
//#endregion
//#region node_modules/zustand/esm/middleware.mjs
var trackedConnections = /* @__PURE__ */ new Map();
var getTrackedConnectionState = (name) => {
	const api = trackedConnections.get(name);
	if (!api) return {};
	return Object.fromEntries(Object.entries(api.stores).map(([key, api2]) => [key, api2.getState()]));
};
var extractConnectionInformation = (store, extensionConnector, options) => {
	if (store === void 0) return {
		type: "untracked",
		connection: extensionConnector.connect(options)
	};
	const existingConnection = trackedConnections.get(options.name);
	if (existingConnection) return {
		type: "tracked",
		store,
		...existingConnection
	};
	const newConnection = {
		connection: extensionConnector.connect(options),
		stores: {}
	};
	trackedConnections.set(options.name, newConnection);
	return {
		type: "tracked",
		store,
		...newConnection
	};
};
var devtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api) => {
	const { enabled, anonymousActionType, store, ...options } = devtoolsOptions;
	let extensionConnector;
	try {
		extensionConnector = (enabled != null ? enabled : false) && window.__REDUX_DEVTOOLS_EXTENSION__;
	} catch (_e) {}
	if (!extensionConnector) return fn(set, get, api);
	const { connection, ...connectionInformation } = extractConnectionInformation(store, extensionConnector, options);
	let isRecording = true;
	api.setState = (state, replace, nameOrAction) => {
		const r = set(state, replace);
		if (!isRecording) return r;
		const action = nameOrAction === void 0 ? { type: anonymousActionType || "anonymous" } : typeof nameOrAction === "string" ? { type: nameOrAction } : nameOrAction;
		if (store === void 0) {
			connection?.send(action, get());
			return r;
		}
		connection?.send({
			...action,
			type: `${store}/${action.type}`
		}, {
			...getTrackedConnectionState(options.name),
			[store]: api.getState()
		});
		return r;
	};
	const setStateFromDevtools = (...a) => {
		const originalIsRecording = isRecording;
		isRecording = false;
		set(...a);
		isRecording = originalIsRecording;
	};
	const initialState = fn(api.setState, get, api);
	if (connectionInformation.type === "untracked") connection?.init(initialState);
	else {
		connectionInformation.stores[connectionInformation.store] = api;
		connection?.init(Object.fromEntries(Object.entries(connectionInformation.stores).map(([key, store2]) => [key, key === connectionInformation.store ? initialState : store2.getState()])));
	}
	if (api.dispatchFromDevtools && typeof api.dispatch === "function") {
		const originalDispatch = api.dispatch;
		api.dispatch = (...a) => {
			originalDispatch(...a);
		};
	}
	connection.subscribe((message) => {
		var _a;
		switch (message.type) {
			case "ACTION":
				if (typeof message.payload !== "string") {
					console.error("[zustand devtools middleware] Unsupported action format");
					return;
				}
				return parseJsonThen(message.payload, (action) => {
					if (action.type === "__setState") {
						if (store === void 0) {
							setStateFromDevtools(action.state);
							return;
						}
						if (Object.keys(action.state).length !== 1) console.error(`
                    [zustand devtools middleware] Unsupported __setState action format. 
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);
						const stateFromDevtools = action.state[store];
						if (stateFromDevtools === void 0 || stateFromDevtools === null) return;
						if (JSON.stringify(api.getState()) !== JSON.stringify(stateFromDevtools)) setStateFromDevtools(stateFromDevtools);
						return;
					}
					if (!api.dispatchFromDevtools) return;
					if (typeof api.dispatch !== "function") return;
					api.dispatch(action);
				});
			case "DISPATCH":
				switch (message.payload.type) {
					case "RESET":
						setStateFromDevtools(initialState);
						if (store === void 0) return connection == null ? void 0 : connection.init(api.getState());
						return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
					case "COMMIT":
						if (store === void 0) {
							connection?.init(api.getState());
							return;
						}
						return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
					case "ROLLBACK": return parseJsonThen(message.state, (state) => {
						if (store === void 0) {
							setStateFromDevtools(state);
							connection?.init(api.getState());
							return;
						}
						setStateFromDevtools(state[store]);
						connection?.init(getTrackedConnectionState(options.name));
					});
					case "JUMP_TO_STATE":
					case "JUMP_TO_ACTION": return parseJsonThen(message.state, (state) => {
						if (store === void 0) {
							setStateFromDevtools(state);
							return;
						}
						if (JSON.stringify(api.getState()) !== JSON.stringify(state[store])) setStateFromDevtools(state[store]);
					});
					case "IMPORT_STATE": {
						const { nextLiftedState } = message.payload;
						const lastComputedState = (_a = nextLiftedState.computedStates.slice(-1)[0]) == null ? void 0 : _a.state;
						if (!lastComputedState) return;
						if (store === void 0) setStateFromDevtools(lastComputedState);
						else setStateFromDevtools(lastComputedState[store]);
						connection?.send(null, nextLiftedState);
						return;
					}
					case "PAUSE_RECORDING": return isRecording = !isRecording;
				}
				return;
		}
	});
	return initialState;
};
var devtools = devtoolsImpl;
var parseJsonThen = (stringified, f) => {
	let parsed;
	try {
		parsed = JSON.parse(stringified);
	} catch (e) {
		console.error("[zustand devtools middleware] Could not parse the received json", e);
	}
	if (parsed !== void 0) f(parsed);
};
function createJSONStorage(getStorage, options) {
	let storage;
	try {
		storage = getStorage();
	} catch (_e) {
		return;
	}
	return {
		getItem: (name) => {
			var _a;
			const parse = (str2) => {
				if (str2 === null) return null;
				return JSON.parse(str2, options == null ? void 0 : options.reviver);
			};
			const str = (_a = storage.getItem(name)) != null ? _a : null;
			if (str instanceof Promise) return str.then(parse);
			return parse(str);
		},
		setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
		removeItem: (name) => storage.removeItem(name)
	};
}
var toThenable = (fn) => (input) => {
	try {
		const result = fn(input);
		if (result instanceof Promise) return result;
		return {
			then(onFulfilled) {
				return toThenable(onFulfilled)(result);
			},
			catch(_onRejected) {
				return this;
			}
		};
	} catch (e) {
		return {
			then(_onFulfilled) {
				return this;
			},
			catch(onRejected) {
				return toThenable(onRejected)(e);
			}
		};
	}
};
var oldImpl = (config, baseOptions) => (set, get, api) => {
	let options = {
		getStorage: () => localStorage,
		serialize: JSON.stringify,
		deserialize: JSON.parse,
		partialize: (state) => state,
		version: 0,
		merge: (persistedState, currentState) => ({
			...currentState,
			...persistedState
		}),
		...baseOptions
	};
	let hasHydrated = false;
	const hydrationListeners = /* @__PURE__ */ new Set();
	const finishHydrationListeners = /* @__PURE__ */ new Set();
	let storage;
	try {
		storage = options.getStorage();
	} catch (_e) {}
	if (!storage) return config((...args) => {
		console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
		set(...args);
	}, get, api);
	const thenableSerialize = toThenable(options.serialize);
	const setItem = () => {
		const state = options.partialize({ ...get() });
		let errorInSync;
		const thenable = thenableSerialize({
			state,
			version: options.version
		}).then((serializedValue) => storage.setItem(options.name, serializedValue)).catch((e) => {
			errorInSync = e;
		});
		if (errorInSync) throw errorInSync;
		return thenable;
	};
	const savedSetState = api.setState;
	api.setState = (state, replace) => {
		savedSetState(state, replace);
		setItem();
	};
	const configResult = config((...args) => {
		set(...args);
		setItem();
	}, get, api);
	let stateFromStorage;
	const hydrate = () => {
		var _a;
		if (!storage) return;
		hasHydrated = false;
		hydrationListeners.forEach((cb) => cb(get()));
		const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
		return toThenable(storage.getItem.bind(storage))(options.name).then((storageValue) => {
			if (storageValue) return options.deserialize(storageValue);
		}).then((deserializedStorageValue) => {
			if (deserializedStorageValue) if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
				if (options.migrate) return options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
				console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
			} else return deserializedStorageValue.state;
		}).then((migratedState) => {
			var _a2;
			stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
			set(stateFromStorage, true);
			return setItem();
		}).then(() => {
			postRehydrationCallback?.(stateFromStorage, void 0);
			hasHydrated = true;
			finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
		}).catch((e) => {
			postRehydrationCallback?.(void 0, e);
		});
	};
	api.persist = {
		setOptions: (newOptions) => {
			options = {
				...options,
				...newOptions
			};
			if (newOptions.getStorage) storage = newOptions.getStorage();
		},
		clearStorage: () => {
			storage?.removeItem(options.name);
		},
		getOptions: () => options,
		rehydrate: () => hydrate(),
		hasHydrated: () => hasHydrated,
		onHydrate: (cb) => {
			hydrationListeners.add(cb);
			return () => {
				hydrationListeners.delete(cb);
			};
		},
		onFinishHydration: (cb) => {
			finishHydrationListeners.add(cb);
			return () => {
				finishHydrationListeners.delete(cb);
			};
		}
	};
	hydrate();
	return stateFromStorage || configResult;
};
var newImpl = (config, baseOptions) => (set, get, api) => {
	let options = {
		storage: createJSONStorage(() => localStorage),
		partialize: (state) => state,
		version: 0,
		merge: (persistedState, currentState) => ({
			...currentState,
			...persistedState
		}),
		...baseOptions
	};
	let hasHydrated = false;
	const hydrationListeners = /* @__PURE__ */ new Set();
	const finishHydrationListeners = /* @__PURE__ */ new Set();
	let storage = options.storage;
	if (!storage) return config((...args) => {
		console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
		set(...args);
	}, get, api);
	const setItem = () => {
		const state = options.partialize({ ...get() });
		return storage.setItem(options.name, {
			state,
			version: options.version
		});
	};
	const savedSetState = api.setState;
	api.setState = (state, replace) => {
		savedSetState(state, replace);
		setItem();
	};
	const configResult = config((...args) => {
		set(...args);
		setItem();
	}, get, api);
	api.getInitialState = () => configResult;
	let stateFromStorage;
	const hydrate = () => {
		var _a, _b;
		if (!storage) return;
		hasHydrated = false;
		hydrationListeners.forEach((cb) => {
			var _a2;
			return cb((_a2 = get()) != null ? _a2 : configResult);
		});
		const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
		return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
			if (deserializedStorageValue) if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
				if (options.migrate) return [true, options.migrate(deserializedStorageValue.state, deserializedStorageValue.version)];
				console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
			} else return [false, deserializedStorageValue.state];
			return [false, void 0];
		}).then((migrationResult) => {
			var _a2;
			const [migrated, migratedState] = migrationResult;
			stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
			set(stateFromStorage, true);
			if (migrated) return setItem();
		}).then(() => {
			postRehydrationCallback?.(stateFromStorage, void 0);
			stateFromStorage = get();
			hasHydrated = true;
			finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
		}).catch((e) => {
			postRehydrationCallback?.(void 0, e);
		});
	};
	api.persist = {
		setOptions: (newOptions) => {
			options = {
				...options,
				...newOptions
			};
			if (newOptions.storage) storage = newOptions.storage;
		},
		clearStorage: () => {
			storage?.removeItem(options.name);
		},
		getOptions: () => options,
		rehydrate: () => hydrate(),
		hasHydrated: () => hasHydrated,
		onHydrate: (cb) => {
			hydrationListeners.add(cb);
			return () => {
				hydrationListeners.delete(cb);
			};
		},
		onFinishHydration: (cb) => {
			finishHydrationListeners.add(cb);
			return () => {
				finishHydrationListeners.delete(cb);
			};
		}
	};
	if (!options.skipHydration) hydrate();
	return stateFromStorage || configResult;
};
var persistImpl = (config, baseOptions) => {
	if ("getStorage" in baseOptions || "serialize" in baseOptions || "deserialize" in baseOptions) return oldImpl(config, baseOptions);
	return newImpl(config, baseOptions);
};
var persist = persistImpl;
//#endregion
export { persist as n, create as r, devtools as t };
