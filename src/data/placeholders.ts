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
		category: 'Personal',
		items: [
			{ label: 'First name', tag: '{{firstname}}' },
			{ label: 'Last name', tag: '{{lastname}}' },
			{ label: 'Full name', tag: '{{fullname}}' },
			{ label: 'Email address', tag: '{{email}}' },
			{ label: 'Phone number', tag: '{{phone}}' },
		],
	},
	{
		category: 'Company',
		items: [
			{ label: 'Company name', tag: '{{company_name}}' },
			{ label: 'Job title', tag: '{{job_title}}' },
		],
	},
	{
		category: 'Account',
		items: [
			{ label: 'Customer ID', tag: '{{customer_id}}' },
			{ label: 'Plan name', tag: '{{plan_name}}' },
			{ label: 'Signup date', tag: '{{signup_date}}' },
		],
	},
	{
		category: 'Links',
		items: [
			{ label: 'Unsubscribe link', tag: '{{unsubscribe_link}}' },
			{ label: 'Account link', tag: '{{account_link}}' },
		],
	},
];
