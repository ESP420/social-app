
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
import { signUpValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";




const SignUpForm = () => {
    const { toast } = useToast()
    const { checkAuthUser } = useUserContext();/*  isLoading: isUserLoading  */
    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount } = useSignInAccount();/*  isPending: isSignInUser */

    const navegate = useNavigate()
    // 1. Define your form.
    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            name: "",
            username: "",
            email: '',
            password: ''
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpValidation>) {
        try {
            const newUser = await createUserAccount(values);
            const signInFail = () => {
                toast({
                    title: "Sign up failed. please try again.",
                });
            }
            if (!newUser) {
                return signInFail()
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
                    Create new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular">to use Social app, please enter your details</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name"
                                        type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="usrname"
                                        type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />
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
                            {isCreatingAccount ? (
                                <div className="flex-center gap-2"><Loader />Loading...</div>
                            ) : "Sign up"}
                        </Button>
                        <p className="text-small-regular text-light-2 text-center mt-2">Already have an account?
                            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Form>

    )
}
export default SignUpForm;