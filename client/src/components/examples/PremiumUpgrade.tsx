import PremiumUpgrade from '../PremiumUpgrade';

export default function PremiumUpgradeExample() {
  return (
    <PremiumUpgrade
      onPaymentSuccess={(paymentData) => console.log('Payment successful:', paymentData)}
      onClose={() => console.log('Close modal')}
      isLoading={false}
    />
  );
}