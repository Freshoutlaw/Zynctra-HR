import { a as __toESM, r as __exportAll } from "./rolldown-runtime-_TIqcEvS.js";
import { a as Navigate, c as useLocation, d as require_react, i as useSearchParams, l as useNavigate, n as BrowserRouter, o as Route, r as Link, s as Routes, t as require_jsx_dev_runtime, u as require_client } from "./react-vendor-CvsQKb8k.js";
import { i as motion, n as __vitePreload, r as AnimatePresence, t as createClient } from "./ui-vendor-2lmFVL1G.js";
import { n as persist, r as create$1, t as devtools } from "./utils-DPqgso_G.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/hooks/useAuth.ts
var import_client = /* @__PURE__ */ __toESM(require_client(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var AuthContext$1 = import_react.createContext(void 0);
var useAuth = () => {
	const context = (0, import_react.useContext)(AuthContext$1);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
/**
* Utility functions for secure token management
*/
var STORAGE_PREFIX$1 = "__zynctra__";
`${STORAGE_PREFIX$1}`;
`${STORAGE_PREFIX$1}`;
/**
* /frontend/src/hooks/useAuth.ts
*
* Re-exports the useAuth hook and all auth utilities from AuthContext
* so existing imports of '../../hooks/useAuth' continue to work.
*/
//#endregion
//#region src/types/billing.types.ts
/**
* /frontend/src/types/billing.types.ts
* 
* Complete type definitions for billing, subscriptions, and payment processing
*/
var SubscriptionPlan = /* @__PURE__ */ function(SubscriptionPlan) {
	SubscriptionPlan["FREE"] = "FREE";
	SubscriptionPlan["STANDARD"] = "STANDARD";
	SubscriptionPlan["PREMIUM"] = "PREMIUM";
	return SubscriptionPlan;
}({});
var BillingPeriod = /* @__PURE__ */ function(BillingPeriod) {
	BillingPeriod["MONTHLY"] = "MONTHLY";
	BillingPeriod["ANNUAL"] = "ANNUAL";
	return BillingPeriod;
}({});
var PaymentStatus = /* @__PURE__ */ function(PaymentStatus) {
	PaymentStatus["PENDING"] = "PENDING";
	PaymentStatus["PROCESSING"] = "PROCESSING";
	PaymentStatus["COMPLETED"] = "COMPLETED";
	PaymentStatus["FAILED"] = "FAILED";
	PaymentStatus["CANCELLED"] = "CANCELLED";
	PaymentStatus["REFUNDED"] = "REFUNDED";
	return PaymentStatus;
}({});
var PaymentProvider = /* @__PURE__ */ function(PaymentProvider) {
	PaymentProvider["PAYSTACK"] = "PAYSTACK";
	PaymentProvider["STRIPE"] = "STRIPE";
	PaymentProvider["CUSTOM"] = "CUSTOM";
	return PaymentProvider;
}({});
//#endregion
//#region \0@oxc-project+runtime@0.132.0/helpers/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.132.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.132.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.132.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region src/services/billing/featureFlags.ts
var DEFAULT_FLAGS = {
	monetizationEnabled: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_MONETIZATION_ENABLED"] === "true",
	freeMode: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_FREE_MODE"] !== "false",
	allowedPlans: [
		SubscriptionPlan.FREE,
		SubscriptionPlan.STANDARD,
		SubscriptionPlan.PREMIUM
	],
	defaultPlan: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_DEFAULT_PLAN"] ?? SubscriptionPlan.FREE,
	trialDaysCount: parseInt({
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_TRIAL_DAYS"] ?? "14", 10),
	primaryPaymentProvider: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_PAYMENT_PROVIDER"] ?? PaymentProvider.PAYSTACK,
	currencies: ({
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_CURRENCIES"] ?? "USD,NGN,EUR").split(","),
	requirePaymentMethod: {
		"BASE_URL": "/",
		"DEV": true,
		"MODE": "production",
		"PROD": false,
		"REACT_APP_ANALYTICS_ENABLED": "true",
		"REACT_APP_ANIMATIONS_ENABLED": "true",
		"REACT_APP_API_TIMEOUT": "30000",
		"REACT_APP_API_URL": "https://api.zynctra.com/api",
		"REACT_APP_AUTO_LOGOUT": "true",
		"REACT_APP_COMPANY_NAME": "Zynctra HR",
		"REACT_APP_CORS_CREDENTIALS": "true",
		"REACT_APP_CSP_ENABLED": "true",
		"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
		"REACT_APP_DATA_RESIDENCY": "US_EAST",
		"REACT_APP_DEBUG": "false",
		"REACT_APP_DEFAULT_PLAN": "FREE",
		"REACT_APP_DEFAULT_THEME": "system",
		"REACT_APP_ENABLE_AI_ASSISTANT": "true",
		"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
		"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
		"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
		"REACT_APP_ENFORCE_HTTPS": "true",
		"REACT_APP_ENV": "production",
		"REACT_APP_FEATURE_ANALYTICS": "true",
		"REACT_APP_FEATURE_COMPLIANCE": "false",
		"REACT_APP_FEATURE_PAYROLL": "false",
		"REACT_APP_FEATURE_TERMINAL": "false",
		"REACT_APP_FREE_MODE": "true",
		"REACT_APP_GA_ID": "",
		"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
		"REACT_APP_LLM_PROVIDER": "groq",
		"REACT_APP_LOG_LEVEL": "warn",
		"REACT_APP_MFA_REQUIRED": "true",
		"REACT_APP_MONETIZATION_ENABLED": "false",
		"REACT_APP_PAYMENT_PROVIDER": "paystack",
		"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
		"REACT_APP_REQUEST_TIMEOUT": "30000",
		"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
		"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
		"REACT_APP_SENTRY_DSN": "",
		"REACT_APP_SESSION_TIMEOUT": "3600000",
		"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
		"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
		"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
		"REACT_APP_TENANT_ID": "default",
		"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
		"REACT_APP_TRIAL_DAYS": "14",
		"REACT_APP_VERSION": "1.0.0",
		"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
		"SSR": false,
		"VITE_USER_NODE_ENV": "development"
	}["VITE_REQUIRE_PAYMENT_METHOD"] === "true"
};
var API_BASE$4 = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_API_URL"] ?? "";
var FeatureFlagService = class {
	constructor() {
		_defineProperty(this, "flags", { ...DEFAULT_FLAGS });
		_defineProperty(this, "monetizationSettings", null);
		_defineProperty(this, "initialised", false);
	}
	async initialize() {
		if (this.initialised) return;
		try {
			const res = await fetch(`${API_BASE$4}/admin/billing-config`, { credentials: "include" });
			if (res.ok) {
				const data = await res.json();
				if (data.flags) this.flags = {
					...this.flags,
					...data.flags
				};
				if (data.monetizationSettings) this.monetizationSettings = data.monetizationSettings;
			}
		} catch {} finally {
			this.initialised = true;
		}
	}
	isMonetizationEnabled() {
		return this.flags.monetizationEnabled && !this.flags.freeMode;
	}
	isFreeModeActive() {
		return this.flags.freeMode;
	}
	isPlanAllowed(plan) {
		return this.flags.allowedPlans.includes(plan);
	}
	getDefaultPlan() {
		return this.flags.defaultPlan;
	}
	getTrialDays() {
		return this.flags.trialDaysCount;
	}
	getPrimaryPaymentProvider() {
		return this.flags.primaryPaymentProvider;
	}
	getAllowedCurrencies() {
		return this.flags.currencies;
	}
	isPaymentMethodRequired() {
		return this.flags.requirePaymentMethod;
	}
	shouldEnforceBilling() {
		return this.isMonetizationEnabled() && !this.isFreeModeActive();
	}
	getFlags() {
		return { ...this.flags };
	}
	getMonetizationSettings() {
		return this.monetizationSettings ? { ...this.monetizationSettings } : null;
	}
	canChangePlan() {
		return !this.isFreeModeActive();
	}
	canDowngrade() {
		return !this.isFreeModeActive() && this.monetizationSettings?.allowDowngrade !== false;
	}
	canUpgrade() {
		return !this.isFreeModeActive();
	}
};
var instance = null;
var getFeatureFlagService = () => {
	if (!instance) instance = new FeatureFlagService();
	return instance;
};
var PREMIUM_FEATURES = new Set([
	"advanced_analytics",
	"ai_copilot",
	"payroll_tools",
	"compliance_tools",
	"audit_tools",
	"priority_support",
	"sso",
	"advanced_integrations"
]);
var STANDARD_FEATURES = new Set([
	"automation",
	"basic_ai",
	"advanced_reporting"
]);
var FeatureAccessManager = class {
	static canAccessFeature(feature, userPlan) {
		if (userPlan === SubscriptionPlan.PREMIUM) return true;
		if (userPlan === SubscriptionPlan.STANDARD) return !PREMIUM_FEATURES.has(feature);
		return !PREMIUM_FEATURES.has(feature) && !STANDARD_FEATURES.has(feature);
	}
	static getLockedFeatures(plan) {
		return [...PREMIUM_FEATURES, ...STANDARD_FEATURES].filter((f) => !this.canAccessFeature(f, plan));
	}
	static getMinimumPlanForFeature(feature) {
		if (PREMIUM_FEATURES.has(feature)) return SubscriptionPlan.PREMIUM;
		if (STANDARD_FEATURES.has(feature)) return SubscriptionPlan.STANDARD;
		return SubscriptionPlan.FREE;
	}
};
//#endregion
//#region src/pages/LoadingPage.tsx
/**
* /frontend/src/pages/LoadingPage.tsx
*
* Cinematic loading splash shown while auth state is resolving.
* Fixed: does not auto-navigate — that responsibility is in App.tsx.
* This component is purely visual; it renders until isLoading is false.
*/
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$19 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/LoadingPage.tsx";
var LoadingPage = ({ message = "Initialising secure systems…" }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute inset-0 opacity-5",
				style: {
					backgroundImage: "linear-gradient(90deg,#00d9ff 1px,transparent 1px),linear-gradient(#00d9ff 1px,transparent 1px)",
					backgroundSize: "50px 50px"
				}
			}, void 0, false, {
				fileName: _jsxFileName$19,
				lineNumber: 22,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative z-10 flex flex-col items-center gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						initial: {
							opacity: 0,
							scale: .6
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: .8,
							ease: "easeOut"
						},
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.svg, {
							viewBox: "0 0 200 200",
							className: "w-32 h-32",
							xmlns: "http://www.w3.org/2000/svg",
							"aria-label": "Zynctra logo",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
								stroke: "#00d9ff",
								strokeWidth: "3",
								fill: "none",
								strokeLinecap: "round",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.path, {
										d: "M 50 50 L 100 50 L 75 80 Z",
										initial: { pathLength: 0 },
										animate: { pathLength: 1 },
										transition: {
											duration: .6,
											delay: .1
										}
									}, void 0, false, {
										fileName: _jsxFileName$19,
										lineNumber: 45,
										columnNumber: 15
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.path, {
										d: "M 100 50 L 150 50 L 125 80 Z",
										initial: { pathLength: 0 },
										animate: { pathLength: 1 },
										transition: {
											duration: .6,
											delay: .2
										}
									}, void 0, false, {
										fileName: _jsxFileName$19,
										lineNumber: 51,
										columnNumber: 15
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.path, {
										d: "M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z",
										fill: "#00d9ff",
										initial: { opacity: 0 },
										animate: { opacity: 1 },
										transition: {
											duration: .4,
											delay: .5
										}
									}, void 0, false, {
										fileName: _jsxFileName$19,
										lineNumber: 57,
										columnNumber: 15
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.path, {
										d: "M 50 150 L 75 120 L 100 150 Z",
										initial: { pathLength: 0 },
										animate: { pathLength: 1 },
										transition: {
											duration: .6,
											delay: .3
										}
									}, void 0, false, {
										fileName: _jsxFileName$19,
										lineNumber: 64,
										columnNumber: 15
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.path, {
										d: "M 100 150 L 125 120 L 150 150 Z",
										initial: { pathLength: 0 },
										animate: { pathLength: 1 },
										transition: {
											duration: .6,
											delay: .4
										}
									}, void 0, false, {
										fileName: _jsxFileName$19,
										lineNumber: 70,
										columnNumber: 15
									}, void 0)
								]
							}, void 0, true, {
								fileName: _jsxFileName$19,
								lineNumber: 44,
								columnNumber: 13
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$19,
							lineNumber: 38,
							columnNumber: 11
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$19,
						lineNumber: 33,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "text-center",
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: .6,
							duration: .6
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-4xl font-bold text-white mb-2 tracking-tight",
							children: "Zynctra HR"
						}, void 0, false, {
							fileName: _jsxFileName$19,
							lineNumber: 87,
							columnNumber: 11
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-cyan-300 font-light tracking-wide",
							children: "All-in-One HR Platform"
						}, void 0, false, {
							fileName: _jsxFileName$19,
							lineNumber: 90,
							columnNumber: 11
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$19,
						lineNumber: 81,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "w-48 h-1 bg-slate-700 rounded-full overflow-hidden",
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: .8 },
						role: "progressbar",
						"aria-label": "Loading",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full",
							initial: {
								scaleX: 0,
								originX: 0
							},
							animate: { scaleX: 1 },
							transition: {
								duration: 2,
								ease: "easeInOut",
								delay: .9
							}
						}, void 0, false, {
							fileName: _jsxFileName$19,
							lineNumber: 104,
							columnNumber: 11
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$19,
						lineNumber: 96,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.p, {
						className: "text-sm text-slate-400 tracking-wider",
						initial: { opacity: 0 },
						animate: { opacity: [
							.5,
							1,
							.5
						] },
						transition: {
							duration: 2,
							repeat: Infinity,
							delay: 1.2
						},
						children: message
					}, void 0, false, {
						fileName: _jsxFileName$19,
						lineNumber: 113,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$19,
				lineNumber: 31,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: "absolute bottom-8 right-8 w-8 h-8 border-2 border-cyan-500 rounded-lg rotate-45 opacity-30",
				initial: { opacity: 0 },
				animate: { opacity: .3 },
				transition: { delay: 1.5 }
			}, void 0, false, {
				fileName: _jsxFileName$19,
				lineNumber: 124,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$19,
		lineNumber: 20,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.7/LICENSE */
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
var entries = Object.entries, setPrototypeOf = Object.setPrototypeOf, isFrozen = Object.isFrozen, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze, seal = Object.seal, create = Object.create;
var _ref = typeof Reflect !== "undefined" && Reflect, apply = _ref.apply, construct = _ref.construct;
if (!freeze) freeze = function freeze(x) {
	return x;
};
if (!seal) seal = function seal(x) {
	return x;
};
if (!apply) apply = function apply(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var arrayIsArray = Array.isArray;
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var numberToString = unapply(Number.prototype.toString);
var booleanToString = unapply(Boolean.prototype.toString);
var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var objectToString = unapply(Object.prototype.toString);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) if (arrayIsArray(value)) newObject[property] = cleanArray(value);
		else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
		else newObject[property] = value;
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
var html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
var svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
var svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
var svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
var mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
var mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
var text = freeze(["#text"]);
var html = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
var svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
var mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
var xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	progressingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
var getGlobal = function getGlobal() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html) {
				return html;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
var _createHooksMap = function _createHooksMap() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
function createDOMPurify() {
	let window = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.7";
	DOMPurify.removed = [];
	if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document = window.document;
	const originalDocument = document;
	const currentScript = originalDocument.currentScript;
	window.DocumentFragment;
	const HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, Element = window.Element, NodeFilter = window.NodeFilter;
	window.NamedNodeMap === void 0 && (window.NamedNodeMap || window.MozNamedAttrMap);
	window.HTMLFormElement;
	const DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	if (typeof HTMLTemplateElement === "function") {
		const template = document.createElement("template");
		if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, [
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") && arrayIsArray(cfg.ALLOWED_TAGS) ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
		ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") && arrayIsArray(cfg.ALLOWED_ATTR) ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
		ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") && arrayIsArray(cfg.ALLOWED_NAMESPACES) ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
		URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR) ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
		DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") && arrayIsArray(cfg.ADD_DATA_URI_TAGS) ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
		FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS) ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
		FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") && arrayIsArray(cfg.FORBID_TAGS) ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
		FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") && arrayIsArray(cfg.FORBID_ATTR) ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, [
			"mi",
			"mo",
			"mn",
			"ms",
			"mtext"
		]);
		HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, ["annotation-xml"]);
		const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
		if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			emptyHTML = trustedTypesPolicy.createHTML("");
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			if (trustedTypesPolicy !== null && typeof emptyHTML === "string") emptyHTML = trustedTypesPolicy.createHTML("");
		}
		if ((hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) && ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0 && ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) {
			if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
			if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
			return Boolean(ALL_SVG_TAGS[tagName]);
		}
		if (element.namespaceURI === MATHML_NAMESPACE) {
			if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
			if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
			return Boolean(ALL_MATHML_TAGS[tagName]);
		}
		if (element.namespaceURI === HTML_NAMESPACE) {
			if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
			if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
			return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
		}
	};
	/**
	* _removeAttribute
	*
	* @param name an Attribute name
	* @param element a DOM node
	*/
	const _removeAttribute = function _removeAttribute(name, element) {
		try {
			arrayPush(DOMPurify.removed, {
				attribute: element.getAttributeNode(name),
				from: element
			});
		} catch (_) {
			arrayPush(DOMPurify.removed, {
				attribute: null,
				from: element
			});
		}
		element.removeAttribute(name);
		if (name === "is") if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
			_forceRemove(element);
		} catch (_) {}
		else try {
			element.setAttribute(name, "");
		} catch (_) {}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator(root) {
		return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions = function _scrubTemplateExpressions(node) {
		node.normalize();
		const walker = createNodeIterator.call(node.ownerDocument || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			let data = currentNode.data;
			arrayForEach([
				MUSTACHE_EXPR$1,
				ERB_EXPR$1,
				TMPLIT_EXPR$1
			], (expr) => {
				data = stringReplace(data, expr, " ");
			});
			currentNode.data = data;
			currentNode = walker.nextNode();
		}
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks, currentNode, data) {
		arrayForEach(hooks, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements(currentNode) {
		let content = null;
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(currentNode.nodeName);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
			_forceRemove(currentNode);
			return true;
		}
		if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
				if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
				if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
			}
			if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
				const parentNode = getParentNode(currentNode);
				const childNodes = getChildNodes(currentNode);
				if (childNodes && parentNode) {
					const childCount = childNodes.length;
					for (let i = childCount - 1; i >= 0; --i) {
						const childClone = cloneNode(childNodes[i], true);
						parentNode.insertBefore(childClone, getNextSibling(currentNode));
					}
				}
			}
			_forceRemove(currentNode);
			return true;
		}
		if ((getNodeType ? getNodeType(currentNode) : currentNode.nodeType) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			content = currentNode.textContent;
			arrayForEach([
				MUSTACHE_EXPR$1,
				ERB_EXPR$1,
				TMPLIT_EXPR$1
			], (expr) => {
				content = stringReplace(content, expr, " ");
			});
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return false;
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName));
		else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName));
		else if (!nameIsPermitted || FORBID_ATTR[lcName]) if (_isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value)));
		else return false;
		else if (URI_SAFE_ATTRIBUTES[lcName]);
		else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]);
		else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if (value) return false;
		return true;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	*/
	const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) arrayForEach([
				MUSTACHE_EXPR$1,
				ERB_EXPR$1,
				TMPLIT_EXPR$1
			], (expr) => {
				value = stringReplace(value, expr, " ");
			});
			const lcTag = transformCaseFunc(currentNode.nodeName);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") if (namespaceURI);
			else switch (trustedTypes.getAttributeType(lcTag, lcName)) {
				case "TrustedHTML":
					value = trustedTypesPolicy.createHTML(value);
					break;
				case "TrustedScriptURL":
					value = trustedTypesPolicy.createScriptURL(value);
					break;
			}
			if (value !== initValue) try {
				if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
				else currentNode.setAttribute(name, value);
				if (_isClobbered(currentNode)) _forceRemove(currentNode);
				else arrayPop(DOMPurify.removed);
			} catch (_) {
				_removeAttribute(name, currentNode);
			}
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode);
			_sanitizeAttributes(shadowNode);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if ((getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType) === NODE_TYPE.element) {
				const innerSr = getShadowRoot ? getShadowRoot(shadowNode) : shadowNode.shadowRoot;
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots2(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots2 = function _sanitizeAttachedShadowRoots(root) {
		const nodeType = getNodeType ? getNodeType(root) : root.nodeType;
		if (nodeType === NODE_TYPE.element) {
			const sr = getShadowRoot ? getShadowRoot(root) : root.shadowRoot;
			if (_isDocumentFragment(sr)) {
				_sanitizeAttachedShadowRoots2(sr);
				_sanitizeShadowDOM2(sr);
			}
		}
		const childNodes = getChildNodes ? getChildNodes(root) : root.childNodes;
		if (!childNodes) return;
		const snapshot = [];
		arrayForEach(childNodes, (child) => {
			arrayPush(snapshot, child);
		});
		for (const child of snapshot) _sanitizeAttachedShadowRoots2(child);
		if (nodeType === NODE_TYPE.element) {
			const rootName = getNodeName ? getNodeName(root) : null;
			if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
				const content = root.content;
				if (_isDocumentFragment(content)) _sanitizeAttachedShadowRoots2(content);
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (!SET_CONFIG) _parseConfig(cfg);
		DOMPurify.removed = [];
		if (typeof dirty === "string") IN_PLACE = false;
		if (IN_PLACE) {
			const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
			}
			if (_isClobbered(dirty)) throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			_sanitizeAttachedShadowRoots2(dirty);
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots2(importedNode);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
		while (currentNode = nodeIterator.nextNode()) {
			_sanitizeElements(currentNode);
			_sanitizeAttributes(currentNode);
			if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
		}
		if (IN_PLACE) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) arrayForEach([
			MUSTACHE_EXPR$1,
			ERB_EXPR$1,
			TMPLIT_EXPR$1
		], (expr) => {
			serializedHTML = stringReplace(serializedHTML, expr, " ");
		});
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		_parseConfig(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {});
		SET_CONFIG = true;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
	};
	DOMPurify.isValidAttribute = function(tag, attr, value) {
		if (!CONFIG) _parseConfig({});
		return _isValidAttribute(transformCaseFunc(tag), transformCaseFunc(attr), value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify = createDOMPurify();
//#endregion
//#region src/pages/LandingPage.tsx
var _jsxFileName$18 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/LandingPage.tsx";
/**
* Feature card component with hover effects
*/
var FeatureCard = ({ feature, index }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "group relative p-8 rounded-lg border border-slate-700 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300",
		initial: {
			opacity: 0,
			y: 20
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: index * .1,
			duration: .5
		},
		viewport: { once: true },
		whileHover: { y: -4 },
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-cyan-500/10 transition-opacity duration-300" }, void 0, false, {
			fileName: _jsxFileName$18,
			lineNumber: 53,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300",
					children: feature.icon
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 57,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "text-xl font-semibold text-white mb-3",
					children: feature.title
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 60,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-slate-400 leading-relaxed",
					children: feature.description
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 61,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$18,
			lineNumber: 56,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$18,
		lineNumber: 44,
		columnNumber: 5
	}, void 0);
};
/**
* Pricing tier card component
*/
var PricingCard = ({ tier, onSelect }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: `relative rounded-xl p-8 transition-all duration-300 ${tier.highlighted ? "border-2 border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900 scale-105 shadow-2xl shadow-cyan-500/20" : "border border-slate-700 bg-slate-800/40 backdrop-blur-sm"}`,
		initial: {
			opacity: 0,
			y: 20
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .5 },
		viewport: { once: true },
		whileHover: { y: tier.highlighted ? 0 : -8 },
		children: [
			tier.highlighted && /* @__PURE__ */ (void 0)(motion.div, {
				className: "absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold text-sm rounded-full",
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .3 },
				children: "Most Popular"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 89,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "text-2xl font-bold text-white mb-2",
						children: tier.name
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 100,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-slate-400 text-sm mb-6",
						children: tier.description
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 101,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-5xl font-bold text-white",
							children: ["$", tier.price]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 103,
							columnNumber: 11
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-slate-400",
							children: ["/ ", tier.billingPeriod]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 104,
							columnNumber: 11
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 102,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$18,
				lineNumber: 99,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "space-y-4 mb-8",
				children: tier.features.map((feature, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						className: "w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5",
						fill: "currentColor",
						viewBox: "0 0 20 20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							fillRule: "evenodd",
							d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
							clipRule: "evenodd"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 117,
							columnNumber: 15
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 112,
						columnNumber: 13
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-slate-300 text-sm",
						children: feature
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 123,
						columnNumber: 13
					}, void 0)]
				}, idx, true, {
					fileName: _jsxFileName$18,
					lineNumber: 111,
					columnNumber: 11
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 109,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => onSelect(tier.id),
				className: `w-full py-3 rounded-lg font-semibold transition-all duration-300 ${tier.highlighted ? "bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50" : "bg-slate-700 text-white hover:bg-slate-600"}`,
				"aria-label": `Select ${tier.name} pricing plan`,
				children: tier.cta
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 129,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$18,
		lineNumber: 75,
		columnNumber: 5
	}, void 0);
};
/**
* Testimonial card component
*/
var TestimonialCard = ({ testimonial, index }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "p-8 rounded-lg border border-slate-700 bg-slate-800/40 backdrop-blur-sm",
		initial: {
			opacity: 0,
			scale: .95
		},
		whileInView: {
			opacity: 1,
			scale: 1
		},
		transition: {
			delay: index * .1,
			duration: .5
		},
		viewport: { once: true },
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-1 mb-4",
				children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					className: "w-5 h-5 text-cyan-400",
					fill: "currentColor",
					viewBox: "0 0 20 20",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 163,
						columnNumber: 13
					}, void 0)
				}, i, false, {
					fileName: _jsxFileName$18,
					lineNumber: 162,
					columnNumber: 11
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 160,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-slate-300 mb-6 leading-relaxed italic",
				children: [
					"\"",
					testimonial.quote,
					"\""
				]
			}, void 0, true, {
				fileName: _jsxFileName$18,
				lineNumber: 169,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
					src: testimonial.avatar,
					alt: testimonial.author,
					className: "w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600",
					onError: (e) => {
						e.target.src = "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"%2300d9ff\" viewBox=\"0 0 24 24\"%3E%3Cpath d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z\" /%3E%3C/svg%3E";
					}
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 173,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-white font-semibold",
					children: testimonial.author
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 182,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-slate-400 text-sm",
					children: [
						testimonial.role,
						" at ",
						testimonial.company
					]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 183,
					columnNumber: 11
				}, void 0)] }, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 181,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$18,
				lineNumber: 172,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$18,
		lineNumber: 152,
		columnNumber: 5
	}, void 0);
};
/**
* LandingPage Component
*
* Premium corporate landing page featuring:
* - Hero section with call-to-action
* - Feature showcase grid
* - Transparent pricing tiers
* - Customer testimonials
* - Security-hardened forms
* - Responsive mobile-first design
* - Accessibility compliance (WCAG 2.1)
*/
var LandingPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [emailError, setEmailError] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	/**
	* Validate email address
	*/
	const validateEmail = (0, import_react.useCallback)((value) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
	}, []);
	/**
	* Sanitize email input using DOMPurify
	*/
	const sanitizeInput = (0, import_react.useCallback)((input) => {
		return purify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
	}, []);
	/**
	* Handle email subscription with validation and sanitization
	*/
	const handleEmailSubmit = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setEmailError("");
		const sanitizedEmail = sanitizeInput(email);
		if (!sanitizedEmail) {
			setEmailError("Please enter an email address");
			return;
		}
		if (!validateEmail(sanitizedEmail)) {
			setEmailError("Please enter a valid email address");
			return;
		}
		setEmail(sanitizedEmail);
		setSubmitted(true);
		setTimeout(() => {
			setEmail("");
			setSubmitted(false);
		}, 3e3);
	}, [
		email,
		sanitizeInput,
		validateEmail
	]);
	/**
	* Handle input change with real-time validation
	*/
	const handleEmailChange = (0, import_react.useCallback)((e) => {
		const value = e.target.value;
		setEmail(value);
		if (value && !validateEmail(value)) setEmailError("Invalid email format");
		else setEmailError("");
	}, [validateEmail]);
	/**
	* Handle pricing tier selection
	*/
	const handleSelectPlan = (0, import_react.useCallback)((tierId) => {
		navigate(`/login?plan=${tierId}`);
	}, [navigate]);
	const features = (0, import_react.useMemo)(() => [
		{
			id: "integration",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "🔗"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 290,
				columnNumber: 15
			}, void 0),
			title: "Unified Platform",
			description: "Consolidate all HR functions in one intuitive system, eliminating data silos and manual workarounds."
		},
		{
			id: "security",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "🔐"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 296,
				columnNumber: 15
			}, void 0),
			title: "Enterprise Security",
			description: "Industry-leading security with MFA, encryption, audit logging, and autonomous anomaly detection."
		},
		{
			id: "ai",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "✨"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 302,
				columnNumber: 15
			}, void 0),
			title: "AI-Powered Insights",
			description: "Intelligent assistance for policy drafting, compensation analysis, and predictive attrition modeling."
		},
		{
			id: "payroll",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "💰"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 308,
				columnNumber: 15
			}, void 0),
			title: "Global Payroll",
			description: "Multi-country payroll automation with tax compliance, direct deposit, and comprehensive audit trails."
		},
		{
			id: "mobile",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "📱"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 314,
				columnNumber: 15
			}, void 0),
			title: "Mobile-First",
			description: "Fully responsive design enabling employees to access time tracking, requests, and payslips anywhere."
		},
		{
			id: "connectors",
			icon: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-white text-xl",
				children: "⚡"
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 320,
				columnNumber: 15
			}, void 0),
			title: "Native Integrations",
			description: "Pre-built connectors to Workday, Slack, QuickBooks, Greenhouse, and 100+ enterprise platforms."
		}
	], []);
	const pricingTiers = (0, import_react.useMemo)(() => [
		{
			id: "startup",
			name: "Startup",
			price: 199,
			billingPeriod: "month",
			description: "Perfect for growing businesses (10-100 employees)",
			features: [
				"Core HR module",
				"Basic time tracking",
				"Employee self-service",
				"Standard reporting",
				"Email support",
				"Up to 100 employees"
			],
			cta: "Start Free Trial",
			highlighted: false
		},
		{
			id: "business",
			name: "Business",
			price: 599,
			billingPeriod: "month",
			description: "Comprehensive solution for mid-market companies (100-500 employees)",
			features: [
				"All Startup features",
				"Built-in payroll engine",
				"Applicant tracking (ATS)",
				"Benefits administration",
				"Performance management",
				"Advanced workflows",
				"Phone + chat support",
				"24/7 uptime SLA"
			],
			cta: "Start Free Trial",
			highlighted: true
		},
		{
			id: "enterprise",
			name: "Enterprise",
			price: 1299,
			billingPeriod: "month",
			description: "Full-featured platform for large organizations (500+ employees)",
			features: [
				"All Business features",
				"Global payroll (multi-country)",
				"Advanced AI assistant",
				"Custom integrations",
				"Learning management (LMS)",
				"Dedicated account manager",
				"Priority 24/7 support",
				"Custom SLA & deployment",
				"Admin security console"
			],
			cta: "Schedule Demo",
			highlighted: false
		}
	], []);
	const testimonials = (0, import_react.useMemo)(() => [
		{
			id: "1",
			quote: "Zynctra consolidated our HR, payroll, and recruitment into one platform. We reduced manual data entry by 80% and saved our team weeks every quarter.",
			author: "Sarah Chen",
			role: "Chief People Officer",
			company: "TechCorp",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
		},
		{
			id: "2",
			quote: "The security and compliance features gave us peace of mind. Transparent pricing meant no surprise fees, and the AI assistant helped us draft policies in minutes.",
			author: "Marcus Johnson",
			role: "HR Director",
			company: "FinanceFlow",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
		},
		{
			id: "3",
			quote: "Multi-country payroll was a nightmare before. Now we handle employees across 8 countries with confidence. The audit logs are exceptional.",
			author: "Elena Rodriguez",
			role: "Global HR Manager",
			company: "GlobalVentures",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
		}
	], []);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "fixed top-0 z-50 w-full border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "flex items-center gap-2",
						initial: {
							opacity: 0,
							x: -20
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: { duration: .5 },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
							viewBox: "0 0 200 200",
							className: "w-8 h-8",
							xmlns: "http://www.w3.org/2000/svg",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
								stroke: "#00d9ff",
								strokeWidth: "2",
								fill: "none",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 50 50 L 100 50 L 75 80 Z" }, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 438,
										columnNumber: 17
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 100 50 L 150 50 L 125 80 Z" }, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 439,
										columnNumber: 17
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
										d: "M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z",
										fill: "#00d9ff"
									}, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 440,
										columnNumber: 17
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 50 150 L 75 120 L 100 150 Z" }, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 441,
										columnNumber: 17
									}, void 0),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 100 150 L 125 120 L 150 150 Z" }, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 442,
										columnNumber: 17
									}, void 0)
								]
							}, void 0, true, {
								fileName: _jsxFileName$18,
								lineNumber: 437,
								columnNumber: 15
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 436,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-bold text-lg",
							children: "Zynctra"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 445,
							columnNumber: 13
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 430,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						onClick: () => navigate("/login"),
						className: "px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300",
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						children: "Sign In"
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 448,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 429,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 428,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "relative pt-32 pb-20 px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "text-center mb-16",
						initial: {
							opacity: 0,
							y: 30
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .8 },
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent",
								children: "The Enterprise HR Platform Built for Today"
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 468,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed",
								children: "Unified Core HR, Payroll, Talent Acquisition, and AI-powered insights. Transparent pricing. Industry-leading security. No hidden fees."
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 471,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col sm:flex-row gap-4 justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: () => navigate("/login?action=signup"),
									className: "px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300",
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									children: "Start Free Trial"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 478,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: () => {
										document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
									},
									className: "px-8 py-4 rounded-lg border-2 border-cyan-400 text-cyan-300 font-bold text-lg hover:bg-cyan-400/10 transition-all duration-300",
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									children: "View Pricing"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 486,
									columnNumber: 15
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$18,
								lineNumber: 477,
								columnNumber: 13
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 462,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "relative h-96 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden",
						initial: {
							opacity: 0,
							y: 40
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .8,
							delay: .2
						},
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
								viewBox: "0 0 200 200",
								className: "w-32 h-32 opacity-30",
								xmlns: "http://www.w3.org/2000/svg",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
									stroke: "#00d9ff",
									strokeWidth: "2",
									fill: "none",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 50 50 L 100 50 L 75 80 Z" }, void 0, false, {
											fileName: _jsxFileName$18,
											lineNumber: 509,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 100 50 L 150 50 L 125 80 Z" }, void 0, false, {
											fileName: _jsxFileName$18,
											lineNumber: 510,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
											d: "M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z",
											fill: "#00d9ff"
										}, void 0, false, {
											fileName: _jsxFileName$18,
											lineNumber: 511,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 50 150 L 75 120 L 100 150 Z" }, void 0, false, {
											fileName: _jsxFileName$18,
											lineNumber: 512,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M 100 150 L 125 120 L 150 150 Z" }, void 0, false, {
											fileName: _jsxFileName$18,
											lineNumber: 513,
											columnNumber: 19
										}, void 0)
									]
								}, void 0, true, {
									fileName: _jsxFileName$18,
									lineNumber: 508,
									columnNumber: 17
								}, void 0)
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 507,
								columnNumber: 15
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 506,
							columnNumber: 13
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 500,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 461,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 460,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "text-center mb-16",
						initial: { opacity: 0 },
						whileInView: { opacity: 1 },
						transition: { duration: .6 },
						viewport: { once: true },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-4xl md:text-5xl font-bold mb-4",
							children: "Why Choose Zynctra?"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 531,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl text-slate-400 max-w-2xl mx-auto",
							children: "Designed to solve the real pain points competitors left unsolved"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 532,
							columnNumber: 13
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 524,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
						children: features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FeatureCard, {
							feature,
							index
						}, feature.id, false, {
							fileName: _jsxFileName$18,
							lineNumber: 539,
							columnNumber: 15
						}, void 0))
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 537,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 523,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 522,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				id: "pricing",
				className: "py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "text-center mb-16",
							initial: { opacity: 0 },
							whileInView: { opacity: 1 },
							transition: { duration: .6 },
							viewport: { once: true },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-4xl md:text-5xl font-bold mb-4",
								children: "Transparent Pricing"
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 555,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xl text-slate-400 max-w-2xl mx-auto",
								children: "Simple, honest pricing. No hidden fees. Scale as you grow."
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 556,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 548,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid md:grid-cols-3 gap-8 items-center",
							children: pricingTiers.map((tier) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PricingCard, {
								tier,
								onSelect: handleSelectPlan
							}, tier.id, false, {
								fileName: _jsxFileName$18,
								lineNumber: 563,
								columnNumber: 15
							}, void 0))
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 561,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "mt-16 p-8 rounded-lg border border-slate-700 bg-slate-800/40 text-center",
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .6 },
							viewport: { once: true },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-2xl font-bold mb-2",
								children: "All plans include:"
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 578,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-slate-300 mb-4",
								children: "Core HR • Employee Self-Service • Time & Attendance • Mobile Apps • Email Support • 99.9% Uptime SLA • GDPR/SOC2 Compliance"
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 579,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 571,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 547,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 546,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: "text-center mb-16",
						initial: { opacity: 0 },
						whileInView: { opacity: 1 },
						transition: { duration: .6 },
						viewport: { once: true },
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-4xl md:text-5xl font-bold mb-4",
							children: "Trusted by Leading Companies"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 596,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl text-slate-400",
							children: "See how teams are transforming HR with Zynctra"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 597,
							columnNumber: 13
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 589,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid md:grid-cols-3 gap-6",
						children: testimonials.map((testimonial, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TestimonialCard, {
							testimonial,
							index
						}, testimonial.id, false, {
							fileName: _jsxFileName$18,
							lineNumber: 602,
							columnNumber: 15
						}, void 0))
					}, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 600,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 588,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 587,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
				className: "py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-4xl mx-auto text-center",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						initial: {
							opacity: 0,
							y: 30
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .6 },
						viewport: { once: true },
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-4xl md:text-5xl font-bold mb-8",
								children: "Ready to Transform Your HR?"
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 617,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleEmailSubmit,
								className: "flex flex-col sm:flex-row gap-4 mb-8 max-w-lg mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex-1 relative",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										type: "email",
										placeholder: "your@company.com",
										value: email,
										onChange: handleEmailChange,
										className: `w-full px-6 py-4 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-colors duration-300 ${emailError ? "border-red-500" : "border-slate-700 focus:border-cyan-400"} focus:outline-none`,
										"aria-label": "Email address",
										"aria-invalid": !!emailError,
										"aria-describedby": emailError ? "email-error" : void 0,
										maxLength: 254
									}, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 622,
										columnNumber: 17
									}, void 0), emailError && /* @__PURE__ */ (void 0)("p", {
										id: "email-error",
										className: "text-red-400 text-sm mt-2 text-left",
										children: emailError
									}, void 0, false, {
										fileName: _jsxFileName$18,
										lineNumber: 636,
										columnNumber: 19
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$18,
									lineNumber: 621,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									type: "submit",
									disabled: submitted,
									className: "px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50",
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									children: submitted ? "✓ Check your email" : "Get Started"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 641,
									columnNumber: 15
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$18,
								lineNumber: 620,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-slate-400",
								children: "14-day free trial. No credit card required. Full access to all features."
							}, void 0, false, {
								fileName: _jsxFileName$18,
								lineNumber: 652,
								columnNumber: 13
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$18,
						lineNumber: 611,
						columnNumber: 11
					}, void 0)
				}, void 0, false, {
					fileName: _jsxFileName$18,
					lineNumber: 610,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$18,
				lineNumber: 609,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "border-t border-slate-800 bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-bold mb-4",
							children: "Product"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 663,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "space-y-2 text-slate-400 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Features"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 665,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 665,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Pricing"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 666,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 666,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Security"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 667,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 667,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 664,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 662,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-bold mb-4",
							children: "Company"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 671,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "space-y-2 text-slate-400 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "About"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 673,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 673,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Blog"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 674,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 674,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Careers"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 675,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 675,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 672,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 670,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-bold mb-4",
							children: "Legal"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 679,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "space-y-2 text-slate-400 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Privacy"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 681,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 681,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Terms"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 682,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 682,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Compliance"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 683,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 683,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 680,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 678,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-bold mb-4",
							children: "Connect"
						}, void 0, false, {
							fileName: _jsxFileName$18,
							lineNumber: 687,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "space-y-2 text-slate-400 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "Twitter"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 689,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 689,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "LinkedIn"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 690,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 690,
									columnNumber: 15
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: "#",
									className: "hover:text-cyan-400 transition",
									children: "GitHub"
								}, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 691,
									columnNumber: 19
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$18,
									lineNumber: 691,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 688,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$18,
							lineNumber: 686,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 661,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "© 2026 Zynctra. All rights reserved." }, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 697,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "Built with security and enterprise standards in mind." }, void 0, false, {
						fileName: _jsxFileName$18,
						lineNumber: 698,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$18,
					lineNumber: 696,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$18,
				lineNumber: 660,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$18,
		lineNumber: 426,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/context/ThemeContext.tsx
/**
* /frontend/src/context/ThemeContext.tsx
*
* Theme provider for light/dark mode support.
* Persists user preference to localStorage.
* Supabase persistence is attempted gracefully and never crashes the UI.
*/
var _jsxFileName$17 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/context/ThemeContext.tsx";
var ThemeContext = (0, import_react.createContext)(void 0);
var ThemeProvider = ({ children }) => {
	const [theme, setThemeState] = (0, import_react.useState)("system");
	const [effectiveTheme, setEffectiveTheme] = (0, import_react.useState)("dark");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const resolveEffective = (t) => {
		if (t !== "system") return t;
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	};
	const applyTheme = (effective) => {
		if (effective === "dark") document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
		setEffectiveTheme(effective);
	};
	(0, import_react.useEffect)(() => {
		const initial = localStorage.getItem("theme") ?? "system";
		setThemeState(initial);
		applyTheme(resolveEffective(initial));
		setMounted(true);
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			setThemeState((prev) => {
				if (prev === "system") applyTheme(resolveEffective("system"));
				return prev;
			});
		};
		mq.addEventListener("change", handleChange);
		return () => mq.removeEventListener("change", handleChange);
	}, []);
	const setTheme = (newTheme) => {
		setThemeState(newTheme);
		localStorage.setItem("theme", newTheme);
		applyTheme(resolveEffective(newTheme));
		__vitePreload(async () => {
			const { userProfileService } = await Promise.resolve().then(() => supabaseClient_exports);
			return { userProfileService };
		}, void 0).then(({ userProfileService }) => {
			const userId = sessionStorage.getItem("__zynctra__user_id");
			if (userId) userProfileService.updateTheme(userId, newTheme);
		}).catch(() => {});
	};
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeContext.Provider, {
		value: {
			theme,
			effectiveTheme,
			setTheme
		},
		children
	}, void 0, false, {
		fileName: _jsxFileName$17,
		lineNumber: 84,
		columnNumber: 5
	}, void 0);
};
var useTheme = () => {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
};
//#endregion
//#region src/pages/LoginPage.tsx
/**
* /frontend/src/pages/LoginPage.tsx
*
* User login with email/password and MFA support.
* Fixed: uses AuthContext login directly; MFA step handled via state.
*/
var _jsxFileName$16 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/LoginPage.tsx";
var LoginPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { login, verifyMFA, isAuthenticated, isLoading: authLoading } = useAuth();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const [step, setStep] = (0, import_react.useState)("credentials");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mfaCode, setMfaCode] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const planParam = searchParams.get("plan");
	(0, import_react.useEffect)(() => {
		if (isAuthenticated && !authLoading) navigate(planParam ? `/pricing?plan=${planParam}` : "/dashboard", { replace: true });
	}, [
		isAuthenticated,
		authLoading,
		navigate,
		planParam
	]);
	const inputClass = (isError = false) => `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isError ? isDark ? "border-red-500 bg-red-500/10 text-white" : "border-red-500 bg-red-50" : isDark ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 placeholder-slate-400"}`;
	const handleCredentials = async (e) => {
		e.preventDefault();
		setError(null);
		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Invalid email format.");
			return;
		}
		if (!password) {
			setError("Password is required.");
			return;
		}
		setIsSubmitting(true);
		try {
			await login(email, password);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Login failed.";
			if (msg.toLowerCase().includes("mfa") || msg.toLowerCase().includes("two-factor")) {
				setStep("mfa");
				setError(null);
			} else setError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleMFA = async (e) => {
		e.preventDefault();
		setError(null);
		if (mfaCode.length < 6) {
			setError("Please enter a valid 6-digit code.");
			return;
		}
		setIsSubmitting(true);
		try {
			await verifyMFA(mfaCode);
			navigate(planParam ? `/pricing?plan=${planParam}` : "/dashboard", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Invalid MFA code.");
			setMfaCode("");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "w-full max-w-md",
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .5 },
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold text-xl mb-4",
							children: "Z"
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 107,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
							children: "Welcome Back"
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 110,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: isDark ? "text-slate-400" : "text-slate-600",
							children: step === "credentials" ? "Sign in to your account" : "Enter your MFA code"
						}, void 0, false, {
							fileName: _jsxFileName$16,
							lineNumber: 113,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$16,
					lineNumber: 106,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: `p-8 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"}`,
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: error && /* @__PURE__ */ (void 0)(motion.div, {
						className: `mb-5 p-4 rounded-lg border text-sm ${isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-50 border-red-300 text-red-700"}`,
						initial: {
							opacity: 0,
							y: -8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: { opacity: 0 },
						role: "alert",
						children: error
					}, void 0, false, {
						fileName: _jsxFileName$16,
						lineNumber: 127,
						columnNumber: 15
					}, void 0) }, void 0, false, {
						fileName: _jsxFileName$16,
						lineNumber: 125,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
						mode: "wait",
						children: step === "credentials" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.form, {
							onSubmit: handleCredentials,
							initial: {
								opacity: 0,
								x: -12
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: 12
							},
							noValidate: true,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									htmlFor: "email",
									className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
									children: "Email Address"
								}, void 0, false, {
									fileName: _jsxFileName$16,
									lineNumber: 155,
									columnNumber: 19
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									id: "email",
									type: "email",
									autoComplete: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "you@example.com",
									className: inputClass(),
									disabled: isSubmitting
								}, void 0, false, {
									fileName: _jsxFileName$16,
									lineNumber: 158,
									columnNumber: 19
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 154,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										htmlFor: "password",
										className: `text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`,
										children: "Password"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 172,
										columnNumber: 21
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/forgot-password",
										className: "text-xs text-cyan-400 hover:text-cyan-300 font-medium",
										children: "Forgot password?"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 175,
										columnNumber: 21
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 171,
									columnNumber: 19
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
										id: "password",
										type: showPassword ? "text" : "password",
										autoComplete: "current-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••••••",
										className: `${inputClass()} pr-12`,
										disabled: isSubmitting
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 183,
										columnNumber: 21
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setShowPassword((v) => !v),
										className: `absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`,
										tabIndex: -1,
										"aria-label": showPassword ? "Hide password" : "Show password",
										children: showPassword ? "👁️" : "👁️‍🗨️"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 193,
										columnNumber: 21
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 182,
									columnNumber: 19
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 170,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									type: "submit",
									disabled: isSubmitting,
									className: "w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition",
									whileHover: !isSubmitting ? { scale: 1.02 } : {},
									whileTap: !isSubmitting ? { scale: .98 } : {},
									children: isSubmitting ? "Signing in…" : "Sign In"
								}, void 0, false, {
									fileName: _jsxFileName$16,
									lineNumber: 205,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: `text-center text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: [
										"Don't have an account?",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/register",
											className: "text-cyan-400 hover:text-cyan-300 font-semibold",
											children: "Sign up"
										}, void 0, false, {
											fileName: _jsxFileName$16,
											lineNumber: 217,
											columnNumber: 19
										}, void 0)
									]
								}, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 215,
									columnNumber: 17
								}, void 0)
							]
						}, "credentials", true, {
							fileName: _jsxFileName$16,
							lineNumber: 145,
							columnNumber: 15
						}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.form, {
							onSubmit: handleMFA,
							initial: {
								opacity: 0,
								x: 12
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: -12
							},
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-center mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-5xl mb-3",
										children: "🔐"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 232,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: `text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
										children: "Enter the 6-digit code from your authenticator app."
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 233,
										columnNumber: 19
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 231,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "text",
									inputMode: "numeric",
									pattern: "[0-9]*",
									maxLength: 6,
									value: mfaCode,
									onChange: (e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6)),
									placeholder: "000000",
									className: `w-full px-4 py-4 rounded-lg border text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-slate-300 bg-slate-50"}`,
									autoComplete: "one-time-code",
									autoFocus: true,
									disabled: isSubmitting
								}, void 0, false, {
									fileName: _jsxFileName$16,
									lineNumber: 238,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => {
											setStep("credentials");
											setMfaCode("");
											setError(null);
										},
										className: `flex-1 py-3 rounded-lg font-semibold transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`,
										children: "← Back"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 255,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
										type: "submit",
										disabled: isSubmitting || mfaCode.length < 6,
										className: "flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition",
										whileHover: !isSubmitting ? { scale: 1.02 } : {},
										whileTap: !isSubmitting ? { scale: .98 } : {},
										children: isSubmitting ? "Verifying…" : "Verify"
									}, void 0, false, {
										fileName: _jsxFileName$16,
										lineNumber: 264,
										columnNumber: 19
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$16,
									lineNumber: 254,
									columnNumber: 17
								}, void 0)
							]
						}, "mfa", true, {
							fileName: _jsxFileName$16,
							lineNumber: 223,
							columnNumber: 15
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$16,
						lineNumber: 143,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$16,
					lineNumber: 119,
					columnNumber: 9
				}, void 0),
				step === "credentials" && /* @__PURE__ */ (void 0)(motion.div, {
					className: `mt-6 p-5 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-100 border-slate-300"}`,
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: .3 },
					children: [/* @__PURE__ */ (void 0)("p", {
						className: "text-sm font-semibold mb-2",
						children: "Demo Credentials"
					}, void 0, false, {
						fileName: _jsxFileName$16,
						lineNumber: 289,
						columnNumber: 13
					}, void 0), /* @__PURE__ */ (void 0)("code", {
						className: `text-xs block p-2 rounded font-mono ${isDark ? "bg-slate-900 text-cyan-400" : "bg-white text-cyan-600"}`,
						children: [
							"Email: demo@zynctra.com",
							/* @__PURE__ */ (void 0)("br", {}, void 0, false, {
								fileName: _jsxFileName$16,
								lineNumber: 296,
								columnNumber: 15
							}, void 0),
							"Password: Demo@12345!"
						]
					}, void 0, true, {
						fileName: _jsxFileName$16,
						lineNumber: 290,
						columnNumber: 13
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$16,
					lineNumber: 281,
					columnNumber: 11
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$16,
			lineNumber: 99,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$16,
		lineNumber: 92,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/context/AuthContext.tsx
/**
* /frontend/src/context/AuthContext.tsx
*
* Authentication context provider — centralises auth state so that
* the useAuth hook works throughout the app.
*/
var _jsxFileName$15 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/context/AuthContext.tsx";
var STORAGE_PREFIX = "__zynctra__";
var TOKEN_KEY = `${STORAGE_PREFIX}token`;
var REFRESH_TOKEN_KEY = `${STORAGE_PREFIX}refresh`;
var getStoredAccessToken = () => sessionStorage.getItem(TOKEN_KEY);
var getStoredRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY);
var storeTokenSecurely = (accessToken, refreshToken, expiresIn) => {
	sessionStorage.setItem(TOKEN_KEY, accessToken);
	sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	sessionStorage.setItem(`${STORAGE_PREFIX}expires_at`, String(Date.now() + expiresIn * 1e3));
};
var clearStoredTokens = () => {
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(REFRESH_TOKEN_KEY);
	sessionStorage.removeItem(`${STORAGE_PREFIX}expires_at`);
};
var getCsrfToken = () => {
	const meta = document.querySelector("meta[name=\"csrf-token\"]");
	if (meta) return meta.getAttribute("content") ?? "";
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === "XSRF-TOKEN") return decodeURIComponent(value ?? "");
	}
	return "";
};
var decodeJWT = (token) => {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return {};
		return JSON.parse(atob(parts[1]));
	} catch {
		return {};
	}
};
var AuthContext = (0, import_react.createContext)(void 0);
var AuthProvider = ({ children }) => {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const restore = async () => {
			const token = getStoredAccessToken();
			if (!token) {
				setIsLoading(false);
				return;
			}
			const exp = decodeJWT(token)["exp"];
			if (exp && Date.now() / 1e3 > exp) {
				if (!await refreshToken()) {
					clearStoredTokens();
					setIsLoading(false);
					return;
				}
			}
			try {
				const res = await fetch(`/auth/me`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${getStoredAccessToken()}`,
						"X-CSRF-Token": getCsrfToken()
					}
				});
				if (res.ok) {
					setUser((await res.json()).user);
					setIsAuthenticated(true);
				} else clearStoredTokens();
			} catch {
				clearStoredTokens();
			} finally {
				setIsLoading(false);
			}
		};
		restore();
	}, []);
	const login = (0, import_react.useCallback)(async (email, password) => {
		setError(null);
		setIsLoading(true);
		try {
			const res = await fetch(`/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					email,
					password
				})
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message ?? "Login failed");
			}
			const data = await res.json();
			storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
			setUser(data.user);
			setIsAuthenticated(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);
	const logout = (0, import_react.useCallback)(async () => {
		try {
			await fetch(`/auth/logout`, {
				method: "POST",
				credentials: "include",
				headers: { "X-CSRF-Token": getCsrfToken() }
			});
		} finally {
			clearStoredTokens();
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);
	const verifyMFA = (0, import_react.useCallback)(async (code) => {
		setError(null);
		const res = await fetch(`/auth/mfa-verify`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": getCsrfToken()
			},
			credentials: "include",
			body: JSON.stringify({ mfaCode: code })
		});
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.message ?? "MFA verification failed");
		}
	}, []);
	const refreshToken = (0, import_react.useCallback)(async () => {
		const stored = getStoredRefreshToken();
		if (!stored) return false;
		try {
			const res = await fetch(`/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({ refreshToken: stored })
			});
			if (!res.ok) return false;
			const data = await res.json();
			storeTokenSecurely(data.accessToken, data.refreshToken, data.expiresIn);
			return true;
		} catch {
			return false;
		}
	}, []);
	const value = {
		user,
		isAuthenticated,
		isLoading,
		error,
		login,
		logout,
		verifyMFA,
		refreshToken
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthContext.Provider, {
		value,
		children
	}, void 0, false, {
		fileName: _jsxFileName$15,
		lineNumber: 276,
		columnNumber: 10
	}, void 0);
};
//#endregion
//#region src/pages/RegisterPage.tsx
/**
* /frontend/src/pages/RegisterPage.tsx
*
* User registration with strict validation.
* Fixed: removed process.env; uses import.meta.env via apiClient indirectly.
*/
var _jsxFileName$14 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/RegisterPage.tsx";
var API_BASE$3 = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_API_URL"] ?? "";
var PASSWORD_RULES = [
	{
		test: (p) => p.length >= 12,
		label: "At least 12 characters"
	},
	{
		test: (p) => /[A-Z]/.test(p),
		label: "At least one uppercase letter"
	},
	{
		test: (p) => /[a-z]/.test(p),
		label: "At least one lowercase letter"
	},
	{
		test: (p) => /[0-9]/.test(p),
		label: "At least one number"
	},
	{
		test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
		label: "At least one special character"
	}
];
var RegisterPage = () => {
	const navigate = useNavigate();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const [formData, setFormData] = (0, import_react.useState)({
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [touched, setTouched] = (0, import_react.useState)({});
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [successMessage, setSuccessMessage] = (0, import_react.useState)("");
	const inputClass = (field) => `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors[field] && touched[field] ? isDark ? "border-red-500 bg-red-500/10 text-white" : "border-red-500 bg-red-50" : isDark ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 placeholder-slate-400"}`;
	const validateField = (name, value) => {
		switch (name) {
			case "email": {
				const v = value;
				if (!v) return "Email is required";
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email format";
				if (v.length > 254) return "Email is too long";
				return "";
			}
			case "fullName": {
				const v = value;
				if (!v) return "Full name is required";
				if (v.trim().length < 2) return "Name must be at least 2 characters";
				if (v.length > 100) return "Name is too long";
				if (!/^[a-zA-Z\s'-]+$/.test(v)) return "Name contains invalid characters";
				return "";
			}
			case "password": {
				const v = value;
				if (!v) return "Password is required";
				const failing = PASSWORD_RULES.filter((r) => !r.test(v));
				if (failing.length > 0) return `Password must have: ${failing.map((r) => r.label).join(", ")}`;
				return "";
			}
			case "confirmPassword": {
				const v = value;
				if (!v) return "Please confirm your password";
				if (v !== formData.password) return "Passwords do not match";
				return "";
			}
			case "agreeToTerms": return !value ? "You must agree to the terms and conditions" : "";
			default: return "";
		}
	};
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const newValue = type === "checkbox" ? checked : value;
		setFormData((prev) => ({
			...prev,
			[name]: newValue
		}));
		if (touched[name]) setErrors((prev) => ({
			...prev,
			[name]: validateField(name, newValue)
		}));
	};
	const handleBlur = (e) => {
		const { name, value } = e.target;
		setTouched((prev) => ({
			...prev,
			[name]: true
		}));
		setErrors((prev) => ({
			...prev,
			[name]: validateField(name, value)
		}));
	};
	const validateAll = () => {
		const newErrors = {};
		Object.keys(formData).forEach((k) => {
			const err = validateField(k, formData[k]);
			if (err) newErrors[k] = err;
		});
		setErrors(newErrors);
		setTouched({
			email: true,
			fullName: true,
			password: true,
			confirmPassword: true,
			agreeToTerms: true
		});
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateAll()) return;
		setIsLoading(true);
		try {
			const res = await fetch(`${API_BASE$3}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				body: JSON.stringify({
					email: formData.email,
					fullName: formData.fullName,
					password: formData.password
				})
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message ?? "Registration failed");
			}
			setSuccessMessage("✓ Registration successful! Check your email to verify your account.");
			setTimeout(() => navigate("/login"), 2500);
		} catch (err) {
			setErrors({ submit: err instanceof Error ? err.message : "Registration failed" });
		} finally {
			setIsLoading(false);
		}
	};
	const passwordStrength = PASSWORD_RULES.filter((r) => r.test(formData.password)).length;
	const strengthColor = [
		"bg-red-500",
		"bg-red-400",
		"bg-yellow-400",
		"bg-cyan-400",
		"bg-green-500"
	][passwordStrength - 1] ?? "bg-slate-600";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "w-full max-w-md",
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .5 },
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold text-xl mb-4",
							children: "Z"
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 660,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
							children: "Join Zynctra"
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 661,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: isDark ? "text-slate-400" : "text-slate-600",
							children: "Create your account to get started"
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 662,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$14,
					lineNumber: 659,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: successMessage && /* @__PURE__ */ (void 0)(motion.div, {
					className: `mb-5 p-4 rounded-lg border text-sm ${isDark ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-green-50 border-green-300 text-green-800"}`,
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					children: successMessage
				}, void 0, false, {
					fileName: _jsxFileName$14,
					lineNumber: 668,
					columnNumber: 13
				}, void 0) }, void 0, false, {
					fileName: _jsxFileName$14,
					lineNumber: 666,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: handleSubmit,
					noValidate: true,
					className: `p-8 rounded-xl border space-y-5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"}`,
					children: [
						errors.submit && /* @__PURE__ */ (void 0)(motion.div, {
							className: `p-4 rounded-lg border text-sm ${isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-50 border-red-300 text-red-700"}`,
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							role: "alert",
							children: errors.submit
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 678,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								htmlFor: "email",
								className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Email Address"
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 685,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								id: "email",
								name: "email",
								type: "email",
								autoComplete: "email",
								value: formData.email,
								onChange: handleChange,
								onBlur: handleBlur,
								placeholder: "you@example.com",
								className: inputClass("email"),
								disabled: isLoading
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 686,
								columnNumber: 13
							}, void 0),
							errors.email && touched.email && /* @__PURE__ */ (void 0)("p", {
								className: "text-red-400 text-xs mt-1",
								children: errors.email
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 687,
								columnNumber: 47
							}, void 0)
						] }, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 684,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								htmlFor: "fullName",
								className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Full Name"
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 692,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								id: "fullName",
								name: "fullName",
								type: "text",
								autoComplete: "name",
								value: formData.fullName,
								onChange: handleChange,
								onBlur: handleBlur,
								placeholder: "John Doe",
								className: inputClass("fullName"),
								disabled: isLoading
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 693,
								columnNumber: 13
							}, void 0),
							errors.fullName && touched.fullName && /* @__PURE__ */ (void 0)("p", {
								className: "text-red-400 text-xs mt-1",
								children: errors.fullName
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 694,
								columnNumber: 53
							}, void 0)
						] }, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 691,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								htmlFor: "password",
								className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Password"
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 699,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									id: "password",
									name: "password",
									type: showPassword ? "text" : "password",
									autoComplete: "new-password",
									value: formData.password,
									onChange: handleChange,
									onBlur: handleBlur,
									placeholder: "••••••••••••",
									className: `${inputClass("password")} pr-12`,
									disabled: isLoading
								}, void 0, false, {
									fileName: _jsxFileName$14,
									lineNumber: 701,
									columnNumber: 15
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => setShowPassword((v) => !v),
									className: `absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`,
									tabIndex: -1,
									children: showPassword ? "👁️" : "👁️‍🗨️"
								}, void 0, false, {
									fileName: _jsxFileName$14,
									lineNumber: 702,
									columnNumber: 15
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$14,
								lineNumber: 700,
								columnNumber: 13
							}, void 0),
							formData.password && /* @__PURE__ */ (void 0)("div", {
								className: "mt-2 flex gap-1",
								children: [
									0,
									1,
									2,
									3,
									4
								].map((i) => /* @__PURE__ */ (void 0)("div", { className: `h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor : isDark ? "bg-slate-700" : "bg-slate-200"}` }, i, false, {
									fileName: _jsxFileName$14,
									lineNumber: 710,
									columnNumber: 19
								}, void 0))
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 708,
								columnNumber: 15
							}, void 0),
							errors.password && touched.password && /* @__PURE__ */ (void 0)("p", {
								className: "text-red-400 text-xs mt-1",
								children: errors.password
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 714,
								columnNumber: 53
							}, void 0)
						] }, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 698,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								htmlFor: "confirmPassword",
								className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Confirm Password"
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 719,
								columnNumber: 13
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								id: "confirmPassword",
								name: "confirmPassword",
								type: showPassword ? "text" : "password",
								autoComplete: "new-password",
								value: formData.confirmPassword,
								onChange: handleChange,
								onBlur: handleBlur,
								placeholder: "••••••••••••",
								className: inputClass("confirmPassword"),
								disabled: isLoading
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 720,
								columnNumber: 13
							}, void 0),
							errors.confirmPassword && touched.confirmPassword && /* @__PURE__ */ (void 0)("p", {
								className: "text-red-400 text-xs mt-1",
								children: errors.confirmPassword
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 721,
								columnNumber: 67
							}, void 0)
						] }, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 718,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								id: "agreeToTerms",
								name: "agreeToTerms",
								type: "checkbox",
								checked: formData.agreeToTerms,
								onChange: handleChange,
								onBlur: handleBlur,
								className: "mt-1 w-4 h-4 rounded accent-cyan-500",
								disabled: isLoading
							}, void 0, false, {
								fileName: _jsxFileName$14,
								lineNumber: 726,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								htmlFor: "agreeToTerms",
								className: `text-sm cursor-pointer ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: [
									"I agree to the",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/terms",
										className: "text-cyan-400 hover:text-cyan-300",
										children: "Terms of Service"
									}, void 0, false, {
										fileName: _jsxFileName$14,
										lineNumber: 729,
										columnNumber: 15
									}, void 0),
									" ",
									"and",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/privacy",
										className: "text-cyan-400 hover:text-cyan-300",
										children: "Privacy Policy"
									}, void 0, false, {
										fileName: _jsxFileName$14,
										lineNumber: 730,
										columnNumber: 15
									}, void 0)
								]
							}, void 0, true, {
								fileName: _jsxFileName$14,
								lineNumber: 727,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 725,
							columnNumber: 11
						}, void 0),
						errors.agreeToTerms && touched.agreeToTerms && /* @__PURE__ */ (void 0)("p", {
							className: "text-red-400 text-xs -mt-3",
							children: errors.agreeToTerms
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 733,
							columnNumber: 59
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
							type: "submit",
							disabled: isLoading,
							className: "w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition",
							whileHover: !isLoading ? { scale: 1.02 } : {},
							whileTap: !isLoading ? { scale: .98 } : {},
							children: isLoading ? "Creating Account…" : "Create Account"
						}, void 0, false, {
							fileName: _jsxFileName$14,
							lineNumber: 736,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-center text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/login",
									className: "text-cyan-400 hover:text-cyan-300 font-semibold",
									children: "Sign in"
								}, void 0, false, {
									fileName: _jsxFileName$14,
									lineNumber: 748,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$14,
							lineNumber: 746,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$14,
					lineNumber: 675,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: `mt-6 p-5 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-100 border-slate-300"}`,
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: .3 },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm font-semibold mb-3",
						children: "Password Requirements"
					}, void 0, false, {
						fileName: _jsxFileName$14,
						lineNumber: 754,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "space-y-1",
						children: PASSWORD_RULES.map((rule, idx) => {
							const passed = formData.password ? rule.test(formData.password) : false;
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
								className: `text-xs flex items-center gap-2 ${passed ? "text-green-400" : isDark ? "text-slate-400" : "text-slate-600"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: passed ? "✓" : "○" }, void 0, false, {
									fileName: _jsxFileName$14,
									lineNumber: 760,
									columnNumber: 19
								}, void 0), rule.label]
							}, idx, true, {
								fileName: _jsxFileName$14,
								lineNumber: 759,
								columnNumber: 17
							}, void 0);
						})
					}, void 0, false, {
						fileName: _jsxFileName$14,
						lineNumber: 755,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$14,
					lineNumber: 753,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$14,
			lineNumber: 657,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$14,
		lineNumber: 656,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/pages/ForgotPasswordPage.tsx
/**
* /frontend/src/pages/ForgotPasswordPage.tsx
*
* Password reset flow.
* Fixed: uses import.meta.env; getCsrfToken from AuthContext.
*/
var _jsxFileName$13 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/ForgotPasswordPage.tsx";
var API_BASE$2 = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_API_URL"] ?? "";
var ForgotPasswordPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [cooldown, setCooldown] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const token = searchParams.get("token");
		if (token) {
			setCode(token);
			setStep("reset");
		}
	}, [searchParams]);
	(0, import_react.useEffect)(() => {
		if (cooldown <= 0) return;
		const t = setTimeout(() => setCooldown((c) => c - 1), 1e3);
		return () => clearTimeout(t);
	}, [cooldown]);
	const inputClass = `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 placeholder-slate-400"}`;
	const sendCode = async () => {
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			const res = await fetch(`${API_BASE$2}/auth/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				body: JSON.stringify({ email })
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.message ?? "Failed to send reset code");
			}
			setSuccess(`✓ Reset code sent to ${email}`);
			setCooldown(60);
			setStep("verify");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send code");
		} finally {
			setIsLoading(false);
		}
	};
	const resetPassword = async () => {
		setError(null);
		if (!code.trim() || code.length < 6) {
			setError("Invalid reset code.");
			return;
		}
		if (password.length < 12) {
			setError("Password must be at least 12 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		setIsLoading(true);
		try {
			const res = await fetch(`${API_BASE$2}/auth/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				body: JSON.stringify({
					email,
					code,
					password
				})
			});
			if (!res.ok) {
				const d = await res.json();
				throw new Error(d.message ?? "Failed to reset password");
			}
			setStep("success");
			setSuccess("✓ Password reset successful!");
			setTimeout(() => navigate("/login", { replace: true }), 2500);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Reset failed");
		} finally {
			setIsLoading(false);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (step === "email") sendCode();
		else if (step === "verify") setStep("reset");
		else if (step === "reset") resetPassword();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "w-full max-w-md",
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 items-center justify-center text-white font-bold text-xl mb-4",
							children: "Z"
						}, void 0, false, {
							fileName: _jsxFileName$13,
							lineNumber: 647,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
							children: "Reset Password"
						}, void 0, false, {
							fileName: _jsxFileName$13,
							lineNumber: 648,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: isDark ? "text-slate-400" : "text-slate-600",
							children: [
								step === "email" && "Enter your email to receive a reset code",
								step === "verify" && "Enter the code we sent to your email",
								step === "reset" && "Create your new password",
								step === "success" && "Password reset successfully"
							]
						}, void 0, true, {
							fileName: _jsxFileName$13,
							lineNumber: 649,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$13,
					lineNumber: 646,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: `p-8 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-lg"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: [success && /* @__PURE__ */ (void 0)(motion.div, {
							className: `mb-5 p-4 rounded-lg border text-sm ${isDark ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-green-50 border-green-300 text-green-800"}`,
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							children: success
						}, void 0, false, {
							fileName: _jsxFileName$13,
							lineNumber: 660,
							columnNumber: 15
						}, void 0), error && /* @__PURE__ */ (void 0)(motion.div, {
							className: `mb-5 p-4 rounded-lg border text-sm ${isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-50 border-red-300 text-red-700"}`,
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							exit: { opacity: 0 },
							role: "alert",
							children: error
						}, void 0, false, {
							fileName: _jsxFileName$13,
							lineNumber: 665,
							columnNumber: 15
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$13,
							lineNumber: 658,
							columnNumber: 11
						}, void 0),
						step !== "success" && /* @__PURE__ */ (void 0)("form", {
							onSubmit: handleSubmit,
							noValidate: true,
							className: "space-y-5",
							children: [
								(step === "email" || step === "verify") && /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
									children: "Email Address"
								}, void 0, false, {
									fileName: _jsxFileName$13,
									lineNumber: 676,
									columnNumber: 19
								}, void 0), /* @__PURE__ */ (void 0)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "you@example.com",
									className: inputClass,
									disabled: step === "verify" || isLoading
								}, void 0, false, {
									fileName: _jsxFileName$13,
									lineNumber: 677,
									columnNumber: 19
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 675,
									columnNumber: 17
								}, void 0),
								(step === "verify" || step === "reset") && /* @__PURE__ */ (void 0)("div", { children: [
									/* @__PURE__ */ (void 0)("label", {
										className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
										children: "Reset Code"
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 684,
										columnNumber: 19
									}, void 0),
									/* @__PURE__ */ (void 0)("input", {
										type: "text",
										value: code,
										onChange: (e) => setCode(e.target.value.toUpperCase()),
										placeholder: "XXXXXXXX",
										maxLength: 12,
										className: `${inputClass} text-center text-xl tracking-widest font-mono`,
										disabled: isLoading
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 685,
										columnNumber: 19
									}, void 0),
									step === "verify" && /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => void sendCode(),
										disabled: cooldown > 0 || isLoading,
										className: `mt-2 text-sm font-medium ${cooldown > 0 ? isDark ? "text-slate-500" : "text-slate-400" : "text-cyan-400 hover:text-cyan-300"}`,
										children: cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 695,
										columnNumber: 21
									}, void 0)
								] }, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 683,
									columnNumber: 17
								}, void 0),
								step === "reset" && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
									children: "New Password"
								}, void 0, false, {
									fileName: _jsxFileName$13,
									lineNumber: 706,
									columnNumber: 21
								}, void 0), /* @__PURE__ */ (void 0)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••••••",
										className: `${inputClass} pr-12`,
										disabled: isLoading
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 708,
										columnNumber: 23
									}, void 0), /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => setShowPassword((v) => !v),
										className: `absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-500"}`,
										tabIndex: -1,
										children: showPassword ? "👁️" : "👁️‍🗨️"
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 709,
										columnNumber: 23
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 707,
									columnNumber: 21
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 705,
									columnNumber: 19
								}, void 0), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									className: `block text-sm font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-700"}`,
									children: "Confirm New Password"
								}, void 0, false, {
									fileName: _jsxFileName$13,
									lineNumber: 715,
									columnNumber: 21
								}, void 0), /* @__PURE__ */ (void 0)("input", {
									type: showPassword ? "text" : "password",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									placeholder: "••••••••••••",
									className: inputClass,
									disabled: isLoading
								}, void 0, false, {
									fileName: _jsxFileName$13,
									lineNumber: 716,
									columnNumber: 21
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 714,
									columnNumber: 19
								}, void 0)] }, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 704,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (void 0)("div", {
									className: `flex gap-3 ${step !== "email" ? "flex-row" : ""}`,
									children: [step !== "email" && /* @__PURE__ */ (void 0)("button", {
										type: "button",
										onClick: () => {
											setStep(step === "verify" ? "email" : "verify");
											setError(null);
										},
										className: `flex-1 py-3 rounded-lg font-semibold transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`,
										children: "← Back"
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 724,
										columnNumber: 19
									}, void 0), /* @__PURE__ */ (void 0)(motion.button, {
										type: "submit",
										disabled: isLoading,
										className: "flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition",
										whileHover: !isLoading ? { scale: 1.02 } : {},
										whileTap: !isLoading ? { scale: .98 } : {},
										children: isLoading ? step === "email" ? "Sending…" : step === "reset" ? "Resetting…" : "Continuing…" : step === "email" ? "Send Reset Code" : step === "verify" ? "Continue" : "Reset Password"
									}, void 0, false, {
										fileName: _jsxFileName$13,
										lineNumber: 728,
										columnNumber: 17
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$13,
									lineNumber: 722,
									columnNumber: 15
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$13,
							lineNumber: 672,
							columnNumber: 13
						}, void 0),
						step === "success" && /* @__PURE__ */ (void 0)("div", {
							className: "text-center py-4",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "text-5xl mb-4",
								children: "✓"
							}, void 0, false, {
								fileName: _jsxFileName$13,
								lineNumber: 747,
								columnNumber: 15
							}, void 0), /* @__PURE__ */ (void 0)("p", {
								className: isDark ? "text-slate-400" : "text-slate-600",
								children: "Redirecting you to login…"
							}, void 0, false, {
								fileName: _jsxFileName$13,
								lineNumber: 748,
								columnNumber: 15
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$13,
							lineNumber: 746,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$13,
					lineNumber: 657,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-center text-sm mt-6 ${isDark ? "text-slate-400" : "text-slate-600"}`,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => navigate("/login"),
						className: "text-cyan-400 hover:text-cyan-300 font-semibold",
						children: "← Back to Login"
					}, void 0, false, {
						fileName: _jsxFileName$13,
						lineNumber: 754,
						columnNumber: 11
					}, void 0)
				}, void 0, false, {
					fileName: _jsxFileName$13,
					lineNumber: 753,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$13,
			lineNumber: 644,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$13,
		lineNumber: 643,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/stores/billingStore.ts
/**
* /frontend/src/stores/billingStore.ts
*
* Billing state management using Zustand
* Handles subscriptions, payments, invoices, and feature access
*/
var PLAN_CONFIGS = {
	[SubscriptionPlan.FREE]: {
		id: SubscriptionPlan.FREE,
		name: "free",
		displayName: "Free",
		description: "Get started with essential HR features",
		monthlyPrice: 0,
		annualPrice: 0,
		currency: "USD",
		recommendedFor: "Testing",
		maxUsers: 5,
		storageGB: 5,
		apiCallsPerMonth: 1e3,
		supportLevel: "email",
		features: [
			{
				id: "core_hr",
				name: "Core HR",
				description: "Basic employee management",
				included: true,
				category: "core"
			},
			{
				id: "basic_ats",
				name: "Basic ATS",
				description: "Job posting and candidate tracking",
				included: true,
				category: "core"
			},
			{
				id: "basic_reporting",
				name: "Basic Reporting",
				description: "Essential reports and dashboards",
				included: true,
				category: "core"
			},
			{
				id: "advanced_analytics",
				name: "Advanced Analytics",
				description: "Predictive insights and trends",
				included: false,
				category: "advanced"
			},
			{
				id: "ai_copilot",
				name: "AI Copilot",
				description: "AI-powered assistance",
				included: false,
				category: "advanced"
			},
			{
				id: "payroll_tools",
				name: "Payroll Tools",
				description: "Advanced payroll management",
				included: false,
				category: "advanced"
			},
			{
				id: "compliance",
				name: "Compliance Tools",
				description: "Regulatory compliance management",
				included: false,
				category: "advanced"
			},
			{
				id: "audit_tools",
				name: "Audit & Incident Tools",
				description: "Security auditing and incident response",
				included: false,
				category: "advanced"
			},
			{
				id: "priority_support",
				name: "Priority Support",
				description: "24/7 dedicated support",
				included: false,
				category: "support"
			}
		]
	},
	[SubscriptionPlan.STANDARD]: {
		id: SubscriptionPlan.STANDARD,
		name: "standard",
		displayName: "Standard",
		description: "For growing companies",
		monthlyPrice: 50,
		annualPrice: 500,
		currency: "USD",
		recommendedFor: "Startups & SMBs",
		maxUsers: 100,
		storageGB: 100,
		apiCallsPerMonth: 5e4,
		supportLevel: "email",
		features: [
			{
				id: "core_hr",
				name: "Core HR",
				description: "Complete employee management",
				included: true,
				category: "core"
			},
			{
				id: "ats",
				name: "Full ATS",
				description: "Advanced recruitment tools",
				included: true,
				category: "core"
			},
			{
				id: "attendance",
				name: "Attendance Management",
				description: "Time tracking and scheduling",
				included: true,
				category: "core"
			},
			{
				id: "reporting",
				name: "Advanced Reporting",
				description: "Custom reports and dashboards",
				included: true,
				category: "core"
			},
			{
				id: "automation",
				name: "Workflow Automation",
				description: "Automate HR workflows",
				included: true,
				category: "core"
			},
			{
				id: "basic_ai",
				name: "Basic AI Assistance",
				description: "AI-powered recommendations",
				included: true,
				category: "advanced"
			},
			{
				id: "advanced_analytics",
				name: "Advanced Analytics",
				description: "Predictive insights",
				included: false,
				category: "advanced"
			},
			{
				id: "ai_copilot",
				name: "Full AI Copilot",
				description: "Advanced AI features",
				included: false,
				category: "advanced"
			},
			{
				id: "payroll_tools",
				name: "Payroll Tools",
				description: "Payroll management",
				included: false,
				category: "advanced"
			},
			{
				id: "compliance",
				name: "Compliance Tools",
				description: "Compliance management",
				included: false,
				category: "advanced"
			},
			{
				id: "priority_support",
				name: "Priority Support",
				description: "Email support during business hours",
				included: false,
				category: "support"
			}
		]
	},
	[SubscriptionPlan.PREMIUM]: {
		id: SubscriptionPlan.PREMIUM,
		name: "premium",
		displayName: "Premium",
		description: "For enterprise organizations",
		monthlyPrice: 75,
		annualPrice: 750,
		currency: "USD",
		recommendedFor: "Enterprise",
		maxUsers: 1e3,
		storageGB: 1e3,
		apiCallsPerMonth: 5e5,
		supportLevel: "dedicated",
		features: [
			{
				id: "core_hr",
				name: "Core HR",
				description: "Complete employee management",
				included: true,
				category: "core"
			},
			{
				id: "ats",
				name: "Full ATS",
				description: "Advanced recruitment tools",
				included: true,
				category: "core"
			},
			{
				id: "attendance",
				name: "Attendance Management",
				description: "Time tracking and scheduling",
				included: true,
				category: "core"
			},
			{
				id: "payroll",
				name: "Full Payroll",
				description: "Multi-country payroll processing",
				included: true,
				category: "core"
			},
			{
				id: "compliance",
				name: "Compliance Tools",
				description: "Comprehensive compliance management",
				included: true,
				category: "advanced"
			},
			{
				id: "advanced_analytics",
				name: "Advanced Analytics",
				description: "Predictive insights and ML models",
				included: true,
				category: "advanced"
			},
			{
				id: "ai_copilot",
				name: "Full AI Copilot",
				description: "Advanced AI-powered assistance",
				included: true,
				category: "advanced"
			},
			{
				id: "audit_tools",
				name: "Audit & Incident Tools",
				description: "Complete security auditing",
				included: true,
				category: "advanced"
			},
			{
				id: "integrations",
				name: "Advanced Integrations",
				description: "100+ pre-built integrations",
				included: true,
				category: "integrations"
			},
			{
				id: "priority_support",
				name: "24/7 Dedicated Support",
				description: "Dedicated account manager and support",
				included: true,
				category: "support"
			},
			{
				id: "sso",
				name: "SSO & Advanced Security",
				description: "Enterprise security features",
				included: true,
				category: "advanced"
			}
		]
	}
};
var initialState = {
	currentSubscription: null,
	currentPlan: PLAN_CONFIGS[SubscriptionPlan.FREE],
	availablePlans: Object.values(PLAN_CONFIGS),
	paymentMethods: [],
	invoices: [],
	billingContacts: [],
	isLoading: false,
	error: null,
	lastPaymentStatus: null
};
var useBillingStore = create$1()(devtools(persist((set, get) => ({
	...initialState,
	setSubscription: (subscription) => {
		set({
			currentSubscription: subscription,
			currentPlan: PLAN_CONFIGS[subscription.plan] ?? PLAN_CONFIGS[SubscriptionPlan.FREE]
		});
	},
	setCurrentPlan: (plan) => set({ currentPlan: plan }),
	addPaymentMethod: (method) => set((state) => ({ paymentMethods: [...state.paymentMethods, method] })),
	removePaymentMethod: (methodId) => set((state) => ({ paymentMethods: state.paymentMethods.filter((m) => m.id !== methodId) })),
	setDefaultPaymentMethod: (methodId) => set((state) => ({ paymentMethods: state.paymentMethods.map((m) => ({
		...m,
		isDefault: m.id === methodId
	})) })),
	addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
	updateInvoiceStatus: (invoiceId, status) => set((state) => ({ invoices: state.invoices.map((inv) => inv.id === invoiceId ? {
		...inv,
		status
	} : inv) })),
	addBillingContact: (contact) => set((state) => ({ billingContacts: [...state.billingContacts, contact] })),
	updateBillingContact: (contactId, contact) => set((state) => ({ billingContacts: state.billingContacts.map((c) => c.id === contactId ? {
		...c,
		...contact
	} : c) })),
	setLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),
	setLastPaymentStatus: (status) => set({ lastPaymentStatus: status }),
	resetBillingState: () => set(initialState),
	getPlanFeatures: (planId) => PLAN_CONFIGS[planId]?.features ?? [],
	canAccessFeature: (featureId) => {
		const currentPlan = get().currentPlan;
		if (!currentPlan) return false;
		return currentPlan.features.some((f) => f.id === featureId && f.included);
	},
	getNextBillingAmount: () => {
		const { currentSubscription, currentPlan } = get();
		if (!currentSubscription || !currentPlan) return 0;
		return currentSubscription.billingPeriod === BillingPeriod.MONTHLY ? currentPlan.monthlyPrice : currentPlan.annualPrice;
	}
}), {
	name: "zynctra-billing-store",
	partialize: (state) => ({
		currentSubscription: state.currentSubscription,
		currentPlan: state.currentPlan,
		paymentMethods: state.paymentMethods,
		invoices: state.invoices,
		billingContacts: state.billingContacts,
		lastPaymentStatus: state.lastPaymentStatus
	})
})));
//#endregion
//#region src/services/payment/paymentGateway.ts
var API_BASE$1 = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_API_URL"] ?? "";
var PaystackGateway = class {
	constructor() {
		_defineProperty(this, "provider", PaymentProvider.PAYSTACK);
	}
	async initializePayment(request) {
		const res = await fetch(`${API_BASE$1}/payments/paystack/initialize`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": getCsrfToken()
			},
			credentials: "include",
			body: JSON.stringify({
				amount: request.amount * 100,
				email: request.email,
				metadata: request.metadata,
				channels: request.channels ?? ["card", "bank"]
			})
		});
		if (!res.ok) throw new Error("Failed to initialise payment");
		const data = await res.json();
		return {
			authorizationUrl: data.data.authorization_url,
			reference: data.data.reference
		};
	}
	async verifyPayment(reference) {
		const res = await fetch(`${API_BASE$1}/payments/paystack/verify/${reference}`, {
			credentials: "include",
			headers: { "X-CSRF-Token": getCsrfToken() }
		});
		if (!res.ok) throw new Error("Failed to verify payment");
		return res.json();
	}
	async getPaymentStatus(reference) {
		try {
			const response = await this.verifyPayment(reference);
			if (response.data.status === "success") return PaymentStatus.COMPLETED;
			if (response.data.status === "pending") return PaymentStatus.PROCESSING;
			return PaymentStatus.FAILED;
		} catch {
			return PaymentStatus.FAILED;
		}
	}
	async refundPayment(reference, amount) {
		return (await fetch(`${API_BASE$1}/payments/paystack/refund`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": getCsrfToken()
			},
			credentials: "include",
			body: JSON.stringify({
				reference,
				amount: amount ? amount * 100 : void 0
			})
		})).ok;
	}
	async cancelPayment(reference) {
		if (await this.getPaymentStatus(reference) !== PaymentStatus.PROCESSING) return false;
		return (await fetch(`${API_BASE$1}/payments/cancel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": getCsrfToken()
			},
			credentials: "include",
			body: JSON.stringify({ reference })
		})).ok;
	}
};
var StripeGateway = class {
	constructor() {
		_defineProperty(this, "provider", PaymentProvider.STRIPE);
	}
	async initializePayment() {
		throw new Error("Stripe integration not yet implemented.");
	}
	async verifyPayment() {
		throw new Error("Stripe integration not yet implemented.");
	}
	async getPaymentStatus() {
		throw new Error("Stripe integration not yet implemented.");
	}
	async refundPayment() {
		throw new Error("Stripe integration not yet implemented.");
	}
	async cancelPayment() {
		throw new Error("Stripe integration not yet implemented.");
	}
};
var PaymentGatewayFactory = class {
	static getGateway(provider) {
		if (this.instances.has(provider)) return this.instances.get(provider);
		let gw;
		switch (provider) {
			case PaymentProvider.PAYSTACK:
				gw = new PaystackGateway();
				break;
			case PaymentProvider.STRIPE:
				gw = new StripeGateway();
				break;
			default: throw new Error(`Unsupported payment provider: ${provider}`);
		}
		this.instances.set(provider, gw);
		return gw;
	}
	static getDefaultGateway() {
		const provider = {
			"BASE_URL": "/",
			"DEV": true,
			"MODE": "production",
			"PROD": false,
			"REACT_APP_ANALYTICS_ENABLED": "true",
			"REACT_APP_ANIMATIONS_ENABLED": "true",
			"REACT_APP_API_TIMEOUT": "30000",
			"REACT_APP_API_URL": "https://api.zynctra.com/api",
			"REACT_APP_AUTO_LOGOUT": "true",
			"REACT_APP_COMPANY_NAME": "Zynctra HR",
			"REACT_APP_CORS_CREDENTIALS": "true",
			"REACT_APP_CSP_ENABLED": "true",
			"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
			"REACT_APP_DATA_RESIDENCY": "US_EAST",
			"REACT_APP_DEBUG": "false",
			"REACT_APP_DEFAULT_PLAN": "FREE",
			"REACT_APP_DEFAULT_THEME": "system",
			"REACT_APP_ENABLE_AI_ASSISTANT": "true",
			"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
			"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
			"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
			"REACT_APP_ENFORCE_HTTPS": "true",
			"REACT_APP_ENV": "production",
			"REACT_APP_FEATURE_ANALYTICS": "true",
			"REACT_APP_FEATURE_COMPLIANCE": "false",
			"REACT_APP_FEATURE_PAYROLL": "false",
			"REACT_APP_FEATURE_TERMINAL": "false",
			"REACT_APP_FREE_MODE": "true",
			"REACT_APP_GA_ID": "",
			"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
			"REACT_APP_LLM_PROVIDER": "groq",
			"REACT_APP_LOG_LEVEL": "warn",
			"REACT_APP_MFA_REQUIRED": "true",
			"REACT_APP_MONETIZATION_ENABLED": "false",
			"REACT_APP_PAYMENT_PROVIDER": "paystack",
			"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
			"REACT_APP_REQUEST_TIMEOUT": "30000",
			"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
			"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
			"REACT_APP_SENTRY_DSN": "",
			"REACT_APP_SESSION_TIMEOUT": "3600000",
			"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
			"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
			"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
			"REACT_APP_TENANT_ID": "default",
			"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
			"REACT_APP_TRIAL_DAYS": "14",
			"REACT_APP_VERSION": "1.0.0",
			"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
			"SSR": false,
			"VITE_USER_NODE_ENV": "development"
		}["VITE_PAYMENT_PROVIDER"] ?? PaymentProvider.PAYSTACK;
		return this.getGateway(provider);
	}
	static clearCache() {
		this.instances.clear();
	}
};
_defineProperty(PaymentGatewayFactory, "instances", /* @__PURE__ */ new Map());
var getPaymentGateway = (provider) => provider ? PaymentGatewayFactory.getGateway(provider) : PaymentGatewayFactory.getDefaultGateway();
//#endregion
//#region src/hooks/useBilling.ts
/**
* /frontend/src/hooks/useBilling.ts
*
* Complete billing and subscription management hook.
* Fixed: proper function-vs-value distinction, getCsrfToken imported
* from AuthContext (not duplicated), store typing aligned.
*/
var API_BASE = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_API_URL"] ?? "";
var useBilling = () => {
	const { user } = useAuth();
	const billingStore = useBillingStore();
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const flags = getFeatureFlagService();
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		loadSubscriptionData();
	}, [user?.id]);
	const loadSubscriptionData = (0, import_react.useCallback)(async () => {
		if (!user?.id) return;
		setIsLoading(true);
		setError(null);
		try {
			const res = await fetch(`${API_BASE}/billing/subscription`, {
				credentials: "include",
				headers: { "X-CSRF-Token": getCsrfToken() }
			});
			if (!res.ok) throw new Error("Failed to load subscription");
			const data = await res.json();
			billingStore.setSubscription(data.subscription);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	}, [user?.id]);
	const isSubscriptionActive = (() => {
		const sub = billingStore.currentSubscription;
		if (!sub) return false;
		return sub.status === "active" && new Date(sub.endDate) > /* @__PURE__ */ new Date();
	})();
	const isTrialActive = (() => {
		const sub = billingStore.currentSubscription;
		if (!sub?.trialEndDate) return false;
		return new Date(sub.trialEndDate) > /* @__PURE__ */ new Date() && sub.isTrialActive;
	})();
	const daysUntilRenewal = (() => {
		const sub = billingStore.currentSubscription;
		if (!sub) return 0;
		const diff = new Date(sub.renewalDate).getTime() - Date.now();
		return Math.max(0, Math.ceil(diff / (1e3 * 60 * 60 * 24)));
	})();
	const canAccessFeature = (0, import_react.useCallback)((featureId) => {
		if (flags.isFreeModeActive()) return true;
		const planId = billingStore.currentPlan?.id ?? SubscriptionPlan.FREE;
		return FeatureAccessManager.canAccessFeature(featureId, planId);
	}, [billingStore.currentPlan, flags]);
	const getLockedFeatures = (0, import_react.useCallback)(() => {
		const planId = billingStore.currentPlan?.id ?? SubscriptionPlan.FREE;
		return FeatureAccessManager.getLockedFeatures(planId);
	}, [billingStore.currentPlan]);
	const initiateCheckout = (0, import_react.useCallback)(async (plan, period) => {
		if (!user?.email) {
			setError("User email not found");
			return;
		}
		setIsLoading(true);
		setError(null);
		try {
			const gateway = getPaymentGateway();
			const planConfig = billingStore.availablePlans.find((p) => p.id === plan);
			if (!planConfig) throw new Error("Plan not found");
			const amount = period === BillingPeriod.MONTHLY ? planConfig.monthlyPrice : planConfig.annualPrice;
			const { authorizationUrl, reference } = await gateway.initializePayment({
				amount,
				email: user.email,
				currency: planConfig.currency,
				metadata: {
					organizationId: user.id,
					planId: plan,
					billingPeriod: period,
					userId: user.id
				}
			});
			sessionStorage.setItem("paymentReference", reference);
			sessionStorage.setItem("planId", plan);
			sessionStorage.setItem("billingPeriod", period);
			window.location.href = authorizationUrl;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Checkout failed");
		} finally {
			setIsLoading(false);
		}
	}, [user, billingStore.availablePlans]);
	const verifyPayment = (0, import_react.useCallback)(async (reference) => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await getPaymentGateway().verifyPayment(reference);
			if (response.status && response.data.status === "success") {
				if (!(await fetch(`${API_BASE}/billing/verify-payment`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-CSRF-Token": getCsrfToken()
					},
					credentials: "include",
					body: JSON.stringify({
						reference,
						metadata: response.data.metadata
					})
				})).ok) throw new Error("Failed to finalise subscription");
				await loadSubscriptionData();
				billingStore.setLastPaymentStatus(PaymentStatus.COMPLETED);
				return PaymentStatus.COMPLETED;
			}
			billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
			return PaymentStatus.FAILED;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Verification failed");
			billingStore.setLastPaymentStatus(PaymentStatus.FAILED);
			return PaymentStatus.FAILED;
		} finally {
			setIsLoading(false);
		}
	}, [loadSubscriptionData]);
	const upgradePlan = (0, import_react.useCallback)(async (newPlan, period) => {
		await initiateCheckout(newPlan, period);
	}, [initiateCheckout]);
	const downgradePlan = (0, import_react.useCallback)(async (newPlan) => {
		setIsLoading(true);
		setError(null);
		try {
			if (!(await fetch(`${API_BASE}/billing/downgrade`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					newPlan,
					effectiveDate: (/* @__PURE__ */ new Date()).toISOString()
				})
			})).ok) throw new Error("Failed to downgrade plan");
			await loadSubscriptionData();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Downgrade failed");
		} finally {
			setIsLoading(false);
		}
	}, [loadSubscriptionData]);
	const changeBillingPeriod = (0, import_react.useCallback)(async (period) => {
		setIsLoading(true);
		setError(null);
		try {
			if (!(await fetch(`${API_BASE}/billing/change-period`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					newPeriod: period,
					effectiveDate: (/* @__PURE__ */ new Date()).toISOString()
				})
			})).ok) throw new Error("Failed to change billing period");
			await loadSubscriptionData();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Change failed");
		} finally {
			setIsLoading(false);
		}
	}, [loadSubscriptionData]);
	const cancelSubscription = (0, import_react.useCallback)(async (reason) => {
		setIsLoading(true);
		setError(null);
		try {
			if (!(await fetch(`${API_BASE}/billing/cancel`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					reason,
					effectiveDate: (/* @__PURE__ */ new Date()).toISOString()
				})
			})).ok) throw new Error("Failed to cancel subscription");
			await loadSubscriptionData();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Cancellation failed");
		} finally {
			setIsLoading(false);
		}
	}, [loadSubscriptionData]);
	const renewSubscription = (0, import_react.useCallback)(async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (!(await fetch(`${API_BASE}/billing/renew`, {
				method: "POST",
				headers: { "X-CSRF-Token": getCsrfToken() },
				credentials: "include"
			})).ok) throw new Error("Failed to renew subscription");
			await loadSubscriptionData();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Renewal failed");
		} finally {
			setIsLoading(false);
		}
	}, [loadSubscriptionData]);
	const getBillingStatus = (0, import_react.useCallback)(() => {
		const sub = billingStore.currentSubscription;
		if (!sub) return "No active subscription";
		if (isTrialActive) return `Trial active (${daysUntilRenewal} days remaining)`;
		if (isSubscriptionActive) return `Active — Renews in ${daysUntilRenewal} days`;
		if (sub.status === "cancelled") return "Cancelled";
		if (sub.status === "expired") return "Expired";
		return sub.status;
	}, [
		billingStore.currentSubscription,
		isTrialActive,
		isSubscriptionActive,
		daysUntilRenewal
	]);
	return {
		subscription: billingStore.currentSubscription,
		currentPlan: billingStore.currentPlan,
		isSubscriptionActive,
		isTrialActive,
		daysUntilRenewal,
		canAccessFeature,
		getLockedFeatures,
		canUpgrade: () => flags.canUpgrade(),
		canDowngrade: () => flags.canDowngrade(),
		upgradePlan,
		downgradePlan,
		changeBillingPeriod,
		cancelSubscription,
		renewSubscription,
		initiateCheckout,
		verifyPayment,
		getPaymentHistory: () => billingStore.invoices,
		retryFailedPayment: async (_paymentId) => {},
		getNextBillingAmount: () => billingStore.getNextBillingAmount(),
		getNextBillingDate: () => billingStore.currentSubscription?.renewalDate ? new Date(billingStore.currentSubscription.renewalDate) : null,
		getBillingStatus,
		isMonetizationEnabled: () => flags.isMonetizationEnabled(),
		isFreeModeActive: flags.isFreeModeActive(),
		shouldShowUpgradePrompt: () => flags.isMonetizationEnabled() && billingStore.currentPlan?.id === SubscriptionPlan.FREE,
		isLoading,
		error,
		lastPaymentStatus: billingStore.lastPaymentStatus
	};
};
//#endregion
//#region src/pages/PricingPage.tsx
/**
* /frontend/src/pages/PricingPage.tsx
* 
* Complete pricing page with plan comparison
* Supports free mode toggle, feature comparison, and plan selection
*/
var _jsxFileName$12 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/PricingPage.tsx";
/**
* Plan Card Component
*/
var PlanCard = ({ plan, isCurrentPlan, onSelectPlan, isLoading }) => {
	const [billingPeriod, setBillingPeriod] = (0, import_react.useState)(BillingPeriod.MONTHLY);
	const flags = getFeatureFlagService();
	const getPrice = () => {
		return billingPeriod === BillingPeriod.MONTHLY ? plan.monthlyPrice : plan.annualPrice;
	};
	const getSavings = () => {
		if (billingPeriod === BillingPeriod.ANNUAL && plan.annualPrice > 0) {
			const monthly = plan.monthlyPrice * 12;
			const savings = monthly - plan.annualPrice;
			return {
				savings,
				percentage: (savings / monthly * 100).toFixed(0)
			};
		}
		return null;
	};
	const savings = getSavings();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: `relative rounded-lg border-2 p-8 transition-all duration-300 ${isCurrentPlan ? "border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900 scale-105 shadow-2xl shadow-cyan-500/20" : "border-slate-700 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50"}`,
		initial: {
			opacity: 0,
			y: 20
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .5 },
		viewport: { once: true },
		whileHover: !isCurrentPlan ? { y: -8 } : {},
		children: [
			plan.id === SubscriptionPlan.PREMIUM && /* @__PURE__ */ (void 0)(motion.div, {
				className: "absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold text-sm rounded-full",
				initial: {
					opacity: 0,
					y: -10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .3 },
				children: "Most Popular"
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 71,
				columnNumber: 9
			}, void 0),
			isCurrentPlan && /* @__PURE__ */ (void 0)("div", {
				className: "mb-4 inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-semibold rounded-full",
				children: "✓ Current Plan"
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 83,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-2xl font-bold text-white mb-2",
				children: plan.displayName
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 89,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-slate-400 text-sm mb-6",
				children: plan.recommendedFor
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 90,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-baseline gap-1 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-5xl font-bold text-white",
							children: ["$", getPrice()]
						}, void 0, true, {
							fileName: _jsxFileName$12,
							lineNumber: 95,
							columnNumber: 11
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-slate-400",
							children: ["/", billingPeriod === BillingPeriod.MONTHLY ? "mo" : "yr"]
						}, void 0, true, {
							fileName: _jsxFileName$12,
							lineNumber: 96,
							columnNumber: 11
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 94,
						columnNumber: 9
					}, void 0),
					savings && /* @__PURE__ */ (void 0)("p", {
						className: "text-xs text-cyan-400",
						children: [
							"Save ",
							savings.percentage,
							"% with annual billing"
						]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 102,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-slate-500 mt-2",
						children: plan.currency
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 107,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$12,
				lineNumber: 93,
				columnNumber: 7
			}, void 0),
			plan.monthlyPrice > 0 && /* @__PURE__ */ (void 0)("div", {
				className: "mb-8 flex gap-2 bg-slate-700/50 p-1 rounded-lg",
				children: [/* @__PURE__ */ (void 0)("button", {
					onClick: () => setBillingPeriod(BillingPeriod.MONTHLY),
					className: `flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${billingPeriod === BillingPeriod.MONTHLY ? "bg-cyan-600 text-white" : "text-slate-300 hover:text-white"}`,
					children: "Monthly"
				}, void 0, false, {
					fileName: _jsxFileName$12,
					lineNumber: 113,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (void 0)("button", {
					onClick: () => setBillingPeriod(BillingPeriod.ANNUAL),
					className: `flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${billingPeriod === BillingPeriod.ANNUAL ? "bg-cyan-600 text-white" : "text-slate-300 hover:text-white"}`,
					children: "Annual"
				}, void 0, false, {
					fileName: _jsxFileName$12,
					lineNumber: 123,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$12,
				lineNumber: 112,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => onSelectPlan(plan.id, billingPeriod),
				disabled: isCurrentPlan || isLoading || flags.isFreeModeActive() && plan.id !== SubscriptionPlan.FREE,
				className: `w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-8 ${isCurrentPlan ? "bg-slate-700 text-slate-400 cursor-default" : "bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"}`,
				children: isCurrentPlan ? "✓ Current Plan" : "Select Plan"
			}, void 0, false, {
				fileName: _jsxFileName$12,
				lineNumber: 137,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-semibold text-slate-400 uppercase tracking-wide",
					children: "Features"
				}, void 0, false, {
					fileName: _jsxFileName$12,
					lineNumber: 151,
					columnNumber: 9
				}, void 0), plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-3",
					children: [feature.included ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						className: "w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5",
						fill: "currentColor",
						viewBox: "0 0 20 20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							fillRule: "evenodd",
							d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
							clipRule: "evenodd"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 156,
							columnNumber: 17
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 155,
						columnNumber: 15
					}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
						className: "w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5",
						fill: "currentColor",
						viewBox: "0 0 20 20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							fillRule: "evenodd",
							d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
							clipRule: "evenodd"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 160,
							columnNumber: 17
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 159,
						columnNumber: 15
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `text-sm ${feature.included ? "text-slate-300" : "text-slate-500 line-through"}`,
						children: feature.name
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 163,
						columnNumber: 13
					}, void 0)]
				}, feature.id, true, {
					fileName: _jsxFileName$12,
					lineNumber: 153,
					columnNumber: 11
				}, void 0))]
			}, void 0, true, {
				fileName: _jsxFileName$12,
				lineNumber: 150,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-8 pt-8 border-t border-slate-700 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold",
								children: "Max Users:"
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 173,
								columnNumber: 11
							}, void 0),
							" ",
							plan.maxUsers || "∞"
						]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 172,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold",
								children: "Storage:"
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 176,
								columnNumber: 11
							}, void 0),
							" ",
							plan.storageGB,
							"GB"
						]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 175,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold",
								children: "API Calls/Month:"
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 179,
								columnNumber: 11
							}, void 0),
							" ",
							(plan.apiCallsPerMonth || 0).toLocaleString()
						]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 178,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold",
								children: "Support:"
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 182,
								columnNumber: 11
							}, void 0),
							" ",
							plan.supportLevel
						]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 181,
						columnNumber: 9
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$12,
				lineNumber: 171,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$12,
		lineNumber: 57,
		columnNumber: 5
	}, void 0);
};
/**
* PricingPage Component
*/
var PricingPage = () => {
	const navigate = useNavigate();
	const billing = useBilling();
	const billingStore = useBillingStore();
	const flags = getFeatureFlagService();
	const [showComparison, setShowComparison] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		flags.initialize();
	}, []);
	const handleSelectPlan = async (plan, period) => {
		if (plan === billing.currentPlan?.id) return;
		try {
			await billing.initiateCheckout(plan, period);
		} catch (error) {
			console.error("Failed to initiate checkout:", error);
		}
	};
	const currentPlanId = billing.currentPlan?.id || SubscriptionPlan.FREE;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: "text-center mb-16",
					initial: {
						opacity: 0,
						y: 30
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .6 },
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent",
							children: "Simple, Transparent Pricing"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 227,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl text-slate-300 mb-8 max-w-2xl mx-auto",
							children: "Choose the perfect plan for your organization. All plans include a 14-day free trial."
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 230,
							columnNumber: 11
						}, void 0),
						flags.isFreeModeActive() && /* @__PURE__ */ (void 0)(motion.div, {
							className: "inline-block px-4 py-2 bg-green-500/20 border border-green-400 text-green-300 rounded-lg text-sm font-semibold mb-6",
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							children: "🎉 Free Mode Active - All features available"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 236,
							columnNumber: 13
						}, void 0),
						!flags.isFreeModeActive() && /* @__PURE__ */ (void 0)(motion.div, {
							className: "inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-lg text-sm font-semibold mb-6",
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							children: "💳 Billing Active"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 246,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$12,
					lineNumber: 221,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid md:grid-cols-3 gap-8 mb-16",
					children: billingStore.availablePlans.map((plan) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PlanCard, {
						plan,
						isCurrentPlan: currentPlanId === plan.id,
						onSelectPlan: handleSelectPlan,
						isLoading: billing.isLoading
					}, plan.id, false, {
						fileName: _jsxFileName$12,
						lineNumber: 259,
						columnNumber: 13
					}, void 0))
				}, void 0, false, {
					fileName: _jsxFileName$12,
					lineNumber: 257,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: "mt-20 pt-12 border-t border-slate-800",
					initial: { opacity: 0 },
					whileInView: { opacity: 1 },
					transition: { duration: .6 },
					viewport: { once: true },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setShowComparison(!showComparison),
						className: "mx-auto block mb-8 px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium",
						children: [showComparison ? "▼ Hide" : "▶ Show", " Feature Comparison"]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 277,
						columnNumber: 11
					}, void 0), showComparison && /* @__PURE__ */ (void 0)(motion.div, {
						className: "overflow-x-auto",
						initial: {
							opacity: 0,
							height: 0
						},
						animate: {
							opacity: 1,
							height: "auto"
						},
						exit: {
							opacity: 0,
							height: 0
						},
						children: /* @__PURE__ */ (void 0)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (void 0)("thead", { children: /* @__PURE__ */ (void 0)("tr", {
								className: "border-b border-slate-700",
								children: [
									/* @__PURE__ */ (void 0)("th", {
										className: "text-left py-4 px-4 font-semibold text-slate-300",
										children: "Feature"
									}, void 0, false, {
										fileName: _jsxFileName$12,
										lineNumber: 294,
										columnNumber: 21
									}, void 0),
									/* @__PURE__ */ (void 0)("th", {
										className: "text-center py-4 px-4 font-semibold text-slate-300",
										children: "Free"
									}, void 0, false, {
										fileName: _jsxFileName$12,
										lineNumber: 295,
										columnNumber: 21
									}, void 0),
									/* @__PURE__ */ (void 0)("th", {
										className: "text-center py-4 px-4 font-semibold text-slate-300",
										children: "Standard"
									}, void 0, false, {
										fileName: _jsxFileName$12,
										lineNumber: 296,
										columnNumber: 21
									}, void 0),
									/* @__PURE__ */ (void 0)("th", {
										className: "text-center py-4 px-4 font-semibold text-slate-300",
										children: "Premium"
									}, void 0, false, {
										fileName: _jsxFileName$12,
										lineNumber: 297,
										columnNumber: 21
									}, void 0)
								]
							}, void 0, true, {
								fileName: _jsxFileName$12,
								lineNumber: 293,
								columnNumber: 19
							}, void 0) }, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 292,
								columnNumber: 17
							}, void 0), /* @__PURE__ */ (void 0)("tbody", { children: billingStore.availablePlans[0]?.features.map((feature) => /* @__PURE__ */ (void 0)("tr", {
								className: "border-b border-slate-800",
								children: [/* @__PURE__ */ (void 0)("td", {
									className: "py-4 px-4 text-slate-300",
									children: feature.name
								}, void 0, false, {
									fileName: _jsxFileName$12,
									lineNumber: 303,
									columnNumber: 23
								}, void 0), billingStore.availablePlans.map((plan) => {
									return /* @__PURE__ */ (void 0)("td", {
										className: "text-center py-4 px-4",
										children: plan.features.find((f) => f.id === feature.id)?.included ? /* @__PURE__ */ (void 0)("span", {
											className: "text-cyan-400",
											children: "✓"
										}, void 0, false, {
											fileName: _jsxFileName$12,
											lineNumber: 309,
											columnNumber: 31
										}, void 0) : /* @__PURE__ */ (void 0)("span", {
											className: "text-slate-600",
											children: "—"
										}, void 0, false, {
											fileName: _jsxFileName$12,
											lineNumber: 311,
											columnNumber: 31
										}, void 0)
									}, `${plan.id}-${feature.id}`, false, {
										fileName: _jsxFileName$12,
										lineNumber: 307,
										columnNumber: 27
									}, void 0);
								})]
							}, feature.id, true, {
								fileName: _jsxFileName$12,
								lineNumber: 302,
								columnNumber: 21
							}, void 0)) }, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 300,
								columnNumber: 17
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$12,
							lineNumber: 291,
							columnNumber: 15
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 285,
						columnNumber: 13
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$12,
					lineNumber: 270,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: "mt-20 max-w-3xl mx-auto",
					initial: { opacity: 0 },
					whileInView: { opacity: 1 },
					transition: { duration: .6 },
					viewport: { once: true },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-3xl font-bold mb-8 text-center",
						children: "Frequently Asked Questions"
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 332,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							{
								q: "Can I change my plan anytime?",
								a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately."
							},
							{
								q: "What payment methods do you accept?",
								a: "We accept all major credit cards, bank transfers, and mobile wallets via Paystack."
							},
							{
								q: "Is there a contract?",
								a: "No contracts. You can cancel anytime. If you cancel, your access ends at the end of your billing period."
							},
							{
								q: "Do you offer discounts for annual billing?",
								a: "Yes! Save up to 16% when you choose annual billing instead of monthly."
							},
							{
								q: "What happens if I exceed my limits?",
								a: "We'll notify you before reaching limits. You can upgrade anytime to get higher limits."
							},
							{
								q: "Do you offer custom plans?",
								a: "Yes! Contact our sales team for custom enterprise plans tailored to your needs."
							}
						].map((item, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "p-4 rounded-lg border border-slate-700 bg-slate-800/40",
							initial: { opacity: 0 },
							whileInView: { opacity: 1 },
							transition: { delay: idx * .05 },
							viewport: { once: true },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-semibold text-cyan-300 mb-2",
								children: item.q
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 369,
								columnNumber: 17
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-slate-400 text-sm",
								children: item.a
							}, void 0, false, {
								fileName: _jsxFileName$12,
								lineNumber: 370,
								columnNumber: 17
							}, void 0)]
						}, idx, true, {
							fileName: _jsxFileName$12,
							lineNumber: 361,
							columnNumber: 15
						}, void 0))
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 334,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$12,
					lineNumber: 325,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: "mt-20 text-center",
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .6 },
					viewport: { once: true },
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-slate-300 mb-6",
						children: ["Need help choosing a plan? ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-cyan-300",
							children: "Contact our sales team"
						}, void 0, false, {
							fileName: _jsxFileName$12,
							lineNumber: 385,
							columnNumber: 40
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$12,
						lineNumber: 384,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => navigate("/contact"),
						className: "px-8 py-3 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-medium",
						children: "Get in Touch"
					}, void 0, false, {
						fileName: _jsxFileName$12,
						lineNumber: 387,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$12,
					lineNumber: 377,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$12,
			lineNumber: 219,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$12,
		lineNumber: 218,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/types/auth.types.ts
var UserRole = /* @__PURE__ */ function(UserRole) {
	UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
	UserRole["TENANT_ADMIN"] = "TENANT_ADMIN";
	UserRole["HR_MANAGER"] = "HR_MANAGER";
	UserRole["MANAGER"] = "MANAGER";
	UserRole["EMPLOYEE"] = "EMPLOYEE";
	UserRole["ACCOUNTANT"] = "ACCOUNTANT";
	UserRole["READONLY"] = "READONLY";
	return UserRole;
}({});
//#endregion
//#region src/components/layout/Navbar.tsx
/**
* /frontend/src/components/layout/Navbar.tsx
*
* Navigation header with logo, menu, and user profile.
* Fixed: imports useAuth from hooks (not directly from context),
* useBilling properly typed, no duplicate identifier issues.
*/
var _jsxFileName$11 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/components/layout/Navbar.tsx";
var Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { theme, setTheme, effectiveTheme } = useTheme();
	const { currentPlan, isFreeModeActive } = useBilling();
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	const isDark = effectiveTheme === "dark";
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleLogout = async () => {
		setIsMenuOpen(false);
		await logout();
		navigate("/login");
	};
	const cycleTheme = () => {
		if (effectiveTheme === "dark") setTheme("light");
		else if (theme === "light") setTheme("system");
		else setTheme("dark");
	};
	const planName = currentPlan?.displayName ?? "Free";
	const planColorClass = currentPlan?.id === "PREMIUM" ? "bg-purple-500/20 text-purple-300 border-purple-400/50" : currentPlan?.id === "STANDARD" ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50" : "bg-slate-500/20 text-slate-300 border-slate-400/50";
	const userInitial = user?.firstName?.charAt(0) ?? user?.lastName?.charAt(0) ?? user?.email?.charAt(0) ?? "U";
	const displayName = user?.firstName ?? user?.lastName ?? user?.email ?? "";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
		className: `sticky top-0 z-50 backdrop-blur-md border-b transition ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex justify-between items-center h-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						className: "flex items-center gap-2",
						onClick: () => navigate("/dashboard"),
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						"aria-label": "Go to dashboard",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-slate-900 select-none",
							children: "Z"
						}, void 0, false, {
							fileName: _jsxFileName$11,
							lineNumber: 82,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-bold text-lg hidden sm:inline",
							children: "Zynctra"
						}, void 0, false, {
							fileName: _jsxFileName$11,
							lineNumber: 85,
							columnNumber: 13
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$11,
						lineNumber: 75,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "hidden md:flex items-center gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => navigate("/dashboard"),
								className: `text-sm font-medium transition hover:text-cyan-400 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Dashboard"
							}, void 0, false, {
								fileName: _jsxFileName$11,
								lineNumber: 90,
								columnNumber: 13
							}, void 0),
							user?.role === UserRole.SUPER_ADMIN && /* @__PURE__ */ (void 0)("button", {
								onClick: () => navigate("/admin"),
								className: `text-sm font-medium transition hover:text-cyan-400 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Admin"
							}, void 0, false, {
								fileName: _jsxFileName$11,
								lineNumber: 99,
								columnNumber: 15
							}, void 0),
							!isFreeModeActive && /* @__PURE__ */ (void 0)("button", {
								onClick: () => navigate("/pricing"),
								className: `text-sm font-medium transition hover:text-cyan-400 ${isDark ? "text-slate-300" : "text-slate-700"}`,
								children: "Pricing"
							}, void 0, false, {
								fileName: _jsxFileName$11,
								lineNumber: 109,
								columnNumber: 15
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$11,
						lineNumber: 89,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3",
						children: [
							user && /* @__PURE__ */ (void 0)(motion.div, {
								className: `hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${planColorClass}`,
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								children: [/* @__PURE__ */ (void 0)("span", { children: "📦" }, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 129,
									columnNumber: 17
								}, void 0), /* @__PURE__ */ (void 0)("span", { children: planName }, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 130,
									columnNumber: 17
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$11,
								lineNumber: 124,
								columnNumber: 15
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
								onClick: cycleTheme,
								className: `p-2 rounded-lg transition ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"}`,
								whileHover: { scale: 1.1 },
								whileTap: { scale: .95 },
								title: `Theme: ${theme}`,
								"aria-label": "Toggle theme",
								children: effectiveTheme === "dark" ? "☀️" : "🌙"
							}, void 0, false, {
								fileName: _jsxFileName$11,
								lineNumber: 135,
								columnNumber: 13
							}, void 0),
							user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "relative",
								ref: menuRef,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: () => setIsMenuOpen((o) => !o),
									className: `flex items-center gap-2 px-3 py-2 rounded-lg transition ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"}`,
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									"aria-expanded": isMenuOpen,
									"aria-label": "User menu",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm select-none",
											children: userInitial
										}, void 0, false, {
											fileName: _jsxFileName$11,
											lineNumber: 165,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "hidden sm:inline text-sm font-medium",
											children: displayName
										}, void 0, false, {
											fileName: _jsxFileName$11,
											lineNumber: 168,
											columnNumber: 19
										}, void 0),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: `text-xs transition-transform ${isMenuOpen ? "rotate-180" : ""}`,
											children: "▼"
										}, void 0, false, {
											fileName: _jsxFileName$11,
											lineNumber: 171,
											columnNumber: 19
										}, void 0)
									]
								}, void 0, true, {
									fileName: _jsxFileName$11,
									lineNumber: 153,
									columnNumber: 17
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: isMenuOpen && /* @__PURE__ */ (void 0)(motion.div, {
									className: `absolute right-0 mt-2 w-52 rounded-lg shadow-lg border z-50 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`,
									initial: {
										opacity: 0,
										y: -8,
										scale: .95
									},
									animate: {
										opacity: 1,
										y: 0,
										scale: 1
									},
									exit: {
										opacity: 0,
										y: -8,
										scale: .95
									},
									transition: { duration: .15 },
									children: /* @__PURE__ */ (void 0)("div", {
										className: "p-2",
										children: [
											/* @__PURE__ */ (void 0)("div", {
												className: `px-4 py-2 text-xs truncate ${isDark ? "text-slate-400" : "text-slate-600"}`,
												children: user.email
											}, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 194,
												columnNumber: 25
											}, void 0),
											/* @__PURE__ */ (void 0)("hr", { className: `my-1 ${isDark ? "border-slate-700" : "border-slate-200"}` }, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 201,
												columnNumber: 25
											}, void 0),
											/* @__PURE__ */ (void 0)(MenuButton, {
												label: "💳 Subscription",
												onClick: () => {
													navigate("/dashboard/subscription");
													setIsMenuOpen(false);
												},
												isDark
											}, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 206,
												columnNumber: 25
											}, void 0),
											user.role === UserRole.SUPER_ADMIN && /* @__PURE__ */ (void 0)(MenuButton, {
												label: "⚙️ Admin Panel",
												onClick: () => {
													navigate("/admin");
													setIsMenuOpen(false);
												},
												isDark
											}, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 215,
												columnNumber: 27
											}, void 0),
											/* @__PURE__ */ (void 0)("hr", { className: `my-1 ${isDark ? "border-slate-700" : "border-slate-200"}` }, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 224,
												columnNumber: 25
											}, void 0),
											/* @__PURE__ */ (void 0)(MenuButton, {
												label: "🚪 Logout",
												onClick: handleLogout,
												isDark,
												danger: true
											}, void 0, false, {
												fileName: _jsxFileName$11,
												lineNumber: 229,
												columnNumber: 25
											}, void 0)
										]
									}, void 0, true, {
										fileName: _jsxFileName$11,
										lineNumber: 193,
										columnNumber: 23
									}, void 0)
								}, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 182,
									columnNumber: 21
								}, void 0) }, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 180,
									columnNumber: 17
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$11,
								lineNumber: 152,
								columnNumber: 15
							}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: () => navigate("/login"),
									className: `px-4 py-2 rounded-lg text-sm font-medium transition ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"}`,
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									children: "Login"
								}, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 242,
									columnNumber: 17
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: () => navigate("/register"),
									className: "px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 transition",
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									children: "Sign Up"
								}, void 0, false, {
									fileName: _jsxFileName$11,
									lineNumber: 254,
									columnNumber: 17
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$11,
								lineNumber: 241,
								columnNumber: 15
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$11,
						lineNumber: 121,
						columnNumber: 11
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$11,
				lineNumber: 73,
				columnNumber: 9
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$11,
			lineNumber: 72,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$11,
		lineNumber: 65,
		columnNumber: 5
	}, void 0);
};
var MenuButton = ({ label, onClick, isDark, danger = false }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
	onClick,
	className: `w-full text-left px-4 py-2 text-sm rounded transition ${danger ? "text-red-400 hover:bg-red-500/10" : isDark ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`,
	children: label
}, void 0, false, {
	fileName: _jsxFileName$11,
	lineNumber: 278,
	columnNumber: 3
}, void 0);
//#endregion
//#region src/components/layout/Sidebar.tsx
/**
* /frontend/src/components/layout/Sidebar.tsx
*
* Collapsible sidebar with navigation menu
*/
var _jsxFileName$10 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/components/layout/Sidebar.tsx";
var MenuItem = ({ label, icon, path: _path, badge, isActive, isDark, isCollapsed, onClick }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
	onClick,
	className: `flex items-center gap-3 px-4 py-3 rounded-lg transition relative group w-full text-left ${isActive ? "bg-gradient-to-r from-cyan-500/30 to-cyan-600/20 text-cyan-300 border border-cyan-500/50" : isDark ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
	whileHover: { x: 4 },
	whileTap: { scale: .98 },
	title: isCollapsed ? label : void 0,
	children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-lg flex-shrink-0",
			children: icon
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 48,
			columnNumber: 5
		}, void 0),
		!isCollapsed && /* @__PURE__ */ (void 0)("span", {
			className: "text-sm font-medium",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 49,
			columnNumber: 22
		}, void 0),
		badge !== void 0 && badge > 0 && /* @__PURE__ */ (void 0)(motion.span, {
			className: "ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full",
			initial: { scale: 0 },
			animate: { scale: 1 },
			children: badge
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 51,
			columnNumber: 7
		}, void 0)
	]
}, void 0, true, {
	fileName: _jsxFileName$10,
	lineNumber: 35,
	columnNumber: 3
}, void 0);
var Sidebar = ({ isOpen = true, onClose }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { effectiveTheme } = useTheme();
	const [isCollapsed, setIsCollapsed] = (0, import_react.useState)(false);
	const isDark = effectiveTheme === "dark";
	const baseMenuItems = [
		{
			label: "Dashboard",
			icon: "📊",
			path: "/dashboard"
		},
		{
			label: "Subscription",
			icon: "💳",
			path: "/dashboard/subscription"
		},
		{
			label: "Employees",
			icon: "👥",
			path: "/dashboard/employees"
		},
		{
			label: "Payroll",
			icon: "💰",
			path: "/dashboard/payroll"
		},
		{
			label: "Performance",
			icon: "📈",
			path: "/dashboard/performance"
		},
		{
			label: "Documents",
			icon: "📁",
			path: "/dashboard/documents"
		}
	];
	const adminMenuItems = [
		{
			label: "Organizations",
			icon: "🏢",
			path: "/admin/organizations"
		},
		{
			label: "Subscriptions",
			icon: "🔑",
			path: "/admin/subscriptions"
		},
		{
			label: "Audit Logs",
			icon: "📋",
			path: "/admin/audit-logs"
		},
		{
			label: "Settings",
			icon: "⚙️",
			path: "/admin/settings"
		}
	];
	const menuItems = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.TENANT_ADMIN ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;
	const handleNavigate = (path) => {
		navigate(path);
		onClose?.();
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [isOpen && /* @__PURE__ */ (void 0)(motion.div, {
		className: "fixed inset-0 bg-black/50 md:hidden z-40",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose
	}, void 0, false, {
		fileName: _jsxFileName$10,
		lineNumber: 105,
		columnNumber: 9
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.aside, {
		className: `fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all border-r ${isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"} ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isCollapsed ? "w-20" : "w-64"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `flex items-center justify-between p-4 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`,
				children: [!isCollapsed && /* @__PURE__ */ (void 0)("h2", {
					className: "text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
					children: "Menu"
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 128,
					columnNumber: 13
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
					onClick: () => setIsCollapsed(!isCollapsed),
					className: `p-2 rounded-lg transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`,
					whileTap: { scale: .95 },
					title: isCollapsed ? "Expand" : "Collapse",
					children: isCollapsed ? "▶" : "◀"
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 132,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 122,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
				className: "flex-1 overflow-y-auto p-4 space-y-2",
				children: menuItems.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MenuItem, {
					...item,
					isActive: location.pathname.startsWith(item.path),
					isDark,
					isCollapsed,
					onClick: () => handleNavigate(item.path)
				}, item.path, false, {
					fileName: _jsxFileName$10,
					lineNumber: 147,
					columnNumber: 13
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$10,
				lineNumber: 145,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `p-4 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MenuItem, {
					label: "Settings",
					icon: "⚙️",
					path: "/dashboard/settings",
					isActive: location.pathname === "/dashboard/settings",
					isDark,
					isCollapsed,
					onClick: () => handleNavigate("/dashboard/settings")
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 162,
					columnNumber: 11
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$10,
				lineNumber: 159,
				columnNumber: 9
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$10,
		lineNumber: 114,
		columnNumber: 7
	}, void 0)] }, void 0, true, {
		fileName: _jsxFileName$10,
		lineNumber: 102,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/components/layout/Footer.tsx
/**
* /frontend/src/components/layout/Footer.tsx
*
* Application footer with links and information
*/
var _jsxFileName$9 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/components/layout/Footer.tsx";
var Footer = () => {
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const links = {
		product: [
			{
				label: "Features",
				href: "#features"
			},
			{
				label: "Pricing",
				href: "/pricing"
			},
			{
				label: "Security",
				href: "#security"
			},
			{
				label: "Roadmap",
				href: "#roadmap"
			}
		],
		company: [
			{
				label: "About",
				href: "#about"
			},
			{
				label: "Blog",
				href: "#blog"
			},
			{
				label: "Careers",
				href: "#careers"
			},
			{
				label: "Contact",
				href: "#contact"
			}
		],
		legal: [
			{
				label: "Privacy",
				href: "/privacy"
			},
			{
				label: "Terms",
				href: "/terms"
			},
			{
				label: "Cookies",
				href: "/cookies"
			},
			{
				label: "Compliance",
				href: "/compliance"
			}
		],
		social: [
			{
				label: "Twitter",
				href: "#twitter",
				icon: "𝕏"
			},
			{
				label: "LinkedIn",
				href: "#linkedin",
				icon: "💼"
			},
			{
				label: "GitHub",
				href: "#github",
				icon: "🐙"
			},
			{
				label: "Discord",
				href: "#discord",
				icon: "💬"
			}
		]
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
		className: `border-t transition ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: "lg:col-span-1",
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-slate-900",
										children: "Z"
									}, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 59,
										columnNumber: 15
									}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-bold text-lg",
										children: "Zynctra"
									}, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 62,
										columnNumber: 15
									}, void 0)]
								}, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 58,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: `text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: "All-in-One HR Platform"
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 64,
									columnNumber: 13
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: `text-xs mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`,
									children: "Streamline your HR operations with AI-powered insights."
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 67,
									columnNumber: 13
								}, void 0)
							]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 52,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { delay: .1 },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-semibold mb-4 text-sm",
								children: "Product"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 79,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
								className: "space-y-2",
								children: links.product.map((link) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: link.href,
									className: `text-sm transition hover:text-cyan-400 ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: link.label
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 83,
									columnNumber: 19
								}, void 0) }, link.label, false, {
									fileName: _jsxFileName$9,
									lineNumber: 82,
									columnNumber: 17
								}, void 0))
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 80,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 73,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { delay: .2 },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-semibold mb-4 text-sm",
								children: "Company"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 103,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
								className: "space-y-2",
								children: links.company.map((link) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: link.href,
									className: `text-sm transition hover:text-cyan-400 ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: link.label
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 107,
									columnNumber: 19
								}, void 0) }, link.label, false, {
									fileName: _jsxFileName$9,
									lineNumber: 106,
									columnNumber: 17
								}, void 0))
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 104,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 97,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { delay: .3 },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-semibold mb-4 text-sm",
								children: "Legal"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 127,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
								className: "space-y-2",
								children: links.legal.map((link) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: link.href,
									className: `text-sm transition hover:text-cyan-400 ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: link.label
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 131,
									columnNumber: 19
								}, void 0) }, link.label, false, {
									fileName: _jsxFileName$9,
									lineNumber: 130,
									columnNumber: 17
								}, void 0))
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 128,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 121,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { delay: .4 },
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
								className: "font-semibold mb-4 text-sm",
								children: "Connect"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 151,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: links.social.map((link) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: link.href,
									title: link.label,
									className: `w-10 h-10 rounded-lg flex items-center justify-center transition ${isDark ? "bg-slate-800 hover:bg-cyan-500/30 text-slate-400 hover:text-cyan-300" : "bg-slate-200 hover:bg-cyan-100 text-slate-600 hover:text-cyan-600"}`,
									children: link.icon
								}, link.label, false, {
									fileName: _jsxFileName$9,
									lineNumber: 154,
									columnNumber: 17
								}, void 0))
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 152,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 145,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 50,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `h-px ${isDark ? "bg-slate-800" : "bg-slate-200"} my-8` }, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 171,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col md:flex-row justify-between items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-sm ${isDark ? "text-slate-500" : "text-slate-600"}`,
							children: [
								"© ",
								currentYear,
								" Zynctra. All rights reserved."
							]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 174,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 mt-4 md:mt-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 178,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
								children: "All systems operational"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 179,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 177,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mt-4 md:mt-0 ${isDark ? "text-slate-600" : "text-slate-500"}`,
							children: "v1.0.0"
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 183,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 173,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$9,
			lineNumber: 49,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `border-t ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-100/50"}`,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-xs text-center ${isDark ? "text-slate-500" : "text-slate-600"}`,
					children: [
						"Built with ❤️ for modern HR teams.",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "#feedback",
							className: "text-cyan-400 hover:text-cyan-300",
							children: "Send feedback"
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 197,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 195,
					columnNumber: 11
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$9,
				lineNumber: 194,
				columnNumber: 9
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 189,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 44,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/hooks/useToast.hook.ts
/**
* /frontend/src/hooks/useToast.hook.ts
*
* Hook for triggering toast notifications.
*/
var useToast = () => {
	const [toasts, setToasts] = (0, import_react.useState)([]);
	const counter = (0, import_react.useRef)(0);
	const removeToast = (0, import_react.useCallback)((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);
	const addToast = (0, import_react.useCallback)((message, type = "info", duration = 5e3, action) => {
		const id = `toast-${counter.current++}`;
		setToasts((prev) => [...prev, {
			id,
			message,
			type,
			duration,
			...action ? { action } : {}
		}]);
		if (duration > 0) setTimeout(() => removeToast(id), duration);
		return id;
	}, [removeToast]);
	return {
		toasts,
		addToast,
		removeToast,
		success: (0, import_react.useCallback)((msg, duration, action) => addToast(msg, "success", duration, action), [addToast]),
		error: (0, import_react.useCallback)((msg, duration, action) => addToast(msg, "error", duration, action), [addToast]),
		warning: (0, import_react.useCallback)((msg, duration, action) => addToast(msg, "warning", duration, action), [addToast]),
		info: (0, import_react.useCallback)((msg, duration, action) => addToast(msg, "info", duration, action), [addToast])
	};
};
//#endregion
//#region src/components/common/ToastContainer.tsx
/**
* /frontend/src/components/common/ToastContainer.tsx
*
* Container for displaying toast notifications.
* Fixed: imports useToast from its correct hook file.
*/
var _jsxFileName$8 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/components/common/ToastContainer.tsx";
var ToastItem = ({ toast, onClose }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: `min-w-[300px] max-w-[500px] px-6 py-4 rounded-lg border flex items-start gap-3 ${{
			success: "bg-green-500/20 border-green-500/50 text-green-300",
			error: "bg-red-500/20 border-red-500/50 text-red-300",
			warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
			info: "bg-blue-500/20 border-blue-500/50 text-blue-300"
		}[toast.type]} shadow-lg`,
		initial: {
			opacity: 0,
			x: 100,
			y: -20
		},
		animate: {
			opacity: 1,
			x: 0,
			y: 0
		},
		exit: {
			opacity: 0,
			x: 100
		},
		transition: { duration: .3 },
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-lg font-bold mt-0.5 flex-shrink-0",
				children: {
					success: "✓",
					error: "✕",
					warning: "⚠",
					info: "ℹ"
				}[toast.type]
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 41,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm font-medium break-words",
					children: toast.message
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 45,
					columnNumber: 9
				}, void 0), toast.action && /* @__PURE__ */ (void 0)("button", {
					onClick: () => {
						toast.action.onClick();
						onClose(toast.id);
					},
					className: "text-xs font-semibold mt-2 hover:opacity-80 transition underline",
					children: toast.action.label
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 47,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$8,
				lineNumber: 44,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
				onClick: () => onClose(toast.id),
				className: "flex-shrink-0 opacity-70 hover:opacity-100 transition",
				whileHover: { scale: 1.1 },
				whileTap: { scale: .9 },
				"aria-label": "Dismiss",
				children: "✕"
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 58,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 32,
		columnNumber: 5
	}, void 0);
};
var ToastContainer = () => {
	const { toasts, removeToast } = useToast();
	useTheme();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed bottom-4 right-4 z-[9999] pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
			mode: "popLayout",
			children: toasts.length > 0 && /* @__PURE__ */ (void 0)("div", {
				className: "flex flex-col gap-3 pointer-events-auto",
				children: toasts.map((toast) => /* @__PURE__ */ (void 0)(ToastItem, {
					toast,
					onClose: removeToast
				}, toast.id, false, {
					fileName: _jsxFileName$8,
					lineNumber: 82,
					columnNumber: 15
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 80,
				columnNumber: 11
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$8,
			lineNumber: 78,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 77,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/components/layout/AppLayout.tsx
/**
* /frontend/src/components/layout/AppLayout.tsx
*
* Standard authenticated app layout with Navbar, Sidebar, and content area.
*/
var _jsxFileName$7 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/components/layout/AppLayout.tsx";
var AppLayout = ({ children, showSidebar = true, showFooter = false }) => {
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex flex-col ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navbar, {}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 37,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-1 overflow-hidden",
				children: [showSidebar && /* @__PURE__ */ (void 0)(Sidebar, {
					isOpen: sidebarOpen,
					onClose: () => setSidebarOpen(false)
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 41,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
					className: "flex-1 overflow-y-auto",
					children: [showSidebar && /* @__PURE__ */ (void 0)("button", {
						onClick: () => setSidebarOpen(true),
						className: `md:hidden m-4 p-2 rounded-lg ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"}`,
						"aria-label": "Open menu",
						children: "≡"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 50,
						columnNumber: 13
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
						children
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 63,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$7,
					lineNumber: 47,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 39,
				columnNumber: 7
			}, void 0),
			showFooter && /* @__PURE__ */ (void 0)(Footer, {}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 69,
				columnNumber: 22
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ToastContainer, {}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 72,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 30,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/pages/SubscriptionDashboard.tsx
/**
* /frontend/src/pages/SubscriptionDashboard.tsx
*
* Subscription and billing management dashboard.
* Fixed: all useBilling return values used correctly (isFreeModeActive is boolean);
* getNextBillingDate() returns Date|null; proper null checks throughout.
*/
var _jsxFileName$6 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/SubscriptionDashboard.tsx";
var flags = getFeatureFlagService();
var SubscriptionDashboard = () => {
	const navigate = useNavigate();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const billing = useBilling();
	const billingStore = useBillingStore();
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [showCancelDialog, setShowCancelDialog] = (0, import_react.useState)(false);
	const [cancelReason, setCancelReason] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		flags.initialize();
	}, []);
	const nextBillingDate = billing.getNextBillingDate();
	const handleCancel = async () => {
		if (!cancelReason.trim()) return;
		await billing.cancelSubscription(cancelReason);
		setShowCancelDialog(false);
		setCancelReason("");
	};
	const sectionCard = `rounded-lg border p-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;
	const OverviewTab = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} bg-gradient-to-br ${isDark ? "from-slate-800 to-slate-900 border-cyan-500/30" : "from-white to-cyan-50 border-cyan-200"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between flex-wrap gap-4 mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-sm mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Current Plan"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 53,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-2xl font-bold",
							children: billing.currentPlan?.displayName ?? "No Plan"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 54,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`,
							children: billing.getBillingStatus()
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 57,
							columnNumber: 13
						}, void 0)
					] }, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 52,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `text-sm px-3 py-1 rounded-full border font-semibold ${billing.isSubscriptionActive ? "bg-green-500/20 text-green-300 border-green-400/50" : "bg-slate-500/20 text-slate-300 border-slate-400/50"}`,
						children: billing.isSubscriptionActive ? "● Active" : "○ Inactive"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 61,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 51,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 gap-5 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Monthly Cost"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 72,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold text-cyan-400",
							children: [
								"$",
								billing.currentPlan?.monthlyPrice ?? 0,
								"/mo"
							]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 73,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 71,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Next Billing"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 78,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold",
							children: nextBillingDate ? nextBillingDate.toLocaleDateString() : "—"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 79,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 77,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Days Remaining"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 84,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold",
							children: billing.daysUntilRenewal
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 85,
							columnNumber: 13
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 83,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 70,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap gap-3",
					children: [
						billing.canUpgrade() && billing.currentPlan?.id !== SubscriptionPlan.PREMIUM && /* @__PURE__ */ (void 0)("button", {
							onClick: () => navigate("/pricing"),
							className: "px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium text-sm",
							children: "⬆ Upgrade Plan"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 91,
							columnNumber: 13
						}, void 0),
						billing.canDowngrade() && billing.currentPlan?.id !== SubscriptionPlan.FREE && /* @__PURE__ */ (void 0)("button", {
							onClick: () => navigate("/pricing"),
							className: `px-4 py-2 rounded-lg border font-medium text-sm transition ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`,
							children: "⬇ Downgrade"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 99,
							columnNumber: 13
						}, void 0),
						billing.isSubscriptionActive && /* @__PURE__ */ (void 0)("button", {
							onClick: () => setShowCancelDialog(true),
							className: "px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition font-medium text-sm",
							children: "✕ Cancel Subscription"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 107,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 89,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 50,
			columnNumber: 7
		}, void 0), billing.currentPlan && /* @__PURE__ */ (void 0)("div", {
			className: sectionCard,
			children: [/* @__PURE__ */ (void 0)("h3", {
				className: "font-semibold mb-4",
				children: "Included Features"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 120,
				columnNumber: 11
			}, void 0), /* @__PURE__ */ (void 0)("div", {
				className: "grid md:grid-cols-2 gap-3",
				children: billing.currentPlan.features.filter((f) => f.included).map((f) => /* @__PURE__ */ (void 0)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-cyan-400 mt-0.5 flex-shrink-0",
						children: "✓"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 126,
						columnNumber: 19
					}, void 0), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
						className: "text-sm font-medium",
						children: f.name
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 128,
						columnNumber: 21
					}, void 0), /* @__PURE__ */ (void 0)("p", {
						className: `text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`,
						children: f.description
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 129,
						columnNumber: 21
					}, void 0)] }, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 127,
						columnNumber: 19
					}, void 0)]
				}, f.id, true, {
					fileName: _jsxFileName$6,
					lineNumber: 125,
					columnNumber: 17
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 121,
				columnNumber: 11
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 119,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 48,
		columnNumber: 5
	}, void 0);
	const InvoicesTab = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3",
		children: billingStore.invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} text-center py-12`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-4xl mb-3",
				children: "📄"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 143,
				columnNumber: 11
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: isDark ? "text-slate-400" : "text-slate-600",
				children: "No invoices yet"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 144,
				columnNumber: 11
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 142,
			columnNumber: 9
		}, void 0) : billingStore.invoices.map((inv) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} flex items-center justify-between gap-4`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-medium text-sm",
				children: inv.invoiceNumber
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 150,
				columnNumber: 15
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: `text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`,
				children: [
					new Date(inv.issueDate).toLocaleDateString(),
					" — $",
					inv.amount.toFixed(2)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 151,
				columnNumber: 15
			}, void 0)] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 149,
				columnNumber: 13
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: `text-xs px-2 py-1 rounded-full font-medium ${inv.status === "paid" ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`,
					children: inv.status
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 156,
					columnNumber: 15
				}, void 0), inv.pdfUrl && /* @__PURE__ */ (void 0)("a", {
					href: inv.pdfUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-cyan-400 hover:text-cyan-300 text-sm font-medium",
					children: "↓ PDF"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 160,
					columnNumber: 17
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 155,
				columnNumber: 13
			}, void 0)]
		}, inv.id, true, {
			fileName: _jsxFileName$6,
			lineNumber: 148,
			columnNumber: 11
		}, void 0))
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 140,
		columnNumber: 5
	}, void 0);
	const PaymentMethodsTab = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		children: billingStore.paymentMethods.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} text-center py-12`,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-4xl mb-3",
					children: "💳"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 175,
					columnNumber: 11
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`,
					children: "No payment methods saved"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 176,
					columnNumber: 11
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					className: "px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium",
					children: "Add Payment Method"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 177,
					columnNumber: 11
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 174,
			columnNumber: 9
		}, void 0) : billingStore.paymentMethods.map((pm) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} flex items-center justify-between ${pm.isDefault ? "border-cyan-400" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [pm.cardBrand && /* @__PURE__ */ (void 0)("p", {
				className: "font-medium",
				children: [
					pm.cardBrand,
					" •••• ",
					pm.cardLast4
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 186,
				columnNumber: 17
			}, void 0), pm.expiryDate && /* @__PURE__ */ (void 0)("p", {
				className: `text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`,
				children: ["Expires: ", pm.expiryDate]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 189,
				columnNumber: 17
			}, void 0)] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 184,
				columnNumber: 13
			}, void 0), pm.isDefault && /* @__PURE__ */ (void 0)("span", {
				className: "text-xs bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded",
				children: "Default"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 193,
				columnNumber: 15
			}, void 0)]
		}, pm.id, true, {
			fileName: _jsxFileName$6,
			lineNumber: 183,
			columnNumber: 11
		}, void 0))
	}, void 0, false, {
		fileName: _jsxFileName$6,
		lineNumber: 172,
		columnNumber: 5
	}, void 0);
	const SettingsTab = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} flex items-center justify-between`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-semibold",
				children: "Billing Frequency"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 205,
				columnNumber: 11
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: `text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`,
				children: "Switch between monthly and annual billing"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 206,
				columnNumber: 11
			}, void 0)] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 204,
				columnNumber: 9
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => void billing.changeBillingPeriod(BillingPeriod.MONTHLY),
					className: `px-3 py-1.5 rounded-lg text-sm font-medium transition ${billing.subscription?.billingPeriod === BillingPeriod.MONTHLY ? "bg-cyan-600 text-white" : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`,
					children: "Monthly"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 211,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => void billing.changeBillingPeriod(BillingPeriod.ANNUAL),
					className: `px-3 py-1.5 rounded-lg text-sm font-medium transition ${billing.subscription?.billingPeriod === BillingPeriod.ANNUAL ? "bg-cyan-600 text-white" : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`,
					children: "Annual (save 16%)"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 217,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 210,
				columnNumber: 9
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 203,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `${sectionCard} flex items-center justify-between`,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "font-semibold",
				children: "Auto-Renewal"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 228,
				columnNumber: 11
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: `text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`,
				children: "Automatically renew your subscription"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 229,
				columnNumber: 11
			}, void 0)] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 227,
				columnNumber: 9
			}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "relative inline-flex items-center cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "checkbox",
					defaultChecked: true,
					className: "sr-only peer"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 234,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-11 h-6 bg-slate-600 peer-checked:bg-cyan-600 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:after:translate-x-full" }, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 235,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 233,
				columnNumber: 9
			}, void 0)]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 226,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 202,
		columnNumber: 5
	}, void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppLayout, {
		showSidebar: true,
		showFooter: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				initial: {
					opacity: 0,
					y: -16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-3xl font-bold mb-1",
						children: "Subscription & Billing"
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 251,
						columnNumber: 9
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: isDark ? "text-slate-400" : "text-slate-600",
						children: "Manage your plan, payment methods, and billing settings."
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 252,
						columnNumber: 9
					}, void 0),
					billing.error && /* @__PURE__ */ (void 0)("div", {
						className: `mt-4 p-3 rounded-lg border text-sm ${isDark ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-50 border-red-300 text-red-700"}`,
						children: billing.error
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 256,
						columnNumber: 11
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 250,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `border-b mb-6 ${isDark ? "border-slate-700" : "border-slate-200"}`,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-6 overflow-x-auto",
					children: [
						{
							id: "overview",
							label: "📊 Overview"
						},
						{
							id: "invoices",
							label: "📄 Invoices"
						},
						{
							id: "payment-methods",
							label: "💳 Payment Methods"
						},
						{
							id: "settings",
							label: "⚙️ Settings"
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.id ? "border-cyan-400 text-cyan-300" : `border-transparent ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"}`}`,
						children: tab.label
					}, tab.id, false, {
						fileName: _jsxFileName$6,
						lineNumber: 266,
						columnNumber: 13
					}, void 0))
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 264,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 263,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -8
					},
					transition: { duration: .2 },
					children: [
						activeTab === "overview" && /* @__PURE__ */ (void 0)(OverviewTab, {}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 284,
							columnNumber: 40
						}, void 0),
						activeTab === "invoices" && /* @__PURE__ */ (void 0)(InvoicesTab, {}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 285,
							columnNumber: 40
						}, void 0),
						activeTab === "payment-methods" && /* @__PURE__ */ (void 0)(PaymentMethodsTab, {}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 286,
							columnNumber: 47
						}, void 0),
						activeTab === "settings" && /* @__PURE__ */ (void 0)(SettingsTab, {}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 287,
							columnNumber: 40
						}, void 0)
					]
				}, activeTab, true, {
					fileName: _jsxFileName$6,
					lineNumber: 283,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 282,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, { children: showCancelDialog && /* @__PURE__ */ (void 0)(motion.div, {
				className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				children: /* @__PURE__ */ (void 0)(motion.div, {
					className: `p-8 rounded-xl border max-w-md w-full ${isDark ? "bg-slate-900 border-red-500/50" : "bg-white border-red-300"}`,
					initial: { scale: .95 },
					animate: { scale: 1 },
					exit: { scale: .95 },
					children: [
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-xl font-bold mb-3",
							children: "Cancel Subscription?"
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 296,
							columnNumber: 15
						}, void 0),
						/* @__PURE__ */ (void 0)("p", {
							className: `text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`,
							children: "Please share why you're cancelling so we can improve."
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 297,
							columnNumber: 15
						}, void 0),
						/* @__PURE__ */ (void 0)("textarea", {
							value: cancelReason,
							onChange: (e) => setCancelReason(e.target.value),
							placeholder: "Your feedback…",
							rows: 4,
							className: `w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300"}`
						}, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 300,
							columnNumber: 15
						}, void 0),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									setShowCancelDialog(false);
									setCancelReason("");
								},
								className: `flex-1 px-4 py-2 rounded-lg font-medium transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`,
								children: "Keep Plan"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 308,
								columnNumber: 17
							}, void 0), /* @__PURE__ */ (void 0)("button", {
								onClick: handleCancel,
								disabled: billing.isLoading || !cancelReason.trim(),
								className: "flex-1 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition",
								children: billing.isLoading ? "Cancelling…" : "Cancel Plan"
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 311,
								columnNumber: 17
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$6,
							lineNumber: 307,
							columnNumber: 15
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 295,
					columnNumber: 13
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 294,
				columnNumber: 11
			}, void 0) }, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 292,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 249,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/pages/PaymentVerification.tsx
