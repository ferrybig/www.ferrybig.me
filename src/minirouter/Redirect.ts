import { useEffect } from 'react';
import { contextLocation } from './LocationService';
import { RouteDefinition } from './route';

export default function Redirect<R>({ route, props }: {
	route: RouteDefinition<any, R>;
	props: R;
}): JSX.Element | null {
	const [update] = contextLocation.useUpdate();
	useEffect(() => {
		update(route.toPath(props), { replace: true });
	}, [route, props, update]);
	return null;
}
