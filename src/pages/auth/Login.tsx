import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/schema/userForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/interface/userAuthInterface";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
// import { userStore } from "@/store/userStore";
import { getCookie } from "@/utils/authUtils";
// import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
// import { useAlertStore } from "@/store/alertStore";
function Login() {
  // const [switchAuth, setSwitchAuth] = useState(true);
  // const { showAlert } = useAlertStore.getState();
  const isAuthenticated = getCookie("expenses_token");
  const loginUser = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  // const { addUser } = userStore();
  const navigate = useNavigate();
  // const params = new URLSearchParams(window.location.search);
  // const verified = params.get("verified");

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login form submission
  const handleLogin = async (payload: User) => {
    loginUser(payload, () => {
      navigate("/");
    });
  };

  // useEffect(() => {
  //   if (verified === "success") {
  //     showAlert(
  //       "Verficication success. \n Please login.",
  //       "success",
  //       "Verified"
  //     );
  //   }
  // }, [verified, showAlert]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form key="login-form" {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Email"
                                {...field}
                                type="email"
                              />
                            </FormControl>
                            {form.formState.errors.email && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.email.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center ">
                              <FormLabel htmlFor="password">Password</FormLabel>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  {...field}
                                  className="pr-10" // space for icon
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-2 h-full flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800 hover:bg-transparent focus-visible:bg-transparent"
                                  tabIndex={-1}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            {form.formState.errors.password && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.password.message}
                              </p>
                            )}
                            <a
                              href="/forgot-password"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </a>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        Login with Google
                      </Button>
                    </div>
                  </div>

                  {/* <Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </Label>

              <Button type="submit" className="w-full mt-1">
                Login
              </Button> */}
                </form>
              </Form>
              <form>
                <div className="text-muted-foreground flex justify-center gap-1 text-sm mt-3">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="text-primary dark:text-foreground font-medium hover:underline"
                  >
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    // <div className="flex justify-center items-center min-h-screen p-6">
    //   <Card className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden">
    //     <div className="bg-gradient-to-br from-blue-300 to-indigo-600 text-white flex flex-col justify-center items-center p-8">
    //       <h2 className="text-3xl font-bold mb-4">
    //         {switchAuth ? "Welcome Back!" : "Join Us"}
    //       </h2>
    //       <p className="mb-6 text-center max-w-xs">
    //         {switchAuth
    //           ? "Log in to stay on top of your spending and make smarter financial decisions."
    //           : "Create an account to begin tracking your expenses and taking control of your finances."}
    //       </p>
    //       <Button
    //         variant="outline"
    //         className="text-secondary-foreground border-white hover:bg-white hover:text-blue-600"
    //         onClick={() => setSwitchAuth(!switchAuth)}
    //       >
    //         {switchAuth ? "Create an account" : "Have an account? Login"}
    //       </Button>
    //     </div>

    //     <CardContent className="p-8">
    //       <CardHeader className="text-center mb-4">
    //         <CardTitle className="text-2xl">
    //           {switchAuth ? "Login" : "Sign Up"}
    //         </CardTitle>
    //       </CardHeader>

    //       {switchAuth ? (

    //       ) : (
    //         <Form key="signup-form" {...signupForm}>
    //           <form
    //             onSubmit={signupForm.handleSubmit(handleSignup)}
    //             className="space-y-4"
    //           >
    //             <FormField
    //               control={signupForm.control}
    //               name="name"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Fullname</FormLabel>
    //                   <FormControl>
    //                     <Input placeholder="Fullname" {...field} type="text" />
    //                   </FormControl>
    //                 </FormItem>
    //               )}
    //             />
    //             <FormField
    //               control={signupForm.control}
    //               name="email"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Email</FormLabel>
    //                   <FormControl>
    //                     <Input placeholder="Email" {...field} />
    //                   </FormControl>
    //                   {signupForm.formState.errors.email && (
    //                     <p className="text-sm text-red-500 mt-1">
    //                       {signupForm.formState.errors.email.message}
    //                     </p>
    //                   )}
    //                 </FormItem>
    //               )}
    //             />
    //             <FormField
    //               control={signupForm.control}
    //               name="password"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Password</FormLabel>
    //                   <FormControl>
    //                     <div className="relative">
    //                       <Input
    //                         type={showPassword ? "text" : "password"}
    //                         placeholder="Password"
    //                         {...field}
    //                         className="pr-10" // space for icon
    //                       />
    //                       <Button
    //                         type="button"
    //                         size="icon"
    //                         variant="ghost"
    //                         onClick={() => setShowPassword(!showPassword)}
    //                         className="absolute inset-y-0 right-2 h-full flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800 hover:bg-transparent focus-visible:bg-transparent"
    //                         tabIndex={-1}
    //                       >
    //                         {showPassword ? (
    //                           <EyeOff className="h-5 w-5" />
    //                         ) : (
    //                           <Eye className="h-5 w-5" />
    //                         )}
    //                       </Button>
    //                     </div>
    //                   </FormControl>
    //                   {form.formState.errors.password && (
    //                     <p className="text-sm text-red-500 mt-1">
    //                       {form.formState.errors.password.message}
    //                     </p>
    //                   )}
    //                 </FormItem>
    //               )}
    //             />

    //             <FormField
    //               control={signupForm.control}
    //               name="confirmPassword"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Confirm Password</FormLabel>
    //                   <FormControl>
    //                     <div className="relative">
    //                       <Input
    //                         type={showPassword ? "text" : "password"}
    //                         placeholder="Confirm Password"
    //                         {...field}
    //                         className="pr-10" // space for icon
    //                       />
    //                       <Button
    //                         type="button"
    //                         size="icon"
    //                         variant="ghost"
    //                         onClick={() => setShowPassword(!showPassword)}
    //                         className="absolute inset-y-0 right-2 h-full flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-800 hover:bg-transparent focus-visible:bg-transparent"
    //                         tabIndex={-1}
    //                       >
    //                         {showPassword ? (
    //                           <EyeOff className="h-5 w-5" />
    //                         ) : (
    //                           <Eye className="h-5 w-5" />
    //                         )}
    //                       </Button>
    //                     </div>
    //                   </FormControl>
    //                   {form.formState.errors.password && (
    //                     <p className="text-sm text-red-500 mt-1">
    //                       {form.formState.errors.password.message}
    //                     </p>
    //                   )}
    //                 </FormItem>
    //               )}
    //             />
    //             <Button type="submit" className="w-full">
    //               Signup
    //             </Button>
    //           </form>
    //         </Form>
    //       )}
    //     </CardContent>
    //   </Card>
    // </div>
  );
}

export default Login;