/**
* /frontend/src/pages/PaymentVerification.tsx
*
* Payment verification page — handles Paystack callback.
* Fixed: uses useBilling hook correctly; no process.env.
*/
var _jsxFileName$5 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/PaymentVerification.tsx";
var PaymentVerification = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { verifyPayment, isLoading } = useBilling();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const [state, setState] = (0, import_react.useState)("processing");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		runVerification();
	}, []);
	const runVerification = async () => {
		const reference = searchParams.get("reference") ?? sessionStorage.getItem("paymentReference");
		if (!reference) {
			setState("failed");
			setErrorMessage("No payment reference found. Please contact support.");
			return;
		}
		if (await verifyPayment(reference) === PaymentStatus.COMPLETED) {
			setState("success");
			sessionStorage.removeItem("paymentReference");
			setTimeout(() => navigate("/dashboard/subscription", { replace: true }), 3e3);
		} else {
			setState("failed");
			setErrorMessage("Payment verification failed. Please try again or contact support.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex items-center justify-center px-4 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-gradient-to-br from-slate-50 via-white to-slate-100"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "max-w-md w-full",
			initial: {
				opacity: 0,
				scale: .95
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			transition: { duration: .4 },
			children: [
				state === "processing" && /* @__PURE__ */ (void 0)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (void 0)(motion.div, {
							className: "inline-block mb-6",
							animate: { rotate: 360 },
							transition: {
								duration: 2,
								repeat: Infinity,
								ease: "linear"
							},
							children: /* @__PURE__ */ (void 0)("div", { className: "w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 75,
								columnNumber: 15
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 70,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-2xl font-bold mb-2",
							children: "Verifying Payment"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 77,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("p", {
							className: isDark ? "text-slate-400" : "text-slate-600",
							children: "Please wait while we confirm your payment…"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 78,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 69,
					columnNumber: 11
				}, void 0),
				state === "success" && /* @__PURE__ */ (void 0)(motion.div, {
					className: "text-center",
					initial: { scale: .9 },
					animate: { scale: 1 },
					transition: {
						type: "spring",
						stiffness: 200
					},
					children: [
						/* @__PURE__ */ (void 0)(motion.div, {
							className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-400 mb-6",
							initial: { scale: 0 },
							animate: { scale: 1 },
							transition: {
								delay: .1,
								type: "spring"
							},
							children: /* @__PURE__ */ (void 0)("span", {
								className: "text-green-400 text-3xl",
								children: "✓"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 97,
								columnNumber: 15
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 91,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-2xl font-bold mb-2",
							children: "Payment Successful!"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 99,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("p", {
							className: `mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`,
							children: "Your subscription has been activated. Redirecting to your dashboard…"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 100,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("button", {
							onClick: () => navigate("/dashboard/subscription", { replace: true }),
							className: "w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition",
							children: "Go to Dashboard"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 103,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("p", {
							className: `text-xs mt-3 ${isDark ? "text-slate-500" : "text-slate-400"}`,
							children: "Redirecting automatically in 3 seconds…"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 109,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 85,
					columnNumber: 11
				}, void 0),
				state === "failed" && /* @__PURE__ */ (void 0)(motion.div, {
					className: "text-center",
					initial: { scale: .9 },
					animate: { scale: 1 },
					transition: { type: "spring" },
					children: [
						/* @__PURE__ */ (void 0)(motion.div, {
							className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border border-red-400 mb-6",
							initial: { scale: 0 },
							animate: { scale: 1 },
							transition: {
								delay: .1,
								type: "spring"
							},
							children: /* @__PURE__ */ (void 0)("span", {
								className: "text-red-400 text-3xl",
								children: "✕"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 128,
								columnNumber: 15
							}, void 0)
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 122,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("h2", {
							className: "text-2xl font-bold mb-2",
							children: "Payment Failed"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 130,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("p", {
							className: `mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`,
							children: errorMessage ?? "We could not verify your payment. Please try again."
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 131,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (void 0)("button", {
								onClick: () => navigate("/pricing", { replace: true }),
								className: `flex-1 px-4 py-3 rounded-lg font-semibold transition ${isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"}`,
								children: "Back to Pricing"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 135,
								columnNumber: 15
							}, void 0), /* @__PURE__ */ (void 0)("button", {
								onClick: () => {
									setState("processing");
									runVerification();
								},
								disabled: isLoading,
								className: "flex-1 px-4 py-3 rounded-lg font-semibold bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 transition",
								children: isLoading ? "Retrying…" : "Retry"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 143,
								columnNumber: 15
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 134,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (void 0)("div", {
							className: `mt-6 p-4 rounded-lg border text-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`,
							children: [/* @__PURE__ */ (void 0)("p", {
								className: isDark ? "text-slate-400" : "text-slate-600",
								children: "Need help? Contact support:"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 153,
								columnNumber: 15
							}, void 0), /* @__PURE__ */ (void 0)("p", {
								className: "text-cyan-400 font-medium mt-1",
								children: "support@zynctra.com"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 154,
								columnNumber: 15
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 152,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 116,
					columnNumber: 11
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 62,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$5,
		lineNumber: 55,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/services/supabase/supabaseClient.ts
/**
* /frontend/src/services/supabase/supabaseClient.ts
*
* Supabase client — stores only non-sensitive data.
* Gracefully no-ops when credentials are not configured.
*/
var supabaseClient_exports = /* @__PURE__ */ __exportAll({
	auditLogService: () => auditLogService,
	initSupabase: () => initSupabase,
	orgBillingService: () => orgBillingService,
	userProfileService: () => userProfileService
});
var SUPABASE_URL = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_SUPABASE_URL"] ?? {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["REACT_APP_SUPABASE_URL"] ?? "";
var SUPABASE_ANON_KEY = {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["VITE_SUPABASE_ANON_KEY"] ?? {
	"BASE_URL": "/",
	"DEV": true,
	"MODE": "production",
	"PROD": false,
	"REACT_APP_ANALYTICS_ENABLED": "true",
	"REACT_APP_ANIMATIONS_ENABLED": "true",
	"REACT_APP_API_TIMEOUT": "30000",
	"REACT_APP_API_URL": "https://api.zynctra.com/api",
	"REACT_APP_AUTO_LOGOUT": "true",
	"REACT_APP_COMPANY_NAME": "Zynctra HR",
	"REACT_APP_CORS_CREDENTIALS": "true",
	"REACT_APP_CSP_ENABLED": "true",
	"REACT_APP_CURRENCIES": "USD,NGN,EUR,GBP",
	"REACT_APP_DATA_RESIDENCY": "US_EAST",
	"REACT_APP_DEBUG": "false",
	"REACT_APP_DEFAULT_PLAN": "FREE",
	"REACT_APP_DEFAULT_THEME": "system",
	"REACT_APP_ENABLE_AI_ASSISTANT": "true",
	"REACT_APP_ENABLE_ANOMALY_DETECTION": "true",
	"REACT_APP_ENABLE_PAYROLL_EXPORTS": "true",
	"REACT_APP_ENABLE_SECURE_TERMINAL": "true",
	"REACT_APP_ENFORCE_HTTPS": "true",
	"REACT_APP_ENV": "production",
	"REACT_APP_FEATURE_ANALYTICS": "true",
	"REACT_APP_FEATURE_COMPLIANCE": "false",
	"REACT_APP_FEATURE_PAYROLL": "false",
	"REACT_APP_FEATURE_TERMINAL": "false",
	"REACT_APP_FREE_MODE": "true",
	"REACT_APP_GA_ID": "",
	"REACT_APP_GROQ_MODEL": "mixtral-8x7b-32768",
	"REACT_APP_LLM_PROVIDER": "groq",
	"REACT_APP_LOG_LEVEL": "warn",
	"REACT_APP_MFA_REQUIRED": "true",
	"REACT_APP_MONETIZATION_ENABLED": "false",
	"REACT_APP_PAYMENT_PROVIDER": "paystack",
	"REACT_APP_PAYSTACK_PUBLIC_KEY": "pk_live_your_public_key_here",
	"REACT_APP_REQUEST_TIMEOUT": "30000",
	"REACT_APP_REQUIRE_PAYMENT_METHOD": "false",
	"REACT_APP_SALES_EMAIL": "sales@zynctra.com",
	"REACT_APP_SENTRY_DSN": "",
	"REACT_APP_SESSION_TIMEOUT": "3600000",
	"REACT_APP_SUPABASE_ANON_KEY": "sb_publishable_atMOOTuBaCb7b0Ni97bEPw_9roU-wTV",
	"REACT_APP_SUPABASE_URL": "https://pruhbzjeueinnbruvatv.supabase.co",
	"REACT_APP_SUPPORT_EMAIL": "support@zynctra.com",
	"REACT_APP_TENANT_ID": "default",
	"REACT_APP_TOKEN_REFRESH_INTERVAL": "900000",
	"REACT_APP_TRIAL_DAYS": "14",
	"REACT_APP_VERSION": "1.0.0",
	"REACT_APP_WEBSOCKET_URL": "wss://api.zynctra.com/ws",
	"SSR": false,
	"VITE_USER_NODE_ENV": "development"
}["REACT_APP_SUPABASE_ANON_KEY"] ?? "";
var supabaseClient = null;
var initSupabase = () => {
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
	if (!supabaseClient) supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: {
		persistSession: true,
		autoRefreshToken: true
	} });
	return supabaseClient;
};
var getSupabase = () => {
	if (supabaseClient) return supabaseClient;
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
	try {
		return initSupabase();
	} catch {
		return null;
	}
};
var userProfileService = {
	async getProfile(userId) {
		const sb = getSupabase();
		if (!sb) return null;
		const { data, error } = await sb.from("user_profiles").select("*").eq("user_id", userId).single();
		if (error) {
			console.error("[Supabase] getProfile:", error.message);
			return null;
		}
		return data;
	},
	async upsertProfile(profile) {
		const sb = getSupabase();
		if (!sb) return null;
		const { data, error } = await sb.from("user_profiles").upsert(profile, { onConflict: "user_id" }).select().single();
		if (error) {
			console.error("[Supabase] upsertProfile:", error.message);
			return null;
		}
		return data;
	},
	async updateTheme(userId, theme) {
		const sb = getSupabase();
		if (!sb) return false;
		const { error } = await sb.from("user_profiles").update({
			theme_preference: theme,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("user_id", userId);
		if (error) {
			console.error("[Supabase] updateTheme:", error.message);
			return false;
		}
		return true;
	},
	async updateLastLogin(userId) {
		const sb = getSupabase();
		if (!sb) return false;
		const { error } = await sb.from("user_profiles").update({ last_login_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", userId);
		if (error) {
			console.error("[Supabase] updateLastLogin:", error.message);
			return false;
		}
		return true;
	}
};
var orgBillingService = {
	async getBillingRecord(organizationId) {
		const sb = getSupabase();
		if (!sb) return null;
		const { data, error } = await sb.from("org_billing").select("*").eq("organization_id", organizationId).single();
		if (error) {
			console.error("[Supabase] getBillingRecord:", error.message);
			return null;
		}
		return data;
	},
	async updateBillingRecord(organizationId, updates) {
		const sb = getSupabase();
		if (!sb) return null;
		const { data, error } = await sb.from("org_billing").update({
			...updates,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("organization_id", organizationId).select().single();
		if (error) {
			console.error("[Supabase] updateBillingRecord:", error.message);
			return null;
		}
		return data;
	},
	async getAllBillingRecords(limit = 100) {
		const sb = getSupabase();
		if (!sb) return [];
		const { data, error } = await sb.from("org_billing").select("*").order("updated_at", { ascending: false }).limit(limit);
		if (error) {
			console.error("[Supabase] getAllBillingRecords:", error.message);
			return [];
		}
		return data ?? [];
	}
};
var auditLogService = {
	async createLog(log) {
		const sb = getSupabase();
		if (!sb) return null;
		const { data, error } = await sb.from("audit_logs").insert({
			...log,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}).select().single();
		if (error) {
			console.error("[Supabase] createLog:", error.message);
			return null;
		}
		return data;
	},
	async getLogs(filters, limit = 100) {
		const sb = getSupabase();
		if (!sb) return [];
		let query = sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(limit);
		if (filters?.adminId) query = query.eq("admin_id", filters.adminId);
		if (filters?.resourceType) query = query.eq("resource_type", filters.resourceType);
		if (filters?.severity) query = query.eq("severity", filters.severity);
		const { data, error } = await query;
		if (error) {
			console.error("[Supabase] getLogs:", error.message);
			return [];
		}
		return data ?? [];
	}
};
//#endregion
//#region src/pages/AdminPanel.tsx
/**
* /frontend/src/pages/AdminPanel.tsx
* 
* Professional enterprise admin panel
* Complete control over:
* - Monetization modes
* - Organization management
* - Billing and subscriptions
* - Audit logs
* - User management
* - System settings
* 
* Only accessible to SUPER_ADMIN
*/
var _jsxFileName$4 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/AdminPanel.tsx";
/**
* Admin Panel Component
*/
var AdminPanel = () => {
	const { user } = useAuth();
	const { theme, setTheme } = useTheme();
	const [activeTab, setActiveTab] = (0, import_react.useState)("dashboard");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [monetizationSettings, setMonetizationSettings] = (0, import_react.useState)(null);
	const [organizations, setOrganizations] = (0, import_react.useState)([]);
	const [auditLogs, setAuditLogs] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	const [successMessage, setSuccessMessage] = (0, import_react.useState)(null);
	/**
	* Check permissions
	*/
	const hasPermission = () => {
		return user?.role === UserRole.SUPER_ADMIN;
	};
	/**
	* Load data on mount
	*/
	(0, import_react.useEffect)(() => {
		if (hasPermission()) loadData();
	}, [user, activeTab]);
	/**
	* Load admin data based on active tab
	*/
	const loadData = async () => {
		setIsLoading(true);
		setError(null);
		try {
			switch (activeTab) {
				case "monetization":
					await loadMonetizationSettings();
					break;
				case "organizations":
					await loadOrganizations();
					break;
				case "subscriptions":
					await loadSubscriptions();
					break;
				case "audit-logs":
					await loadAuditLogs();
					break;
				case "dashboard":
					await loadDashboardData();
					break;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load data");
		} finally {
			setIsLoading(false);
		}
	};
	const loadMonetizationSettings = async () => {
		setMonetizationSettings(await (await fetch(`${{}.REACT_APP_API_URL}/admin/monetization-settings`, { credentials: "include" })).json());
	};
	const loadOrganizations = async () => {
		setOrganizations((await (await fetch(`${{}.REACT_APP_API_URL}/admin/organizations`, { credentials: "include" })).json()).organizations || []);
	};
	const loadSubscriptions = async () => {
		setOrganizations(await orgBillingService.getAllBillingRecords(50));
	};
	const loadAuditLogs = async () => {
		setAuditLogs(await auditLogService.getLogs({}, 100));
	};
	const loadDashboardData = async () => {
		setOrganizations(await orgBillingService.getAllBillingRecords(100));
	};
	/**
	* Toggle monetization mode
	*/
	const handleToggleMonetization = async (mode) => {
		if (!confirm(`Are you sure you want to switch to ${mode.toUpperCase()} MODE? This affects all organizations.`)) return;
		setIsLoading(true);
		try {
			const response = await fetch(`${{}.REACT_APP_API_URL}/admin/monetization-settings`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					freeMode: mode === "free",
					enabled: mode === "paid"
				})
			});
			if (!response.ok) throw new Error("Failed to update settings");
			setMonetizationSettings(await response.json());
			setSuccessMessage(`✓ Switched to ${mode.toUpperCase()} MODE`);
			setTimeout(() => setSuccessMessage(null), 3e3);
			logSecurityEvent(`MONETIZATION_MODE_${mode.toUpperCase()}`, `Admin switched to ${mode} mode`, "HIGH");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update");
		} finally {
			setIsLoading(false);
		}
	};
	/**
	* Log security event
	*/
	const logSecurityEvent = async (type, description, severity) => {
		try {
			await fetch(`${{}.REACT_APP_API_URL}/admin/security-events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-Token": getCsrfToken()
				},
				credentials: "include",
				body: JSON.stringify({
					eventType: type,
					description,
					severity
				})
			});
		} catch (error) {
			console.error("Failed to log security event:", error);
		}
	};
	const getCsrfToken = () => {
		return document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "";
	};
	if (!hasPermission()) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `p-8 rounded-lg border-2 max-w-md ${theme === "dark" ? "bg-slate-900 border-red-500 text-white" : "bg-white border-red-500 text-slate-900"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-2xl font-bold text-red-500 mb-4",
					children: "Access Denied"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 217,
					columnNumber: 11
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mb-6",
					children: "Only SUPER_ADMIN can access this panel."
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 218,
					columnNumber: 11
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => window.history.back(),
					className: "w-full px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition",
					children: "Go Back"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 219,
					columnNumber: 11
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 214,
			columnNumber: 9
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 209,
		columnNumber: 7
	}, void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"}`,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: `border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/50"} backdrop-blur sticky top-0 z-40`,
			initial: {
				opacity: 0,
				y: -20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "max-w-7xl mx-auto px-6 py-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
					children: "Admin Panel"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 244,
					columnNumber: 13
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
					children: "Complete system administration and control"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 247,
					columnNumber: 13
				}, void 0)] }, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 243,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 bg-slate-700/20 rounded-lg p-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setTheme("light"),
							className: `px-3 py-1 rounded transition ${theme === "light" ? "bg-yellow-400 text-slate-900 font-semibold" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`,
							children: "☀️"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 254,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setTheme("dark"),
							className: `px-3 py-1 rounded transition ${theme === "dark" ? "bg-slate-700 text-white font-semibold" : theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"}`,
							children: "🌙"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 264,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setTheme("system"),
							className: `px-3 py-1 rounded transition ${theme === "system" ? "bg-slate-600 text-white font-semibold" : theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`,
							children: "🔄"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 274,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 253,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 242,
				columnNumber: 9
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 237,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-7xl mx-auto px-6 py-8",
			children: [
				error && /* @__PURE__ */ (void 0)(motion.div, {
					className: `mb-6 p-4 rounded-lg border ${theme === "dark" ? "bg-red-500/20 border-red-500/50 text-red-300" : "bg-red-100 border-red-300 text-red-900"}`,
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					children: error
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 293,
					columnNumber: 11
				}, void 0),
				successMessage && /* @__PURE__ */ (void 0)(motion.div, {
					className: `mb-6 p-4 rounded-lg border ${theme === "dark" ? "bg-green-500/20 border-green-500/50 text-green-300" : "bg-green-100 border-green-300 text-green-900"}`,
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					children: successMessage
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 307,
					columnNumber: 11
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: `mb-8 flex gap-2 overflow-x-auto pb-4 border-b ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`,
					children: [
						{
							id: "dashboard",
							label: "📊 Dashboard",
							icon: "📈"
						},
						{
							id: "monetization",
							label: "💳 Monetization",
							icon: "💰"
						},
						{
							id: "organizations",
							label: "🏢 Organizations",
							icon: "🏢"
						},
						{
							id: "subscriptions",
							label: "📜 Subscriptions",
							icon: "📋"
						},
						{
							id: "audit-logs",
							label: "📝 Audit Logs",
							icon: "🔐"
						},
						{
							id: "users",
							label: "👥 Users",
							icon: "👤"
						},
						{
							id: "settings",
							label: "⚙️ Settings",
							icon: "🔧"
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `whitespace-nowrap px-4 py-3 rounded-lg font-medium transition ${activeTab === tab.id ? theme === "dark" ? "bg-cyan-600 text-white" : "bg-cyan-500 text-white" : theme === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"}`,
						children: tab.label
					}, tab.id, false, {
						fileName: _jsxFileName$4,
						lineNumber: 334,
						columnNumber: 13
					}, void 0))
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 322,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AnimatePresence, {
					mode: "wait",
					children: [
						activeTab === "dashboard" && /* @__PURE__ */ (void 0)(DashboardTab, {
							organizations,
							theme,
							isLoading
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 355,
							columnNumber: 13
						}, void 0),
						activeTab === "monetization" && /* @__PURE__ */ (void 0)(MonetizationTab, {
							settings: monetizationSettings,
							onToggle: handleToggleMonetization,
							theme,
							isLoading
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 358,
							columnNumber: 13
						}, void 0),
						activeTab === "organizations" && /* @__PURE__ */ (void 0)(OrganizationsTab, {
							organizations,
							theme,
							isLoading
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 366,
							columnNumber: 13
						}, void 0),
						activeTab === "subscriptions" && /* @__PURE__ */ (void 0)(SubscriptionsTab, {
							organizations,
							theme,
							isLoading
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 369,
							columnNumber: 13
						}, void 0),
						activeTab === "audit-logs" && /* @__PURE__ */ (void 0)(AuditLogsTab, {
							logs: auditLogs,
							theme,
							isLoading
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 372,
							columnNumber: 13
						}, void 0),
						activeTab === "users" && /* @__PURE__ */ (void 0)(UsersTab, { theme }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 375,
							columnNumber: 13
						}, void 0),
						activeTab === "settings" && /* @__PURE__ */ (void 0)(SettingsTab, { theme }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 378,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 353,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 290,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 231,
		columnNumber: 5
	}, void 0);
};
/**
* Dashboard Tab
*/
var DashboardTab = ({ organizations, theme, isLoading }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "text-2xl font-bold",
			children: "System Overview"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 401,
			columnNumber: 7
		}, void 0), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "inline-block animate-spin",
				children: "⏳"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 405,
				columnNumber: 11
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 404,
			columnNumber: 9
		}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid md:grid-cols-4 gap-4",
			children: [
				{
					label: "Total Organizations",
					value: organizations.length,
					color: "cyan"
				},
				{
					label: "Active Subscriptions",
					value: organizations.filter((o) => o.subscription_status === "active").length,
					color: "green"
				},
				{
					label: "Premium Plans",
					value: organizations.filter((o) => o.current_plan === "PREMIUM").length,
					color: "purple"
				},
				{
					label: "Total Revenue (approx)",
					value: `$${organizations.reduce((sum, o) => sum + (o.total_spent || 0), 0).toFixed(0)}`,
					color: "yellow"
				}
			].map((stat, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `p-6 rounded-lg border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow"}`,
				initial: {
					scale: .9,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				transition: { delay: idx * .1 },
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
					children: stat.label
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 436,
					columnNumber: 15
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-3xl font-bold mt-2 text-cyan-400",
					children: stat.value
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 439,
					columnNumber: 15
				}, void 0)]
			}, idx, true, {
				fileName: _jsxFileName$4,
				lineNumber: 425,
				columnNumber: 13
			}, void 0))
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 408,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 395,
		columnNumber: 5
	}, void 0);
};
/**
* Monetization Tab
*/
var MonetizationTab = ({ settings, onToggle, theme, isLoading }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-2xl font-bold",
				children: "Monetization Control"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 464,
				columnNumber: 7
			}, void 0),
			settings && /* @__PURE__ */ (void 0)(motion.div, {
				className: `p-8 rounded-lg border-2 ${theme === "dark" ? "bg-gradient-to-br from-slate-800 to-slate-900 border-cyan-500/50" : "bg-gradient-to-br from-slate-50 to-white border-cyan-400"}`,
				initial: { scale: .95 },
				animate: { scale: 1 },
				children: [
					/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center justify-between mb-8",
						children: /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h3", {
							className: "text-2xl font-bold mb-2",
							children: "Current Mode"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 478,
							columnNumber: 15
						}, void 0), /* @__PURE__ */ (void 0)(motion.div, {
							className: `inline-block px-6 py-3 rounded-full font-bold text-lg ${settings.freeMode ? "bg-green-500/20 text-green-400 border border-green-400" : "bg-blue-500/20 text-blue-400 border border-blue-400"}`,
							animate: { scale: [
								1,
								1.05,
								1
							] },
							transition: {
								duration: 2,
								repeat: Infinity
							},
							children: settings.freeMode ? "🎉 FREE MODE" : "💳 PAID MODE"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 479,
							columnNumber: 15
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 477,
							columnNumber: 13
						}, void 0)
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 476,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (void 0)("p", {
						className: `mb-8 text-lg ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`,
						children: settings.freeMode ? "✓ All features available to all users. No payment required." : "✓ Billing enforced. Subscription restrictions active."
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 493,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (void 0)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (void 0)("button", {
							onClick: () => onToggle("free"),
							disabled: settings.freeMode || isLoading,
							className: `flex-1 py-3 px-6 rounded-lg font-semibold transition ${settings.freeMode ? "bg-green-600 text-white cursor-default" : theme === "dark" ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-200 text-slate-900 hover:bg-slate-300"} disabled:opacity-50`,
							children: settings.freeMode ? "✓ Free Mode Active" : "Enable Free Mode"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 500,
							columnNumber: 13
						}, void 0), /* @__PURE__ */ (void 0)("button", {
							onClick: () => onToggle("paid"),
							disabled: !settings.freeMode || isLoading,
							className: `flex-1 py-3 px-6 rounded-lg font-semibold transition ${!settings.freeMode ? "bg-blue-600 text-white cursor-default" : theme === "dark" ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-200 text-slate-900 hover:bg-slate-300"} disabled:opacity-50`,
							children: !settings.freeMode ? "✓ Paid Mode Active" : "Enable Paid Mode"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 513,
							columnNumber: 13
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 499,
						columnNumber: 11
					}, void 0),
					/* @__PURE__ */ (void 0)("p", {
						className: `mt-6 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
						children: "⚠️ This change affects ALL organizations immediately and is logged for audit purposes."
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 528,
						columnNumber: 11
					}, void 0)
				]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 467,
				columnNumber: 9
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `p-6 rounded-lg border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow"}`,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
					className: "text-lg font-bold mb-4",
					children: "Monetization Settings"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 540,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-3 rounded bg-slate-700/20",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Allow Downgrades" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 543,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								defaultChecked: true,
								className: "w-5 h-5"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 544,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 542,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-3 rounded bg-slate-700/20",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Allow Plan Changes" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 547,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								defaultChecked: true,
								className: "w-5 h-5"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 548,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 546,
							columnNumber: 11
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-3 rounded bg-slate-700/20",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Require Payment on Signup" }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 551,
								columnNumber: 13
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								className: "w-5 h-5"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 552,
								columnNumber: 13
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 550,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 541,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 535,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 458,
		columnNumber: 5
	}, void 0);
};
/**
* Organizations Tab
*/
var OrganizationsTab = ({ organizations, theme, isLoading }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "text-2xl font-bold",
			children: "Organizations"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 575,
			columnNumber: 7
		}, void 0), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center py-12",
			children: "Loading..."
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 578,
			columnNumber: 9
		}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `rounded-lg border overflow-hidden ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
				className: "w-full",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
					className: theme === "dark" ? "bg-slate-800" : "bg-slate-100",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-6 py-3 text-left font-semibold",
							children: "Organization"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 586,
							columnNumber: 17
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-6 py-3 text-left font-semibold",
							children: "Users"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 587,
							columnNumber: 17
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-6 py-3 text-left font-semibold",
							children: "Plan"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 588,
							columnNumber: 17
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-6 py-3 text-left font-semibold",
							children: "Status"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 589,
							columnNumber: 17
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "px-6 py-3 text-right font-semibold",
							children: "Actions"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 590,
							columnNumber: 17
						}, void 0)
					] }, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 585,
						columnNumber: 15
					}, void 0)
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 584,
					columnNumber: 13
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
					className: theme === "dark" ? "divide-y divide-slate-700" : "divide-y divide-slate-200",
					children: organizations.map((org, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-6 py-4 font-medium",
								children: org.organization_id
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 596,
								columnNumber: 19
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-6 py-4",
								children: org.users_count || 0
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 597,
								columnNumber: 19
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-6 py-4",
								children: org.current_plan || "FREE"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 598,
								columnNumber: 19
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-6 py-4",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `px-3 py-1 rounded-full text-sm font-semibold ${org.subscription_status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`,
									children: org.subscription_status || "N/A"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 600,
									columnNumber: 21
								}, void 0)
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 599,
								columnNumber: 19
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "px-6 py-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									className: "text-cyan-400 hover:text-cyan-300 font-medium",
									children: "View"
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 609,
									columnNumber: 21
								}, void 0)
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 608,
								columnNumber: 19
							}, void 0)
						]
					}, idx, true, {
						fileName: _jsxFileName$4,
						lineNumber: 595,
						columnNumber: 17
					}, void 0))
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 593,
					columnNumber: 13
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 583,
				columnNumber: 11
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 580,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 569,
		columnNumber: 5
	}, void 0);
};
/**
* Subscriptions Tab
*/
var SubscriptionsTab = ({ organizations, theme, isLoading }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "text-2xl font-bold",
			children: "Subscriptions & Billing"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 636,
			columnNumber: 7
		}, void 0), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center py-12",
			children: "Loading..."
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 639,
			columnNumber: 9
		}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4",
			children: organizations.map((org, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `p-6 rounded-lg border ${theme === "dark" ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 shadow hover:shadow-md"} transition`,
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: idx * .05 },
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
							className: "font-semibold text-lg",
							children: org.organization_id
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 656,
							columnNumber: 19
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
							children: ["Plan: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold text-cyan-400",
								children: org.current_plan
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 658,
								columnNumber: 27
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 657,
							columnNumber: 19
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 655,
							columnNumber: 17
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: `px-4 py-2 rounded-lg font-semibold ${org.subscription_status === "active" ? "bg-green-500/20 text-green-400" : org.subscription_status === "trialing" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`,
							children: org.subscription_status
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 661,
							columnNumber: 17
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 654,
						columnNumber: 15
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "grid md:grid-cols-3 gap-4 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
								children: "Billing Period"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 674,
								columnNumber: 19
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-semibold",
								children: org.billing_period
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 675,
								columnNumber: 19
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 673,
								columnNumber: 17
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
								children: "Total Spent"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 678,
								columnNumber: 19
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-semibold text-cyan-400",
								children: ["$", org.total_spent?.toFixed(2) || "0.00"]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 679,
								columnNumber: 19
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 677,
								columnNumber: 17
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
								children: "Renewal Date"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 682,
								columnNumber: 19
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-semibold",
								children: new Date(org.renewal_date).toLocaleDateString()
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 683,
								columnNumber: 19
							}, void 0)] }, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 681,
								columnNumber: 17
							}, void 0)
						]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 672,
						columnNumber: 15
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						className: "w-full py-2 px-4 rounded bg-slate-700 hover:bg-slate-600 transition font-medium text-sm",
						children: "View Details →"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 687,
						columnNumber: 15
					}, void 0)
				]
			}, idx, true, {
				fileName: _jsxFileName$4,
				lineNumber: 643,
				columnNumber: 13
			}, void 0))
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 641,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 630,
		columnNumber: 5
	}, void 0);
};
/**
* Audit Logs Tab
*/
var AuditLogsTab = ({ logs, theme, isLoading }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-2xl font-bold",
				children: "Audit Logs"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 713,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: `${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
				children: "All admin actions and important system events"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 714,
				columnNumber: 7
			}, void 0),
			isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-center py-12",
				children: "Loading..."
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 719,
				columnNumber: 9
			}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2",
				children: logs.map((log, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: `p-4 rounded-lg border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`,
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: idx * .02 },
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `px-2 py-1 rounded text-xs font-semibold ${log.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" : log.severity === "HIGH" ? "bg-yellow-500/20 text-yellow-400" : "bg-cyan-500/20 text-cyan-400"}`,
									children: log.severity
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 737,
									columnNumber: 21
								}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold",
									children: log.action
								}, void 0, false, {
									fileName: _jsxFileName$4,
									lineNumber: 746,
									columnNumber: 21
								}, void 0)]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 736,
								columnNumber: 19
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
								children: log.changes ? JSON.stringify(log.changes).substring(0, 100) + "..." : "No changes"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 748,
								columnNumber: 19
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 735,
							columnNumber: 17
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`,
								children: new Date(log.created_at).toLocaleDateString()
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 753,
								columnNumber: 19
							}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`,
								children: new Date(log.created_at).toLocaleTimeString()
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 756,
								columnNumber: 19
							}, void 0)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 752,
							columnNumber: 17
						}, void 0)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 734,
						columnNumber: 15
					}, void 0)
				}, idx, false, {
					fileName: _jsxFileName$4,
					lineNumber: 723,
					columnNumber: 13
				}, void 0))
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 721,
				columnNumber: 9
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 707,
		columnNumber: 5
	}, void 0);
};
/**
* Users Tab
*/
var UsersTab = ({ theme }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-2xl font-bold",
				children: "User Management"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 780,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: theme === "dark" ? "text-slate-400" : "text-slate-600",
				children: "Manage users, roles, and permissions across the platform"
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 781,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: `p-12 text-center rounded-lg border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: theme === "dark" ? "text-slate-400" : "text-slate-600",
					children: "User management interface coming soon"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 789,
					columnNumber: 9
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 784,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 774,
		columnNumber: 5
	}, void 0);
};
/**
* Settings Tab
*/
var SettingsTab = ({ theme }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
		className: "space-y-6",
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "text-2xl font-bold",
			children: "System Settings"
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 808,
			columnNumber: 7
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid md:grid-cols-2 gap-6",
			children: [
				{
					label: "API Configuration",
					icon: "🔌"
				},
				{
					label: "Email Settings",
					icon: "📧"
				},
				{
					label: "Storage & Backups",
					icon: "💾"
				},
				{
					label: "Security Policies",
					icon: "🔐"
				}
			].map((setting, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `p-6 rounded-lg border cursor-pointer transition hover:border-cyan-500 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow hover:shadow-md"}`,
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: idx * .1 },
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-4xl mb-3",
						children: setting.icon
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 827,
						columnNumber: 13
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
						className: "font-semibold text-lg",
						children: setting.label
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 828,
						columnNumber: 13
					}, void 0),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: `text-sm mt-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
						children: "Configure system settings"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 829,
						columnNumber: 13
					}, void 0)
				]
			}, idx, true, {
				fileName: _jsxFileName$4,
				lineNumber: 816,
				columnNumber: 11
			}, void 0))
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 809,
			columnNumber: 7
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 802,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/pages/DashboardPage.tsx
/**
* /frontend/src/pages/DashboardPage.tsx
*
* Main application dashboard.
* Fixed: uses isFreeModeActive as boolean property (not function call),
* canAccessFeature called correctly, no process.env references.
*/
var _jsxFileName$3 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/DashboardPage.tsx";
var FEATURES = [
	{
		id: "core_hr",
		name: "Core HR",
		description: "Employee management and profiles",
		icon: "👥",
		path: "/dashboard/employees"
	},
	{
		id: "basic_ats",
		name: "Applicant Tracking",
		description: "Recruitment and hiring tools",
		icon: "📋",
		path: "/dashboard/ats"
	},
	{
		id: "payroll_tools",
		name: "Payroll",
		description: "Salary processing and management",
		icon: "💰",
		path: "/dashboard/payroll"
	},
	{
		id: "advanced_analytics",
		name: "Advanced Analytics",
		description: "Insights and reporting",
		icon: "📊",
		path: "/dashboard/analytics"
	},
	{
		id: "ai_copilot",
		name: "AI Copilot",
		description: "AI-powered assistance",
		icon: "🤖",
		path: "/dashboard/ai"
	},
	{
		id: "compliance",
		name: "Compliance Tools",
		description: "Regulatory compliance management",
		icon: "✅",
		path: "/dashboard/compliance"
	}
];
var QUICK_STATS = [
	{
		label: "Total Employees",
		value: "0",
		icon: "👥"
	},
	{
		label: "Active Departments",
		value: "0",
		icon: "🏢"
	},
	{
		label: "Pending Tasks",
		value: "0",
		icon: "✅"
	},
	{
		label: "Upcoming Events",
		value: "0",
		icon: "📅"
	}
];
var DashboardPage = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { currentPlan, isTrialActive, daysUntilRenewal, canAccessFeature, isFreeModeActive } = useBilling();
	const { effectiveTheme } = useTheme();
	const isDark = effectiveTheme === "dark";
	const flags = getFeatureFlagService();
	(0, import_react.useEffect)(() => {
		flags.initialize();
	}, []);
	const displayName = user?.firstName ?? user?.lastName ?? user?.email ?? "there";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AppLayout, {
		showSidebar: true,
		showFooter: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				initial: {
					opacity: 0,
					y: -16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold mb-1",
					children: [
						"Welcome back,",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
							children: displayName
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 72,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 70,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: isDark ? "text-slate-400" : "text-slate-600",
					children: "Here's your HR management hub."
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 76,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 65,
				columnNumber: 7
			}, void 0),
			isFreeModeActive ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `mb-8 p-6 rounded-lg border ${isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-200"}`,
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-3xl",
						children: "🎉"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 93,
						columnNumber: 13
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-bold text-lg mb-1",
						children: "Free Mode Active"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 95,
						columnNumber: 15
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: isDark ? "text-slate-400" : "text-slate-600",
						children: "All features are available to you at no cost during our launch phase."
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 96,
						columnNumber: 15
					}, void 0)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 94,
						columnNumber: 13
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 92,
					columnNumber: 11
				}, void 0)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 83,
				columnNumber: 9
			}, void 0) : currentPlan ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `mb-8 p-6 rounded-lg border ${isDark ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30" : "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200"}`,
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-start justify-between flex-wrap gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-xl font-bold mb-1",
						children: [currentPlan.displayName, " Plan"]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 114,
						columnNumber: 15
					}, void 0), isTrialActive ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: `text-sm ${isDark ? "text-cyan-300" : "text-cyan-700"}`,
						children: [
							"Trial active — ",
							daysUntilRenewal,
							" days remaining"
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 118,
						columnNumber: 17
					}, void 0) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: `text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`,
						children: [
							"Renews in ",
							daysUntilRenewal,
							" days"
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 122,
						columnNumber: 17
					}, void 0)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 113,
						columnNumber: 13
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						onClick: () => navigate("/dashboard/subscription"),
						className: "px-5 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition text-sm",
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						children: "Manage Plan"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 127,
						columnNumber: 13
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 112,
					columnNumber: 11
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-3 gap-4 mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Max Users"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 139,
							columnNumber: 15
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold text-cyan-400",
							children: currentPlan.maxUsers ?? "∞"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 142,
							columnNumber: 15
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 138,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Storage"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 147,
							columnNumber: 15
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold text-cyan-400",
							children: [currentPlan.storageGB ?? 0, " GB"]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 150,
							columnNumber: 15
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 146,
							columnNumber: 13
						}, void 0),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
							children: "Support"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 155,
							columnNumber: 15
						}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xl font-bold text-cyan-400 capitalize",
							children: currentPlan.supportLevel
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 158,
							columnNumber: 15
						}, void 0)] }, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 154,
							columnNumber: 13
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 137,
					columnNumber: 11
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 103,
				columnNumber: 9
			}, void 0) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-xl font-bold mb-5",
					children: "Available Features"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 168,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
					children: FEATURES.map((feature, idx) => {
						const accessible = canAccessFeature(feature.id);
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
							className: `p-5 rounded-lg border transition-all relative ${accessible ? isDark ? "bg-slate-800 border-slate-700 hover:border-cyan-500/60 cursor-pointer" : "bg-white border-slate-200 shadow hover:shadow-md hover:border-cyan-300 cursor-pointer" : isDark ? "bg-slate-800/50 border-slate-700/50 opacity-70" : "bg-slate-100 border-slate-200 opacity-70"}`,
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: idx * .05 },
							whileHover: accessible ? { y: -3 } : {},
							onClick: accessible ? () => navigate(feature.path) : void 0,
							children: [
								!accessible && /* @__PURE__ */ (void 0)("span", {
									className: `absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-semibold ${isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-800"}`,
									children: "🔒 Premium"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 191,
									columnNumber: 19
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-4xl mb-3",
									children: feature.icon
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 201,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-bold mb-1",
									children: feature.name
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 202,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: `text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`,
									children: feature.description
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 203,
									columnNumber: 17
								}, void 0),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
									onClick: (e) => {
										e.stopPropagation();
										if (accessible) navigate(feature.path);
										else navigate("/pricing");
									},
									className: `w-full py-2 px-4 rounded-lg text-sm font-medium transition ${accessible ? isDark ? "bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/40" : "bg-cyan-100 text-cyan-900 hover:bg-cyan-200" : isDark ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-slate-300 text-slate-500 cursor-not-allowed"}`,
									whileHover: accessible ? { scale: 1.03 } : {},
									whileTap: accessible ? { scale: .97 } : {},
									children: accessible ? "Open" : "Upgrade to Access"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 210,
									columnNumber: 17
								}, void 0)
							]
						}, feature.id, true, {
							fileName: _jsxFileName$3,
							lineNumber: 173,
							columnNumber: 15
						}, void 0);
					})
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 169,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 167,
				columnNumber: 7
			}, void 0),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
				className: `p-6 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow"}`,
				initial: {
					opacity: 0,
					y: 16
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .25 },
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "text-xl font-bold mb-5",
					children: "Quick Stats"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 247,
					columnNumber: 9
				}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-5",
					children: QUICK_STATS.map((stat, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
						className: `p-4 rounded-lg ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`,
						initial: {
							scale: .9,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: { delay: .25 + idx * .05 },
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-3xl mb-2",
								children: stat.icon
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 259,
								columnNumber: 15
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: `text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`,
								children: stat.label
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 260,
								columnNumber: 15
							}, void 0),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-2xl font-bold text-cyan-400",
								children: stat.value
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 267,
								columnNumber: 15
							}, void 0)
						]
					}, idx, true, {
						fileName: _jsxFileName$3,
						lineNumber: 250,
						columnNumber: 13
					}, void 0))
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 248,
					columnNumber: 9
				}, void 0)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 237,
				columnNumber: 7
			}, void 0)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 63,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/pages/NotFoundPage.tsx
