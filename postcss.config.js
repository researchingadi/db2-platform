module.exports = {
  plugins: {
    // Next.js 9's bundled resolver doesn't support the `exports` field, so
    // we point directly to the CJS dist file to bypass the resolution issue.
    [require.resolve("@tailwindcss/postcss")]: {},
  },
};
