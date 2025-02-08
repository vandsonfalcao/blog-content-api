// src/build.ts
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const config = {
	POSTS_PER_PAGE: 10,
	POSTS_DIR: path.join(process.cwd(), "src", "posts"),
	DIST_DIR: path.join(process.cwd(), "dist"),
};

async function getPosts() {
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

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function build() {
	try {
		const posts = await getPosts();

		// Cria diretório dist se não existir
		await fs.mkdir(config.DIST_DIR, { recursive: true });
		await fs.mkdir(path.join(config.DIST_DIR, "posts"), { recursive: true });
		await fs.mkdir(path.join(config.DIST_DIR, "slugs"), { recursive: true });

		// Cria arquivo para cada post
		for (const post of posts) {
			await fs.writeFile(
				path.join(config.DIST_DIR, "posts", `${post.slug}.json`),
				JSON.stringify(post, null, 2)
			);
		}

		// Cria arquivos de listagem paginada
		const totalPages = Math.ceil(posts.length / config.POSTS_PER_PAGE);

		for (let page = 1; page <= totalPages; page++) {
			const startIndex = (page - 1) * config.POSTS_PER_PAGE;
			const endIndex = page * config.POSTS_PER_PAGE;
			const paginatedPosts = posts.slice(startIndex, endIndex);

			await fs.writeFile(
				path.join(config.DIST_DIR, `page-${page}.json`),
				JSON.stringify(
					{
						posts: paginatedPosts.map(({ slug, title, date }) => ({
							slug,
							title,
							date,
						})),
						pagination: {
							currentPage: page,
							totalPages,
							totalPosts: posts.length,
							hasNextPage: endIndex < posts.length,
							hasPrevPage: startIndex > 0,
						},
					},
					null,
					2
				)
			);
		}

		// Criando gerador de slug
		await fs.writeFile(
			path.join(config.DIST_DIR, `slugs`, `posts.json`),
			JSON.stringify(
				posts.map(({ slug }) => ({ slug })),
				null,
				2
			)
		);

		// Cria index.json com primeira página
		await fs.copyFile(
			path.join(config.DIST_DIR, "page-1.json"),
			path.join(config.DIST_DIR, "index.json"),
		);

		console.log("Build completed successfully!");
	} catch (error) {
		console.error("Error during build:", error);
		process.exit(1);
	}
}

build();
