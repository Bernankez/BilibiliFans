import bernankez from "@bernankez/eslint-config";

export default bernankez({
  formatters: true,
  unocss: true,
  linterOptions: {
    reportUnusedDisableDirectives: "off",
  },
});
