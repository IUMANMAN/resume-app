import { Mail, Phone, MapPin, Globe, Github, Linkedin, User } from 'lucide-react'

export default function PersonalInfo({ data, meta }) {
  if (!data) return null
  const {
    name, email, phone, address, location, website, github, linkedin, title
  } = data
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        {meta?.showIcon !== false && (
          <User className="h-5 w-5" style={{ color: meta?.iconColor }} />
        )}
        <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>{name || '个人信息'}</h2>
      </div>
      {title && <p className="mb-3 text-sm" style={{ fontSize: meta?.h2FontSize, color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{title}</p>}
      <div className="flex flex-wrap gap-3 text-sm" style={{ color: meta?.h2FontColor, justifyContent: meta?.h2Align === 'center' ? 'center' : 'flex-start', textAlign: meta?.h2Align }}>
        {email && (<div className="inline-flex items-center gap-1"><Mail className="h-4 w-4" />{email}</div>)}
        {phone && (<div className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{phone}</div>)}
        {(address || location) && (<div className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{address || location}</div>)}
        {website && (<div className="inline-flex items-center gap-1"><Globe className="h-4 w-4" />{website}</div>)}
        {github && (<div className="inline-flex items-center gap-1"><Github className="h-4 w-4" />{github}</div>)}
        {linkedin && (<div className="inline-flex items-center gap-1"><Linkedin className="h-4 w-4" />{linkedin}</div>)}
      </div>
    </section>
  )
}