// src/build.ts
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

type Post = {
	title: string;
	description: string;
	slug: string;
	date: string;
	author: string;
	tags: string[];
	publish: boolean;
	content: string;
};
const config = {
	POSTS_DIR: path.join(process.cwd(), "posts"),
	DIST_DIR: path.join(process.cwd(), "dist"),
};

// Metodo de captura dos dados na pasta posts
async function getPosts() {
	const files = await fs.readdir(config.POSTS_DIR);

	const posts: Post[] = [];
	for (const filename of files) {
		if (!filename.endsWith(".md")) continue;
		const filePath = path.join(config.POSTS_DIR, filename);
		const fileContent = await fs.readFile(filePath, "utf-8");
		const { data, content } = matter(fileContent);
		if (!data.publish) continue;

		posts.push({
			title: data.title,
			description: data.description,
			slug: data.slug,
			date: data.date,
			author: data.author,
			tags: data.tags,
			publish: data.publish,
			content: content,
		});
	}
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function build() {
	try {
		const posts = await getPosts();

		// Cria diretório dist se não existir
		await fs.mkdir(config.DIST_DIR, { recursive: true });
		await fs.mkdir(path.join(config.DIST_DIR, "posts"), { recursive: true });

		// index
		await fs.writeFile(
			path.join(config.DIST_DIR, `index.json`),
			JSON.stringify(
				posts.map((post) => ({ ...post, content: undefined })),
				null,
				2
			)
		);

		// slugs - { slug: string }[]
		await fs.writeFile(
			path.join(config.DIST_DIR, `slugs.json`),
			JSON.stringify(
				posts.map(({ slug }) => ({ slug })),
				null,
				2
			)
		);

		// Cria arquivo para cada post
		for (const post of posts) {
			await fs.writeFile(
				path.join(config.DIST_DIR, "posts", `${post.slug}.json`),
				JSON.stringify(post, null, 2)
			);
		}

		console.log("Build completed successfully!");
	} catch (error) {
		console.error("Error during build:", error);
		process.exit(1);
	}
}

build();
