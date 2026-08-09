export default function LegacyRatesPage() { return null; }

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/convertisseur#devises',
      permanent: true,
    },
  };
}
