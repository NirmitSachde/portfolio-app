import React from 'react';
import { Mail, Phone, Linkedin, Github, Instagram, Twitter } from 'lucide-react';
import { usePortfolio } from '../../App';

const Footer = () => {
  const { data } = usePortfolio();
  const contact = data.contact || {};

  const contactItems = [
    { key: 'personalEmail', icon: Mail, label: 'Email', value: contact.personalEmail?.value, visible: contact.personalEmail?.visible, href: contact.personalEmail?.value ? `mailto:${contact.personalEmail.value}` : null },
    { key: 'orgEmail', icon: Mail, label: 'Org Email', value: contact.orgEmail?.value, visible: contact.orgEmail?.visible, href: contact.orgEmail?.value ? `mailto:${contact.orgEmail.value}` : null },
    { key: 'phone', icon: Phone, label: 'Phone', value: contact.phone?.value, visible: contact.phone?.visible, href: contact.phone?.value ? `tel:${contact.phone.value}` : null },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', value: contact.linkedin?.value, visible: contact.linkedin?.visible, href: contact.linkedin?.value },
    { key: 'github', icon: Github, label: 'GitHub', value: contact.github?.value, visible: contact.github?.visible, href: contact.github?.value },
    { key: 'instagram', icon: Instagram, label: 'Instagram', value: contact.instagram?.value, visible: contact.instagram?.visible, href: contact.instagram?.value },
    { key: 'twitter', icon: Twitter, label: 'X', value: contact.twitter?.value, visible: contact.twitter?.visible, href: contact.twitter?.value },
  ];

  const visibleContacts = contactItems.filter(item => item.visible && item.value);
  if (visibleContacts.length === 0) return null;

  return (
    <footer style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--border)' }} className="py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="section-tag mb-6">get_in_touch</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }} className="mb-8">
          Let us connect
        </h3>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {visibleContacts.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.key}
                href={item.href}
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="glow-card flex items-center gap-2 px-4 py-2.5 transition-all duration-200"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', borderRadius: '8px' }}
              >
                <Icon size={15} style={{ color: 'var(--accent)' }} />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="data-line mb-6"></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
          {new Date().getFullYear()} {data.hero?.name || 'Portfolio'} // Built with React + Tailwind
        </p>
      </div>
    </footer>
  );
};

export default Footer;
