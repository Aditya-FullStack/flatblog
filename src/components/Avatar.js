import { initials } from '@/lib/markdown';

export default function Avatar({ name = '', src = null, size = 'md', className = '' }) {
  const sizeClass = size === 'sm' ? 'avatar--sm' : size === 'lg' ? 'avatar--lg' : '';
  const classes = `avatar ${sizeClass} ${className}`.trim();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={classes} referrerPolicy="no-referrer" />;
  }
  return (
    <span className={`${classes} avatar--fallback`} title={name}>
      {initials(name || '?')}
    </span>
  );
}
