import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";


const Home: React.FC = () => {
	const context = useDocusaurusContext();
	
	return (
		<Layout>
			<header className={clsx("hero hero--primary", styles.heroBanner)}>
				<div className="container">
					<h1 className="hero__title">{context.siteConfig.title}</h1>
					<p className="hero__subtitle">
						<code>npm i youtubei</code>
					</p>
					<div className={styles.buttons}>
						<Link
							className={clsx(
								"button button--outline button--secondary button--lg",
								styles.getStarted
							)}
							to={useBaseUrl("docs/")}
						>
							Get Started
						</Link>
					</div>
				</div>
			</header>
		</Layout>
	);
};

export default Home;