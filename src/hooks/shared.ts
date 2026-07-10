export const TOOL_ID = process.env.NEXT_PUBLIC_TOOL_ID || '';

export const APP_ORIGIN = 'https://app.storyblok.com';

export const getRuntimeToolId = () => {
	if (typeof window === 'undefined') return TOOL_ID;
	return new URLSearchParams(window.location.search).get('slug') || TOOL_ID;
};
