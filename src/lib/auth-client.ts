import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { toast } from "sonner";
import { adminClient } from "better-auth/client/plugins"

export const client =  createAuthClient({
    //you can pass client configuration here
    baseURL: process.env.BETTER_AUTH_URL || "",
    plugins: [
        adminClient()
    ],
    fetchOptions: {
        onError(e) {
            if(e.error.status === 401) {
                toast.error("Too many requests. Please try again later.")
            }
        }
    },

})
export const { signIn, signUp, signOut, useSession } = client;