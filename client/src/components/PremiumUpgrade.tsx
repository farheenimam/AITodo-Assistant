import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Declare Crossmint global type
declare global {
  interface Window {
    CrossmintCheckout: {
      render: (config: any, selector: string) => void;
    };
  }
}

interface PremiumUpgradeProps {
  onPaymentSuccess: (paymentData: any) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function PremiumUpgrade({ 
  onPaymentSuccess, 
  onClose, 
  isLoading = false 
}: PremiumUpgradeProps) {
  const [crossmintLoaded, setCrossmintLoaded] = useState(false);
  const [crossmintInitialized, setCrossmintInitialized] = useState(false);

  useEffect(() => {
    // Load Crossmint script if not already loaded
    if (!window.CrossmintCheckout) {
      const script = document.createElement('script');
      script.src = 'https://www.crossmint.io/checkout.js';
      script.onload = () => {
        setCrossmintLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setCrossmintLoaded(true);
    }

    // Don't remove script on unmount to avoid reload latency
  }, []);

  useEffect(() => {
    // Initialize Crossmint when both script is loaded and DOM is ready
    if (crossmintLoaded && !crossmintInitialized) {
      const checkoutContainer = document.getElementById('crossmint-checkout');
      if (checkoutContainer && window.CrossmintCheckout) {
        const environment = import.meta.env.PROD ? 'production' : 'staging';
        const clientId = import.meta.env.VITE_CROSSMINT_CLIENT_API_KEY;
        
        if (!clientId) {
          console.error('Crossmint client ID not found in environment variables');
          return;
        }

        window.CrossmintCheckout.render({
          clientId,
          environment,
          paymentMethods: ["credit_card", "crypto"],
          // TODO: Move amount/currency to server-side session creation
          amount: 9.99,
          currency: "USD",
          metadata: {
            subscription: "premium",
            plan: "monthly"
          },
          onSuccess: (paymentData: any) => {
            console.log("Crossmint payment successful:", paymentData);
            // TODO: Verify payment server-side before activating premium
            onPaymentSuccess(paymentData);
          },
          onError: (error: any) => {
            console.error("Crossmint payment error:", error);
          }
        }, "#crossmint-checkout");
        
        setCrossmintInitialized(true);
      }
    }
  }, [crossmintLoaded, crossmintInitialized, onPaymentSuccess]);

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

          {/* Crossmint Payment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Secure Payment</h3>
            
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <SiSolana className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium">Credit Card & Crypto</h4>
                  <p className="text-sm text-muted-foreground">Secure payment via Crossmint</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3 h-3" />
                <span>Instant activation</span>
                <Check className="w-3 h-3" />
                <span>Multiple payment options</span>
                <Check className="w-3 h-3" />
                <span>Secure & encrypted</span>
              </div>
            </div>

            {/* Crossmint Checkout Widget */}
            <div className="min-h-[200px] border rounded-lg p-4 bg-card">
              <div id="crossmint-checkout" data-testid="crossmint-checkout">
                {!crossmintLoaded && (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-muted-foreground">Loading payment options...</span>
                  </div>
                )}
              </div>
            </div>
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