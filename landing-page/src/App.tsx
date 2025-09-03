import "./App.scss";
import Router from "./routes";
import { ConfigProvider } from "antd";
// import "antd/dist/antd.css";

function App() {
	return (
		<ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
			<Router />
		</ConfigProvider>
	);
}

export default App;
