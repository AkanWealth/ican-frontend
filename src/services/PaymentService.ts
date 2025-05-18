// paymentService.ts
import apiClient from '@/services/apiClient';

interface PaymentRequest {
  amount: number;
  paymentType: string;
  transactionId: string;
  status: string;
  paymentCategory?: string;
}

const paymentService = {
  // Process a payment for a specific billing
  processPayment: async (userId: string, billingId: string, paymentDetails: PaymentRequest) => {
    try {
      const response = await apiClient.post(
        `/payments/user/${userId}/billing/${billingId}/pay`,
        {
          amount: paymentDetails.amount,
          paymentType: paymentDetails.paymentType,
          transactionId: paymentDetails.transactionId.toString(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  // Process payments for all outstanding dues
  processSettleAllPayment: async (paymentInfo: {
    userId: string;
    amount: number;
    paymentType: string;
    transactionId: string;
    billingIds?: string[];
  }) => {
    try {
      // If billing IDs are provided, process each one
      if (paymentInfo.billingIds && paymentInfo.billingIds.length > 0) {
        const promises = paymentInfo.billingIds.map((billingId) =>
          apiClient.post(
            `/payments/user/${paymentInfo.userId}/billing/${billingId}/pay`,
            {
              amount: paymentInfo.amount,
              paymentType: paymentInfo.paymentType,
              transactionId: paymentInfo.transactionId.toString(),
            }
          )
        );
        return await Promise.all(promises);
      } else {
        // Use the /pay-all endpoint for settling all dues
        const response = await apiClient.post(
          `/payments/user/${paymentInfo.userId}/pay-all`,
          {
            paymentType: paymentInfo.paymentType,
            transactionId: paymentInfo.transactionId.toString(),
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error processing settle all payment:", error);
      throw error;
    }
  }
};

export default paymentService;