import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
function About() {
  const features = [
    {
      title: "Expense Tracking",
      description: "Track your expenses easily and categorize them.",
    },
    {
      title: "Set Budgets",
      description: "Plan your budget and monitor your financial goals.",
    },
    {
      title: "Financial Reports",
      description: "Get insights into your spending habits.",
    },
  ];

  const steps = [
    {
      title: "Add Expenses",
      description: "Log your transactions quickly and efficiently.",
    },
    {
      title: "Set Budgets",
      description: "Allocate your budget for different categories.",
    },
    {
      title: "Analyze Spending",
      description: "Review detailed reports and optimize your finances.",
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      feedback: "This app has transformed my financial life!",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Jane Smith",
      feedback: "Simple, effective, and powerful!",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold">About ExpenseTracker</h1>
        <p className="text-gray-500 mt-2">Your Smart Finance Companion</p>
        <Button className="mt-4">Get Started for Free</Button>
      </section>

      {/* Features Section */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* How It Works */}
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-semibold">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
          {steps.map((step, index) => (
            <Card key={index} className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-semibold">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {testimonials.map((user, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500">"{user.feedback}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
