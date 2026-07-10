// Placeholder / merge-tag definitions for the picker.
// Edit this file to match the merge tag syntax your messaging platform
// (e.g. Customer.io) actually expects. `tag` is what gets copied to the
// clipboard when an editor clicks "Copy".

export type Placeholder = {
	label: string;
	tag: string;
	description?: string;
};

export type PlaceholderGroup = {
	category: string;
	items: Placeholder[];
};

export const placeholderGroups: PlaceholderGroup[] = [
	{
		category: 'Customer.io',
		items: [
			{ label: 'First name', tag: 'first_name' },
			{ label: 'Last name', tag: 'last_name' },
			{ label: 'Company', tag: 'company' },
		],
	},
];
