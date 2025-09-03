import React from "react";
import { Footer, Navbar, ScrollToTopButton } from "../../components";
import "./Termspage.styles.scss";
import { Card } from "antd";

const TermsPage: React.FC = () => {
	return (
		<div className="privacy">
			<div className="contain">
				<Navbar />
				<h2>Terms of use</h2>
				<Card bordered={false} style={{ width: "100%" }} hoverable>
					{/* <h3 className="inter-bold" style={{ color: "#581A57" }}>
						Introduction
					</h3> */}
					<p className="inter-normal">
						<span className="font-bold">Last Updated Date:</span> September 01,
						2024
					</p>
					<p className="inter-normal">
						Sophia Edu, Inc. ({<span className="font-bold">"Sophia"</span>} or
						{<span className="font-bold">"we"</span>}) provides a learning
						platform, career development, and social networking service that
						empowers users, including higher education students, academics, and
						professionals, to create user accounts, access academic skills and
						career development courses, and connect with potential investors and
						employers globally (referred to as the{" "}
						{<span className="font-bold"> “Services”</span>}) through our
						website, available at sophiaonline.net (the{" "}
						<span className="font-bold">“Site”</span>). Kindly read through the
						following terms of use <span className="font-bold">(“Terms”)</span>{" "}
						along with our
						<span className="font-bold">“Privacy Policy”</span>. These Terms
						govern your use of and access to the Site, Services, and Collective
						Content (as defined below), establishing a binding legal agreement
						between you and Sophia.
					</p>

					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Important Content-related Definitions
					</h3>
					<p className="inter-normal">
						<span className="font-bold">“Content”</span> refers to text,
						graphics, images, music, software, audio, video, documents,
						information, or other creative works.
					</p>
					<p className="inter-normal">
						<span className="font-bold">“Sophia Content” </span> encompasses
						Content provided by Sophia via the Site or Services, including any
						Content licensed from third parties (such as instructor content),
						excluding Member Content
					</p>
					<p className="inter-normal">
						<span className="font-bold">“Member” </span>denotes an individual
						who completes Sophia’s account registration process as detailed
						below under the “Account Registration” section.
					</p>
					<p className="inter-normal">
						<span className="font-bold">“Member Content” </span>signifies
						Content that a Member posts, uploads, publishes, submits, or
						transmits to be available through the Site or Services.
					</p>
					<p className="inter-normal">
						<span className="font-bold">“Collective Content” </span>includes
						Sophia Content and Member Content collectively.
					</p>
					<p className="inter-normal">
						Specific areas of the Site (and your use of certain Services or
						Collective Content) may feature different terms and conditions or
						necessitate your acceptance of additional terms and conditions. In
						case of a conflict between these Terms and terms and conditions
						specified for a particular area of the Site, Services, or Collective
						Content, the latter will prevail concerning your use or access to
						that area.
					</p>
					<p className="inter-normal">
						BY ACCESSING OR USING THE SITE OR SERVICES, OR BY DOWNLOADING OR
						POSTING ANY CONTENT FROM OR ON THE SITE OR THROUGH THE SERVICES, YOU
						ACKNOWLEDGE AND AGREE THAT YOU HAVE READ, UNDERSTOOD, AND CONSENT TO
						ABIDE BY THESE TERMS, REGARDLESS OF WHETHER YOU HAVE REGISTERED ON
						OR THROUGH THE SITE. IF YOU DO NOT AGREE TO THESE TERMS, YOU HAVE NO
						RIGHT TO ACCESS OR USE THE SITE, SERVICES, OR COLLECTIVE CONTENT.
						Should you accept or agree to these Terms on behalf of a company,
						university, or another legal entity, you affirm that you possess the
						authority to bind said entity to these Terms, with “you” and “your”
						then referring to that entity.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Modifications
					</h3>
					<p className="inter-normal">
						Sophia retains the right, at its discretion, to modify the Site,
						Services, and these Terms at any time without prior notice. If we
						amend these Terms, we will post the modifications on the Site or
						notify you of the changes. Additionally, we will update the “Last
						Updated Date” atop these Terms. Your continued access to or use of
						the Site or Services following a posted modification or notification
						of a modification indicates your agreement to be bound by the
						modified Terms. If the modified Terms are unacceptable to you, your
						sole recourse is to discontinue using the Site and Services.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Eligibility
					</h3>
					<p className="inter-normal">
						The Site and Services are exclusively intended for individuals aged
						18 years or older. Individuals under 18 may only use the Site when
						accompanied by an adult. By accessing or using the Site or Services,
						you affirm and warrant that you are 18 years of age or older or
						accompanied by an adult.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Account Registration
					</h3>
					<p className="inter-normal">
						To access certain Site and Services features and to post Member
						Content on the Site or via the Services, you must register to create
						an account (“Account”) and become a Member.
					</p>
					<p className="inter-normal">
						Registration may occur directly through the Site or by logging into
						your account on specific third-party sites (including, but not
						limited to, Google). If you opt for registration through a
						third-party site, we will gather the personal information you
						provided to that site (such as your “real” name, email address, and
						other publicly available information) and use it to create your
						Account. The specifics of the information we gather may hinge on
						your privacy settings with the third-party site. By proceeding with
						registration, you consent to our access and collection of such
						personal information about you. During registration, you must
						furnish certain information and establish a username and password.
					</p>
					<p className="inter-normal">
						You commit to providing accurate, current, and complete information
						during registration and to update this information to maintain its
						accuracy, currency, and completeness. Sophia reserves the right to
						suspend or terminate your Account if any information provided during
						registration or afterward proves inaccurate, outdated, or
						incomplete. You are responsible for safeguarding your password,
						agreeing not to disclose it to any third party, and taking sole
						responsibility for any activities under your Account, whether or not
						you authorized them. Promptly inform Sophia of any unauthorized
						Account use.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Payment
					</h3>
					<p className="inter-normal">
						Sophia may provide the option to access specific features through
						the purchase of a recurring subscription (“Subscription”).
					</p>
					<p className="inter-normal">
						Upon purchasing a Subscription or making any other paid
						feature-related purchase via the Services (each, a “Transaction”),
						you expressly authorize us (or our third-party payment processor,
						e.g., Stripe) to charge you for such Transaction. We may request
						additional information relevant to your Transaction, including, but
						not limited to, your credit or debit card number, card expiration
						date, billing address, and additional identity verification
						information before completing the Transaction (referred to as
						“Payment Information”). You confirm that you possess the legal right
						to use all payment methods represented by any provided Payment
						Information. When initiating a Transaction, you authorize us to
						store and continue billing you using your Payment Information and to
						share your Payment Information with our third-party payment
						processors as necessary to complete your Transactions. Additionally,
						we may periodically authorize your payment method in anticipation of
						applicable fees or charges. As part of our order processing
						procedures, we may scrutinize orders for potential fraud or
						unauthorized activity, reserving the right to refuse to process
						suspicious orders. Your Subscription remains active until canceled
						by you or terminated by us in accordance with these Terms.
					</p>
					<p className="inter-normal">
						If you choose to purchase an annual or monthly Subscription, you
						will be charged the corresponding Subscription Fee plus applicable
						taxes at the start of your Subscription and each subsequent year or
						month, respectively, at the then-current rate offered. We reserve
						the right to modify the Subscription Fee amount upon prior notice.
						For annual Subscriptions, we (or our third-party payment processor)
						will automatically charge you on your Subscription anniversary using
						the provided Payment Information. For monthly Subscriptions, we (or
						our third-party payment processor) will automatically charge you
						monthly on the Subscription start date. If your Subscription
						commenced on a date not present in a given month, your payment
						method will be charged on an appropriate date. For example, if you
						began your Subscription on January 31st, the next payment date is
						likely February 28th, and your payment method would be billed
						accordingly.
					</p>
					<p className="inter-normal">
						By accepting these Terms and purchasing a Subscription, you
						acknowledge the recurring payment feature of your Subscription and
						accept responsibility for all recurring payment obligations until
						you cancel your Subscription or it is terminated by you or Sophia.
					</p>
					<p className="inter-normal">
						<span className="font-bold">Trials:</span> We may provide
						Subscriptions on a free trial basis (“Free Trial”) or discounted,
						paid trial basis (“Discounted Trial”) for a specified period. If
						offered, the specific terms of your Free Trial or Discounted Trial
						will be provided upon signup and/or in promotional materials. Free
						Trials or Discounted Trials may not be combined with other offers
						and are only available to new users. By agreeing to a Free Trial or
						Discounted Trial, you also agree to sign up for a Subscription as
						described herein. Unless canceled before the trial end, we will
						begin charging your payment method for the Subscription Fee (plus
						applicable taxes) post-trial. Instructions for Subscription
						cancellation are detailed under the “Cancellation” section below.
					</p>
					<p className="inter-normal">
						<span className="font-bold">Cancellation:</span> You may cancel your
						Subscription at any time. Instructions for Subscription cancellation
						are provided within the “Account Settings” section of your Account.
						If you cancel your Subscription before the end of your then-current
						billing cycle, your Subscription will remain active until the end of
						the cycle, and you will not receive a refund or credit for any
						remaining time. Following Subscription cancellation, you will lose
						access to certain features and areas of the Site or Services.
						Cancelling your Subscription halts future Subscription Fee charges
						but does not refund previous charges.
					</p>
					<p className="inter-normal">
						<span className="font-bold">Refund:</span> Except when required by
						law, Subscription Fees are nonrefundable. Notwithstanding the
						foregoing, we may offer refunds or credits at our discretion. Should
						we suspend or terminate your Subscription or Account for violating
						these Terms, you will not be eligible for a refund, credit, or any
						compensation. Similarly, should your Subscription or Account
						terminate due to reasons outside of your control (e.g., natural
						disasters, acts of war, or other unforeseeable events), you will not
						be eligible for a refund, credit, or any compensation.
					</p>
					<p className="inter-normal">
						<span className="font-bold">Trial or Promotional Pricing:</span> We
						may offer Subscriptions at a discounted rate or for a free trial
						period for promotional purposes. Unless otherwise stated during
						signup, after the promotional period ends, the standard rate will
						apply. We reserve the right to modify, terminate, or otherwise amend
						trial or promotional pricing at any time.
					</p>
					<p className="inter-normal">
						<span className="font-bold">General Payment Terms:</span> All
						Subscription Fees and payments are in USD, and you are solely
						responsible for all taxes and fees levied at your jurisdiction.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Ownership
					</h3>
					<p className="inter-normal">
						The Site, Services and Collective Content are protected by
						copyright, trademark, and other laws of the United States, Nigeria
						and foreign countries. You acknowledge and agree that the Site,
						Services and Collective Content, including all associated
						intellectual property rights, are the exclusive property of Sophia
						and its licensors. You will not remove, alter or obscure any
						copyright, trademark, service mark or other proprietary rights
						notices incorporated in or accompanying the Site, Services or
						Collective Content.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						License Granted by Sophia to Sophia Content
					</h3>
					<p className="inter-normal">
						Subject to your compliance with the terms and conditions of these
						Terms, Sophia authorizes you to download, view and print any Sophia
						Content, solely for your personal and non-commercial purposes, and
						to access and use the Site and Services solely for your personal and
						non-commercial purposes, and subject to the restrictions set forth
						in these Terms. You have no right to sublicense the rights granted
						in this section.
					</p>
					<p className="inter-normal">
						You will not use, copy, adapt, modify, prepare derivative works
						based upon, distribute, license, sell, transfer, publicly display,
						publicly perform, transmit, stream, broadcast or otherwise exploit
						the Site, Services, or any related information to which you may have
						access; except as expressly permitted in these Terms. No licenses or
						rights are granted to you by implication or otherwise under any
						intellectual property rights owned or controlled by Sophia or its
						licensors, except for the licenses and rights expressly granted in
						these Terms.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						License Granted by Sophia to Member Content
					</h3>
					<p className="inter-normal">
						All member contents uploaded on this site are licensed under the
						Creative Commons License, CC BY, and every member can choose how
						they make their contents available to others{" "}
						<a
							className="text-black"
							href="https://chooser-beta.creativecommons.org/"
							target="_blank"
						>
							(https://chooser-beta.creativecommons.org/)
						</a>
						. In the case where a member uploads their content for sale, a
						portion of the revenue from the member content will be transferred
						to the content creator upon purchase by other users, or even, the
						content creator can also connect to an investor or employer as a
						result of their contents.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Member Content
					</h3>
					<p className="inter-normal">
						You retain ownership rights to your Member Content. However, by
						posting Member Content on the Site or through the Services, you
						grant Sophia a non-exclusive, transferable, sublicensable,
						royalty-free, worldwide license to host, use, distribute, modify,
						run, copy, publicly perform or display, translate, and create
						derivative works of your Member Content, even for commercial
						purposes, (consistent with your privacy settings) in connection with
						providing the Services and operating the Site, including without
						limitation promoting and redistributing part or all of the Site or
						Services (and derivative works thereof) in any media formats and
						through any media channels. You also grant each user of the Site
						and/or the Services a non-exclusive license to access your Member
						Content through the Site and/or the Services and to use, reproduce,
						distribute, display, and perform such Member Content as permitted by
						the functionality of the Site and/or the Services and these Terms.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						You represent and warrant that:
					</h3>
					<p className="inter-normal ">
						- you own or have the necessary licenses, rights, consents, and
						permissions to grant the foregoing licenses to Sophia for your
						Member Content, as detailed in these Terms;
					</p>
					<p className="inter-normal ">
						- your Member Content does not infringe, misappropriate, or violate
						a third party’s intellectual property rights, rights of publicity or
						privacy, or other proprietary rights, or any laws or regulations;
					</p>
					<p className="inter-normal ">
						- your Member Content is not defamatory, obscene, pornographic,
						vulgar, offensive, threatening, abusive, harassing, tortious, or
						otherwise unlawful;
					</p>
					<p className="inter-normal ">
						- your Member Content does not contain or install any viruses,
						worms, malware, Trojan horses, or other harmful or destructive
						content;
					</p>
					<p className="inter-normal ">
						- your Member Content is not spam, is not machine- or
						randomly-generated;
					</p>
					<p className="inter-normal ">
						- your Member Content does not include misleading information or
						false statements of fact;
					</p>
					<p className="inter-normal ">
						- your Member Content does not contain any private or personal
						information of a third party without that party’s consent.
					</p>
					<p className="inter-normal ">
						Sophia takes no responsibility and assumes no liability for any
						Member Content that you or any other user or third party posts or
						transmits through the Services. You understand and agree that you
						may be exposed to Member Content that is inaccurate, objectionable,
						inappropriate for children, or otherwise unsuited to your purpose,
						and you agree that Sophia shall not be liable for any damages you
						incur resulting from Member Content.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Prohibited Content and Activities
					</h3>
					<p className="inter-normal ">
						You may not post, upload, publish, submit, or transmit any Member
						Content that:
					</p>
					<p className="inter-normal ">
						- infringes, misappropriates, or violates a third party’s patent,
						copyright, trademark, trade secret, moral rights, or other
						intellectual property rights, or rights of publicity or privacy;
					</p>
					<p className="inter-normal ">
						- violates, or encourages any conduct that would violate, any
						applicable law or regulation or would give rise to civil liability
					</p>
					<p className="inter-normal ">
						- is fraudulent, false, misleading, or deceptive;
					</p>
					<p className="inter-normal ">
						- is defamatory, obscene, pornographic, vulgar, offensive, promotes
						discrimination, bigotry, racism, hatred, harassment, or harm against
						any individual or group;
					</p>
					<p className="inter-normal ">
						- is violent or threatening or promotes violence or actions that are
						threatening to any person or entity;
					</p>
					<p className="inter-normal ">
						- promotes illegal or harmful activities or substances;
					</p>
					<p className="inter-normal ">
						- violates any party’s right to privacy or right to data protection;
					</p>
					<p className="inter-normal ">
						- involves the transmission of unsolicited mass mailing, or
						“spamming”;
					</p>
					<p className="inter-normal ">
						- constitutes or contains any form of advertising or solicitation
						not explicitly authorized by Sophia;
					</p>
					<p className="inter-normal ">
						- constitutes or contains any form of malicious or harmful software
						or code, including viruses, Trojans, worms, time bombs, or any other
						computer programming routines that are intended to damage, interfere
						with, intercept, or expropriate any system, data, or personal
						information;
					</p>
					<p className="inter-normal ">
						- is not properly categorized or titled, or inappropriately targets
						a category for promotion, including using irrelevant keywords or
						misleading titles, or engaging in other deceptive practices;
					</p>
					<p className="inter-normal ">
						- violates any school or other educational institution’s academic or
						other policies;
					</p>
					<p className="inter-normal ">
						- constitutes or contains personal data subject to applicable data
						protection laws that is processed or stored in a manner inconsistent
						with applicable data protection laws.
					</p>
					<p className="inter-normal ">
						Sophia reserves the right to remove any Member Content or suspend or
						terminate your access to the Services or Account if we determine, at
						our discretion, that any Member Content violates these Terms or is
						otherwise harmful, objectionable, or inaccurate.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Third-Party Websites or Resources
					</h3>
					<p className="inter-normal ">
						The Site and Services may contain links to third-party websites or
						resources. You acknowledge and agree that Sophia is not responsible
						or liable for the availability or accuracy of such websites or
						resources, or the content, products, or services on or available
						from such websites or resources. Links to such websites or resources
						do not imply any endorsement by Sophia of such websites or resources
						or the content, products, or services available from such websites
						or resources. You acknowledge sole responsibility for and assume all
						risk arising from your use of any such websites or resources.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Risks to Your Intellectual Property
					</h3>
					<p className="inter-normal ">
						Some parts of the website allow you to upload your manuscripts for
						review by peers. When you upload your work on this site for review
						by other members, you may be at risk of losing ownership of your
						work and ideas to another member who might publish your work before
						you and claim ownership of your ideas/intellectual property. At the
						moment, Sophia does not have adequate system to check against this
						risk. Therefore, you must make sure that you have thought about the
						risks involved before uploading your work/manuscript to our site for
						peer review. To be on a safer side, we advise that you patent your
						idea/inventions where possible before you upload or
						post them to Sophia.
					</p>
					<p className="inter-normal ">
						By continuing to upload your work/manuscript for review and also by
						using this site, you agree that Sophia does not have any liability
						for your work or intellectual property in the case of theft.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Termination and Account Deletion
					</h3>
					<p className="inter-normal ">
						If you violate these Terms or otherwise engage in behavior that
						Sophia deems inappropriate or harmful, we reserve the right, without
						prior notice, to suspend or terminate your access to all or part of
						the Services or your Account. Following termination, you may lose
						all information associated with your Account, including any Member
						Content. Sophia is not liable for any damages relating to the
						suspension, termination, or deletion of your Account or any Member
						Content. Additionally, Sophia reserves the right to refuse service
						to anyone for any reason at any time.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Disclaimer of Warranties
					</h3>
					<p className="inter-normal ">
						THE SITE, SERVICES AND COLLECTIVE CONTENT ARE PROVIDED “AS IS”,
						WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WITHOUT
						LIMITING THE FOREGOING, SOPHIA EXPLICITLY DISCLAIMS ANY WARRANTIES
						OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET
						ENJOYMENT OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF
						COURSE OF DEALING OR USAGE OF TRADE. SOPHIA MAKES NO WARRANTY THAT
						THE SITE, SERVICES OR COLLECTIVE CONTENT WILL MEET YOUR REQUIREMENTS
						OR BE AVAILABLE ON AN UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS.
						SOPHIA MAKES NO WARRANTY REGARDING THE QUALITY OF ANY PRODUCTS,
						SERVICES OR COLLECTIVE CONTENT PURCHASED OR OBTAINED THROUGH THE
						SITE OR SERVICES OR THE ACCURACY, TIMELINESS, TRUTHFULNESS,
						COMPLETENESS OR RELIABILITY OF ANY CONTENT OBTAINED THROUGH THE SITE
						OR SERVICES.
					</p>
					<p className="inter-normal ">
						NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM
						SOPHIA OR THROUGH THE SITE, SERVICES OR COLLECTIVE CONTENT, WILL
						CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN.
					</p>
					<p className="inter-normal ">
						YOU ARE SOLELY RESPONSIBLE FOR ALL OF YOUR COMMUNICATIONS AND
						INTERACTIONS WITH OTHER USERS OF THE SITE AND SERVICES AND WITH
						OTHER PERSONS WITH WHOM YOU COMMUNICATE OR INTERACT AS A RESULT OF
						YOUR USE OF THE SITE OR SERVICES. YOU UNDERSTAND THAT SOPHIA DOES
						NOT SCREEN OR INQUIRE INTO THE BACKGROUND OF ANY USERS OF THE SITE
						OR SERVICES, NOR DOES SOPHIA MAKE ANY ATTEMPT TO VERIFY THE
						STATEMENTS OF USERS OF THE SITE OR SERVICES. SOPHIA MAKES NO
						REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF USERS OF THE SITE
						OR SERVICES OR THEIR COMPATIBILITY WITH ANY CURRENT OR FUTURE USERS
						OF THE SITE OR SERVICES. YOU AGREE TO TAKE REASONABLE PRECAUTIONS IN
						ALL COMMUNICATIONS AND INTERACTIONS WITH OTHER USERS OF THE SITE AND
						SERVICES AND WITH OTHER PERSONS WITH WHOM YOU COMMUNICATE OR
						INTERACT AS A RESULT OF YOUR USE OF THE SITE OR SERVICES,
						PARTICULARLY IF YOU DECIDE TO MEET OFFLINE OR IN PERSON.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Limitation of Liability
					</h3>
					<p className="inter-normal ">
						You acknowledge and agree that Sophia is not liable for any direct,
						indirect, incidental, special, consequential, or exemplary damages,
						including, but not limited to, damages for loss of profits,
						goodwill, use, data, or other intangible losses resulting from:
					</p>
					<p className="inter-normal ">
						- your access to or use of or inability to access or use the Site,
						Services, or Collective Content;
					</p>
					<p className="inter-normal ">
						- any conduct or content of any third party on the Site or Services;
					</p>
					<p className="inter-normal ">
						- any content obtained from the Site or Services;
					</p>
					<p className="inter-normal ">
						- unauthorized access, use, or alteration of your transmissions or
						content, whether based on warranty, contract, tort (including
						negligence), or any other legal theory, whether or not Sophia has
						been informed of the possibility of such damage, and even if a
						remedy set forth herein is found to have failed of its essential
						purpose.
					</p>
					<p className="inter-normal ">
						Sophia’s liability shall not exceed the amount of Subscription Fees
						paid by you in the six months preceding the event giving rise to
						such liability. Some jurisdictions do not allow the limitation or
						exclusion of liability for incidental or consequential damages, so
						the above limitations or exclusions may not apply to you.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Indemnity
					</h3>
					<p className="inter-normal ">
						You agree to indemnify and hold Sophia, its affiliates, officers,
						agents, employees, and partners harmless from and against any and
						all claims, liabilities, damages (actual and consequential), losses,
						and expenses (including attorneys’ fees) arising from or in any way
						related to:
					</p>
					<p className="inter-normal ">- your breach of these Terms;</p>
					<p className="inter-normal ">
						- your use of the Site, Services, or Collective Content;
					</p>
					<p className="inter-normal ">- your Member Content;</p>
					<p className="inter-normal ">
						- your violation of any law or regulation;
					</p>
					<p className="inter-normal ">
						- your violation of any third party right, including without
						limitation any intellectual property right or privacy right;
					</p>
					<p className="inter-normal ">
						- any claim or damages that arise as a result of any of your Member
						Content or any that are submitted via your Account
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Dispute Resolution
					</h3>
					<p className="inter-normal ">
						<span className="font-bold">Governing Law.</span> In the unlikely
						event we end up in a legal dispute, depending on where you live, you
						and Sophia agree to resolve it in Delaware courts using Delaware
						laws, or Nigerian courts using the laws of the Federal Republic of
						Nigeria, or in your local courts using local law.
					</p>
					<p className="inter-normal ">
						<span className="font-bold">Class Action Waiver.</span> You agree
						that any arbitration or other legal action shall be conducted on an
						individual basis and not as a class, collective, or representative
						action. Accordingly, you hereby waive any right to participate in a
						class, collective, or representative action or proceeding arising
						out of or relating to these Terms, the Site, or the Services.
					</p>
					<p className="inter-normal ">
						Notwithstanding the foregoing, Sophia may seek injunctive or other
						equitable relief to protect its intellectual property rights in any
						court of competent jurisdiction.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Severability
					</h3>
					<p className="inter-normal ">
						If any provision of these Terms is held to be invalid, illegal, or
						unenforceable, the remaining provisions of these Terms shall remain
						in full force and effect to the fullest extent permitted by law.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Waiver
					</h3>
					<p className="inter-normal ">
						No waiver by Sophia of any term or condition set forth in these
						Terms shall be deemed a further or continuing waiver of such term or
						condition or a waiver of any other term or condition, and any
						failure of Sophia to assert a right or provision under these Terms
						shall not constitute a waiver of such right or provision.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Entire Agreement
					</h3>
					<p className="inter-normal ">
						These Terms constitute the entire and exclusive understanding and
						agreement between Sophia and you regarding the Site, Services, and
						Collective Content, and these Terms supersede and replace any and
						all prior oral or written understandings or agreements between
						Sophia and you regarding the Site, Services, and Collective Content.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Assignment
					</h3>
					<p className="inter-normal ">
						You may not assign or transfer these Terms, by operation of law or
						otherwise, without Sophia’s prior written consent. Any attempt by
						you to assign or transfer these Terms, without such consent, will be
						null and of no effect. Sophia may assign or transfer these Terms, at
						its sole discretion, without restriction. Subject to the foregoing,
						these Terms will bind and inure to the benefit of the parties, their
						successors and permitted assigns.
					</p>
					<h3 className="inter-bold" style={{ color: "#581A57" }}>
						Notices
					</h3>
					<p className="inter-normal ">
						Any notices or other communications permitted or required hereunder,
						including those regarding modifications to these Terms, will be in
						writing and given by Sophia (i) via email (in each case to the
						address that you provide); or (ii) by posting to the Site. For
						notices made by e-mail, the date of receipt will be deemed the date
						on which such notice is transmitted.
					</p>
				</Card>
			</div>
			<Footer />
			<ScrollToTopButton />
		</div>
	);
};

export default TermsPage;
