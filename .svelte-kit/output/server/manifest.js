export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/css/theme.css","assets/favicons/apple-touch-icon.png","assets/favicons/favicon.ico","assets/favicons/icon-180.png","assets/favicons/icon-192.png","assets/favicons/icon-32.png","assets/favicons/icon-512.png","assets/favicons/icon.svg","assets/img/og-default.png","robots.txt"]),
	mimeTypes: {".css":"text/css",".png":"image/png",".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.C0YFKOP9.js",app:"_app/immutable/entry/app.CTRlTTT-.js",imports:["_app/immutable/entry/start.C0YFKOP9.js","_app/immutable/chunks/DKbvQCUm.js","_app/immutable/chunks/Bd0vxY4w.js","_app/immutable/chunks/g6nVDW7K.js","_app/immutable/chunks/BICh6hGj.js","_app/immutable/entry/app.CTRlTTT-.js","_app/immutable/chunks/Bd0vxY4w.js","_app/immutable/chunks/BhqSfU-Z.js","_app/immutable/chunks/Dx8Yv8aA.js","_app/immutable/chunks/BICh6hGj.js","_app/immutable/chunks/CR2GvhqW.js","_app/immutable/chunks/Cmyu1BRH.js","_app/immutable/chunks/g6nVDW7K.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/campaigns/[world]",
				pattern: /^\/campaigns\/([^/]+?)\/?$/,
				params: [{"name":"world","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
