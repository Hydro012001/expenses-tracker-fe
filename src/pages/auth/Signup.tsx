import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpFormSchema } from "@/schema/userForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "@/interface/userAuthInterface";
import { userStore } from "@/store/userStore";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { addUser } = userStore();
  const isAuthenticated = getCookie("token");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const signupForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Handle signup form submission
  const handleSignup = async (payload: User) => {
    addUser(payload);
    // navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/#/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>
                Enter your email to start tracking your expenses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form key="signup-form" {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(handleSignup)}
                  className="space-y-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        {signupForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {signupForm.formState.errors.email.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
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
                        {signupForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {signupForm.formState.errors.password.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm Password"
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
                        {signupForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {signupForm.formState.errors.password.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !signupForm.formState.isValid ||
                      signupForm.formState.isSubmitting
                    }
                  >
                    Create Account
                  </Button>
                </form>
              </Form>
              <div className="text-muted-foreground flex justify-center gap-1 text-sm mt-3">
                <p>Already a user?</p>
                <a
                  href="/#/login"
                  className="text-primary dark:text-foreground font-medium hover:underline"
                >
                  Login
                </a>
              </div>
            </CardContent>
            {/* <CardContent>
              <div className="flex flex-col items-center gap-6 lg:justify-start">
                <div className="min-w-sm  flex w-full max-w-sm flex-col items-center gap-y-4 px-6 ">
                  <div className="flex w-full flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="text-sm"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </div>
              </div>
              <div className="text-muted-foreground flex justify-center gap-1 text-sm mt-3">
                <p>Already a user?</p>
                <a
                  href="/login"
                  className="text-background dark:text-foreground font-medium hover:underline"
                >
                  Login
                </a>
              </div>
            </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
