import PremiumUpgrade from '../PremiumUpgrade';

export default function PremiumUpgradeExample() {
  return (
    <PremiumUpgrade
      onStripePayment={() => console.log('Stripe payment')}
      onSolanaPayment={() => console.log('Solana payment')}
      onClose={() => console.log('Close modal')}
      isLoading={false}
    />
  );
}