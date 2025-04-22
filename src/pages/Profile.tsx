import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, setUser, fecthUser } = userStore();
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    fecthUser();
  }, [fecthUser]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Profile Header */}
      <section className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://via.placeholder.com/150" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-400 text-sm">Joined: January 2023</p>
        </div>
      </section>

      {/* Profile Details */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={user.name}
                  onChange={(e) => setUser({ name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={user.email}
                  onChange={(e) => setUser({ email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>

                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value="0953678251"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter your address" />
              </div>
              {/* <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div className="col-span-2 flex justify-end">
                {edit ? (
                  <Button type="submit">Save Changes</Button>
                ) : (
                  <Button
                    type="button"
                    className="px-9 cursor-pointer"
                    variant={"secondary"}
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
