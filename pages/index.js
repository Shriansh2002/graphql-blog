import Head from 'next/head';

import { PostCard, PostWidget, Categories } from '../components';
import FeaturedPosts from '../sections/FeaturedPosts';

import { getPosts } from '../services';

// const posts = [
// 	{ title: 'React Testing', excerpt: 'React Testing' },
// 	{ title: 'React Tailwind', excerpt: 'React Tailwind' }
// ];

const Home = ({ posts }) => {
	const makePayment = async () => {
		console.log("here...");
		const res = await initializeRazorpay();

		if (!res) {
			alert("Razorpay SDK Failed to load");
			return;
		}

		// Make API call to the serverless API
		const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
			t.json()
		);
		console.log(data);
		var options = {
			key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
			name: "Manu Arora Pvt Ltd",
			currency: data.currency,
			amount: data.amount,
			order_id: data.id,
			description: "Thankyou for your test donation",
			image: "https://manuarora.in/logo.png",
			handler: function (response) {
				// Validate payment at server - using webhooks is a better idea.
				alert(response.razorpay_payment_id);
				alert(response.razorpay_order_id);
				alert(response.razorpay_signature);
				alert('payemt success');
			},
			prefill: {
				name: "Manu Arora",
				email: "manuarorawork@gmail.com",
				contact: "9999999999",
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	};
	const initializeRazorpay = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			// document.body.appendChild(script);

			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};

			document.body.appendChild(script);
		});
	};
	return (
		<div className="container mx-auto px-10 mb-8">
			<Head>
				<title>CMS Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FeaturedPosts />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<div className="lg:col-span-8 col-span-1">
					{posts.map((post, index) => (
						<PostCard key={index} post={post.node} makePayment={makePayment} />
					))}
				</div>
				<div className="lg:col-span-4 col-span-1">
					<div className="lg:sticky relative top-8">
						<PostWidget />
						<Categories />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;


export async function getStaticProps() {
	const posts = (await getPosts() || []);

	return {
		props: { posts }
	};
}