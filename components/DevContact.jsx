import React from 'react'
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react"
import { Button } from '@nextui-org/react'
import { GithubIcon, LinkedinIcon, Logo, MailIcon, PhoneIcon, WhatsAppIcon } from './icons'
import { useTheme } from 'next-themes'
export const DevContact = () => {


  const {theme}= useTheme()
  return (
    <div className='flex mr-2'>
    <Dropdown className='flex ml-2' backdrop='blur'>
    <DropdownTrigger>
      <Button 
        variant="shadow"
        color="primary"

        className='font-semibold text-white'
         
      >
        Contactar al desarrollador
      </Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="Static Actions">
      <DropdownItem key="Github" target='_blank' startContent={<GithubIcon/>} href='https://github.com/Benjaminoyarzun'>Github</DropdownItem>
      <DropdownItem key="Gmail" target='_blank' startContent={<MailIcon/>} href='mailto:benjaminoyarzuninfo@gmail.com'>Gmail</DropdownItem>
      <DropdownItem key="phone" target='_blank' startContent={<WhatsAppIcon/>} href='https://api.whatsapp.com/send?phone=3541658996&text=Buenas tardes, quisiera consultarte por una web' >Whatsapp</DropdownItem>
      <DropdownItem key="LinkedIn" target='_blank' startContent={<LinkedinIcon/>} href='https://www.linkedin.com/in/benjamin-oyarzun-106169285'>LinkedIn </DropdownItem>
    </DropdownMenu>
  </Dropdown>
  </div>
  )
}

