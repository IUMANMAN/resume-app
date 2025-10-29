import { Mail, Phone, MapPin, Globe, Github, Linkedin, User } from 'lucide-react'

export default function PersonalInfo({ data, meta }) {
  if (!data) return null
  const {
    name, email, phone, address, location, website, github, linkedin, title
  } = data
  const photoUrl = (meta?.photoUrl || data?.photoUrl || data?.photo)
  const showPhoto = !!photoUrl && (meta?.showPhoto !== false)
  const photoSize = meta?.photoSize || '72px'
  const photoOnRight = (meta?.photoPosition === 'right')
  return (
    <section className="animate-fade-in">
      <div className={`flex items-start gap-3 ${photoOnRight ? 'flex-row-reverse' : ''}`}>
        {showPhoto && (
          <img
            src={photoUrl}
            alt={name ? `${name} photo` : 'Profile photo'}
            style={{ width: photoSize, height: photoSize, objectFit: 'cover' }}
            className="rounded-full flex-none border"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {meta?.showIcon !== false && (
              <User className="h-5 w-5" style={{ color: meta?.iconColor }} />
            )}
            <h2 className="font-semibold tracking-tight" style={{ fontSize: meta?.titleFontSize ?? meta?.h1FontSize, color: meta?.titleColor ?? meta?.fontColor, textAlign: meta?.titleAlign }}>{name || 'Personal Info'}</h2>
          </div>
          {title && <p className="mb-1.5 text-sm" style={{ fontSize: meta?.h2FontSize, color: meta?.h2FontColor, lineHeight: meta?.lineHeight, textAlign: meta?.h2Align }}>{title}</p>}
          <div className="flex flex-wrap gap-1.5 text-sm leading-5" style={{ color: meta?.h2FontColor, justifyContent: meta?.h2Align === 'center' ? 'center' : 'flex-start', textAlign: meta?.h2Align }}>
            {email && (<div className="inline-flex items-center gap-1"><Mail className="h-4 w-4" />{email}</div>)}
            {phone && (<div className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{phone}</div>)}
            {(address || location) && (<div className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{address || location}</div>)}
            {website && (<div className="inline-flex items-center gap-1"><Globe className="h-4 w-4" />{website}</div>)}
            {github && (<div className="inline-flex items-center gap-1"><Github className="h-4 w-4" />{github}</div>)}
            {linkedin && (<div className="inline-flex items-center gap-1"><Linkedin className="h-4 w-4" />{linkedin}</div>)}
          </div>
        </div>
      </div>
    </section>
  )
}