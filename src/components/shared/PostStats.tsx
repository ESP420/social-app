
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutation'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import react, { useEffect, useState } from 'react'
import Loader from './Loader'

type PostStatsProps = {
    post: Models.Document,
    userId: string
}

const PostStats = ({ post,
    userId }: PostStatsProps) => {
    const { data: currentUser, isPending: userDataPending } = useGetCurrentUser()

    const likeList = post.Likes.map((user: Models.Document) => user.$id)
    const [likes, setLikes] = useState(likeList)
    const [isSaved, setIsSaved] = useState(false)

    const { mutate: likePost, isPending: likePostPending } = useLikePost();
    const { mutate: savePost, isPending: savePostPending } = useSavePost();
    const { mutate: deleteSavedPost, isPending: deleteSavedPending } = useDeleteSavedPost();
    const savePostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)

    useEffect(() => {
        setIsSaved(!!savePostRecord)
    }, [currentUser])

    const handleLikePost = async (e: react.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = checkIsLiked(newLikes, userId);
        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
            setLikes(newLikes)
        } else {
            newLikes = [...newLikes, userId]
            setLikes(newLikes)
            likePost({ postId: post.$id, likeArray: newLikes })
        }
    }

    const handleSavePost = (e: react.MouseEvent) => {
        e.stopPropagation();

        if (savePostRecord) {
            setIsSaved(false);
            deleteSavedPost({ saveRecordId: savePostRecord.$id });
        } else {
            savePost({ postId: post.$id, userId })
            setIsSaved(true);
        }
    }
    return (
        <div className='flex justify-between items-center z-20 pt-3'>
            <div className='flex gap-2 mr-5'>
                {likePostPending ? <Loader /> : <img src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"} alt="like"
                    width={20} height={20} onClick={handleLikePost}
                    className='cursor-pointer' />}
                <p className='small-media lg:base-media'>{likes.length}</p>
            </div>
            <div className='flex gap-2 mr-5'>
                {savePostPending ||
                    deleteSavedPending || userDataPending ? <Loader /> : <img src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} alt="save"
                        width={20} height={20} onClick={handleSavePost}
                        className='cursor-pointer' />}
            </div>
        </div>

    )
}

export default PostStats

