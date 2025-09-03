import { Col, Row } from "antd";
import React from "react";
import { badge, computer_lady, woman } from "../../assets";
import { Accordion, Button, Footer, Navbar } from "../../components";
import "./Homepage.styles.scss";
import {
	applied_science_data,
	formal_science_data,
	humanities_data,
	natural_science_data,
	social_science_data,
} from "../../constants";

const HomePage: React.FC = () => {
	return (
		<div className="homepage">
			<div className="hero">
				<Navbar />
				<Row
					className="hero-text"
					align="top"
					justify="space-between"
					style={{ marginTop: 60 }}
				>
					<Col xs={{ span: 24 }} lg={{ span: 12 }}>
						<h2
							className="playfair-display-bold"
							style={{ fontSize: 48, marginBottom: 18 }}
						>
							The Learning and Career Development Platform
						</h2>
						<p
							className="inter-normal text-[18px]"
							style={{ marginBottom: 18, lineHeight: 2 }}
						>
							Learn the most important skills to succeed in your chosen course
							of study and connect with researchers with similar interests.
							Transform your research into an enterprising venture. Earn money
							and connect with potential investors, collaborators, and
							employers!
						</p>
						<a
							href={"https://sophia-main-app.netlify.app/register"}
							target="_blank"
						>
							<Button>Sign Up</Button>
						</a>
					</Col>
					<Col
						xs={{ span: 24 }}
						lg={{ span: 12 }}
						className="xlx flex justify-end"
						style={{
							// width: "50%",
							textAlign: "center",
						}}
					>
						<img
							src={woman}
							alt="Graduate-Woman-pic"
							className="img1"
							style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
						/>
					</Col>
				</Row>
			</div>
			<section className="dev">
				<div className="compartment">
					<h2 className="playfair-display-bold">
						Explore our top learning and research interests
					</h2>
					<Row
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Col
							xs={24}
							sm={24}
							md={12}
							lg={12}
							xl={12}
							style={{ width: "50%" }}
						>
							<h3
								className="playfair-display-medium"
								style={{ marginBottom: 18, lineHeight: 2 }}
							>
								Learning Development courses
							</h3>
						</Col>
						<Col
							xs={24}
							sm={24}
							md={12}
							lg={12}
							xl={12}
							style={{ width: "50%", textAlign: "center" }}
						>
							<Accordion title="Applied Science" data={applied_science_data} />
							<Accordion title="Formal Science" data={formal_science_data} />
							<Accordion title="Humanities" data={humanities_data} />
							<Accordion title="Natural Science" data={natural_science_data} />
							<Accordion title="Social Science" data={social_science_data} />
						</Col>
					</Row>
				</div>
			</section>
			<section className="diff">
				<div className="compartment">
					<Row
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Col
							xs={24}
							sm={24}
							md={12}
							lg={12}
							xl={12}
							style={{ width: "50%" }}
						>
							<h3
								className="playfair-display-medium"
								style={{ marginBottom: 18, lineHeight: 2 }}
							>
								Entrepreneurship and Innovation courses
							</h3>
						</Col>
						<Col
							xs={24}
							sm={24}
							md={12}
							lg={12}
							xl={12}
							style={{ width: "50%", textAlign: "center", paddingBottom: 30 }}
						>
							<Accordion title="Applied Science" data={applied_science_data} />
							<Accordion title="Formal Science" data={formal_science_data} />
							<Accordion title="Humanities" data={humanities_data} />
							<Accordion title="Natural Science" data={natural_science_data} />
							<Accordion title="Social Science" data={social_science_data} />
						</Col>
					</Row>
				</div>
			</section>
			<section className="">
				<div className="compartment">
					<h2 className="playfair-display-bold">
						Things you can do with{" "}
						<span className="text-[#581A57]">SOPHIA</span>
					</h2>
					<Row align="top" justify="space-between" className="hero-text">
						<Col xs={{ span: 24 }} lg={{ span: 12 }}>
							<div className="flex">
								<img src={badge} alt="..." width={20} />
								<p className="inter-normal">Become a member</p>
							</div>
							<div className="flex">
								<img src={badge} alt="..." width={20} />
								<p className="inter-normal">
									Enroll and take your learning development courses
								</p>
							</div>
							<div className="flex">
								<img src={badge} alt="..." width={20} />
								<p className="inter-normal">
									Enroll and take your entrepreneurship and innovation
									courses
								</p>
							</div>
							<div className="flex">
								<img src={badge} alt="..." width={20} />
								<p className="inter-normal">
									Publish your work and generate certificate of achievement
								</p>
							</div>
							<div className="flex">
								<img src={badge} alt="..." width={20} />
								<p className="inter-normal">Upload your enterprise project</p>
							</div>
						</Col>
						<Col
							xs={{ span: 24 }}
							lg={{ span: 12 }}
							className="xlx"
							style={{ textAlign: "center", paddingBottom: 30 }}
						>
							<img className="img1" src={computer_lady} alt="..." />
						</Col>
					</Row>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default HomePage;
