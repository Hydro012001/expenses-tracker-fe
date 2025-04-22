import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // ✅ Corrected import

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userFormSchema } from "@/schema/userForm";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/interface/userInterface";
import { useNavigate } from "react-router-dom";

function Login() {
  const loginUser = useAuthStore((state) => state.login); // ✅ Zustand selector
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (payload: User) => {
    console.log("Payload", payload);
    loginUser(payload, () => {
      navigate("/");
    });
  };

  return (
    <div className="flex  justify-center p-3">
      <Card className="w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
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
                      <Input placeholder="Email" {...field} />
                    </FormControl>
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
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>{" "}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
