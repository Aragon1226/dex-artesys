import * as React from 'react'
import { render } from '@react-email/render'
import { SignupEmail } from '@/lib/email-templates/signup'
import { ReauthenticationEmail } from '@/lib/email-templates/reauthentication'
import { TEMPLATES } from '@/lib/email-templates/registry'

const out: Record<string,string> = {}
out['signup'] = await render(React.createElement(SignupEmail as any, {siteName:'Artesys', siteUrl:'https://dex.xn--artsys-dva.com', recipient:'user@example.test', confirmationUrl:'https://dex.xn--artsys-dva.com/verify?t=abc'}))
out['reauth'] = await render(React.createElement(ReauthenticationEmail as any, {token:'482913'}))
for (const [k,t] of Object.entries(TEMPLATES)) {
  out[k] = await render(React.createElement(t.component as any, (t.previewData ?? {}) as any))
}
for (const [k,html] of Object.entries(out)) await Bun.write(`/tmp/emailprev/${k}.html`, html)
console.log(Object.keys(out).join(' '))
