import Head from 'next/head';
import { useEffect, useState } from 'react';

import { PostCard, PostWidget, Categories } from '../components';
import FeaturedPosts from '../sections/FeaturedPosts';
import { getPosts, getFeaturedPosts } from '../services';

// const posts = [
// 	{ title: 'React Testing', excerpt: 'React Testing' },
// 	{ title: 'React Tailwind', excerpt: 'React Tailwind' }
// ];

const Home = ({ posts }) => {
	const [featuredPosts, setFeaturedPosts] = useState([]);
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		getFeaturedPosts().then((result) => {
			setFeaturedPosts(result);
			setDataLoaded(true);
		});
	}, []);

	return (
		<div className="container mx-auto px-10 mb-8">
			<Head>
				<title>CMS Blog</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FeaturedPosts featuredPosts={featuredPosts} dataLoaded={dataLoaded} />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<div className="lg:col-span-8 col-span-1">
					{posts.map((post, index) => (
						<PostCard
							key={index}
							post={post.node}
							featuredPosts={featuredPosts}
						/>
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