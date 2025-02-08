import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const config = {
	PORT: 3334,
	POSTS_PER_PAGE: 10,
	POSTS_DIR: path.join(process.cwd(), "src", "posts"),
};

const app = express();
app.use(express.json());

// Interface para tipagem dos posts
interface Post {
	slug: string;
	title: string;
	date: string;
	content: string;
	[key: string]: string;
}

// Função auxiliar para ler todos os posts
async function getPosts(): Promise<Post[]> {
	const files = await fs.readdir(config.POSTS_DIR);

	const posts = await Promise.all(
		files
			.filter((file) => file.endsWith(".md"))
			.map(async (filename) => {
				const filePath = path.join(config.POSTS_DIR, filename);
				const fileContent = await fs.readFile(filePath, "utf-8");
				const { data, content } = matter(fileContent);

				return {
					slug: filename.replace(".md", ""),
					title: data.title || "",
					date: data.date || "",
					content,
					...data,
				};
			})
	);

	// Ordena posts por data, mais recentes primeiro
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

app.get("/", (_: Request, res: Response) => {
	res.status(200).json({ status: "API rodando com sucesso!" });
});
// Rota para listar posts com paginação
app.get("/slugs/posts", async (req: Request, res: Response) => {
	try {
		const posts = await getPosts();

		const response = posts.map((post) => ({
			slug: post.slug,
		}));

		res.status(200).json(response);
	} catch (error) {
		console.error("Erro ao listar posts:", error);
		res.status(500).json({ error: "Erro interno ao obter os slugs" });
	}
});

// Rota para listar posts com paginação
app.get("/posts", async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || config.POSTS_PER_PAGE;

		const posts = await getPosts();

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const paginatedPosts = posts.slice(startIndex, endIndex);

		const response = {
			posts: paginatedPosts.map((post) => ({
				slug: post.slug,
				title: post.title,
				date: post.date,
			})),
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(posts.length / limit),
				totalPosts: posts.length,
				hasNextPage: endIndex < posts.length,
				hasPrevPage: startIndex > 0,
			},
		};

		res.status(200).json(response);
	} catch (error) {
		console.error("Erro ao listar posts:", error);
		res.status(500).json({ error: "Erro interno ao listar posts" });
	}
});

// Rota para obter um post específico
app.get("/posts/:slug", async (req: Request, res: Response) => {
	try {
		const { slug } = req.params;
		const posts = await getPosts();

		const post = posts.find((post) => post.slug === slug);

		if (!post) {
			return res.status(404).json({ error: "Post não encontrado" });
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Erro ao buscar post:", error);
		res.status(500).json({ error: "Erro interno ao buscar post" });
	}
});

app.listen(config.PORT, () => {
	console.info(`> Server is Running...\nhttp://localhost:${config.PORT}`);
});
