import { posts } from "@/.velite/index";
import { sortPosts } from "@/lib/utils";
import { PostItem } from "@/components/post-item";
import { Bebas_Neue } from "next/font/google";
import { WavyBackground } from "@/components/ui/wavy-background";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ['400'],
});

const BlogPage = () => {
  const sortedPosts = sortPosts(posts.filter((post) => post.published));
  const displayPosts = sortedPosts;

  return (
    <div className={`${bebasNeue.className} h-max`}>
    <WavyBackground className="pb-32"/>
      <div>
        <div className="px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold mt-14 drop-shadow-lg text-left relative">
            Blogs
          </h1>

          <p className="text-xl opacity-90 relative">
            Sharing knowledge, inspiring innovation, and connecting developers
          </p>
        </div>
      </div>

      <div className="px-4 py-12 relative">
      {displayPosts?.length > 0 ? (
        <ul className="flex flex-col">
          {displayPosts.map((post) => {
            const { slug, date, title, description } = post;
            return (
              <li key={slug}>
                <PostItem
                  slug={slug}
                  date={date}
                  title={title}
                  description={description}
                />
              </li>
            );
          })}
        </ul>
      ) : (
          <div className="text-center py-16 rounded-lg">
            <div className="mb-6">
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Posts Yet
            </h2>
            <p className="text-gray-500">
              Stay tuned! Our developers are crafting amazing content.
            </p>
          </div>
        )}
      </div>

      <div className="py-16 flex justify-center items-center">
        <div className="px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Join Our Developer Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect, learn, and grow with fellow developers. Share your insights, 
            ask questions, and be part of something bigger.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/user/login" 
              className="bg-blue-600 text-black px-6 py-3 rounded-full transition-colors hover:bg-transparent"
            >
              Join Community
            </a>
            <a 
              href="/" 
              className="border px-6 py-3 rounded-full"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;