import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'
import React from 'react'
import 'normalize.css'
import '~/styles/root.css'
import RootErrorBoundary from '~/components/RootErrorBoundary'

export function links() {
  return [
    { rel: 'stylesheet', href: '/antd-mobile-styles' }, 
  ]
}


export const ErrorBoundary = RootErrorBoundary

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <script src="https://webapi.amap.com/loader.js"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