/**
* /frontend/src/pages/NotFoundPage.tsx
*
* 404 Not Found error page.
*/
var _jsxFileName$2 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/pages/NotFoundPage.tsx";
var NotFoundPage = () => {
	const navigate = useNavigate();
	const { effectiveTheme } = useTheme();
	const { isAuthenticated } = useAuth();
	const isDark = effectiveTheme === "dark";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `min-h-screen flex items-center justify-center px-4 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"}`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
			className: "text-center max-w-md",
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .5 },
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: "text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent",
					animate: { y: [
						0,
						-10,
						0
					] },
					transition: {
						duration: 3,
						repeat: Infinity
					},
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 33,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-3xl font-bold mb-3",
					children: "Page Not Found"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 41,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-lg mb-8 ${isDark ? "text-slate-400" : "text-slate-600"}`,
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 42,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, {
					className: `p-10 rounded-xl mb-8 ${isDark ? "bg-slate-800" : "bg-slate-100"}`,
					initial: {
						scale: .9,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					transition: { delay: .2 },
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.span, {
						className: "text-5xl inline-block",
						animate: { rotate: [
							0,
							-10,
							10,
							0
						] },
						transition: {
							duration: 2,
							repeat: Infinity
						},
						children: "🔍"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 52,
						columnNumber: 11
					}, void 0)
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 46,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row gap-4 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						onClick: () => navigate(isAuthenticated ? "/dashboard" : "/", { replace: true }),
						className: "px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 transition",
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						children: isAuthenticated ? "Go to Dashboard" : "Go Home"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 62,
						columnNumber: 11
					}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, {
						onClick: () => navigate(-1),
						className: `px-6 py-3 rounded-lg font-semibold border transition ${isDark ? "border-slate-700 text-white hover:bg-slate-800" : "border-slate-300 text-slate-900 hover:bg-slate-100"}`,
						whileHover: { scale: 1.05 },
						whileTap: { scale: .95 },
						children: "Go Back"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 70,
						columnNumber: 11
					}, void 0)]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 61,
					columnNumber: 9
				}, void 0),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: `text-sm mt-8 ${isDark ? "text-slate-500" : "text-slate-400"}`,
					children: [
						"Need help?",
						" ",
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "mailto:support@zynctra.com",
							className: "text-cyan-400 hover:text-cyan-300 font-medium",
							children: "Contact Support"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 86,
							columnNumber: 11
						}, void 0)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 84,
					columnNumber: 9
				}, void 0)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 27,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 20,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/App.tsx
/**
* /frontend/src/App.tsx
*
* Root application component — handles routing and route guards.
* AuthProvider is mounted in main.tsx; useAuth() is safe here.
*/
var _jsxFileName$1 = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/App.tsx";
var ProtectedRoute = ({ element, requiredRole }) => {
	const { isAuthenticated, user, isLoading } = useAuth();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoadingPage, {}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 47,
		columnNumber: 25
	}, void 0);
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, {
		to: "/login",
		replace: true
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 48,
		columnNumber: 32
	}, void 0);
	if (requiredRole && user?.role !== requiredRole) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigate, {
		to: "/dashboard",
		replace: true
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 50,
		columnNumber: 12
	}, void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: element }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 52,
		columnNumber: 10
	}, void 0);
};
var App = () => {
	const { isLoading } = useAuth();
	const flags = getFeatureFlagService();
	(0, import_react.useEffect)(() => {
		flags.initialize();
	}, []);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoadingPage, {}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 67,
		columnNumber: 25
	}, void 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrowserRouter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Routes, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LandingPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 73,
				columnNumber: 34
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 73,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/login",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoginPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 74,
				columnNumber: 39
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 74,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/register",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RegisterPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 75,
				columnNumber: 42
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 75,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/forgot-password",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ForgotPasswordPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 76,
				columnNumber: 49
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 76,
			columnNumber: 9
		}, void 0),
		!flags.isFreeModeActive() && /* @__PURE__ */ (void 0)(Route, {
			path: "/pricing",
			element: /* @__PURE__ */ (void 0)(PricingPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 80,
				columnNumber: 43
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 80,
			columnNumber: 11
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/dashboard",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProtectedRoute, { element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DashboardPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 86,
				columnNumber: 45
			}, void 0) }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 86,
				columnNumber: 20
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 84,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/dashboard/subscription",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProtectedRoute, { element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubscriptionDashboard, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 90,
				columnNumber: 45
			}, void 0) }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 90,
				columnNumber: 20
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 88,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/payment-verification",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProtectedRoute, { element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PaymentVerification, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 45
			}, void 0) }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 20
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 92,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "/admin/*",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ProtectedRoute, {
				element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminPanel, {}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 102,
					columnNumber: 24
				}, void 0),
				requiredRole: UserRole.SUPER_ADMIN
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 101,
				columnNumber: 13
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 98,
			columnNumber: 9
		}, void 0),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Route, {
			path: "*",
			element: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NotFoundPage, {}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 109,
				columnNumber: 34
			}, void 0)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 109,
			columnNumber: 9
		}, void 0)
	] }, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 71,
		columnNumber: 7
	}, void 0) }, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 70,
		columnNumber: 5
	}, void 0);
};
//#endregion
//#region src/main.tsx
/**
* /frontend/src/main.tsx
*
* Application entry point — initialises all providers and mounts React app.
*/
var _jsxFileName = "C:/Users/ADMIN/OneDrive/Desktop/Zynctra/frontend/src/main.tsx";
getFeatureFlagService().initialize().catch(() => {
	console.warn("[FeatureFlags] Failed to initialize — using defaults.");
});
var rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
import_client.createRoot(rootEl).render(/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(App, {}, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 28,
	columnNumber: 9
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 27,
	columnNumber: 7
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 26,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName,
	lineNumber: 25,
	columnNumber: 3
}, void 0));
//#endregion
