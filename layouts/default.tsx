import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/react";
import { Head } from "./head";
import { DevContact } from '@/components/DevContact';
export default function DefaultLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head title={title} description={description} />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full  flex flex-col items-center  justify-center p-3  lg:flex-row">
        <p className="text-tiny break-words m-4 justify-start " > Si luego de 2 semanas no hemos respondido su queja o quiere hablar por descuentos al mayorista , comunicarse al <Link href="https://api.whatsapp.com/send?phone=2966254545&text=Buenas tardes, deseo hablar sobre una queja/descuento mayorista" className="text-tiny"> 2966254545</Link> </p>
        <DevContact/>
      </footer>
    </div>
  );
}
