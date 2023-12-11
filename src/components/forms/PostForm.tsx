import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import FileUploader from '../shared/FileUploader';
import { PostValidation } from '@/lib/validation';
import { Models } from 'appwrite';
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutation';
import { useUserContext } from '@/context/AuthContext';
import Loader from '../shared/Loader';

type PostFormProps = {
    post?: Models.Document
    action: 'Create' | 'Update'
}
const PostForm = ({ post, action }: PostFormProps) => {
    console.log(post?.imageUrl)
    const { user } = useUserContext();
    const navigate = useNavigate()
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            if (post && action == 'Update') {
                const updatedPost = await updatePost({
                    ...values,
                    postId: post.$id,
                    imageId: post?.imageId,
                    imageUrl: post?.imageUrl
                })
                if (!updatedPost) {
                    return toast({
                        title: "Please try again.",
                    });
                }

                navigate(`/post/${post.$id}`)
            } else {
                const newPost = await createPost({
                    ...values,
                    userId: user?.id || ''
                });
                if (!newPost) {
                    return toast({
                        title: "Please try again.",
                    });

                    navigate('/')
                }
            }

        } catch (error) {
            console.warn(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Caption</FormLabel>
                            <FormControl>
                                <Textarea className='shad-textarea custom-scrollbar' placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add photos</FormLabel>
                            <FormControl>
                                <FileUploader fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add location</FormLabel>
                            <FormControl>
                                <Input type="text" className='shad-input' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Tags(separated by comma " , ")</FormLabel>
                            <FormControl>
                                <Input type="text" className='shad-input'
                                    placeholder='JS,React,NextJs' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <Button type="button"
                    className='shad-button_dark_4'>Cancel</Button>
                <Button type="submit" disabled={isLoadingCreate || isLoadingUpdate} className='shad-button_primary whitespace-nowrap'>
                    {isLoadingCreate || isLoadingUpdate ? (
                        <div className="flex-center gap-2"><Loader />Loading...</div>
                    ) : `${action} post`}
                </Button>
            </form>
        </Form>
    );
}
export default PostForm