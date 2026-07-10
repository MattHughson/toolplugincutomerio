import Head from 'next/head';
import { useAppBridge, useAutoHeight, useToolContext } from '@/hooks';
import PlaceholderPicker from '@/components/PlaceholderPicker';

export default function Home() {
	const toolContext = useToolContext();
	const { completed, appBridgeAuth, appBridgeError } = useAppBridge({
		type: 'tool-plugin',
		oauth: false,
	});
	useAutoHeight();

	const brandLogoUrl =
		process.env.NEXT_PUBLIC_CUSTOMERIO_LOGO_URL ||
		'https://customer.io/favicon.ico';

	const bridgeErrorMessage =
		typeof appBridgeError === 'string'
			? appBridgeError
			: appBridgeError instanceof Error
				? appBridgeError.message
				: appBridgeError && typeof appBridgeError === 'object' && 'message' in appBridgeError
					? String((appBridgeError as { message?: unknown }).message ?? '')
					: '';

	return (
		<>
			<Head>
				<title>Placeholder Picker</title>
				<meta
					name="description"
					content="Copy merge-tag placeholders into Storyblok content"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main className="app">
				{!completed && appBridgeAuth !== 'error' && (
					<p className="app__status">Connecting to Storyblok…</p>
				)}
				{appBridgeAuth === 'error' && (
					<div className="app__status app__status--error">
						<p>
							Couldn&apos;t verify this tool inside Storyblok. Open it from within
							a story&apos;s tool tab.
						</p>
						{process.env.NODE_ENV !== 'production' && bridgeErrorMessage && (
							<p>Reason: {bridgeErrorMessage}</p>
						)}
					</div>
				)}
				{completed && (
					<div className="app__content">
						<header className="app__header">
							<div className="app__brand" aria-label="Customer.io">
								<img src={brandLogoUrl} alt="Customer.io" width={28} height={28} />
								<h1 className="sr-only">Customer.io Placeholder Picker</h1>
							</div>
							<p>
								Click a placeholder to copy it, then paste it into a field
								{toolContext?.story?.name ? ` on “${toolContext.story.name}”` : ''}.
							</p>
						</header>
						<PlaceholderPicker />
					</div>
				)}
			</main>
		</>
	);
}
