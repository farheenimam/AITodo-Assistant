import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Crown, 
  Check, 
  CreditCard, 
  Zap,
  TrendingUp,
  Clock,
  Brain
} from "lucide-react";
import { SiSolana } from "react-icons/si";

interface PremiumUpgradeProps {
  onStripePayment: () => void;
  onSolanaPayment: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function PremiumUpgrade({ 
  onStripePayment, 
  onSolanaPayment, 
  onClose, 
  isLoading = false 
}: PremiumUpgradeProps) {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "solana">("stripe");

  const handleStripePayment = () => {
    console.log("Stripe payment initiated");
    onStripePayment();
  };

  const handleSolanaPayment = () => {
    console.log("Solana payment initiated");
    onSolanaPayment();
  };

  const handleClose = () => {
    console.log("Premium upgrade modal closed");
    onClose?.();
  };

  const features = [
    {
      icon: <Brain className="w-5 h-5 text-premium" />,
      title: "Unlimited AI Suggestions",
      description: "Get personalized task prioritization and scheduling recommendations"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-premium" />,
      title: "Advanced Analytics",
      description: "Detailed productivity insights and completion trends"
    },
    {
      icon: <Clock className="w-5 h-5 text-premium" />,
      title: "Smart Time Blocking",
      description: "AI-powered daily schedule optimization with time estimates"
    },
    {
      icon: <Zap className="w-5 h-5 text-premium" />,
      title: "Priority Notifications",
      description: "Smart reminders based on deadlines and importance"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-premium/10 p-3 rounded-full">
              <Crown className="w-8 h-8 text-premium" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-premium" />
              Upgrade to Premium
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Unlock AI-powered productivity features and take your task management to the next level
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-premium/5 border border-premium/20">
                <div className="flex-shrink-0 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Badge variant="outline" className="bg-premium/10 text-premium border-premium/20">
              30-day money back guarantee
            </Badge>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Choose Payment Method</h3>
            
            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "stripe" | "solana")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stripe" className="flex items-center gap-2" data-testid="tab-stripe">
                  <CreditCard className="w-4 h-4" />
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="solana" className="flex items-center gap-2" data-testid="tab-solana">
                  <SiSolana className="w-4 h-4" />
                  Solana
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stripe" className="space-y-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Credit/Debit Card</h4>
                      <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3" />
                    <span>Instant activation</span>
                    <Check className="w-3 h-3" />
                    <span>Auto-renewal</span>
                    <Check className="w-3 h-3" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
                <Button 
                  onClick={handleStripePayment} 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                  data-testid="button-stripe-payment"
                >
                  {isLoading ? "Processing..." : "Subscribe with Card"}
                </Button>
              </TabsContent>

              <TabsContent value="solana" className="space-y-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <SiSolana className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Solana Payment</h4>
                      <p className="text-sm text-muted-foreground">Pay with SOL via Crossmint</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3" />
                    <span>Lower fees</span>
                    <Check className="w-3 h-3" />
                    <span>Blockchain verified</span>
                    <Check className="w-3 h-3" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
                <Button 
                  onClick={handleSolanaPayment} 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  size="lg"
                  disabled={isLoading}
                  data-testid="button-solana-payment"
                >
                  {isLoading ? "Processing..." : "Pay with Solana"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {onClose && (
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1"
                disabled={isLoading}
                data-testid="button-close-upgrade"
              >
                Maybe Later
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Cancel anytime from your account settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}