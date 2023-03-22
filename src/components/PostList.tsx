"use client";
import { Post } from "@/lib/server/schemas/Post";
import { Tag } from "@/lib/server/schemas/Tag";
import { throwOnResponseError } from "@/lib/utils/throwOnResponseError";
import { EllipsisVerticalIcon, InboxIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import Chip, { ChipProps } from "./Chip";
import LoadingSpinner from "./loading/LoadingSpinner";
import MenuButton from "./MenuButton";
import TimeAgo from "./TimeAgo";
import { MdEdit, MdDelete } from "react-icons/md";

export interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts: initialPosts }: PostListProps) {
  // TODO: When deleting a post we can clear this list,
  // so we can reflect the changes on the client immediately
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = (postId: string) => {
    const newPosts = posts.filter((post) => post.id !== postId);
    setPosts(newPosts);
  };

  return (
    <>
      {posts.length === 0 && (
        <div className="my-4 flex flex-col items-center justify-center gap-2 p-4 opacity-30">
          <InboxIcon className="h-12 w-12" />
          <span className="text-2xl">No posts were found</span>
        </div>
      )}

      {
        <>
          {posts.map((post) => {
            return (
              <PostListItem
                post={post}
                key={post.id}
                onDelete={() => handleDelete(post.id)}
              />
            );
          })}

          <div className="h-8"></div>
        </>
      }
    </>
  );
}

interface PostListItemProps {
  post: Post;
  onDelete: () => void;
}

function PostListItem({ post, onDelete }: PostListItemProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deletePost = useMutation(async () => {
    handleClose();

    // TODO: Add a custom dialog instead
    const canDelete = confirm("Delete this post?");
    if (canDelete != true) {
      return;
    }

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    await throwOnResponseError(res);

    await queryClient.invalidateQueries({
      queryKey: ["posts"],
      exact: false,
    });
    router.refresh();
    onDelete();
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Link href={`/posts/${post.slug}`}>
        <div
          className={`my-3 rounded-xl bg-base-600 px-6 py-4 
          shadow-md shadow-black/50 ring-2 ring-base-300/40 transition duration-300
          hover:bg-base-700 ${deletePost.isLoading ? "animate-pulse" : ""}`}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex w-full flex-col overflow-hidden">
              <TimeAgo date={new Date(post.updatedAt ?? post.createdAt)} />

              <div className="flex max-w-full flex-row items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
                {deletePost.isLoading && (
                  <LoadingSpinner size={20} color="rgba(255, 255, 255, 0.2)" />
                )}
                <span>{post.title}</span>
              </div>
              {post.tags && (
                <div className="mt-2">
                  <PostChipList tags={post.tags} />
                </div>
              )}
            </div>

            <PostListButtonMenu
              open={open}
              post={post}
              onOpen={handleOpen}
              onClose={handleClose}
              onDelete={() => deletePost.mutate()}
            />
          </div>
        </div>
      </Link>
    </>
  );
}

interface PostChipListProps {
  tags: Tag[];
}

function PostChipList(props: PostChipListProps) {
  const MAX_CHIPS = 8;
  let { tags } = props;
  const hasOverflow = tags.length > MAX_CHIPS;
  tags = tags.slice(0, MAX_CHIPS);

  return (
    <div className="flex flex-row flex-wrap gap-1">
      {tags.map((tag) => (
        <PostChip key={tag.id} value={tag.name} />
      ))}

      {hasOverflow && <PostChip value="..." className="px-5" />}
    </div>
  );
}

const PostChip: React.FC<ChipProps> = (props) => {
  return <Chip {...props} className="bg-black text-[#f8f8f2]" />;
};

interface PostListButtonMenuProps {
  post: Post;
  open: boolean;
  onDelete: () => void;
  onOpen: () => void;
  onClose: () => void;
}

function PostListButtonMenu({
  open,
  onOpen,
  onClose,
  post,
  onDelete,
}: PostListButtonMenuProps) {
  const router = useRouter();

  return (
    <MenuButton onClose={onClose} onClick={onOpen} open={open}>
      <EllipsisVerticalIcon className="h-8 w-8 p-1 text-white hover:rounded-full hover:bg-base-400/30" />

      <MenuButton.List className="absolute min-w-[150px] rounded-md bg-white p-1 shadow-lg">
        <MenuButton.Item
          className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg hover:bg-base-100"
          onClick={() => router.push(`/posts/edit/${post.slug}`)}
        >
          <MdEdit size={28} className="text-base-400" />
          Edit
        </MenuButton.Item>
        <MenuButton.Item
          className="flex cursor-pointer flex-row items-center gap-2 px-4 py-2 text-black hover:rounded-lg hover:bg-base-100"
          onClick={onDelete}
        >
          <MdDelete size={28} className="text-base-400" />
          Delete
        </MenuButton.Item>
      </MenuButton.List>
    </MenuButton>
  );
}
