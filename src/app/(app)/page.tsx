'use client'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon } from "lucide-react";
import messages from "@/messages.json"

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold mb-8 mt-12">
          Welcome to NO-CAP Messages
        </h1>
        <h2 className="text-2xl ">
          Send messages anonymously
        </h2>
        <Carousel className="w-full max-w-xl"
          opts={{
            align: "start",
            loop: true
          }}
          plugins={[
            Autoplay({
              delay: 2000
            })
          ]}>
          <CarouselContent className="p-10">

            {
              messages.map((message, index) => (
                <CarouselItem key={index} >
                  <Card className="bg-slate-100">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                      <div className="flex items-center ">
                        <div><MailIcon /></div>
                        <div className="flex items-center">
                          <CardContent className="py-0"> {message.content}
                            <CardDescription>{message.recieved}</CardDescription>
                          </CardContent>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CarouselItem>)
              )}

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <footer className="bg-slate-900 text-white text-center py-2 absolute bottom-0 w-full">
        &copy; 2024 NO-CAP Messages. All rights reserved
      </footer>
    </>
  );
}
