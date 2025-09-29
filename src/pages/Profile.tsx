import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen, BadgeCheck } from "lucide-react";

import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Profile() {
  const { user, setUser, fecthUser, updateUser } = userStore();
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    fecthUser();
  }, [fecthUser]);

  return (
    <div className="min-h-screen  flex flex-col items-center py-12 px-4 transition-colors duration-300">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar className="w-28 h-28 border border-foreground">
            <AvatarImage src="https://via.placeholder.com/150" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <Button
            type="button"
            className="absolute bottom-0 right-0 border border-foreground  rounded shadow  transition"
            variant={"secondary"}
            size={"sm"}
          >
            <Pen size={15} /> Edit
          </Button>
        </div>
        <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100">
          {user.name}
        </h1>
        <div className="flex ">
          <Label className="  text-gray-500 dark:text-gray-400">
            {user.email}
          </Label>
          <BadgeCheck className=" text-chart-2 " size={15} />
        </div>

        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Joined{" "}
          {user.createdAt ? format(String(user.createdAt), "LLLL dd, y") : ""}
        </p>
      </div>

      {/* Profile Form Card */}
      <Card className="bg-white dark:bg-background border border-foreground rounded-2xl p-6 w-full max-w-4xl   transition-colors duration-300">
        <CardTitle className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Profile Information
        </CardTitle>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </Label>
            <Input
              type="text"
              disabled={!edit}
              value={user.name}
              onChange={(e) => setUser({ name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </Label>
            <Input
              type="email"
              disabled={!edit}
              value={user.email}
              onChange={(e) => setUser({ email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </Label>
            <Input
              type="tel"
              defaultValue="0953678251"
              value={user.phone_number}
              onChange={(e) => setUser({ phone_number: e.target.value })}
              disabled={!edit}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Address */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </Label>
            <Input
              type="text"
              placeholder="Enter your address"
              onChange={(e) => setUser({ address: e.target.value })}
              value={user.address}
              disabled={!edit}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </CardContent>

        {/* Save/Edit Button */}
        <div className="flex justify-end mt-6">
          {edit ? (
            <div className="flex gap-2">
              <Button
                type="button"
                className="px-9 cursor-pointer"
                variant={"destructive"}
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  updateUser(user);
                  setEdit(false);
                }}
              >
                Save Changes
              </Button>
            </div>
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
      </Card>
    </div>
  );
}
