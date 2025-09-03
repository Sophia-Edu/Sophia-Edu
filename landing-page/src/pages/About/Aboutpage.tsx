import React from "react";
import { Button, Footer, Navbar } from "../../components";
import "./Aboutpage.styles.scss";
import { Col, Row } from "antd";
import {
	badge,
	manWoman,
	office_woman,
	twoWoman,
	whiteBadge,
} from "../../assets";

const AboutPage: React.FC = () => {
	return (
		<div className="about sm:px-0 px-[10px]">
			<div className="contain">
				<Navbar />
				<h2 className="playfair-display-bold text-left sm:text-center">
					About Us
				</h2>
				<p
					className="inter-normal text-justify  sm:text-center"
					style={{ marginBottom: 18, lineHeight: 2 }}
				>
					Sophia is an ambitious for-profit education technology and career
					development social enterprise offering tailored preparatory training
					on relevant academic and entrepreneurial skills for higher education
					students and young professionals. Sophia also provides a professional
					networking platform where learners and young professionals can showcase their enterprise projects for visibility to potential investors and employers.
				</p>
				<div className="div">
					<a
						href={"https://sophia-main-app.netlify.app/register"}
						target="_blank"
					>
						<Button className="abtBtn inter-medium">Sign Up</Button>
					</a>
				</div>
			</div>
			<section>
				<Row
					className="section "
					align="top"
					justify="space-between"
					align-items="center"
					style={{ marginTop: 60 }}
				>
					<Col xs={{ span: 24 }} lg={{ span: 12 }}>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							Sophia came up as a solution to a felt need and challenges
							observed by Sophia founders themselves in the international
							education sector, and to which current services are not solving
							adequately.
						</p>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							“Sophia” borrowed its name from the Greek word “Σοφία” or “Sophía”
							which means "Wisdom". The idea behind Sophia is not to provide
							learners with any specific subject knowledge; instead, as the
							platform's logo suggests, Sophia is aimed at providing the
							scaffolding with which learners could see what is lying out there
							in terms of knowledge, wisdom and understanding in their chosen
							fields of study and professional endeavours.
						</p>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							Our logo was inspired by Wittgenstein's metaphor of the ladder in
							his <em>Tractatus Logico-Philosophicus</em>, symbolizing the journey of
							learning and understanding.
						</p>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							Sophia leverages the potentials offered by latest technologies,
							insights and feedback from stakeholders in the higher education
							sector and industry experts to optimize learning, research, and entrepreneurial skills for higher
							education students and young professionals.
						</p>
					</Col>
					<Col
						xs={{ span: 24 }}
						lg={{ span: 12 }}
						style={{
							display: "flex",
							justifyContent: "end",
						}}
						className="xlx"
					>
						<img
							src={office_woman}
							className="img1"
							alt="Office-Woman-on-call-pic"
							style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
						/>
					</Col>
				</Row>
			</section>
			<section style={{ background: "#f5f5f5" }}>
				<Row
					className="section"
					align="top"
					// justify="space-between"
					align-items="center"
					style={{ marginTop: 60, gap: 80 }}
				>
					<Col
						xs={{ span: 24 }}
						lg={{ span: 10 }}
						style={{
							textAlign: "center",
						}}
					>
						<img
							src={twoWoman}
							className="img1"
							alt="Office-Woman-on-call-pic"
							style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
						/>
					</Col>
					<Col
						xs={{ span: 24 }}
						lg={10}
						style={{ width: "100%", marginTop: 30 }}
					>
						<img src={badge} width={30} alt="" style={{ marginBottom: 10 }} />
						<h2 className="font-bold text-[24px]" style={{ marginBottom: 10 }}>
							Mission
						</h2>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							To promote inclusive and equitable participation in quality higher education and career development by equipping youths and adults with the learning, research, and entrepreneurial skills they need to improve outcomes in their studies, careers, and enterprises.
						</p>
					</Col>
				</Row>
			</section>
			<section
				style={{ background: "#581A57", color: "#fff", margin: "150px 0" }}
			>
				<Row
					className="section"
					align="top"
					// justify="space-between"
					align-items="center"
					style={{ marginTop: 60, gap: 80 }}
				>
					<Col
						xs={{ span: 24 }}
						lg={{ span: 10 }}
						style={{
							display: "flex",
							justifyContent: "end",
						}}
					>
						<img
							src={manWoman}
							className="img1"
							alt="Office-Woman-on-call-pic"
							style={{ maxWidth: "100%", maxHeight: "100%", height: "auto" }}
						/>
					</Col>
					<Col
						xs={{ span: 24 }}
						lg={{ span: 12 }}
						style={{ width: "100%", marginTop: 30 }}
					>
						<img
							src={whiteBadge}
							width={30}
							alt=""
							style={{ marginBottom: 10 }}
						/>
						<h2 className="font-bold text-[24px]" style={{ marginBottom: 10 }}>
							Vision
						</h2>
						<p
							className="inter-normal text-justify"
							style={{ marginBottom: 18, lineHeight: 2, fontSize: 16 }}
						>
							To substantially increase the number of youths and adults who have
							relevant skills and knowledge for employment, decent jobs and
							entrepreneurship.
						</p>
					</Col>
				</Row>
			</section>
			<Footer />
		</div>
	);
};

export default AboutPage;
