import {
  Button,
  Kbd,
  Link,
  Input,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Badge,
} from "@nextui-org/react";

/* import { link as linkStyles } from "@nextui-org/theme"; */

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { useCart } from "../config/CartContext";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  CartIcon,
} from "@/components/icons";


import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";

export const Navbar = () => {
  const { theme } = useTheme(); // Get the current theme
  const { cart } = useCart();
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <NextUINavbar maxWidth="xl" position="sticky" isBordered={true}  >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}

            <motion.div
              className="w-14 h-14 rounded-xl flex justify-center bg-white overflow-hidden my-8"
              initial={{ scale: 1 }}
              whileHover={{
                scale: [1, 0.8, 1],
                transition: {
                  duration: 1.3,
                  repeat: Infinity,
                  repeatType: "loop",
                },
              }}
            >
              <Image
                src={"/innova-black-vert.svg"}
                alt="Logo"
                width={48}
                height={48} // Adjust size as needed
                className="object-contain"
              />
            </motion.div>
          </NextLink>
        </NavbarBrand>

        <div className="hidden md:flex gap-4 justify-start ml-1 mt-4">
          <NextLink href="/" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={`hover:text-blue-500 cursor-pointer ${
                currentPath === "/" ? "text-blue-700" : ""
              }`}
            >
              Mis productos
            </motion.a>
          </NextLink>
          <NextLink href="/complaint" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={`hover:text-blue-500 cursor-pointer ${
                currentPath === "/complaint" ? "text-blue-700" : ""
              }`}
            >
              Atencion al cliente
            </motion.a>
          </NextLink>
          <NextLink href="/cart" legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={`relative hover:text-blue-500 cursor-pointer ${
                currentPath === "/cart" ? "text-blue-700" : ""
              }`}
            >
              <Badge content={cart.length} color="primary" size="sm" className="p-2" isInvisible={cart.length === 0} >
                <CartIcon />
              </Badge>
            </motion.a>
          </NextLink>
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <ThemeSwitch />
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
      <div className="mx-4 mt-2 flex flex-col gap-2">
      {siteConfig.navMenuItems.map((item, index) => (
        <NavbarMenuItem key={`${item.label}-${index}`}>
          <NextLink href={item.href} legacyBehavior>
            {index === 2 ? (
              <Badge
                content={cart.length}
                color="primary"
                placement="bottom-right"
                size="sm"
                isInvisible={cart.length === 0}
              >
                <Link
                  size="lg"
                  className={`text-current ${
                    currentPath === item.href ? 'text-blue-500' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </Badge>
            ) : (
              <Link
                size="lg"
                className={`text-current ${
                  currentPath === item.href ? 'text-blue-500' : ''
                }`}
              >
                {item.label}
              </Link>
            )}
          </NextLink>
        </NavbarMenuItem>
      ))}
    </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
