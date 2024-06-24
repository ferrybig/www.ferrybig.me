import Column from "./_components/Column";
import { Heading1 } from "./_components/Heading";
import classes from './error.module.css'

export default function Custom404() {
	return <div className={classes.root}>
		<Column padded>
			<Heading1 id="error">Page Not Found</Heading1>
		</Column>
	</div>;
}
