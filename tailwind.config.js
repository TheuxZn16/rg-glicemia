/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				secundaryBackground: {
					light: '#E0F7FA',
					dark: '#424242',
				},
				tertiaryBackground: {
					light: '#9cd6db',
					dark: '#9c9c9c',
				},
				textColor: {
					dark: '#918d8d',
					light: '#4a4a4a',
				},
				success: '#22C55E',
				error: '#EF4444',
				warning: '#FACC15',
			},
		},
	},
	plugins: [],
};
