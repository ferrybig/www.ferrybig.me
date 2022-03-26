import Fragment from './Fragment';
import classes from './License.module.css';

export default function License() {
	return (
		<Fragment>
			<p xmlns:cc="http://creativecommons.org/ns#" className={classes.ccBy} >
				This website and blog articles are licensed under
				{' '}
				<a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">
					CC BY 4.0
				</a>
			</p>
			<p xmlns:cc="http://creativecommons.org/ns#" className={classes.ccZero} >
				Any code snippets by are licensed under
				{' '}
				<a href="https://creativecommons.org/publicdomain/zero/1.0?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">
					CC0 1.0
				</a>
			</p>
		</Fragment>
	);
}
