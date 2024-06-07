declare class XpressPayPop {
  apiUrl: string;
  testUrl: string;

  constructor();
  newTransaction(e: {
    onSuccess: (transaction: {
      success: boolean;
      transactionId: string;
      amount: string;
      message: string;
      recurring_id: string;
    }) => void;
    onError: (transaction: {
      success: boolean;
      transactionId: string;
      amount: string;
      message: string;
      recurring_id: string;
    }) => void;
    onCancel: () => void;
    authorizeUrl?: string;
    request?: {
      mode?: "Dev" | "Live" | "Debug";
      amount: string;
      transactionId: string;
      email: string;
      publicKey: string;
      currency: string;
      productId?: string;
      applyConviniencyCharge?: boolean;
      productDescription?: string;
      bodyColor?: string;
      buttonColor?: string;
      footerText?: string;
      footerLink?: string;
      footerLogo?: string;
    };
  }): void;
}

export default XpressPayPop;
