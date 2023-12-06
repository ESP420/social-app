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
import { useCreatePost } from '@/lib/react-query/queriesAndMutation';
import { useUserContext } from '@/context/AuthContext';
import Loader from '../shared/Loader';

type PostFormProps = {
    post?: Models.Document
}
const PostForm = ({ post }: PostFormProps) => {
    const { user } = useUserContext();
    const navigate = useNavigate()
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.caption : '',
            tags: post ? post?.tags.join(',') : '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            const newPost = await createPost({
                ...values,
                userId: user?.id || ''
            });
            if (!newPost) {
                return toast({
                    title: "Please try again.",
                });
            }
            navigate('/')

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
                                    mediaUrl={post?.imageURL} />
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
                <Button type="submit" className='shad-button_primary whitespace-nowrap'>
                    {isLoadingCreate ? (
                        <div className="flex-center gap-2"><Loader />Loading...</div>
                    ) : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
export default PostForm