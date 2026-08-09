import { APP_ROUTES } from '../lib/app-routes';

export default function LegacyAppPage() { return null; }

export function getServerSideProps({ query }) {
  if (query.tab === 'rates') {
    return { redirect: { destination: '/convertisseur#devises', permanent: true } };
  }
  const tab = APP_ROUTES[query.tab] ? query.tab : 'converter';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (key === 'tab' || value === undefined) return;
    params.set(key, Array.isArray(value) ? value[0] : value);
  });
  const search = params.toString();
  return {
    redirect: {
      destination: `${APP_ROUTES[tab]}${search ? `?${search}` : ''}`,
      permanent: true,
    },
  };
}
