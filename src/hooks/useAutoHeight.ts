import { useEffect } from 'react';
import { APP_ORIGIN, TOOL_ID } from '@/hooks/shared';

export function useAutoHeight() {
	useEffect(() => {
		const postHeight = () => {
			window.parent.postMessage(
				{
					action: 'tool-changed',
					tool: TOOL_ID,
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
			observer.disconnect();
			resizeObserver.disconnect();
			window.removeEventListener('resize', postHeight);
		};
	}, []);
}
