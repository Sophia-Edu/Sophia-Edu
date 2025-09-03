module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh"],
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"no-mixed-spaces-and-tabs": "no-error",
		"indent": ["error", 2], // Enforce 2 spaces
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },

		],
		// Add or modify rules as needed
		"no-console": "off", // Disable warnings for console.log statements
		"no-unused-vars": "warn", // Keep warnings but not errors
	},
};
