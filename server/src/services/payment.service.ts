import crypto from "crypto";

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "requires_payment" | "succeeded" | "failed";
  clientSecret: string;
}

interface PaymentConfirmation {
  transactionId: string;
  status: "completed" | "failed";
  cardLast4: string;
}

const generateTransactionId = (): string => {
  return `txn_${crypto.randomUUID().replace(/-/g, "").substring(0, 16)}`;
};

const generatePaymentIntentId = (): string => {
  return `pi_${crypto.randomUUID().replace(/-/g, "").substring(0, 24)}`;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string = "NPR"
): Promise<PaymentIntent> => {
  return {
    id: generatePaymentIntentId(),
    amount,
    currency,
    status: "requires_payment",
    clientSecret: `${generatePaymentIntentId()}_secret_${crypto.randomUUID().substring(0, 8)}`,
  };
};

export const confirmPayment = async (
  paymentIntentId: string,
  cardNumber: string
): Promise<PaymentConfirmation> => {
  const last4 = cardNumber.replace(/\s/g, "").slice(-4);

  const isValidCard = cardNumber.replace(/\s/g, "").length === 16;
  if (!isValidCard) {
    return {
      transactionId: "",
      status: "failed",
      cardLast4: "",
    };
  }

  return {
    transactionId: generateTransactionId(),
    status: "completed",
    cardLast4: last4,
  };
};

export const refundPayment = async (
  transactionId: string,
  reason: string = "Customer requested refund"
): Promise<{ success: boolean; refundId: string }> => {
  return {
    success: true,
    refundId: `rf_${crypto.randomUUID().replace(/-/g, "").substring(0, 16)}`,
  };
};
