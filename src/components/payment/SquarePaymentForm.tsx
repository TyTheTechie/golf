"use client";

import {
  PaymentForm,
  CreditCard,
  ApplePay,
  GooglePay,
  CashAppPay,
} from "react-square-web-payments-sdk";

interface SquarePaymentFormProps {
  amount: number; // in cents
  onPaymentToken: (token: string) => void;
  loading?: boolean;
}

export default function SquarePaymentForm({
  amount,
  onPaymentToken,
  loading,
}: SquarePaymentFormProps) {
  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID!;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
        <span className="font-medium text-foreground">Amount Due</span>
        <span className="text-xl font-bold text-accent">
          ${(amount / 100).toFixed(2)}
        </span>
      </div>

      <PaymentForm
        applicationId={appId}
        locationId={locationId}
        cardTokenizeResponseReceived={(tokenResult) => {
          if (tokenResult.status === "OK" && tokenResult.token) {
            onPaymentToken(tokenResult.token);
          }
        }}
        createPaymentRequest={() => ({
          countryCode: "US",
          currencyCode: "USD",
          total: {
            amount: (amount / 100).toFixed(2),
            label: "Total",
          },
        })}
      >
        <div className="space-y-3">
          <GooglePay />
          <ApplePay />
          <CashAppPay redirectURL={window.location.href} referenceId={`pay-${Date.now()}`} />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted">or pay with card</span>
            </div>
          </div>

          <CreditCard
            buttonProps={{
              isLoading: loading,
              css: {
                backgroundColor: "var(--accent)",
                color: "#ffffff",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "var(--accent-dark)",
                },
              },
            }}
          />
        </div>
      </PaymentForm>
    </div>
  );
}
