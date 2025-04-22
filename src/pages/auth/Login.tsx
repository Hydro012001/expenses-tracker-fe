import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, userFormSchema } from "@/schema/userForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/interface/userInterface";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { userStore } from "@/store/userStore";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const loginUser = useAuthStore((state) => state.login);
  const { addUser } = userStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const handleLogin = async (payload: User) => {
    loginUser(payload, () => {
      navigate("/");
    });
  };

  // Handle signup form submission
  const handleSignup = async (payload: User) => {
    addUser(payload);
    setIsLogin(true);
  };

  // useEffect(() => {
  //   if (isLogin) {
  //     form.reset({
  //       email: "",
  //       password: "",
  //     });
  //   } else {
  //     signupForm.reset({
  //       email: "",
  //       password: "",
  //       name: "",
  //       confirmPassword: "",
  //     });
  //   }
  // }, [isLogin, form, signupForm]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-300 to-indigo-600 text-white flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Join Us"}
          </h2>
          <p className="mb-6 text-center max-w-xs">
            {isLogin
              ? "Log in to stay on top of your spending and make smarter financial decisions."
              : "Create an account to begin tracking your expenses and taking control of your finances."}
          </p>
          <Button
            variant="outline"
            className="text-secondary-foreground border-white hover:bg-white hover:text-blue-600"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create an account" : "Have an account? Login"}
          </Button>
        </div>

        <CardContent className="p-8">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl">
              {isLogin ? "Login" : "Sign Up"}
            </CardTitle>
          </CardHeader>

          {isLogin ? (
            <Form key="login-form" {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type="email" />
                      </FormControl>
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
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
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          ) : (
            <Form key="signup-form" {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fullname</FormLabel>
                      <FormControl>
                        <Input placeholder="Fullname" {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
