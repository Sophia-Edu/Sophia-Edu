import { BrowserRouter, Routes, Route } from "react-router-dom";
import { APPCONSTANTS } from "./constants";
import {
	Aboutpage,
	ContactPage,
	Homepage,
	Privacypage,
	SetNewPasswordPage,
	Termspage,
} from "./pages";
import ComingSoon from "./pages/404";
import ScrollToTop from "./components/scrollTop";

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				<Route path={APPCONSTANTS.ROUTES[0].path} element={<Homepage />} />
				<Route path={APPCONSTANTS.ROUTES[3].path} element={<Aboutpage />} />
				<Route path={APPCONSTANTS.ROUTES[4].path} element={<Privacypage />} />
				<Route path={APPCONSTANTS.ROUTES[5].path} element={<Termspage />} />
				<Route
					path={APPCONSTANTS.ROUTES[7].path}
					element={<SetNewPasswordPage />}
				/>
				<Route path={APPCONSTANTS.ROUTES[8].path} element={<ContactPage />} />
				<Route path="*" element={<ComingSoon />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
