export function replaceVars(text, vars) {
  return text.replace(/\{\{(.+?)\}\}/g, (match, varName) => {
    return vars[varName] || match;
  });
}
