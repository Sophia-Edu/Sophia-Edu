import { useEffect } from "react";
import "./App.scss";
import Router from "./routes/routes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAlert } from "./store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
	const { status, message, onReset } = useAlert();
	const stripePromise = loadStripe("your-publishable-key-here");
	// Listen to changes in status and display toast accordingly
	useEffect(() => {
		if (status && message) {
			if (status === "success") {
				toast.success(message);
			} else if (status === "error") {
				toast.error(message);
			} else {
				toast.info(message);
			}
			// Reset alert state after displaying toast
			onReset();
		}
	}, [status, message, onReset]);
	return (
		<Elements stripe={stripePromise}>
			<ToastContainer />
			<Router />
		</Elements>
	);
}

export default App;
