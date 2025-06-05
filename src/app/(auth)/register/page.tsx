"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password & confirm Password do not match.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
        username,
      });

      const data = res.data;
    console.log(data);
      if (res.status != 200) {
        toast.error("Registration failed.");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.log("User Registration Error: ", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="text"
                  type="text"
                  placeholder="enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  value={password}
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  value={confirmPassword}
                  id="confirm password"
                  type="password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            <Button type="submit" className="w-full text-[#cacaca]">
              Register
            </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="">Already have an account? </div>
          <Button variant="outline" className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
