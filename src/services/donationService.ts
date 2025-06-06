import apiClient from '@/services/apiClient';

interface DonationRequest {
  paymentType: string;
  paymentCategory?: string; // Make it optional
  amount: number;
  donationOption: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  anonymous: boolean;
  transactionId?: string;
}

const donationService = {
  // Make a donation
  makeDonation: async (donationDetails: DonationRequest) => {
    try {
      const response = await apiClient.post('/payments/donations', {
        paymentType: donationDetails.paymentType,
         paymentCategory: donationDetails.paymentCategory || "DONATION", 
        amount: donationDetails.amount,
        donationOption: donationDetails.donationOption,
        anonymous: donationDetails.anonymous,
        transactionId: donationDetails.transactionId
      });
      return response.data;
    } catch (error) {
      console.error("Error making donation:", error);
      throw error;
    }
  }
};

export default donationService;