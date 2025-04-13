/*
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Book,
  Server,
  Container,
  Terminal,
  Users,
  Settings,
} from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description:
        "Learn the basics of ServerPilot and set up your first server.",
      icon: Book,
      href: "/docs/getting-started",
    },
    {
      title: "Server Management",
      description: "Monitor and manage your servers effectively.",
      icon: Server,
      href: "/docs/servers",
    },
    {
      title: "Container Management",
      description: "Work with Docker containers and images.",
      icon: Container,
      href: "/docs/containers",
    },
    {
      title: "SSH Terminal",
      description: "Use the web-based SSH terminal for remote access.",
      icon: Terminal,
      href: "/docs/terminal",
    },
    {
      title: "Settings & Configuration",
      description: "Configure ServerPilot according to your needs.",
      icon: Settings,
      href: "/docs/settings",
    },
  ];

  return (
    <div className="max-w-4xl py-6 lg:py-10 px-4 md:px-6 mx-auto">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about using ServerPilot.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Icon className="h-8 w-8" />
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <Button
                  variant="ghost"
                  className="mt-auto justify-start"
                  asChild
                >
                  <a href={section.href}>Learn more</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
*/