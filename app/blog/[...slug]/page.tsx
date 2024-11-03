import { posts } from "@/.velite/index";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import { Bebas_Neue } from "next/font/google";
import { Inter } from "next/font/google";
interface PostPageProps {
  params: {
    slug: string[];
  };
}
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
});
const interFont = Inter({
  weight: ['400'],
  subsets: ["latin"],
})
async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = posts.find((post) => post.slugAsParams === slug);
  return post;
}
export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return posts.map((post) => ({ slug: post.slugAsParams.split("/") }));
}
export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);
  if (!post || !post.published) {
    notFound();
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className={`${bebasNeue.className} pt-40 px-2`}>
      <h1 className={`${bebasNeue.className} text-3xl`}>
        {post.title}
      </h1>
      <p className="text-lg">{post.description}</p>
      </div>
      {/* <hr className="" /> */}
      <div className={`${interFont.className} px-2 pt-8 md:pt-15`}>
      <MDXContent code={post.body} />
      </div>
    </div>
  );
}