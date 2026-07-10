import { useMemo, useState } from 'react';
import { placeholderGroups } from '@/data/placeholders';
import type { Placeholder } from '@/data/placeholders';

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
		const success = await copyToClipboard(item.tag);
		if (success) {
			setFailedTag(null);
			setCopiedTag(item.tag);
			setTimeout(() => {
				setCopiedTag((current) => (current === item.tag ? null : current));
			}, 1500);
		} else {
			setCopiedTag(null);
			setFailedTag(item.tag);
			setTimeout(() => {
				setFailedTag((current) => (current === item.tag ? null : current));
			}, 1500);
		}
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

			{filteredGroups.map((group) => (
				<section key={group.category} className="placeholder-picker__group">
					<h2 className="placeholder-picker__category">{group.category}</h2>
					<ul className="placeholder-picker__list">
						{group.items.map((item) => (
							<li key={item.tag} className="placeholder-picker__item">
								<div className="placeholder-picker__item-info">
									<span className="placeholder-picker__label">{item.label}</span>
									<code className="placeholder-picker__tag">{item.tag}</code>
								</div>
								<button
									type="button"
									className="placeholder-picker__copy"
									onClick={() => handleCopy(item)}
									aria-label={`Copy ${item.tag} to clipboard`}
								>
									{copiedTag === item.tag
										? 'Copied!'
										: failedTag === item.tag
											? 'Copy failed'
											: 'Copy'}
								</button>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
