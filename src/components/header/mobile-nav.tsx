"use client"

import { Menu } from "@/assets/icons"
import React from "react"
import { Button, Sheet, SheetContent, SheetTrigger } from "../ui"
import { Nav } from "./nav"


export const MobileNav = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-40 pt-12">
          <Nav direction="column" onNavItemClick={handleClose} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
