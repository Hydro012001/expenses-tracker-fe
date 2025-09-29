import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { useAuthStore } from "@/store/authStore";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false); // ✅ NEW STATE
  const params = new URLSearchParams(window.location.search);
  const verified_token = params.get("token");
  const { verify } = useAuthStore();

  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const handleCountDown = (redirectPath = "/login", startSeconds = 5) => {
    setCountdown(startSeconds);
    let seconds = startSeconds;

    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      navigate(redirectPath);
    }, startSeconds * 1000);
  };

  const handleVerify = async () => {
    setLoading(true);

    if (!verified_token) {
      setInvalidToken(true);
      setLoading(false);
      // showAlert("There is no token", "info", "Invalid Token");
      handleCountDown("/login");
    } else {
      const is_verified = await verify(verified_token);

      if (is_verified) {
        setVerified(true);
        setLoading(false);
        handleCountDown("/login");
      } else {
        setInvalidToken(true);
        setLoading(false);
        // showAlert("Invalid token", "info", "Invalid Token");
        handleCountDown("/login");
      }
    }
  };

  // useEffect(() => {
  //   if (!verified_token) {
  //     setInvalidToken(true);
  //     showAlert("There is no token", "info", "Invalid Token");
  //     navigate("/login");
  //   }
  // }, [verified_token, navigate, showAlert]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Verify Your Account
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            {invalidToken
              ? "This verification link is invalid or expired."
              : "Click the button below to complete verification."}
          </p>
        </CardHeader>

        <CardContent className="flex items-center justify-center">
          {verified ? (
            <div className="flex flex-col items-center gap-2 text-green-600">
              <CheckCircle className="w-12 h-12" />
              <p className="font-medium">You are verified!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting back to login in{" "}
                <span className="font-bold">{countdown}</span> sec...
              </p>
            </div>
          ) : invalidToken ? (
            <div className="flex flex-col items-center gap-2 text-red-600">
              <XCircle className="w-12 h-12" />
              <p className="font-medium">Invalid or expired token</p>
              <p className="text-sm text-muted-foreground">
                Redirecting back to login in{" "}
                <span className="font-bold">{countdown}</span> sec...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Press the button to verify your account.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {!verified && !invalidToken && (
            <Button onClick={handleVerify} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verify Now"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
