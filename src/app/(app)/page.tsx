'use client'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold mb-8 mt-12">
        Welcome to NO-CAP Messages
      </h1>
      <h2 className="text-2xl ">
        Send messages anonymously
      </h2>
      <Carousel className="w-full max-w-xs"
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
          <CarouselItem>

            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>

          </CarouselItem>
          <CarouselItem><div className="text-center">Rahul</div></CarouselItem>
          <CarouselItem><div className="text-center">das</div></CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>


    </div>
  );
}
