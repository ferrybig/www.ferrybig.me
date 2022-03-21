import JobTitle from "./JobTitle";
import Logo from "./Logo";
import Nav from "./Nav";
import ThemeSwitcher from "./ThemeSwitcher";
import classes from "./TopBar.module.css"

export default function() {
	return (
		<header className={classes.root}>
			<div>
				<Logo className={classes.logo}/>
				<JobTitle className={classes.jobTitle}/>
				<Nav className={classes.nav}/>
				<ThemeSwitcher className={classes.themeSwitcher}/>
			</div>
		</header>
	)
}
