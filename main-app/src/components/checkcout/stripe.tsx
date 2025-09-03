import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "antd";

// Replace with your publishable key from the Stripe Dashboard

const CheckoutForm: React.FC<any> = ({ amount }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		if (!stripe || !elements) {
			return;
		}

		const cardElement = elements.getElement(CardElement);

		if (!cardElement) {
			return;
		}

		// Create a payment method
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: cardElement,
		});

		if (error) {
			setError(error.message || "Something went wrong");
			setLoading(false);
			return;
		}

		// Optionally call your backend to create a payment intent
		const response = await fetch("/api/create-payment-intent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				paymentMethodId: paymentMethod.id,
				amount: amount * 100, // amount in cents
			}),
		});

		const paymentIntent = await response.json();

		if (paymentIntent.error) {
			setError(paymentIntent.error);
			setLoading(false);
			return;
		}

		// Confirm the payment
		const { error: confirmError } = await stripe.confirmCardPayment(
			paymentIntent.client_secret
		);

		if (confirmError) {
			setError(confirmError.message || "Payment failed");
			setLoading(false);
			return;
		}

		setSuccess("Payment successful!");
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<Button
				htmlType="submit"
				block
				disabled={!stripe || loading}
				loading={loading}
				className="mt-4 p-2 bg-[#581A57] text-white rounded"
			>
				{loading ? "Processing..." : "Pay $" + amount}
			</Button>
			{error && <div className="mt-4 text-red-500">{error}</div>}
			{success && <div className="mt-4 text-green-500">{success}</div>}
		</form>
	);
};

export default CheckoutForm;
