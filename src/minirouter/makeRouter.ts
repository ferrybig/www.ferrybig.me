import { ComponentType, useMemo } from 'react';
import sortByKey from './sortByKey';
import { RouteDefinition } from './route';
import provideDefaults from './provideDefaults';
import { contextLocation, HookedLocationService } from './LocationService';

function sortRoutes<R extends RouteDefinition<any, any>>(routes: R[]): R[] {
	const copy = [...routes];
	copy.sort(sortByKey('priority', false));
	return copy;
}

interface RouterOptions {
	readonly locationService?: HookedLocationService;
	readonly autoSort?: boolean;
	readonly debug?: boolean;
}

export const DEFAULT_ROUTER_OPTIONS: Readonly<Required<RouterOptions>> = {
	locationService: contextLocation,
	autoSort: true,
	debug: process.env.NODE_ENV === 'development',
};

const NULL_RENDER_FUNC = () => null;

export default function makeRouter<R>(routes: RouteDefinition<R, any>[], options: RouterOptions = {}): ComponentType<R> {
	const finalOptions = provideDefaults(options, DEFAULT_ROUTER_OPTIONS);
	const newRoutes = finalOptions.autoSort ? sortRoutes(routes) : routes;
	return function Router(props: R): JSX.Element | null {
		if (finalOptions.debug && process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useMemo(() => newRoutes, []); // Show debug values in componentEditor
		}
		const currentLocation = finalOptions.locationService.useLocationService();
		const matchedRenderFunction = useMemo((): (props: R) => JSX.Element | null => {
			for (const route of newRoutes) {
				const matchResult = route.tryRender(currentLocation);
				if (matchResult !== null) {
					return matchResult;
				}
			}
			return NULL_RENDER_FUNC;
		}, [currentLocation]);
		return matchedRenderFunction(props);
	};
}
