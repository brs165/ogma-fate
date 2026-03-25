
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/campaigns" | "/campaigns/[world]";
		RouteParams(): {
			"/campaigns/[world]": { world: string }
		};
		LayoutParams(): {
			"/": { world?: string };
			"/campaigns": { world?: string };
			"/campaigns/[world]": { world: string }
		};
		Pathname(): "/" | `/campaigns/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/assets/css/theme.css" | "/assets/favicons/apple-touch-icon.png" | "/assets/favicons/favicon.ico" | "/assets/favicons/icon-180.png" | "/assets/favicons/icon-192.png" | "/assets/favicons/icon-32.png" | "/assets/favicons/icon-512.png" | "/assets/favicons/icon.svg" | "/assets/img/og-default.png" | "/robots.txt" | string & {};
	}
}