import React from "react";
import { Footer, Navbar, ScrollToTopButton } from "../../components";
import "./Privacypage.styles.scss";
import { Card } from "antd";

const PrivacyPage: React.FC = () => {
	return (
		<div className="privacy">
			<div className="contain">
				<Navbar />

				<h2>Privacy Policy</h2>
				<Card bordered={false} style={{ width: "100%" }} hoverable>
					<p className="inter-normal">
						<span className="font-bold">Last Updated Date:</span> September 01,
						2024
					</p>
					<p className="inter-normal">
						This privacy notice for Sophia Edu, Inc. (
						<span className="font-bold">‘Company‘</span>,
						<span className="font-bold">‘we‘</span>,
						<span className="font-bold">‘us‘</span>, or
						<span className="font-bold">‘our‘</span>), describes how and why we
						might collect, store, use, and/or share (
						<span className="font-bold">‘process‘</span>) your information when
						you use our services (<span className="font-bold">‘Services‘</span>
						), such as when you:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								Visit our website at sophiaonline.net, or any website of ours
								that links to this privacy notice
							</li>
							<li className="list-disc ml-6 my-[10px]">
								Engage with us in other related ways, including any sales,
								marketing, or events
							</li>
						</ul>
					</p>
					<p className="inter-normal">
						Reading this privacy notice will help you understand your privacy
						rights and choices. If you do not agree with our policies and
						practices, please do not use our Services. By signing up and using
						our site, you are indicating that you have read and understood our
						privacy policy, and you agree to them.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						TABLE OF CONTENTS
					</h3>
					<ol>
						<li className="ml-6 my-[10px]">
							1. WHAT INFORMATION DO WE COLLECT?
						</li>
						<li className="ml-6 my-[10px]">
							2. HOW DO WE PROCESS YOUR INFORMATION?
						</li>
						<li className="ml-6 my-[10px]">
							3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL
							INFORMATION?
						</li>
						<li className="ml-6 my-[10px]">
							4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?{" "}
						</li>
						<li className="ml-6 my-[10px]">
							5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
						</li>
						<li className="ml-6 my-[10px]">
							6. HOW LONG DO WE KEEP YOUR INFORMATION?
						</li>
						<li className="ml-6 my-[10px]">
							7. HOW DO WE KEEP YOUR INFORMATION SAFE?
						</li>
						<li className="ml-6 my-[10px]">
							8. DO WE COLLECT INFORMATION FROM MINORS?
						</li>
						<li className="ml-6 my-[10px]">9. WHAT ARE YOUR PRIVACY RIGHTS?</li>
						<li className="ml-6 my-[10px]">
							10. CONTROLS FOR DO-NOT-TRACK FEATURES
						</li>
						<li className="ml-6 my-[10px]">
							11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
						</li>
						<li className="ml-6 my-[10px]">
							12. DO WE MAKE UPDATES TO THIS NOTICE?
						</li>
						<li className="ml-6 my-[10px]">
							13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
						</li>
						<li className="ml-6 my-[10px]">
							14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
							YOU?
						</li>
					</ol>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						1. WHAT INFORMATION DO WE COLLECT?
					</h1>
					<p className="inter-bold">Personal information you disclose to us</p>
					<p className="inter-normal">
						We collect personal information that you voluntarily provide to us
						when you register on the Services, express an interest in obtaining
						information about us or our products and Services, when you
						participate in activities on the Services, or otherwise when you
						contact us.
					</p>
					<p className="inter-normal">
						<span className="font-bold">
							Personal Information Provided by You.
						</span>{" "}
						The personal information that we collect depends on the context of
						your interactions with us and the Services, the choices you make,
						and the products and features you use. The personal information we
						collect may include the following:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">names</li>
							<li className="list-disc ml-6 my-[10px]">phone numbers</li>
							<li className="list-disc ml-6 my-[10px]">email addresses</li>
							<li className="list-disc ml-6 my-[10px]">mailing addresses</li>
							<li className="list-disc ml-6 my-[10px]">job titles</li>
							<li className="list-disc ml-6 my-[10px]">education</li>
							<li className="list-disc ml-6 my-[10px]">work experience</li>
							<li className="list-disc ml-6 my-[10px]">usernames</li>
							<li className="list-disc ml-6 my-[10px]">passwords</li>
							<li className="list-disc ml-6 my-[10px]">billing addresses</li>
							<li className="list-disc ml-6 my-[10px]">location</li>
							<li className="list-disc ml-6 my-[10px]">contact preferences</li>
							<li className="list-disc ml-6 my-[10px]">
								contact or authentication data
							</li>
							<li className="list-disc ml-6 my-[10px]">
								debit/credit card numbers
							</li>
						</ul>
					</p>

					<p className="inter-normal">
						<span className="font-bold">Sensitive Information</span> We do not
						process sensitive information.
					</p>
					<p className="inter-normal">
						<span className="font-bold">Payment Data.</span> We may collect data
						necessary to process your payment if you make purchases, such as
						your payment instrument number, and the security code associated
						with your payment instrument. Payment data may be stored by our
						third party payment companies (example, Stripe).
					</p>
					<p className="inter-normal">
						All personal information that you provide to us must be true,
						complete, and accurate, and you must notify us of any changes to
						such personal information.
					</p>
					<p className="inter-bold">Information automatically collected</p>
					<p className="inter-normal">
						We automatically collect certain information when you visit, use, or
						navigate the Services. This information does not reveal your
						specific identity (like your name or contact information) but may
						include device and usage information, such as your IP address,
						browser and device characteristics, operating system, language
						preferences, referring URLs, device name, country, location,
						information about how and when you use our Services, and other
						technical information. This information is primarily needed to
						maintain the security and operation of our Services, and for our
						internal analytics and reporting purposes.
					</p>
					<p className="inter-normal">
						Like many businesses, we also collect information through cookies
						and similar technologies.
					</p>
					<p className="inter-normal">The information we collect includes:</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								<i>Log and Usage Data</i>. Log and usage data is
								service-related, diagnostic, usage, and performance information
								our servers automatically collect when you access or use our
								Services and which we record in log files. Depending on how you
								interact with us, this log data may include your IP address,
								device information, browser type, and settings and information
								about your activity in the Services (such as the date/time
								stamps associated with your usage, pages and files viewed,
								searches, and other actions you take such as which features you
								use), device event information (such as system activity, error
								reports (sometimes called ‘crash dumps’), and hardware
								settings).
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<i> Device Data</i>. We collect device data such as information
								about your computer, phone, tablet, or other device you use to
								access the Services. Depending on the device used, this device
								data may include information such as your IP address (or proxy
								server), device and application identification numbers,
								location, browser type, hardware model, Internet service
								provider and/or mobile carrier, operating system, and system
								configuration information.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<i> Location Data</i>.We collect location data such as
								information about your device’s location, which can be either
								precise or imprecise. How much information we collect depends on
								the type and settings of the device you use to access the
								Services. For example, we may use GPS and other technologies to
								collect geolocation data that tells us your current location
								(based on your IP address). You can opt out of allowing us to
								collect this information either by refusing access to the
								information or by disabling your Location setting on your
								device. However, if you choose to opt out, you may not be able
								to use certain aspects of the Services.
							</li>
						</ul>
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						2. HOW DO WE PROCESS YOUR INFORMATION?
					</h1>
					<p className="inter-bold">
						We process your personal information for a variety of reasons,
						depending on how you interact with our Services, including:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To facilitate account creation and authentication and
									otherwise manage user accounts.
								</span>
								We may process your information so you can create and log in to
								your account, as well as keep your account in working order.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To deliver and facilitate delivery of services to the user
								</span>
								We may process your information to provide you with the
								requested service.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To respond to user inquiries/offer support to users.
								</span>
								We may process your information to respond to your inquiries and
								solve any potential issues you might have with the requested
								service.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To market products to you.
								</span>
								We may process your information in order to market our products
								or third party products to you.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To fulfil and manage your orders.
								</span>
								. We may process your information to fulfil and manage your
								orders, payments, returns, and exchanges made through the
								Services.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To enable user-to-user communications.
								</span>
								We may process your information if you choose to use any of our
								offerings that allow for communication with another user.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									To save or protect an individual’s vital interest.
								</span>
								We may process your information when necessary to save or
								protect an individual’s vital interest, such as to prevent harm.
							</li>
						</ul>
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
					</h1>
					<p className="inter-bold underline">
						<i>
							If you are located in the EU or UK, this section applies to you.
						</i>
					</p>
					<p className="inter-normal">
						The General Data Protection Regulation (GDPR) and UK GDPR require us
						to explain the valid legal bases we rely on in order to process your
						personal information. As such, we may rely on the following legal
						bases to process your personal information:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">Consent</span>
								We may process your information if you have given us permission
								(i.e. consent) to use your personal information for a specific
								purpose. You can withdraw your consent at any time by opting out
								from using our services or deleting your account.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">
									Performance of a Contract.
								</span>
								We may process your personal information when we believe it is
								necessary to fulfil our contractual obligations to you,
								including providing our Services or at your request prior to
								entering into a contract with you.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">Legal Obligations.</span>
								We may process your information where we believe it is necessary
								for compliance with our legal obligations, such as to cooperate
								with a law enforcement body or regulatory agency, exercise or
								defend our legal rights, or disclose your information as
								evidence in litigation in which we are involved.
							</li>
							<li className="list-disc ml-6 my-[10px]">
								<span className="font-bold mr-1">Vital interests.</span>
								We may process your information where we believe it is necessary
								to protect your vital interests or the vital interests of a
								third party, such as situations involving potential threats to
								the safety of any person.
							</li>
						</ul>
					</p>
					<p className="inter-normal">
						In legal terms, we are generally the ‘data controller’ under
						European data protection laws of the personal information described
						in this privacy notice, since we determine the means and/or purposes
						of the data processing we perform. This privacy notice does not
						apply to the personal information we process as a ‘data processor’
						on behalf of our customers. In those situations, the customer that
						we provide services to and with whom we have entered into a data
						processing agreement is the ‘data controller’ responsible for your
						personal information, and we merely process your information on
						their behalf in accordance with your instructions. If you want to
						know more about our customers’ privacy practices, you should read
						their privacy policies and direct any questions you have to them.
					</p>
					<p className="inter-bold underline">
						<i>If you are located in Canada, this section applies to you.</i>
					</p>
					<p className="inter-normal">
						We may process your information if you have given us specific
						permission (i.e. express consent) to use your personal information
						for a specific purpose, or in situations where your permission can
						be inferred (i.e. implied consent). You can withdraw your consent at
						any time by opting out from using our services or deleting your
						account. In some exceptional cases, we may be legally permitted
						under applicable law to process your information without your
						consent, including, for example:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								If collection is clearly in the interests of an individual and
								consent cannot be obtained in a timely way
							</li>
							<li className="list-disc ml-6 my-[10px]">
								For investigations and fraud detection and prevention
							</li>
							<li className="list-disc ml-6 my-[10px]">
								For business transactions provided certain conditions are met
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If it is contained in a witness statement and the collection is
								necessary to assess, process, or settle an insurance claim
							</li>
							<li className="list-disc ml-6 my-[10px]">
								For identifying injured, ill, or deceased persons and
								communicating with next of kin
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If we have reasonable grounds to believe an individual has been,
								is, or may be victim of financial abuse
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If it is reasonable to expect collection and use with consent
								would compromise the availability or the accuracy of the
								information and the collection is reasonable for purposes
								related to investigating a breach of an agreement or a
								contravention of the laws of Canada or a province
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If disclosure is required to comply with a subpoena, warrant,
								court order, or rules of the court relating to the production of
								records
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If it was produced by an individual in the course of their
								employment, business, or profession and the collection is
								consistent with the purposes for which the information was
								produced
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If the collection is solely for journalistic, artistic, or
								literary purposes
							</li>
							<li className="list-disc ml-6 my-[10px]">
								If the information is publicly available and is specified by the
								regulations
							</li>
						</ul>
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
					</h1>
					<p className="inter-normal">
						We may need to share your personal information in the following
						situations:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								<span className="inter-bold">Business Transfers.</span> We may
								share or transfer your information in connection with, or during
								negotiations of, any merger, sale of company assets, financing,
								or acquisition of all or a portion of our business to another
								company.
							</li>
						</ul>
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
					</h1>
					<p className="inter-normal">
						We may use cookies and similar tracking technologies (like web
						beacons and pixels) to access or store information. Specific
						information about how we use such technologies and how you can
						refuse certain cookies is set out in our Cookie Notice.
					</p>
					<p className="inter-bold">Cookie Policy</p>
					<p className="inter-bold">About this cookie Policy</p>
					<p className="inter-normal">
						This Cookie Policy explains what cookies are and how we use them,
						the types of cookies we use i.e, the information we collect using
						cookies and how that information is used, and how to control the
						cookie preferences. You can at any time change or withdraw your
						consent from the Cookie Declaration on our website.
					</p>
					<p className="inter-bold">What are cookies?</p>
					<p className="inter-nomral">
						Cookies are small text files that are used to store small pieces of
						information. They are stored on your device when the website is
						loaded on your browser. These cookies help us make the website
						function properly, make it more secure, provide better user
						experience, and understand how the website performs and to analyze
						what works and where it needs improvement.
					</p>
					<p className="inter-bold">How do we use cookies?</p>
					<p className="inter-normal">
						As most of the online services, our website uses first-party and
						third-party cookies for several purposes. First-party cookies are
						mostly necessary for the website to function the right way, and they
						do not collect any of your personally identifiable data. The
						third-party cookies used on our website are mainly for understanding
						how the website performs, how you interact with our website, keeping
						our services secure, providing advertisements that are relevant to
						you, and all in all providing you with a better and improved user
						experience and help speed up your future interactions with our
						website.
					</p>
					<p className="inter-bold">What types of cookies do we use?</p>
					<p className="inter-normal">
						<span className="inter-bold">Essential:</span> Some cookies are
						essential for you to be able to experience the full functionality of
						our site. They allow us to maintain user sessions and prevent any
						security threats. They do not collect or store any personal
						information. For example, these cookies allow you to log-in to your
						account and add products to your basket, and checkout securely.
					</p>
					<p className="inter-normal">
						<span className="inter-bold">Statistics:</span> These cookies store
						information like the number of visitors to the website, the number
						of unique visitors, which pages of the website have been visited,
						the source of the visit, etc. These data help us understand and
						analyze how well the website performs and where it needs
						improvement.
					</p>
					<p className="inter-normal">
						<span className="inter-bold">Functional:</span> These are the
						cookies that help certain non-essential functionalities on our
						website. These functionalities include embedding content like videos
						or sharing content of the website on social media platforms.
					</p>
					<p className="inter-normal">
						<span className="inter-bold">Preferences:</span> These cookies help
						us store your settings and browsing preferences like language
						preferences so that you have a better and efficient experience on
						future visits to the website.
					</p>
					<p className="inter-bold">
						How can I control the cookie preferences ?
					</p>
					<p className="inter-normal">
						Should you decide to change your preferences later through your
						browsing session, please note that web browsers provide different
						methods to block and delete cookies used by websites. You can change
						the settings of your browser to block/delete the cookies.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						6. HOW LONG DO WE KEEP YOUR INFORMATION?
					</h1>
					<p className="inter-normal">
						We will only keep your personal information for as long as it is
						necessary for the purposes set out in this privacy notice, unless a
						longer retention period is required or permitted by law (such as
						tax, accounting, or other legal requirements). No purpose in this
						notice will require us keeping your personal information for longer
						than the period of time in which users have an account with us.
					</p>
					<p className="inter-normal">
						When we have no ongoing legitimate business need to process your
						personal information, we will either delete or anonymise such
						information, or, if this is not possible (for example, because your
						personal information has been stored in backup archives), then we
						will securely store your personal information and isolate it from
						any further processing until deletion is possible.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						7. HOW DO WE KEEP YOUR INFORMATION SAFE?
					</h1>
					<p className="inter-normal">
						We have implemented appropriate and reasonable technical and
						organisational security measures designed to protect the security of
						any personal information we process. However, despite our safeguards
						and efforts to secure your information, no electronic transmission
						over the Internet or information storage technology can be
						guaranteed to be 100% secure, so we cannot promise or guarantee that
						hackers, cybercriminals, or other unauthorised third parties will
						not be able to defeat our security and improperly collect, access,
						steal, or modify your information. Although we will do our best to
						protect your personal information, transmission of personal
						information to and from our Services is at your own risk. You should
						only access the Services within a secure environment.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						8. DO WE COLLECT INFORMATION FROM MINORS?
					</h1>
					<p className="inter-normal">
						We do not knowingly solicit data from or market to children under 18
						years of age. By using the Services, you represent that you are at
						least 18 or that you are the parent or guardian of such a minor and
						consent to such minor dependent’s use of the Services. If we learn
						that personal information from users less than 18 years of age has
						been collected, we will deactivate the account and take reasonable
						measures to promptly delete such data from our records.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						9. WHAT ARE YOUR PRIVACY RIGHTS?
					</h1>
					<p>
						In some regions (like the EEA, UK, and Canada), you have certain
						rights under applicable data protection laws. These may include the
						right (i) to request access and obtain a copy of your personal
						information, (ii) to request rectification or erasure; (iii) to
						restrict the processing of your personal information; and (iv) if
						applicable, to data portability. In certain circumstances, you may
						also have the right to object to the processing of your personal
						information.
					</p>
					<p className="inter-normal">
						We will consider and act upon any request in accordance with
						applicable data protection laws.
					</p>
					<p className="inter-normal">
						If you are located in the EEA or UK and you believe we are
						unlawfully processing your personal information, you also have the
						right to complain to your Member State data protection authority or
						UK data protection authority.
					</p>
					<p className="inter-normal">
						If you are located in Switzerland, you may contact the Federal Data
						Protection and Information Commissioner.
					</p>
					<p className="inter-normal">
						<span className="font-bold underline">
							Withdrawing your consent:{" "}
						</span>
						If we are relying on your consent to process your personal
						information, which may be express and/or implied consent depending
						on the applicable law, you have the right to withdraw your consent
						at any time. You can withdraw your consent at any time by contacting
						us by using the contact details provided in contact us page of our
						website
					</p>
					<p className="inter-normal">
						However, please note that this will not affect the lawfulness of the
						processing before its withdrawal nor, when applicable law allows,
						will it affect the processing of your personal information conducted
						in reliance on lawful processing grounds other than consent.
					</p>
					<p className="inter-bold">Account Information</p>
					<p className="inter-normal">
						If you would at any time like to review or change the information in
						your account or terminate your account, you can:
					</p>
					<p className="inter-normal">
						<ul>
							<li className="list-disc ml-6 my-[10px]">
								Log in to your account settings and update your user account.
							</li>
						</ul>
					</p>
					<p className="inter-normal">
						Upon your request to terminate your account, we will deactivate or
						delete your account and information from our active databases.
						However, we may retain some information in our files to prevent
						fraud, troubleshoot problems, assist with any investigations,
						enforce our legal terms and/or comply with applicable legal
						requirements.
					</p>
					<p className="inter-normal">
						<span className="font-bold underline">
							Cookies and similar technologies:
						</span>
						Most Web browsers are set to accept cookies by default. If you
						prefer, you can usually choose to set your browser to remove cookies
						and to reject cookies. If you choose to remove cookies or reject
						cookies, this could affect certain features or services we provide
						to you.
					</p>
					<p className="inter-normal">
						If you have questions or comments about your privacy rights, you may
						contact us using the contact details on our website.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						10. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
					</h1>
					<p className="inter-normal">
						California Civil Code Section 1798.83, also known as the ‘Shine The
						Light’ law, permits our users who are California residents to
						request and obtain from us, once a year and free of charge,
						information about categories of personal information (if any) we
						disclosed to third parties for direct marketing purposes and the
						names and addresses of all third parties with which we shared
						personal information in the immediately preceding calendar year. If
						you are a California resident and would like to make such a request,
						please submit your request in writing to us using the contact
						information provided on our website.
					</p>
					<p className="inter-normal">
						If you are under 18 years of age, reside in California, and have a
						registered account with us, you have the right to request removal of
						unwanted data that you publicly post on the Services. To request
						removal of such data, please contact us using the contact
						information provided on our website and include the email address
						associated with your account and a statement that you reside in
						California. We will make sure the data is not publicly displayed on
						the Services, but please be aware that the data may not be
						completely or comprehensively removed from all our systems (e.g.
						backups, etc.).
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						11. DO WE MAKE UPDATES TO THIS NOTICE?
					</h1>
					<p className="inter-normal">
						We may update this privacy notice from time to time. The updated
						version will be indicated by an updated ‘Revised’ date and the
						updated version will be effective as soon as it is accessible. If we
						make material changes to this privacy notice, we may notify you
						either by prominently posting a notice of such changes or by
						directly sending you a notification. We encourage you to review this
						privacy notice frequently to be informed of how we are protecting
						your information.
					</p>
					<h1 className="inter-bold" style={{ color: "#581A57" }}>
						12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
						YOU?
					</h1>
					<p className="inter-normal">
						You have the right to request access to the personal information we
						collect from you, change that information, or delete it. You can use
						the profile tab on your account to review your personal information.
						To deactivate your account, you can use the options on the settings. 
						You can email us to permanently delete your account.
					</p>
				</Card>
			</div>
			<ScrollToTopButton />
			<Footer />
		</div>
	);
};

export default PrivacyPage;
