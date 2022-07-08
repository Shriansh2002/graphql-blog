import React from 'react';

import moment from 'moment';
import Link from 'next/link';

const PostCard = ({ post, featuredPosts }) => {
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
    let Flag = 0;

    featuredPosts?.forEach(element => {
        if (element.slug === post.slug) {
            Flag = 1;
        }
    });

    return (
        <div className="bg-white shadow-lg rounded-lg p-0 lg:p-8 pb-12 mb-8">
            <div className="relative overflow-hidden shadow-md pb-80 mb-6">
                <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className='object-top absolute h-80 w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg'
                />
            </div>
            <h1 className="transition duration-700 text-center mb-8 cursor-pointer hover:text-pink-600 text-3xl font-semibold">
                <Link href={`/post/${post.slug}`}>
                    {post.title}
                </Link>
            </h1>
            <div className="block lg:flex text-center items-center justify-center mb-8 w-full">
                <div className="flex items-center justify-center mb-4 lg:mb-0 w-full lg:w-auto mr-8">
                    <img
                        alt={post.author.name}
                        height="30px"
                        width="30px"
                        className='align-middle rounded-full'
                        src={post.author.picture.url}
                    />
                    <p className="inline align-middle text-gray-700 ml-2 text-lg">{post.author.name}</p>
                </div>

                <div className="font-medium text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
                </div>
            </div>
            <p className="text-center text-lg text-gray-700 font-normal px-4 lg:px-20 mb-8">
                {post.excerpt}
            </p>
            <div className="text-center flex justify-between">
                <Link href={`/post/${post.slug}`}>
                    <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-pink-600 text-lg font-medium rounded-lg text-white px-8 py-3 cursor-pointer">Continue Reading</span>
                </Link>

                {Flag === 0 &&
                    <button
                        type="button"
                        className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 mr-2 mb-2"
                        onClick={makePayment}
                    >
                        Pay
                    </button>
                }

            </div>
        </div>
    );
};

export default PostCard;