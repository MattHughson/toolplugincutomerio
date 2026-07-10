import { useMemo, useState } from 'react';
import { placeholderGroups } from '@/data/placeholders';
import type { Placeholder } from '@/data/placeholders';

const CopyIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M20 6 9 17l-5-5" />
	</svg>
);

const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (_err) {
		// fall through to the legacy fallback below
	}

	// Fallback for embedded iframes where the async Clipboard API
	// may be blocked by permissions policy.
	try {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		const success = document.execCommand('copy');
		document.body.removeChild(textarea);
		return success;
	} catch (_err) {
		return false;
	}
};

export default function PlaceholderPicker() {
	const [query, setQuery] = useState('');
	const [copiedTag, setCopiedTag] = useState<string | null>(null);
	const [failedTag, setFailedTag] = useState<string | null>(null);
	const [toast, setToast] = useState<string | null>(null);

	const filteredGroups = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return placeholderGroups;

		return placeholderGroups
			.map((group) => ({
				...group,
				items: group.items.filter(
					(item) =>
						item.label.toLowerCase().includes(normalized) ||
						item.tag.toLowerCase().includes(normalized),
				),
			}))
			.filter((group) => group.items.length > 0);
	}, [query]);

	const handleCopy = async (item: Placeholder) => {
		const copyValue = `{{${item.tag}}}`;
		const success = await copyToClipboard(copyValue);
		if (success) {
			setFailedTag(null);
			setCopiedTag(item.tag);
			setToast(`Copied ${copyValue}`);
			setTimeout(() => {
				setCopiedTag((current) => (current === item.tag ? null : current));
			}, 1500);
		} else {
			setCopiedTag(null);
			setFailedTag(item.tag);
			setToast(`Could not copy ${copyValue}`);
			setTimeout(() => {
				setFailedTag((current) => (current === item.tag ? null : current));
			}, 1500);
		}

		setTimeout(() => {
			setToast((current) => (current ? null : current));
		}, 1600);
	};

	return (
		<div className="placeholder-picker">
			<div className="placeholder-picker__search">
				<input
					type="text"
					placeholder="Search placeholders…"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					aria-label="Search placeholders"
				/>
			</div>

			{filteredGroups.length === 0 && (
				<p className="placeholder-picker__empty">No placeholders match &quot;{query}&quot;.</p>
			)}

			{toast && (
				<p className="placeholder-picker__toast" role="status" aria-live="polite">
					{toast}
				</p>
			)}

			{filteredGroups.map((group) => (
				<section key={group.category} className="placeholder-picker__group">
					<h2 className="placeholder-picker__category">{group.category}</h2>
					<ul className="placeholder-picker__list">
						{group.items.map((item) => (
							<li key={item.tag} className="placeholder-picker__item">
								<div className="placeholder-picker__item-info">
									<span className="placeholder-picker__label">{item.label}</span>
									<span className="placeholder-picker__tag">{item.tag}</span>
								</div>
								<button
									type="button"
									className="placeholder-picker__copy"
									onClick={() => handleCopy(item)}
									aria-label={`Copy ${item.tag} to clipboard`}
									title={`Copy ${item.tag}`}
								>
									{copiedTag === item.tag ? (
										<CheckIcon />
									) : (
										<CopyIcon />
									)}
								</button>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
