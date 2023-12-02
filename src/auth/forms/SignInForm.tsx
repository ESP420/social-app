
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast"
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { signInValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";




const SignInForm = () => {
    const { toast } = useToast()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    const { mutateAsync: signInAccount } = useSignInAccount(); /* isPending */

    const navegate = useNavigate()
    // 1. Define your form.
    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInValidation>) {
        try {

            const signInFail = () => {
                toast({
                    title: "Sign up failed. please try again.",
                });
            }
            const session = await signInAccount({ email: values.email, password: values.password })
            if (!session) {
                return signInFail()
            }
            const isLoggedIn = await checkAuthUser()
            if (isLoggedIn) {
                form.reset()
                navegate('/')
            } else {
                return signInFail()
            }
        } catch {
            console.warn
        }
    }

    return (

        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col px-4">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold py-2">
                    Log in to you account
                </h2>
                <p className="text-light-3 small-medium md:base-regular">welcome back!, please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full mt-4">

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password" type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />
                    <div className="py-2">
                        <Button type="submit" className="shad-button_primary w-full">
                            {isUserLoading ? (
                                <div className="flex-center gap-2"><Loader />Loading...</div>
                            ) : "Sign in"}
                        </Button>
                        <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account?
                            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Form>

    )
}
export default SignInForm;