import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.875rem',
        color: '#6E5D53',
        margin: '1rem 0 1.5rem',
        flexWrap: 'wrap',
      }}
    >
      <Link href="/" style={{ color: '#8C5E3C', textDecoration: 'none', fontWeight: 500 }}>
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span style={{ color: '#B5A293' }} aria-hidden="true">
              /
            </span>
            {item.href && !isLast ? (
              <Link href={item.href} style={{ color: '#8C5E3C', textDecoration: 'none', fontWeight: 500 }}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: '#2C1810', fontWeight: 600 }}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
