/*
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Server,
  Container,
  Terminal,
  FolderTree,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:px-6 flex h-14 items-center justify-between">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">ServerPilot</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="w-full space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 flex flex-col items-center text-center">
          <div className="w-full max-w-5xl px-4 md:px-6">
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Manage your infrastructure with ease
            </h1>
            <p className="max-w-3xl mx-auto leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Monitor servers, manage Docker containers, and access remote
              systems—all from one unified dashboard.
            </p>
            <div className="space-x-4 mt-6">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">Documentation</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full space-y-6 py-8 md:py-12 lg:py-24 px-4 md:px-6">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Server Monitoring",
                description:
                  "Real-time metrics, process management, and uptime monitoring for all your servers.",
                icon: <Server className="h-6 w-6 text-primary" />,
              },
              {
                title: "Docker Management",
                description:
                  "Manage containers, images, and Docker Compose deployments with ease.",
                icon: <Container className="h-6 w-6 text-primary" />,
              },
              {
                title: "Web Terminal",
                description:
                  "Access your servers securely through our browser-based SSH terminal.",
                icon: <Terminal className="h-6 w-6 text-primary" />,
              },
              {
                title: "FTP Client",
                description:
                  "Browse and manage files across your servers with our built-in FTP client.",
                icon: <FolderTree className="h-6 w-6 text-primary" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border bg-background p-4 w-full"
              >
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {feature.icon}
                      <h3 className="font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ServerPilot. The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
*/