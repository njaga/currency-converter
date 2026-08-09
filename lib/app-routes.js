export const APP_ROUTES = {
  converter: '/convertisseur',
  travel: '/voyage',
  tools: '/outils',
  rates: '/devises',
};

export const APP_TABS = Object.keys(APP_ROUTES);

export function routeForTab(tab, params = {}) {
  const path = APP_ROUTES[tab] || APP_ROUTES.converter;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  return search.size ? `${path}?${search.toString()}` : path;
}
