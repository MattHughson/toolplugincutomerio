import { useEffect } from 'react';
import { APP_ORIGIN, getRuntimeToolId } from '@/hooks/shared';

export function useAutoHeight() {
	useEffect(() => {
		const toolId = getRuntimeToolId();

		const postHeight = () => {
			window.parent.postMessage(
				{
					action: 'tool-changed',
					tool: toolId,
					event: 'heightChange',
					height: Math.max(
						document.body.scrollHeight,
						document.documentElement.scrollHeight,
					),
				},
				APP_ORIGIN,
			);
		};

		const observer = new MutationObserver(() => {
			postHeight();
		});

		const resizeObserver = new ResizeObserver(() => {
			postHeight();
		});

		postHeight();
		const initialPings = window.setInterval(postHeight, 250);
		const stopInitialPings = window.setTimeout(() => {
			window.clearInterval(initialPings);
		}, 4000);
		window.addEventListener('resize', postHeight);

		if (document.fonts?.ready) {
			document.fonts.ready.then(postHeight).catch(() => {});
		}

		observer.observe(document.body, {
			attributes: true,
			childList: true,
			subtree: true,
		});

		resizeObserver.observe(document.body);

		return () => {
			window.clearInterval(initialPings);
			window.clearTimeout(stopInitialPings);
			observer.disconnect();
			resizeObserver.disconnect();
			window.removeEventListener('resize', postHeight);
		};
	}, []);
}
