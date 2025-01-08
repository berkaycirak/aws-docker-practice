import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Post {
	id: string;
	imageUrl: string;
	description: string;
	createdAt: string;
}

interface DashboardProps {
	setIsAuthenticated: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {
	const [file, setFile] = useState<File | null>(null);
	const [description, setDescription] = useState("");
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setIsAuthenticated(false);
			navigate("/login");
			return;
		}
		fetchPosts();
	}, [navigate, setIsAuthenticated]);

	console.log(file);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login");
	};

	const fetchPosts = async () => {
		try {
			const response = await axios.get<Post[]>("http://localhost:3000/posts", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			console.log("Posts response:", response.data);
			setPosts(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		setLoading(true);
		const formData = new FormData();
		formData.append("image", file);
		formData.append("description", description);

		try {
			await axios.post("http://localhost:3000/posts", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setFile(null);
			setDescription("");
			fetchPosts();
		} catch (error) {
			console.error("Error creating post:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold'>Dashboard</h1>
					<button
						onClick={handleLogout}
						className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
						Logout
					</button>
				</div>

				<form onSubmit={handleSubmit} className='mb-8 space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700'>Image</label>
						<input
							type='file'
							accept='image/*'
							onChange={(e) => setFile(e.target.files?.[0] || null)}
							className='mt-1 block w-full'
							required
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
							rows={3}
							required
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
						{loading ? "Uploading..." : "Upload"}
					</button>
				</form>

				<div className='space-y-6'>
					{posts.map((post) => (
						<div key={post.id} className='bg-white shadow rounded-lg p-6'>
							<img src={post.imageUrl} alt={post.description} className='w-full h-64 object-cover rounded-lg mb-4' />
							<p className='text-gray-700'>{post.description}</p>
							<p className='text-sm text-gray-500 mt-2'>{new Date(post.createdAt).toLocaleDateString()}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
